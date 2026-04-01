import 'dotenv/config'
import { db } from '@/db'
import { users } from '@/db/schema'
import { hashPassword } from '@/lib/auth/password'

async function createUser() {
  const hashedPassword = await hashPassword('password123')

  const user = await db
    .insert(users)
    .values({
      email: 'admin@example.com',
      username: 'admin',
      password: hashedPassword,
      name: 'Admin User',
    })
    .returning()

  console.log('User created:', user[0])
  console.log('Email: admin@example.com')
  console.log('Password: password123')
}

createUser().then(() => process.exit(0))
