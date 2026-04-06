import 'dotenv/config'
import { db } from './index'
import { users, userRoles, roles } from './schema'
import bcryptjs from 'bcryptjs'
import { eq } from 'drizzle-orm'

async function createAdmin() {
  const hashedPassword = await bcryptjs.hash('admin123', 12)

  // Check if admin exists
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, 'admin@example.com'))
    .limit(1)

  if (existing.length > 0) {
    console.log('ℹ️ Admin user already exists')
    process.exit(0)
  }

  // Create admin user
  const [admin] = await db
    .insert(users)
    .values({
      email: 'admin@example.com',
      name: 'Super Admin',
      username: 'admin',
      password: hashedPassword,
    })
    .returning()

  console.log('✅ Admin user created:', admin.email)

  // Assign Super Admin role
  const superAdminRole = await db
    .select()
    .from(roles)
    .where(eq(roles.name, 'Super Admin'))
    .limit(1)

  if (superAdminRole.length > 0) {
    await db.insert(userRoles).values({
      userId: admin.id,
      roleId: superAdminRole[0].id,
    })
    console.log('✅ Super Admin role assigned')
  } else {
    console.log('⚠️ Super Admin role not found. Run seed-rbac first.')
  }
}

createAdmin()
  .then(() => {
    console.log('\n✅ Done! Login with admin@example.com / admin123')
    process.exit(0)
  })
  .catch((err) => {
    console.error('❌ Error:', err)
    process.exit(1)
  })
