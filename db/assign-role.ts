import 'dotenv/config'
import { db } from '@/db'
import { userRoles, roles } from '@/db/schema'
import { eq } from 'drizzle-orm'

async function assignSuperAdminRole() {
  // Get Super Admin role
  const superAdminRole = await db
    .select()
    .from(roles)
    .where(eq(roles.name, 'Super Admin'))
    .limit(1)

  if (superAdminRole.length === 0) {
    console.error('Super Admin role not found!')
    process.exit(1)
  }

  // Assign to admin user
  await db
    .insert(userRoles)
    .values({
      userId: 'c274ccc5-9a21-4d14-8a46-0e545821bd7b',
      roleId: superAdminRole[0].id,
    })
    .onConflictDoNothing()

  console.log('✅ Super Admin role assigned to admin@example.com')
}

assignSuperAdminRole().then(() => process.exit(0))
