'use client'

import { ArrowLeft, Wallet, Shield, Zap, Users, CheckCircle, AlertCircle, ExternalLink, Copy, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { useWallet } from '@/contexts/WalletContext'

interface KeplrWindow extends Window {
  keplr?: any
}

declare const window: KeplrWindow

export default function ConnectWalletPage() {
  const { 
    walletInfo, 
    isConnecting, 
    error, 
    connectWallet, 
    disconnectWallet, 
    refreshBalances, 
    copyAddress, 
    copied 
  } = useWallet()

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
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
              Connect Wallet
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/marketplace" className="text-gray-300 hover:text-white transition-colors">Marketplace</Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
            <Link href="/convert" className="text-gray-300 hover:text-white transition-colors">Convert</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center text-white mb-12">
            <h1 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Connect Your Wallet
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-4">
              Connect your Keplr wallet to access SkillChain's decentralized freelancing platform
            </p>
            
            {/* Network Status */}
            <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-semibold">SkillChain Network Active</span>
              </div>
              <p className="text-sm text-gray-300">
                Connected to local SkillChain blockchain with <strong>SKILL</strong> and <strong>VUSD</strong> tokens.
                Faucet available at <code className="bg-white/10 px-2 py-1 rounded">localhost:4500</code>
              </p>
            </div>
          </div>

          {!walletInfo ? (
            <>
              {/* Connection Section */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Wallet className="w-10 h-10 text-white" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-4">Keplr Wallet Required</h2>
                  <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                    SkillChain uses Keplr wallet for secure blockchain interactions. 
                    Install Keplr extension and connect to start using the platform.
                  </p>

                  {error && (
                    <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-6 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <p className="text-red-300">{error}</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {!window.keplr ? (
                      <a
                        href="https://www.keplr.app/download"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center gap-2"
                      >
                        Install Keplr Wallet
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    ) : (
                      <button
                        onClick={connectWallet}
                        disabled={isConnecting}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center gap-2"
                      >
                        {isConnecting ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Wallet className="w-5 h-5" />
                            Connect Keplr Wallet
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Benefits Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BenefitCard
                  icon={<Shield className="w-8 h-8" />}
                  title="Secure Transactions"
                  description="All payments and contracts are secured by blockchain technology with complete transparency."
                  gradient="from-green-500 to-emerald-500"
                />
                <BenefitCard
                  icon={<Zap className="w-8 h-8" />}
                  title="Instant Payments"
                  description="Receive payments instantly in VUSD stable tokens without traditional banking delays."
                  gradient="from-blue-500 to-cyan-500"
                />
                <BenefitCard
                  icon={<Users className="w-8 h-8" />}
                  title="Global Access"
                  description="Work with clients worldwide without geographic restrictions or currency barriers."
                  gradient="from-purple-500 to-pink-500"
                />
              </div>

              {/* How to Test Guide */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mt-8">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">How to Use SkillChain</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                      Install Keplr Wallet
                    </h3>
                    <div className="space-y-2 text-gray-300 text-sm">
                      <p>• Install Keplr browser extension</p>
                      <p>• Create a new wallet or import existing</p>
                      <p>• SkillChain network will be added automatically</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                      Connect to SkillChain
                    </h3>
                    <div className="space-y-2 text-gray-300 text-sm">
                      <p>• Click "Connect Keplr Wallet" button</p>
                      <p>• Approve SkillChain network addition</p>
                      <p>• Your skill... address will be displayed</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                      Get SKILL Tokens
                    </h3>
                    <div className="space-y-2 text-gray-300 text-sm">
                      <p>• Visit the faucet at localhost:4500</p>
                      <p>• Enter your skill... address</p>
                      <p>• Receive free SKILL and VUSD tokens</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                      Start Freelancing
                    </h3>
                    <div className="space-y-2 text-gray-300 text-sm">
                      <p>• Browse and post jobs in marketplace</p>
                      <p>• Convert SKILL ↔ VUSD tokens</p>
                      <p>• Use messaging for client communication</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-blue-500/20 border border-blue-400/30 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-blue-400 font-semibold mb-1">SkillChain Faucet</h4>
                      <p className="text-gray-300 text-sm">
                        Get free SKILL and VUSD tokens from our local faucet: 
                        <a href="http://localhost:4500" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 ml-1">
                          http://localhost:4500
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Connected Wallet Info */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Wallet Connected</h2>
                      <p className="text-green-400 font-medium">Successfully connected to SkillChain</p>
                    </div>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 px-4 py-2 rounded-lg text-red-300 font-medium transition-all"
                  >
                    Disconnect
                  </button>
                </div>

                {/* Wallet Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Address & Chain Info */}
                  <div className="bg-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Wallet Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-gray-400 text-sm">Address</label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="bg-white/10 px-3 py-2 rounded-lg text-white text-sm font-mono flex-1">
                            {formatAddress(walletInfo.address)}
                          </code>
                          <button
                            onClick={copyAddress}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                          >
                            {copied ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Network</label>
                        <div className="bg-white/10 px-3 py-2 rounded-lg text-white text-sm mt-1">
                          SkillChain Network
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Balances */}
                  <div className="bg-white/5 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">Token Balances</h3>
                      <button
                        onClick={refreshBalances}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <RefreshCw className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
                        <div>
                          <div className="text-white font-semibold">SKILL</div>
                          <div className="text-gray-400 text-sm">Native Token</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">{walletInfo.skillBalance.toLocaleString()}</div>
                          <div className="text-gray-400 text-sm">${(walletInfo.skillBalance * 0.5).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg">
                        <div>
                          <div className="text-white font-semibold">VUSD</div>
                          <div className="text-gray-400 text-sm">Stable Token</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">{walletInfo.vusdBalance.toLocaleString()}</div>
                          <div className="text-gray-400 text-sm">≈ ${walletInfo.vusdBalance.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <QuickActionButton
                    href="/convert"
                    icon={<RefreshCw className="w-5 h-5" />}
                    label="Convert Tokens"
                    description="SKILL ↔ VUSD"
                    gradient="from-blue-500 to-purple-600"
                  />
                  <QuickActionButton
                    href="/marketplace"
                    icon={<Users className="w-5 h-5" />}
                    label="Browse Jobs"
                    description="Find opportunities"
                    gradient="from-purple-500 to-pink-600"
                  />
                  <QuickActionButton
                    href="/dashboard"
                    icon={<Shield className="w-5 h-5" />}
                    label="Dashboard"
                    description="View activity"
                    gradient="from-green-500 to-emerald-600"
                  />
                  <QuickActionButton
                    href="/profile"
                    icon={<Wallet className="w-5 h-5" />}
                    label="Profile"
                    description="Manage account"
                    gradient="from-orange-500 to-red-600"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

function BenefitCard({ icon, title, description, gradient }: {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
}) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-white hover:bg-white/10 transition-all">
      <div className={`text-transparent bg-gradient-to-r ${gradient} bg-clip-text mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  )
}

function QuickActionButton({ href, icon, label, description, gradient }: {
  href: string
  icon: React.ReactNode
  label: string
  description: string
  gradient: string
}) {
  return (
    <Link 
      href={href}
      className={`bg-gradient-to-r ${gradient} hover:opacity-90 p-4 rounded-xl transition-all transform hover:scale-105 flex flex-col items-center text-center text-white`}
    >
      <div className="mb-2">{icon}</div>
      <div className="font-semibold mb-1">{label}</div>
      <div className="text-xs opacity-80">{description}</div>
    </Link>
  )
} 