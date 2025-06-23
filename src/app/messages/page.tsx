'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Send, 
  Search, 
  Plus, 
  MessageCircle, 
  Users,
  Clock,
  Check,
  CheckCheck,
  Image,
  Paperclip,
  Smile,
  X
} from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
import AppLayout from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { cn } from '@/components/ui/DesignSystem'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  type: 'text' | 'image' | 'file' | 'system'
  attachments: any[]
  isRead: boolean
  createdAt: string
  editedAt?: string
}

interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantAvatar: string
  lastActivity: string
  createdAt: string
  unreadCount?: number
  lastMessage?: string
  lastMessageSender?: string
  isParticipantTyping?: boolean
}

interface ConnectedUser {
  walletAddress: string
  displayName: string
  avatar: string
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const [isCurrentlyTyping, setIsCurrentlyTyping] = useState(false)
  const [conversationTypingStatus, setConversationTypingStatus] = useState<Record<string, boolean>>({})
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagePollingRef = useRef<NodeJS.Timeout | null>(null)
  const typingPollingRef = useRef<NodeJS.Timeout | null>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const conversationTypingPollingRef = useRef<NodeJS.Timeout | null>(null)
  const conversationUpdatingRef = useRef<NodeJS.Timeout | null>(null)
  const { walletInfo } = useWallet()

