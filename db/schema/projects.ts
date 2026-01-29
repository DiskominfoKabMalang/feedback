import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { users } from './users'

/**
 * Widget Configuration Types
 * Based on Jabarprov feedback widget specification
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
  auto_open?: boolean // Auto-open widget on load
  delay_open?: number // Seconds before auto-open
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
  // Legacy support
  logic?: Array<{
    rating_group: number[]
    title: string
    tags: string[]
    placeholder: string
    collect_email: boolean
    cta_redirect?: string
  }>
}

/**
 * Projects table - Stores widget configuration and feature limits
 *
 * This table is the "brain" of each feedback widget.
 * It stores the Logic Builder configuration and security settings.
 */
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),

  // SECURITY
  domainWhitelist: text('domain_whitelist')
    .array()
    .notNull()
    .default(sql`ARRAY[]::TEXT[]`),
  apiKey: varchar('api_key', { length: 64 }).unique(),

  // CONFIGURATION (The Brain)
  widgetConfig: jsonb('widget_config')
    .default(sql`'{}'::jsonb`)
    .$type<WidgetConfig>(),

  // FEATURE GATING (Model Unlimited)
  tier: varchar('tier', { length: 20 }).notNull().default('basic'), // 'basic', 'pro', 'enterprise'
  settings: jsonb('settings')
    .default(sql`'{"remove_branding": false, "retention_days": 30}'::jsonb`)
    .$type<{
      remove_branding?: boolean
      retention_days?: number
    }>(),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).$onUpdate(
    () => new Date()
  ),
})

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
