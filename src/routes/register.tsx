import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { useAuthStore } from '#/store/useAuthStore'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
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

    if (users.find((u) => u.email === email)) {
      setError('Email already registered')
      return
    }

    const newUser = { id: Date.now(), name, email, password }
    localStorage.setItem('mockUsers', JSON.stringify([...users, newUser]))

    useAuthStore.getState().login(newUser)
    navigate({ to: '/' })
  }

  return (
    <div className="max-w-sm mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
          Register
        </Button>
      </form>
    </div>
  )
}
