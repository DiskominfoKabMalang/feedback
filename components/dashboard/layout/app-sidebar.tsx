'use client'

import * as React from 'react'
import {
  LifeBuoy,
  Send,
  Settings2,
  LayoutDashboard,
  Users,
  Briefcase,
  Layers,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { NavMain } from './nav-main'
import { NavProjects } from './nav-projects'
import { NavSecondary } from './nav-secondary'

const navMainItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    isActive: true,
    requiredPermission: 'dashboard.view',
  },
  {
    title: 'Proyek',
    url: '/projects',
    icon: Briefcase,
    requiredPermission: 'projects.read',
  },
  {
    title: 'Manajemen Pengguna',
    url: '#',
    icon: Users,
    requiredPermission: 'users.read',
    items: [
      {
        title: 'Pengguna',
        url: '/users',
        requiredPermission: 'users.read',
      },
      {
        title: 'Peran',
        url: '/roles',
        requiredPermission: 'roles.read',
      },
      {
        title: 'Izin',
        url: '/permissions',
        requiredPermission: 'permissions.read',
      },
      {
        title: 'Sumber Daya',
        url: '/resources',
        requiredPermission: 'resources.read',
      },
    ],
  },
  // {
  //   title: 'Pengaturan',
  //   url: '#',
  //   icon: Settings2,
  //   requiredPermission: 'settings.manage',
  //   items: [
  //     {
  //       title: 'Umum',
  //       url: '/settings',
  //       requiredPermission: 'settings.manage',
  //     },
  //     {
  //       title: 'Keamanan',
  //       url: '/settings/security',
  //       requiredPermission: 'settings.security',
  //     },
  //   ],
  // },
]

const navSecondaryItems = [
  {
    title: 'Bantuan',
    url: 'https://github.com/anthropics/claude-code/issues',
    icon: LifeBuoy,
  },
  {
    title: 'Feedback',
    url: 'https://github.com/anthropics/claude-code/issues',
    icon: Send,
  },
]

export function AppSidebar({
  userPermissions = [],
  projects = [],
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  userPermissions?: string[]
  projects?: Array<{
    name: string
    url: string
    slug: string
  }>
}) {
  return (
    <Sidebar collapsible="icon" className="border-r border-border" {...props}>
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="h-14 data-[active=true]:bg-primary/5 rounded-xl"
            >
              <a href="/dashboard" className="gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <span className="text-lg font-bold">E</span>
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-base font-bold tracking-tight">
                    Echo
                  </span>
                  <span className="truncate text-xs font-medium opacity-60">
                    {projects.length > 0
                      ? `${projects.length} proyek`
                      : 'Belum ada proyek'}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <NavMain items={navMainItems} userPermissions={userPermissions} />
        <SidebarSeparator className="mx-2 my-2 bg-sidebar-border/50" />
        <NavProjects projects={projects} />
        <SidebarSeparator className="mx-2 my-2 bg-sidebar-border/50" />
        <NavSecondary items={navSecondaryItems} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
