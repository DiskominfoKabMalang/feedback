'use client'

import {
  Inbox,
  Download,
  RefreshCw,
  Archive,
  Trash2,
  Check,
  X,
  Mail,
  Globe,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ActionBar,
  ActionBarSelection,
  ActionBarSeparator,
  ActionBarGroup,
  ActionBarItem,
  ActionBarClose,
} from '@/components/ui/action-bar'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState, useCallback, useEffect, useRef } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { id } from 'date-fns/locale'
import { useSearchParams, useRouter } from 'next/navigation'

interface Feedback {
  id: string
  rating: number
  status: string
  answers: {
    tags?: string[]
    comment?: string
    email?: string
  }
  meta?: {
    url?: string
    browser?: string
    os?: string
  }
  createdAt: string
}

interface PaginationData {
  current_page: number
  total_pages: number
  total_items: number
  items_per_page: number
  has_next: boolean
  has_prev: boolean
}

interface FeedbackInboxClientProps {
  projectId: string
  initialFilters: {
    rating?: string
    status?: string
    tag?: string
  }
}

const statusLabels: Record<string, string> = {
  new: 'Baru',
  read: 'Dibaca',
  archived: 'Diarsipkan',
}

export function FeedbackInboxClient({
  projectId,
  initialFilters,
}: FeedbackInboxClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  // State
  const [data, setData] = useState<Feedback[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 10,
    has_next: false,
    has_prev: false,
  })
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    positive: 0,
    negative: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const mountedRef = useRef(true)

  // Get current filters from URL
  const getCurrentFilters = useCallback(() => {
    return {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      min_rating: searchParams.get('rating') || '',
      status: searchParams.get('status') || '',
      tag: searchParams.get('tag') || '',
      search: searchParams.get('search') || '',
    }
  }, [searchParams])

  // Update URL with filters
  const updateFilters = useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
          params.delete(key)
        } else {
          params.set(key, String(value))
        }
      })

      // Reset to page 1 when filters change (except page itself)
      if (!updates.page) {
        params.set('page', '1')
      }

      router.push(`?${params.toString()}`, { scroll: false })
    },
    [searchParams, router]
  )

  // Fetch feedbacks with pagination
  const fetchFeedbacks = useCallback(async () => {
    setIsLoading(true)
    try {
      const filters = getCurrentFilters()
      const params = new URLSearchParams()

      if (filters.page) params.set('page', filters.page)
      if (filters.limit) params.set('limit', filters.limit)
      if (filters.min_rating) params.set('min_rating', filters.min_rating)
      if (filters.status) params.set('status', filters.status)
      if (filters.tag) params.set('tag', filters.tag)
      if (filters.search) params.set('search', filters.search)

      const response = await fetch(
        `/api/dashboard/projects/${projectId}/feedbacks?${params}`
      )

      if (!response.ok) throw new Error('Failed to fetch feedbacks')

      const result = await response.json()

      if (mountedRef.current) {
        setData(result.data || [])
        setPagination(result.pagination || pagination)

        // Calculate stats from current data (for better UX, show stats for filtered results)
        setStats({
          total: result.pagination?.total_items || 0,
          new: result.data?.filter((f: Feedback) => f.status === 'new').length || 0,
          positive: result.data?.filter((f: Feedback) => f.rating >= 4).length || 0,
          negative: result.data?.filter((f: Feedback) => f.rating <= 2).length || 0,
        })
        setSelectedIds(new Set())
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error)
      toast.error('Gagal memuat feedback')
    } finally {
      if (mountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [projectId, getCurrentFilters, pagination])

  // Initial fetch and refetch on URL change
  useEffect(() => {
    mountedRef.current = true
    fetchFeedbacks()

    return () => {
      mountedRef.current = false
    }
  }, [fetchFeedbacks])

  // Handle status change
  const handleStatusChange = useCallback(
    async (feedback: Feedback, newStatus: string) => {
      try {
        const response = await fetch(`/api/dashboard/feedbacks/${feedback.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Gagal mengubah status')
        }

        toast.success(`Ditandai sebagai ${statusLabels[newStatus] || newStatus}`)
        fetchFeedbacks()
      } catch (error) {
        console.error('Error updating status:', error)
        toast.error(
          error instanceof Error ? error.message : 'Gagal mengubah status'
        )
      }
    },
    [fetchFeedbacks]
  )

  // Handle delete
  const handleDelete = useCallback(
    async (feedback: Feedback) => {
      const confirmed = window.confirm(
        'Apakah Anda yakin ingin menghapus feedback ini?'
      )
      if (!confirmed) return

      try {
        const response = await fetch(`/api/dashboard/feedbacks/${feedback.id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Gagal menghapus feedback')
        }

        toast.success('Feedback dihapus')
        fetchFeedbacks()
      } catch (error) {
        console.error('Error deleting feedback:', error)
        toast.error(
          error instanceof Error ? error.message : 'Gagal menghapus feedback'
        )
      }
    },
    [fetchFeedbacks]
  )

  // Handle view details
  const handleView = useCallback((feedback: Feedback) => {
    setSelectedFeedback(feedback)
    setIsDialogOpen(true)
  }, [])

  // Handle bulk actions
  const handleBulkAction = useCallback(
    async (action: 'read' | 'archived' | 'delete') => {
      if (selectedIds.size === 0) return

      const isDelete = action === 'delete'
      const confirmed = isDelete
        ? window.confirm(`Hapus ${selectedIds.size} feedback?`)
        : true

      if (!confirmed) return

      try {
        const endpoint = `/api/dashboard/projects/${projectId}/feedbacks`

        if (isDelete) {
          await Promise.all(
            Array.from(selectedIds).map((id) =>
              fetch(`/api/dashboard/feedbacks/${id}`, { method: 'DELETE' })
            )
          )
          toast.success(`${selectedIds.size} feedback dihapus`)
        } else {
          await fetch(endpoint, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              feedback_ids: Array.from(selectedIds),
              status: action,
            }),
          })
          toast.success(
            `${selectedIds.size} feedback ditandai sebagai ${statusLabels[action]}`
          )
        }

        fetchFeedbacks()
      } catch (error) {
        console.error('Error performing bulk action:', error)
        toast.error('Gagal melakukan aksi bulk')
      }
    },
    [selectedIds, projectId, fetchFeedbacks]
  )

  // Handle select all
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedIds(new Set(data.map((f) => f.id)))
      } else {
        setSelectedIds(new Set())
      }
    },
    [data]
  )

  // Handle select one
  const handleSelectOne = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }, [])

  // Filter options
  const ratingOptions = [
    { label: 'Semua Rating', value: 'all' },
    { label: '5 Bintang', value: '5' },
    { label: '4 Bintang', value: '4' },
    { label: '3 Bintang', value: '3' },
    { label: '2 Bintang', value: '2' },
    { label: '1 Bintang', value: '1' },
  ]

  const statusOptions = [
    { label: 'Semua Status', value: 'all' },
    { label: 'Baru', value: 'new' },
    { label: 'Dibaca', value: 'read' },
    { label: 'Diarsipkan', value: 'archived' },
  ]

  const pageSizeOptions = ['10', '20', '50', '100']

  const currentRating = searchParams.get('rating') || 'all'
  const currentStatus = searchParams.get('status') || 'all'
  const currentLimit = searchParams.get('limit') || '10'
  const searchQuery = searchParams.get('search') || ''

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Inbox className="h-6 w-6" />
            Kotak Masuk Feedback
          </h2>
          <p className="text-muted-foreground">
            Lihat dan kelola semua feedback dari pengguna
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              router.push('?page=1&limit=10', { scroll: false })
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Segarkan
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a
              href={`/api/dashboard/projects/${projectId}/feedbacks/export`}
              target="_blank"
            >
              <Download className="mr-2 h-4 w-4" />
              Ekspor CSV
            </a>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Cari komentar..."
                value={searchQuery}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background"
              />
            </div>

            {/* Rating Filter */}
            <Select
              value={currentRating}
              onValueChange={(value) =>
                updateFilters({ rating: value === 'all' ? null : value })
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                {ratingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={currentStatus}
              onValueChange={(value) =>
                updateFilters({ status: value === 'all' ? null : value })
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {(currentRating !== 'all' || currentStatus !== 'all' || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  updateFilters({
                    rating: null,
                    status: null,
                    search: null,
                  })
                }
              >
                <X className="mr-2 h-4 w-4" />
                Reset Filter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {isLoading ? '...' : stats.total}
            </CardTitle>
            <CardDescription>Total Feedback</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
              {isLoading ? '...' : stats.new}
            </CardTitle>
            <CardDescription>Baru</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-semibold tabular-nums text-amber-600 dark:text-amber-400">
              {isLoading ? '...' : stats.positive}
            </CardTitle>
            <CardDescription>Positif (4-5)</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-semibold tabular-nums text-rose-600 dark:text-rose-400">
              {isLoading ? '...' : stats.negative}
            </CardTitle>
            <CardDescription>Negatif (1-2)</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Semua Feedback{' '}
            {!isLoading && `(${pagination.total_items} total)`}
          </CardTitle>
          <CardDescription>
            Kelola dan tanggapi feedback pengguna
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-muted/50 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-12">
              <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Tidak ada feedback ditemukan</p>
            </div>
          ) : (
            <>
              <div className="border rounded-lg divide-y">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 text-sm font-medium">
                  <div className="col-span-1 flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.size === data.length && data.length > 0
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                  <div className="col-span-1">Rating</div>
                  <div className="col-span-5">Komentar</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Tanggal</div>
                  <div className="col-span-1">Aksi</div>
                </div>

                {/* Rows */}
                {data.map((feedback) => {
                  const isPositive = feedback.rating >= 4
                  const isNegative = feedback.rating <= 2
                  const isSelected = selectedIds.has(feedback.id)

                  return (
                    <div
                      key={feedback.id}
                      className={cn(
                        'grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-muted/30 transition-colors',
                        isSelected && 'bg-muted/50'
                      )}
                    >
                      {/* Checkbox */}
                      <div className="col-span-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) =>
                            handleSelectOne(feedback.id, e.target.checked)
                          }
                          className="w-4 h-4"
                        />
                      </div>

                      {/* Rating */}
                      <div className="col-span-1">
                        <div
                          className={cn(
                            'flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold',
                            isPositive &&
                              'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                            isNegative &&
                              'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
                            !isPositive &&
                              !isNegative &&
                              'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          )}
                        >
                          {feedback.rating}
                        </div>
                      </div>

                      {/* Comment */}
                      <div className="col-span-5">
                        <p className="text-sm line-clamp-2">
                          {feedback.answers?.comment || '-'}
                        </p>
                        {feedback.answers?.tags &&
                          feedback.answers.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {feedback.answers.tags.slice(0, 2).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {feedback.answers.tags.length > 2 && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0"
                                >
                                  +{feedback.answers.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                      </div>

                      {/* Status */}
                      <div className="col-span-2">
                        <Badge
                          variant={
                            feedback.status === 'new'
                              ? 'default'
                              : feedback.status === 'archived'
                                ? 'outline'
                                : 'secondary'
                          }
                          className="text-xs"
                        >
                          {statusLabels[feedback.status] || feedback.status}
                        </Badge>
                      </div>

                      {/* Date */}
                      <div className="col-span-2 text-sm text-muted-foreground">
                        {formatDistanceToNow(
                          new Date(feedback.createdAt),
                          { addSuffix: true, locale: id }
                        )}
                      </div>

                      {/* Actions */}
                      <div className="col-span-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(feedback)}
                        >
                          Detail
                        </Button>
                      </div>
                    </div>
                  )}
                )}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 px-2">
                <div className="text-sm text-muted-foreground">
                  Menampilkan {(pagination.current_page - 1) * pagination.items_per_page + 1} -{' '}
                  {Math.min(
                    pagination.current_page * pagination.items_per_page,
                    pagination.total_items
                  )}{' '}
                  dari {pagination.total_items} feedback
                </div>

                <div className="flex items-center gap-2">
                  {/* Page Size */}
                  <Select
                    value={currentLimit}
                    onValueChange={(value) => updateFilters({ limit: value })}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {pageSizeOptions.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Page Navigation */}
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => updateFilters({ page: 1 })}
                    disabled={!pagination.has_prev}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() =>
                      updateFilters({ page: pagination.current_page - 1 })
                    }
                    disabled={!pagination.has_prev}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm w-12 text-center">
                    {pagination.current_page} / {pagination.total_pages}
                  </span>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() =>
                      updateFilters({ page: pagination.current_page + 1 })
                    }
                    disabled={!pagination.has_next}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() =>
                      updateFilters({ page: pagination.total_pages })
                    }
                    disabled={!pagination.has_next}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <ActionBar
          open={selectedIds.size > 0}
          onOpenChange={(open) => {
            if (!open) setSelectedIds(new Set())
          }}
        >
          <ActionBarSelection>{selectedIds.size} dipilih</ActionBarSelection>
          <ActionBarSeparator />
          <ActionBarGroup>
            <ActionBarItem onSelect={() => handleBulkAction('read')}>
              <Check className="mr-2 h-4 w-4" />
              Tandai Dibaca
            </ActionBarItem>
            <ActionBarItem onSelect={() => handleBulkAction('archived')}>
              <Archive className="mr-2 h-4 w-4" />
              Arsipkan
            </ActionBarItem>
            <ActionBarItem
              className="text-destructive focus:text-destructive"
              onSelect={() => handleBulkAction('delete')}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </ActionBarItem>
          </ActionBarGroup>
          <ActionBarClose>
            <X className="h-4 w-4" />
          </ActionBarClose>
        </ActionBar>
      )}

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedFeedback && (
            <>
              <DialogHeader>
                <DialogTitle>Detail Feedback</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Rating */}
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Rating
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-5 w-5',
                          i < selectedFeedback.rating
                            ? 'fill-amber-500 text-amber-500'
                            : 'text-muted-foreground'
                        )}
                      />
                    ))}
                    <span className="text-lg font-semibold ml-2">
                      {selectedFeedback.rating}/5
                    </span>
                  </div>
                </div>

                {/* Comment */}
                {selectedFeedback.answers?.comment && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Komentar
                    </span>
                    <p className="mt-1 text-sm leading-relaxed">
                      {selectedFeedback.answers.comment}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {selectedFeedback.answers?.tags &&
                  selectedFeedback.answers.tags.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Tag
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {selectedFeedback.answers.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Email */}
                {selectedFeedback.answers?.email && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      Email
                    </span>
                    <p className="mt-1 text-sm">
                      {selectedFeedback.answers.email}
                    </p>
                  </div>
                )}

                {/* Meta */}
                {selectedFeedback.meta && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Metadata
                    </span>
                    <div className="mt-2 space-y-1">
                      {selectedFeedback.meta.url && (
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">Sumber:</span>
                          <span className="truncate">
                            {selectedFeedback.meta.url}
                          </span>
                        </div>
                      )}
                      {selectedFeedback.meta.browser && (
                        <div className="text-sm text-muted-foreground">
                          Browser: {selectedFeedback.meta.browser}
                        </div>
                      )}
                      {selectedFeedback.meta.os && (
                        <div className="text-sm text-muted-foreground">
                          OS: {selectedFeedback.meta.os}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Status
                  </span>
                  <div className="mt-1">
                    <Badge
                      variant={
                        selectedFeedback.status === 'new'
                          ? 'default'
                          : selectedFeedback.status === 'read'
                            ? 'secondary'
                            : 'outline'
                      }
                      className="capitalize"
                    >
                      {statusLabels[selectedFeedback.status] ||
                        selectedFeedback.status}
                    </Badge>
                  </div>
                </div>

                {/* Date */}
                <div>
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Diterima
                  </span>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDistanceToNow(
                      new Date(selectedFeedback.createdAt),
                      { addSuffix: true, locale: id }
                    )}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  {selectedFeedback.status === 'new' && (
                    <Button
                      size="sm"
                      onClick={() => {
                        handleStatusChange(selectedFeedback, 'read')
                        setIsDialogOpen(false)
                      }}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Tandai Dibaca
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      handleStatusChange(selectedFeedback, 'archived')
                      setIsDialogOpen(false)
                    }}
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    Arsipkan
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      handleDelete(selectedFeedback)
                      setIsDialogOpen(false)
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
