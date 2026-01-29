/**
 * Widget configuration types
 * These match the backend widget configuration
 */

export interface LogicStep {
  rating_group: number[]
  title: string
  description?: string
  message_label: string
  placeholder: string
  tags: string[]
  collect_email: boolean
  show_rating_input?: boolean
  cta_text?: string
  cta_redirect?: string
  show_cta_after_submit?: boolean
}

export interface WidgetTheme {
  color_primary?: string
  position?: 'bottom_left' | 'bottom_right' | 'top_left' | 'top_right'
  trigger_label?: string
  trigger_icon?: 'feedback' | 'star' | 'chat' | 'heart'
  button_style?: 'rounded' | 'square' | 'pill'
}

export interface WidgetConfig {
  theme?: WidgetTheme
  logic?: LogicStep[]
  rating_type?: 'emoji' | 'star' | 'number'
  show_branding?: boolean
}

export interface FeedbackData {
  projectId: string
  rating: number
  message?: string
  email?: string
  tags: string[]
  metadata?: Record<string, unknown>
}

export interface WidgetOptions {
  /**
   * The project ID from your feedback dashboard
   */
  projectId: string

  /**
   * Custom API endpoint (optional, defaults to FeedbackApp API)
   */
  apiEndpoint?: string

  /**
   * Auto-initialize the widget on load (default: true)
   */
  autoInit?: boolean

  /**
   * Debug mode for console logging
   */
  debug?: boolean
}
