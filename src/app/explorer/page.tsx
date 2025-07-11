'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Users, 
  Award, 
  DollarSign, 
  Activity,
  Moon,
  Sun,
  Vote,
  Briefcase,
  CheckCircle,
  Coins,
  LogOut,
  User,
  ChevronDown,
  Eye,
  EyeOff
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import Link from 'next/link'

export default function ExplorerPage() {
  // Authentication state - start with false (not authenticated)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  
  // Login Modal state
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showLogin, setShowLogin] = useState(true)
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

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showLoginModal) {
        setShowLoginModal(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [showLoginModal])

  // Check authentication status on page load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log('🔍 Explorer: Starting auth check...')
        
        // First check if we have stored auth data
        const storedUserData = localStorage.getItem('skillchain_user')
        const storedAuth = localStorage.getItem('skillchain_authenticated')
        
        if (storedUserData && storedAuth === 'true') {
          console.log('📱 Explorer: Found stored auth data')
          setUserData(JSON.parse(storedUserData))
          setIsAuthenticated(true)
          return
        }
        
        const response = await fetch('/api/auth/me')
        console.log('📡 Explorer: Auth response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ Explorer: Auth response data:', data)
          
          if (data.success && data.user) {
            console.log('👤 Explorer: Setting user data:', data.user)
            setUserData(data.user)
            setIsAuthenticated(true)
            
            // Store in localStorage for persistence
            localStorage.setItem('skillchain_user', JSON.stringify(data.user))
            localStorage.setItem('skillchain_authenticated', 'true')
          } else {
            // Clear stored data if API says not authenticated
            localStorage.removeItem('skillchain_user')
            localStorage.removeItem('skillchain_authenticated')
          }
        } else {
          console.log('❌ Explorer: Auth check failed')
          // Clear stored data if API call failed
          localStorage.removeItem('skillchain_user')
          localStorage.removeItem('skillchain_authenticated')
        }
      } catch (error) {
        console.error('💥 Explorer: Auth check failed:', error)
        // Clear stored data on error
        localStorage.removeItem('skillchain_user')
        localStorage.removeItem('skillchain_authenticated')
      }
    }

    checkAuthStatus()
  }, [])

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

  // Platform Overview Stats
  const platformStats = [
    { 
      label: 'Active Jobs', 
      value: '1,247', 
      change: '+23%', 
      icon: Briefcase,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    { 
      label: 'Completed Projects', 
      value: '8,932', 
      change: '+15%', 
      icon: CheckCircle,
      color: 'text-green-400',
      bg: 'bg-green-500/10'
    },
    { 
      label: 'Active Professionals', 
      value: '15,420', 
      change: '+8%', 
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    { 
      label: 'Total Paid', 
      value: '$2.4M', 
      change: '+32%', 
      icon: DollarSign,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10'
    },
    { 
      label: 'Skill Endorsements', 
      value: '45,680', 
      change: '+19%', 
      icon: Award,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10'
    }
  ]

  // Latest Job Posts
  const latestJobs = [
    {
      id: 'JOB-001',
      title: 'Senior React Developer for DeFi Platform',
      company: 'CryptoVentures Inc.',
      location: 'Remote',
      budget: '$8,000 - $12,000',
      duration: '3 months',
      skills: ['React', 'TypeScript', 'Web3', 'DeFi'],
      posted: '2 hours ago',
      applicants: 23,
      employer: 'crypto1abc...def9',
      status: 'active',
      featured: true
    },
    {
      id: 'JOB-002', 
      title: 'Blockchain Security Audit',
      company: 'SecureChain Labs',
      location: 'Hybrid',
      budget: '$15,000 - $20,000',
      duration: '6 weeks',
      skills: ['Solidity', 'Security', 'Smart Contracts'],
      posted: '4 hours ago',
      applicants: 8,
      employer: 'secure1ghi...jkl2',
      status: 'active',
      featured: false
    },
    {
      id: 'JOB-003',
      title: 'UI/UX Designer for NFT Marketplace',
      company: 'ArtTech Studios',
      location: 'Remote',
      budget: '$5,000 - $8,000',
      duration: '2 months',
      skills: ['Figma', 'UI/UX', 'NFT', 'Web3'],
      posted: '6 hours ago',
      applicants: 31,
      employer: 'art1mno...pqr5',
      status: 'active',
      featured: false
    }
  ]

  // Completed Projects Showcase
  const completedProjects = [
    {
      id: 'PROJ-128',
      title: 'DeFi Trading Bot Development',
      client: 'TradeMax Pro',
      freelancer: 'Alex Chen',
      freelancerAddress: 'skill1dev...xyz1',
      completedDate: '2024-01-15',
      budget: '$12,500',
      rating: 4.9,
      duration: '8 weeks',
      skills: ['Python', 'DeFi', 'Trading Algorithms'],
      testimonial: 'Exceptional work! The bot exceeded our expectations.',
      category: 'Development'
    },
    {
      id: 'PROJ-127',
      title: 'Smart Contract Security Audit',
      client: 'DeFiPro Protocol',
      freelancer: 'Maria Rodriguez',
      freelancerAddress: 'skill1sec...abc2',
      completedDate: '2024-01-12',
      budget: '$18,000',
      rating: 5.0,
      duration: '4 weeks',
      skills: ['Solidity', 'Security', 'Audit'],
      testimonial: 'Thorough audit with excellent documentation.',
      category: 'Security'
    },
    {
      id: 'PROJ-126',
      title: 'NFT Marketplace UI Design',
      client: 'CryptoArt Hub',
      freelancer: 'David Kim',
      freelancerAddress: 'skill1des...def3',
      completedDate: '2024-01-10',
      budget: '$7,500',
      rating: 4.8,
      duration: '6 weeks',
      skills: ['Figma', 'UI/UX', 'NFT Design'],
      testimonial: 'Beautiful design that perfectly captured our vision.',
      category: 'Design'
    }
  ]

  // DAO Proposals with detailed voting
  const daoProposals = [
    {
      id: 'PROP-15',
      title: 'Increase Platform Commission for Governance Fund',
      description: 'Proposal to increase platform commission from 2.5% to 3% to fund ecosystem development and security audits.',
      category: 'Economic',
      status: 'Active',
      proposer: 'skill1gov...abc1',
      proposerName: 'SkillChain Foundation',
      createdDate: '2024-01-20',
      endDate: '2024-02-03',
      votesFor: 34580,
      votesAgainst: 12340,
      totalVotes: 46920,
      quorumRequired: 50000,
      timeLeft: '13 days'
    },
    {
      id: 'PROP-14',
      title: 'Add Python Skill Category',
      description: 'Proposal to add Python as a new skill category with dedicated endorsement system.',
      category: 'Platform',
      status: 'Passed',
      proposer: 'skill1dev...xyz2',
      proposerName: 'Developer Community',
      createdDate: '2024-01-15',
      endDate: '2024-01-29',
      votesFor: 42100,
      votesAgainst: 8900,
      totalVotes: 51000,
      quorumRequired: 40000,
      timeLeft: 'Ended'
    }
  ]

  // Skill Endorsement Activity
  const endorsementActivity = [
    {
      id: 'END-001',
      endorser: 'Maria Rodriguez',
      endorserAddress: 'skill1end...abc1',
      recipient: 'Alex Chen',
      recipientAddress: 'skill1dev...xyz1',
      skill: 'React.js',
      timestamp: '2 hours ago',
      reputation: 420,
      stake: 2500
    },
    {
      id: 'END-002',
      endorser: 'David Kim',
      endorserAddress: 'skill1des...def2',
      recipient: 'Sarah Wilson',
      recipientAddress: 'skill1ux...ghi3',
      skill: 'UI/UX Design',
      timestamp: '4 hours ago',
      reputation: 380,
      stake: 1800
    },
    {
      id: 'END-003',
      endorser: 'Michael Brown',
      endorserAddress: 'skill1sec...jkl4',
      recipient: 'Lisa Zhang',
      recipientAddress: 'skill1audit...mno5',
      skill: 'Smart Contract Audit',
      timestamp: '6 hours ago',
      reputation: 520,
      stake: 3200
    }
  ]

  const handleLogout = () => {
    fetch('/api/auth/logout', { method: 'POST' })
      .then(() => {
        setIsAuthenticated(false)
        setUserData(null)
        setShowProfileDropdown(false)
        setShowLoginModal(false)
        
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
        setShowLoginModal(false)
        
        // Clear localStorage
        localStorage.removeItem('skillchain_user')
        localStorage.removeItem('skillchain_authenticated')
      })
  }

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
        setShowLoginModal(false)
        setLoginData({ email: '', password: '' })
        
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
        setShowLoginModal(false)
        setRegisterData({ name: '', email: '', password: '', confirmPassword: '', userType: 'freelancer' })
        
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

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return isDarkMode ? 'text-green-400' : 'text-green-600'
      case 'completed': return isDarkMode ? 'text-blue-400' : 'text-blue-600'
      case 'passed': return isDarkMode ? 'text-purple-400' : 'text-purple-600'
      case 'failed': return isDarkMode ? 'text-red-400' : 'text-red-600'
      default: return isDarkMode ? 'text-slate-400' : 'text-gray-600'
    }
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
        isDarkMode 
          ? 'bg-slate-900/80 border-slate-700/50' 
          : 'bg-white/80 border-gray-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                }`}>
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <div>
                  <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    SkillChain Explorer
                  </h1>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    Platform Activity Dashboard
                  </p>
                </div>
              </Link>
            </div>

            {/* Search & Controls */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  placeholder="Search jobs, projects, users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-80 pl-10 pr-4 py-3 rounded-xl border font-medium text-sm transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-500 focus:bg-slate-800' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                />
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-700/50 hover:bg-slate-600/50 text-yellow-400' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {/* User Profile or Login Links */}
              {isAuthenticated ? (
                <div className="relative">
                  <div 
                    className={`px-4 py-2 rounded-xl border font-medium text-sm cursor-pointer transition-all duration-200 flex items-center gap-2 ${
                      isDarkMode 
                        ? 'bg-slate-800/50 border-slate-600/50 text-green-400 hover:bg-slate-700/70 hover:border-green-500/30' 
                        : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300'
                    }`}
                    onMouseEnter={() => setShowProfileDropdown(true)}
                    onMouseLeave={() => setShowProfileDropdown(false)}
                  >
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">{userData?.avatar}</span>
                    </div>
                    {userData?.name}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      showProfileDropdown ? 'rotate-180' : ''
                    }`} />
                  </div>

                  {/* Profile Dropdown */}
                  <div 
                    className={`absolute right-0 top-full mt-2 w-72 rounded-xl border shadow-xl transition-all duration-200 z-50 ${
                      isDarkMode 
                        ? 'bg-slate-800 border-slate-600/50 shadow-black/20' 
                        : 'bg-white border-gray-200 shadow-gray-500/20'
                    } ${showProfileDropdown ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                    onMouseEnter={() => setShowProfileDropdown(true)}
                    onMouseLeave={() => setShowProfileDropdown(false)}
                  >
                    {/* Profile Header */}
                    <div className={`p-3 border-b ${
                      isDarkMode ? 'border-slate-600/50' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{userData?.avatar}</span>
                        </div>
                        <div>
                          <div className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {userData?.name}
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                            {userData?.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Token Balances */}
                    <div className={`p-3 border-b ${
                      isDarkMode ? 'border-slate-600/50' : 'border-gray-200'
                    }`}>
                      <h4 className={`text-xs font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Balances
                      </h4>
                      
                      <div className="space-y-2">
                        {/* SKILL Balance */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <Coins className="w-3 h-3 text-white" />
                            </div>
                            <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              SKILL
                            </span>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                              {blockchainBalance.skill.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {/* VUSD Balance */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                              <DollarSign className="w-3 h-3 text-white" />
                            </div>
                            <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              VUSD
                            </span>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                              {blockchainBalance.vusd.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="p-2">
                      <Link 
                        href="/dashboard" 
                        className={`flex items-center gap-2 w-full p-2 rounded-lg transition-all duration-200 text-sm ${
                          isDarkMode 
                            ? 'hover:bg-slate-700/50 text-slate-300 hover:text-white' 
                            : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        <Activity className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      

                      <hr className={`my-1 ${isDarkMode ? 'border-slate-600/50' : 'border-gray-200'}`} />
                      
                      <button 
                        className={`flex items-center gap-2 w-full p-2 rounded-lg transition-all duration-200 text-sm ${
                          isDarkMode 
                            ? 'hover:bg-red-500/20 text-red-400 hover:text-red-300' 
                            : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                        }`}
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      setShowLogin(true)
                      setShowLoginModal(true)
                    }}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                      isDarkMode 
                        ? 'border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-slate-500' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400'
                    }`}
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => {
                      setShowLogin(false)
                      setShowLoginModal(true)
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={`border-t ${isDarkMode ? 'border-slate-700/50' : 'border-gray-200/50'}`}>
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex items-center gap-1 overflow-x-auto py-3">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'jobs', label: 'Jobs', icon: Briefcase },
                { id: 'projects', label: 'Projects', icon: CheckCircle },
                { id: 'governance', label: 'Governance', icon: Vote },
                { id: 'endorsements', label: 'Endorsements', icon: Award }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? isDarkMode 
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                          : 'bg-blue-50 text-blue-600 border border-blue-200'
                        : isDarkMode 
                          ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {platformStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index} className={`transition-all duration-300 border ${
                    isDarkMode 
                      ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70' 
                      : 'bg-white/80 border-gray-200/50 hover:bg-white/90'
                  } backdrop-blur-sm hover:shadow-lg`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                          <Icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div className={`text-xs font-medium ${
                          stat.change.startsWith('+') 
                            ? isDarkMode ? 'text-green-400' : 'text-green-600'
                            : isDarkMode ? 'text-red-400' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </div>
                      </div>
                      <div className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {stat.value}
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Latest Activity Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Jobs */}
              <Card className={`transition-all duration-300 border ${
                isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700/50' 
                  : 'bg-white/80 border-gray-200/50'
              } backdrop-blur-sm`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Latest Jobs
                    </h3>
                    <button 
                      onClick={() => setActiveTab('jobs')}
                      className={`text-sm font-medium transition-colors ${
                        isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                      }`}
                    >
                      View All →
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {latestJobs.slice(0, 3).map((job) => (
                      <div key={job.id} className={`p-4 rounded-lg border transition-all ${
                        isDarkMode 
                          ? 'bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`font-semibold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {job.title}
                            </h4>
                            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                              {job.company} - {job.location}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                              {job.budget}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Completed Projects */}
              <Card className={`transition-all duration-300 border ${
                isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700/50' 
                  : 'bg-white/80 border-gray-200/50'
              } backdrop-blur-sm`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Completed Projects
                    </h3>
                    <button 
                      onClick={() => setActiveTab('projects')}
                      className={`text-sm font-medium transition-colors ${
                        isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                      }`}
                    >
                      View All →
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {completedProjects.slice(0, 3).map((project) => (
                      <div key={project.id} className={`p-4 rounded-lg border transition-all ${
                        isDarkMode 
                          ? 'bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`font-semibold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {project.title}
                            </h4>
                            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                              {project.client}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                              {project.budget}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-8">
            {/* Job Posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestJobs.map((job) => (
                <Card key={job.id} className={`transition-all duration-300 border ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700/50' 
                    : 'bg-white/80 border-gray-200/50'
                } backdrop-blur-sm`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {job.title}
                        </h4>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          {job.company} - {job.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          {job.budget}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-8">
            {/* Completed Projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedProjects.map((project) => (
                <Card key={project.id} className={`transition-all duration-300 border ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700/50' 
                    : 'bg-white/80 border-gray-200/50'
                } backdrop-blur-sm`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {project.title}
                        </h4>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          {project.client}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          {project.budget}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'governance' && (
          <div className="space-y-8">
            {/* DAO Proposals */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {daoProposals.map((proposal) => (
                <Card key={proposal.id} className={`transition-all duration-300 border ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700/50' 
                    : 'bg-white/80 border-gray-200/50'
                } backdrop-blur-sm`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {proposal.title}
                        </h4>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          {proposal.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          {proposal.status}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'endorsements' && (
          <div className="space-y-8">
            {/* Endorsement Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {endorsementActivity.map((activity) => (
                <Card key={activity.id} className={`transition-all duration-300 border ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700/50' 
                    : 'bg-white/80 border-gray-200/50'
                } backdrop-blur-sm`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {activity.endorser} endorsed {activity.recipient}
                        </h4>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          {activity.skill}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Login/Register Modal */}
      {showLoginModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowLoginModal(false)
            }
          }}
        >
          <div className={`w-full max-w-md rounded-2xl shadow-2xl transition-all ${
            isDarkMode 
              ? 'bg-slate-800 border border-slate-700' 
              : 'bg-white border border-gray-200'
          }`}>
            {/* Modal Header */}
            <div className={`p-6 border-b ${
              isDarkMode ? 'border-slate-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {showLogin ? 'Welcome Back' : 'Join SkillChain'}
                  </h2>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    {showLogin ? 'Sign in to your account' : 'Create your account'}
                  </p>
                </div>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'hover:bg-slate-700 text-slate-400 hover:text-white' 
                      : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                  }`}
                >
                  ✕
                </button>
              </div>

              {/* Toggle Buttons */}
              <div className={`flex rounded-lg p-1 mt-4 ${
                isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
              }`}>
                <button
                  onClick={() => setShowLogin(true)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    showLogin 
                      ? isDarkMode 
                        ? 'bg-slate-600 text-blue-400 shadow-sm' 
                        : 'bg-white text-blue-600 shadow-sm'
                      : isDarkMode 
                        ? 'text-slate-400 hover:text-slate-200' 
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setShowLogin(false)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    !showLogin 
                      ? isDarkMode 
                        ? 'bg-slate-600 text-blue-400 shadow-sm' 
                        : 'bg-white text-blue-600 shadow-sm'
                      : isDarkMode 
                        ? 'text-slate-400 hover:text-slate-200' 
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Login Form */}
              {showLogin ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-slate-200' : 'text-gray-700'
                    }`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDarkMode 
                          ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="alex@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-slate-200' : 'text-gray-700'
                    }`}>
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDarkMode 
                            ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                          isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className={`rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600' : ''
                        }`} 
                      />
                      <span className={`ml-2 text-sm ${
                        isDarkMode ? 'text-slate-300' : 'text-gray-600'
                      }`}>
                        Remember me
                      </span>
                    </label>
                    <a href="#" className={`text-sm transition-colors ${
                      isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}>
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                    }`}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>
              ) : (
                /* Register Form */
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-slate-200' : 'text-gray-700'
                    }`}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDarkMode 
                          ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Alex Chen"
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-slate-200' : 'text-gray-700'
                    }`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDarkMode 
                          ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="alex@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-slate-200' : 'text-gray-700'
                    }`}>
                      User Type
                    </label>
                    <select
                      value={registerData.userType}
                      onChange={(e) => setRegisterData({ ...registerData, userType: e.target.value })}
                      className={`w-full py-3 px-4 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDarkMode 
                          ? 'bg-slate-700 border-slate-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="freelancer">Freelancer</option>
                      <option value="client">Client</option>
                      <option value="both">Both</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-slate-200' : 'text-gray-700'
                    }`}>
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDarkMode 
                            ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                          isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-slate-200' : 'text-gray-700'
                    }`}>
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDarkMode 
                          ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className={`rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                        isDarkMode ? 'bg-slate-700 border-slate-600' : ''
                      }`} 
                      required 
                    />
                    <span className={`ml-2 text-sm ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-600'
                    }`}>
                      I agree to the{' '}
                      <a href="#" className={`transition-colors ${
                        isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                      }`}>
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className={`transition-colors ${
                        isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                      }`}>
                        Privacy Policy
                      </a>
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                    }`}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}