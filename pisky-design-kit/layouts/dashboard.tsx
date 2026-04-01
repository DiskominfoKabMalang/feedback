/**
 * Pisky Design System - Dashboard Layout Pattern
 *
 * Layout dengan sidebar untuk admin dashboard.
 *
 * Dependencies:
 * pnpm add @radix-ui/react-slot lucide-react
 *
 * Usage:
 * Copy ke app/(dashboard)/layout.tsx
 */

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      {/* Sidebar Component - Anda perlu membuat ini */}
      {/* <AppSidebar /> */}

      <SidebarInset className="!mt-0 [&_main]:!mt-0">
        {/* Header */}
        <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b backdrop-blur">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-base font-semibold">App Name</h1>

            <div className="ml-auto flex items-center gap-2">
              {/* Header actions - notifications, user menu, etc */}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
