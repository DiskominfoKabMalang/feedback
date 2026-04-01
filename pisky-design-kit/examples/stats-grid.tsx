/**
 * Pisky Design System - Stats Grid Example
 *
 * Grid untuk menampilkan statistik/key metrics.
 *
 * Dependencies:
 * pnpm add lucide-react
 *
 * Usage:
 * Copy ke komponen Anda dan modifikasi datanya.
 */

import { Card, CardContent } from '@/components/ui/card'
import { type LucideIcon } from 'lucide-react'

interface StatCard {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: string
    positive: boolean
  }
}

interface StatsGridProps {
  stats: StatCard[]
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm font-medium">
                  {stat.title}
                </p>
                <Icon className="text-muted-foreground h-5 w-5" />
              </div>
              <p className="mt-3 text-3xl font-bold tabular-nums">
                {stat.value}
              </p>
              {stat.description && (
                <p className="text-muted-foreground mt-1 text-xs">
                  {stat.description}
                </p>
              )}
              {stat.trend && (
                <p
                  className={`mt-1 text-xs ${
                    stat.trend.positive ? 'text-success' : 'text-error'
                  }`}
                >
                  {stat.trend.positive ? '+' : ''}
                  {stat.trend.value}
                </p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

/* ============================================
   USAGE EXAMPLE
   ============================================ */
/*
import { StatsGrid } from '@/components/examples/stats-grid'
import { Users, MessageSquare, Star, Briefcase } from 'lucide-react'

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      description: 'Active users',
      icon: Users,
      trend: { value: '12%', positive: true }
    },
    {
      title: 'Messages',
      value: '5,678',
      description: 'This month',
      icon: MessageSquare,
      trend: { value: '8%', positive: true }
    },
    {
      title: 'Rating',
      value: '4.8',
      description: 'Average rating',
      icon: Star,
    },
    {
      title: 'Projects',
      value: '12',
      description: 'Active projects',
      icon: Briefcase,
      trend: { value: '2%', positive: false }
    },
  ]

  return (
    <div className="space-y-6">
      <StatsGrid stats={stats} />
      {/* Rest of dashboard *\/}
    </div>
  )
}
*/
