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
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { walletInfo } = useWallet()

  useEffect(() => {
    if (walletInfo) {
      loadConversations()
    }
  }, [walletInfo])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversations = async () => {
    if (!walletInfo) return

    try {
      setIsLoading(true)
      
      const response = await fetch('/api/messages/conversations', {
        headers: {
          'Authorization': `Bearer ${walletInfo.address}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
        setConnectedUsers(data.connectedUsers || [])
        console.log('💬 Loaded conversations:', data.conversations?.length || 0)
      } else {
        console.error('Failed to load conversations:', response.status)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    if (!walletInfo) return

    try {
      setIsLoadingMessages(true)
      
      const response = await fetch(`/api/messages/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${walletInfo.address}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
        console.log('📨 Loaded messages:', data.messages?.length || 0)
      } else {
        console.error('Failed to load messages:', response.status)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const sendMessage = async () => {
    if (!walletInfo || !selectedConversation || !newMessage.trim()) return

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${walletInfo.address}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientId: selectedConversation.participantId,
          content: newMessage.trim(),
          type: 'text'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, data.message])
        setNewMessage('')
        console.log('✅ Message sent successfully')
        
        // Refresh conversations to update last activity
        loadConversations()
      } else {
        console.error('Failed to send message:', response.status)
        alert('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Error sending message')
    }
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
        
        // Refresh conversations
        loadConversations()
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
                  onClick={() => setSelectedConversation(conversation)}
                  className={cn(
                    'p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                    selectedConversation?.id === conversation.id && 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  )}
                >
                  <div className="flex items-center gap-3">
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
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {conversation.participantName}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(conversation.lastActivity)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        Click to open conversation
                      </p>
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
                      Connected user
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
                          isOwnMessage ? 'flex-row-reverse' : ''
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
                          'max-w-[70%]',
                          isOwnMessage ? 'text-right' : ''
                        )}>
                          <div className={cn(
                            'rounded-2xl px-4 py-2 inline-block',
                            isOwnMessage 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                          )}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                          <div className={cn(
                            'flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400',
                            isOwnMessage ? 'justify-end' : ''
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
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
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