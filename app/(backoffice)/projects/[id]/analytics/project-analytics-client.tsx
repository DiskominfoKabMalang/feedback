'use client'

import { useEffect, useState, useCallback } from 'react'
import { Users, TrendingUp, PieChart, BarChart3, Filter, X, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

// Recharts components
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
  Legend,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'

// Types
interface DemographicField {
  label: string
  total: number
  distribution: Array<{
    value: string
    count: number
    percentage: number
  }>
}

interface CorrelationData {
  value: string
  avg_rating: number
  count: number
}

interface TrendData {
  date: string
  rating: number
  count: number
}

interface SegmentData {
  label: string
  count: number
  percentage: number
  avg_rating?: number
}

interface SegmentPair {
  field1: string
  field2: string
  combinations: Array<{
    value1: string
    value2: string
    count: number
    avg_rating: number
  }>
}

interface AnalyticsData {
  summary: {
    total_feedbacks: number
    with_demographics: number
    demographics_coverage: number
    fields_count: number
    applied_filters: Record<string, string>
  }
  available_filters: Record<string, { label: string; values: string[] }>
  demographics: Record<string, DemographicField>
  trends: {
    by_date: TrendData[]
  }
  correlations: Record<string, CorrelationData[]>
  segments: Record<string, SegmentData[]>
  segment_pairs: SegmentPair[]
}

interface ProjectAnalyticsClientProps {
  projectId: string
  range: string
}

// Chart colors
const COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f43f5e', // rose
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#06b6d4', // cyan
  '#3b82f6', // blue
]

const RATING_COLORS = {
  1: '#ef4444',
  2: '#f97316',
  3: '#eab308',
  4: '#84cc16',
  5: '#22c55e',
}

