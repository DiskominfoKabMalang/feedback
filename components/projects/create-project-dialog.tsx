'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { toast } from 'sonner'

export function CreateProjectDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [newDomain, setNewDomain] = useState('')
  const [domains, setDomains] = useState<string[]>([])

  // Generate slug from name
  const handleNameChange = (value: string) => {
    setName(value)
    const generatedSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    setSlug(generatedSlug)
  }

  const addDomain = () => {
    if (!newDomain.trim()) return
    if (!domains.includes(newDomain.trim())) {
      setDomains([...domains, newDomain.trim()])
    }
    setNewDomain('')
  }

  const removeDomain = (domain: string) => {
    setDomains(domains.filter((d) => d !== domain))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Nama proyek wajib diisi')
      return
    }

    if (!slug.trim()) {
      toast.error('Slug wajib diisi')
      return
    }

    if (domains.length === 0) {
      toast.error('Minimal satu domain wajib ditambahkan')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/dashboard/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim(),
          domainWhitelist: domains,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Proyek berhasil dibuat!')
        setOpen(false)
        router.push(`/projects/${data.data.id}`)
        // Reset form
        setName('')
        setSlug('')
        setDomains([])
      } else {
        toast.error(data.error || 'Gagal membuat proyek')
      }
    } catch {
      toast.error('Gagal membuat proyek')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Proyek Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Buat Proyek Baru</DialogTitle>
            <DialogDescription>
              Buat proyek feedback baru. Anda bisa mengkustomisasi widget nanti.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Nama Proyek <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Proyek Feedback Saya"
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">/s/</span>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="proyek-feedback-saya"
                  pattern="[a-z0-9-]+"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Hanya huruf kecil, angka, dan tanda hubung. Digunakan untuk
                tautan publik.
              </p>
            </div>

            {/* Domain Whitelist */}
            <div className="space-y-2">
              <Label>
                Daftar Domain <span className="text-destructive">*</span>
              </Label>
              <p className="text-xs text-muted-foreground">
                Tambahkan domain tempat widget diizinkan berjalan
              </p>
              <div className="flex gap-2">
                <Input
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), addDomain())
                  }
                  placeholder="example.com"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDomain}
                >
                  Tambah
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {domains.map((domain) => (
                  <Badge key={domain} variant="secondary">
                    {domain}
                    <button
                      type="button"
                      className="ml-1 hover:text-destructive"
                      onClick={() => removeDomain(domain)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {domains.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Belum ada domain yang ditambahkan
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Memproses...' : 'Buat Proyek'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
