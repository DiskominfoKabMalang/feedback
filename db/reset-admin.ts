import 'dotenv/config'
import { db } from './index'
import { users } from './schema'
import bcryptjs from 'bcryptjs'
import { eq } from 'drizzle-orm'

async function resetAdmin() {
  const hashedPassword = await bcryptjs.hash('admin123', 12)

  await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.email, 'admin@example.com'))

  console.log('✅ Admin password reset to: admin123')
  console.log('📧 Email: admin@example.com')
  console.log('🔑 Password: admin123')
}

resetAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error:', err)
    process.exit(1)
  })
