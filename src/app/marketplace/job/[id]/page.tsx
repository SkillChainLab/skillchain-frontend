'use client'

import { useState } from 'react'
import { ArrowLeft, MapPin, Clock, DollarSign, Users, Star, Calendar, Tag, AlertCircle, Send } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'

// Mock job data - in real app this would come from blockchain/API
const MOCK_JOB = {
  id: '1',
  title: 'Full-Stack Web Application Development',
  description: `Looking for an experienced full-stack developer to build a modern web application using React, Node.js, and MongoDB. 

The project involves:
• Creating a user dashboard with real-time data visualization
• Building RESTful APIs with authentication and authorization
• Implementing responsive design with Tailwind CSS
• Setting up CI/CD pipeline and deployment
• Writing comprehensive tests

Requirements:
• 3+ years of experience with React and Node.js
• Strong knowledge of MongoDB and database design
• Experience with TypeScript and modern JavaScript
• Understanding of security best practices
• Ability to work independently and meet deadlines

This is a great opportunity to work on a cutting-edge project with a growing startup. We value quality code, clean architecture, and attention to detail.`,
  skillsRequired: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind CSS'],
  budget: 2500,
  budgetType: 'fixed' as 'fixed' | 'hourly',
  duration: '2-3 months',
  location: 'remote' as 'remote' | 'onsite' | 'hybrid',
  category: 'Web Development',
  clientName: 'TechCorp Inc.',
  clientRating: 4.8,
  clientJobs: 12,
  postedAt: '2024-01-15',
  proposals: 12,
  isUrgent: true,
  clientDescription: 'We are a fast-growing tech company focused on building innovative SaaS solutions for small businesses. Our team values collaboration, innovation, and delivering high-quality products.'
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const [showProposalForm, setShowProposalForm] = useState(false)
  const [proposal, setProposal] = useState({
    coverLetter: '',
    proposedBudget: '',
    timeline: '',
    questions: ''
  })

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would submit the proposal to blockchain/API
    console.log('Proposal submitted:', proposal)
    alert('Proposal submitted successfully!')
    setShowProposalForm(false)
    setProposal({
      coverLetter: '',
      proposedBudget: '',
      timeline: '',
      questions: ''
    })
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
            <span className="text-lg font-medium">Back to Marketplace</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 relative z-10 container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Header */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h1 className="text-3xl font-bold">{MOCK_JOB.title}</h1>
                      {MOCK_JOB.isUrgent && (
                        <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                          URGENT
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-6 text-gray-400">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Posted {new Date(MOCK_JOB.postedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {MOCK_JOB.proposals} proposals
                      </span>
                      <span className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        {MOCK_JOB.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-400">
                      ${MOCK_JOB.budget}{MOCK_JOB.budgetType === 'hourly' ? '/hr' : ''}
                    </div>
                    <div className="text-gray-400">
                      {MOCK_JOB.budgetType === 'fixed' ? 'Fixed Price' : 'Hourly Rate'}
                    </div>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-gray-400 pb-6 border-b border-white/10">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {MOCK_JOB.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {MOCK_JOB.duration}
                  </span>
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Budget: ${MOCK_JOB.budget} VUSD
                  </span>
                </div>

                {/* Skills */}
                <div className="pt-6">
                  <h3 className="text-lg font-semibold mb-3">Skills Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_JOB.skillsRequired.map(skill => (
                      <span
                        key={skill}
                        className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-6">Job Description</h2>
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-line text-gray-300 leading-relaxed">
                    {MOCK_JOB.description}
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-6">About the Client</h2>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{MOCK_JOB.clientName[0]}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{MOCK_JOB.clientName}</h3>
                    <div className="flex items-center gap-4 text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        {MOCK_JOB.clientRating} rating
                      </span>
                      <span>{MOCK_JOB.clientJobs} jobs posted</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {MOCK_JOB.clientDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white">
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-green-400 mb-2">
                    ${MOCK_JOB.budget}
                  </div>
                  <div className="text-gray-400">
                    {MOCK_JOB.budgetType === 'fixed' ? 'Fixed Price Project' : 'Hourly Rate'}
                  </div>
                </div>

                {!showProposalForm ? (
                  <button
                    onClick={() => setShowProposalForm(true)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-4 rounded-2xl font-semibold text-lg transition-all transform hover:scale-105"
                  >
                    Submit Proposal
                  </button>
                ) : (
                  <button
                    onClick={() => setShowProposalForm(false)}
                    className="w-full bg-gray-600 hover:bg-gray-700 py-4 rounded-2xl font-semibold text-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}

                <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>Proposals:</span>
                    <span className="text-white">{MOCK_JOB.proposals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Project Duration:</span>
                    <span className="text-white">{MOCK_JOB.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="text-white capitalize">{MOCK_JOB.location}</span>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-orange-500/20 border border-orange-400/30 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <h4 className="text-orange-400 font-semibold mb-1">Payment Protection</h4>
                    <p className="text-orange-300">
                      All payments are secured by smart contracts. Funds are released upon milestone completion.
                    </p>
                  </div>
                </div>
              </div>

              {/* Related Jobs */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Similar Jobs</h3>
                <div className="space-y-3">
                  <Link href="#" className="block p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="font-medium text-sm mb-1">React Developer Needed</div>
                    <div className="text-xs text-gray-400">$1,800 • Fixed Price</div>
                  </Link>
                  <Link href="#" className="block p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="font-medium text-sm mb-1">Node.js Backend Development</div>
                    <div className="text-xs text-gray-400">$45/hr • Hourly</div>
                  </Link>
                  <Link href="#" className="block p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="font-medium text-sm mb-1">Full-Stack Development</div>
                    <div className="text-xs text-gray-400">$3,200 • Fixed Price</div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Proposal Form */}
          {showProposalForm && (
            <div className="mt-8">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-6">Submit Your Proposal</h2>
                
                <form onSubmit={handleProposalSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Cover Letter *
                    </label>
                    <textarea
                      value={proposal.coverLetter}
                      onChange={(e) => setProposal(prev => ({ ...prev, coverLetter: e.target.value }))}
                      placeholder="Introduce yourself and explain why you're the best fit for this project..."
                      rows={6}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Your Proposed Budget (VUSD) *
                      </label>
                      <input
                        type="number"
                        value={proposal.proposedBudget}
                        onChange={(e) => setProposal(prev => ({ ...prev, proposedBudget: e.target.value }))}
                        placeholder="2500"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Timeline *
                      </label>
                      <input
                        type="text"
                        value={proposal.timeline}
                        onChange={(e) => setProposal(prev => ({ ...prev, timeline: e.target.value }))}
                        placeholder="e.g. 8 weeks"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Questions for the Client
                    </label>
                    <textarea
                      value={proposal.questions}
                      onChange={(e) => setProposal(prev => ({ ...prev, questions: e.target.value }))}
                      placeholder="Any questions about the project requirements, timeline, or specifications..."
                      rows={4}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setShowProposalForm(false)}
                      className="px-6 py-3 border border-gray-500 text-gray-300 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Submit Proposal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
} 