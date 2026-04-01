import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { resources } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { requireServerPermission } from '@/lib/rbac/server'

/**
 * GET /api/admin/resources/[id]
 * Get a single resource by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireServerPermission('resources.read')

    const { id } = await params

    const resource = await db
      .select()
      .from(resources)
      .where(eq(resources.id, id))
      .limit(1)

    if (resource.length === 0) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    return NextResponse.json({ resource: resource[0] })
  } catch (error) {
    console.error('Get resource error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/resources/[id]
 * Update a resource
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireServerPermission('resources.update')

    const { id } = await params
    const body = await req.json()
    const { name, identifier, description } = body

    if (!name || !identifier) {
      return NextResponse.json(
        { error: 'Name and identifier are required' },
        { status: 400 }
      )
    }

    // Validate identifier format
    const identifierRegex = /^[a-z0-9_-]+$/
    if (!identifierRegex.test(identifier)) {
      return NextResponse.json(
        {
          error:
            'Identifier must contain only lowercase letters, numbers, dashes, and underscores',
        },
        { status: 400 }
      )
    }

    // Check if resource exists
    const existingResource = await db
      .select()
      .from(resources)
      .where(eq(resources.id, id))
      .limit(1)

    if (existingResource.length === 0) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    // Check if identifier is already taken by another resource
    const duplicateIdentifier = await db
      .select()
      .from(resources)
      .where(eq(resources.identifier, identifier))
      .limit(1)

    if (duplicateIdentifier.length > 0 && duplicateIdentifier[0].id !== id) {
      return NextResponse.json(
        { error: 'Resource with this identifier already exists' },
        { status: 400 }
      )
    }

    const updatedResource = await db
      .update(resources)
      .set({
        name,
        identifier,
        description: description || null,
      })
      .where(eq(resources.id, id))
      .returning()

    return NextResponse.json({ resource: updatedResource[0] })
  } catch (error) {
    console.error('Update resource error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/resources/[id]
 * Delete a resource
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireServerPermission('resources.delete')

    const { id } = await params

    // Check if resource exists
    const existingResource = await db
      .select()
      .from(resources)
      .where(eq(resources.id, id))
      .limit(1)

    if (existingResource.length === 0) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    await db.delete(resources).where(eq(resources.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete resource error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
