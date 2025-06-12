'use client'

import { useState } from 'react'
import { ArrowLeft, Plus, X, DollarSign, Clock, MapPin, Tag, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { skillChainClient } from '@/lib/blockchain'
import { OfflineSigner } from '@cosmjs/proto-signing'

interface FormData {
  title: string
  description: string
  category: string
  skillsRequired: string[]
  budget: string
  budgetType: 'fixed' | 'hourly'
  duration: string
  location: 'remote' | 'onsite' | 'hybrid'
  isUrgent: boolean
}

const CATEGORIES = ['Web Development', 'Mobile Development', 'Design', 'Blockchain', 'Marketing', 'Writing', 'Data Science']
const DURATION_OPTIONS = ['Less than 1 month', '1-3 months', '3-6 months', '6+ months']
const LOCATION_OPTIONS = [
  { value: 'remote', label: 'Remote' },
  { value: 'onsite', label: 'On-site' },
  { value: 'hybrid', label: 'Hybrid' }
]

export default function PostJobPage() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    skillsRequired: [],
    budget: '',
    budgetType: 'fixed',
    duration: '',
    location: 'remote',
    isUrgent: false
  })

  const [newSkill, setNewSkill] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [wallet, setWallet] = useState<{connected: boolean, address: string, signer: OfflineSigner | null}>({
    connected: false,
    address: '',
    signer: null
  })

  const connectWallet = async () => {
    try {
      const { address, signer } = await skillChainClient.connectWallet()
      setWallet({ connected: true, address, signer })
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      alert('Please install and setup Keplr wallet first.')
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skillsRequired.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(skill => skill !== skillToRemove)
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (formData.skillsRequired.length === 0) newErrors.skillsRequired = []
    if (!formData.budget.trim()) newErrors.budget = 'Budget is required'
    if (!formData.duration) newErrors.duration = 'Duration is required'

    const budget = parseFloat(formData.budget)
    if (isNaN(budget) || budget <= 0) {
      newErrors.budget = 'Please enter a valid budget amount'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    if (!wallet.connected) {
      alert('Please connect your wallet first.')
      return
    }

    setIsSubmitting(true)

    try {
      // Check if user has enough VUSD
      const budget = parseFloat(formData.budget)
      const budgetInMicroVUSD = formData.budgetType === 'fixed' 
        ? budget * 1000000 
        : budget * 40 * 4 * 1000000 // Estimate monthly for hourly jobs

      const vusdBalance = await skillChainClient.getBalance(wallet.address, 'uvusd')
      if (parseInt(vusdBalance.amount) < budgetInMicroVUSD) {
        alert(`Insufficient VUSD balance. You need ${budget} VUSD but have ${parseInt(vusdBalance.amount) / 1000000} VUSD. Please convert SKILL to VUSD first.`)
        return
      }

      // Create job posting on blockchain
      const jobData = {
        index: Date.now().toString(), // Simple index for now
        clientAddress: wallet.address,
        title: formData.title,
        description: formData.description,
        skillsRequired: formData.skillsRequired.join(','),
        budgetAmount: budgetInMicroVUSD.toString(),
        paymentCurrency: 'VUSD',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        isActive: 'true',
        createdAt: new Date().toISOString()
      }

      const result = await skillChainClient.createJobPosting(
        wallet.signer!,
        wallet.address,
        jobData
      )

      console.log('Job posted successfully:', result)
      alert('Job posted successfully!')
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        skillsRequired: [],
        budget: '',
        budgetType: 'fixed',
        duration: '',
        location: 'remote',
        isUrgent: false
      })

    } catch (error) {
      console.error('Failed to post job:', error)
      alert('Failed to post job. Please try again.')
    } finally {
      setIsSubmitting(false)
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
          <Link href="/marketplace" className="flex items-center gap-3 text-white hover:text-gray-300 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <div className="text-2xl font-bold flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              Back to Marketplace
            </div>
          </Link>
          {!wallet.connected && (
            <button
              onClick={connectWallet}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-2 rounded-full text-white font-medium transition-all transform hover:scale-105"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 relative z-10 container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center text-white mb-12">
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Post a Job
              </span>
            </h1>
            <p className="text-xl text-gray-300">
              Find the perfect freelancer for your project
            </p>
          </div>

          {/* Wallet Status */}
          {wallet.connected && (
            <div className="bg-green-500/20 border border-green-400/30 rounded-2xl p-4 mb-8">
              <div className="flex items-center gap-3 text-green-400">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="font-semibold">Wallet Connected: {wallet.address.substring(0, 10)}...{wallet.address.substring(wallet.address.length - 6)}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Full-Stack Web Developer"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  />
                  {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your project requirements, expectations, and any specific details..."
                    rows={6}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                  />
                  {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                  >
                    <option value="" className="bg-slate-800">Select a category</option>
                    {CATEGORIES.map(category => (
                      <option key={category} value={category} className="bg-slate-800">
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
                </div>
              </div>
            </div>

            {/* Skills Required */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Skills Required</h2>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill (e.g. React, Node.js, Design)"
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="bg-blue-500 hover:bg-blue-600 p-3 rounded-xl transition-colors"
                  >
                    <Plus className="w-5 h-5 text-white" />
                  </button>
                </div>

                {formData.skillsRequired.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skillsRequired.map(skill => (
                      <span
                        key={skill}
                        className="bg-blue-500/20 text-blue-400 px-3 py-2 rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Budget & Timeline */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Budget & Timeline</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Budget Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="fixed"
                        checked={formData.budgetType === 'fixed'}
                        onChange={(e) => setFormData(prev => ({ ...prev, budgetType: e.target.value as 'fixed' | 'hourly' }))}
                        className="mr-2"
                      />
                      <span className="text-white">Fixed Price</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="hourly"
                        checked={formData.budgetType === 'hourly'}
                        onChange={(e) => setFormData(prev => ({ ...prev, budgetType: e.target.value as 'fixed' | 'hourly' }))}
                        className="mr-2"
                      />
                      <span className="text-white">Hourly Rate</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Budget Amount (VUSD) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                      placeholder={formData.budgetType === 'fixed' ? '2500' : '50'}
                      className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>
                  {errors.budget && <p className="text-red-400 text-sm mt-1">{errors.budget}</p>}
                  <p className="text-gray-400 text-sm mt-1">
                    {formData.budgetType === 'fixed' ? 'Total project budget' : 'Per hour rate'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Duration *
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                  >
                    <option value="" className="bg-slate-800">Select duration</option>
                    {DURATION_OPTIONS.map(duration => (
                      <option key={duration} value={duration} className="bg-slate-800">
                        {duration}
                      </option>
                    ))}
                  </select>
                  {errors.duration && <p className="text-red-400 text-sm mt-1">{errors.duration}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Work Location
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value as 'remote' | 'onsite' | 'hybrid' }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                  >
                    {LOCATION_OPTIONS.map(option => (
                      <option key={option.value} value={option.value} className="bg-slate-800">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isUrgent}
                    onChange={(e) => setFormData(prev => ({ ...prev, isUrgent: e.target.checked }))}
                    className="mr-3"
                  />
                  <span className="text-white">Mark as urgent (Higher visibility)</span>
                </label>
              </div>
            </div>

            {/* Notice */}
            {!wallet.connected && (
              <div className="bg-orange-500/20 border border-orange-400/30 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-orange-400 font-semibold mb-2">Wallet Required</h3>
                    <p className="text-orange-300">
                      You need to connect your wallet to post jobs. Make sure you have enough VUSD tokens for the job budget.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !wallet.connected}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed px-12 py-4 rounded-2xl font-semibold text-lg transition-all transform hover:scale-105"
              >
                {isSubmitting ? 'Posting Job...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
} 