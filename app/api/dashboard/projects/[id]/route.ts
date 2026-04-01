import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { projects } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { requireAuth } from '@/lib/api/auth'
import { z } from 'zod'

/**
 * GET /api/dashboard/projects/[id]
 *
 * Get a single project by ID.
 * Only returns projects owned by the authenticated user.
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
    const project = await db
      .select()
      .from(projects)
      .where(
        and(eq(projects.id, projectId), eq(projects.ownerId, session.user.id))
      )
      .limit(1)

    if (project.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({
      data: project[0],
    })
  } catch (error) {
    console.error('[Project Detail API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/dashboard/projects/[id]
 *
 * Update a project.
 * Only allows updating projects owned by the authenticated user.
 *
 * Request Body:
 * - name (optional)
 * - domainWhitelist (optional)
 * - widgetConfig (optional) - passed through without validation
 * - settings (optional)
 * - tier (optional - for admin only)
 *
 * Protected: Requires authentication
 */
const UpdateProjectSchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    domainWhitelist: z.array(z.string()).min(1).optional(),
    settings: z
      .object({
        remove_branding: z.boolean().optional(),
        retention_days: z.number().int().positive().optional(),
      })
      .optional(),
  })
  .passthrough()

export async function PATCH(
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
    const body = await request.json()

    // Validate request body
    const validationResult = UpdateProjectSchema.safeParse(body)
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

    // Update project
    const updated = await db
      .update(projects)
      .set(data)
      .where(eq(projects.id, projectId))
      .returning()

    return NextResponse.json({
      data: updated[0],
    })
  } catch (error) {
    console.error('[Update Project API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/dashboard/projects/[id]
 *
 * Delete a project.
 * Only allows deleting projects owned by the authenticated user.
 *
 * Protected: Requires authentication
 */
export async function DELETE(
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

    // Delete project (cascade will delete related feedbacks and webhooks)
    await db.delete(projects).where(eq(projects.id, projectId))

    return NextResponse.json({
      success: true,
      message: 'Project deleted',
    })
  } catch (error) {
    console.error('[Delete Project API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
