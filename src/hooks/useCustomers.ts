import { useQuery } from '@tanstack/react-query'
import { ApiService, type User } from '#/services/ApiService'

export function useCustomers() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: ApiService.getUsers,
  })
}
