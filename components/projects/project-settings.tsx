'use client'

import { useEffect, useState } from 'react'
import { Trash2, Plus, X, Save, Bell, Sparkles, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Project {
  id: string
  name: string
  slug: string
  domainWhitelist: string[]
  tier: string
  settings: {
    remove_branding?: boolean
    retention_days?: number
  }
}

interface ProjectSettingsProps {
  projectId: string
}

export function ProjectSettings({ projectId }: ProjectSettingsProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newDomain, setNewDomain] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/dashboard/projects/${projectId}`)
      .then((res) => res.json())
      .then((res) => {
        setProject(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [projectId])

  const updateProject = async (updates: Partial<Project>) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/dashboard/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        const data = await res.json()
        setProject(data.data)
        toast.success('Settings saved!')
      } else {
        toast.error('Failed to save settings')
      }
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const deleteProject = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/dashboard/projects/${projectId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast.success('Project deleted')
        router.push('/projects')
      } else {
        toast.error('Failed to delete project')
      }
    } catch {
      toast.error('Failed to delete project')
    } finally {
      setSaving(false)
    }
  }

  const addDomain = () => {
    if (!newDomain.trim()) return
    const domains = [...(project?.domainWhitelist || []), newDomain.trim()]
    updateProject({ domainWhitelist: domains })
    setNewDomain('')
  }

  const removeDomain = (domain: string) => {
    const domains = (project?.domainWhitelist || []).filter((d) => d !== domain)
    updateProject({ domainWhitelist: domains })
  }

  if (loading) {
    return (
      <div className="py-8 text-center text-muted-foreground">Loading...</div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Project not found
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Basic project information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Project Name</Label>
            <Input
              value={project.name}
              onChange={(e) => setProject({ ...project, name: e.target.value })}
              onBlur={() => updateProject({ name: project.name })}
              placeholder="My Feedback Project"
            />
          </div>

          <div className="space-y-2">
            <Label>Slug</Label>
            <div className="flex gap-2">
              <div className="flex items-center bg-muted px-3 rounded-l-md border border-r-0 text-muted-foreground text-sm">
                /s/
              </div>
              <Input
                value={project.slug}
                onChange={(e) =>
                  setProject({ ...project, slug: e.target.value })
                }
                onBlur={() => updateProject({ slug: project.slug })}
                placeholder="my-project"
                className="rounded-l-none"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Used for public links. Only lowercase letters, numbers, and
              hyphens.
            </p>
          </div>

          <Button onClick={() => updateProject(project)} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Domain whitelist for widget CORS protection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Domain Whitelist</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Add domains where your widget is allowed to run. The widget will
              not work on unauthorized domains.
            </p>
            <div className="flex gap-2">
              <Input
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addDomain()}
                placeholder="example.com"
              />
              <Button size="sm" onClick={addDomain}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.domainWhitelist.map((domain) => (
                <Badge key={domain} variant="secondary">
                  {domain}
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={() => removeDomain(domain)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {project.domainWhitelist.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No domains added. Widget will work from any origin.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Data Retention (Days)</Label>
            <Input
              type="number"
              min="1"
              value={project.settings?.retention_days || 30}
              onChange={(e) =>
                setProject({
                  ...project,
                  settings: {
                    ...project.settings,
                    retention_days: parseInt(e.target.value),
                  },
                })
              }
              onBlur={() =>
                updateProject({
                  settings: project.settings,
                })
              }
            />
            <p className="text-xs text-muted-foreground">
              Feedbacks older than this will be automatically deleted.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Webhooks - Coming Soon */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Webhooks
            <Badge variant="secondary" className="ml-2">
              Coming Soon
            </Badge>
          </CardTitle>
          <CardDescription>
            Kirim notifikasi real-time ke sistem lain saat feedback diterima
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-lg p-6 space-y-4">
            {/* Feature Preview */}
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Integrasi Webhook</h4>
                <p className="text-sm text-muted-foreground">
                  Terima notifikasi ke Slack, Discord, atau sistem custom Anda
                  setiap kali ada feedback baru.
                </p>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Filter berdasarkan rating dan tags</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Retry otomatis jika endpoint gagal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Log riwayat pengiriman webhook</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Signature verification untuk security</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Open mailto for feature request
                  const subject = encodeURIComponent('Request Fitur Webhook - Echo')
                  const body = encodeURIComponent(
                    'Halo Tim Echo,\n\nSaya tertarik dengan fitur Webhook untuk integrasi feedback. Mohon informasikan kapan fitur ini akan tersedia.\n\nTerima kasih!'
                  )
                  window.open(`mailto:support@echo.com?subject=${subject}&body=${body}`)
                }}
              >
                <Mail className="mr-2 h-4 w-4" />
                Request Fitur Ini
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions that affect your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" disabled={saving}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Project</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete &quot;{project.name}&quot;?
                  This action cannot be undone and all feedback data will be
                  permanently deleted.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogTrigger>
                <Button variant="destructive" onClick={deleteProject}>
                  Delete Project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
