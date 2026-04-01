import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import { useCounterStore } from '#/store/useCounterStore'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { count, increment, decrement } = useCounterStore()

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>React Starter</CardTitle>
          <CardDescription>
            A full-stack React starter with following tech stack:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Vite — build tool and dev server</li>
            <li>Tailwind CSS — utility-first styling with dark mode</li>
            <li>shadcn/ui — accessible component library</li>
            <li>TanStack Router — type-safe file-based routing</li>
            <li>TanStack Query — server-state management</li>
            <li>Zustand — client-state management with persistence</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Counter Demo</CardTitle>
          <CardDescription>
            Powered by Zustand (useCounterStore)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={decrement}>
              −
            </Button>
            <span className="text-2xl font-bold w-12 text-center">{count}</span>
            <Button variant="outline" onClick={increment}>
              +
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
