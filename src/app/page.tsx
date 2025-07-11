'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Globe, 
  Users, 
  Star,
  ArrowDown,
  UserPlus,
  Award,
  Handshake,
  DollarSign,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Play,
  TrendingUp,
  Building,
  Clock,
  Lock
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Footer from '@/components/Footer'

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // Statistics
  const stats = [
    { label: 'Active Professionals', value: '25,000+', icon: Users },
    { label: 'Projects Completed', value: '15,500+', icon: CheckCircle },
    { label: 'Total Volume', value: '$12.5M+', icon: TrendingUp },
    { label: 'Success Rate', value: '99.2%', icon: Star }
  ]

  // How it works steps
  const steps = [
    {
      icon: UserPlus,
      title: 'Create Your Profile',
      description: 'Build your professional blockchain identity with verified credentials and showcase your expertise to the world.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Award,
      title: 'Validate Your Skills',
      description: 'Get your skills verified through our blockchain-based validation system and peer endorsements.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Handshake,
      title: 'Connect & Collaborate',
      description: 'Find perfect matches with clients and colleagues through our AI-powered recommendation engine.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: DollarSign,
      title: 'Earn with Confidence',
      description: 'Receive instant payments in VUSD stablecoins with our secure smart contract escrow system.',
      color: 'from-orange-500 to-red-500'
    }
  ]

  // Ecosystem features
  const ecosystemFeatures = [
    {
      title: 'Skill Validation',
      description: 'Blockchain-verified skills with immutable certificates that employers can trust without question.',
      icon: Shield,
      features: ['Peer-to-peer validation', 'Immutable certificates', 'Global recognition']
    },
    {
      title: 'Reputation System',
      description: 'Build your professional reputation through transparent, tamper-proof reviews and project history.',
      icon: Star,
      features: ['Transparent reviews', 'Project history', 'Trust scoring']
    },
    {
      title: 'Instant Payments',
      description: 'Secure, fast payments in VUSD stablecoins with automated escrow and milestone-based releases.',
      icon: Zap,
      features: ['VUSD stablecoin', 'Smart contracts', 'Milestone payments']
    }
  ]

  // Success stories
  const testimonials = [
    {
      type: 'Freelancer',
      name: 'Sarah Chen',
      role: 'Senior Full-Stack Developer',
      company: 'Independent',
      quote: 'SkillChain revolutionized my freelancing career. With verified skills and instant payments, I increased my earnings by 300% while working with top-tier clients globally.',
      avatar: 'SC',
      stats: { projects: '127', earnings: '$180K', rating: '4.98' }
    },
    {
      type: 'Hiring Manager',
      name: 'Marcus Rodriguez',  
      role: 'VP of Engineering',
      company: 'TechFlow Inc.',
      quote: 'Finding truly qualified developers was our biggest challenge. SkillChain\'s verification system eliminated hiring risks and reduced our time-to-hire by 75%.',
      avatar: 'MR',
      stats: { hires: '45', saved: '60%', satisfaction: '98%' }
    },
    {
      type: 'Enterprise',
      name: 'Jennifer Walsh',
      role: 'Chief Technology Officer', 
      company: 'DataCorp Solutions',
      quote: 'We saved $2.4M in annual hiring costs while accessing a global talent pool of pre-verified experts. SkillChain transformed how we build our technical teams.',
      avatar: 'JW',
      stats: { savings: '$2.4M', quality: '40%', time: '65%' }
    }
  ]

  // Partner logos
  const partners = [
    { name: 'Coinbase', logo: 'CB' },
    { name: 'Binance', logo: 'BN' }, 
    { name: 'Polygon', logo: 'PG' },
    { name: 'Chainlink', logo: 'CL' },
    { name: 'Cosmos', logo: 'CS' },
    { name: 'Keplr', logo: 'KP' }
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 7000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 overflow-hidden">
        {/* Sophisticated background patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        </div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:72px_72px]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 min-h-screen flex items-center">
          <div className="w-full">
            {/* Navigation hint */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-400/20 rounded-full text-blue-300 text-sm font-medium backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Network Active • 25,147 Professionals Online
              </div>
          </div>
          
            {/* Logo and Brand */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 rounded-2xl mb-8 shadow-2xl shadow-blue-500/25">
                <span className="text-white font-bold text-4xl">S</span>
              </div>
              <div className="text-blue-400 font-semibold text-lg tracking-wider">SKILLCHAIN</div>
            </div>

            {/* Hero Content */}
            <div className="text-center max-w-5xl mx-auto">
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                Where Skills Meet{' '}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Trust
            </span>
          </h1>
          
              <p className="text-xl lg:text-2xl text-slate-300 mb-12 leading-relaxed max-w-4xl mx-auto">
                Blockchain-powered professional verification and rewards ecosystem. 
                Verify your skills on blockchain, build trusted reputation and access global opportunities.
          </p>
          
            {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              
                  <Link href="/explorer">
                    <Button size="lg" className="text-lg px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl shadow-blue-500/25">
                      Go to Explorer
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>

              
                <Button variant="outline" size="lg" className="text-lg px-10 py-4 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500 backdrop-blur-sm">
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
          </div>
          
            {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                <div key={index} className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-800/50 rounded-xl mb-4 backdrop-blur-sm">
                        <Icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.value}</div>
                      <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
                  </div>
                  )
                })}
            </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-slate-400" />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-6">
              HOW IT WORKS
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Four Steps to Success
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Build your blockchain-powered professional career and earn reliable income in four simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="relative group">
                  {/* Connection line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-slate-200 to-slate-300 z-0"></div>
                  )}
                  
                  <Card className="relative z-10 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                    <CardContent className="p-8 text-center">
                      <div className="relative mb-8">
                        <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                          <Icon className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Ecosystem Features */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold mb-6">
              ECOSYSTEM
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Trustless, Transparent, Global
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12">
              A trusted, transparent and global professional ecosystem powered by blockchain technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {ecosystemFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-center text-slate-700">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>

        </div>
      </section>

      {/* Success Stories */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-6">
              SUCCESS STORIES
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Real Results from Real People
            </h2>
            <p className="text-xl text-slate-600">
              Discover success stories from the SkillChain community
            </p>
          </div>

          <div className="relative">
            <Card className="border-0 shadow-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Testimonial Content */}
                  <div className="p-12">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-lg">{testimonials[currentTestimonial].avatar}</span>
                      </div>
                      <div>
                        <div className="text-sm text-blue-600 font-semibold">{testimonials[currentTestimonial].type}</div>
                        <h4 className="text-xl font-bold text-slate-900">{testimonials[currentTestimonial].name}</h4>
                        <p className="text-slate-600">{testimonials[currentTestimonial].role}</p>
                        <p className="text-sm text-slate-500">{testimonials[currentTestimonial].company}</p>
                      </div>
                    </div>
                    
                    <blockquote className="text-lg text-slate-700 font-medium leading-relaxed mb-8 italic">
                      "{testimonials[currentTestimonial].quote}"
                    </blockquote>

                    <div className="flex justify-center gap-2 mb-4">
                      {testimonials.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentTestimonial(index)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            index === currentTestimonial ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Stats Panel */}
                  <div className="bg-gradient-to-br from-slate-900 to-blue-900 p-12 text-white">
                    <h5 className="text-lg font-semibold mb-8">Key Metrics</h5>
                    <div className="space-y-6">
                      {Object.entries(testimonials[currentTestimonial].stats).map(([key, value], idx) => (
                        <div key={idx} className="border-b border-white/10 pb-4">
                          <div className="text-2xl font-bold text-blue-400">{value}</div>
                          <div className="text-sm text-slate-300 capitalize">{key.replace('_', ' ')}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:shadow-xl transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:shadow-xl transition-all"
            >
              <ChevronRight className="w-6 h-6 text-slate-600" />
            </button>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-lg font-semibold text-slate-500 mb-8">Trusted by Industry Leaders</h3>
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-8 items-center">
              {partners.map((partner, index) => (
                <div key={index} className="flex flex-col items-center group">
                  <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center mb-2 group-hover:shadow-lg transition-shadow">
                    <span className="text-slate-700 font-bold text-sm">{partner.logo}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-8">
            JOIN THE REVOLUTION
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Build Your Trusted Professional Profile?
              </h2>
          <p className="text-xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
            Take your place in the SkillChain ecosystem. Build your trusted blockchain identity, 
            access global opportunities and take your career to the next level.
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
