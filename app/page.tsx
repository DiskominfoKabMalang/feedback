import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <span className="text-primary-foreground text-lg font-bold">E</span>
            </div>
            <span className="text-foreground text-xl font-bold">Echo</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Masuk
            </Link>
            <Button size="sm" asChild>
              <Link href="/register">Daftar</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="bg-green-500 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
              <span className="bg-green-500 relative inline-flex h-2 w-2 rounded-full" />
            </span>
            <span className="text-muted-foreground">Sekarang dalam beta publik</span>
          </div>

          {/* Headline */}
          <h1 className="text-balance bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Kumpulkan feedback<br />yang penting
          </h1>

          {/* Subheadline */}
          <p className="text-balance text-muted-foreground mx-auto max-w-xl text-lg sm:text-xl">
            Cara sederhana namun powerful untuk mengumpulkan dan mengelola
            feedback pelanggan. Buat form, kumpulkan insight, dan tingkatkan
            produk Anda.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link href="/register">Mulai kumpulkan feedback</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
          </div>

          {/* Trust indicator */}
          <p className="text-muted-foreground text-sm">
            Tidak perlu kartu kredit · Gratis selamanya untuk tim kecil
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex items-center justify-between px-6 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Echo. Hak cipta dilindungi.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privasi
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
