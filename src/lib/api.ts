import { useAuthStore } from '#/store/useAuthStore'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export function buildUrl(
  endpoint: string,
  params?: Record<string, string>,
): string {
  const url = `${API_BASE_URL}${endpoint}`
  if (!params) return url
  return `${url}?${new URLSearchParams(params).toString()}`
}

export function buildRequest(
  method: string = 'GET',
  body?: unknown,
): RequestInit {
  const token = (useAuthStore.getState().user as { token?: string } | null)
    ?.token

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  return {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  }
}
