'use client'

import { useState } from 'react'
import { UserPlus, Check, Clock, X, MessageCircle } from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
import Link from 'next/link'

interface ConnectButtonProps {
  targetUser: {
    walletAddress: string
    displayName: string
  }
  currentConnectionStatus?: 'none' | 'pending_sent' | 'pending_received' | 'connected' | 'blocked'
  onConnectionChange?: () => void
  className?: string
}

export default function ConnectButton({ 
  targetUser, 
  currentConnectionStatus = 'none',
  onConnectionChange,
  className = '' 
}: ConnectButtonProps) {
  const [status, setStatus] = useState(currentConnectionStatus)
  const [isLoading, setIsLoading] = useState(false)
  
  const { walletInfo } = useWallet()

  const sendConnectionRequest = async () => {
    if (!walletInfo || isLoading) return

    try {
      setIsLoading(true)
      
      const response = await fetch('/api/social/connections/request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${walletInfo.address}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          toUser: targetUser.walletAddress
        })
      })

      if (response.ok) {
        setStatus('pending_sent')
        console.log('✅ Connection request sent successfully')
        onConnectionChange?.()
      } else {
        const error = await response.json()
        console.error('Failed to send connection request:', error)
        
        if (response.status === 409) {
          alert('Connection already exists or is pending')
        } else {
          alert('Failed to send connection request')
        }
      }
    } catch (error) {
      console.error('Error sending connection request:', error)
      alert('Error sending connection request')
    } finally {
      setIsLoading(false)
    }
  }

  const getButtonContent = () => {
    switch (status) {
      case 'none':
        return {
          icon: <UserPlus className="w-4 h-4" />,
          text: 'Connect',
          className: 'bg-blue-600 hover:bg-blue-700 text-white',
          onClick: sendConnectionRequest,
          disabled: isLoading
        }
      
      case 'pending_sent':
        return {
          icon: <Clock className="w-4 h-4" />,
          text: 'Request Sent',
          className: 'bg-gray-600 text-gray-300 cursor-not-allowed',
          onClick: () => {},
          disabled: true
        }
      
      case 'pending_received':
        return {
          icon: <Clock className="w-4 h-4" />,
          text: 'Pending Response',
          className: 'bg-yellow-600 text-white cursor-not-allowed',
          onClick: () => {},
          disabled: true
        }
      
      case 'connected':
        return {
          icon: <MessageCircle className="w-4 h-4" />,
          text: 'Message',
          className: 'bg-green-600 hover:bg-green-700 text-white',
          onClick: () => {},
          disabled: false,
          isMessage: true
        }
      
      case 'blocked':
        return {
          icon: <X className="w-4 h-4" />,
          text: 'Blocked',
          className: 'bg-red-600 text-white cursor-not-allowed',
          onClick: () => {},
          disabled: true
        }
      
      default:
        return {
          icon: <UserPlus className="w-4 h-4" />,
          text: 'Connect',
          className: 'bg-blue-600 hover:bg-blue-700 text-white',
          onClick: sendConnectionRequest,
          disabled: isLoading
        }
    }
  }

  // Don't show connect button for self
  if (walletInfo && walletInfo.address === targetUser.walletAddress) {
    return null
  }

  const buttonConfig = getButtonContent()

  // If it's a message button, render as Link
  if (buttonConfig.isMessage) {
    return (
      <Link 
        href="/messages"
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
          ${buttonConfig.className}
          ${className}
        `}
      >
        {buttonConfig.icon}
        {buttonConfig.text}
      </Link>
    )
  }

  return (
    <button
      onClick={buttonConfig.onClick}
      disabled={buttonConfig.disabled}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${buttonConfig.className}
        ${className}
      `}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        buttonConfig.icon
      )}
      {buttonConfig.text}
    </button>
  )
} 