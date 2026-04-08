'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, MessageSquare, Clock, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { FeedbackAnswers, FeedbackMeta } from '@/db/schema'

interface Feedback {
  id: string
  rating: number
  status: string
  answers: FeedbackAnswers | null
  meta: FeedbackMeta | null
  createdAt: Date
}

interface OverviewRecentFeedbacksProps {
  initialFeedbacks: Feedback[]
  projectId: string
}

export function OverviewRecentFeedbacks({
  initialFeedbacks,
  projectId,
}: OverviewRecentFeedbacksProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks)
  const [loading, setLoading] = useState(false)

  // Refresh feedbacks
  const refresh = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/dashboard/projects/${projectId}/feedbacks?limit=5`
      )
      const data = await res.json()
      setFeedbacks(data.data || [])
    } catch {
      // Ignore error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setFeedbacks(initialFeedbacks)
  }, [initialFeedbacks])

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-4 p-4 rounded-xl border bg-card"
          >
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (feedbacks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <MessageSquare className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground mb-2">Belum ada feedback</p>
        <p className="text-sm text-muted-foreground">
          Bagikan widget link untuk mulai mengumpulkan feedback!
        </p>
        <div className="mt-4">
          <Link href={`/projects/${projectId}/install`}>
            <Button variant="outline" size="sm">
              Dapatkan kode widget
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {feedbacks.map((feedback, index) => {
        const isPositive = feedback.rating >= 4
        const isNegative = feedback.rating <= 2

        return (
          <div
            key={feedback.id}
            className={cn(
              'group flex items-start gap-4 p-4 rounded-xl border transition-all duration-200',
              'hover:shadow-md hover:border-primary/50',
              isPositive &&
                'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30',
              isNegative &&
                'bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30'
            )}
          >
            {/* Rating */}
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                isPositive &&
                  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                isNegative &&
                  'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
                !isPositive &&
                  !isNegative &&
                  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              )}
            >
              <Star className="h-5 w-5 fill-current" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {feedback.answers?.comment && (
                <p className="text-sm leading-relaxed mb-2 line-clamp-2">
                  {feedback.answers.comment}
                </p>
              )}
              {feedback.answers?.tags && feedback.answers.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {feedback.answers.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs font-medium px-2 py-0.5 rounded-md"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(feedback.createdAt), {
                    addSuffix: true,
                  })}
                </span>
                {feedback.meta?.page?.url && (
                  <span
                    className="flex items-center gap-1 truncate max-w-[150px]"
                    title={feedback.meta.page.url}
                  >
                    <User className="h-3 w-3 shrink-0" />
                    {(() => {
                      try {
                        return new URL(feedback.meta.page.url).hostname
                      } catch {
                        return feedback.meta.page.url
                      }
                    })()}
                  </span>
                )}
                <Badge
                  variant={feedback.status === 'new' ? 'default' : 'secondary'}
                  className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded-md',
                    feedback.status === 'new' &&
                      'bg-primary text-primary-foreground'
                  )}
                >
                  {feedback.status === 'new' ? 'Baru' : feedback.status}
                </Badge>
              </div>
            </div>
          </div>
        )
      })}
      <div className="pt-4">
        <Link href={`/projects/${projectId}/inbox`}>
          <Button
            variant="outline"
            size="sm"
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Lihat Semua Feedback
          </Button>
        </Link>
      </div>
    </div>
  )
}
