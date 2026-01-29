# Feedback SaaS Platform

A comprehensive feedback collection and analytics platform built with Next.js 16, featuring multi-project management, customizable widgets, real-time analytics, and Role-Based Access Control (RBAC).

## 🚀 Tech Stack

- **Framework**: [Next.js 16.1.4](https://nextjs.org) (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Package Manager**: pnpm
- **UI Components**: [Shadcn UI](https://ui.shadcn.com) (Radix Primitives)
- **Icons**: [Lucide React](https://lucide.dev)
- **Theming**: next-themes (Dark/Light mode)
- **Fonts**: Inter (Google Fonts)
- **Database**: [Drizzle ORM](https://orm.drizzle.team) + PostgreSQL
- **Authentication**: NextAuth.js with Credentials Provider
- **Authorization**: Role-Based Access Control (RBAC)
- **Form Handling**: React Hook Form + Zod validation

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Running Development Server](#running-development-server)
- [Database Seeding](#database-seeding)
- [Features](#features)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Widget Build](#widget-build)
- [RBAC System](#rbac-system)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ or higher
- **pnpm** (recommended) - [Installation Guide](https://pnpm.io/installation)
- **PostgreSQL** database (local or remote)
- **Git**

## Quick Start

```bash
# Clone the repository
git clone https://github.com/FUA26/fuzzy-potato.git
cd fuzzy-potato

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Update .env with your database credentials
# Then continue with Database Setup below

# Run database migrations
pnpm db:migrate

# Seed database with initial data
pnpm db:seed:resources
pnpm db:seed

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Environment Setup

1. **Create `.env` file** (if not exists):

```bash
cp .env.example .env
```

2. **Configure environment variables** in `.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database_name"

# JWT Secret (IMPORTANT: Generate a secure random secret!)
JWT_SECRET="your-super-secret-jwt-key-here"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

3. **Generate JWT Secret** (important for production):

```bash
# macOS/Linux
openssl rand -base64 32

# Windows (PowerShell)
[System.Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 -Minimum 0 }) -join '')
```

## Database Setup

### Option 1: PostgreSQL Server (Recommended for Production)

1. Ensure PostgreSQL is installed and running
2. Create a database:
   ```sql
   CREATE DATABASE bandanaiera;
   ```
3. Update `DATABASE_URL` in `.env` with your connection string

### Option 2: Docker (Local Development)

If using Docker for local PostgreSQL:

```bash
# Start PostgreSQL container
pnpm docker:up

# Check logs
pnpm docker:logs

# Stop when done
pnpm docker:down
```

### Running Migrations

After configuring your database:

```bash
# Generate migrations from schema changes
pnpm db:generate

# Apply migrations to database
pnpm db:migrate

# Alternative: Push schema directly (skips migration files)
pnpm db:push

# Open Drizzle Studio (database GUI)
pnpm db:studio
```

## Database Seeding

### 1. Seed Resources (Resource Management)

```bash
# Seed default resources (dashboard, users, roles, permissions, etc.)
npx tsx --env-file=.env db/seed-resources.ts
```

This creates 11 default resources:

- Dashboard, Users, Roles, Permissions, Tasks, Projects, Posts, Settings, Reports, Audit Logs, System

### 2. Seed RBAC Roles and Permissions

```bash
# Seed 4 roles (Super Admin, Administrator, User, Viewer) and 37 permissions
npx tsx --env-file=.env db/seed-rbac.ts
```

### 3. Assign Admin Role to User

```bash
# Assign Super Admin role to a user
npx tsx --env-file=.env db/assign-admin.ts user@example.com

# Assign admin to test@mail.com
npx tsx --env-file=.env db/assign-admin.ts test@mail.com
```

### Important Note

Always use `npx tsx --env-file=.env` for seed scripts to ensure environment variables are loaded correctly!

## Running Development Server

```bash
# Start development server
pnpm dev

# Or build for production
pnpm build
pnpm start
```

Visit [http://localhost:3000](http://localhost:3000)

- **Backoffice**: http://localhost:3000/dashboard
- **Login**: http://localhost:3000/login

## Features

### 🎯 Feedback Collection System

- **Multi-Project Management**: Create and manage multiple feedback projects
- **Customizable Widget Builder**: Visual editor with conditional logic
- **Rating System**: 1-5 star rating with customizable tags
- **Smart Logic Builder**: Different questions based on rating (positive/negative/neutral)
- **Domain Whitelist**: CORS protection for widget security
- **Public Widget API**: Fast endpoints for widget integration

### 📊 Analytics Dashboard

- **Real-time Statistics**: Total feedback, average rating, NPS score
- **Time Series Charts**: Daily/weekly/monthly trends
- **Tag Analysis**: Top tags with sentiment tracking
- **Performance Metrics**: Response time, completion rate
- **Export Data**: CSV export (Pro feature)

### 🔐 Authentication & Authorization

- **NextAuth.js**: Secure authentication with credentials provider
- **Role-Based Access Control (RBAC)**: Fine-grained permissions
- **Resource Management**: Centralized permission definitions
- **User-Role Management**: Easy role assignment interface
- **Permission-based UI Filtering**: Components adapt to user permissions

### 👥 User Management

- Create, edit, delete users
- Assign/remove roles to users
- Reset user passwords
- View user roles and permissions
- Bulk user operations

### 🗄️ Resource Management

- Define system resources (users, tasks, projects, etc.)
- CRUD operations for resources
- Delete protection for in-use resources
- Resource identifiers for code references

### 🔒 Role & Permission Management

- Create and manage roles
- Create and manage permissions
- Link permissions to roles
- Visual permission assignment interface

### 📊 Dashboard

- Statistics cards
- Recent activities
- Quick actions

### 🎨 UI Features

- **Dark/Light mode** toggle
- **Responsive design** for all screen sizes
- **Data tables** with filtering, sorting, and pagination
- **Faceted filters** for advanced data filtering
- **Bulk actions** with action bar
- **Dialog-based forms** for create/edit operations
- **Toast notifications** for user feedback

## Project Structure

```
fuzzy-potato/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes (login, register, etc.)
│   │   └── layout.tsx
│   ├── (backoffice)/             # Protected backoffice routes
│   │   ├── layout.tsx            # Backoffice layout with sidebar
│   │   ├── dashboard/            # Dashboard page
│   │   ├── users/                # User management
│   │   ├── roles/                # Role management
│   │   ├── permissions/          # Permission management
│   │   └── resources/            # Resource management
│   ├── api/                      # API routes
│   │   ├── v1/                   # Public API (widget)
│   │   │   └── widget/           # Widget endpoints
│   │   ├── dashboard/            # Private API (dashboard)
│   │   │   └── projects/         # Project management
│   │   ├── auth/                 # NextAuth endpoints
│   │   └── admin/                # Admin endpoints
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/
│   ├── ui/                       # Shadcn UI components
│   ├── dashboard/                # Dashboard-specific components
│   │   └── layout/               # Layout components (sidebar, header)
│   ├── data-table/               # Data table components
│   ├── rbac/                     # RBAC components (Protect, etc.)
│   └── ...
├── db/                           # Database layer
│   ├── schema/                   # Database schemas
│   │   ├── users.ts
│   │   ├── roles.ts
│   │   ├── permissions.ts
│   │   ├── resources.ts          # Resource definitions
│   │   ├── user-roles.ts         # User-role relationships
│   │   ├── role-permissions.ts    # Role-permission relationships
│   │   ├── projects.ts           # Projects (Feedback SaaS)
│   │   ├── feedbacks.ts          # Feedbacks (high-volume)
│   │   └── webhooks.ts           # Webhooks (integrations)
│   ├── seed-rbac.ts              # RBAC seed script
│   ├── seed-resources.ts         # Resources seed script
│   ├── assign-admin.ts           # Admin assignment script
│   └── index.ts                  # Database client export
├── lib/                          # Utility functions
│   ├── auth/                     # Authentication utilities
│   │   ├── config.ts
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   ├── permissions.ts        # Permission helpers
│   │   └── middleware.ts
│   ├── rbac/                     # RBAC server utilities
│   │   └── server.ts             # Server-side permission checks
│   └── utils.ts                  # Common utilities (cn function)
├── docs/                         # Documentation
│   ├── GENERAL_KNOWLEDGE.md      # Best practices & coding standards
│   ├── PROJECT_ROADMAP.md        # Development phases
│   ├── RBAC_IMPLEMENTATION.md    # RBAC system guide
│   ├── USER_ROLE_RBAC_PRD.md     # RBAC PRD
│   └── RESOURCE_MANAGEMENT_IMPLEMENTATION.md
└── drizzle/                      # Database migrations
```

## Available Scripts

### Development

```bash
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build           # Build for production
pnpm start           # Start production server
pnpm lint            # Run ESLint
pnpm format          # Format code with Prettier
pnpm check-types     # Type checking without emit
```

### Database

```bash
pnpm db:generate     # Generate database migrations
pnpm db:migrate      # Run database migrations
pnpm db:push         # Push schema changes to database
pnpm db:studio       # Open Drizzle Studio for database GUI
pnpm db:seed         # Seed RBAC roles and permissions
pnpm db:seed:resources # Seed default resources
pnpm db:assign-admin # Assign admin role to user
```

### Docker

```bash
pnpm docker:up       # Start PostgreSQL container
pnpm docker:down     # Stop PostgreSQL container
pnpm docker:logs      # View PostgreSQL logs
```

### Widget

```bash
# Navigate to widget package
cd packages/widget

# Install dependencies
pnpm install

# Development mode
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Widget Build

The embeddable feedback widget is built with **Preact** for minimal bundle size.

### Quick Start

```bash
cd packages/widget
pnpm install
pnpm build
```

### Widget Features

- 📦 **Lightweight** - ~30KB gzipped
- 🎨 **Customizable** - Theme, colors, position, behavior
- 🧠 **Logic Builder** - Dynamic forms based on ratings
- 📱 **Responsive** - Works on all devices
- 🌙 **Dark Mode** - Automatic support

### Installation for End Users

```html
<script src="https://your-domain.com/widget.js"></script>
<script>
  FeedbackWidget.init({
    projectId: 'YOUR_PROJECT_ID',
  })
</script>
```

### Development

For full widget build documentation, see **[docs/WIDGET_BUILD.md](docs/WIDGET_BUILD.md)**

Topics covered:

- Development setup
- Production build
- Deployment options (CDN, Next.js, standalone)
- Integration guide (HTML, WordPress, Shopify, React)
- Troubleshooting

### Widget Structure

```
packages/widget/
├── src/
│   ├── widget.tsx      # Main widget component
│   ├── widget.css      # Scoped widget styles
│   └── types.ts        # TypeScript definitions
├── dist/               # Build output
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## RBAC System

### Overview

The application implements a comprehensive Role-Based Access Control (RBAC) system with:

- **Users**: Application users
- **Roles**: Groupings of permissions (e.g., Super Admin, Administrator, User)
- **Permissions**: Granular access rights (e.g., `users.read`, `tasks.create`)
- **Resources**: Centralized resource definitions (e.g., users, tasks, projects)

### Permission Format

Permissions follow the pattern: `{resource}.{action}`

Examples:

- `users.read` - View users
- `users.create` - Create new users
- `users.update` - Edit users
- `users.delete` - Delete users
- `*` - Wildcard permission (grants all access)

### Default Roles

1. **Super Admin**: Full access with wildcard `*` permission
2. **Administrator**: Management permissions (no delete)
3. **User**: Basic access with read and task management
4. **Viewer**: Read-only access

### Using Permissions in Code

#### Client-Side (Protect Component)

```tsx
import { Protect } from '@/components/rbac'

<Protect permission="users.create">
  <Button>Create User</Button>
</Protect>

<Protect permissions={["users.update", "users.delete"]} requireAll>
  <Button>Manage Users</Button>
</Protect>
```

#### Server-Side (API Routes)

```tsx
import { requireServerPermission } from '@/lib/rbac/server'

export async function POST(req: NextRequest) {
  await requireServerPermission('users.create')

  // Your logic here
}
```

#### Server Components

```tsx
import { checkServerPermission } from '@/lib/rbac/server'

export default async function Page() {
  const canCreateUsers = await checkServerPermission('users.create')

  if (!canCreateUsers) {
    return <div>Access Denied</div>
  }

  return <div>Users Page</div>
}
```

## API Endpoints

### Public API (Widget)

- `GET /api/v1/widget/config` - Get widget configuration (CORS protected)
- `POST /api/v1/widget/feedback` - Submit feedback

### Private API (Dashboard)

**Projects:**

- `GET /api/dashboard/projects` - List all projects
- `POST /api/dashboard/projects` - Create new project
- `GET /api/dashboard/projects/[id]` - Get project details
- `PATCH /api/dashboard/projects/[id]` - Update project
- `DELETE /api/dashboard/projects/[id]` - Delete project
- `GET /api/dashboard/projects/[id]/stats` - Get analytics statistics
- `GET /api/dashboard/projects/[id]/feedbacks` - Get feedbacks with pagination
- `PATCH /api/dashboard/projects/[id]/feedbacks` - Bulk update feedback status
- `GET /api/dashboard/projects/[id]/install` - Get installation assets

**Feedbacks:**

- `PATCH /api/dashboard/feedbacks/[feedbackId]` - Update feedback status
- `DELETE /api/dashboard/feedbacks/[feedbackId]` - Delete feedback

### Authentication

- `POST /api/auth/login` - User login (NextAuth)
- `POST /api/auth/logout` - User logout (NextAuth)
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user with permissions

### Users Management

- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user
- `GET /api/admin/users/[userId]/roles` - Get user roles
- `POST /api/admin/users/[userId]/roles` - Assign role to user
- `DELETE /api/admin/users/[userId]/roles?roleId=xxx` - Remove role from user

### Roles Management

- `GET /api/admin/roles` - Get all roles
- `POST /api/admin/roles` - Create new role
- `PUT /api/admin/roles/[id]` - Update role
- `DELETE /api/admin/roles/[id]` - Delete role

### Permissions Management

- `GET /api/admin/permissions` - Get all permissions
- `POST /api/admin/permissions` - Create new permission
- `PUT /api/admin/permissions/[id]` - Update permission
- `DELETE /api/admin/permissions/[id]` - Delete permission

### Resources Management

- `GET /api/admin/resources` - Get all resources
- `POST /api/admin/resources` - Create new resource
- `PUT /api/admin/resources/[id]` - Update resource
- `DELETE /api/admin/resources/[id]` - Delete resource

## Troubleshooting

### Database Connection Issues

**Error**: `connect ECONNREFUSED ::1:5432`

**Solution**:

- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env` file
- Verify database credentials are correct

### Permission Denied Errors

**Error**: `Permission denied` or `403 Forbidden`

**Solution**:

- Ensure you're logged in
- Check if you have the required role/permission
- Try logging out and back in to refresh permissions

### Seed Scripts Fail

**Error**: Seed script fails or doesn't work

**Solution**:

- Always use `npx tsx --env-file=.env` for seed scripts
- Ensure database migrations have been run first
- Check `.env` file exists and has correct values

### Build Errors

**Error**: TypeScript or build errors

**Solution**:

```bash
# Check types
pnpm check-types

# Fix linting issues
pnpm lint

# Format code
pnpm format
```

### Migration Conflicts

**Error**: Migration conflicts or schema mismatch

**Solution**:

```bash
# Regenerate migrations
pnpm db:generate

# Or push schema directly
pnpm db:push

# Check migration status
pnpm db:migrate
```

## Default Login Credentials

After seeding, you can assign admin role to any user:

```bash
npx tsx --env-file=.env db/assign-admin.ts your-email@example.com
```

For testing, the user `test@mail.com` (name: Edited) has been assigned Super Admin role.

## Development Workflow

1. **Create feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test**

   ```bash
   pnpm dev
   ```

3. **Format and lint**

   ```bash
   pnpm format
   pnpm lint
   ```

4. **Commit changes** (husky will run lint-staged automatically)

   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

5. **Push to remote**
   ```bash
   git push origin feature/your-feature-name
   ```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Shadcn UI Documentation](https://ui.shadcn.com)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)

## Contributing

This project uses:

- **Husky** for git hooks
- **lint-staged** for pre-commit linting
- **Commitlint** for conventional commits
- **Prettier** for code formatting
- **ESLint** for code quality

Please follow the commit message format:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## License

This project is licensed under the MIT License.

---

**Built with ❤️ using Next.js 16, TypeScript, and Tailwind CSS v4**
