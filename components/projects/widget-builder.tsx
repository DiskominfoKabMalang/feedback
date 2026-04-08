'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import {
  Save,
  RefreshCw,
  Plus,
  Trash2,
  Star,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { toast } from 'sonner'

// ============================================================================
// Types (matching database schema)
// ============================================================================

export interface WidgetTheme {
  primary_color?: string
  position?: 'bottom_left' | 'bottom_right' | 'top_left' | 'top_right'
  trigger_icon?: string
  trigger_label?: string
  button_style?: 'pill' | 'rounded' | 'square'
}

export interface WidgetBehavior {
  show_branding?: boolean
  persistence?: 'none' | 'remember_user_info' | 'remember_session'
  auto_open?: boolean
  delay_open?: number
}

export interface RatingStepConfig {
  enabled: boolean
  type: 'emoji' | 'star' | 'number'
  scale: number
  title: string
}

export interface FeedbackLogicRule {
  trigger_ratings: number[]
  title: string
  subtitle?: string
  tags_options?: string[]
  placeholder?: string
  allow_skip_comment?: boolean
  collect_email?: boolean
  cta_text?: string
  cta_redirect?: string
}

export interface FeedbackStepConfig {
  enabled: boolean
  logic_rules: FeedbackLogicRule[]
}

export interface DemographicField {
  key: string
  label: string
  type:
    | 'radio_group'
    | 'chips'
    | 'select'
    | 'checkbox'
    | 'text'
    | 'email'
    | 'number'
  options?: string[]
  required?: boolean
  placeholder?: string
}

export interface DemographicsStepConfig {
  enabled: boolean
  required: boolean
  title: string
  subtitle?: string
  fields: DemographicField[]
}

export interface SuccessStepConfig {
  title: string
  message: string
  auto_close_seconds?: number
  show_cta?: boolean
  cta_text?: string
  cta_url?: string
}

export interface WidgetFlow {
  rating_step: RatingStepConfig
  feedback_step: FeedbackStepConfig
  demographics_step: DemographicsStepConfig
  success_step: SuccessStepConfig
}

export interface WidgetConfig {
  project_name?: string
  version?: string
  theme?: WidgetTheme
  behavior?: WidgetBehavior
  flow?: WidgetFlow
}

interface WidgetBuilderProps {
  projectId: string
}

// ============================================================================
// Default Configuration
// ============================================================================

const DEFAULT_CONFIG: WidgetConfig = {
  project_name: '',
  version: '1.0.0',
  theme: {
    primary_color: '#6366f1',
    position: 'bottom_right',
    trigger_icon: '',
    trigger_label: 'Feedback',
    button_style: 'pill',
  },
  behavior: {
    show_branding: true,
    persistence: 'remember_user_info',
    auto_open: false,
    delay_open: 0,
  },
  flow: {
    rating_step: {
      enabled: true,
      type: 'emoji',
      scale: 5,
      title: 'Seberapa puas Anda dengan layanan kami?',
    },
    feedback_step: {
      enabled: true,
      logic_rules: [
        {
          trigger_ratings: [1, 2],
          title: 'Mohon maaf atas ketidaknyamanan ini.',
          subtitle: 'Apa kendala utama yang Anda alami?',
          tags_options: [
            'Informasi Sulit Ditemukan',
            'Website Lambat/Error',
            'Tampilan Membingungkan',
            'Layanan Lambat',
          ],
          placeholder: 'Ceritakan detail kendala Anda...',
          allow_skip_comment: false,
          collect_email: true,
        },
        {
          trigger_ratings: [3],
          title: 'Terima kasih responnya.',
          subtitle: 'Apa yang bisa kami tingkatkan?',
          tags_options: [
            'Butuh Fitur Baru',
            'Update Lebih Cepat',
            'Kemudahan Akses',
          ],
          placeholder: 'Saran Anda...',
          allow_skip_comment: true,
          collect_email: false,
        },
        {
          trigger_ratings: [4, 5],
          title: 'Senang mendengarnya!',
          subtitle: 'Apa yang paling membantu Anda?',
          tags_options: [
            'Informasi Lengkap',
            'Mudah Digunakan',
            'Tampilan Menarik',
            'Layanan Cepat',
          ],
          placeholder: 'Pujian atau saran tambahan...',
          allow_skip_comment: true,
          collect_email: false,
        },
      ],
    },
    demographics_step: {
      enabled: false,
      required: true,
      title: 'Sedikit lagi! Lengkapi data statistik berikut:',
      fields: [
        {
          key: 'gender',
          label: 'Jenis Kelamin',
          type: 'radio_group',
          options: ['Laki-laki', 'Perempuan'],
          required: true,
        },
        {
          key: 'age_group',
          label: 'Rentang Usia',
          type: 'chips',
          options: ['<17', '18-25', '26-40', '41-60', '>60'],
          required: true,
        },
        {
          key: 'job_type',
          label: 'Pekerjaan',
          type: 'select',
          options: [
            'ASN/PNS',
            'Wiraswasta',
            'Karyawan Swasta',
            'Mahasiswa/Pelajar',
            'Ibu Rumah Tangga',
            'Lainnya',
          ],
          required: true,
        },
      ],
    },
    success_step: {
      title: 'Terima Kasih!',
      message: 'Masukan Anda membantu kami menjadi lebih baik.',
      auto_close_seconds: 5,
      show_cta: false,
    },
  },
}

