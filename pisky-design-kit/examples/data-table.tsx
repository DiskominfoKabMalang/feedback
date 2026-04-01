/**
 * Pisky Design System - Data Table Example
 *
 * Tabel data dengan actions dan pagination.
 *
 * Dependencies:
 * pnpm add lucide-react
 *
 * Usage:
 * Copy ke komponen Anda dan modifikasi datanya.
 */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Column<T> {
  key: keyof T | string
  header: string
  cell?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  actions?: (item: T) => React.ReactNode
}

export function DataTable<T>({ data, columns, actions }: DataTableProps<T>) {
  return (
    <div className="border rounded-xl">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.key)}>{column.header}</TableHead>
            ))}
            {actions && <TableHead className="w-[50px]"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (actions ? 1 : 0)}
                className="text-center text-muted-foreground py-8"
              >
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={String(column.key)}>
                    {column.cell
                      ? column.cell(item)
                      : String((item as Record<string, unknown>)[column.key])}
                  </TableCell>
                ))}
                {actions && <TableCell>{actions(item)}</TableCell>}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

/* ============================================
   USAGE EXAMPLE
   ============================================ */
/*
import { DataTable } from '@/components/examples/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontalIcon, PencilIcon, TrashIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface User {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive'
}

const columns = [
  {
    key: 'name',
    header: 'Name',
  },
  {
    key: 'email',
    header: 'Email',
  },
  {
    key: 'status',
    header: 'Status',
    cell: (user: User) => (
      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
        {user.status}
      </Badge>
    ),
  },
]

const actions = (user: User) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <MoreHorizontalIcon className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>
        <PencilIcon className="mr-2 h-4 w-4" />
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem className="text-destructive">
        <TrashIcon className="mr-2 h-4 w-4" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

export default function UsersPage() {
  const users: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
  ]

  return (
    <div className="space-y-6">
      <DataTable data={users} columns={columns} actions={actions} />
    </div>
  )
}
*/
