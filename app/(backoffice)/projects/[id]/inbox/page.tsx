import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { FeedbackInboxClient } from './feedback-inbox-client'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    rating?: string
    status?: string
    tag?: string
  }>
}

export default async function FeedbackInboxPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params
  const { rating, status, tag } = await searchParams
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <FeedbackInboxClient
      projectId={id}
      initialFilters={{ rating, status, tag }}
    />
  )
}