// Deep merge helper (outside component to avoid re-creation on each render)
function mergeDeep<T extends object>(target: T, source: Partial<T>): T {
  const output = { ...target }
  for (const key in source) {
    if (
      typeof source[key] === 'object' &&
      source[key] !== null &&
      !Array.isArray(source[key]) &&
      key in output &&
      typeof output[key] === 'object' &&
      output[key] !== null &&
      !Array.isArray(output[key])
    ) {
      ;(output as Record<string, unknown>)[key] = mergeDeep(
        output[key] as object,
        source[key] as Partial<object>
      )
    } else {
      ;(output as Record<string, unknown>)[key] = source[key]
    }
  }
  return output
}

// ============================================================================
// Main Widget Builder Component
// ============================================================================

export function WidgetBuilder({ projectId }: WidgetBuilderProps) {
  const [config, setConfig] = useState<WidgetConfig>(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [addRuleOpen, setAddRuleOpen] = useState(false)
  const [newRuleRatings, setNewRuleRatings] = useState<number[]>([])

  // Ref to always have access to latest config without triggering re-renders
  const configRef = useRef(config)
  useEffect(() => {
    configRef.current = config
  }, [config])

  // Load existing config
  useEffect(() => {
    fetch(`/api/dashboard/projects/${projectId}`)
      .then((res) => res.json())
      .then((res) => {
        const existingConfig = res.data?.widgetConfig || {}
        // Merge with defaults to ensure all fields exist
        setConfig((prev) => mergeDeep(DEFAULT_CONFIG, existingConfig))
        setLoading(false)
      })
      .catch(() => {
        setConfig(DEFAULT_CONFIG)
        setLoading(false)
      })
  }, [projectId])

  // Update theme
  const updateTheme = (updates: Partial<WidgetTheme>) => {
    setConfig((prev) => ({
      ...prev,
      theme: { ...prev.theme, ...updates },
    }))
  }

  // Update behavior
  const updateBehavior = (updates: Partial<WidgetBehavior>) => {
    setConfig((prev) => ({
      ...prev,
      behavior: { ...prev.behavior, ...updates },
    }))
  }

  // Update rating step
  const updateRatingStep = (updates: Partial<RatingStepConfig>) => {
    setConfig((prev) => ({
      ...prev,
      flow: {
        rating_step: {
          ...(prev.flow?.rating_step ?? {
            enabled: true,
            type: 'emoji' as const,
            scale: 5,
            title: 'Rate us',
          }),
          ...updates,
        },
        feedback_step: prev.flow?.feedback_step ?? {
          enabled: true,
          logic_rules: [],
        },
        demographics_step: prev.flow?.demographics_step ?? {
          enabled: false,
          required: false,
          title: 'Informasi Tambahan',
          fields: [],
        },
        success_step: prev.flow?.success_step ?? {
          enabled: true,
          title: 'Terima kasih!',
          message: 'Masukan Anda membantu kami menjadi lebih baik.',
          auto_close_seconds: 5,
          show_cta: false,
        },
      },
    }))
  }

  // Update feedback step
  const updateFeedbackStep = (updates: Partial<FeedbackStepConfig>) => {
    setConfig((prev) => ({
      ...prev,
      flow: {
        rating_step: prev.flow?.rating_step ?? {
          enabled: true,
          type: 'emoji',
          scale: 5,
          title: 'Rate us',
        },
        feedback_step: {
          ...(prev.flow?.feedback_step ?? { enabled: true, logic_rules: [] }),
          ...updates,
        },
        demographics_step: prev.flow?.demographics_step ?? {
          enabled: false,
          required: false,
          title: 'Informasi Tambahan',
          fields: [],
        },
        success_step: prev.flow?.success_step ?? {
          enabled: true,
          title: 'Terima kasih!',
          message: 'Masukan Anda membantu kami menjadi lebih baik.',
          auto_close_seconds: 5,
          show_cta: false,
        },
      },
    }))
  }

  // Update logic rule
  const updateLogicRule = (
    index: number,
    updates: Partial<FeedbackLogicRule>
  ) => {
    const rules = [...(config.flow?.feedback_step?.logic_rules || [])]
    rules[index] = { ...rules[index], ...updates }
    updateFeedbackStep({ logic_rules: rules })
  }

  // Add new logic rule
  const addLogicRule = () => {
    if (newRuleRatings.length === 0) {
      toast.error('Pilih minimal satu rating')
      return
    }

    // Check for overlap
    const hasOverlap = (config.flow?.feedback_step?.logic_rules || []).some(
      (rule) => rule.trigger_ratings.some((r) => newRuleRatings.includes(r))
    )

    if (hasOverlap) {
      toast.error('Rating ini sudah digunakan di rule lain')
      return
    }

    const newRule: FeedbackLogicRule = {
      trigger_ratings: [...newRuleRatings],
      title: 'Terima kasih atas masukan Anda',
      tags_options: [],
      placeholder: 'Ceritakan pengalaman Anda...',
      allow_skip_comment: true,
      collect_email: false,
    }

    updateFeedbackStep({
      logic_rules: [
        ...(config.flow?.feedback_step?.logic_rules || []),
        newRule,
      ],
    })
    setAddRuleOpen(false)
    setNewRuleRatings([])
    toast.success('Logic rule ditambahkan')
  }

  // Remove logic rule
  const removeLogicRule = (index: number) => {
    const rules = [...(config.flow?.feedback_step?.logic_rules || [])]
    rules.splice(index, 1)
    updateFeedbackStep({ logic_rules: rules })
    toast.success('Logic rule dihapus')
  }

  // Add tag option to rule
  const addTagOption = (ruleIndex: number, tag: string) => {
    if (!tag.trim()) {
      toast.error('Tag tidak boleh kosong')
      return
    }
    const rules = [...(config.flow?.feedback_step?.logic_rules || [])]
    const tags = rules[ruleIndex].tags_options || []
    if (!tags.includes(tag.trim())) {
      rules[ruleIndex] = {
        ...rules[ruleIndex],
        tags_options: [...tags, tag.trim()],
      }
      updateFeedbackStep({ logic_rules: rules })
      toast.success('Tag ditambahkan')
    } else {
      toast.error('Tag sudah ada')
    }
  }

  // Remove tag option from rule
  const removeTagOption = (ruleIndex: number, tag: string) => {
    const rules = [...(config.flow?.feedback_step?.logic_rules || [])]
    rules[ruleIndex] = {
      ...rules[ruleIndex],
      tags_options:
        rules[ruleIndex].tags_options?.filter((t) => t !== tag) || [],
    }
    updateFeedbackStep({ logic_rules: rules })
    toast.success('Tag dihapus')
  }

  // Update demographics step (internal, no toast)
  const updateDemographicsStep = (updates: Partial<DemographicsStepConfig>) => {
    setConfig((prev) => {
      const currentDemo = prev.flow?.demographics_step ?? {
        enabled: false,
        required: false,
        title: 'Informasi Tambahan',
        fields: [],
      }
      return {
        ...prev,
        flow: {
          rating_step: prev.flow?.rating_step ?? {
            enabled: true,
            type: 'emoji',
            scale: 5,
            title: 'Rate us',
          },
          feedback_step: prev.flow?.feedback_step ?? {
            enabled: true,
            logic_rules: [],
          },
          demographics_step: {
            ...currentDemo,
            ...updates,
          },
          success_step: prev.flow?.success_step ?? {
            enabled: true,
            title: 'Terima kasih!',
            message: 'Masukan Anda membantu kami menjadi lebih baik.',
            auto_close_seconds: 5,
            show_cta: false,
          },
        },
      }
    })
  }

  // Add demographic field
  const addDemographicField = () => {
    setConfig((prev) => {
      const currentFields = prev.flow?.demographics_step?.fields || []
      const stableId = `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const newField = {
        key: stableId,
        label: 'Field Baru',
        type: 'select' as const,
        options: ['Opsi 1', 'Opsi 2'],
        required: false,
      }

      const currentDemo = prev.flow?.demographics_step ?? {
        enabled: false,
        required: false,
        title: 'Informasi Tambahan',
        fields: [],
      }

      return {
        ...prev,
        flow: {
          rating_step: prev.flow?.rating_step ?? {
            enabled: true,
            type: 'emoji',
            scale: 5,
            title: 'Rate us',
          },
          feedback_step: prev.flow?.feedback_step ?? {
            enabled: true,
            logic_rules: [],
          },
          demographics_step: {
            ...currentDemo,
            fields: [...currentFields, newField],
          },
          success_step: prev.flow?.success_step ?? {
            enabled: true,
            title: 'Terima kasih!',
            message: 'Masukan Anda membantu kami menjadi lebih baik.',
            auto_close_seconds: 5,
            show_cta: false,
          },
        },
      }
    })
    toast.success('Field demografi ditambahkan')
  }

  // Update demographic field - using useCallback with ref to prevent re-renders
  const updateDemographicField = useCallback(
    (index: number, updates: Partial<DemographicField>) => {
      setConfig((prev) => {
        const currentFields = prev.flow?.demographics_step?.fields || []
        const newFields = [...currentFields]
        newFields[index] = { ...newFields[index], ...updates }

        const currentDemo = prev.flow?.demographics_step ?? {
          enabled: false,
          required: false,
          title: 'Informasi Tambahan',
          fields: [],
        }

        return {
          ...prev,
          flow: {
            rating_step: prev.flow?.rating_step ?? {
              enabled: true,
              type: 'emoji',
              scale: 5,
              title: 'Rate us',
            },
            feedback_step: prev.flow?.feedback_step ?? {
              enabled: true,
              logic_rules: [],
            },
            demographics_step: {
              ...currentDemo,
              fields: newFields,
            },
            success_step: prev.flow?.success_step ?? {
              enabled: true,
              title: 'Terima kasih!',
              message: 'Masukan Anda membantu kami menjadi lebih baik.',
              auto_close_seconds: 5,
              show_cta: false,
            },
          },
        }
      })
    },
    []
  )

  // Remove demographic field - using useCallback to prevent re-renders
  const removeDemographicField = useCallback(
    (index: number) => {
      setConfig((prev) => {
        const currentFields = prev.flow?.demographics_step?.fields || []
        const newFields = currentFields.filter((_, i) => i !== index)

        const currentDemo = prev.flow?.demographics_step ?? {
          enabled: false,
          required: false,
          title: 'Informasi Tambahan',
          fields: [],
        }

        return {
          ...prev,
          flow: {
            rating_step: prev.flow?.rating_step ?? {
              enabled: true,
              type: 'emoji',
              scale: 5,
              title: 'Rate us',
            },
            feedback_step: prev.flow?.feedback_step ?? {
              enabled: true,
              logic_rules: [],
            },
            demographics_step: {
              ...currentDemo,
              fields: newFields,
            },
            success_step: prev.flow?.success_step ?? {
              enabled: true,
              title: 'Terima kasih!',
              message: 'Masukan Anda membantu kami menjadi lebih baik.',
              auto_close_seconds: 5,
              show_cta: false,
            },
          },
        }
      })
      toast.success('Field demografi dihapus')
    },
    []
  )

  // Create stable handlers for demographic fields to prevent input losing focus
  // Using a ref-based approach to avoid re-creating handlers on every config change
  const handlersRef = useRef<Map<string, {
    onUpdate: (updates: Partial<DemographicField>) => void
    onRemove: () => void
  }>>(new Map())

  const getOrCreateHandler = (fieldKey: string, index: number) => {
    if (!handlersRef.current.has(fieldKey)) {
      handlersRef.current.set(fieldKey, {
        onUpdate: (updates: Partial<DemographicField>) =>
          updateDemographicField(index, updates),
        onRemove: () => removeDemographicField(index),
      })
    }
    return handlersRef.current.get(fieldKey)!
  }

  // Update success step
  const updateSuccessStep = (updates: Partial<SuccessStepConfig>) => {
    setConfig((prev) => ({
      ...prev,
      flow: {
        rating_step: prev.flow?.rating_step ?? {
          enabled: true,
          type: 'emoji',
          scale: 5,
          title: 'Rate us',
        },
        feedback_step: prev.flow?.feedback_step ?? {
          enabled: true,
          logic_rules: [],
        },
        demographics_step: prev.flow?.demographics_step ?? {
          enabled: false,
          required: false,
          title: 'Informasi Tambahan',
          fields: [],
        },
        success_step: {
          ...(prev.flow?.success_step ?? {
            enabled: true,
            title: 'Terima kasih!',
            message: 'Masukan Anda membantu kami menjadi lebih baik.',
            auto_close_seconds: 5,
            show_cta: false,
          }),
          ...updates,
        },
      },
    }))
  }

  // Save config
  const saveConfig = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/dashboard/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ widgetConfig: config }),
      })
      if (res.ok) {
        toast.success('Konfigurasi widget disimpan!')
      } else {
        toast.error('Gagal menyimpan konfigurasi')
      }
    } catch {
      toast.error('Gagal menyimpan konfigurasi')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="py-8 text-center text-muted-foreground">Memuat...</div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Editor */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Konfigurasi</h3>
          <Button size="sm" onClick={saveConfig} disabled={saving}>
            {saving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="theme" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="theme">Tema</TabsTrigger>
            <TabsTrigger value="rating">Rating</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="demographics">Demografi</TabsTrigger>
            <TabsTrigger value="behavior">Perilaku</TabsTrigger>
          </TabsList>

          {/* Theme Tab */}
          <TabsContent value="theme" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tampilan Widget</CardTitle>
                <CardDescription>
                  Kustomisasi tampilan widget Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Warna Utama</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={config.theme?.primary_color || '#6366f1'}
                      onChange={(e) =>
                        updateTheme({ primary_color: e.target.value })
                      }
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={config.theme?.primary_color || '#6366f1'}
                      onChange={(e) =>
                        updateTheme({ primary_color: e.target.value })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Posisi Widget</Label>
                  <Select
                    value={config.theme?.position || 'bottom_right'}
                    onValueChange={(value) =>
                      updateTheme({
                        position: value as WidgetTheme['position'],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom_left">Kiri Bawah</SelectItem>
                      <SelectItem value="bottom_right">Kanan Bawah</SelectItem>
                      <SelectItem value="top_left">Kiri Atas</SelectItem>
                      <SelectItem value="top_right">Kanan Atas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Style Tombol</Label>
                  <Select
                    value={config.theme?.button_style || 'pill'}
                    onValueChange={(value) =>
                      updateTheme({
                        button_style: value as WidgetTheme['button_style'],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pill">Pill (Bulat)</SelectItem>
                      <SelectItem value="rounded">Rounded</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Label Trigger</Label>
                  <Input
                    value={config.theme?.trigger_label ?? 'Feedback'}
                    onChange={(e) =>
                      updateTheme({ trigger_label: e.target.value })
                    }
                    placeholder="Feedback"
                  />
                </div>

                <div className="space-y-2">
                  <Label>URL Icon Trigger (Opsional)</Label>
                  <Input
                    value={config.theme?.trigger_icon || ''}
                    onChange={(e) =>
                      updateTheme({ trigger_icon: e.target.value })
                    }
                    placeholder="https://example.com/icon.svg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Kosongkan untuk menggunakan icon default
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rating Tab */}
          <TabsContent value="rating" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Step Rating</CardTitle>
                <CardDescription>
                  Konfigurasi tampilan rating pertama
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="rating-enabled"
                    checked={config.flow?.rating_step?.enabled ?? true}
                    onCheckedChange={(checked) =>
                      updateRatingStep({ enabled: !!checked })
                    }
                  />
                  <Label htmlFor="rating-enabled">Aktifkan Step Rating</Label>
                </div>

                <div className="space-y-2">
                  <Label>Tipe Rating</Label>
                  <Select
                    value={config.flow?.rating_step?.type || 'emoji'}
                    onValueChange={(value: RatingStepConfig['type']) =>
                      updateRatingStep({ type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emoji">Emoji (😢 😐 😃)</SelectItem>
                      <SelectItem value="star">Bintang (⭐⭐⭐⭐⭐)</SelectItem>
                      <SelectItem value="number">Angka (1-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Skala Rating</Label>
                  <Select
                    value={String(config.flow?.rating_step?.scale || 5)}
                    onValueChange={(value) =>
                      updateRatingStep({ scale: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 (😢 😐 😃)</SelectItem>
                      <SelectItem value="5">5 (😢 😕 😐 🙂 😃)</SelectItem>
                      <SelectItem value="10">10 (1-10)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Pertanyaan Rating</Label>
                  <Textarea
                    value={config.flow?.rating_step?.title || ''}
                    onChange={(e) =>
                      updateRatingStep({ title: e.target.value })
                    }
                    placeholder="Seberapa puas Anda dengan layanan kami?"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Logic Feedback</CardTitle>
                    <CardDescription>
                      Atur pertanyaan berdasarkan rating
                    </CardDescription>
                  </div>
                  <Dialog open={addRuleOpen} onOpenChange={setAddRuleOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-1" />
                        Tambah Rule
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Tambah Logic Rule</DialogTitle>
                        <DialogDescription>
                          Pilih rating yang memicu rule ini
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Pilih Rating</Label>
                          <div className="flex gap-2 flex-wrap">
                            {Array.from(
                              { length: config.flow?.rating_step?.scale || 5 },
                              (_, i) => i + 1
                            ).map((rating) => (
                              <button
                                key={rating}
                                type="button"
                                onClick={() => {
                                  if (newRuleRatings.includes(rating)) {
                                    setNewRuleRatings((prev) =>
                                      prev.filter((r) => r !== rating)
                                    )
                                  } else {
                                    setNewRuleRatings((prev) => [
                                      ...prev,
                                      rating,
                                    ])
                                  }
                                }}
                                className={`w-12 h-12 rounded-lg font-bold text-lg transition-all ${
                                  newRuleRatings.includes(rating)
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-muted text-muted-foreground hover:bg-muted-foreground/10'
                                }`}
                              >
                                {rating}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setAddRuleOpen(false)}
                        >
                          Batal
                        </Button>
                        <Button onClick={addLogicRule}>Tambah</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {config.flow?.feedback_step?.logic_rules?.map((rule, index) => (
                  <LogicRuleEditor
                    key={index}
                    rule={rule}
                    index={index}
                    ratingScale={config.flow?.rating_step?.scale || 5}
                    onUpdate={(updates) => updateLogicRule(index, updates)}
                    onRemove={() => removeLogicRule(index)}
                    onAddTag={(tag) => addTagOption(index, tag)}
                    onRemoveTag={(tag) => removeTagOption(index, tag)}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Success Step */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Step Sukses</CardTitle>
                <CardDescription>
                  Tampilan setelah user submit feedback
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Judul</Label>
                  <Input
                    value={config.flow?.success_step?.title || ''}
                    onChange={(e) =>
                      updateSuccessStep({ title: e.target.value })
                    }
                    placeholder="Terima Kasih!"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Pesan</Label>
                  <Textarea
                    value={config.flow?.success_step?.message || ''}
                    onChange={(e) =>
                      updateSuccessStep({ message: e.target.value })
                    }
                    placeholder="Masukan Anda membantu kami menjadi lebih baik."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Auto Close (detik) - 0 untuk tidak auto-close</Label>
                  <Input
                    type="number"
                    value={config.flow?.success_step?.auto_close_seconds ?? 5}
                    onChange={(e) =>
                      updateSuccessStep({
                        auto_close_seconds: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="show-cta"
                    checked={config.flow?.success_step?.show_cta || false}
                    onCheckedChange={(checked) =>
                      updateSuccessStep({ show_cta: !!checked })
                    }
                  />
                  <Label htmlFor="show-cta">Tampilkan CTA Button</Label>
                </div>

                {config.flow?.success_step?.show_cta && (
                  <>
                    <div className="space-y-2">
                      <Label>CTA Text</Label>
                      <Input
                        value={config.flow?.success_step?.cta_text || ''}
                        onChange={(e) =>
                          updateSuccessStep({ cta_text: e.target.value })
                        }
                        placeholder="Beri rating di Google"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CTA URL</Label>
                      <Input
                        value={config.flow?.success_step?.cta_url || ''}
                        onChange={(e) =>
                          updateSuccessStep({ cta_url: e.target.value })
                        }
                        placeholder="https://google.com/review"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demographics Tab */}
          <TabsContent value="demographics" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Demografi User</CardTitle>
                    <CardDescription>
                      Kumpulkan data statistik user
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addDemographicField}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Tambah Field
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="demo-enabled"
                    checked={config.flow?.demographics_step?.enabled || false}
                    onCheckedChange={(checked) =>
                      updateDemographicsStep({ enabled: !!checked })
                    }
                  />
                  <Label htmlFor="demo-enabled">Aktifkan Step Demografi</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="demo-required"
                    checked={config.flow?.demographics_step?.required || false}
                    onCheckedChange={(checked) =>
                      updateDemographicsStep({ required: !!checked })
                    }
                  />
                  <Label htmlFor="demo-required">
                    Wajib diisi untuk submit
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label>Judul Step</Label>
                  <Textarea
                    value={config.flow?.demographics_step?.title || ''}
                    onChange={(e) =>
                      updateDemographicsStep({ title: e.target.value })
                    }
                    placeholder="Sedikit lagi! Lengkapi data statistik berikut:"
                    rows={2}
                  />
                </div>

                {config.flow?.demographics_step?.fields?.map((field, index) => {
                  const handler = getOrCreateHandler(field.key, index)
                  return (
                    <DemographicFieldEditor
                      key={field.key}
                      field={field}
                      index={index}
                      onUpdate={handler.onUpdate}
                      onRemove={handler.onRemove}
                    />
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Behavior Tab */}
          <TabsContent value="behavior" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Perilaku Widget</CardTitle>
                <CardDescription>Konfigurasi perilaku widget</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Branding</Label>
                    <p className="text-sm text-muted-foreground">
                      Tampilkan &quot;Powered by FeedbackApp&quot;
                    </p>
                  </div>
                  <Checkbox
                    checked={config.behavior?.show_branding !== false}
                    onCheckedChange={(checked) =>
                      updateBehavior({ show_branding: !!checked })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Persistence</Label>
                  <Select
                    value={config.behavior?.persistence || 'none'}
                    onValueChange={(value) =>
                      updateBehavior({
                        persistence: value as WidgetBehavior['persistence'],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tidak Simpan</SelectItem>
                      <SelectItem value="remember_user_info">
                        Ingat Info User
                      </SelectItem>
                      <SelectItem value="remember_session">
                        Ingat Session
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Simpan data demografi di localStorage untuk user returning
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="auto-open"
                    checked={config.behavior?.auto_open || false}
                    onCheckedChange={(checked) =>
                      updateBehavior({ auto_open: !!checked })
                    }
                  />
                  <Label htmlFor="auto-open">Auto-open widget saat load</Label>
                </div>

                {config.behavior?.auto_open && (
                  <div className="space-y-2">
                    <Label>Delay (detik)</Label>
                    <Input
                      type="number"
                      value={config.behavior?.delay_open || 0}
                      onChange={(e) =>
                        updateBehavior({
                          delay_open: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview */}
      <div className="space-y-4">
        <h3 className="font-semibold">Live Preview</h3>
        <div className="border rounded-lg p-6 bg-muted/30">
          <WidgetPreview
            key={`preview-${config.flow?.demographics_step?.enabled}-${config.flow?.demographics_step?.fields?.length || 0}`}
            config={config}
          />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Logic Rule Editor Component
// ============================================================================

interface LogicRuleEditorProps {
  rule: FeedbackLogicRule
  index: number
  ratingScale: number
  onUpdate: (updates: Partial<FeedbackLogicRule>) => void
  onRemove: () => void
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
}

function LogicRuleEditor({
  rule,
  index,
  ratingScale,
  onUpdate,
  onRemove,
  onAddTag,
  onRemoveTag,
}: LogicRuleEditorProps) {
  const [open, setOpen] = useState(true)

  const getSentimentLabel = () => {
    const avg =
      rule.trigger_ratings.reduce((a, b) => a + b, 0) /
      rule.trigger_ratings.length
    const max = ratingScale
    const percentage = avg / max

    if (percentage <= 0.4) return { label: 'Negatif', color: 'bg-red-500' }
    if (percentage <= 0.6) return { label: 'Netral', color: 'bg-yellow-500' }
    return { label: 'Positif', color: 'bg-green-500' }
  }

  const { label, color } = getSentimentLabel()

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="border rounded-lg overflow-hidden">
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 bg-muted/50 cursor-pointer hover:bg-muted/70">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${color}`} />
              <span className="font-medium">{label}</span>
              <Badge variant="outline">
                Rating: {rule.trigger_ratings.join(', ')}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove()
                }}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              {open ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-4 pt-0 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Judul</Label>
                <Input
                  value={rule.title}
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  placeholder="Judul pertanyaan"
                />
              </div>

              <div className="space-y-2">
                <Label>Subtitle (Opsional)</Label>
                <Input
                  value={rule.subtitle || ''}
                  onChange={(e) => onUpdate({ subtitle: e.target.value })}
                  placeholder="Deskripsi tambahan"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Placeholder Comment</Label>
              <Textarea
                value={rule.placeholder || ''}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                placeholder="Placeholder untuk text area..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Opsi Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {rule.tags_options?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      className="hover:text-destructive"
                      onClick={() => onRemoveTag(tag)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Tambah opsi dan tekan Enter..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onAddTag((e.target as HTMLInputElement).value)
                      ;(e.target as HTMLInputElement).value = ''
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    const input = e.currentTarget
                      .previousElementSibling as HTMLInputElement
                    onAddTag(input.value)
                    input.value = ''
                  }}
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`allow-skip-${index}`}
                  checked={rule.allow_skip_comment || false}
                  onCheckedChange={(checked) =>
                    onUpdate({ allow_skip_comment: !!checked })
                  }
                />
                <Label htmlFor={`allow-skip-${index}`}>
                  Izinkan skip comment
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id={`collect-email-${index}`}
                  checked={rule.collect_email || false}
                  onCheckedChange={(checked) =>
                    onUpdate({ collect_email: !!checked })
                  }
                />
                <Label htmlFor={`collect-email-${index}`}>
                  Kumpulkan email
                </Label>
              </div>
            </div>

            {/* CTA options for positive ratings */}
            {rule.trigger_ratings[0] / ratingScale >= 0.6 && (
              <div className="space-y-2 pt-2 border-t">
                <div className="space-y-2">
                  <Label>CTA Text (Opsional)</Label>
                  <Input
                    value={rule.cta_text || ''}
                    onChange={(e) => onUpdate({ cta_text: e.target.value })}
                    placeholder="Beri rating di Google"
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA Redirect URL</Label>
                  <Input
                    value={rule.cta_redirect || ''}
                    onChange={(e) => onUpdate({ cta_redirect: e.target.value })}
                    placeholder="https://google.com/review"
                  />
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

// ============================================================================
// Demographic Field Editor Component
// ============================================================================

interface DemographicFieldEditorProps {
  field: DemographicField
  index: number
  onUpdate: (updates: Partial<DemographicField>) => void
  onRemove: () => void
}

function DemographicFieldEditor({
  field,
  index,
  onUpdate,
  onRemove,
}: DemographicFieldEditorProps) {
  const [open, setOpen] = useState(true)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="border rounded-lg overflow-hidden">
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-3 bg-muted/50 cursor-pointer hover:bg-muted/70">
            <span className="font-medium text-sm">{field.label}</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {field.type}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove()
                }}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              {open ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-3 pt-0 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Label</Label>
                <Input
                  value={field.label}
                  onChange={(e) => onUpdate({ label: e.target.value })}
                  placeholder="Label field"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Key (ID Unik)</Label>
                <Input
                  value={field.key}
                  readOnly
                  className="bg-muted text-muted-foreground text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Tipe Input</Label>
              <Select
                value={field.type}
                onValueChange={(value: DemographicField['type']) =>
                  onUpdate({ type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="radio_group">Radio Group</SelectItem>
                  <SelectItem value="chips">Chips (Kapsul)</SelectItem>
                  <SelectItem value="select">Dropdown</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="text">Text Input</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(field.type === 'radio_group' ||
              field.type === 'chips' ||
              field.type === 'select' ||
              field.type === 'checkbox') && (
              <div className="space-y-2">
                <Label className="text-xs">Opsi</Label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {field.options?.map((opt, optIdx) => (
                    <Badge
                      key={`${opt}-${optIdx}`}
                      variant="secondary"
                      className="gap-1 text-xs"
                    >
                      {opt}
                      <button
                        type="button"
                        className="hover:text-destructive ml-1"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const newOptions = field.options?.filter((_, i) => i !== optIdx) || []
                          onUpdate({ options: newOptions })
                        }}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Tambah opsi baru..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const input = e.currentTarget
                        const value = input.value.trim()
                        if (value && !field.options?.includes(value)) {
                          const newOptions = [...(field.options || []), value]
                          onUpdate({ options: newOptions })
                          input.value = ''
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                      const value = input.value.trim()
                      if (value && !field.options?.includes(value)) {
                        const newOptions = [...(field.options || []), value]
                        onUpdate({ options: newOptions })
                        input.value = ''
                      }
                    }}
                  >
                    Tambah
                  </Button>
                </div>
              </div>
            )}

            {(field.type === 'text' || field.type === 'email') && (
              <div className="space-y-1">
                <Label className="text-xs">Placeholder</Label>
                <Input
                  value={field.placeholder || ''}
                  onChange={(e) => onUpdate({ placeholder: e.target.value })}
                  placeholder="Placeholder..."
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <Checkbox
                id={`req-${index}`}
                checked={field.required || false}
                onCheckedChange={(checked) => onUpdate({ required: !!checked })}
              />
              <Label htmlFor={`req-${index}`} className="text-sm">
                Wajib diisi
              </Label>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

// ============================================================================
// Preview Component
// ============================================================================

function WidgetPreview({ config }: { config: WidgetConfig }) {
  const [step, setStep] = useState<
    'rating' | 'feedback' | 'demographics' | 'success'
  >('rating')
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [comment, setComment] = useState('')

  // Track previous fields length to avoid unnecessary resets
  const prevFieldsLength = useRef(0)

  // Reset preview when demographics config changes
  useEffect(() => {
    const currentLength = config.flow?.demographics_step?.fields?.length || 0
    if (prevFieldsLength.current !== currentLength) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      prevFieldsLength.current = currentLength
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep('rating')
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedRating(null)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedTags([])
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setComment('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.flow?.demographics_step?.fields?.length])

  // Also reset when enabled toggle changes
  const prevEnabled = useRef(false)
  useEffect(() => {
    const currentEnabled = config.flow?.demographics_step?.enabled || false
    if (prevEnabled.current !== currentEnabled) {
      prevEnabled.current = currentEnabled
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep('rating')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.flow?.demographics_step?.enabled])

  const currentRule =
    selectedRating !== null && config.flow?.feedback_step?.logic_rules
      ? config.flow.feedback_step.logic_rules.find((r) =>
          r.trigger_ratings.includes(selectedRating)
        )
      : null

  const resetPreview = () => {
    setStep('rating')
    setSelectedRating(null)
    setSelectedTags([])
    setComment('')
  }

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating)
    if (config.flow?.feedback_step?.enabled) {
      setStep('feedback')
    } else if (config.flow?.demographics_step?.enabled) {
      setStep('demographics')
    } else {
      setStep('success')
    }
  }

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleFeedbackSubmit = () => {
    if (config.flow?.demographics_step?.enabled) {
      setStep('demographics')
    } else {
      setStep('success')
    }
  }

  const ratingScale = config.flow?.rating_step?.scale || 5
  const ratingType = config.flow?.rating_step?.type || 'emoji'

  const renderRatingButtons = () => {
    if (ratingType === 'emoji') {
      const emojis =
        ratingScale === 3 ? ['😢', '😐', '😃'] : ['😢', '😕', '😐', '🙂', '😃']
      return emojis.map((emoji, i) => (
        <button
          key={i}
          className="w-12 h-12 text-2xl rounded-lg border-2 hover:scale-110 transition-transform flex items-center justify-center"
          onClick={() => handleRatingClick(i + 1)}
        >
          {emoji}
        </button>
      ))
    }

    if (ratingType === 'star') {
      return Array.from({ length: ratingScale }, (_, i) => i + 1).map((r) => (
        <button
          key={r}
          className="w-12 h-12 rounded-full border-2 text-yellow-400 hover:bg-yellow-50 transition-colors flex items-center justify-center"
          onClick={() => handleRatingClick(r)}
        >
          <Star className="h-5 w-5 fill-current" />
        </button>
      ))
    }

    // number
    return Array.from({ length: ratingScale }, (_, i) => i + 1).map((r) => (
      <button
        key={r}
        className="w-12 h-12 rounded-lg border-2 font-bold hover:bg-muted transition-colors flex items-center justify-center"
        style={{ borderColor: config.theme?.primary_color || '#6366f1' }}
        onClick={() => handleRatingClick(r)}
      >
        {r}
      </button>
    ))
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px]">
      {/* Trigger Button */}
      <div
        className={`font-medium cursor-pointer shadow-lg flex items-center gap-2 text-white ${
          config.theme?.button_style === 'pill'
            ? 'px-5 py-2.5 rounded-full'
            : config.theme?.button_style === 'square'
              ? 'px-4 py-3 rounded-lg'
              : 'px-4 py-2 rounded-full'
        }`}
        style={{ backgroundColor: config.theme?.primary_color || '#6366f1' }}
      >
        {config.theme?.trigger_icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={config.theme.trigger_icon} alt="" className="w-5 h-5" />
        ) : (
          <span>💬</span>
        )}
        <span>{config.theme?.trigger_label || 'Feedback'}</span>
      </div>

      {/* Widget Modal */}
      <div className="mt-4 bg-white dark:bg-slate-900 rounded-lg shadow-xl border p-4 w-full max-w-sm">
        {step === 'rating' && (
          <div className="text-center">
            <h4 className="font-medium mb-1">
              {config.flow?.rating_step?.title}
            </h4>
            <div className="flex justify-center gap-2">
              {renderRatingButtons()}
            </div>
          </div>
        )}

        {step === 'feedback' && currentRule && (
          <div className="text-center">
            {currentRule.subtitle && (
              <p className="text-sm text-muted-foreground mb-2">
                {currentRule.subtitle}
              </p>
            )}
            <h4 className="font-medium mb-3">{currentRule.title}</h4>

            <Textarea
              className="w-full mb-3 min-h-[60px]"
              placeholder={currentRule.placeholder}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            {currentRule.tags_options &&
              currentRule.tags_options.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center mb-3">
                  {currentRule.tags_options.map((tag) => (
                    <Badge
                      key={tag}
                      variant={
                        selectedTags.includes(tag) ? 'default' : 'outline'
                      }
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

            {currentRule.collect_email && (
              <Input
                type="email"
                placeholder="Email Anda (opsional)"
                className="w-full mb-3"
              />
            )}

            <button
              className="w-full py-2 rounded text-white font-medium text-sm"
              style={{
                backgroundColor: config.theme?.primary_color || '#6366f1',
              }}
              onClick={handleFeedbackSubmit}
            >
              Lanjut
            </button>

            <button
              className="w-full py-2 text-sm text-muted-foreground mt-1"
              onClick={resetPreview}
            >
              Kembali
            </button>
          </div>
        )}

        {step === 'demographics' && (
          <div className="text-center">
            <h4 className="font-medium mb-3">
              {config.flow?.demographics_step?.title}
            </h4>
            <div className="space-y-3 text-left">
              {config.flow?.demographics_step?.fields
                ?.slice(0, 3)
                .map((field) => (
                  <div key={field.key} className="space-y-1">
                    <Label className="text-sm">{field.label}</Label>
                    {field.type === 'select' ? (
                      <select className="w-full border rounded p-2 text-sm">
                        <option>Pilih...</option>
                        {field.options?.map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'radio_group' ? (
                      <div className="flex gap-2">
                        {field.options?.map((opt) => (
                          <label
                            key={opt}
                            className="flex items-center gap-1 text-sm"
                          >
                            <input type="radio" name={field.key} /> {opt}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <Input placeholder="..." className="text-sm" />
                    )}
                  </div>
                ))}
            </div>

            <button
              className="w-full py-2 rounded text-white font-medium text-sm mt-4"
              style={{
                backgroundColor: config.theme?.primary_color || '#6366f1',
              }}
              onClick={() => setStep('success')}
            >
              Submit
            </button>

            <button
              className="w-full py-2 text-sm text-muted-foreground mt-1"
              onClick={resetPreview}
            >
              Kembali
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-4">
            <div className="text-4xl mb-2">✅</div>
            <h4 className="font-medium mb-1">
              {config.flow?.success_step?.title}
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              {config.flow?.success_step?.message}
            </p>

            {config.flow?.success_step?.show_cta && (
              <a
                href={config.flow.success_step.cta_url || '#'}
                className="block w-full py-2 rounded text-white font-medium text-sm"
                style={{
                  backgroundColor: config.theme?.primary_color || '#6366f1',
                }}
              >
                {config.flow?.success_step.cta_text || 'CTA'}
              </a>
            )}

            <button
              className="w-full py-2 text-sm text-muted-foreground mt-2"
              onClick={resetPreview}
            >
              Reset Preview
            </button>
          </div>
        )}

        {config.behavior?.show_branding !== false && (
          <div className="mt-3 pt-3 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Powered by FeedbackApp
            </p>
          </div>
        )}
      </div>

      <button
        className="mt-4 text-sm text-muted-foreground underline"
        onClick={resetPreview}
      >
        Reset Preview
      </button>
    </div>
  )
}
