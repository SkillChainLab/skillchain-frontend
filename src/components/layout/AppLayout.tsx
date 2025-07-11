'use client'
import { usePathname } from 'next/navigation'

interface AppLayoutProps {
  children: React.ReactNode
  className?: string
}

export default function AppLayout({ children, className }: AppLayoutProps) {
  const pathname = usePathname()
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main>
        {children}
      </main>
    </div>
  )
} 