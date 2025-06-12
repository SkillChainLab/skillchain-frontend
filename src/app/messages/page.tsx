'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, Paperclip, Image, Smile, MoreVertical, Search, Phone, Video, Info, Star, Clock, CheckCheck, Check, Plus, X, Users } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  type: 'text' | 'image' | 'file' | 'system'
  isRead: boolean
  attachments?: Attachment[]
}

interface Attachment {
  id: string
  name: string
  type: 'image' | 'document' | 'video'
  url: string
  size: number
}

interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantTitle: string
  participantAvatar?: string
  projectTitle: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isOnline: boolean
  isTyping: boolean
  projectBudget: number
  projectStatus: 'active' | 'completed' | 'pending'
}

interface ProjectInfo {
  id: string
  title: string
  budget: number
  status: 'active' | 'completed' | 'pending'
  deadline: string
  progress: number
  milestones: Milestone[]
}

interface Milestone {
  id: string
  title: string
  amount: number
  status: 'pending' | 'in_progress' | 'completed' | 'approved'
  dueDate: string
}

// Mock data
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    participantId: 'client1',
    participantName: 'Marcus Johnson',
    participantTitle: 'Startup Founder',
    projectTitle: 'DeFi Trading Platform',
    lastMessage: 'Great progress on the smart contracts! When can we schedule a review?',
    lastMessageTime: '2 min ago',
    unreadCount: 2,
    isOnline: true,
    isTyping: false,
    projectBudget: 5000,
    projectStatus: 'active'
  },
  {
    id: '2',
    participantId: 'client2',
    participantName: 'Sarah Chen',
    participantTitle: 'Product Manager',
    projectTitle: 'E-commerce Dashboard',
    lastMessage: 'The latest designs look amazing! Just a few minor adjustments needed.',
    lastMessageTime: '1 hour ago',
    unreadCount: 0,
    isOnline: false,
    isTyping: false,
    projectBudget: 2500,
    projectStatus: 'active'
  },
  {
    id: '3',
    participantId: 'client3',
    participantName: 'David Kim',
    participantTitle: 'CTO',
    projectTitle: 'Mobile App Development',
    lastMessage: 'Payment has been released for milestone 2. Great work!',
    lastMessageTime: '3 hours ago',
    unreadCount: 1,
    isOnline: true,
    isTyping: true,
    projectBudget: 3200,
    projectStatus: 'completed'
  }
]

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    senderId: 'client1',
    senderName: 'Marcus Johnson',
    content: 'Hi! I\'ve reviewed your proposal for the DeFi platform. Very impressive work!',
    timestamp: '2024-01-15T09:00:00Z',
    type: 'text',
    isRead: true
  },
  {
    id: '2',
    senderId: 'me',
    senderName: 'You',
    content: 'Thank you! I\'m excited to work on this project. When would you like to start?',
    timestamp: '2024-01-15T09:05:00Z',
    type: 'text',
    isRead: true
  },
  {
    id: '3',
    senderId: 'client1',
    senderName: 'Marcus Johnson',
    content: 'We can start immediately. I\'ll send over the detailed requirements document.',
    timestamp: '2024-01-15T09:10:00Z',
    type: 'text',
    isRead: true,
    attachments: [
      {
        id: 'att1',
        name: 'DeFi_Requirements.pdf',
        type: 'document',
        url: '/files/requirements.pdf',
        size: 2048000
      }
    ]
  },
  {
    id: '4',
    senderId: 'me',
    senderName: 'You',
    content: 'Perfect! I\'ve reviewed the requirements. The smart contract architecture looks solid. I\'ll start with the core trading functions.',
    timestamp: '2024-01-15T10:30:00Z',
    type: 'text',
    isRead: true
  },
  {
    id: '5',
    senderId: 'client1',
    senderName: 'Marcus Johnson',
    content: 'Great progress on the smart contracts! When can we schedule a review?',
    timestamp: '2024-01-15T14:30:00Z',
    type: 'text',
    isRead: false
  }
]

const MOCK_PROJECT_INFO: ProjectInfo = {
  id: '1',
  title: 'DeFi Trading Platform Development',
  budget: 5000,
  status: 'active',
  deadline: '2024-02-15',
  progress: 65,
  milestones: [
    {
      id: 'm1',
      title: 'Smart Contract Development',
      amount: 2000,
      status: 'completed',
      dueDate: '2024-01-20'
    },
    {
      id: 'm2',
      title: 'Frontend Integration',
      amount: 2000,
      status: 'in_progress',
      dueDate: '2024-02-05'
    },
    {
      id: 'm3',
      title: 'Testing & Deployment',
      amount: 1000,
      status: 'pending',
      dueDate: '2024-02-15'
    }
  ]
}

