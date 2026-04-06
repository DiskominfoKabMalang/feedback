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
import { DataTable } from '@/components/data-table'
import {
  getFeedbacksColumns,
  type Feedback,
} from '@/components/data-table/columns/feedbacks'
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
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { useState, useCallback, useEffect, useRef } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { id } from 'date-fns/locale'

interface FeedbackInboxClientProps {
  projectId: string
  initialFilters: {
    rating?: string
    status?: string
    tag?: string
  }
}

export function FeedbackInboxClient({
  projectId,
  initialFilters,
}: FeedbackInboxClientProps) {
  const [data, setData] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  )
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const mountedRef = useRef(true)

  // Fetch feedbacks
  const fetchFeedbacks = useCallback(
    async (filters?: { rating?: string; status?: string; tag?: string }) => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        if (filters?.rating) params.set('min_rating', filters.rating)
        if (filters?.status) params.set('status', filters.status)
        if (filters?.tag) params.set('tag', filters.tag)

        const response = await fetch(
          `/api/dashboard/projects/${projectId}/feedbacks?${params}`
        )
        if (!response.ok) throw new Error('Failed to fetch feedbacks')
        const result = await response.json()

        if (mountedRef.current) {
          setData(result.data || [])
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error)
        toast.error('Gagal memuat feedback')
      } finally {
        if (mountedRef.current) {
          setIsLoading(false)
        }
      }
    },
    [projectId]
  )

  // Initial fetch
  useEffect(() => {
    mountedRef.current = true
    fetchFeedbacks(initialFilters)

    return () => {
      mountedRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  // Handle status change
  const handleStatusChange = useCallback(
    async (feedback: Feedback, newStatus: string) => {
      try {
        const response = await fetch(
          `/api/dashboard/feedbacks/${feedback.id}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
          }
        )

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Gagal mengubah status')
        }

        toast.success(`Ditandai sebagai ${newStatus}`)
        fetchFeedbacks(initialFilters)
      } catch (error) {
        console.error('Error updating status:', error)
        toast.error(
          error instanceof Error ? error.message : 'Gagal mengubah status'
        )
      }
    },
    [initialFilters, fetchFeedbacks]
  )

  // Handle delete
  const handleDelete = useCallback(
    async (feedback: Feedback) => {
      const confirmed = window.confirm(
        'Apakah Anda yakin ingin menghapus feedback ini?'
      )
      if (!confirmed) return

      try {
        const response = await fetch(
          `/api/dashboard/feedbacks/${feedback.id}`,
          {
            method: 'DELETE',
          }
        )

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Gagal menghapus feedback')
        }

        toast.success('Feedback dihapus')
        fetchFeedbacks(initialFilters)
      } catch (error) {
        console.error('Error deleting feedback:', error)
        toast.error(
          error instanceof Error ? error.message : 'Gagal menghapus feedback'
        )
      }
    },
    [initialFilters, fetchFeedbacks]
  )

  // Handle view details
  const handleView = useCallback((feedback: Feedback) => {
    setSelectedFeedback(feedback)
    setIsDrawerOpen(true)
  }, [])

  // Handle bulk archive
  const handleBulkArchive = useCallback(
    async (selectedFeedbacks: Feedback[]) => {
      if (selectedFeedbacks.length === 0) return

      try {
        await Promise.all(
          selectedFeedbacks.map((feedback) =>
            fetch(`/api/dashboard/feedbacks/${feedback.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'archived' }),
            })
          )
        )

        toast.success(`${selectedFeedbacks.length} feedback diarsipkan`)
        fetchFeedbacks(initialFilters)
      } catch (error) {
        console.error('Error archiving feedbacks:', error)
        toast.error('Gagal mengarsipkan feedback')
      }
    },
    [initialFilters, fetchFeedbacks]
  )

  // Handle bulk delete
  const handleBulkDelete = useCallback(
    async (selectedFeedbacks: Feedback[]) => {
      if (selectedFeedbacks.length === 0) return

      const confirmed = window.confirm(
        `Hapus ${selectedFeedbacks.length} feedback?`
      )
      if (!confirmed) return

      try {
        await Promise.all(
          selectedFeedbacks.map((feedback) =>
            fetch(`/api/dashboard/feedbacks/${feedback.id}`, {
              method: 'DELETE',
            })
          )
        )

        toast.success(`${selectedFeedbacks.length} feedback dihapus`)
        fetchFeedbacks(initialFilters)
      } catch (error) {
        console.error('Error deleting feedbacks:', error)
        toast.error('Gagal menghapus feedback')
      }
    },
    [initialFilters, fetchFeedbacks]
  )

  // Handle bulk mark as read
  const handleBulkMarkRead = useCallback(
    async (selectedFeedbacks: Feedback[]) => {
      if (selectedFeedbacks.length === 0) return

      try {
        await Promise.all(
          selectedFeedbacks.map((feedback) =>
            fetch(`/api/dashboard/feedbacks/${feedback.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'read' }),
            })
          )
        )

        toast.success(`${selectedFeedbacks.length} feedback ditandai sebagai dibaca`)
        fetchFeedbacks(initialFilters)
      } catch (error) {
        console.error('Error updating feedbacks:', error)
        toast.error('Gagal mengubah feedback')
      }
    },
    [initialFilters, fetchFeedbacks]
  )

  // Create columns
  const columns = getFeedbacksColumns({
    onView: handleView,
    onStatusChange: handleStatusChange,
    onDelete: handleDelete,
  })

  // Build rating filter options (static 1-5 stars)
  const ratingOptions = [
    { label: '5 Bintang', value: '5' },
    { label: '4 Bintang', value: '4' },
    { label: '3 Bintang', value: '3' },
    { label: '2 Bintang', value: '2' },
    { label: '1 Bintang', value: '1' },
  ]

  // Build status filter options
  const statusOptions = [
    { label: 'Baru', value: 'new' },
    { label: 'Dibaca', value: 'read' },
    { label: 'Diarsipkan', value: 'archived' },
  ]

  const statusLabels: Record<string, string> = {
    new: 'Baru',
    read: 'Dibaca',
    archived: 'Diarsipkan',
  }

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
            onClick={() => fetchFeedbacks(initialFilters)}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Segarkan
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Ekspor CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {data.length}
            </CardTitle>
            <CardDescription>Total Feedback</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {data.filter((f) => f.status === 'new').length}
            </CardTitle>
            <CardDescription>Baru</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {data.filter((f) => f.rating >= 4).length}
            </CardTitle>
            <CardDescription>Positif (4-5)</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {data.filter((f) => f.rating <= 2).length}
            </CardTitle>
            <CardDescription>Negatif (1-2)</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Semua Feedback</CardTitle>
          <CardDescription>Kelola dan tanggapi feedback pengguna</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            filterKey="comment"
            toolbarPlaceholder="Cari feedback..."
            isLoading={isLoading}
            facetedFilters={[
              {
                columnId: 'rating',
                title: 'Rating',
                options: ratingOptions,
              },
              {
                columnId: 'status',
                title: 'Status',
                options: statusOptions,
              },
            ]}
            renderActionBar={(table) => {
              const selectedRows = table.getFilteredSelectedRowModel().rows
              const selectedFeedbacks = selectedRows.map((row) => row.original)

              return (
                <ActionBar
                  open={selectedRows.length > 0}
                  onOpenChange={(open) => {
                    if (!open) {
                      table.toggleAllRowsSelected(false)
                    }
                  }}
                >
                  <ActionBarSelection>
                    {selectedRows.length} dipilih
                  </ActionBarSelection>
                  <ActionBarSeparator />
                  <ActionBarGroup>
                    <ActionBarItem
                      onSelect={() => handleBulkMarkRead(selectedFeedbacks)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Tandai Dibaca
                    </ActionBarItem>
                    <ActionBarItem
                      onSelect={() => handleBulkArchive(selectedFeedbacks)}
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      Arsipkan
                    </ActionBarItem>
                    <ActionBarItem
                      className="text-destructive focus:text-destructive"
                      onSelect={() => handleBulkDelete(selectedFeedbacks)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus
                    </ActionBarItem>
                  </ActionBarGroup>
                  <ActionBarClose>
                    <X className="h-4 w-4" />
                  </ActionBarClose>
                </ActionBar>
              )
            }}
          />
        </CardContent>
      </Card>

      {/* Details Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="sm:max-w-lg">
          {selectedFeedback && (
            <>
              <DrawerHeader>
                <DrawerTitle>Detail Feedback</DrawerTitle>
              </DrawerHeader>
              <div className="p-6 space-y-6">
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
                      {statusLabels[selectedFeedback.status] || selectedFeedback.status}
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
                    {formatDistanceToNow(new Date(selectedFeedback.createdAt), {
                      addSuffix: true,
                      locale: id,
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  {selectedFeedback.status === 'new' && (
                    <Button
                      size="sm"
                      onClick={() => {
                        handleStatusChange(selectedFeedback, 'read')
                        setIsDrawerOpen(false)
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
                      setIsDrawerOpen(false)
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
                      setIsDrawerOpen(false)
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                  </Button>
                </div>
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  )
}
