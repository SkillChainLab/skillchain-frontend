'use client'

import { useState } from 'react'
import { ArrowLeft, BarChart3, Briefcase, DollarSign, Users, Bell, Calendar, Clock, Star, TrendingUp, MessageSquare, Plus, Eye, CheckCircle, AlertCircle, Activity, Target, Zap } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'

interface DashboardStats {
  totalEarnings: number
  activeProjects: number
  completedProjects: number
  averageRating: number
  profileViews: number
  connections: number
  pendingProposals: number
  unreadMessages: number
}

interface Project {
  id: string
  title: string
  client: string
  budget: number
  status: 'active' | 'pending' | 'completed' | 'in_review'
  progress: number
  deadline: string
  lastUpdate: string
  priority: 'high' | 'medium' | 'low'
}

interface Notification {
  id: string
  type: 'payment' | 'proposal' | 'message' | 'milestone' | 'system'
  title: string
  message: string
  time: string
  isRead: boolean
}

interface EarningsData {
  month: string
  earnings: number
  projects: number
}

// Mock data
const MOCK_STATS: DashboardStats = {
  totalEarnings: 12450,
  activeProjects: 4,
  completedProjects: 18,
  averageRating: 4.8,
  profileViews: 156,
  connections: 89,
  pendingProposals: 3,
  unreadMessages: 7
}

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'DeFi Trading Platform Development',
    client: 'TechCorp Inc.',
    budget: 5000,
    status: 'active',
    progress: 75,
    deadline: '2024-02-15',
    lastUpdate: '2 hours ago',
    priority: 'high'
  },
  {
    id: '2',
    title: 'E-commerce Website Redesign',
    client: 'StartupXYZ',
    budget: 2500,
    status: 'in_review',
    progress: 100,
    deadline: '2024-01-30',
    lastUpdate: '1 day ago',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Mobile App UI/UX Design',
    client: 'DesignStudio',
    budget: 1800,
    status: 'active',
    progress: 45,
    deadline: '2024-02-20',
    lastUpdate: '5 hours ago',
    priority: 'medium'
  },
  {
    id: '4',
    title: 'Smart Contract Audit',
    client: 'CryptoFirm',
    budget: 3200,
    status: 'pending',
    progress: 0,
    deadline: '2024-02-28',
    lastUpdate: '3 days ago',
    priority: 'low'
  }
]

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'payment',
    title: 'Payment Received',
    message: 'You received 2,500 VUSD for DeFi Trading Platform milestone',
    time: '2 hours ago',
    isRead: false
  },
  {
    id: '2',
    type: 'proposal',
    title: 'New Proposal Accepted',
    message: 'Your proposal for Mobile App Development was accepted',
    time: '1 day ago',
    isRead: false
  },
  {
    id: '3',
    type: 'message',
    title: 'New Message',
    message: 'TechCorp Inc. sent you a message about the project requirements',
    time: '3 hours ago',
    isRead: true
  },
  {
    id: '4',
    type: 'milestone',
    title: 'Milestone Completed',
    message: 'E-commerce Website milestone submitted for review',
    time: '1 day ago',
    isRead: true
  }
]

const MOCK_EARNINGS: EarningsData[] = [
  { month: 'Oct', earnings: 2800, projects: 3 },
  { month: 'Nov', earnings: 4200, projects: 5 },
  { month: 'Dec', earnings: 3650, projects: 4 },
  { month: 'Jan', earnings: 5200, projects: 6 }
]