export default function MessagesPage() {
  const [conversations] = useState<Conversation[]>(MOCK_CONVERSATIONS)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0])
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES)
  const [newMessage, setNewMessage] = useState('')
  const [showProjectInfo, setShowProjectInfo] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'You',
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
      isRead: true
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400'
      case 'completed': return 'bg-blue-500/20 text-blue-400'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 border-b border-white/10">
        <div className="flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-3 text-white hover:text-gray-300 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <div className="text-xl font-bold flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              Messages
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/marketplace" className="text-gray-300 hover:text-white transition-colors text-sm">Marketplace</Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors text-sm">Dashboard</Link>
            <Link href="/social" className="text-gray-300 hover:text-white transition-colors text-sm">Social</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="h-[calc(100vh-80px)] flex">
        {/* Conversations Sidebar */}
        <div className="w-80 border-r border-white/10 bg-slate-900/50 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors text-sm"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map(conversation => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 ${
                  selectedConversation?.id === conversation.id ? 'bg-blue-500/10 border-l-2 border-l-blue-400' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center font-bold text-white text-sm">
                      {conversation.participantName[0]}
                    </div>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border border-slate-900"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-medium text-white truncate text-sm">{conversation.participantName}</h4>
                      <span className="text-xs text-gray-400">{conversation.lastMessageTime}</span>
                    </div>
                    <p className="text-xs text-blue-400 mb-1 truncate">{conversation.projectTitle}</p>
                    <p className="text-xs text-gray-300 truncate">{conversation.lastMessage}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(conversation.projectStatus)}`}>
                        {conversation.projectStatus.toUpperCase()}
                      </span>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-4 h-4 flex items-center justify-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    {conversation.isTyping && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex gap-1">
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce animation-delay-100"></div>
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce animation-delay-200"></div>
                        </div>
                        <span className="text-xs text-blue-400 ml-1">typing...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-900/30">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 bg-slate-900/50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center font-bold text-white text-sm">
                        {selectedConversation.participantName[0]}
                      </div>
                      {selectedConversation.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-slate-900"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">{selectedConversation.participantName}</h3>
                      <p className="text-xs text-gray-400">{selectedConversation.participantTitle}</p>
                      <p className="text-xs text-blue-400">{selectedConversation.projectTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Phone className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Video className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => setShowProjectInfo(!showProjectInfo)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Info className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${
                      message.senderId === 'me'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                        : 'bg-white/10'
                    } rounded-2xl p-3`}>
                      {message.senderId !== 'me' && (
                        <p className="text-blue-400 text-xs font-medium mb-1">{message.senderName}</p>
                      )}
                      <p className="text-white text-sm leading-relaxed">{message.content}</p>
                      
                      {message.attachments && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map(attachment => (
                            <div key={attachment.id} className="bg-white/10 rounded-lg p-2 flex items-center gap-2">
                              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                                <Paperclip className="w-3 h-3 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-white text-xs font-medium">{attachment.name}</p>
                                <p className="text-gray-400 text-xs">{formatFileSize(attachment.size)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-300">{formatTime(message.timestamp)}</span>
                        {message.senderId === 'me' && (
                          <div className="flex items-center gap-1">
                            {message.isRead ? (
                              <CheckCheck className="w-3 h-3 text-blue-400" />
                            ) : (
                              <Check className="w-3 h-3 text-gray-400" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-white/10 bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white/10 rounded-xl border border-white/20 focus-within:border-blue-400 transition-colors">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      rows={1}
                      className="w-full bg-transparent px-3 py-2 text-white placeholder-gray-400 focus:outline-none resize-none text-sm"
                    />
                    <div className="flex justify-between items-center px-3 pb-2">
                      <div className="flex gap-1">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="p-1.5 hover:bg-white/10 rounded transition-colors"
                        >
                          <Paperclip className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
                          <Image className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
                          <Smile className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed p-1.5 rounded transition-all"
                      >
                        <Send className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Select a conversation</h3>
                <p className="text-sm">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>

        {/* Project Info Sidebar */}
        {showProjectInfo && selectedConversation && (
          <div className="w-72 border-l border-white/10 bg-slate-900/50 p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Project Info</h3>
              <button
                onClick={() => setShowProjectInfo(false)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Project Overview */}
              <div className="bg-white/5 rounded-xl p-3">
                <h4 className="font-medium text-white mb-2 text-sm">{MOCK_PROJECT_INFO.title}</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Budget:</span>
                    <span className="text-green-400 font-semibold">${MOCK_PROJECT_INFO.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={`px-2 py-0.5 rounded-full font-medium ${getStatusColor(MOCK_PROJECT_INFO.status)}`}>
                      {MOCK_PROJECT_INFO.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Deadline:</span>
                    <span className="text-white">{new Date(MOCK_PROJECT_INFO.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="bg-white/5 rounded-xl p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-xs">Progress</span>
                  <span className="text-white text-xs font-semibold">{MOCK_PROJECT_INFO.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${MOCK_PROJECT_INFO.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-2 rounded-lg text-white font-medium transition-all text-sm">
                  View Project Details
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-2 rounded-lg text-white font-medium transition-all text-sm">
                  Share Files
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          console.log('Files selected:', e.target.files)
        }}
      />
    </div>
  )
} 