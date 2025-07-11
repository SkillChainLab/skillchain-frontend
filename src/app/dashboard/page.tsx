'use client'

import { useState, useEffect } from 'react'
import { 
  Search,
  Bell,
  LogOut,
  User,
  Briefcase,
  Award,
  DollarSign,
  Activity,
  TrendingUp,
  Star,
  Users,
  Clock,
  Calendar,
  Eye,
  Plus,
  CheckCircle,
  AlertCircle,
  Wallet,
  Settings,
  ChevronRight,
  MessageSquare,
  Vote,
  Zap,
  Target,
  PieChart,
  BarChart3,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  Shield,
  GitBranch,
  Crown,
  Building,
  MapPin,
  Timer,
  RefreshCw,
  Filter,
  MoreHorizontal,
  ArrowUpDown,
  Mail,
  Lock,
  EyeOff
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogin, setShowLogin] = useState(true)
  const [activeSection, setActiveSection] = useState('overview')
  const [showNotifications, setShowNotifications] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  
  // Login/Register State
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'freelancer'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // User Data State
  const [userData, setUserData] = useState<{
    id?: string
    name: string
    email: string
    userType: string
    reputationScore?: number
    totalStaked?: number
    endorsementCount?: number
    memberSince?: string
    avatar: string
    verified?: boolean
    // Note: Balance data will be fetched from blockchain in the future
  } | null>(null)

  // Mock blockchain data - will be replaced with real blockchain calls
  const [blockchainBalance, setBlockchainBalance] = useState({
    vusd: 15000,
    skill: 8500
  })

  // Mock Active Jobs
  const activeJobs = [
    {
      id: 'JOB-001',
      title: 'DeFi Protocol Development',
      client: 'CryptoVentures Inc.',
      employer: 'crypto1abc...def9',
      status: 'ongoing',
      budget: 15000,
      paid: 8500,
      remaining: 6500,
      startDate: '2024-01-10',
      deadline: '2024-02-15',
      progress: 65,
      skills: ['Solidity', 'React', 'Web3'],
      priority: 'high'
    },
    {
      id: 'JOB-002',
      title: 'UI/UX Design for NFT Marketplace',
      client: 'ArtTech Studios',
      employer: 'art1mno...pqr5',
      status: 'review',
      budget: 8000,
      paid: 8000,
      remaining: 0,
      startDate: '2023-12-20',
      deadline: '2024-01-25',
      progress: 100,
      skills: ['Figma', 'UI/UX', 'NFT Design'],
      priority: 'medium'
    },
    {
      id: 'JOB-003',
      title: 'Smart Contract Audit',
      client: 'SecureChain Labs',
      employer: 'secure1ghi...jkl2',
      status: 'ongoing',
      budget: 12000,
      paid: 4000,
      remaining: 8000,
      startDate: '2024-01-20',
      deadline: '2024-02-28',
      progress: 30,
      skills: ['Security', 'Audit', 'Solidity'],
      priority: 'high'
    }
  ]

  // Mock Skills
  const userSkills = [
    {
      id: 'SKILL-01',
      name: 'React.js',
      level: 'Expert',
      endorsements: 18,
      reputationContribution: 450,
      staked: 2500,
      lastEndorsement: '2 days ago'
    },
    {
      id: 'SKILL-02',
      name: 'Solidity',
      level: 'Advanced',
      endorsements: 12,
      reputationContribution: 380,
      staked: 2000,
      lastEndorsement: '1 week ago'
    },
    {
      id: 'SKILL-03',
      name: 'Node.js',
      level: 'Expert',
      endorsements: 15,
      reputationContribution: 420,
      staked: 1800,
      lastEndorsement: '3 days ago'
    },
    {
      id: 'SKILL-04',
      name: 'UI/UX Design',
      level: 'Intermediate',
      endorsements: 8,
      reputationContribution: 240,
      staked: 1200,
      lastEndorsement: '1 week ago'
    }
  ]

  // Mock Reputation History (last 6 months)
  const reputationHistory = [
    { month: 'Aug', score: 4200, endorsements: 8, events: ['Skill Added: Python'] },
    { month: 'Sep', score: 4350, endorsements: 12, events: ['Project Completed', '3 New Endorsements'] },
    { month: 'Oct', score: 4450, endorsements: 15, events: ['Skill Upgraded: React'] },
    { month: 'Nov', score: 4650, endorsements: 18, events: ['Expert Level Achieved'] },
    { month: 'Dec', score: 4750, endorsements: 22, events: ['Major Project Success'] },
    { month: 'Jan', score: 4850, endorsements: 25, events: ['Security Audit Completed'] }
  ]

  // Mock Notifications
  const notifications = [
    {
      id: 'NOT-001',
      type: 'endorsement',
      title: 'New Skill Endorsement',
      message: 'Sarah Wilson endorsed your React.js skill',
      timestamp: '15 mins ago',
      isRead: false,
      priority: 'medium'
    },
    {
      id: 'NOT-002',
      type: 'job_offer',
      title: 'New Job Opportunity',
      message: 'TechCorp posted a new blockchain development job',
      timestamp: '1 hour ago',
      isRead: false,
      priority: 'high'
    },
    {
      id: 'NOT-003',
      type: 'reputation',
      title: 'Reputation Milestone',
      message: 'Congratulations! You reached 4850 reputation points',
      timestamp: '2 hours ago',
      isRead: true,
      priority: 'low'
    },
    {
      id: 'NOT-004',
      type: 'governance',
      title: 'New DAO Proposal',
      message: 'Vote on platform commission increase proposal',
      timestamp: '3 hours ago',
      isRead: false,
      priority: 'medium'
    }
  ]

  // Check authentication status on page load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log('🔍 Dashboard: Starting auth check...')
        
        // First check if we have stored auth data
        const storedUserData = localStorage.getItem('skillchain_user')
        const storedAuth = localStorage.getItem('skillchain_authenticated')
        
        if (storedUserData && storedAuth === 'true') {
          console.log('📱 Dashboard: Found stored auth data')
          setUserData(JSON.parse(storedUserData))
          setIsAuthenticated(true)
          return
        }
        
        const response = await fetch('/api/auth/me')
        console.log('📡 Dashboard: Auth response status:', response.status)
        console.log('📡 Dashboard: Auth response ok:', response.ok)
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ Dashboard: Auth response data:', data)
          
          if (data.success && data.user) {
            console.log('👤 Dashboard: Setting user data:', data.user)
            setUserData(data.user)
            setIsAuthenticated(true)
            
            // Store in localStorage for persistence
            localStorage.setItem('skillchain_user', JSON.stringify(data.user))
            localStorage.setItem('skillchain_authenticated', 'true')
          } else {
            console.log('❌ Dashboard: No valid user data in response')
            setIsAuthenticated(false)
            setUserData(null)
            // Clear stored data
            localStorage.removeItem('skillchain_user')
            localStorage.removeItem('skillchain_authenticated')
          }
        } else {
          console.log('❌ Dashboard: Auth check failed, response not ok')
          const errorText = await response.text()
          console.log('❌ Dashboard: Error response:', errorText)
          setIsAuthenticated(false)
          setUserData(null)
          // Clear stored data
          localStorage.removeItem('skillchain_user')
          localStorage.removeItem('skillchain_authenticated')
        }
      } catch (error) {
        console.error('💥 Dashboard: Auth check failed with error:', error)
        setIsAuthenticated(false)
        setUserData(null)
        // Clear stored data
        localStorage.removeItem('skillchain_user')
        localStorage.removeItem('skillchain_authenticated')
      }
    }

    checkAuthStatus()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setUserData(data.user)
        setIsAuthenticated(true)
        
        // Store in localStorage for persistence
        localStorage.setItem('skillchain_user', JSON.stringify(data.user))
        localStorage.setItem('skillchain_authenticated', 'true')
        
        setIsLoading(false)
      } else {
        alert(data.error || 'Login failed')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed. Please try again.')
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Validate passwords match
    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match')
      setIsLoading(false)
      return
    }
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
          userType: registerData.userType
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setUserData(data.user)
        setIsAuthenticated(true)
        
        // Store in localStorage for persistence
        localStorage.setItem('skillchain_user', JSON.stringify(data.user))
        localStorage.setItem('skillchain_authenticated', 'true')
        
        setIsLoading(false)
      } else {
        alert(data.error || 'Registration failed')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Register error:', error)
      alert('Registration failed. Please try again.')
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    fetch('/api/auth/logout', { method: 'POST' })
      .then(() => {
        setIsAuthenticated(false)
        setUserData(null)
        setShowProfileDropdown(false)
        
        // Clear localStorage
        localStorage.removeItem('skillchain_user')
        localStorage.removeItem('skillchain_authenticated')
      })
      .catch(error => {
        console.error('Logout error:', error)
        // Force logout even if API call fails
        setIsAuthenticated(false)
        setUserData(null)
        setShowProfileDropdown(false)
        
        // Clear localStorage
        localStorage.removeItem('skillchain_user')
        localStorage.removeItem('skillchain_authenticated')
      })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ongoing': return 'bg-green-50 text-green-800 border-green-200'
      case 'review': return 'bg-blue-50 text-blue-800 border-blue-200'
      case 'completed': return 'bg-purple-50 text-purple-800 border-purple-200'
      case 'cancelled': return 'bg-red-50 text-red-800 border-red-200'
      default: return 'bg-gray-50 text-gray-800 border-gray-200'
    }
  }

  const getSkillLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'expert': return 'bg-purple-600 text-white'
      case 'advanced': return 'bg-blue-600 text-white'
      case 'intermediate': return 'bg-green-600 text-white'
      case 'beginner': return 'bg-yellow-600 text-white'
      default: return 'bg-gray-600 text-white'
    }
  }

  // Show login/register if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-bold text-3xl">S</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">SkillChain</h1>
            <p className="text-gray-600">
              {showLogin ? 'Welcome back to your dashboard' : 'Join the decentralized freelancing platform'}
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-lg border border-white/20 shadow-2xl">
            <CardContent className="p-8">
              {/* Toggle Buttons */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                <button
                  onClick={() => setShowLogin(true)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    showLogin 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setShowLogin(false)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    !showLogin 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Login Form */}
              {showLogin ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="alex@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>
              ) : (
                /* Register Form */
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Alex Chen"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="alex@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User Type
                    </label>
                    <select
                      value={registerData.userType}
                      onChange={(e) => setRegisterData({ ...registerData, userType: e.target.value })}
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="freelancer">Freelancer</option>
                      <option value="client">Client</option>
                      <option value="both">Both</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" required />
                    <span className="ml-2 text-sm text-gray-600">
                      I agree to the <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
              )}

              <div className="mt-6 text-center">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Quick Access</span>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-4 justify-center">
                  <Link 
                    href="/"
                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                  >
                    Home
                  </Link>
                  <Link 
                    href="/explorer"
                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                  >
                    Explorer
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SkillChain</h1>
                <p className="text-xs text-gray-600">Dashboard</p>
              </div>
            </Link>

            {/* Dashboard Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'jobs', label: 'My Jobs', icon: Briefcase },
                { id: 'skills', label: 'Skills', icon: Award },
                { id: 'financial', label: 'Financials', icon: Wallet },
                { id: 'activity', label: 'Activity', icon: Bell }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 relative"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full text-xs"></span>
                  )}
                </button>
                
                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <p className="text-xs text-gray-600">{notifications.filter(n => !n.isRead).length} unread</p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.slice(0, 5).map((notif) => (
                        <div key={notif.id} className={`p-4 border-b border-gray-200 hover:bg-gray-50 ${!notif.isRead ? 'bg-blue-50' : ''}`}>
                          <div className="flex items-start gap-3">
                            <div className="p-1 rounded bg-gray-100">
                              <Bell className="w-3 h-3 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className={`text-sm font-medium ${!notif.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                {notif.title}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notif.timestamp}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200">
                      <button className="text-xs text-blue-600 hover:text-blue-800">View All Notifications</button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile & Logout */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-100">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{userData?.avatar}</span>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-gray-900">{userData?.name}</div>
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {userData?.reputationScore}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center gap-1 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'jobs', label: 'Jobs', icon: Briefcase },
                { id: 'skills', label: 'Skills', icon: Award },
                { id: 'financial', label: 'Financial', icon: Wallet },
                { id: 'activity', label: 'Activity', icon: Bell }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* User Summary Panel */}
            <Card className="bg-white border-gray-200 mb-8 shadow-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Profile Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-2xl">{userData?.avatar}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-bold text-gray-900">{userData?.name}</h2>
                          {userData?.verified && (
                            <Shield className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <p className="text-gray-700">{userData?.userType}</p>
                        <p className="text-xs text-gray-500">Member since {userData?.memberSince}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Email Address</p>
                      <p className="text-sm text-green-700 font-medium">{userData?.email}</p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="text-xs text-gray-600 font-medium">REPUTATION</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{userData?.reputationScore?.toLocaleString() || '0'}</div>
                      <div className="text-xs text-green-600">+150 this month</div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Coins className="w-5 h-5 text-blue-600" />
                        <span className="text-xs text-gray-600 font-medium">SKILL TOKENS</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{userData?.totalStaked?.toLocaleString() || '0'}</div>
                      <div className="text-xs text-gray-600">≈ ${((userData?.totalStaked || 0) * 0.52).toLocaleString()}</div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-purple-600" />
                        <span className="text-xs text-gray-600 font-medium">ENDORSEMENTS</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{userData?.endorsementCount || '0'}</div>
                      <div className="text-xs text-green-600">+5 this week</div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="w-5 h-5 text-green-600" />
                        <span className="text-xs text-gray-600 font-medium">ACTIVE JOBS</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{activeJobs.filter(j => j.status === 'ongoing').length}</div>
                      <div className="text-xs text-gray-600">{activeJobs.length} total</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Jobs Summary */}
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    Recent Jobs
                  </h3>
                  <div className="space-y-3">
                    {activeJobs.slice(0, 3).map((job, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 text-sm">{job.title}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-600">{job.progress}% complete</span>
                          <span className="text-xs font-medium text-green-700">${job.budget.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setActiveTab('jobs')}
                    className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All Jobs →
                  </button>
                </CardContent>
              </Card>

              {/* Financial Summary */}
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-green-600" />
                    Financial Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Earned</span>
                      <span className="font-bold text-green-700">${blockchainBalance.vusd.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">SKILL Balance</span>
                      <span className="font-bold text-blue-700">{blockchainBalance.skill.toLocaleString()}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('financial')}
                    className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Financial Details →
                  </button>
                </CardContent>
              </Card>

              {/* Activity Summary */}
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-purple-600" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {notifications.slice(0, 3).map((notif) => (
                      <div key={notif.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-900 text-sm">{notif.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{notif.message.slice(0, 50)}...</p>
                        <span className="text-xs text-gray-500">{notif.timestamp}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setActiveTab('activity')}
                    className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All Activity →
                  </button>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* 3. Active Jobs Section */}
            <Card className="bg-white border-gray-200" id="jobs-section">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                    Active Jobs
                  </h3>
                </div>

                <div className="space-y-4">
                  {activeJobs.map((job) => (
                    <div key={job.id} className="bg-gray-100 rounded-xl p-5 border border-gray-200/40 hover:border-gray-200/60 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{job.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                              {job.status.toUpperCase()}
                            </span>
                            {job.priority === 'high' && (
                              <div className="flex items-center gap-1 text-red-400">
                                <Zap className="w-3 h-3" />
                                <span className="text-xs">HIGH PRIORITY</span>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-700 text-sm mb-3">{job.client}</p>
                          
                          {/* Skills */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {job.skills.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium border border-blue-200">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-700">${job.budget.toLocaleString()}</div>
                          <div className="text-xs text-gray-600">Total Budget</div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className="text-gray-900 font-medium">{job.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Payment Info & Timeline */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Paid</div>
                          <div className="font-semibold text-green-700">${job.paid.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Remaining</div>
                          <div className="font-semibold text-orange-700">${job.remaining.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Deadline</div>
                          <div className="font-semibold text-gray-900">{new Date(job.deadline).toLocaleDateString()}</div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all">
                          View Details
                        </button>
                        <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all">
                          <MessageSquare className="w-4 h-4" />
                          Message
                        </button>
                        <button className="text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-all">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 4. Skill Management */}
            <Card className="bg-white border-gray-200" id="skills-section">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Award className="w-6 h-6 text-purple-600" />
                    Skill Management
                  </h3>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Skill
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userSkills.map((skill) => (
                    <div key={skill.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{skill.name}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(skill.level)}`}>
                          {skill.level}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                        <div>
                          <div className="text-gray-600">Endorsements</div>
                          <div className="font-bold text-blue-700">{skill.endorsements}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Reputation</div>
                          <div className="font-bold text-orange-700">+{skill.reputationContribution}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Staked</div>
                          <div className="font-bold text-green-700">{skill.staked}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Last endorsed {skill.lastEndorsement}</span>
                        <button className="text-blue-700 hover:text-blue-800 text-xs font-medium">
                          Manage
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 5. Reputation History Timeline */}
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    Reputation History
                  </h3>
                  <div className="flex items-center gap-2">
                    <select className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-600">
                      <option>Last 6 months</option>
                      <option>Last year</option>
                      <option>All time</option>
                    </select>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="mb-6">
                  <div className="flex items-end justify-between h-40 gap-2">
                    {reputationHistory.map((month, index) => (
                      <div key={month.month} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-lg relative group cursor-pointer transition-all hover:opacity-80"
                          style={{ 
                            height: `${(month.score / 5000) * 100}%`,
                            minHeight: '20px'
                          }}
                        >
                          {/* Tooltip */}
                          <div className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10 border border-gray-600 shadow-lg">
                            <div className="font-semibold">{month.score} REP</div>
                            <div className="text-gray-300">{month.endorsements} endorsements</div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mt-2">{month.month}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Events */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Events</h4>
                  <div className="space-y-2">
                    {reputationHistory.slice(-3).reverse().map((month, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                        <div>
                          <div className="text-sm text-gray-900 font-medium">{month.month} 2024</div>
                          <div className="text-xs text-gray-600">
                            {month.events.join(' • ')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            {/* Skill Management */}
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Award className="w-6 h-6 text-purple-600" />
                    Skill Management
                  </h3>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Skill
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userSkills.map((skill) => (
                    <div key={skill.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{skill.name}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(skill.level)}`}>
                          {skill.level}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                        <div>
                          <div className="text-gray-600">Endorsements</div>
                          <div className="font-bold text-blue-700">{skill.endorsements}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Reputation</div>
                          <div className="font-bold text-orange-700">+{skill.reputationContribution}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Staked</div>
                          <div className="font-bold text-green-700">{skill.staked}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Last endorsed {skill.lastEndorsement}</span>
                        <button className="text-blue-700 hover:text-blue-800 text-xs font-medium">
                          Manage
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reputation History Timeline */}
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    Reputation History
                  </h3>
                  <div className="flex items-center gap-2">
                    <select className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-600">
                      <option>Last 6 months</option>
                      <option>Last year</option>
                      <option>All time</option>
                    </select>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="mb-6">
                  <div className="flex items-end justify-between h-40 gap-2">
                    {reputationHistory.map((month, index) => (
                      <div key={month.month} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-lg relative group cursor-pointer transition-all hover:opacity-80"
                          style={{ 
                            height: `${(month.score / 5000) * 100}%`,
                            minHeight: '20px'
                          }}
                        >
                          {/* Tooltip */}
                          <div className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10 border border-gray-600 shadow-lg">
                            <div className="font-semibold">{month.score} REP</div>
                            <div className="text-gray-300">{month.endorsements} endorsements</div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mt-2">{month.month}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Events */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Events</h4>
                  <div className="space-y-2">
                    {reputationHistory.slice(-3).reverse().map((month, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                        <div>
                          <div className="text-sm text-gray-900 font-medium">{month.month} 2024</div>
                          <div className="text-xs text-gray-600">
                            {month.events.join(' • ')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Financial Tab */}
        {activeTab === 'financial' && (
          <div className="space-y-6">
            {/* Escrow / Payment Panel */}
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Wallet className="w-6 h-6 text-green-600" />
                    Financial Overview
                  </h3>
                </div>

                {/* Balance Cards */}
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-green-400/20 shadow-lg">
                    <div className="text-green-400 text-sm mb-2 font-medium">VUSD Balance</div>
                    <div className="text-3xl font-bold text-gray-900">${blockchainBalance.vusd.toLocaleString()}</div>
                    <div className="text-gray-600 text-sm">≈ ${((blockchainBalance.vusd || 0) * 0.52).toLocaleString()}</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-blue-400/20 shadow-lg">
                    <div className="text-blue-400 text-sm mb-2 font-medium">SKILL Balance</div>
                    <div className="text-3xl font-bold text-gray-900">${blockchainBalance.skill.toLocaleString()}</div>
                    <div className="text-gray-600 text-sm">≈ ${((blockchainBalance.skill || 0) * 0.52).toLocaleString()}</div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-orange-400/20 shadow-lg">
                    <div className="text-orange-400 text-sm mb-2 font-medium">SKILL to VUSD Conversion Rate</div>
                    <div className="text-3xl font-bold text-gray-900">1 SKILL = 0.5 VUSD</div>
                    <div className="text-gray-600 text-sm">≈ ${(0.52).toLocaleString()}</div>
                  </div>
                </div>

                {/* Token Converter */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="text-2xl font-bold text-gray-900">Token Converter</h4>
                    <button
                      className="p-3 bg-gray-100/50 hover:bg-gray-200/50 rounded-xl transition-all hover:scale-105 backdrop-blur-sm"
                    >
                      <RefreshCw className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Rate Display */}
                  <div className="flex gap-4 justify-center mb-8">
                    <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-400/20 rounded-2xl px-6 py-3">
                      <span className="text-blue-600 font-semibold">1 SKILL = 0.5 VUSD</span>
                    </div>
                    <div className="bg-green-500/10 backdrop-blur-sm border border-green-400/20 rounded-2xl px-6 py-3">
                      <span className="text-green-600 font-semibold">1 VUSD = 2 SKILL</span>
                    </div>
                  </div>

                  {/* From Token */}
                  <div className="space-y-4">
                    <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-gray-600 font-medium text-sm">From</label>
                        <div className="text-xs text-gray-500">
                          Balance: {blockchainBalance.skill.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          className="flex-1 bg-transparent text-xl font-bold outline-none placeholder-gray-400 text-gray-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-gray-200/50 shadow-sm">
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-purple-500`}></div>
                          <span className="font-semibold text-gray-900 text-sm">
                            SKILL
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* To Token */}
                    <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-gray-600 font-medium text-sm">To</label>
                        <div className="text-xs text-gray-500">
                          Balance: ${blockchainBalance.vusd.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 text-xl font-bold text-gray-900">
                          {((blockchainBalance.skill || 0) * 0.52).toFixed(2)}
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-gray-200/50 shadow-sm">
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500`}></div>
                          <span className="font-semibold text-gray-900 text-sm">
                            VUSD
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Convert Button */}
                    <button
                      className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-4 rounded-2xl font-bold text-lg text-white transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25"
                    >
                      Convert
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            {/* 9. Notifications & Alerts */}
            <Card className="bg-white border-gray-200" id="activity-section">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Bell className="w-6 h-6 text-blue-500" />
                    Recent Activity
                  </h3>
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {notifications.slice(0, 6).map((notif) => (
                    <div key={notif.id} className={`p-4 rounded-xl border transition-all hover:bg-gray-100 ${
                      !notif.isRead 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 border border-blue-200">
                          <Bell className="w-4 h-4 text-blue-700" />
                        </div>
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${!notif.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notif.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">{notif.timestamp}</span>
                            {!notif.isRead && (
                              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">New</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Activity Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Activity Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xl font-bold text-gray-900">12</div>
                      <div className="text-xs text-gray-600 mt-1">New Jobs</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xl font-bold text-gray-900">5</div>
                      <div className="text-xs text-gray-600 mt-1">Endorsements</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xl font-bold text-gray-900">3</div>
                      <div className="text-xs text-gray-600 mt-1">Messages</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xl font-bold text-gray-900">1</div>
                      <div className="text-xs text-gray-600 mt-1">Milestone</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 10. Quick Actions Panel */}
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-blue-500" />
                  Quick Actions
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 px-4 rounded-xl text-white font-medium transition-all flex items-center gap-3">
                    <Plus className="w-5 h-5" />
                    Post New Job
                  </button>

                  <button 
                    onClick={() => setActiveTab('jobs')}
                    className="w-full bg-gray-100 hover:bg-gray-200 py-3 px-4 rounded-xl text-gray-900 font-medium transition-all flex items-center gap-3"
                  >
                    <Eye className="w-5 h-5" />
                    Browse Jobs
                  </button>

                  <button className="w-full bg-gray-100 hover:bg-gray-200 py-3 px-4 rounded-xl text-gray-900 font-medium transition-all flex items-center gap-3">
                    <Award className="w-5 h-5" />
                    Add New Skill
                  </button>

                  <Link 
                    href="/explorer?tab=governance"
                    className="w-full bg-gray-100 hover:bg-gray-200 py-3 px-4 rounded-xl text-gray-900 font-medium transition-all flex items-center gap-3"
                  >
                    <Vote className="w-5 h-5" />
                    DAO Governance
                  </Link>
                </div>

                {/* Platform Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Platform Activity</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Jobs</span>
                      <span className="text-gray-900 font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Online Users</span>
                      <span className="text-green-700 font-medium">5,891</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recent Endorsements</span>
                      <span className="text-purple-700 font-medium">342</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* 9. Dashboard Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-gray-900 font-semibold mb-3">SkillChain Platform</h4>
            <p className="text-gray-600 text-sm mb-3">
              Decentralized freelancing platform powered by blockchain technology and skill-based reputation.
            </p>
            <p className="text-xs text-gray-500">Version 1.2.0</p>
          </div>
          
          <div>
            <h4 className="text-gray-900 font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2">
              <button 
                onClick={() => setActiveTab('jobs')}
                className="block text-left text-gray-600 hover:text-gray-900 text-sm transition-colors"
              >
                Job Management
              </button>
              <Link href="/explorer" className="block text-gray-600 hover:text-gray-900 text-sm transition-colors">
                Platform Explorer
              </Link>
              <button 
                onClick={() => setActiveTab('skills')}
                className="block text-left text-gray-600 hover:text-gray-900 text-sm transition-colors"
              >
                Skill Management
              </button>
              <Link href="/support" className="block text-gray-600 hover:text-gray-900 text-sm transition-colors">
                Help & Support
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-gray-900 font-semibold mb-3">Community</h4>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                <span className="sr-only">Twitter</span>
                <div className="w-6 h-6 bg-gray-100 rounded-full border border-gray-200"></div>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                <span className="sr-only">Discord</span>
                <div className="w-6 h-6 bg-gray-100 rounded-full border border-gray-200"></div>
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                <span className="sr-only">GitHub</span>
                <div className="w-6 h-6 bg-gray-100 rounded-full border border-gray-200"></div>
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              © 2024 SkillChain. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 