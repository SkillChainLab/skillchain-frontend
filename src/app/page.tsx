'use client'

import { Briefcase, Users, DollarSign, Shield, Zap, Globe, ArrowRight, Star, TrendingUp, CheckCircle, MessageSquare, HelpCircle, ChevronDown, Wallet as WalletIcon } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { useWallet } from '@/contexts/WalletContext'
import { useState } from 'react'

export default function Home() {
  const { walletInfo, connectWallet, disconnectWallet, isConnecting } = useWallet()
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            SkillChain
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/marketplace" className="text-gray-300 hover:text-white transition-colors">Marketplace</Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
            <Link href="/convert" className="text-gray-300 hover:text-white transition-colors">Convert</Link>
            
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
                      <ArrowRight className="w-4 h-4" />
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

      {/* Hero Section */}
      <div className="relative container mx-auto px-6 py-20">
        <div className="text-center text-white max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">Powered by Blockchain Technology</span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              SkillChain
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl mb-6 text-gray-300 font-light max-w-4xl mx-auto leading-relaxed">
            The Future of <span className="text-white font-semibold">Decentralized Freelancing</span>
          </p>
          
          <p className="text-xl mb-12 text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Connect talent with opportunity on the blockchain. Secure payments, transparent contracts, and global accessibility in one revolutionary platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="/marketplace" className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-10 py-5 rounded-2xl font-semibold text-lg transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center gap-2">
              Explore Marketplace
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/profile" className="group border-2 border-gray-400 hover:border-white hover:bg-white/10 px-10 py-5 rounded-2xl font-semibold text-lg transition-all transform hover:scale-105 flex items-center gap-2">
              Start Freelancing
              <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {/* Enhanced Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all transform hover:scale-105 hover:shadow-xl">
              <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">$50M+</div>
              <p className="text-gray-300 text-lg font-medium">Total Volume Traded</p>
              <p className="text-gray-500 text-sm mt-2">Across all projects</p>
            </div>
            <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all transform hover:scale-105 hover:shadow-xl">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">25K+</div>
              <p className="text-gray-300 text-lg font-medium">Active Users</p>
              <p className="text-gray-500 text-sm mt-2">Growing daily</p>
            </div>
            <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all transform hover:scale-105 hover:shadow-xl">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent mb-2">99.9%</div>
              <p className="text-gray-300 text-lg font-medium">Platform Uptime</p>
              <p className="text-gray-500 text-sm mt-2">Reliable & secure</p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">How SkillChain Works</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Simple steps to get started with decentralized freelancing
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <HowItWorksCard
              step="01"
              title="Connect Wallet"
              description="Connect your Keplr wallet and get access to the SkillChain ecosystem with SKILL and VUSD tokens."
              gradient="from-blue-500 to-cyan-500"
            />
            <HowItWorksCard
              step="02"
              title="Browse & Apply"
              description="Explore job opportunities, submit proposals, and showcase your skills to potential clients worldwide."
              gradient="from-purple-500 to-pink-500"
            />
            <HowItWorksCard
              step="03"
              title="Get Paid"
              description="Receive payments in stable VUSD tokens through smart contracts. Convert back to SKILL anytime."
              gradient="from-green-500 to-emerald-500"
            />
          </div>
        </div>

        {/* Enhanced Features Grid */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Why Choose SkillChain?</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Revolutionary features that make freelancing safer, faster, and more profitable for everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Briefcase className="w-12 h-12" />}
              title="Decentralized Marketplace"
              description="Connect directly with clients without intermediaries. Smart contracts ensure fair payments and transparent project management."
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={<DollarSign className="w-12 h-12" />}
              title="VUSD Stable Payments"
              description="Get paid in stable VUSD tokens pegged to USD. Convert between SKILL and VUSD seamlessly with guaranteed rates."
              gradient="from-green-500 to-emerald-500"
            />
            <FeatureCard
              icon={<Shield className="w-12 h-12" />}
              title="Trustless Escrow"
              description="Milestone-based payments with automated escrow. Your work is protected by immutable smart contracts."
              gradient="from-purple-500 to-violet-500"
            />
            <FeatureCard
              icon={<Users className="w-12 h-12" />}
              title="Reputation System"
              description="Build your permanent, on-chain reputation. Verifiable work history that follows you across the ecosystem."
              gradient="from-orange-500 to-red-500"
            />
            <FeatureCard
              icon={<Zap className="w-12 h-12" />}
              title="Instant Notifications"
              description="Real-time updates for proposals, payments, milestones, and project communications via blockchain events."
              gradient="from-yellow-500 to-orange-500"
            />
            <FeatureCard
              icon={<Globe className="w-12 h-12" />}
              title="Global Access"
              description="Work with anyone, anywhere in the world. No geographic restrictions, banking limitations, or currency barriers."
              gradient="from-indigo-500 to-blue-500"
            />
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">What Users Say</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Real feedback from freelancers and clients using SkillChain
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="SkillChain revolutionized how I work as a freelancer. The VUSD payments are instant and the platform is incredibly secure."
              author="Sarah Chen"
              role="Full-Stack Developer"
              rating={5}
            />
            <TestimonialCard
              quote="Finding quality talent has never been easier. The reputation system helps me identify the best freelancers quickly."
              author="Marcus Johnson"
              role="Startup Founder"
              rating={5}
            />
            <TestimonialCard
              quote="The global reach is amazing. I've worked with clients from 15 different countries, all thanks to SkillChain's blockchain technology."
              author="Elena Rodriguez"
              role="UI/UX Designer"
              rating={5}
            />
          </div>
        </div>

        {/* Enhanced VUSD Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl"></div>
            <div className="relative z-10 text-center text-white">
              <h2 className="text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  VUSD Economy
                </span>
              </h2>
              <p className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                Experience stable, USD-pegged payments with our innovative VUSD token system
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-8">
                  <div className="text-4xl font-bold text-blue-400 mb-3">1 SKILL = $0.50</div>
                  <p className="text-gray-300 text-lg">Current conversion rate</p>
                  <p className="text-gray-500 text-sm mt-2">Always transparent pricing</p>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-2xl p-8">
                  <div className="text-4xl font-bold text-green-400 mb-3">1 VUSD = $1.00</div>
                  <p className="text-gray-300 text-lg">Stable USD value</p>
                  <p className="text-gray-500 text-sm mt-2">Protected from volatility</p>
                </div>
              </div>
              
              <Link href="/convert" className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-10 py-5 rounded-2xl font-semibold text-lg transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25">
                <DollarSign className="w-6 h-6" />
                Convert SKILL ↔ VUSD
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-400">
              Everything you need to know about SkillChain
            </p>
          </div>
          
          <div className="space-y-6">
            <FAQItem
              question="What is VUSD and how does it work?"
              answer="VUSD is our stable token pegged to USD value. It provides freelancers with stable payments while maintaining the benefits of blockchain technology. You can convert SKILL tokens to VUSD at a 2:1 ratio (1 SKILL = $0.50 = 0.5 VUSD)."
            />
            <FAQItem
              question="How do smart contracts protect my payments?"
              answer="Smart contracts automatically escrow payments when milestones are reached. Funds are only released when both parties agree the work is complete, ensuring secure and transparent transactions."
            />
            <FAQItem
              question="What wallet do I need to use SkillChain?"
              answer="SkillChain works with Keplr wallet, which supports Cosmos-based chains. You'll need to install the Keplr browser extension and add the SkillChain network configuration."
            />
            <FAQItem
              question="How is my reputation calculated?"
              answer="Your on-chain reputation is based on completed projects, client ratings, payment history, and dispute resolution. This data is permanently stored on the blockchain and follows you across the ecosystem."
            />
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center text-white max-w-4xl mx-auto mb-20">
          <h2 className="text-5xl font-bold mb-6">Ready to Transform Your Career?</h2>
          <p className="text-2xl text-gray-300 mb-12 leading-relaxed">
            Join thousands of freelancers and clients who are already building the future of work
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/connect" className="group bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 px-12 py-6 rounded-2xl font-semibold text-xl transition-all transform hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 flex items-center gap-3">
              <WalletIcon className="w-6 h-6" />
              Connect Wallet & Start
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/marketplace" className="group border-2 border-gray-400 hover:border-white hover:bg-white/10 px-12 py-6 rounded-2xl font-semibold text-xl transition-all transform hover:scale-110 flex items-center gap-3">
              <Briefcase className="w-6 h-6" />
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
}

function FeatureCard({ icon, title, description, gradient }: FeatureCardProps) {
  return (
    <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient} opacity-60`}></div>
      <div className={`text-transparent bg-gradient-to-r ${gradient} bg-clip-text mb-6 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">{title}</h3>
      <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">{description}</p>
    </div>
  )
}

function HowItWorksCard({ step, title, description, gradient }: { step: string; title: string; description: string; gradient: string }) {
  return (
    <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient} opacity-60`}></div>
      <div className={`text-6xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-4 opacity-20`}>
        {step}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  )
}

function TestimonialCard({ quote, author, role, rating }: { quote: string; author: string; role: string; rating: number }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white">
      <div className="flex gap-1 mb-6">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
        ))}
      </div>
      <blockquote className="text-lg text-gray-300 mb-6 leading-relaxed">
        "{quote}"
      </blockquote>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">{author[0]}</span>
        </div>
        <div>
          <div className="font-semibold">{author}</div>
          <div className="text-gray-400 text-sm">{role}</div>
        </div>
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-white">
      <div className="flex items-center gap-4 mb-4">
        <HelpCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
        <h3 className="text-xl font-semibold">{question}</h3>
      </div>
      <p className="text-gray-300 leading-relaxed pl-10">{answer}</p>
    </div>
  )
}

function Wallet({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  )
}
