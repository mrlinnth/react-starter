import { buildRequest, buildUrl } from '#/lib/api'

export interface User {
  id: number
  name: string
  email: string
  phone: string
  company: { name: string }
}

async function getUsers(): Promise<User[]> {
  const response = await fetch(buildUrl('/users'), buildRequest())
  if (!response.ok) throw new Error('Failed to fetch users')
  return response.json()
}

export const ApiService = {
  getUsers,
}
