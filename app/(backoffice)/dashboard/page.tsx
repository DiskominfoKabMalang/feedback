import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import {
  Calendar,
  Mail,
  MessageSquare,
  Star,
  User as UserIcon,
  Briefcase,
} from 'lucide-react'
import Link from 'next/link'
import { db } from '@/db'
import { projects, feedbacks } from '@/db/schema'
import { eq, count, sql, gte, and } from 'drizzle-orm'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const user = session.user

  // Get total projects count
  const projectsCount = await db
    .select({ count: count() })
    .from(projects)
    .where(eq(projects.ownerId, session.user.id))

  const totalProjects = projectsCount[0]?.count || 0

  // Get total feedbacks count
  const feedbacksCountResult = await db
    .select({
      total: count(),
      avgRating: sql<number>`COALESCE(AVG(${feedbacks.rating}), 0)`,
    })
    .from(feedbacks)
    .innerJoin(projects, eq(feedbacks.projectId, projects.id))
    .where(eq(projects.ownerId, session.user.id))

  const totalFeedbacks = feedbacksCountResult[0]?.total || 0
  const avgRatingRaw = feedbacksCountResult[0]?.avgRating
  const avgRating = avgRatingRaw != null ? Number(avgRatingRaw) : 0

  // Get active projects (projects with feedback in last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const activeProjectsResult = await db
    .select({
      count: sql<number>`COUNT(DISTINCT ${projects.id})`,
    })
    .from(projects)
    .innerJoin(feedbacks, eq(projects.id, feedbacks.projectId))
    .where(
      and(
        eq(projects.ownerId, session.user.id),
        gte(feedbacks.createdAt, thirtyDaysAgo)
      )
    )

  const activeProjects = activeProjectsResult[0]?.count || 0

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.name || user.email?.split('@')[0] || 'User'}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm font-medium">
              Total Projects
            </p>
            <Briefcase className="text-muted-foreground h-5 w-5" />
          </div>
          <p className="mt-3 text-3xl font-bold tabular-nums">
            {totalProjects}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            {activeProjects} active in last 30 days
          </p>
        </div>

        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm font-medium">
              Total Feedbacks
            </p>
            <MessageSquare className="text-muted-foreground h-5 w-5" />
          </div>
          <p className="mt-3 text-3xl font-bold tabular-nums">
            {totalFeedbacks}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            Across all your projects
          </p>
        </div>

        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm font-medium">
              Average Rating
            </p>
            <Star className="text-muted-foreground h-5 w-5" />
          </div>
          <p className="mt-3 text-3xl font-bold tabular-nums">
            {avgRating > 0 ? avgRating.toFixed(1) : '-'}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            {avgRating > 0 ? 'out of 5.0' : 'No ratings yet'}
          </p>
        </div>

        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm font-medium">
              Active Projects
            </p>
            <Briefcase className="text-muted-foreground h-5 w-5" />
          </div>
          <p className="mt-3 text-3xl font-bold tabular-nums">
            {activeProjects}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            With feedback in last 30 days
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Account Info Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your profile details and account settings
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Name</span>
                </div>
                <p className="text-base">{user.name || 'Not set'}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <p className="text-base">{user.email}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">User ID</span>
                </div>
                <p
                  className="truncate text-base font-mono text-xs"
                  title={user.id}
                >
                  {user.id.slice(0, 8)}...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-2 space-y-2">
              <Link
                href="/projects"
                className="bg-background hover:bg-muted/50 flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors"
              >
                <Briefcase className="text-primary h-5 w-5" />
                <span className="text-sm font-medium">My Projects</span>
              </Link>
              <Link
                href="/profile"
                className="bg-background hover:bg-muted/50 flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors"
              >
                <UserIcon className="text-primary h-5 w-5" />
                <span className="text-sm font-medium">Profile Settings</span>
              </Link>
              <Link
                href="/users"
                className="bg-background hover:bg-muted/50 flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors"
              >
                <UserIcon className="text-primary h-5 w-5" />
                <span className="text-sm font-medium">User Management</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
