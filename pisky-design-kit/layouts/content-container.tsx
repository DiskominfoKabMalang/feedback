/**
 * Pisky Design System - Content Container Pattern
 *
 * Container untuk main content dengan responsive max-width.
 *
 * Usage:
 * import { ContentContainer } from '@/components/layout/content-container'
 *
 * <ContentContainer>
 *   <YourContent />
 * </ContentContainer>
 */

import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'

interface ContentContainerProps extends React.ComponentProps<'div'> {
  asChild?: boolean
  size?: 'sm' | 'md' | 'lg' | 'full'
}

export function ContentContainer({
  className,
  asChild = false,
  size = 'lg',
  children,
  ...props
}: ContentContainerProps) {
  const Wrapper = asChild ? Slot : 'div'

  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-7xl',
    full: 'max-w-full',
  }

  return (
    <Wrapper
      className={cn('mx-auto w-full px-4', sizeClasses[size], className)}
      {...props}
    >
      {children}
    </Wrapper>
  )
}

/* ============================================
   USAGE EXAMPLE
   ============================================ */
/*
import { ContentContainer } from '@/components/layout/content-container'

export default function Page() {
  return (
    <ContentContainer>
      <h1>Page Title</h1>
      <p>Content here...</p>
    </ContentContainer>
  )
}
*/