export function ProjectAnalyticsClient({ projectId, range }: ProjectAnalyticsClientProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedRange, setSelectedRange] = useState(range)
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [breakdownField, setBreakdownField] = useState<string | null>(null)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ range: selectedRange })
      if (Object.keys(activeFilters).length > 0) {
        params.set('filters', JSON.stringify(activeFilters))
      }
      if (breakdownField) {
        params.set('breakdown', breakdownField)
      }

      const res = await fetch(
        `/api/dashboard/projects/${projectId}/analytics?${params.toString()}`
      )
      if (res.ok) {
        const result = await res.json()
        setData(result)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }, [projectId, selectedRange, activeFilters, breakdownField])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const addFilter = (field: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [field]: value }))
  }

  const removeFilter = (field: string) => {
    setActiveFilters((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
    if (breakdownField === field) {
      setBreakdownField(null)
    }
  }

  const clearAllFilters = () => {
    setActiveFilters({})
    setBreakdownField(null)
  }

  if (loading) {
    return <AnalyticsSkeleton />
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Gagal memuat data analisis
      </div>
    )
  }

  const demographicEntries = Object.entries(data.demographics)
  const correlationEntries = Object.entries(data.correlations)
  const availableFieldEntries = Object.entries(data.available_filters)

  // Process trend data for line chart
  const trendDataByDate = data.trends.by_date.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = { date: item.date }
    }
    acc[item.date][`rating_${item.rating}`] = item.count
    return acc
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, {} as Record<string, any>)

  const trendChartData = Object.values(trendDataByDate).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // Get available fields for breakdown (excluding filtered fields)
  const availableBreakdownFields = availableFieldEntries.filter(
    ([field]) => !activeFilters[field]
  )

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <Select value={selectedRange} onValueChange={setSelectedRange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Pilih periode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 Hari Terakhir</SelectItem>
            <SelectItem value="30d">30 Hari Terakhir</SelectItem>
            <SelectItem value="this_month">Bulan Ini</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className={cn(showAdvancedFilters && 'bg-accent')}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filter {Object.keys(activeFilters).length > 0 && `(${Object.keys(activeFilters).length})`}
        </Button>

        {Object.keys(activeFilters).length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="mr-2 h-4 w-4" />
            Reset Filter
          </Button>
        )}

        <Button variant="outline" size="sm" onClick={fetchAnalytics}>
          <TrendingUp className="mr-2 h-4 w-4" />
          Segarkan
        </Button>
      </div>

      {/* Active Filters Display */}
      {Object.keys(activeFilters).length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Filter Aktif:</span>
              {Object.entries(activeFilters).map(([field, value]) => (
                <Badge key={field} variant="secondary" className="gap-1">
                  {data.available_filters[field]?.label || field}: {value}
                  <button
                    onClick={() => removeFilter(field)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                ({data.summary.total_feedbacks} feedback cocok)
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <Card>
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filter Lanjutan</CardTitle>
                  <ChevronDown className="h-5 w-5" />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4 pt-0">
                {/* Filter Builder */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {availableFieldEntries.map(([field, { label, values }]) => {
                    const isFiltered = !!activeFilters[field]
                    return (
                      <div key={field} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">{label}</label>
                          {isFiltered && (
                            <button
                              onClick={() => removeFilter(field)}
                              className="text-xs text-destructive hover:underline"
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                        <Select
                          value={activeFilters[field] || 'all'}
                          onValueChange={(value) => addFilter(field, value === 'all' ? '' : value)}
                        >
                          <SelectTrigger className={cn(isFiltered && 'border-primary')}>
                            <SelectValue placeholder={`Pilih ${label.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Semua</SelectItem>
                            {values.map((value) => (
                              <SelectItem key={value} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )
                  })}
                </div>

                {/* Breakdown Selection */}
                {Object.keys(activeFilters).length > 0 && (
                  <div className="pt-4 border-t space-y-2">
                    <label className="text-sm font-medium">Breakdown Analysis</label>
                    <p className="text-xs text-muted-foreground">
                      Pilih field untuk melihat breakdown lebih detail dari filter yang aktif
                    </p>
                    <Select value={breakdownField || 'none'} onValueChange={(value) => setBreakdownField(value === 'none' ? null : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih field breakdown" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Tanpa breakdown</SelectItem>
                        {availableBreakdownFields.map(([field, { label }]) => (
                          <SelectItem key={field} value={field}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {data.summary.total_feedbacks}
            </CardTitle>
            <CardDescription>
              {Object.keys(activeFilters).length > 0 ? 'Filtered ' : ''}Feedback
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {data.summary.with_demographics}
            </CardTitle>
            <CardDescription>Dengan Demografi</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-semibold tabular-nums text-primary">
              {data.summary.demographics_coverage}%
            </CardTitle>
            <CardDescription>Cakupan Data</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {data.summary.fields_count}
            </CardTitle>
            <CardDescription>Field Demografi</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {demographicEntries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">
              Belum ada data demografi
            </p>
            <p className="text-sm text-muted-foreground">
              Aktifkan step demografi di Widget Builder untuk mulai mengumpulkan data.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Breakdown Analysis (when filters and breakdown are active) */}
          {data.segments?.by_breakdown && (
            <BreakdownAnalysisCard segments={data.segments.by_breakdown} />
          )}

          {/* Demographics Distribution */}
          <div className="grid gap-6 lg:grid-cols-2">
            {demographicEntries.map(([fieldKey, fieldData], index) => (
              <Card key={fieldKey}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{fieldData.label}</CardTitle>
                    <Badge variant="secondary">{fieldData.total} respon</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Bar Chart */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">
                      Distribusi
                    </h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart
                        data={fieldData.distribution}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                        <XAxis type="number" hide />
                        <YAxis
                          type="category"
                          dataKey="value"
                          tick={{ fontSize: 12 }}
                          width={80}
                        />
                        <Tooltip
                          formatter={(value: number) => [`${value} (${fieldData.distribution.find(d => d.count === value)?.percentage || 0}%)`, 'Jumlah']}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px',
                          }}
                        />
                        <Bar
                          dataKey="count"
                          radius={[0, 4, 4, 0]}
                          fill={COLORS[index % COLORS.length]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Pie Chart */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">
                      Proporsi
                    </h4>
                    <ResponsiveContainer width="100%" height={180}>
                      <RechartsPieChart margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <Pie
                          data={fieldData.distribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ value, percentage }) =>
                            percentage > 5 ? `${value} (${percentage}%)` : ''
                          }
                          outerRadius={60}
                          dataKey="count"
                        >
                          {fieldData.distribution.map((entry, i) => (
                            <Cell
                              key={`cell-${i}`}
                              fill={COLORS[i % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (value: number, name: string, props: any) => [
                            `${value} (${props.payload.percentage}%)`,
                            props.payload.value,
                          ]}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px',
                          }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Rating Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trend Rating per Hari
              </CardTitle>
              <CardDescription>
                Jumlah feedback berdasarkan rating dari waktu ke waktu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={trendChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return `${date.getDate()}/${date.getMonth() + 1}`
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                    labelFormatter={(value) => {
                      const date = new Date(value)
                      return date.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                      })
                    }}
                  />
                  <Legend />
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Line
                      key={rating}
                      type="monotone"
                      dataKey={`rating_${rating}`}
                      stroke={RATING_COLORS[rating as keyof typeof RATING_COLORS]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name={`${rating} Bintang`}
                      connectNulls={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Correlations - Rating by Demographic */}
          <div className="grid gap-6 lg:grid-cols-2">
            {correlationEntries.map(([fieldKey, corrData], index) => (
              <Card key={fieldKey}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Rata-rata Rating per {data.demographics[fieldKey]?.label || fieldKey}
                  </CardTitle>
                  <CardDescription>
                    Korelasi antara demografi dan kepuasan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={corrData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                      <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 12 }} />
                      <YAxis
                        type="category"
                        dataKey="value"
                        tick={{ fontSize: 12 }}
                        width={80}
                      />
                      <Tooltip
                        formatter={(value: number) => [value.toFixed(2), 'Avg Rating']}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                        }}
                      />
                      <Bar
                        dataKey="avg_rating"
                        radius={[0, 4, 4, 0]}
                        fill={COLORS[index % COLORS.length]}
                      />
                    </BarChart>
                  </ResponsiveContainer>

                  {/* Insight text */}
                  <div className="mt-4 pt-4 border-t">
                    {corrData.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {corrData[0].value}
                        </span>
                        {' '}memberikan rating tertinggi (
                        <span className="text-emerald-600 font-medium">
                          {corrData[0].avg_rating}
                        </span>
                        )
                        {corrData.length > 1 && (
                          <>
                            ,{' '}
                            <span className="font-medium text-foreground">
                              {corrData[corrData.length - 1].value}
                            </span>
                            {' '}terendah (
                            <span className="text-rose-600 font-medium">
                              {corrData[corrData.length - 1].avg_rating}
                            </span>
                            )
                          </>
                        )}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Segment Pairs - Multi-dimensional Analysis */}
          {data.segment_pairs && data.segment_pairs.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Analisis Multi-Dimensi</h3>
                <p className="text-sm text-muted-foreground">
                  Korelasi antar kombinasi field demografi
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {data.segment_pairs.map((segmentPair, idx) => (
                  <SegmentPairCard key={idx} segment={segmentPair} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// Breakdown Analysis Card Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BreakdownAnalysisCard({ segments }: { segments: any }) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Breakdown: {segments.filter_field} = {segments.filter_value}
        </CardTitle>
        <CardDescription>
          Analisis detail berdasarkan {segments.breakdown_field}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-medium">{segments.breakdown_field}</th>
                  <th className="text-center p-3 font-medium">Jumlah</th>
                  <th className="text-center p-3 font-medium">Avg Rating</th>
                  <th className="text-center p-3 font-medium">Distribusi Rating</th>
                </tr>
              </thead>
              <tbody>
                {segments.data.map(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (item: any) => (
                  <tr key={item.value} className="border-t">
                    <td className="p-3">{item.value}</td>
                    <td className="text-center p-3">{item.count}</td>
                    <td className="text-center p-3">
                      <Badge
                        variant="outline"
                        className={cn(
                          item.avg_rating >= 4 && 'bg-emerald-100 text-emerald-700 border-emerald-200',
                          item.avg_rating <= 2 && 'bg-rose-100 text-rose-700 border-rose-200'
                        )}
                      >
                        {item.avg_rating.toFixed(2)}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1 justify-center">
                        {item.distribution.map(
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (d: any) => (
                          <div
                            key={d.rating}
                            className="w-6 h-6 rounded flex items-center justify-center text-xs font-medium"
                            style={{
                              backgroundColor: RATING_COLORS[d.rating as keyof typeof RATING_COLORS] + '40',
                              color: RATING_COLORS[d.rating as keyof typeof RATING_COLORS],
                            }}
                            title={`${d.rating} bintang: ${d.count}`}
                          >
                            {d.count}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bar Chart Comparison */}
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={segments.data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis type="number" domain={[0, 5]} />
                <YAxis type="category" dataKey="value" width={80} />
                <Tooltip
                  formatter={(value: number) => [value.toFixed(2), 'Avg Rating']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Bar dataKey="avg_rating" radius={[0, 4, 4, 0]} fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Segment Pair Card Component
function SegmentPairCard({ segment }: { segment: SegmentPair }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {segment.field1} × {segment.field2}
        </CardTitle>
        <CardDescription>
          Top kombinasi dengan rating tertinggi
        </CardDescription>
      </CardHeader>
      <CardContent>
        {segment.combinations.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Tidak ada data untuk kombinasi ini
          </p>
        ) : (
          <div className="space-y-3">
            {segment.combinations.map((combo, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium truncate">{combo.value1}</span>
                    <span className="text-muted-foreground">×</span>
                    <span className="font-medium truncate">{combo.value2}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{combo.count} respon</span>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={cn(
                      'text-lg font-bold',
                      combo.avg_rating >= 4 ? 'text-emerald-600' : '',
                      combo.avg_rating <= 2 ? 'text-rose-600' : ''
                    )}
                  >
                    {combo.avg_rating}
                  </div>
                  <div className="text-xs text-muted-foreground">avg</div>
                </div>
                <div className="w-12 h-12">
                  {/* Mini radar visualization */}
                  <svg viewBox="0 0 40 40" className="w-full h-full">
                    <circle
                      cx="20"
                      cy="20"
                      r="18"
                      fill="none"
                      stroke="hsl(var(--border))"
                      strokeWidth="1"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r={(combo.avg_rating / 5) * 18}
                      fill={combo.avg_rating >= 4 ? '#22c55e' : combo.avg_rating <= 2 ? '#ef4444' : '#6366f1'}
                      opacity="0.3"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r={(combo.avg_rating / 5) * 18}
                      fill={combo.avg_rating >= 4 ? '#22c55e' : combo.avg_rating <= 2 ? '#ef4444' : '#6366f1'}
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Summary Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-32 mt-2" />
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
