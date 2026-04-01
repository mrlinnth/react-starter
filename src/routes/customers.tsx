import { createFileRoute, redirect } from '@tanstack/react-router'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { Button } from '#/components/ui/button'
import { useAuthStore } from '#/store/useAuthStore'
import { useCustomers } from '#/hooks/useCustomers'

export const Route = createFileRoute('/customers')({
  beforeLoad: () => {
    if (
      typeof window !== 'undefined' &&
      !useAuthStore.getState().isAuthenticated
    ) {
      throw redirect({ to: '/login' })
    }
  },
  component: CustomersPage,
})

function CustomersPage() {
  const { data, isLoading, isError, refetch } = useCustomers()

  if (isLoading) {
    return <p className="text-muted-foreground">Loading customers...</p>
  }

  if (isError) {
    return (
      <div className="space-y-3">
        <p className="text-destructive">
          Failed to load customers. Please try again.
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Customers</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Company</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.company.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
