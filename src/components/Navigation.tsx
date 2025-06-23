'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Users, Shield, ArrowRight, Wallet as WalletIcon } from 'lucide-react'
import Link from 'next/link'
import { useWallet } from '@/contexts/WalletContext'
import NotificationCenter from './NotificationCenter'

interface NavigationProps {
  title?: string
  backLink?: string
  backText?: string
  showBackButton?: boolean
}

export default function Navigation({ 
  title = 'SkillChain', 
  backLink = '/', 
  backText,
  showBackButton = false 
}: NavigationProps) {
  const { walletInfo, connectWallet, isConnecting, disconnectWallet } = useWallet()
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav className="relative z-10 container mx-auto px-6 py-6">
      <div className="flex justify-between items-center">
        <Link href={backLink} className="flex items-center gap-3 text-white hover:text-gray-300 transition-colors">
          {showBackButton && <ArrowRight className="w-5 h-5 rotate-180" />}
          <div className="text-2xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            {backText || title}
          </div>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="/marketplace" className="text-gray-300 hover:text-white transition-colors">Marketplace</Link>
          <Link href="/users" className="text-gray-300 hover:text-white transition-colors">Users</Link>
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
            <div className="flex items-center gap-4">
              {/* Notification Center */}
              <NotificationCenter />
              
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  ref={buttonRef}
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
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Portal-rendered dropdown */}
      {mounted && showProfileDropdown && walletInfo && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed z-[99999] w-64 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl py-2 shadow-2xl"
          style={{
            left: buttonRef.current ? buttonRef.current.getBoundingClientRect().right - 256 : 'calc(100vw - 280px)',
            top: buttonRef.current ? buttonRef.current.getBoundingClientRect().bottom + 8 : '80px',
          }}
        >
          <div className="px-4 py-3 border-b border-white/10">
            <div className="text-white font-medium">Wallet Connected</div>
            <div className="text-gray-400 text-sm">{formatAddress(walletInfo.address)}</div>
            <div className="text-green-400 text-sm mt-1">{walletInfo.skillBalance} SKILL • {walletInfo.vusdBalance} VUSD</div>
          </div>
          <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors" onClick={() => setShowProfileDropdown(false)}>
            <Users className="w-4 h-4" />
            Profile
          </Link>
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors" onClick={() => setShowProfileDropdown(false)}>
            <Shield className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="/convert" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-colors" onClick={() => setShowProfileDropdown(false)}>
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
        </div>,
        document.body
      )}
    </nav>
  )
} 