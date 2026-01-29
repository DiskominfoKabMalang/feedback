import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { hashPassword } from '@/lib/auth/password'
import { requireServerPermission, getServerUser } from '@/lib/rbac/server'

// Runtime configuration: explicitly use Node.js runtime
export const runtime = 'nodejs'

/**
 * GET /api/admin/users/[id]
 * Get a single user by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireServerPermission('users.read')

    const { id } = await params
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1)

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user[0]

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      {
        status:
          error instanceof Error && error.message.includes('Permission denied')
            ? 403
            : 500,
      }
    )
  }
}

/**
 * PUT /api/admin/users/[id]
 * Update a user by ID
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireServerPermission('users.update')

    const { id } = await params
    const body = await req.json()
    const { email, name, username, password } = body

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    if (existingUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if email is taken by another user
    if (email && email !== existingUser[0].email) {
      const emailTaken = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)
      if (emailTaken.length > 0) {
        return NextResponse.json(
          { error: 'Email already taken' },
          { status: 400 }
        )
      }
    }

    // Check if username is taken by another user
    if (username && username !== existingUser[0].username) {
      const usernameTaken = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1)
      if (usernameTaken.length > 0) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {}
    if (email) updateData.email = email
    if (name) updateData.name = name
    if (username !== undefined) updateData.username = username || null

    // Hash new password if provided
    if (password && password.length > 0) {
      updateData.password = await hashPassword(password)
    }

    const updatedUser = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning()

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = updatedUser[0]

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      {
        status:
          error instanceof Error && error.message.includes('Permission denied')
            ? 403
            : 500,
      }
    )
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete a user by ID
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireServerPermission('users.delete')

    const { id } = await params
    const currentUser = await getServerUser()

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    if (existingUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prevent deleting the current user
    if (currentUser?.userId === id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 403 }
      )
    }

    await db.delete(users).where(eq(users.id, id))

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      {
        status:
          error instanceof Error && error.message.includes('Permission denied')
            ? 403
            : 500,
      }
    )
  }
}
