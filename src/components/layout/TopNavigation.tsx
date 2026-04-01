import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { useAuthStore } from '#/store/useAuthStore'
import { useThemeStore } from '#/store/useThemeStore'

export function TopNavigation() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()

  const handleLogout = () => {
    logout()
    navigate({ to: '/' })
  }

  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b">
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link to="/">Home</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/about">About</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/customers">Customers</Link>
        </Button>
        {isAuthenticated ? (
          <>
            <span className="text-sm px-3">Hello, {(user as any)?.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/register">Register</Link>
            </Button>
          </>
        )}
      </div>
      <Button variant="outline" size="sm" onClick={toggleTheme}>
        {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
      </Button>
    </nav>
  )
}
