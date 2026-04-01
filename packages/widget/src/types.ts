/**
 * Widget configuration types
 * These match the backend widget configuration (flow-based)
 */

export interface WidgetTheme {
  primary_color?: string
  position?: 'bottom_left' | 'bottom_right' | 'top_left' | 'top_right'
  trigger_icon?: string // URL to custom icon
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
  scale: number // 3, 5, or 10
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
  auto_close_seconds: number
  show_cta: boolean
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
  // Legacy support
  logic?: FeedbackLogicRule[]
  rating_type?: 'emoji' | 'star' | 'number'
  show_branding?: boolean
}

export interface FeedbackData {
  projectId: string
  rating: number
  answers?: {
    tags?: string[]
    comment?: string
    email?: string
    user_info?: Record<string, string | undefined>
  }
  meta?: {
    page?: { url?: string; title?: string; referrer?: string }
    tech?: {
      device_type?: string
      os?: string
      browser?: string
      screen_res?: string
      connection?: string
      user_agent?: string
    }
    performance?: {
      lcp?: number
      cls?: number
      fid?: number
      load_time?: number
    }
    session_id?: string
    is_returning_visitor?: boolean
  }
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
