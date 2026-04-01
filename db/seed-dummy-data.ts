import 'dotenv/config'
import { db } from '@/db'
import { users, projects, feedbacks } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Seed dummy projects and feedbacks for development/testing
 *
 * Run with: npx tsx --env-file=.env db/seed-dummy-data.ts
 *
 * This creates:
 * - 5 sample projects
 * - 50+ feedbacks across all projects with realistic data
 */

// Dummy users to use as owners
const OWNER_EMAIL = 'admin@example.com'

// Sample projects data
const dummyProjects = [
  {
    name: 'E-Commerce Store Feedback',
    slug: 'ecommerce-store',
    tier: 'pro',
    domainWhitelist: ['myshop.com', 'www.myshop.com'],
    widgetConfig: {
      theme: {
        color_primary: '#6366f1',
        position: 'bottom_right',
        trigger_label: 'Feedback',
      },
      logic: [
        {
          rating_group: [1, 2],
          title: 'What went wrong? Help us improve!',
          tags: ['negative', 'bug', 'issue'],
          placeholder: 'Tell us what we can do better...',
          collect_email: true,
        },
        {
          rating_group: [3],
          title: 'How can we serve you better?',
          tags: ['neutral', 'improvement'],
          placeholder: 'Share your suggestions...',
          collect_email: false,
        },
        {
          rating_group: [4, 5],
          title: 'What did you love? Thank you!',
          tags: ['positive', 'feature-request'],
          placeholder: 'Tell us what you enjoyed...',
          collect_email: false,
          cta_redirect: 'https://trustpilot.com/review/myshop',
        },
      ],
    },
    settings: {
      remove_branding: true,
      retention_days: 90,
    },
  },
  {
    name: 'SaaS Dashboard Widget',
    slug: 'saas-dashboard',
    tier: 'enterprise',
    domainWhitelist: ['app.saascompany.com', 'dashboard.saascompany.com'],
    widgetConfig: {
      theme: {
        color_primary: '#10b981',
        position: 'bottom_left',
        trigger_label: 'Rate Us',
      },
      logic: [
        {
          rating_group: [1, 2],
          title: "We're sorry to hear that. What happened?",
          tags: ['negative', 'support'],
          placeholder: 'Describe your issue...',
          collect_email: true,
        },
        {
          rating_group: [3, 4, 5],
          title: 'Thanks! What would make our product even better?',
          tags: ['positive', 'improvement'],
          placeholder: 'Share your ideas...',
          collect_email: false,
        },
      ],
    },
    settings: {
      remove_branding: true,
      retention_days: 365,
    },
  },
  {
    name: 'Restaurant Reviews',
    slug: 'restaurant-reviews',
    tier: 'basic',
    domainWhitelist: ['myrestaurant.com'],
    widgetConfig: {
      theme: {
        color_primary: '#f59e0b',
        position: 'bottom_right',
        trigger_label: 'Leave Review',
      },
      logic: [
        {
          rating_group: [1, 2],
          title: "We're sorry! Please tell us how we can improve.",
          tags: ['negative', 'service', 'food'],
          placeholder: 'What went wrong with your visit?',
          collect_email: true,
        },
        {
          rating_group: [3],
          title: 'Thank you! How could we improve?',
          tags: ['neutral'],
          placeholder: 'Any suggestions for us?',
          collect_email: false,
        },
        {
          rating_group: [4, 5],
          title: 'Wonderful! Would you recommend us to friends?',
          tags: ['positive'],
          placeholder: 'What did you enjoy most?',
          collect_email: false,
          cta_redirect: 'https://google.com/maps/review/myrestaurant',
        },
      ],
    },
    settings: {
      remove_branding: false,
      retention_days: 30,
    },
  },
  {
    name: 'Mobile App Feedback',
    slug: 'mobile-app-feedback',
    tier: 'pro',
    domainWhitelist: ['app.mobileapp.com'],
    widgetConfig: {
      theme: {
        color_primary: '#8b5cf6',
        position: 'top_right',
        trigger_label: '💬 Feedback',
      },
      logic: [
        {
          rating_group: [1, 2],
          title: 'Report a Problem',
          tags: ['bug', 'crash', 'negative'],
          placeholder: 'Describe the issue you encountered...',
          collect_email: true,
        },
        {
          rating_group: [3],
          title: 'Suggest an Improvement',
          tags: ['feature', 'neutral'],
          placeholder: 'What would make this app better?',
          collect_email: false,
        },
        {
          rating_group: [4, 5],
          title: 'Love the App! 🎉',
          tags: ['positive', 'love'],
          placeholder: 'What do you like most?',
          collect_email: false,
          cta_redirect: 'https://apps.apple.com/app/reviews',
        },
      ],
    },
    settings: {
      remove_branding: true,
      retention_days: 180,
    },
  },
  {
    name: 'Customer Support Portal',
    slug: 'support-portal',
    tier: 'enterprise',
    domainWhitelist: ['support.company.com'],
    widgetConfig: {
      theme: {
        color_primary: '#ef4444',
        position: 'bottom_right',
        trigger_label: 'Rate Support',
      },
      logic: [
        {
          rating_group: [1, 2],
          title: "We're sorry. How can we make it right?",
          tags: ['escalation', 'negative'],
          placeholder: 'Please describe your experience...',
          collect_email: true,
        },
        {
          rating_group: [3, 4, 5],
          title: 'Glad we could help! Anything else?',
          tags: ['resolved', 'positive'],
          placeholder: 'Any additional feedback?',
          collect_email: false,
        },
      ],
    },
    settings: {
      remove_branding: true,
      retention_days: 365,
    },
  },
]

