'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Shield, Zap, Globe, Users, Briefcase, TrendingUp } from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function HomePage() {
  const { walletInfo, connectWallet, isConnecting } = useWallet()

  const features = [
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Smart contracts ensure secure, transparent transactions with automatic escrow.'
    },
    {
      icon: Zap,
      title: 'Fast Settlements',
      description: 'Get paid instantly when milestones are completed. No waiting for bank transfers.'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Connect with talent and clients worldwide without geographical restrictions.'
    },
    {
      icon: Users,
      title: 'Reputation System',
      description: 'Build your on-chain reputation with verified reviews and completed projects.'
    }
  ]

  const stats = [
    { label: 'Active Users', value: '2,500+' },
    { label: 'Projects Completed', value: '1,200+' },
    { label: 'Total Volume', value: '$2.5M+' },
    { label: 'Success Rate', value: '98%' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">S</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              The Future of{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Freelancing
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Connect talent with opportunity on the blockchain. Secure payments, transparent contracts, 
              and global accessibility powered by cutting-edge technology.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              {!walletInfo ? (
                <Button
                  onClick={connectWallet}
                  isLoading={isConnecting}
                  size="lg"
                  className="text-lg px-8 py-4"
                >
                  Connect Wallet to Start
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              ) : (
                <Link href="/dashboard">
                  <Button size="lg" className="text-lg px-8 py-4">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              )}
              
              <Link href="/marketplace">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  Explore Marketplace
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose SkillChain?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the next generation of freelancing with blockchain-powered features 
              that protect both clients and freelancers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} hover className="text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Freelancing Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals already using SkillChain to build their careers 
            and grow their businesses.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!walletInfo ? (
              <Button
                onClick={connectWallet}
                isLoading={isConnecting}
                variant="secondary"
                size="lg"
                className="text-lg px-8 py-4"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            ) : (
              <Link href="/users">
                <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                  Find Talent
                  <Users className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            )}
            
            <Link href="/marketplace">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600">
                Browse Projects
                <Briefcase className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
