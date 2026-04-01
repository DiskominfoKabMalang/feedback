import { db } from './db/index.ts'
import { projects } from './db/schema.ts'

const result = await db
  .select({ id: projects.id, name: projects.name })
  .from(projects)
  .limit(5)
console.log('Projects in DB:')
result.forEach((p) => console.log(`  ID: ${p.id}, Name: ${p.name}`))