// Sample feedbacks data
const dummyFeedbacks = [
  // E-Commerce Store feedbacks (12)
  {
    projectName: 'ecommerce-store',
    feedbacks: [
      {
        rating: 5,
        status: 'new',
        comment:
          'Amazing shopping experience! Fast delivery and great quality.',
        email: 'happy.customer@email.com',
        tags: ['positive'],
        meta: { url: '/checkout/success' },
      },
      {
        rating: 5,
        status: 'new',
        comment: 'Love the new product selection!',
        email: 'shopper@email.com',
        tags: ['positive', 'feature-request'],
        meta: { url: '/products/new' },
      },
      {
        rating: 4,
        status: 'read',
        comment: 'Good overall, but checkout was a bit confusing.',
        email: 'buyer@email.com',
        tags: ['neutral', 'ux'],
        meta: { url: '/checkout' },
      },
      {
        rating: 4,
        status: 'read',
        comment: 'Great prices, would recommend to friends.',
        email: null,
        tags: ['positive'],
        meta: { url: '/products' },
      },
      {
        rating: 3,
        status: 'new',
        comment: 'Okay experience. Shipping took longer than expected.',
        email: 'customer@email.com',
        tags: ['neutral', 'shipping'],
        meta: { url: '/order/tracking' },
      },
      {
        rating: 3,
        status: 'read',
        comment: 'Products are good but website is slow sometimes.',
        email: null,
        tags: ['neutral', 'performance'],
        meta: { url: '/products' },
      },
      {
        rating: 2,
        status: 'read',
        comment: 'Had trouble with payment processing.',
        email: 'frustrated@email.com',
        tags: ['negative', 'bug'],
        meta: { url: '/checkout/payment' },
      },
      {
        rating: 2,
        status: 'new',
        comment: 'Customer service was not helpful.',
        email: 'upset@email.com',
        tags: ['negative', 'support'],
        meta: { url: '/contact' },
      },
      {
        rating: 1,
        status: 'read',
        comment: 'Wrong item delivered! Very disappointed.',
        email: 'angry@email.com',
        tags: ['negative', 'shipping'],
        meta: { url: '/order/complaint' },
      },
      {
        rating: 1,
        status: 'new',
        comment: 'Website crashed multiple times during checkout.',
        email: 'tech@email.com',
        tags: ['negative', 'bug', 'crash'],
        meta: { url: '/checkout' },
      },
      {
        rating: 5,
        status: 'read',
        comment: "Best online store I've used! Keep it up!",
        email: 'fan@email.com',
        tags: ['positive'],
        meta: { url: '/' },
      },
      {
        rating: 4,
        status: 'new',
        comment: 'Easy to navigate and find products.',
        email: null,
        tags: ['positive', 'ux'],
        meta: { url: '/products/electronics' },
      },
    ],
  },
  // SaaS Dashboard feedbacks (15)
  {
    projectName: 'saas-dashboard',
    feedbacks: [
      {
        rating: 5,
        status: 'new',
        comment:
          'The analytics dashboard is incredible! Saved me hours of work.',
        email: 'data.analyst@company.com',
        tags: ['positive', 'analytics'],
        meta: { url: '/dashboard/analytics' },
      },
      {
        rating: 5,
        status: 'read',
        comment: 'Love the new export feature!',
        email: 'user@startup.io',
        tags: ['positive', 'feature'],
        meta: { url: '/reports/export' },
      },
      {
        rating: 5,
        status: 'read',
        comment: "Best SaaS tool I've ever used.",
        email: 'cto@tech.com',
        tags: ['positive'],
        meta: { url: '/dashboard' },
      },
      {
        rating: 4,
        status: 'new',
        comment: 'Great product! Would love dark mode.',
        email: 'developer@code.io',
        tags: ['positive', 'feature-request'],
        meta: { url: '/settings' },
      },
      {
        rating: 4,
        status: 'read',
        comment: 'Very intuitive interface.',
        email: null,
        tags: ['positive', 'ux'],
        meta: { url: '/dashboard' },
      },
      {
        rating: 4,
        status: 'read',
        comment: 'API is well documented and easy to use.',
        email: 'engineer@tech.com',
        tags: ['positive', 'api'],
        meta: { url: '/docs/api' },
      },
      {
        rating: 3,
        status: 'new',
        comment: 'Good but missing some advanced filters.',
        email: 'analyst@data.co',
        tags: ['neutral', 'feature-request'],
        meta: { url: '/dashboard/analytics' },
      },
      {
        rating: 3,
        status: 'read',
        comment: 'Decent, but load times could be faster.',
        email: null,
        tags: ['neutral', 'performance'],
        meta: { url: '/dashboard' },
      },
      {
        rating: 3,
        status: 'new',
        comment: 'Mobile app needs work.',
        email: 'mobile@user.com',
        tags: ['neutral', 'mobile'],
        meta: { url: '/mobile' },
      },
      {
        rating: 2,
        status: 'read',
        comment: 'Experienced some data sync issues.',
        email: 'concerned@business.com',
        tags: ['negative', 'bug'],
        meta: { url: '/settings/integrations' },
      },
      {
        rating: 2,
        status: 'new',
        comment: 'Support took too long to respond.',
        email: 'frustrated@user.com',
        tags: ['negative', 'support'],
        meta: { url: '/support' },
      },
      {
        rating: 1,
        status: 'read',
        comment: 'Lost important data due to a bug!',
        email: 'critical@company.com',
        tags: ['negative', 'bug', 'critical'],
        meta: { url: '/dashboard' },
      },
      {
        rating: 1,
        status: 'new',
        comment: 'Pricing is too high for the features offered.',
        email: null,
        tags: ['negative', 'pricing'],
        meta: { url: '/pricing' },
      },
      {
        rating: 5,
        status: 'read',
        comment: 'Onboarding was super smooth!',
        email: 'new@user.com',
        tags: ['positive'],
        meta: { url: '/onboarding' },
      },
      {
        rating: 4,
        status: 'new',
        comment: 'Integration with Slack is amazing!',
        email: 'slack@team.com',
        tags: ['positive', 'integration'],
        meta: { url: '/settings/integrations' },
      },
    ],
  },
  // Restaurant feedbacks (10)
  {
    projectName: 'restaurant-reviews',
    feedbacks: [
      {
        rating: 5,
        status: 'new',
        comment: 'Best pasta in town! Amazing service!',
        email: 'foodie@email.com',
        tags: ['positive', 'food', 'service'],
        meta: { url: '/menu' },
      },
      {
        rating: 5,
        status: 'read',
        comment: 'Romantic atmosphere and delicious food!',
        email: 'date@night.com',
        tags: ['positive', 'ambiance'],
        meta: { url: '/reservations' },
      },
      {
        rating: 5,
        status: 'read',
        comment: 'Will definitely come back!',
        email: null,
        tags: ['positive'],
        meta: { url: '/' },
      },
      {
        rating: 4,
        status: 'new',
        comment: 'Great food, slightly pricey but worth it.',
        email: 'diner@email.com',
        tags: ['positive', 'pricing'],
        meta: { url: '/menu' },
      },
      {
        rating: 4,
        status: 'read',
        comment: 'Friendly staff and tasty dishes.',
        email: null,
        tags: ['positive', 'service'],
        meta: { url: '/reviews' },
      },
      {
        rating: 3,
        status: 'new',
        comment: 'Food was good but wait time was long.',
        email: 'hungry@email.com',
        tags: ['neutral', 'service'],
        meta: { url: '/reservations' },
      },
      {
        rating: 3,
        status: 'read',
        comment: 'Average experience. Nothing special.',
        email: null,
        tags: ['neutral'],
        meta: { url: '/' },
      },
      {
        rating: 2,
        status: 'read',
        comment: 'Service was slow and food was cold.',
        email: 'disappointed@email.com',
        tags: ['negative', 'service'],
        meta: { url: '/menu' },
      },
      {
        rating: 2,
        status: 'new',
        comment: 'Found a hair in my food!',
        email: 'gross@email.com',
        tags: ['negative', 'food', 'critical'],
        meta: { url: '/contact' },
      },
      {
        rating: 1,
        status: 'read',
        comment: 'Rude waiter. Will never return!',
        email: 'angry@customer.com',
        tags: ['negative', 'service'],
        meta: { url: '/reviews' },
      },
    ],
  },
  // Mobile App feedbacks (10)
  {
    projectName: 'mobile-app-feedback',
    feedbacks: [
      {
        rating: 5,
        status: 'new',
        comment: 'Best app ever! Use it every day.',
        email: 'superuser@email.com',
        tags: ['positive'],
        meta: { device_type: 'mobile', os: 'iOS' },
      },
      {
        rating: 5,
        status: 'read',
        comment: 'Latest update is fantastic!',
        email: null,
        tags: ['positive', 'update'],
        meta: { device_type: 'mobile', os: 'Android' },
      },
      {
        rating: 5,
        status: 'read',
        comment: 'Smooth and intuitive. Love it!',
        email: 'fan@app.com',
        tags: ['positive', 'ux'],
        meta: { device_type: 'mobile', os: 'iOS' },
      },
      {
        rating: 4,
        status: 'new',
        comment: 'Great app, please add dark mode!',
        email: 'night@owl.com',
        tags: ['positive', 'feature-request'],
        meta: { device_type: 'mobile', os: 'Android' },
      },
      {
        rating: 4,
        status: 'read',
        comment: 'Very useful, minor bugs here and there.',
        email: null,
        tags: ['neutral', 'bug'],
        meta: { device_type: 'tablet', os: 'iOS' },
      },
      {
        rating: 3,
        status: 'new',
        comment: 'Okay but crashes occasionally.',
        email: 'user@email.com',
        tags: ['neutral', 'crash'],
        meta: { device_type: 'mobile', os: 'Android' },
      },
      {
        rating: 3,
        status: 'read',
        comment: 'Battery drain is a bit high.',
        email: 'battery@saver.com',
        tags: ['neutral', 'performance'],
        meta: { device_type: 'mobile', os: 'iOS' },
      },
      {
        rating: 2,
        status: 'read',
        comment: 'App freezes when opening notifications.',
        email: 'tech@issues.com',
        tags: ['negative', 'bug'],
        meta: { device_type: 'mobile', os: 'Android' },
      },
      {
        rating: 2,
        status: 'new',
        comment: "Can't login with my Google account.",
        email: 'login@help.com',
        tags: ['negative', 'bug', 'auth'],
        meta: { device_type: 'mobile', os: 'iOS' },
      },
      {
        rating: 1,
        status: 'read',
        comment: 'App deleted all my data!!',
        email: 'furious@user.com',
        tags: ['negative', 'critical', 'data-loss'],
        meta: { device_type: 'mobile', os: 'Android' },
      },
    ],
  },
  // Support Portal feedbacks (10)
  {
    projectName: 'support-portal',
    feedbacks: [
      {
        rating: 5,
        status: 'new',
        comment: 'John from support was amazing! Solved my issue in minutes.',
        email: 'happy@customer.com',
        tags: ['positive', 'support'],
        meta: { url: '/support/ticket/1234' },
      },
      {
        rating: 5,
        status: 'read',
        comment: "Best customer service I've experienced!",
        email: 'impressed@client.com',
        tags: ['positive', 'support'],
        meta: { url: '/support/chat' },
      },
      {
        rating: 5,
        status: 'read',
        comment: 'Quick, friendly, and helpful. Thank you!',
        email: null,
        tags: ['positive', 'support'],
        meta: { url: '/support/ticket/1235' },
      },
      {
        rating: 4,
        status: 'new',
        comment: 'Good support overall.',
        email: 'satisfied@user.com',
        tags: ['positive', 'support'],
        meta: { url: '/support/ticket/1236' },
      },
      {
        rating: 4,
        status: 'read',
        comment: 'Issue resolved, but took a bit longer than expected.',
        email: null,
        tags: ['neutral', 'support'],
        meta: { url: '/support/ticket/1237' },
      },
      {
        rating: 3,
        status: 'new',
        comment: 'Support was okay, issue partially resolved.',
        email: 'neutral@client.com',
        tags: ['neutral', 'support'],
        meta: { url: '/support/ticket/1238' },
      },
      {
        rating: 3,
        status: 'read',
        comment: 'Had to follow up multiple times.',
        email: null,
        tags: ['neutral', 'support'],
        meta: { url: '/support/ticket/1239' },
      },
      {
        rating: 2,
        status: 'read',
        comment: 'Support agent seemed uninterested.',
        email: 'disappointed@user.com',
        tags: ['negative', 'support'],
        meta: { url: '/support/ticket/1240' },
      },
      {
        rating: 2,
        status: 'new',
        comment: 'Issue still not resolved after a week.',
        email: 'waiting@customer.com',
        tags: ['negative', 'support', 'escalation'],
        meta: { url: '/support/ticket/1241' },
      },
      {
        rating: 1,
        status: 'read',
        comment: 'Terrible experience! Agent hung up on me!',
        email: 'furious@client.com',
        tags: ['negative', 'support', 'critical'],
        meta: { url: '/support/ticket/1242' },
      },
    ],
  },
]

