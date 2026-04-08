'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from 'lucide-react'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Nama minimal 2 karakter'),
    username: z
      .string()
      .min(3, 'Username minimal 3 karakter')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'Username hanya boleh berisi huruf, angka, dan underscore'
      ),
    email: z.string().email('Email tidak valid'),
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

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Pendaftaran gagal')
        return
      }

      router.push('/login?registered=true')
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-2xl font-bold sm:text-3xl">
          Buat akun baru
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Mulai kumpulkan feedback dalam hitungan menit
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Kesalahan</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Input */}
        <div>
          <label
            htmlFor="name"
            className="text-foreground mb-2 block text-sm font-medium"
          >
            Nama Lengkap
          </label>
          <div className="relative">
            <User
              size={18}
              className="text-muted-foreground absolute top-1/2 left-3.5 -translate-y-1/2"
            />
            <input
              type="text"
              id="name"
              placeholder="Masukkan nama lengkap"
              className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-input bg-background py-3 pr-4 pl-11 text-sm transition-all placeholder:text-muted-foreground focus:ring-2 focus:outline-none"
              {...form.register('name')}
            />
          </div>
          {form.formState.errors.name && (
            <p className="text-destructive mt-1 text-sm">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        {/* Username Input */}
        <div>
          <label
            htmlFor="username"
            className="text-foreground mb-2 block text-sm font-medium"
          >
            Username
          </label>
          <div className="relative">
            <span className="text-muted-foreground absolute top-1/2 left-3.5 -translate-y-1/2">
              @
            </span>
            <input
              type="text"
              id="username"
              placeholder="username"
              className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-input bg-background py-3 pr-4 pl-11 text-sm transition-all placeholder:text-muted-foreground focus:ring-2 focus:outline-none"
              {...form.register('username')}
            />
          </div>
          {form.formState.errors.username && (
            <p className="text-destructive mt-1 text-sm">
              {form.formState.errors.username.message}
            </p>
          )}
        </div>

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

        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="text-foreground mb-2 block text-sm font-medium"
          >
            Password
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="text-muted-foreground absolute top-1/2 left-3.5 -translate-y-1/2"
            />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Buat password"
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
            Konfirmasi Password
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="text-muted-foreground absolute top-1/2 left-3.5 -translate-y-1/2"
            />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              placeholder="Konfirmasi password Anda"
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
          disabled={isLoading}
          className="h-12 w-full rounded-lg text-sm font-semibold shadow-lg transition-all duration-300 disabled:opacity-50"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Memproses...' : 'Daftar'}
        </Button>
      </form>

      {/* Login Link */}
      <p className="text-muted-foreground mt-8 text-center text-sm">
        Sudah punya akun?{' '}
        <Link
          href="/login"
          className="text-primary hover:text-primary/80 inline-flex items-center gap-1 font-semibold transition-colors"
        >
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-1"
          />
          Masuk
        </Link>
      </p>
    </>
  )
}
