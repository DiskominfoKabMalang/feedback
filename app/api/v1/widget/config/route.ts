import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { projects } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * GET /api/v1/widget/config
 *
 * Public API endpoint for widget to fetch configuration.
 *
 * Query Params:
 * - project_id (required): UUID of the project
 *
 * Security:
 * - Validates Origin header against domain_whitelist
 * - Returns 403 if domain not whitelisted
 * - Returns 404 if project not found
 *
 * Response: Widget configuration JSON
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get('project_id')

    // Validate project_id parameter
    if (!projectId) {
      return NextResponse.json(
        { error: 'Missing project_id parameter' },
        { status: 400 }
      )
    }

    // Get origin from headers for CORS validation
    const origin =
      request.headers.get('origin') || request.headers.get('referer')

    // Fetch project from database
    const projectResult = await db
      .select({
        id: projects.id,
        name: projects.name,
        widgetConfig: projects.widgetConfig,
        domainWhitelist: projects.domainWhitelist,
      })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1)

    if (projectResult.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const project = projectResult[0]

    // Extract domain from origin for validation
    let originDomain: string | null = null
    if (origin) {
      try {
        const url = new URL(origin)
        originDomain = url.hostname
      } catch {
        // Invalid URL, continue without origin check
      }
    }

    // Validate domain whitelist (if whitelist is configured)
    if (project.domainWhitelist && project.domainWhitelist.length > 0) {
      // Allow requests without origin (e.g., direct QR code links)
      if (originDomain && !project.domainWhitelist.includes(originDomain)) {
        return NextResponse.json(
          { error: 'Domain not whitelisted' },
          { status: 403 }
        )
      }
    }

    // Return widget configuration (flow-based format)
    // Merge database config with defaults
    const widgetConfig = project.widgetConfig || {}

    // Build response with flow structure
    const response = {
      project_name: project.name,
      version: widgetConfig.version || '1.0.0',
      theme: widgetConfig.theme || {
        primary_color: '#6366f1',
        position: 'bottom_right',
        trigger_label: 'Feedback',
        button_style: 'pill' as const,
      },
      behavior: widgetConfig.behavior || {
        show_branding: true,
        persistence: 'none' as const,
        auto_open: false,
      },
      flow: widgetConfig.flow || {
        rating_step: {
          enabled: true,
          type: 'emoji' as const,
          scale: 5,
          title: 'Seberapa puas Anda dengan layanan kami?',
        },
        feedback_step: {
          enabled: true,
          logic_rules: widgetConfig.logic || [],
        },
        demographics_step: {
          enabled: false,
          required: false,
          title: 'Sedikit lagi! Lengkapi data berikut:',
          fields: [],
        },
        success_step: {
          title: 'Terima Kasih!',
          message: 'Masukan Anda membantu kami menjadi lebih baik.',
          auto_close_seconds: 5,
          show_cta: false,
        },
      },
    }

    return NextResponse.json(response, {
      status: 200,
      headers: {
        // Cache for 5 minutes to reduce database load
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('[Widget Config API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
