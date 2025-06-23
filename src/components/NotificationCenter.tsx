'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, X, Users, Clock } from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'

interface NotificationUser {
  walletAddress: string
  displayName: string
  avatar: string
}

interface Notification {
  id: string
  type: 'connection_request'
  fromUser: NotificationUser
  message: string
  createdAt: string
  connectionId: string
}

interface NotificationCenterProps {
  className?: string
}

export default function NotificationCenter({ className = '' }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())
  
  const { walletInfo } = useWallet()

  // Load notifications on mount and when wallet changes
  useEffect(() => {
    if (walletInfo) {
      loadNotifications()
    }
  }, [walletInfo])

  const loadNotifications = async () => {
    if (!walletInfo) return

    try {
      setIsLoading(true)
      
      const response = await fetch('/api/social/notifications', {
        headers: {
          'Authorization': `Bearer ${walletInfo.address}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
        console.log('📬 Loaded', data.notifications?.length || 0, 'notifications')
      } else {
        console.error('Failed to load notifications:', response.status)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnectionResponse = async (connectionId: string, action: 'accept' | 'reject') => {
    if (!walletInfo) return

    try {
      setProcessingIds(prev => new Set(prev).add(connectionId))
      
      const response = await fetch(`/api/social/connections/${connectionId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${walletInfo.address}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        // Remove the notification from the list
        setNotifications(prev => prev.filter(notif => notif.connectionId !== connectionId))
        console.log(`✅ Connection ${action}ed successfully`)
      } else {
        console.error(`Failed to ${action} connection:`, response.status)
        alert(`Failed to ${action} connection request`)
      }
    } catch (error) {
      console.error(`Error ${action}ing connection:`, error)
      alert(`Error ${action}ing connection request`)
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(connectionId)
        return newSet
      })
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const getAvatarUrl = (avatar: string) => {
    if (!avatar) return null
    if (avatar.startsWith('http')) return avatar
    if (avatar.startsWith('Qm') || avatar.startsWith('bafy')) {
      return `https://gateway.pinata.cloud/ipfs/${avatar}`
    }
    return avatar
  }

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
      >
        <Bell className="w-6 h-6" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Notifications</h3>
              <button
                onClick={loadNotifications}
                disabled={isLoading}
                className="text-blue-400 hover:text-blue-300 text-sm disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>No new notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 border-b border-gray-700 last:border-b-0 hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                      {notification.fromUser.avatar && getAvatarUrl(notification.fromUser.avatar) ? (
                        <img 
                          src={getAvatarUrl(notification.fromUser.avatar) || undefined} 
                          alt={notification.fromUser.displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        notification.fromUser.displayName[0]?.toUpperCase() || '?'
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-sm font-medium">Connection Request</span>
                      </div>
                      
                      <p className="text-white text-sm mb-2">
                        <span className="font-semibold">{notification.fromUser.displayName}</span>
                        {' '}wants to connect with you
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(notification.createdAt)}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConnectionResponse(notification.connectionId, 'accept')}
                          disabled={processingIds.has(notification.connectionId)}
                          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg text-white text-sm font-medium transition-colors"
                        >
                          <Check className="w-3 h-3" />
                          Accept
                        </button>
                        
                        <button
                          onClick={() => handleConnectionResponse(notification.connectionId, 'reject')}
                          disabled={processingIds.has(notification.connectionId)}
                          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg text-white text-sm font-medium transition-colors"
                        >
                          <X className="w-3 h-3" />
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
} 