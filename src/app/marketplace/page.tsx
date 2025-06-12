'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, MapPin, Clock, DollarSign, Users, Star, ArrowLeft, Tag, Calendar, Briefcase, ChevronDown, Wallet as WalletIcon, Shield, Plus } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { useWallet } from '@/contexts/WalletContext'
import { marketplaceApi } from '@/lib/api'

interface Job {
  id: string
  title: string
  description: string
  skillsRequired: string[]
  budget: number
  budgetType: 'fixed' | 'hourly'
  duration: string
  location: 'remote' | 'onsite' | 'hybrid'
  category: string
  clientName: string
  clientRating: number
  postedAt: string
  proposals: number
  isUrgent?: boolean
}

// Mock data for development
const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Full-Stack Web Application Development',
    description: 'Looking for an experienced full-stack developer to build a modern web application using React, Node.js, and MongoDB. The project involves creating a user dashboard, API integration, and responsive design.',
    skillsRequired: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind CSS'],
    budget: 2500,
    budgetType: 'fixed',
    duration: '2-3 months',
    location: 'remote',
    category: 'Web Development',
    clientName: 'TechCorp Inc.',
    clientRating: 4.8,
    postedAt: '2024-01-15',
    proposals: 12,
    isUrgent: true
  },
  {
    id: '2',
    title: 'Mobile App UI/UX Design',
    description: 'Need a talented UI/UX designer to create beautiful and intuitive mobile app designs. Must have experience with Figma and mobile design principles.',
    skillsRequired: ['Figma', 'UI/UX Design', 'Mobile Design', 'Prototyping'],
    budget: 50,
    budgetType: 'hourly',
    duration: '1 month',
    location: 'remote',
    category: 'Design',
    clientName: 'StartupXYZ',
    clientRating: 4.5,
    postedAt: '2024-01-14',
    proposals: 8
  },
  {
    id: '3',
    title: 'Smart Contract Development for DeFi Platform',
    description: 'Seeking blockchain developer with Solidity expertise to develop smart contracts for our DeFi platform. Must have auditing experience.',
    skillsRequired: ['Solidity', 'Web3', 'Smart Contracts', 'DeFi', 'Security Audit'],
    budget: 5000,
    budgetType: 'fixed',
    duration: '3-4 months',
    location: 'remote',
    category: 'Blockchain',
    clientName: 'DeFi Solutions',
    clientRating: 4.9,
    postedAt: '2024-01-13',
    proposals: 15
  },
  {
    id: '4',
    title: 'Content Marketing Strategy & Copywriting',
    description: 'Looking for a content marketing specialist to develop comprehensive marketing strategy and create engaging content for our B2B software company.',
    skillsRequired: ['Content Marketing', 'Copywriting', 'SEO', 'Social Media', 'Analytics'],
    budget: 35,
    budgetType: 'hourly',
    duration: '6 months',
    location: 'remote',
    category: 'Marketing',
    clientName: 'CloudTech Ltd.',
    clientRating: 4.6,
    postedAt: '2024-01-12',
    proposals: 6
  }
]

const CATEGORIES = ['All', 'Web Development', 'Mobile Development', 'Design', 'Blockchain', 'Marketing', 'Writing', 'Data Science']
const BUDGET_RANGES = ['All', '$0-$500', '$500-$1000', '$1000-$2500', '$2500-$5000', '$5000+']

