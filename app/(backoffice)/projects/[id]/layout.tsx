import { Suspense } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ProjectHeader } from './project-header'
import { ProjectTabs } from './project-tabs'

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="space-y-6">
      {/* Header - Suspense boundary allows content to load while fetching */}
      <Suspense fallback={<ProjectHeaderSkeleton />}>
        <ProjectHeader projectId={id} />
      </Suspense>

      {/* Tabs Navigation - Enhanced with icons and descriptions */}
      <ProjectTabs projectId={id} />

      {/* Page Content */}
      <Suspense fallback={<PageContentSkeleton />}>{children}</Suspense>
    </div>
  )
}

function ProjectHeaderSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/projects"
          className="text-muted-foreground hover:underline"
        >
          Projects
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
      </div>
      <div className="h-8 w-64 bg-muted animate-pulse rounded" />
      <div className="h-5 w-24 bg-muted animate-pulse rounded" />
    </div>
  )
}

function PageContentSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-32 bg-muted/50 rounded-xl animate-pulse" />
      <div className="h-64 bg-muted/50 rounded-xl animate-pulse" />
    </div>
  )
}