  useEffect(() => {
    if (walletInfo) {
      loadConversations()
      startConversationTypingPolling()
      startConversationUpdating()
    }
    
    return () => {
      stopConversationTypingPolling()
      stopConversationUpdating()
    }
  }, [walletInfo])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id)
      startMessagePolling()
      startTypingPolling()
    } else {
      stopMessagePolling()
      stopTypingPolling()
    }
    
    return () => {
      stopMessagePolling()
      stopTypingPolling()
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Track typing status based on newMessage content
  useEffect(() => {
    if (!selectedConversation) return

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    if (newMessage.trim()) {
      // Send typing status immediately
      sendTypingStatus(true)
      setIsCurrentlyTyping(true)
    } else {
      // Stop typing immediately when input is empty
      sendTypingStatus(false)
      setIsCurrentlyTyping(false)
    }
  }, [newMessage, selectedConversation])

  // Send periodic typing updates while actively typing
  useEffect(() => {
    if (!isCurrentlyTyping || !selectedConversation || !newMessage.trim()) return

    const interval = setInterval(() => {
      sendTypingStatus(true)
    }, 2000)

    return () => clearInterval(interval)
  }, [isCurrentlyTyping, selectedConversation, newMessage])

  // Check typing status for all conversations
  const startConversationTypingPolling = () => {
    stopConversationTypingPolling()
    
    conversationTypingPollingRef.current = setInterval(() => {
      checkAllConversationsTyping()
    }, 1000)
  }

  const stopConversationTypingPolling = () => {
    if (conversationTypingPollingRef.current) {
      clearInterval(conversationTypingPollingRef.current)
      conversationTypingPollingRef.current = null
    }
  }

  const checkAllConversationsTyping = async () => {
    if (!walletInfo || conversations.length === 0) return

    try {
      const typingPromises = conversations.map(async (conversation) => {
        const response = await fetch(`/api/messages/typing?conversationId=${conversation.id}`, {
          headers: {
            'Authorization': `Bearer ${walletInfo.address}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          return { conversationId: conversation.id, isTyping: data.isTyping }
        }
        return { conversationId: conversation.id, isTyping: false }
      })

      const results = await Promise.all(typingPromises)
      const newTypingStatus: Record<string, boolean> = {}
      
      results.forEach(result => {
        newTypingStatus[result.conversationId] = result.isTyping
      })

      // Only update state if typing status actually changed
      setConversationTypingStatus(prevStatus => {
        const hasChanged = JSON.stringify(prevStatus) !== JSON.stringify(newTypingStatus)
        return hasChanged ? newTypingStatus : prevStatus
      })
    } catch (error) {
      console.error('Error checking conversations typing:', error)
    }
  }

  const selectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation)
    
    // Mark messages as read when conversation is opened
    if ((conversation.unreadCount || 0) > 0) {
      try {
        await fetch(`/api/messages/${conversation.id}/mark-read`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${walletInfo?.address}`
          }
        })
        
        // Silently refresh conversations to update unread count without loading indicator
        setTimeout(() => {
          loadConversations(true) // Silent reload
        }, 300)
      } catch (error) {
        console.error('Error marking messages as read:', error)
      }
    }
  }

  // Real-time message polling
  const startMessagePolling = () => {
    stopMessagePolling()
    
    if (selectedConversation) {
      messagePollingRef.current = setInterval(() => {
        loadMessages(selectedConversation.id, true) // silent reload
      }, 2000) // Poll every 2 seconds
    }
  }

  const stopMessagePolling = () => {
    if (messagePollingRef.current) {
      clearInterval(messagePollingRef.current)
      messagePollingRef.current = null
    }
  }

  // Real-time typing polling
  const startTypingPolling = () => {
    stopTypingPolling()
    
    if (selectedConversation) {
      typingPollingRef.current = setInterval(() => {
        checkTypingStatus()
      }, 1000) // Check every second
    }
  }

  const stopTypingPolling = () => {
    if (typingPollingRef.current) {
      clearInterval(typingPollingRef.current)
      typingPollingRef.current = null
    }
  }

  const checkTypingStatus = async () => {
    if (!walletInfo || !selectedConversation) return

    try {
      const response = await fetch(`/api/messages/typing?conversationId=${selectedConversation.id}`, {
        headers: {
          'Authorization': `Bearer ${walletInfo.address}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setOtherUserTyping(data.isTyping)
      }
    } catch (error) {
      console.error('Error checking typing status:', error)
    }
  }

  const sendTypingStatus = async (isTyping: boolean) => {
    if (!walletInfo || !selectedConversation) return

    try {
      await fetch('/api/messages/typing', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${walletInfo.address}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientId: selectedConversation.participantId,
          isTyping
        })
      })
    } catch (error) {
      console.error('Error sending typing status:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversations = async (silent = false) => {
    if (!walletInfo) return

    try {
      if (!silent) {
        setIsLoading(true)
      }
      
      const response = await fetch('/api/messages/conversations', {
        headers: {
          'Authorization': `Bearer ${walletInfo.address}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
        setConnectedUsers(data.connectedUsers || [])
        if (!silent) {
          console.log('💬 Loaded conversations:', data.conversations?.length || 0)
        }
      } else {
        console.error('Failed to load conversations:', response.status)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      if (!silent) {
        setIsLoading(false)
      }
    }
  }

  const loadMessages = async (conversationId: string, silent = false) => {
    if (!walletInfo) return

    try {
      if (!silent) {
        setIsLoadingMessages(true)
      }
      
      const response = await fetch(`/api/messages/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${walletInfo.address}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        const newMessages = data.messages || []
        
        // Only update state if messages actually changed
        setMessages(prevMessages => {
          if (JSON.stringify(prevMessages) !== JSON.stringify(newMessages)) {
            return newMessages
          }
          return prevMessages
        })
        
        if (!silent) {
          console.log('📨 Loaded messages:', newMessages.length)
        }
      } else {
        console.error('Failed to load messages:', response.status)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      if (!silent) {
        setIsLoadingMessages(false)
      }
    }
  }

  const sendMessage = async () => {
    if (!walletInfo || !selectedConversation || !newMessage.trim()) return

    const messageContent = newMessage.trim()
    setNewMessage('') // Clear input immediately - this will trigger useEffect to stop typing
    
    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${walletInfo.address}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientId: selectedConversation.participantId,
          content: messageContent,
          type: 'text'
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Add message immediately to UI for instant feedback
        setMessages(prev => [...prev, data.message])
        
        console.log('✅ Message sent successfully')
        
        // Silently refresh conversations to update last activity without loading
        setTimeout(() => {
          loadConversations(true) // Silent reload
        }, 200)
      } else {
        console.error('Failed to send message:', response.status)
        alert('Failed to send message')
        setNewMessage(messageContent) // Restore message if failed
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Error sending message')
      setNewMessage(messageContent) // Restore message if failed
    }
  }

  const handleTyping = (value: string) => {
    setNewMessage(value) // This will trigger the useEffect to handle typing status
  }

  const startNewConversation = async (user: ConnectedUser) => {
    if (!walletInfo) return

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${walletInfo.address}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientId: user.walletAddress,
          content: 'Hello! 👋',
          type: 'text'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setShowNewChatModal(false)
        
        // Create conversation object and select it
        const newConversation: Conversation = {
          id: data.conversation.id,
          participantId: user.walletAddress,
          participantName: user.displayName,
          participantAvatar: user.avatar,
          lastActivity: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
        
        setSelectedConversation(newConversation)
        setMessages([data.message])
        
        // Silently refresh conversations
        setTimeout(() => {
          loadConversations(true) // Silent reload
        }, 200)
      } else {
        console.error('Failed to start conversation:', response.status)
        alert('Failed to start conversation')
      }
    } catch (error) {
      console.error('Error starting conversation:', error)
      alert('Error starting conversation')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  const getAvatarUrl = (avatar: string) => {
    if (!avatar) return null
    if (avatar.startsWith('http')) return avatar
    if (avatar.startsWith('Qm') || avatar.startsWith('bafy')) {
      return `https://gateway.pinata.cloud/ipfs/${avatar}`
    }
    return avatar
  }

  const filteredConnectedUsers = connectedUsers.filter(user =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Regular conversation updates to show new messages
  const startConversationUpdating = () => {
    stopConversationUpdating()
    
    conversationUpdatingRef.current = setInterval(() => {
      loadConversations(true) // Silent reload every 5 seconds
    }, 5000)
  }

  const stopConversationUpdating = () => {
    if (conversationUpdatingRef.current) {
      clearInterval(conversationUpdatingRef.current)
      conversationUpdatingRef.current = null
    }
  }

  if (!walletInfo) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Please connect your wallet to access messaging features.
              </p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="h-screen flex">
        {/* Conversations Sidebar */}
        <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Messages</h1>
              <Button
                onClick={() => setShowNewChatModal(true)}
                size="sm"
                className="p-2"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">No conversations yet</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Start a conversation with your connections</p>
                <Button
                  onClick={() => setShowNewChatModal(true)}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Chat
                </Button>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => selectConversation(conversation)}
                  className={cn(
                    'p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                    selectedConversation?.id === conversation.id && 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                        {conversation.participantAvatar && getAvatarUrl(conversation.participantAvatar) ? (
                          <img 
                            src={getAvatarUrl(conversation.participantAvatar) || undefined} 
                            alt={conversation.participantName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          conversation.participantName[0]?.toUpperCase() || '?'
                        )}
                      </div>
                      
                      {/* Unread message badge */}
                      {(conversation.unreadCount || 0) > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                          {conversation.unreadCount! > 99 ? '99+' : conversation.unreadCount}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={cn(
                          "text-sm truncate",
                          (conversation.unreadCount || 0) > 0
                            ? "font-bold text-gray-900 dark:text-white"
                            : "font-medium text-gray-900 dark:text-white"
                        )}>
                          {conversation.participantName}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(conversation.lastActivity)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          {conversationTypingStatus[conversation.id] ? (
                            <div className="flex items-center gap-1 text-blue-500 dark:text-blue-400">
                              <div className="flex space-x-1">
                                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                              <span className="text-xs">typing...</span>
                            </div>
                          ) : conversation.lastMessage ? (
                            <div className="flex items-center gap-1">
                              {conversation.lastMessageSender === walletInfo?.address && (
                                <div className="flex-shrink-0">
                                  {(conversation.unreadCount || 0) === 0 ? (
                                    <CheckCheck className="w-3 h-3 text-blue-500" />
                                  ) : (
                                    <Check className="w-3 h-3 text-gray-400" />
                                  )}
                                </div>
                              )}
                              <p className={cn(
                                "text-xs truncate",
                                (conversation.unreadCount || 0) > 0
                                  ? "font-semibold text-gray-700 dark:text-gray-300"
                                  : "text-gray-500 dark:text-gray-400"
                              )}>
                                {conversation.lastMessage}
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              Click to open conversation
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                    {selectedConversation.participantAvatar && getAvatarUrl(selectedConversation.participantAvatar) ? (
                      <img 
                        src={getAvatarUrl(selectedConversation.participantAvatar) || undefined} 
                        alt={selectedConversation.participantName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      selectedConversation.participantName[0]?.toUpperCase() || '?'
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedConversation.participantName}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {otherUserTyping ? 'typing...' : 'Connected user'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                {isLoadingMessages ? (
                  <div className="text-center py-8">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No messages yet</h3>
                    <p className="text-gray-500 dark:text-gray-400">Send a message to start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isOwnMessage = message.senderId === walletInfo.address
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          'flex gap-3',
                          isOwnMessage ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {!isOwnMessage && (
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0">
                            {message.senderAvatar && getAvatarUrl(message.senderAvatar) ? (
                              <img 
                                src={getAvatarUrl(message.senderAvatar) || undefined} 
                                alt={message.senderName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              message.senderName[0]?.toUpperCase() || '?'
                            )}
                          </div>
                        )}
                        
                        <div className={cn(
                          'max-w-[70%] flex flex-col',
                          isOwnMessage 
                            ? 'items-end' : 'items-start'
                        )}>
                          <div className={cn(
                            'rounded-2xl px-4 py-2',
                            isOwnMessage 
                              ? 'bg-blue-600 text-white rounded-br-md' 
                              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-md'
                          )}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                          <div className={cn(
                            'flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400'
                          )}>
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(message.createdAt)}</span>
                            {isOwnMessage && (
                              message.isRead ? (
                                <CheckCheck className="w-3 h-3 text-blue-500" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )
                            )}
                          </div>
                        </div>

                        {isOwnMessage && (
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0">
                            {walletInfo.address && getAvatarUrl(walletInfo.address) ? (
                              <img 
                                src={getAvatarUrl(walletInfo.address) || undefined} 
                                alt="You"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              'You'[0]?.toUpperCase() || '?'
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })
                )}

                {/* Typing Indicator - Only show when OTHER user is typing */}
                {otherUserTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0">
                      {selectedConversation.participantAvatar && getAvatarUrl(selectedConversation.participantAvatar) ? (
                        <img 
                          src={getAvatarUrl(selectedConversation.participantAvatar) || undefined} 
                          alt={selectedConversation.participantName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        selectedConversation.participantName[0]?.toUpperCase() || '?'
                      )}
                    </div>
                    
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => handleTyping(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full resize-none border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32"
                    />
                  </div>
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Select a conversation</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Choose a conversation from the sidebar to start messaging</p>
                <Button
                  onClick={() => setShowNewChatModal(true)}
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Start New Conversation
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* New Chat Modal */}
        {showNewChatModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Start New Conversation</CardTitle>
                  <Button
                    onClick={() => setShowNewChatModal(false)}
                    variant="ghost"
                    size="sm"
                    className="p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search connected users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredConnectedUsers.length === 0 ? (
                    <div className="text-center py-6">
                      <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {connectedUsers.length === 0 
                          ? 'No connected users. Connect with users first to start conversations.'
                          : 'No users found matching your search.'}
                      </p>
                    </div>
                  ) : (
                    filteredConnectedUsers.map((user) => (
                      <div
                        key={user.walletAddress}
                        onClick={() => startNewConversation(user)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                          {user.avatar && getAvatarUrl(user.avatar) ? (
                            <img 
                              src={getAvatarUrl(user.avatar) || undefined} 
                              alt={user.displayName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            user.displayName[0]?.toUpperCase() || '?'
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {user.displayName}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user.walletAddress.slice(0, 12)}...{user.walletAddress.slice(-8)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  )
} 