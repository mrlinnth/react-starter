import { useState } from 'react'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { useAuthStore } from '#/store/useAuthStore'

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if (
      typeof window !== 'undefined' &&
      useAuthStore.getState().isAuthenticated
    ) {
      throw redirect({ to: '/' })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const users: Array<{
      id: number
      name: string
      email: string
      password: string
    }> = JSON.parse(localStorage.getItem('mockUsers') ?? '[]')

    const user = users.find((u) => u.email === email)

    if (!user || user.password !== password) {
      setError('Invalid email or password')
      return
    }

    useAuthStore.getState().login(user)
    navigate({ to: '/' })
  }

  return (
    <div className="max-w-sm mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  )
}
