'use client'

import { useEffect, useState, useCallback } from 'react'
import { MessageSquare, Star, TrendingUp, Users, BarChart3 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface OverviewStatsProps {
  projectId: string
  projectName?: string
}

interface StatsData {
  summary: {
    total_feedback: number
    average_rating: number
    nps_score: number
  }
  chart_data?: Array<{
    date: string
    avg_rating: number
    count: number
  }>
}

export function OverviewStats({ projectId, projectName }: OverviewStatsProps) {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/dashboard/projects/${projectId}/stats?range=30d`
      )
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-9 w-20" />
          </div>
        ))}
      </div>
    )
  }

  const totalFeedback = stats?.summary.total_feedback || 0
  const avgRating = stats?.summary.average_rating || 0
  const npsScore = stats?.summary.nps_score || 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Feedback - Blue primary */}
      <div className="bg-card rounded-xl border p-6 group hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground text-sm font-medium">
            Total Feedback
          </span>
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight tabular-nums">
            {totalFeedback.toLocaleString()}
          </span>
          <span className="text-muted-foreground text-xs">feedback</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${Math.min(totalFeedback / 10, 100)}%` }}
            />
          </div>
          <span className="text-muted-foreground text-xs">
            30 hari terakhir
          </span>
        </div>
      </div>

      {/* Avg Rating - Gold/Yellow accent */}
      <div className="bg-card rounded-xl border p-6 group hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground text-sm font-medium">
            Rating Rata-rata
          </span>
          <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center group-hover:bg-amber-200 dark:group-hover:bg-amber-900 transition-colors">
            <Star className="h-5 w-5 text-amber-600 dark:text-amber-500 fill-amber-600 dark:fill-amber-500" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight tabular-nums">
            {avgRating > 0 ? avgRating.toFixed(1) : '-'}
          </span>
          <span className="text-muted-foreground text-xs">dari 5.0</span>
        </div>
        <div className="mt-3 flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <div
              key={star}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-all duration-300',
                star <= Math.round(avgRating) ? 'bg-amber-500' : 'bg-muted'
              )}
            />
          ))}
        </div>
      </div>

      {/* NPS Score - Based on score */}
      <div
        className={cn(
          'bg-card rounded-xl border p-6 group hover:shadow-md transition-shadow',
          npsScore >= 70 && 'border-emerald-200 dark:border-emerald-900',
          npsScore >= 50 &&
            npsScore < 70 &&
            'border-sky-200 dark:border-sky-900',
          npsScore >= 0 &&
            npsScore < 50 &&
            'border-amber-200 dark:border-amber-900',
          npsScore < 0 && 'border-rose-200 dark:border-rose-900'
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground text-sm font-medium">
            Skor NPS
          </span>
          <div
            className={cn(
              'h-10 w-10 rounded-xl flex items-center justify-center group-hover:opacity-80 transition-opacity',
              npsScore >= 70 && 'bg-emerald-100 dark:bg-emerald-950',
              npsScore >= 50 && npsScore < 70 && 'bg-sky-100 dark:bg-sky-950',
              npsScore >= 0 &&
                npsScore < 50 &&
                'bg-amber-100 dark:bg-amber-950',
              npsScore < 0 && 'bg-rose-100 dark:bg-rose-950'
            )}
          >
            <TrendingUp
              className={cn(
                'h-5 w-5',
                npsScore >= 70 && 'text-emerald-600 dark:text-emerald-500',
                npsScore >= 50 &&
                  npsScore < 70 &&
                  'text-sky-600 dark:text-sky-500',
                npsScore >= 0 &&
                  npsScore < 50 &&
                  'text-amber-600 dark:text-amber-500',
                npsScore < 0 && 'text-rose-600 dark:text-rose-500'
              )}
            />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight tabular-nums">
            {npsScore > 0 ? '+' : ''}
            {npsScore}
          </span>
          <span
            className={cn(
              'text-xs font-medium',
              npsScore >= 70 && 'text-emerald-600 dark:text-emerald-500',
              npsScore >= 50 &&
                npsScore < 70 &&
                'text-sky-600 dark:text-sky-500',
              npsScore >= 0 &&
                npsScore < 50 &&
                'text-amber-600 dark:text-amber-500',
              npsScore < 0 && 'text-rose-600 dark:text-rose-500'
            )}
          >
            {getNpsCategory(npsScore)}
          </span>
        </div>
        <div className="mt-3">
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                npsScore >= 70 && 'bg-emerald-500',
                npsScore >= 50 && npsScore < 70 && 'bg-sky-500',
                npsScore >= 0 && npsScore < 50 && 'bg-amber-500',
                npsScore < 0 && 'bg-rose-500'
              )}
              style={{ width: `${Math.min(Math.abs(npsScore) / 1.5, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Feedback Velocity - Feedbacks per day */}
      <div className="bg-card rounded-xl border p-6 group hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground text-sm font-medium">
            Rata-rata per Hari
          </span>
          <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900 transition-colors">
            <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-500" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight tabular-nums">
            {(() => {
              // Calculate average feedbacks per day from chart data
              const daysWithData = stats?.chart_data?.length || 0
              if (daysWithData === 0) return '0'
              const totalFromChart = stats?.chart_data?.reduce((sum, day) => sum + day.count, 0) || 0
              const velocity = totalFromChart / daysWithData
              return velocity.toFixed(1)
            })()}
          </span>
          <span className="text-muted-foreground text-xs">feedback/hari</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-muted-foreground text-xs">
            {(() => {
              // Calculate trend based on last 7 days vs previous days
              const chartData = stats?.chart_data || []
              if (chartData.length < 14) return 'Data belum cukup'

              const last7Days = chartData.slice(-7).reduce((sum, day) => sum + day.count, 0)
              const prev7Days = chartData.slice(-14, -7).reduce((sum, day) => sum + day.count, 0)
              const trend = prev7Days > 0 ? ((last7Days - prev7Days) / prev7Days) * 100 : 0

              if (trend > 10) return `↑ ${trend.toFixed(0)}% dari minggu lalu`
              if (trend < -10) return `↓ ${Math.abs(trend).toFixed(0)}% dari minggu lalu`
              return 'Stabil dari minggu lalu'
            })()}
          </span>
        </div>
        <div className="mt-2">
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-purple-500 transition-all duration-500"
              style={{
                width: `${Math.min(
                  ((stats?.chart_data?.length || 0) / 30) * 100,
                  100
                )}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function getNpsCategory(score: number): string {
  if (score >= 70) return 'Sangat Baik'
  if (score >= 50) return 'Baik'
  if (score >= 20) return 'Cukup'
  if (score >= 0) return 'Kurang'
  return 'Sangat Kurang'
}
