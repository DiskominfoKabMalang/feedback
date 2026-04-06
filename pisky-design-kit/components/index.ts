/**
 * Pisky Design System - Component Index
 *
 * Export semua komponen dari satu file untuk kemudahan import.
 *
 * Usage:
 * import { Button, Card, Input } from '@/components/ui'
 * atau
 * import { Button } from '@/components/ui/button'
 */

// Button
export { Button, buttonVariants } from './button'
export type { ButtonProps } from './button'

// Card
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from './card'

// Input
export { Input } from './input'

// Badge
export { Badge, badgeVariants } from './badge'

// Table
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './table'

// Dialog
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from './dialog'

// Alert
export { Alert, AlertTitle, AlertDescription } from './alert'

// Tabs
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

// Label
export { Label } from './label'
