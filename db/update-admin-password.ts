import 'dotenv/config'
import { db } from '@/db'
import { users } from '@/db/schema'
import { hashPassword } from '@/lib/auth/password'
import { eq } from 'drizzle-orm'

async function updateAdminPassword() {
  const newPassword = 'admin'
  const hashedPassword = await hashPassword(newPassword)

  const result = await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.email, 'admin@example.com'))
    .returning()

  if (result.length === 0) {
    console.log('❌ Admin user not found')
    process.exit(1)
  }

  console.log('✅ Admin password updated successfully!')
  console.log('📧 Email: admin@example.com')
  console.log('🔑 Password: admin')
  console.log('👤 Username: admin')
}

updateAdminPassword()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
