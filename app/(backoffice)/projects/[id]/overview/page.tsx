import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { OverviewStats } from './overview-stats'
import { RecentFeedbacks } from '@/components/projects/recent-feedbacks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectOverviewPage({ params }: PageProps) {
  const { id } = await params
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards - Single component that fetches once */}
      <OverviewStats projectId={id} />

      {/* Recent Feedback */}
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
          <RecentFeedbacks projectId={id} limit={5} />
        </CardContent>
      </Card>
    </div>
  )
}
