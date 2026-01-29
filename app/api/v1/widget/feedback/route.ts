import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { feedbacks, projects } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

/**
 * POST /api/v1/widget/feedback
 *
 * Public API endpoint for submitting feedback.
 *
 * Request Body (New Structure):
 * - project_id (required): UUID of the project
 * - rating (required): Integer 1-5 (or based on scale)
 * - answers (optional): { tags, comment, email, user_info }
 * - meta (optional): { page, tech, performance, session_id, is_returning_visitor }
 *
 * Response: Success message
 */

// Validation schema using Zod - Updated for new structure
const FeedbackSchema = z.object({
  project_id: z.string().uuid('Invalid project_id format'),
  rating: z.number().int().min(1).max(10),
  answers: z
    .object({
      tags: z.array(z.string()).optional(),
      comment: z.string().optional(),
      email: z.string().email().optional(),
      user_info: z.record(z.string(), z.string()).optional(),
    })
    .optional(),
  meta: z
    .object({
      // Page context
      page: z
        .object({
          url: z.string().optional(),
          title: z.string().optional(),
          referrer: z.string().optional(),
        })
        .optional(),
      // Technical fingerprint
      tech: z
        .object({
          device_type: z.enum(['mobile', 'tablet', 'desktop']).optional(),
          os: z.string().optional(),
          browser: z.string().optional(),
          screen_res: z.string().optional(),
          connection: z.string().optional(),
          user_agent: z.string().optional(),
        })
        .optional(),
      // Performance metrics (Web Vitals)
      performance: z
        .object({
          lcp: z.number().optional(),
          cls: z.number().optional(),
          fid: z.number().optional(),
          load_time: z.number().optional(),
        })
        .optional(),
      // Session tracking
      session_id: z.string().optional(),
      is_returning_visitor: z.boolean().optional(),
      // Legacy support
      url: z.string().optional(),
      os: z.string().optional(),
      browser: z.string().optional(),
      geo: z.string().optional(),
      device_type: z.enum(['mobile', 'tablet', 'desktop']).optional(),
      user_agent: z.string().optional(),
    })
    .optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate request body
    const validationResult = FeedbackSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Verify project exists
    const projectResult = await db
      .select({ id: projects.id, apiKey: projects.apiKey })
      .from(projects)
      .where(eq(projects.id, data.project_id))
      .limit(1)

    if (projectResult.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Insert feedback into database with new structure
    await db.insert(feedbacks).values({
      projectId: data.project_id,
      rating: data.rating,
      answers: {
        tags: data.answers?.tags,
        comment: data.answers?.comment,
        email: data.answers?.email,
        user_info: data.answers?.user_info,
      },
      meta: {
        // New structured meta
        page: data.meta?.page,
        tech: data.meta?.tech,
        performance: data.meta?.performance,
        session_id: data.meta?.session_id,
        is_returning_visitor: data.meta?.is_returning_visitor,
        // Legacy support
        url: data.meta?.url || data.meta?.page?.url,
        os: data.meta?.os || data.meta?.tech?.os,
        browser: data.meta?.browser || data.meta?.tech?.browser,
        device_type: data.meta?.device_type || data.meta?.tech?.device_type,
        user_agent: data.meta?.user_agent || data.meta?.tech?.user_agent,
      },
    })

    // TODO: Trigger webhook asynchronously (implement in Phase 2)

    return NextResponse.json(
      {
        success: true,
        message: 'Feedback received',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Feedback Submission API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
