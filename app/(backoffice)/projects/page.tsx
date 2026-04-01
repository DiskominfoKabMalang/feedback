import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ProjectsTable } from '@/components/projects/projects-table'
import { CreateProjectDialog } from '@/components/projects/create-project-dialog'
import { db } from '@/db'
import { projects, feedbacks } from '@/db/schema'
import { eq, desc, inArray, sql } from 'drizzle-orm'

interface ProjectWithStats {
  id: string
  name: string
  slug: string
  tier: string
  feedbackCount: number
  avgRating: number | null
  createdAt: Date
}

export default async function ProjectsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Get projects first (fast, indexed query)
  const userProjects = await db
    .select({
      id: projects.id,
      name: projects.name,
      slug: projects.slug,
      tier: projects.tier,
      createdAt: projects.createdAt,
    })
    .from(projects)
    .where(eq(projects.ownerId, session.user.id))
    .orderBy(desc(projects.createdAt))

  // Get stats in a single query using WHERE IN (much faster than subqueries per row)
  const projectIds = userProjects.map((p) => p.id)

  let feedbackStats: Array<{
    projectId: string
    count: number
    avgRating: number | null
  }> = []

  if (projectIds.length > 0) {
    // Use Drizzle ORM for cleaner query
    const stats = await db
      .select({
        projectId: feedbacks.projectId,
        count: sql<number>`COUNT(*)`.mapWith(Number),
        avgRating: sql<number>`COALESCE(AVG(${feedbacks.rating}), 0)`.mapWith(
          Number
        ),
      })
      .from(feedbacks)
      .where(inArray(feedbacks.projectId, projectIds))
      .groupBy(feedbacks.projectId)

    feedbackStats = stats
  }

  // Create a map for quick lookup
  const statsMap = new Map(
    feedbackStats.map((s) => [
      s.projectId,
      {
        feedbackCount: s.count,
        avgRating: s.avgRating === 0 ? null : s.avgRating,
      },
    ])
  )

  // Merge projects with stats
  const projectsWithStats: ProjectWithStats[] = userProjects.map((p) => {
    const stats = statsMap.get(p.id)
    return {
      ...p,
      feedbackCount: stats?.feedbackCount || 0,
      avgRating: stats?.avgRating,
    }
  })

  // Calculate stats from the already fetched data
  const totalProjects = projectsWithStats.length
  const totalFeedback = projectsWithStats.reduce(
    (sum, p) => sum + (p.feedbackCount || 0),
    0
  )
  const projectsWithRatings = projectsWithStats.filter(
    (p) => p.avgRating !== null && p.avgRating > 0
  )
  const avgRating =
    projectsWithRatings.length > 0
      ? projectsWithRatings.reduce((sum, p) => sum + (p.avgRating || 0), 0) /
        projectsWithRatings.length
      : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your feedback projects and widgets
          </p>
        </div>
        <CreateProjectDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm font-medium">
              Total Projects
            </p>
          </div>
          <p className="mt-3 text-3xl font-bold">{totalProjects}</p>
        </div>

        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm font-medium">
              Total Feedback
            </p>
          </div>
          <p className="mt-3 text-3xl font-bold">{totalFeedback}</p>
        </div>

        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm font-medium">
              Avg Rating
            </p>
          </div>
          <p className="mt-3 text-3xl font-bold">
            {avgRating > 0 ? avgRating.toFixed(1) : '-'}
          </p>
        </div>
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Projects</CardTitle>
          <CardDescription>
            View and manage all your feedback projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectsTable projects={projectsWithStats} />
        </CardContent>
      </Card>
    </div>
  )
}