export default function DashboardPage() {
  const [stats] = useState<DashboardStats>(MOCK_STATS)
  const [projects] = useState<Project[]>(MOCK_PROJECTS)
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [earnings] = useState<EarningsData[]>(MOCK_EARNINGS)
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'earnings' | 'notifications'>('overview')

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ))
  }

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'in_review': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'payment': return <DollarSign className="w-5 h-5 text-green-400" />
      case 'proposal': return <Briefcase className="w-5 h-5 text-blue-400" />
      case 'message': return <MessageSquare className="w-5 h-5 text-purple-400" />
      case 'milestone': return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'system': return <AlertCircle className="w-5 h-5 text-orange-400" />
      default: return <Bell className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex flex-col">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-white hover:text-gray-300 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <div className="text-2xl font-bold flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              Dashboard
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/marketplace" className="text-gray-300 hover:text-white transition-colors">Marketplace</Link>
            <Link href="/social" className="text-gray-300 hover:text-white transition-colors">Social</Link>
            <Link href="/messages" className="text-gray-300 hover:text-white transition-colors">Messages</Link>
            <Link href="/convert" className="text-gray-300 hover:text-white transition-colors">Convert</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 relative z-10 container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center text-white mb-12">
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Your Dashboard
              </span>
            </h1>
            <p className="text-xl text-gray-300">
              Monitor your progress and manage your freelancing journey
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<DollarSign className="w-8 h-8" />}
              title="Total Earnings"
              value={`$${stats.totalEarnings.toLocaleString()}`}
              subtitle="VUSD equivalent"
              gradient="from-green-500 to-emerald-500"
              trend="+12%"
            />
            <StatCard
              icon={<Briefcase className="w-8 h-8" />}
              title="Active Projects"
              value={stats.activeProjects.toString()}
              subtitle={`${stats.completedProjects} completed`}
              gradient="from-blue-500 to-cyan-500"
              trend="+25%"
            />
            <StatCard
              icon={<Star className="w-8 h-8" />}
              title="Average Rating"
              value={stats.averageRating.toString()}
              subtitle="Based on client feedback"
              gradient="from-yellow-500 to-orange-500"
              trend="+0.2"
            />
            <StatCard
              icon={<Users className="w-8 h-8" />}
              title="Profile Views"
              value={stats.profileViews.toString()}
              subtitle="This month"
              gradient="from-purple-500 to-pink-500"
              trend="+45%"
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickActionButton
                icon={<Plus className="w-5 h-5" />}
                label="New Proposal"
                href="/marketplace"
                gradient="from-blue-500 to-purple-600"
              />
              <QuickActionButton
                icon={<MessageSquare className="w-5 h-5" />}
                label="Messages"
                href="/messages"
                gradient="from-purple-500 to-pink-600"
                badge={stats.unreadMessages}
              />
              <QuickActionButton
                icon={<DollarSign className="w-5 h-5" />}
                label="Convert VUSD"
                href="/convert"
                gradient="from-green-500 to-emerald-600"
              />
              <QuickActionButton
                icon={<Eye className="w-5 h-5" />}
                label="View Profile"
                href="/profile"
                gradient="from-orange-500 to-red-600"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-2 mb-8">
            <div className="flex gap-2">
              {[
                { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
                { id: 'projects', label: 'Projects', icon: <Briefcase className="w-4 h-4" /> },
                { id: 'earnings', label: 'Earnings', icon: <DollarSign className="w-4 h-4" /> },
                { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.id === 'notifications' && notifications.filter(n => !n.isRead).length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-1">
                      {notifications.filter(n => !n.isRead).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-blue-400" />
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {notifications.slice(0, 4).map(notification => (
                      <div key={notification.id} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-gray-400 text-sm">{notification.message}</p>
                          <p className="text-gray-500 text-xs mt-1">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Projects Preview */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Target className="w-6 h-6 text-green-400" />
                    Active Projects
                  </h3>
                  <div className="space-y-4">
                    {projects.filter(p => p.status === 'active').slice(0, 3).map(project => (
                      <div key={project.id} className="p-4 bg-white/5 rounded-xl">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm">{project.title}</h4>
                          <span className="text-green-400 font-bold text-sm">${project.budget}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex-1 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400">{project.progress}%</span>
                        </div>
                        <p className="text-xs text-gray-400">Due: {new Date(project.deadline).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">All Projects</h3>
                  <Link 
                    href="/marketplace/post-job"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-2 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New Project
                  </Link>
                </div>
                <div className="space-y-4">
                  {projects.map(project => (
                    <div key={project.id} className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold mb-2">{project.title}</h4>
                          <p className="text-gray-400">Client: {project.client}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-400 mb-1">${project.budget}</div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                            {project.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1 bg-gray-700 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{project.progress}%</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-400">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Due: {new Date(project.deadline).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Updated: {project.lastUpdate}
                          </span>
                        </div>
                        <span className={`flex items-center gap-1 ${getPriorityColor(project.priority)}`}>
                          <Zap className="w-4 h-4" />
                          {project.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Earnings Chart */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-6">Monthly Earnings</h3>
                  <div className="space-y-4">
                    {earnings.map((data, index) => (
                      <div key={data.month} className="flex items-center gap-4">
                        <span className="w-12 text-gray-400 font-medium">{data.month}</span>
                        <div className="flex-1 bg-gray-700 rounded-full h-6 relative">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-6 rounded-full transition-all flex items-center justify-end pr-3"
                            style={{ width: `${(data.earnings / 6000) * 100}%` }}
                          >
                            <span className="text-white text-sm font-bold">${data.earnings}</span>
                          </div>
                        </div>
                        <span className="w-16 text-gray-400 text-sm">{data.projects} jobs</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Earnings Summary */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-6">Earnings Summary</h3>
                  <div className="space-y-6">
                    <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
                      <div className="text-3xl font-bold text-green-400 mb-1">
                        ${stats.totalEarnings.toLocaleString()}
                      </div>
                      <p className="text-gray-300">Total Lifetime Earnings</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-xl">
                        <div className="text-xl font-bold text-blue-400 mb-1">${earnings[earnings.length - 1]?.earnings || 0}</div>
                        <p className="text-gray-400 text-sm">This Month</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl">
                        <div className="text-xl font-bold text-purple-400 mb-1">{earnings.reduce((sum, e) => sum + e.projects, 0)}</div>
                        <p className="text-gray-400 text-sm">Total Projects</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white/5 rounded-xl">
                      <div className="text-lg font-bold text-yellow-400 mb-1">
                        ${Math.round(stats.totalEarnings / stats.completedProjects)}
                      </div>
                      <p className="text-gray-400 text-sm">Average Project Value</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Notifications</h3>
                  <button className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                    Mark all as read
                  </button>
                </div>
                <div className="space-y-4">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-6 rounded-2xl border transition-colors cursor-pointer ${
                        notification.isRead 
                          ? 'bg-white/5 border-white/10' 
                          : 'bg-blue-500/10 border-blue-400/30'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold">{notification.title}</h4>
                            <span className="text-gray-400 text-sm">{notification.time}</span>
                          </div>
                          <p className="text-gray-300 leading-relaxed">{notification.message}</p>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function StatCard({ icon, title, value, subtitle, gradient, trend }: {
  icon: React.ReactNode
  title: string
  value: string
  subtitle: string
  gradient: string
  trend: string
}) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white hover:bg-white/10 transition-all transform hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className={`text-transparent bg-gradient-to-r ${gradient} bg-clip-text`}>
          {icon}
        </div>
        <span className="text-green-400 text-sm font-semibold bg-green-400/20 px-2 py-1 rounded-full">
          {trend}
        </span>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{subtitle}</div>
    </div>
  )
}

function QuickActionButton({ icon, label, href, gradient, badge }: {
  icon: React.ReactNode
  label: string
  href: string
  gradient: string
  badge?: number
}) {
  return (
    <Link 
      href={href}
      className={`relative bg-gradient-to-r ${gradient} hover:opacity-90 p-4 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center gap-3 text-white`}
    >
      {icon}
      <span>{label}</span>
      {badge && badge > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-6 h-6 flex items-center justify-center">
          {badge}
        </span>
      )}
    </Link>
  )
} 