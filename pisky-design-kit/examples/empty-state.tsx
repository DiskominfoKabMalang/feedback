/**
 * Pisky Design System - Empty State Example
 *
 * Component untuk menampilkan state kosong (no data).
 *
 * Dependencies:
 * pnpm add lucide-react
 *
 * Usage:
 * Copy ke komponen Anda dan modifikasi.
 */

import { Button } from '@/components/ui/button'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'border-border/50 bg-muted/30 flex min-h-[400px] flex-col items-center justify-center rounded-xl border p-8 text-center',
        className
      )}
    >
      <div className="bg-muted text-muted-foreground flex h-16 w-16 items-center justify-center rounded-full">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm">
        {description}
      </p>
      {action && (
        <Button className="mt-6" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

/* ============================================
   USAGE EXAMPLE
   ============================================ */
/*
import { EmptyState } from '@/components/examples/empty-state'
import { FolderOpenIcon, PlusIcon } from 'lucide-react'

export default function ProjectsPage() {
  const hasProjects = false // Your condition

  if (!hasProjects) {
    return (
      <EmptyState
        icon={FolderOpenIcon}
        title="No projects yet"
        description="Create your first project to start collecting feedback"
        action={{
          label: 'Create Project',
          onClick: () => console.log('create project'),
        }}
      />
    )
  }

  return (
    <div>{/* Your projects list *\/}</div>
  )
}
*/