async function generateApiKey(): Promise<string> {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let key = 'fp_'
  // Generate 57 random chars to fit in varchar(64) with "fp_" prefix
  for (let i = 0; i < 57; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return key
}

async function createRandomDate(daysBack: number): Promise<Date> {
  const now = new Date()
  const pastDate = new Date(
    now.getTime() - Math.random() * daysBack * 24 * 60 * 60 * 1000
  )
  return pastDate
}

async function seed() {
  console.log('🌱 Starting dummy data seed...')

  try {
    // Get or create owner user
    const ownerResult = await db
      .select()
      .from(users)
      .where(eq(users.email, OWNER_EMAIL))
      .limit(1)

    if (ownerResult.length === 0) {
      console.error(`❌ Owner user not found: ${OWNER_EMAIL}`)
      console.log(
        '💡 Please create this user first or change OWNER_EMAIL in the script'
      )
      process.exit(1)
    }

    const owner = ownerResult[0]
    console.log(
      `✅ Found owner: ${owner.name || owner.email} (ID: ${owner.id})`
    )

    // Clear existing dummy data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Cleaning up existing dummy data...')
    const existingProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.ownerId, owner.id))

    for (const project of existingProjects) {
      await db.delete(feedbacks).where(eq(feedbacks.projectId, project.id))
    }
    await db.delete(projects).where(eq(projects.ownerId, owner.id))
    console.log('✅ Cleanup complete')

    // Create projects
    console.log(`\n📁 Creating ${dummyProjects.length} projects...`)
    const createdProjects: Record<string, string> = {}

    for (const projectData of dummyProjects) {
      const [newProject] = await db
        .insert(projects)
        .values({
          ownerId: owner.id,
          name: projectData.name,
          slug: projectData.slug,
          tier: projectData.tier,
          domainWhitelist: projectData.domainWhitelist,
          apiKey: await generateApiKey(),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          widgetConfig: projectData.widgetConfig as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          settings: projectData.settings as any,
        })
        .returning()

      createdProjects[projectData.slug] = newProject.id
      console.log(`  ✓ Created: ${projectData.name}`)
    }

    // Create feedbacks
    console.log(`\n💬 Creating feedbacks...`)
    let totalFeedbacks = 0

    for (const projectFeedback of dummyFeedbacks) {
      const projectId = createdProjects[projectFeedback.projectName]
      if (!projectId) continue

      for (const fb of projectFeedback.feedbacks) {
        const randomDate = await createRandomDate(30) // Last 30 days

        await db.insert(feedbacks).values({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          projectId: projectId as any,
          rating: fb.rating,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          status: fb.status as any,
          answers: {
            comment: fb.comment,
            email: fb.email,
            tags: fb.tags,
          },
          meta: {
            ...fb.meta,
            user_agent: 'Mozilla/5.0 (Dummy Data Seeder)',
            browser: 'Chrome',
            os: ['Windows', 'macOS', 'Linux', 'iOS', 'Android'][
              Math.floor(Math.random() * 5)
            ],
            device_type: ['desktop', 'mobile', 'tablet'][
              Math.floor(Math.random() * 3)
            ],
          },
          createdAt: randomDate,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
        totalFeedbacks++
      }
    }

    console.log(`\n🎉 Dummy data seed completed successfully!`)
    console.log('\n📊 Summary:')
    console.log(`  - ${dummyProjects.length} projects created`)
    console.log(`  - ${totalFeedbacks} feedbacks created`)
    console.log(
      '\n💡 You can now login and view the projects in the dashboard!'
    )

    // Show project details
    console.log('\n📋 Created Projects:')
    for (const project of dummyProjects) {
      const projectId = createdProjects[project.slug]
      console.log(`  - ${project.name} (${project.tier})`)
      console.log(`    ID: ${projectId}`)
    }
  } catch (error) {
    console.error('❌ Error seeding dummy data:', error)
    process.exit(1)
  }
}

seed()
  .then(() => {
    console.log('\n✅ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })
