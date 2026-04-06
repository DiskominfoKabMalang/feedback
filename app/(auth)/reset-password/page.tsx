'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from 'lucide-react'
import Link from 'next/link'

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password minimal 8 karakter')
      .regex(/[A-Z]/, 'Password harus mengandung minimal 1 huruf kapital')
      .regex(/[a-z]/, 'Password harus mengandung minimal 1 huruf kecil')
      .regex(/[0-9]/, 'Password harus mengandung minimal 1 angka'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    if (!token) {
      setError('Link reset tidak valid. Silakan minta link baru.')
    }
  }, [token])

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) {
      setError('Link reset tidak valid')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: values.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Gagal reset password')
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
            <CheckCircle2 className="text-primary h-8 w-8" />
          </div>
        </div>
        <h2 className="text-foreground mb-2 text-2xl font-bold sm:text-3xl">
          Password berhasil direset
        </h2>
        <p className="text-muted-foreground mb-8 text-sm sm:text-base">
          Password Anda telah diperbarui. Mengalihkan ke halaman login...
        </p>
        <div className="flex justify-center">
          <Loader2 className="text-primary h-6 w-6 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-2xl font-bold sm:text-3xl">
          Reset Password
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Masukkan password baru Anda
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="text-foreground mb-2 block text-sm font-medium"
          >
            Password Baru
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="text-muted-foreground absolute top-1/2 left-3.5 -translate-y-1/2"
            />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Masukkan password baru"
              className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-input bg-background py-3 pr-12 pl-11 text-sm transition-all placeholder:text-muted-foreground focus:ring-2 focus:outline-none"
              {...form.register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground absolute top-1/2 right-3.5 -translate-y-1/2 transition-colors hover:text-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-destructive mt-1 text-sm">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="text-foreground mb-2 block text-sm font-medium"
          >
            Konfirmasi Password Baru
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="text-muted-foreground absolute top-1/2 left-3.5 -translate-y-1/2"
            />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              placeholder="Konfirmasi password baru"
              className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-input bg-background py-3 pr-12 pl-11 text-sm transition-all placeholder:text-muted-foreground focus:ring-2 focus:outline-none"
              {...form.register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-muted-foreground absolute top-1/2 right-3.5 -translate-y-1/2 transition-colors hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {form.formState.errors.confirmPassword && (
            <p className="text-destructive mt-1 text-sm">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || !token}
          className="h-12 w-full rounded-lg text-sm font-semibold shadow-lg transition-all duration-300 disabled:opacity-50"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Memproses...' : 'Reset Password'}
        </Button>
      </form>

      {/* Back to Login Link */}
      <p className="text-muted-foreground mt-8 text-center text-sm">
        <Link
          href="/login"
          className="text-primary hover:text-primary/80 inline-flex items-center gap-1 font-semibold transition-colors"
        >
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-1"
          />
          Kembali ke halaman login
        </Link>
      </p>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
