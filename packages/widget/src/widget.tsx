import { render } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import './widget.css'

// ============================================================================
// Types (matching backend schema)
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

// ============================================================================
// Widget Component
// ============================================================================

type Step = 'rating' | 'feedback' | 'demographics' | 'success'

function FeedbackWidget({
  config,
  projectId,
  apiEndpoint,
  debug,
}: {
  config: WidgetConfig
  projectId: string
  apiEndpoint: string
  debug: boolean
}) {
  // UI State
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<Step>('rating')
  const [loading, setLoading] = useState(false)

  // Form State
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [comment, setComment] = useState('')
  const [email, setEmail] = useState('')
  const [demographics, setDemographics] = useState<Record<string, string>>({})

  // Session tracking
  const [sessionId] = useState(() => {
    const stored = localStorage.getItem('fw_session_id')
    if (stored) return stored
    const newId = 'sess_' + Math.random().toString(36).substr(2, 12)
    localStorage.setItem('fw_session_id', newId)
    return newId
  })

  const [isReturningVisitor] = useState(() => {
    return localStorage.getItem('fw_visited_before') === 'true'
  })

  // Auto-open behavior
  useEffect(() => {
    if (config.behavior?.auto_open) {
      const delay = (config.behavior.delay_open || 0) * 1000
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [config.behavior])

  // Load saved demographics from localStorage
  useEffect(() => {
    if (config.behavior?.persistence === 'remember_user_info') {
      const saved = localStorage.getItem('fw_user_info')
      if (saved) {
        try {
          setDemographics(JSON.parse(saved))
        } catch (e) {
          // Invalid JSON, ignore
        }
      }
    }
  }, [config.behavior])

  // Mark as visited
  useEffect(() => {
    localStorage.setItem('fw_visited_before', 'true')
  }, [])

  // Get current logic rule based on rating
  const currentRule =
    selectedRating !== null && config.flow?.feedback_step?.logic_rules
      ? config.flow.feedback_step.logic_rules.find((r) =>
          r.trigger_ratings.includes(selectedRating)
        )
      : null

  // Reset form
  const resetForm = () => {
    setSelectedRating(null)
    setSelectedTags([])
    setComment('')
    setEmail('')
    if (config.behavior?.persistence !== 'remember_user_info') {
      setDemographics({})
    }
    setStep('rating')
  }

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => {
      resetForm()
    }, 300)
  }

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating)
    if (config.flow?.feedback_step?.enabled) {
      setStep('feedback')
    } else if (config.flow?.demographics_step?.enabled) {
      setStep('demographics')
    } else {
      submitFeedback(rating)
    }
  }

  const handleFeedbackSubmit = () => {
    if (config.flow?.demographics_step?.enabled) {
      setStep('demographics')
    } else {
      submitFeedback(selectedRating!)
    }
  }

  const handleBackToRating = () => {
    setSelectedRating(null)
    setSelectedTags([])
    setComment('')
    setEmail('')
    setStep('rating')
  }

  // Collect performance metrics
  const getPerformanceMetrics = () => {
    if (typeof performance === 'undefined') return {}

    const perfData = window.performance as Performance & {
      timing?: PerformanceNavigationTiming
      getEntriesByType?: (
        type: string
      ) => Array<{
        startTime?: number
        value?: number
        processingStart?: number
      }>
    }
    const navigation =
      perfData.timing || perfData.getEntriesByType?.('navigation')?.[0]

    return {
      lcp: perfData.getEntriesByType?.('largest-contentful-paint')?.[0]
        ?.startTime,
      cls: perfData
        .getEntriesByType?.('layout-shift')
        ?.reduce(
          (sum: number, entry: { value: number }) => sum + entry.value,
          0
        ),
      fid: perfData.getEntriesByType?.('first-input')?.[0]?.processingStart,
      load_time: navigation?.loadEventEnd - navigation?.navigationStart,
    }
  }

  // Collect technical context
  const getTechContext = () => {
    const ua = navigator.userAgent
    let os = 'Unknown'
    let browser = 'Unknown'

    // Simple UA parsing
    if (ua.includes('Android')) os = 'Android'
    else if (ua.includes('iOS')) os = 'iOS'
    else if (ua.includes('Windows')) os = 'Windows'
    else if (ua.includes('Mac')) os = 'macOS'
    else if (ua.includes('Linux')) os = 'Linux'

    if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome'
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari'
    else if (ua.includes('Firefox')) browser = 'Firefox'
    else if (ua.includes('Edg')) browser = 'Edge'

    // Device type detection
    const width = window.innerWidth
    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'
    if (width < 768) deviceType = 'mobile'
    else if (width < 1024) deviceType = 'tablet'

    // Connection type
    const connection = (
      navigator as Navigator & { connection?: { effectiveType?: string } }
    ).connection
    const connectionType = connection?.effectiveType || 'unknown'

    return {
      device_type: deviceType,
      os,
      browser,
      screen_res: `${window.screen.width}x${window.screen.height}`,
      connection: connectionType,
      user_agent: ua,
    }
  }

  // Submit feedback
  const submitFeedback = async (rating: number) => {
    setLoading(true)

    try {
      const payload = {
        project_id: projectId,
        rating,
        answers: {
          tags: selectedTags.length > 0 ? selectedTags : undefined,
          comment: comment.trim() || undefined,
          email: currentRule?.collect_email
            ? email.trim() || undefined
            : undefined,
          user_info: config.flow?.demographics_step?.enabled
            ? { ...demographics }
            : undefined,
        },
        meta: {
          page: {
            url: window.location.href,
            title: document.title,
            referrer: document.referrer,
          },
          tech: getTechContext(),
          performance: getPerformanceMetrics(),
          session_id: sessionId,
          is_returning_visitor: isReturningVisitor,
        },
      }

      if (debug) {
        console.log('[FeedbackWidget] Submitting:', payload)
      }

      const response = await fetch(`${apiEndpoint}/api/v1/widget/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        // Save demographics if enabled
        if (
          config.behavior?.persistence === 'remember_user_info' &&
          Object.keys(demographics).length > 0
        ) {
          localStorage.setItem('fw_user_info', JSON.stringify(demographics))
        }

        setStep('success')

        // Auto-close after delay
        const autoCloseDelay = config.flow?.success_step?.auto_close_seconds
        if (autoCloseDelay && autoCloseDelay > 0) {
          setTimeout(() => {
            handleClose()
          }, autoCloseDelay * 1000)
        }

        if (debug) console.log('[FeedbackWidget] Submitted successfully')
      } else {
        throw new Error('Failed to submit feedback')
      }
    } catch (error) {
      console.error('[FeedbackWidget] Error:', error)
      alert('Gagal mengirim feedback. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  // Get position classes
  const getPositionClasses = () => {
    const position = config.theme?.position || 'bottom_right'
    return `feedback-widget-container fw-position-${position}`
  }

  // Get button style classes
  const getButtonStyleClasses = () => {
    const style = config.theme?.button_style || 'pill'
    return `fw-trigger fw-btn-${style}`
  }

  // Render rating buttons
  const renderRatingButtons = () => {
    const ratingType = config.flow?.rating_step?.type || 'emoji'
    const scale = config.flow?.rating_step?.scale || 5

    if (ratingType === 'emoji') {
      const emojis =
        scale === 3
          ? ['😢', '😐', '😃']
          : scale === 4
            ? ['😢', '😕', '🙂', '😃']
            : ['😢', '😕', '😐', '🙂', '😃']
      return emojis.map((emoji, i) => (
        <button
          key={i}
          class="fw-rating-btn fw-emoji-btn"
          onClick={() => handleRatingClick(i + 1)}
          aria-label={`Rate ${i + 1}`}
        >
          {emoji}
        </button>
      ))
    }

    if (ratingType === 'star') {
      return Array.from({ length: scale }, (_, i) => i + 1).map((r) => (
        <button
          key={r}
          class="fw-rating-btn fw-star-btn"
          onClick={() => handleRatingClick(r)}
          aria-label={`Rate ${r} stars`}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        </button>
      ))
    }

    // number
    return Array.from({ length: scale }, (_, i) => i + 1).map((r) => (
      <button
        key={r}
        class="fw-rating-btn fw-number-btn"
        onClick={() => handleRatingClick(r)}
        aria-label={`Rate ${r}`}
      >
        {r}
      </button>
    ))
  }

  // Render selected rating display
  const renderSelectedRating = () => {
    const ratingType = config.flow?.rating_step?.type || 'emoji'
    const scale = config.flow?.rating_step?.scale || 5

    if (ratingType === 'emoji') {
      const emojis =
        scale === 3
          ? ['😢', '😐', '😃']
          : scale === 4
            ? ['😢', '😕', '🙂', '😃']
            : ['😢', '😕', '😐', '🙂', '😃']
      return emojis.map((emoji, i) => (
        <span
          key={i}
          class={`fw-rating-display fw-emoji-display ${i + 1 <= (selectedRating || 0) ? 'fw-active' : ''}`}
        >
          {emoji}
        </span>
      ))
    }

    if (ratingType === 'star') {
      return Array.from({ length: scale }, (_, i) => i + 1).map((r) => (
        <span
          key={r}
          class={`fw-rating-display fw-star-display ${r <= (selectedRating || 0) ? 'fw-active' : ''}`}
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        </span>
      ))
    }

    // number
    return Array.from({ length: scale }, (_, i) => i + 1).map((r) => (
      <span
        key={r}
        class={`fw-rating-display fw-number-display ${r <= (selectedRating || 0) ? 'fw-active' : ''}`}
      >
        {r}
      </span>
    ))
  }

  // Get trigger icon
  const getTriggerIcon = () => {
    const icon = config.theme?.trigger_icon
    if (icon && icon.startsWith('http')) {
      return <img src={icon} alt="" class="fw-trigger-icon-img" />
    }
    return <span class="fw-trigger-icon-emoji">💬</span>
  }

  // Render demographic field
  const renderDemographicField = (field: DemographicField) => {
    const value = demographics[field.key] || ''

    if (field.type === 'select') {
      return (
        <div class="fw-field-group">
          <label class="fw-field-label">
            {field.label}
            {field.required && ' *'}
          </label>
          <select
            class="fw-select"
            required={field.required}
            onChange={(e) =>
              setDemographics({
                ...demographics,
                [field.key]: (e.target as HTMLSelectElement).value,
              })
            }
          >
            <option value="">Pilih...</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt} selected={value === opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )
    }

    if (field.type === 'radio_group') {
      return (
        <div class="fw-field-group">
          <label class="fw-field-label">
            {field.label}
            {field.required && ' *'}
          </label>
          <div class="fw-radio-group">
            {field.options?.map((opt, idx) => (
              <label
                key={`${field.key}-${idx}`}
                class={`fw-radio-option ${value === opt ? 'fw-active' : ''}`}
              >
                <input
                  type="radio"
                  name={field.key}
                  value={opt}
                  checked={value === opt}
                  onChange={() =>
                    setDemographics({ ...demographics, [field.key]: opt })
                  }
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      )
    }

    if (field.type === 'chips') {
      return (
        <div class="fw-field-group">
          <label class="fw-field-label">
            {field.label}
            {field.required && ' *'}
          </label>
          <div class="fw-chips">
            {field.options?.map((opt, idx) => (
              <button
                key={`${field.key}-${idx}`}
                type="button"
                class={`fw-chip ${value === opt ? 'fw-active' : ''}`}
                onClick={() =>
                  setDemographics({ ...demographics, [field.key]: opt })
                }
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )
    }

    if (field.type === 'checkbox') {
      return (
        <div class="fw-field-group">
          <label class="fw-field-label">
            {field.label}
            {field.required && ' *'}
          </label>
          <div class="fw-checkbox-group">
            {field.options?.map((opt, idx) => {
              const checked = Array.isArray(value) ? value.includes(opt) : false
              return (
                <label key={`${field.key}-${idx}`} class="fw-checkbox-option">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      const current = Array.isArray(value) ? value : []
                      if ((e.target as HTMLInputElement).checked) {
                        setDemographics({
                          ...demographics,
                          [field.key]: [...current, opt],
                        })
                      } else {
                        setDemographics({
                          ...demographics,
                          [field.key]: current.filter((v: string) => v !== opt),
                        })
                      }
                    }}
                  />
                  <span>{opt}</span>
                </label>
              )
            })}
          </div>
        </div>
      )
    }

    if (field.type === 'email') {
      return (
        <div class="fw-field-group">
          <label class="fw-field-label">
            {field.label}
            {field.required && ' *'}
          </label>
          <input
            type="email"
            class="fw-input"
            placeholder={field.placeholder || ''}
            value={value}
            required={field.required}
            onInput={(e) =>
              setDemographics({
                ...demographics,
                [field.key]: (e.target as HTMLInputElement).value,
              })
            }
          />
        </div>
      )
    }

    if (field.type === 'number') {
      return (
        <div class="fw-field-group">
          <label class="fw-field-label">
            {field.label}
            {field.required && ' *'}
          </label>
          <input
            type="number"
            class="fw-input"
            placeholder={field.placeholder || ''}
            value={value}
            required={field.required}
            onInput={(e) =>
              setDemographics({
                ...demographics,
                [field.key]: (e.target as HTMLInputElement).value,
              })
            }
          />
        </div>
      )
    }

    // text (default)
    return (
      <div class="fw-field-group">
        <label class="fw-field-label">
          {field.label}
          {field.required && ' *'}
        </label>
        <input
          type="text"
          class="fw-input"
          placeholder={field.placeholder || ''}
          value={value}
          required={field.required}
          onInput={(e) =>
            setDemographics({
              ...demographics,
              [field.key]: (e.target as HTMLInputElement).value,
            })
          }
        />
      </div>
    )
  }

  // Render widget content
  const renderContent = () => {
    if (step === 'rating') {
      return (
        <div class="fw-screen fw-rating-screen">
          <h4 class="fw-title">
            {config.flow?.rating_step?.title || 'Rate your experience'}
          </h4>
          <div class="fw-rating-buttons">{renderRatingButtons()}</div>
        </div>
      )
    }

    if (step === 'feedback' && currentRule) {
      const canSubmit =
        currentRule.allow_skip_comment ||
        comment.trim().length > 0 ||
        selectedTags.length > 0

      return (
        <div class="fw-screen fw-feedback-screen">
          <div class="fw-rating-display-container">
            {renderSelectedRating()}
          </div>

          {currentRule.subtitle && (
            <p class="fw-subtitle">{currentRule.subtitle}</p>
          )}

          <h4 class="fw-title">{currentRule.title}</h4>

          <textarea
            class="fw-textarea"
            placeholder={currentRule.placeholder || 'Share your thoughts...'}
            value={comment}
            onInput={(e) => setComment((e.target as HTMLTextAreaElement).value)}
            rows={3}
          />

          {currentRule.tags_options && currentRule.tags_options.length > 0 && (
            <div class="fw-tags">
              {currentRule.tags_options.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  class={`fw-tag-option ${selectedTags.includes(tag) ? 'fw-active' : ''}`}
                  onClick={() => {
                    if (selectedTags.includes(tag)) {
                      setSelectedTags(selectedTags.filter((t) => t !== tag))
                    } else {
                      setSelectedTags([...selectedTags, tag])
                    }
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {currentRule.collect_email && (
            <input
              type="email"
              class="fw-input"
              placeholder="Email Anda (opsional)"
              value={email}
              onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
            />
          )}

          <button
            class="fw-submit-btn"
            disabled={loading || !canSubmit}
            onClick={handleFeedbackSubmit}
          >
            {loading ? 'Mengirim...' : 'Lanjut'}
          </button>

          <button class="fw-back-btn" onClick={handleBackToRating}>
            Kembali
          </button>
        </div>
      )
    }

    if (step === 'demographics') {
      const allRequiredFilled = config.flow?.demographics_step?.fields?.every(
        (field) => {
          if (!field.required) return true
          return !!demographics[field.key]
        }
      )

      return (
        <div class="fw-screen fw-demographics-screen">
          <h4 class="fw-title">{config.flow?.demographics_step?.title}</h4>
          {config.flow?.demographics_step?.subtitle && (
            <p class="fw-subtitle">{config.flow?.demographics_step.subtitle}</p>
          )}

          <div class="fw-fields">
            {config.flow?.demographics_step?.fields?.map((field) => (
              <div key={field.key}>{renderDemographicField(field)}</div>
            ))}
          </div>

          <button
            class="fw-submit-btn"
            disabled={loading || !allRequiredFilled}
            onClick={() => submitFeedback(selectedRating!)}
          >
            {loading ? 'Mengirim...' : 'Kirim'}
          </button>

          <button class="fw-back-btn" onClick={handleBackToRating}>
            Kembali
          </button>
        </div>
      )
    }

    if (step === 'success') {
      return (
        <div class="fw-screen fw-success-screen">
          <div class="fw-success-icon">✓</div>
          <h4 class="fw-title">
            {config.flow?.success_step?.title || 'Terima Kasih!'}
          </h4>
          <p class="fw-description">
            {config.flow?.success_step?.message ||
              'Masukan Anda membantu kami menjadi lebih baik.'}
          </p>

          {config.flow?.success_step?.show_cta && (
            <a
              href={config.flow.success_step.cta_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              class="fw-cta-btn"
            >
              {config.flow?.success_step.cta_text || 'CTA'}
            </a>
          )}

          <button class="fw-close-btn" onClick={handleClose}>
            Tutup
          </button>
        </div>
      )
    }

    return null
  }

  return (
    <div class={getPositionClasses()}>
      {/* Trigger Button */}
      {!isOpen && (
        <button
          class={getButtonStyleClasses()}
          onClick={() => setIsOpen(true)}
          aria-label="Buka feedback"
          style={{ backgroundColor: config.theme?.primary_color || '#6366f1' }}
        >
          {getTriggerIcon()}
          <span>{config.theme?.trigger_label || 'Feedback'}</span>
        </button>
      )}

      {/* Widget Modal */}
      {isOpen && (
        <div
          class="fw-modal"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div class="fw-modal-content">
            {renderContent()}

            {config.behavior?.show_branding !== false && (
              <div class="fw-branding">
                <span>Powered by FeedbackApp</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Loader & Initialization
// ============================================================================

let widgetInstance: { root: Element; unmount: () => void } | null = null
let configCache: WidgetConfig | null = null

async function fetchConfig(
  projectId: string,
  apiEndpoint: string
): Promise<WidgetConfig> {
  try {
    const response = await fetch(
      `${apiEndpoint}/api/v1/widget/config?projectId=${projectId}`
    )
    if (response.ok) {
      const data = await response.json()
      return data.config || {}
    }
  } catch (error) {
    console.warn('[FeedbackWidget] Could not fetch config, using defaults')
  }
  return {}
}

export function init(options: {
  projectId: string
  apiEndpoint?: string
  debug?: boolean
}) {
  const apiEndpoint = options.apiEndpoint || 'https://your-domain.com'
  const debug = options.debug || false

  if (debug) {
    console.log(
      '[FeedbackWidget] Initializing with projectId:',
      options.projectId
    )
  }

  // Create container
  const container = document.createElement('div')
  container.id = 'feedback-widget-root'
  document.body.appendChild(container)

  // Fetch config and render
  fetchConfig(options.projectId, apiEndpoint).then((config) => {
    configCache = config

    widgetInstance = {
      root: container,
      unmount: () => {
        render(null, container)
      },
    }

    render(
      <FeedbackWidget
        config={config}
        projectId={options.projectId}
        apiEndpoint={apiEndpoint}
        debug={debug}
      />,
      container
    )

    if (debug) {
      console.log('[FeedbackWidget] Config loaded:', config)
    }
  })
}

export function destroy() {
  if (widgetInstance) {
    widgetInstance.unmount()
    widgetInstance.root.remove()
    widgetInstance = null
  }
}

export function updateConfig(newConfig: Partial<WidgetConfig>) {
  if (!widgetInstance || !configCache) {
    console.warn('[FeedbackWidget] Widget not initialized. Call init() first.')
    return
  }

  const projectId = widgetInstance.root.getAttribute('data-project-id') || ''

  render(
    <FeedbackWidget
      config={{ ...configCache, ...newConfig }}
      projectId={projectId}
      apiEndpoint=""
      debug={false}
    />,
    widgetInstance.root
  )
}

// Auto-initialize from global options
if (typeof window !== 'undefined') {
  ;(
    window as Window & {
      FeedbackWidget?: {
        init: typeof init
        destroy: typeof destroy
        updateConfig: typeof updateConfig
      }
    }
  ).FeedbackWidget = {
    init,
    destroy,
    updateConfig,
  }

  // Check for auto-init
  const scriptTag = document.querySelector('script[data-feedback-widget]')
  if (scriptTag) {
    const projectId = scriptTag.getAttribute('data-project-id')
    const apiEndpoint = scriptTag.getAttribute('data-api-endpoint')
    const debug = scriptTag.getAttribute('data-debug') === 'true'

    if (projectId) {
      init({
        projectId,
        apiEndpoint: apiEndpoint || undefined,
        debug: debug || false,
      })
    }
  }
}

export default FeedbackWidget
