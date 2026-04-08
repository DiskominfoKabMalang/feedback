import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { BarChart3 } from 'lucide-react'
import { ProjectAnalyticsClient } from './project-analytics-client'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ range?: string }>
}

export default async function ProjectAnalyticsPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { range = '30d' } = await searchParams
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Analisis Demografi
        </h2>
        <p className="text-muted-foreground">
          Insight demografi dan korelasi dengan rating
        </p>
      </div>

      {/* Analytics Content */}
      <ProjectAnalyticsClient projectId={id} range={range} />
    </div>
  )
}
