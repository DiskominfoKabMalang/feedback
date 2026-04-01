/**
 * Pisky Design System - Page Header Pattern
 *
 * Pattern untuk header halaman dengan title, description, dan actions.
 *
 * Usage:
 * import { PageHeader } from '@/components/layout/page-header'
 *
 * <PageHeader
 *   title="Projects"
 *   description="Manage your projects"
 *   actions={<Button>Create Project</Button>}
 * />
 */

import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'

interface PageHeaderProps extends React.ComponentProps<'div'> {
  title: string
  description?: string
  actions?: React.ReactNode
  asChild?: boolean
}

export function PageHeader({
  title,
  description,
  actions,
  className,
  asChild = false,
  ...props
}: PageHeaderProps) {
  const Wrapper = asChild ? Slot : 'div'

  return (
    <Wrapper
      className={cn(
        'flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between',
        className
      )}
      {...props}
    >
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </Wrapper>
  )
}

/* ============================================
   USAGE EXAMPLE
   ============================================ */
/*
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage your feedback projects"
        actions={
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Project
          </Button>
        }
      />

      {/* Rest of page content *\/}
    </div>
  )
}
*/
