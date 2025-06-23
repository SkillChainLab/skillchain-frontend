'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Users, 
  Briefcase, 
  MessageCircle, 
  Settings, 
  User, 
  Search,
  TrendingUp,
  Wallet,
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut
} from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
import { cn } from '@/components/ui/DesignSystem'
import NotificationCenter from '@/components/NotificationCenter'

interface SidebarProps {
  className?: string
}

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  children?: NavItem[]
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Find Talent',
    href: '/users',
    icon: Users,
  },
  {
    name: 'Marketplace',
    href: '/marketplace',
    icon: Briefcase,
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: MessageCircle,
    badge: 3,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: TrendingUp,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export default function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const { walletInfo, disconnectWallet } = useWallet()

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-40 transition-all duration-300',
          isCollapsed ? 'w-16' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={cn('p-4 border-b border-gray-200 dark:border-gray-700', isCollapsed && 'px-2')}>
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                {!isCollapsed && (
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    SkillChain
                  </span>
                )}
              </Link>
              
              {!isCollapsed && (
                <button
                  onClick={() => setIsCollapsed(true)}
                  className="hidden lg:block p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ChevronDown className="w-4 h-4 text-gray-500 rotate-90" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                    active 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
                    isCollapsed && 'justify-center px-2'
                  )}
                >
                  <Icon className={cn('w-5 h-5 flex-shrink-0', active && 'text-blue-600 dark:text-blue-400')} />
                  
                  {!isCollapsed && (
                    <>
                      <span className="font-medium truncate">{item.name}</span>
                      {item.badge && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                      {item.badge && (
                        <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Profile Section */}
          {walletInfo && (
            <div className={cn('p-4 border-t border-gray-200 dark:border-gray-700', isCollapsed && 'px-2')}>
              <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
                {/* Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">
                    {walletInfo.address.slice(5, 6).toUpperCase()}
                  </span>
                </div>
                
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {formatAddress(walletInfo.address)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {walletInfo.skillBalance} SKILL
                    </div>
                  </div>
                )}
              </div>
              
              {!isCollapsed && (
                <div className="mt-3 flex gap-2">
                  <NotificationCenter className="flex-1" />
                  <button
                    onClick={disconnectWallet}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Collapse Toggle */}
          {isCollapsed && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsCollapsed(false)}
                className="w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronDown className="w-4 h-4 text-gray-500 -rotate-90 mx-auto" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
} 