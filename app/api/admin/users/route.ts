import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users, userRoles, roles } from '@/db/schema'
import { eq, like, or } from 'drizzle-orm'
import { hashPassword } from '@/lib/auth/password'
import { requireServerPermission } from '@/lib/rbac/server'

// Runtime configuration: explicitly use Node.js runtime
export const runtime = 'nodejs'

/**
 * GET /api/admin/users
 * Get all users with their roles
 */
export async function GET(req: NextRequest) {
  try {
    await requireServerPermission('users.read')

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')

    let usersList
    if (search) {
      usersList = await db
        .select()
        .from(users)
        .where(
          or(
            like(users.name, `%${search}%`),
            like(users.email, `%${search}%`),
            like(users.username, `%${search}%`)
          )
        )
        .orderBy(users.createdAt)
    } else {
      usersList = await db.select().from(users).orderBy(users.createdAt)
    }

    // Fetch roles for each user
    const usersWithRoles = await Promise.all(
      usersList.map(async (user) => {
        const userRolesData = await db
          .select({
            id: roles.id,
            name: roles.name,
            description: roles.description,
            isSystem: roles.isSystem,
          })
          .from(userRoles)
          .innerJoin(roles, eq(userRoles.roleId, roles.id))
          .where(eq(userRoles.userId, user.id))

        return {
          ...user,
          roles: userRolesData,
        }
      })
    )

    return NextResponse.json({ users: usersWithRoles })
  } catch (error) {
    console.error('Get users error:', error)
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
 * POST /api/admin/users
 * Create a new user
 */
export async function POST(req: NextRequest) {
  try {
    await requireServerPermission('users.create')

    const body = await req.json()
    const { email, name, username, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Check if username is taken
    if (username) {
      const existingUsername = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1)

      if (existingUsername.length > 0) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    const newUser = await db
      .insert(users)
      .values({
        email,
        name,
        username: username || null,
        password: hashedPassword,
      })
      .returning()

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newUser[0]

    return NextResponse.json({ user: userWithoutPassword }, { status: 201 })
  } catch (error) {
    console.error('Create user error:', error)
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
