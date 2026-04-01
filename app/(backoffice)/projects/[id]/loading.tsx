import { Skeleton } from '@/components/ui/skeleton'
import { ChevronRight } from 'lucide-react'

export default function ProjectLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Skeleton className="h-4 w-20" />
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-24" />
      </div>

      {/* Tabs Skeleton */}
      <div className="border-b">
        <nav className="flex gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-11 w-24" />
          ))}
        </nav>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 border rounded-xl space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
        <div className="p-6 border rounded-xl space-y-4">
          <Skeleton className="h-5 w-32" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
