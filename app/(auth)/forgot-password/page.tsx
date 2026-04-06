'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
} from 'lucide-react'
import Link from 'next/link'

const forgotPasswordSchema = z.object({
  email: z.string().email('Email tidak valid'),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Gagal mengirim email reset')
        return
      }

      setSuccess(true)
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
          Cek email Anda
        </h2>
        <p className="text-muted-foreground mb-8 text-sm sm:text-base">
          Kami telah mengirimkan link reset password ke email Anda
        </p>
        <Link href="/login">
          <Button
            variant="outline"
            className="h-12 w-full rounded-lg text-sm font-semibold"
          >
            <ArrowLeft size={16} className="mr-2" />
            Kembali ke halaman login
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-2xl font-bold sm:text-3xl">
          Lupa password?
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Masukkan email Anda dan kami akan mengirimkan link untuk reset
          password
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
        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="text-foreground mb-2 block text-sm font-medium"
          >
            Email
          </label>
          <div className="relative">
            <Mail
              size={18}
              className="text-muted-foreground absolute top-1/2 left-3.5 -translate-y-1/2"
            />
            <input
              type="email"
              id="email"
              placeholder="Masukkan email Anda"
              className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-input bg-background py-3 pr-4 pl-11 text-sm transition-all placeholder:text-muted-foreground focus:ring-2 focus:outline-none"
              {...form.register('email')}
            />
          </div>
          {form.formState.errors.email && (
            <p className="text-destructive mt-1 text-sm">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="h-12 w-full rounded-lg text-sm font-semibold shadow-lg transition-all duration-300 disabled:opacity-50"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Mengirim...' : 'Kirim link reset'}
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
