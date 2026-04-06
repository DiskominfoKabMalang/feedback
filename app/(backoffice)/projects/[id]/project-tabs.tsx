'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, Layout, Settings, Code, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  {
    value: 'overview',
    label: 'Ringkasan',
    href: 'overview',
    icon: Layout,
    description: 'Statistik dan analitik proyek',
  },
  {
    value: 'inbox',
    label: 'Kotak Masuk',
    href: 'inbox',
    icon: MessageSquare,
    description: 'Lihat dan kelola feedback',
  },
  {
    value: 'builder',
    label: 'Widget Builder',
    href: 'builder',
    icon: Code,
    description: 'Kustomisasi widget feedback',
  },
  {
    value: 'install',
    label: 'Instalasi',
    href: 'install',
    icon: Download,
    description: 'Panduan integrasi',
  },
  {
    value: 'settings',
    label: 'Pengaturan',
    href: 'settings',
    icon: Settings,
    description: 'Konfigurasi proyek',
  },
]

interface ProjectTabsProps {
  projectId: string
}

export function ProjectTabs({ projectId }: ProjectTabsProps) {
  const pathname = usePathname()

  return (
    <nav className="grid gap-1 md:grid-cols-5">
      {tabs.map((tab) => {
        const href = `/projects/${projectId}/${tab.href}`
        const isActive =
          pathname.endsWith(tab.href) || pathname.endsWith(`${tab.href}/`)

        return (
          <Link
            key={tab.value}
            href={href}
            className={cn(
              'group relative flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200',
              'hover:bg-accent/50 hover:border-accent',
              isActive
                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                : 'bg-card border-border hover:shadow-sm'
            )}
          >
            <tab.icon
              className={cn(
                'h-5 w-5 transition-colors',
                isActive
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground group-hover:text-foreground'
              )}
            />
            <div className="flex-1 min-w-0">
              <div
                className={cn(
                  'text-sm font-medium truncate transition-colors',
                  isActive ? 'text-primary-foreground' : 'text-foreground'
                )}
              >
                {tab.label}
              </div>
              <div
                className={cn(
                  'text-xs truncate transition-colors',
                  isActive
                    ? 'text-primary-foreground/70'
                    : 'text-muted-foreground'
                )}
              >
                {tab.description}
              </div>
            </div>
            {isActive && (
              <div className="absolute inset-0 rounded-xl bg-primary-foreground/5 pointer-events-none" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