export default function MarketplacePage() {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS)
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(MOCK_JOBS)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedBudgetRange, setSelectedBudgetRange] = useState('All')
  const [showFilters, setShowFilters] = useState(false)
  const [showJobForm, setShowJobForm] = useState(false)
  const [isLoadingJobs, setIsLoadingJobs] = useState(false)
  const { walletInfo, connectWallet, isConnecting, disconnectWallet } = useWallet()
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  // Job form state
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    budget: '',
    skills: '',
    deadline: ''
  })

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Load jobs from API (when available)
  const loadJobs = async () => {
    try {
      setIsLoadingJobs(true)
      // For now, we'll use mock data since the API might not be ready
      // const jobsData = await marketplaceApi.getJobs()
      // setJobs(jobsData.data || MOCK_JOBS)
      console.log('Using mock job data for now')
    } catch (error) {
      console.error('Failed to load jobs:', error)
      // Fallback to mock data
    } finally {
      setIsLoadingJobs(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!walletInfo) return

    try {
      const skillsArray = jobForm.skills.split(',').map(s => s.trim()).filter(s => s)
      
      const result = await marketplaceApi.createJob({
        creator: walletInfo.address,
        title: jobForm.title,
        description: jobForm.description,
        required_skills: skillsArray,
        budget: jobForm.budget,
        deadline: jobForm.deadline,
        category: 'General', // Default category
        payment_type: 'fixed' // Default payment type
      })

      if (result.message) {
        alert('Job posted successfully!')
        setJobForm({ title: '', description: '', budget: '', skills: '', deadline: '' })
        setShowJobForm(false)
        loadJobs() // Refresh jobs list
      } else {
        throw new Error(result.error || 'Failed to create job')
      }
    } catch (error: any) {
      console.error('Failed to create job:', error)
      alert(`Failed to create job: ${error.message}`)
    }
  }

  useEffect(() => {
    let filtered = jobs

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skillsRequired.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(job => job.category === selectedCategory)
    }

    // Budget filter
    if (selectedBudgetRange !== 'All') {
      const [min, max] = selectedBudgetRange.replace('$', '').replace('+', '-999999').split('-').map(Number)
      filtered = filtered.filter(job => {
        const budget = job.budgetType === 'hourly' ? job.budget * 40 * 4 : job.budget // Estimate monthly for hourly
        return budget >= min && budget <= (max || 999999)
      })
    }

    setFilteredJobs(filtered)
  }, [searchTerm, selectedCategory, selectedBudgetRange, jobs])

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
              SkillChain
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/convert" className="text-gray-300 hover:text-white transition-colors">Convert</Link>
            <Link href="/profile" className="text-gray-300 hover:text-white transition-colors">Profile</Link>
            
            {!walletInfo ? (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 px-6 py-2 rounded-full text-white font-medium transition-all transform hover:scale-105"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-full text-white transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{walletInfo.address.slice(5, 6).toUpperCase()}</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{formatAddress(walletInfo.address)}</div>
                    <div className="text-xs text-gray-300">{walletInfo.skillBalance} SKILL</div>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-white/10">
                      <div className="text-white font-medium">Wallet Connected</div>
                      <div className="text-gray-400 text-sm">{formatAddress(walletInfo.address)}</div>
                      <div className="text-green-400 text-sm mt-1">{walletInfo.skillBalance} SKILL • {walletInfo.vusdBalance} VUSD</div>
                    </div>
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                      <Users className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                      <Shield className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link href="/convert" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                      <ArrowLeft className="w-4 h-4" />
                      Convert Tokens
                    </Link>
                    <div className="border-t border-white/10 mt-2 pt-2">
                      <button
                        onClick={() => {
                          disconnectWallet()
                          setShowProfileDropdown(false)
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full text-left"
                      >
                        <WalletIcon className="w-4 h-4" />
                        Disconnect Wallet
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative container mx-auto px-6 py-12 flex-1">
        {/* Header */}
        <div className="text-center text-white mb-12">
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Marketplace
            </span>
          </h1>
          <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Find amazing projects or post your job to talented freelancers worldwide
          </p>
          
          {walletInfo && (
            <button
              onClick={() => setShowJobForm(!showJobForm)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-4 rounded-2xl font-semibold text-lg transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Post a Job
            </button>
          )}
        </div>

        {/* Job Creation Form */}
        {showJobForm && walletInfo && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Post a New Job</h3>
              <form onSubmit={handleCreateJob} className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2">Job Title</label>
                  <input
                    type="text"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                    placeholder="e.g. React Developer for E-commerce Project"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 h-32 resize-none"
                    placeholder="Describe your project requirements..."
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Budget (SKILL)</label>
                    <input
                      type="number"
                      value={jobForm.budget}
                      onChange={(e) => setJobForm({ ...jobForm, budget: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="5000"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Deadline</label>
                    <input
                      type="date"
                      value={jobForm.deadline}
                      onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Required Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={jobForm.skills}
                    onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                    placeholder="React, Node.js, TypeScript, MongoDB"
                    required
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 py-3 rounded-xl font-semibold transition-all"
                  >
                    Post Job
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowJobForm(false)}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs, skills, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-6 py-3 text-white transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                >
                  {CATEGORIES.map(category => (
                    <option key={category} value={category} className="bg-slate-800">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Budget Range</label>
                <select
                  value={selectedBudgetRange}
                  onChange={(e) => setSelectedBudgetRange(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                >
                  {BUDGET_RANGES.map(range => (
                    <option key={range} value={range} className="bg-slate-800">
                      {range}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-400">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </p>
          <Link
            href="/marketplace/post-job"
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-6 py-3 rounded-xl text-white font-semibold transition-all transform hover:scale-105"
          >
            Post a Job
          </Link>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No jobs found</h3>
            <p className="text-gray-400">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

function JobCard({ job }: { job: Job }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02] group">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold group-hover:text-blue-400 transition-colors">
                  {job.title}
                </h3>
                {job.isUrgent && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    URGENT
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {job.clientName}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  {job.clientRating}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(job.postedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 mb-4 leading-relaxed">
            {job.description.length > 200 ? `${job.description.substring(0, 200)}...` : job.description}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {job.skillsRequired.map(skill => (
              <span
                key={skill}
                className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {job.duration}
            </span>
            <span className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              {job.category}
            </span>
            <span className="text-purple-400">
              {job.proposals} proposals
            </span>
          </div>
        </div>

        {/* Right Side */}
        <div className="lg:text-right">
          <div className="mb-4">
            <div className="text-3xl font-bold text-green-400 mb-1">
              ${job.budget}{job.budgetType === 'hourly' ? '/hr' : ''}
            </div>
            <div className="text-sm text-gray-400">
              {job.budgetType === 'fixed' ? 'Fixed Price' : 'Hourly Rate'}
            </div>
          </div>
          <Link
            href={`/marketplace/job/${job.id}`}
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
} 