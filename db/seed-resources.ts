import 'dotenv/config'
import { db } from '@/db'
import { resources } from '@/db/schema'
import { eq } from 'drizzle-orm'

const defaultResources = [
  {
    name: 'Users',
    identifier: 'users',
    description: 'User accounts and profiles management',
  },
  {
    name: 'Roles',
    identifier: 'roles',
    description: 'User roles and role assignments',
  },
  {
    name: 'Permissions',
    identifier: 'permissions',
    description: 'System permissions and access control',
  },
  {
    name: 'Resources',
    identifier: 'resources',
    description: 'System resources for RBAC',
  },
  {
    name: 'Projects',
    identifier: 'projects',
    description: 'Feedback projects management',
  },
  {
    name: 'Feedbacks',
    identifier: 'feedbacks',
    description: 'User feedback entries',
  },
  {
    name: 'Webhooks',
    identifier: 'webhooks',
    description: 'Webhook integrations',
  },
  {
    name: 'Dashboard',
    identifier: 'dashboard',
    description: 'Main dashboard access',
  },
  {
    name: 'Settings',
    identifier: 'settings',
    description: 'Application settings',
  },
]

async function seedResources() {
  console.log('🌱 Seeding default resources...')

  try {
    for (const resource of defaultResources) {
      // Check if resource already exists
      const existing = await db
        .select()
        .from(resources)
        .where(eq(resources.identifier, resource.identifier))
        .limit(1)

      if (existing.length > 0) {
        console.log(`  ✓ Resource "${resource.identifier}" already exists`)
        continue
      }

      await db.insert(resources).values(resource)
      console.log(
        `  + Created resource: ${resource.name} (${resource.identifier})`
      )
    }

    console.log('\n✅ Resources seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding resources:', error)
    process.exit(1)
  }
}

seedResources()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
