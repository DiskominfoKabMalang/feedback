import { notFound } from 'next/navigation'
import { db } from '@/db'
import { projects } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface ProjectHeaderProps {
  projectId: string
}

export async function ProjectHeader({ projectId }: ProjectHeaderProps) {
  const session = await auth()

  if (!session?.user) {
    notFound()
  }

  // Fetch project with minimal fields
  const project = await db
    .select({
      id: projects.id,
      name: projects.name,
      slug: projects.slug,
      ownerId: projects.ownerId,
    })
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1)

  if (project.length === 0 || project[0].ownerId !== session.user.id) {
    notFound()
  }

  const projectData = project[0]

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
        <Link href="/projects" className="hover:underline">
          Proyek
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span>{projectData.name}</span>
      </div>
      <h1 className="text-2xl font-bold tracking-tight">{projectData.name}</h1>
      <p className="text-muted-foreground mt-1">
        <code className="text-xs bg-muted px-2 py-0.5 rounded">
          /s/{projectData.slug}
        </code>
      </p>
    </div>
  )
}
