import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { OverviewStats } from './overview-stats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import { db } from '@/db'
import { projects, feedbacks, type FeedbackAnswers, type FeedbackMeta } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { OverviewRecentFeedbacks } from './overview-recent-feedbacks'

type RecentFeedback = {
  id: string
  rating: number
  status: string
  answers: FeedbackAnswers | null
  meta: FeedbackMeta | null
  createdAt: Date
}

interface PageProps {
  params: Promise<{ id: string }>
}

async function getProjectStats(
  projectId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any
): Promise<
  | {
      project: { id: string; name: string }
      recentFeedbacks: RecentFeedback[]
    }
  | null
> {
  // Verify ownership first
  const existingProject = await db
    .select({ id: projects.id, name: projects.name })
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1)

  if (existingProject.length === 0) {
    return null
  }

  // Get recent feedbacks
  const recentFeedbacks = await db
    .select({
      id: feedbacks.id,
      rating: feedbacks.rating,
      status: feedbacks.status,
      answers: feedbacks.answers,
      meta: feedbacks.meta,
      createdAt: feedbacks.createdAt,
    })
    .from(feedbacks)
    .where(eq(feedbacks.projectId, projectId))
    .orderBy(desc(feedbacks.createdAt))
    .limit(5)

  return {
    project: existingProject[0],
    recentFeedbacks: recentFeedbacks as RecentFeedback[],
  }
}

export default async function ProjectOverviewPage({ params }: PageProps) {
  const { id } = await params
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const data = await getProjectStats(id, session)

  if (!data) {
    redirect('/projects')
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards - Server-side data passed to client */}
      <OverviewStats projectId={id} projectName={data.project.name} />

      {/* Recent Feedback - Data passed from server */}
      <Card className="border-muted/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Feedback Terbaru</CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                Lihat apa yang pengguna katakan
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <OverviewRecentFeedbacks initialFeedbacks={data.recentFeedbacks} projectId={id} />
        </CardContent>
      </Card>
    </div>
  )
}
