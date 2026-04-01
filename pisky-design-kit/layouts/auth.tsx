/**
 * Pisky Design System - Auth Layout Pattern
 *
 * Layout centered untuk halaman auth (login, register, etc).
 *
 * Usage:
 * Copy ke app/(auth)/layout.tsx
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-muted/40 min-h-svh flex flex-col items-center justify-center gap-4 p-4 md:p-8">
      <div className="bg-card text-card-foreground w-full max-w-md rounded-xl border shadow-sm">
        {children}
      </div>
    </div>
  )
}

/* ============================================
   USAGE EXAMPLE - Login Page
   ============================================ */
/*
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  return (
    <>
      <CardHeader className="text-center">
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="email@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
          <Button className="w-full">Sign In</Button>
        </form>
      </CardContent>
    </>
  )
}
*/
