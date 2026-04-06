import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { AppSidebar } from '@/components/dashboard/layout/app-sidebar'
import { HeaderNotifications } from '@/components/dashboard/layout/header-notifications'
import { HeaderUser } from '@/components/dashboard/layout/header-user'
import { Toaster } from '@/components/ui/sonner'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { db } from '@/db'
import { projects } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'

export default async function BackofficeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const userDisplay = {
    name: session.user.name || session.user.email?.split('@')[0] || 'User',
    email: session.user.email || '',
    avatar: session.user.image || '',
    username: undefined,
  }

  // Get user permissions from session
  const userPermissions =
    (session.user as { permissions?: string[] })?.permissions || []

  // Fetch user projects for sidebar
  const userProjects = await db
    .select({
      id: projects.id,
      name: projects.name,
      slug: projects.slug,
    })
    .from(projects)
    .where(eq(projects.ownerId, session.user.id))
    .orderBy(desc(projects.createdAt))
    .limit(5)

  return (
    <SidebarProvider>
      <AppSidebar
        userPermissions={userPermissions}
        projects={userProjects.map((p) => ({
          name: p.name,
          url: `/projects/${p.id}`,
          slug: p.slug,
        }))}
      />
      <SidebarInset className="!mt-0 [&_main]:!mt-0">
        <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b backdrop-blur">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-base font-semibold">Echo</h1>

            <div className="ml-auto flex items-center gap-2">
              <HeaderNotifications />
              <HeaderUser user={userDisplay} />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6 pt-0">
          {children}
        </div>
      </SidebarInset>
      <Toaster position="top-center" />
    </SidebarProvider>
  )
}
