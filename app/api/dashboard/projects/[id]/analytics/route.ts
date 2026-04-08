import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { projects, feedbacks } from '@/db/schema'
import { eq, and, sql, gte, or } from 'drizzle-orm'
import { requireAuth } from '@/lib/api/auth'

/**
 * GET /api/dashboard/projects/[id]/analytics
 *
 * Get demographic and analytics data for a project.
 *
 * Query Params:
 * - range: 7d, 30d, this_month (default: 30d)
 * - field: Specific demographic field to analyze (optional, returns all if not specified)
 * - filters: JSON string of filters to apply (e.g., {"gender": "Laki-laki", "age_group": "18-25"})
 * - breakdown: Field to breakdown by (for cross-tabulation)
 *
 * Returns:
 * - demographics: Distribution of each demographic field
 * - trends: Daily breakdown of ratings with demographic info
 * - correlations: Rating vs demographic correlations
 * - segments: Multi-dimensional segment analysis
 *
 * Protected: Requires authentication
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth()

  if (authResult.error) {
    return authResult.error
  }

  const session = authResult.session!
  const { id: projectId } = await params

  try {
    const searchParams = request.nextUrl.searchParams
    const range = searchParams.get('range') || '30d'
    const filtersJson = searchParams.get('filters')
    const breakdown = searchParams.get('breakdown')

    // Parse filters if provided
    let filters: Record<string, string> = {}
    if (filtersJson) {
      try {
        filters = JSON.parse(filtersJson)
      } catch {
        // Invalid JSON, ignore
      }
    }

    // Verify ownership
    const existingProject = await db
      .select({ id: projects.id })
      .from(projects)
      .where(
        and(eq(projects.id, projectId), eq(projects.ownerId, session.user.id))
      )
      .limit(1)

    if (existingProject.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Calculate date range
    const now = new Date()
    let startDate = new Date()

    switch (range) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case 'this_month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Build filter conditions for JSONB query
    const filterConditions = []
    for (const [key, value] of Object.entries(filters)) {
      filterConditions.push(
        sql`${feedbacks.answers}->'user_info'->>${key} = ${value}`
      )
    }

    // Get all feedbacks with user_info (with optional filters)
    const baseConditions = [
      eq(feedbacks.projectId, projectId),
      gte(feedbacks.createdAt, startDate),
      ...filterConditions,
    ]

    const allFeedbacks = await db
      .select({
        id: feedbacks.id,
        rating: feedbacks.rating,
        answers: feedbacks.answers,
        createdAt: feedbacks.createdAt,
      })
      .from(feedbacks)
      .where(and(...baseConditions))

    // Extract unique demographic fields from all feedbacks
    const demographicFields = new Set<string>()
    const fieldLabels = new Map<string, string>()
    const uniqueValues = new Map<string, Set<string>>()

    for (const feedback of allFeedbacks) {
      const userInfo = feedback.answers?.user_info
      if (userInfo) {
        Object.keys(userInfo).forEach((key) => {
          demographicFields.add(key)
          if (!fieldLabels.has(key)) {
            fieldLabels.set(key, formatFieldLabel(key))
          }
          // Track unique values for each field
          if (!uniqueValues.has(key)) {
            uniqueValues.set(key, new Set())
          }
          if (userInfo[key]) {
            uniqueValues.get(key)!.add(userInfo[key])
          }
        })
      }
    }

    // Aggregate demographics for each field
    const demographics: Record<
      string,
      { label: string; total: number; distribution: Array<{ value: string; count: number; percentage: number }> }
    > = {}

    for (const field of Array.from(demographicFields)) {
      const valueCounts = new Map<string, number>()
      let total = 0

      for (const feedback of allFeedbacks) {
        const value = feedback.answers?.user_info?.[field]
        if (value) {
          valueCounts.set(value, (valueCounts.get(value) || 0) + 1)
          total++
        }
      }

      const distribution = Array.from(valueCounts.entries())
        .map(([value, count]) => ({
          value,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count)

      demographics[field] = {
        label: fieldLabels.get(field) || field,
        total,
        distribution,
      }
    }

    // Calculate trends (daily breakdown by rating)
    const trends = await db
      .select({
        date: sql<string>`DATE(${feedbacks.createdAt})`,
        rating: feedbacks.rating,
        count: sql<number>`COUNT(*)`,
      })
      .from(feedbacks)
      .where(and(...baseConditions))
      .groupBy(sql`DATE(${feedbacks.createdAt})`, feedbacks.rating)
      .orderBy(sql`DATE(${feedbacks.createdAt})`, feedbacks.rating)

    // Calculate correlations (average rating by demographic value)
    const correlations: Record<
      string,
      Array<{ value: string; avg_rating: number; count: number }>
    > = {}

    for (const field of Array.from(demographicFields)) {
      // Skip the field if it's being filtered
      if (filters[field]) continue

      const ratingByValue = new Map<string, { sum: number; count: number }>()

      for (const feedback of allFeedbacks) {
        const value = feedback.answers?.user_info?.[field]
        if (value) {
          const current = ratingByValue.get(value) || { sum: 0, count: 0 }
          ratingByValue.set(value, {
            sum: current.sum + feedback.rating,
            count: current.count + 1,
          })
        }
      }

      correlations[field] = Array.from(ratingByValue.entries())
        .map(([value, data]) => ({
          value,
          avg_rating: Number((data.sum / data.count).toFixed(2)),
          count: data.count,
        }))
        .sort((a, b) => b.avg_rating - a.avg_rating)
    }

    // Cross-tabulation / segment analysis
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let segments: Record<string, any> = {}

    if (breakdown && Object.keys(filters).length > 0) {
      // Create cross-tabulation: filter values broken down by breakdown field
      const breakdownValues = uniqueValues.get(breakdown) || new Set()
      const filterField = Object.keys(filters)[0]
      const filterValue = filters[filterField]

      segments = {
        by_breakdown: {
          filter_field: formatFieldLabel(filterField),
          filter_value: filterValue,
          breakdown_field: formatFieldLabel(breakdown),
          data: Array.from(breakdownValues).map((breakdownValue) => {
            // Get ratings for feedbacks matching both filter and breakdown value
            const matchingFeedbacks = allFeedbacks.filter((f) => {
              const userInfo = f.answers?.user_info
              return (
                userInfo?.[filterField] === filterValue &&
                userInfo?.[breakdown] === breakdownValue
              )
            })

            const avgRating =
              matchingFeedbacks.length > 0
                ? matchingFeedbacks.reduce((sum, f) => sum + f.rating, 0) /
                  matchingFeedbacks.length
                : 0

            return {
              value: breakdownValue,
              count: matchingFeedbacks.length,
              avg_rating: Number(avgRating.toFixed(2)),
              distribution: [1, 2, 3, 4, 5].map((rating) => ({
                rating,
                count: matchingFeedbacks.filter((f) => f.rating === rating).length,
              })),
            }
          }).filter((d) => d.count > 0),
        },
      }
    }

    // Multi-dimensional segment analysis (all combinations of 2 fields)
    const segmentPairs: Array<{
      field1: string
      field2: string
      combinations: Array<{
        value1: string
        value2: string
        count: number
        avg_rating: number
      }>
    }> = []

    const fieldsArray = Array.from(demographicFields)
    for (let i = 0; i < fieldsArray.length; i++) {
      for (let j = i + 1; j < fieldsArray.length; j++) {
        const field1 = fieldsArray[i]
        const field2 = fieldsArray[j]
        const combinations = new Map<string, { sum: number; count: number }>()

        for (const feedback of allFeedbacks) {
          const userInfo = feedback.answers?.user_info
          const value1 = userInfo?.[field1]
          const value2 = userInfo?.[field2]

          if (value1 && value2) {
            const key = `${value1}|${value2}`
            const current = combinations.get(key) || { sum: 0, count: 0 }
            combinations.set(key, {
              sum: current.sum + feedback.rating,
              count: current.count + 1,
            })
          }
        }

        segmentPairs.push({
          field1: fieldLabels.get(field1) || field1,
          field2: fieldLabels.get(field2) || field2,
          combinations: Array.from(combinations.entries())
            .map(([key, data]) => {
              const [value1, value2] = key.split('|')
              return {
                value1,
                value2,
                count: data.count,
                avg_rating: Number((data.sum / data.count).toFixed(2)),
              }
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 10), // Top 10 combinations
        })
      }
    }

    // Summary stats
    const totalFeedbacks = allFeedbacks.length
    const withDemographics = allFeedbacks.filter(
      (f) => f.answers?.user_info && Object.keys(f.answers.user_info).length > 0
    ).length

    return NextResponse.json({
      summary: {
        total_feedbacks: totalFeedbacks,
        with_demographics: withDemographics,
        demographics_coverage: totalFeedbacks > 0
          ? Math.round((withDemographics / totalFeedbacks) * 100)
          : 0,
        fields_count: demographicFields.size,
        applied_filters: filters,
      },
      available_filters: Object.fromEntries(
        Array.from(uniqueValues.entries()).map(([field, values]) => [
          field,
          {
            label: fieldLabels.get(field) || field,
            values: Array.from(values).sort(),
          },
        ])
      ),
      demographics,
      trends: {
        by_date: trends,
      },
      correlations,
      segments,
      segment_pairs: segmentPairs,
    })
  } catch (error) {
    console.error('[Analytics API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function formatFieldLabel(key: string): string {
  const labels: Record<string, string> = {
    gender: 'Jenis Kelamin',
    age_group: 'Rentang Usia',
    job_type: 'Pekerjaan',
    education: 'Pendidikan',
    domisili: 'Domisili',
  }

  return (
    labels[key] ||
    key
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  )
}
