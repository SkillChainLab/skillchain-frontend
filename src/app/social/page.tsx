'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Users, TrendingUp, Image, Video, FileText, Camera, Send, Globe } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { useWallet } from '@/contexts/WalletContext'
import { socialApi, UserConnection, SocialProfile } from '@/lib/socialApi'

interface Post {
  id: string
  author: {
    id: string
    name: string
    title: string
    avatar?: string
    isVerified?: boolean
  }
  content: string
  images?: string[]
  createdAt: string
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  isBookmarked: boolean
  type: 'text' | 'image' | 'video' | 'article'
}

interface Connection {
  id: string
  name: string
  title: string
  avatar?: string
  mutualConnections: number
  isConnected: boolean
}

interface TrendingTopic {
  id: string
  title: string
  posts: number
  growth: string
}

// Mock data
const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: {
      id: '1',
      name: 'Sarah Chen',
      title: 'Full-Stack Developer',
      isVerified: true
    },
    content: '🚀 Just completed an amazing DeFi project on SkillChain! The power of blockchain-based freelancing is incredible. Smart contracts ensure fair payment and the VUSD economy makes international transactions seamless. \n\n#SkillChain #DeFi #Blockchain #WebDevelopment',
    createdAt: '2024-01-15T10:30:00Z',
    likes: 24,
    comments: 8,
    shares: 3,
    isLiked: false,
    isBookmarked: false,
    type: 'text'
  },
  {
    id: '2',
    author: {
      id: '2',
      name: 'Marcus Johnson',
      title: 'Startup Founder',
      isVerified: true
    },
    content: 'Looking for talented React developers for our new project! We\'re building the next generation of e-commerce platforms. Great opportunity to work with cutting-edge tech and a passionate team. \n\nDM me if interested! 💼',
    images: ['/social/project-preview.jpg'],
    createdAt: '2024-01-15T08:15:00Z',
    likes: 12,
    comments: 5,
    shares: 2,
    isLiked: true,
    isBookmarked: true,
    type: 'image'
  }
]

const SUGGESTED_CONNECTIONS: Connection[] = [
  {
    id: '1',
    name: 'Alex Rodriguez',
    title: 'UI/UX Designer',
    mutualConnections: 12,
    isConnected: false
  },
  {
    id: '2',
    name: 'David Kim',
    title: 'Blockchain Developer',
    mutualConnections: 8,
    isConnected: false
  }
]

const TRENDING_TOPICS: TrendingTopic[] = [
  { id: '1', title: 'SkillChain', posts: 145, growth: '+12%' },
  { id: '2', title: 'Web3 Development', posts: 89, growth: '+25%' },
  { id: '3', title: 'Remote Work', posts: 67, growth: '+8%' },
  { id: '4', title: 'VUSD Economy', posts: 43, growth: '+18%' }
]

export default function SocialPage() {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS)
  const [newPost, setNewPost] = useState('')
  const [postType, setPostType] = useState<'text' | 'image' | 'video' | 'article'>('text')
  const [showPostForm, setShowPostForm] = useState(false)
  const [connections, setConnections] = useState<SocialProfile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [connectionRequests, setConnectionRequests] = useState<UserConnection[]>([])
  
  const { walletInfo } = useWallet()

  // Load social data when wallet is connected
  useEffect(() => {
    if (walletInfo) {
      loadSocialData()
    }
  }, [walletInfo])

  const loadSocialData = async () => {
    if (!walletInfo) return
    
    setIsLoading(true)
    try {
      // Load suggested connections
      const suggestions = await socialApi.getSuggestedConnections(walletInfo.address, 5)
      setConnections(suggestions)
      
      // Load pending connection requests
      const requests = await socialApi.getUserConnections(walletInfo.address, 'pending')
      setConnectionRequests(requests.filter(req => req.toUser === walletInfo.address))
      
      // Update online status
      await socialApi.updateOnlineStatus(true)
      
      console.log('✅ Social data loaded successfully')
    } catch (error) {
      console.error('❌ Failed to load social data:', error)
      // Fallback to mock data for development
      setConnections(SUGGESTED_CONNECTIONS.map(conn => ({
        walletAddress: conn.id,
        displayName: conn.name,
        isOnline: false,
        lastSeen: new Date().toISOString(),
        connections: conn.mutualConnections
      })))
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = async (connectionId: string) => {
    if (!walletInfo) return
    
    try {
      // Find connection in suggestions
      const connection = connections.find(conn => conn.walletAddress === connectionId)
      if (!connection) return
      
      // Send connection request
      await socialApi.sendConnectionRequest(connection.walletAddress)
      
      // Update UI - add isConnected property temporarily
      setConnections(prev => prev.map(conn => 
        conn.walletAddress === connectionId 
          ? { ...conn, isConnected: true } as SocialProfile & { isConnected: boolean }
          : conn
      ))
      
      alert(`Connection request sent to ${connection.displayName}! 🤝`)
    } catch (error: any) {
      console.error('Failed to send connection request:', error)
      alert(`Failed to send connection request: ${error.message}`)
    }
  }

  const handleAcceptConnection = async (connectionId: string) => {
    try {
      await socialApi.acceptConnectionRequest(connectionId)
      
      // Remove from pending requests
      setConnectionRequests(prev => prev.filter(req => req.id !== connectionId))
      
      alert('Connection request accepted! 🎉')
      
      // Reload social data
      await loadSocialData()
    } catch (error: any) {
      console.error('Failed to accept connection:', error)
      alert(`Failed to accept connection: ${error.message}`)
    }
  }

  const handleRejectConnection = async (connectionId: string) => {
    try {
      await socialApi.rejectConnectionRequest(connectionId)
      
      // Remove from pending requests
      setConnectionRequests(prev => prev.filter(req => req.id !== connectionId))
      
      alert('Connection request rejected.')
    } catch (error: any) {
      console.error('Failed to reject connection:', error)
      alert(`Failed to reject connection: ${error.message}`)
    }
  }

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ))
  }

  const handleBookmark = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ))
  }

  const handleCreatePost = () => {
    if (!newPost.trim()) return

    const post: Post = {
      id: Date.now().toString(),
      author: {
        id: 'current-user',
        name: 'You',
        title: 'Your Title'
      },
      content: newPost,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false,
      type: postType
    }

    setPosts(prev => [post, ...prev])
    setNewPost('')
    setShowPostForm(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex flex-col">
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
            <div className="text-2xl font-bold flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              SkillChain Social
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/marketplace" className="text-gray-300 hover:text-white transition-colors">Marketplace</Link>
            <Link href="/profile" className="text-gray-300 hover:text-white transition-colors">Profile</Link>
            <Link href="/messages" className="text-gray-300 hover:text-white transition-colors">Messages</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 relative z-10 container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* No Wallet Connected State */}
          {!walletInfo && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center text-white">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <Users className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold mb-6">Connect Your Wallet</h2>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                Connect your Keplr wallet to access SkillChain's social features and connect with other professionals
              </p>
              <p className="text-blue-400 text-lg">
                Please use the "Connect Wallet" button in the navigation above
              </p>
            </div>
          )}

          {/* Main Social Interface */}
          {walletInfo && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Sidebar - Quick Actions & Connection Requests */}
              <div className="space-y-6">
                {/* Create Post */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-4">Share Update</h3>
                  <button
                    onClick={() => setShowPostForm(true)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Post
                  </button>
                </div>

                {/* Connection Requests */}
                {connectionRequests.length > 0 && (
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white">
                    <h3 className="text-lg font-bold mb-4">Connection Requests</h3>
                    <div className="space-y-4">
                      {connectionRequests.map(request => (
                        <div key={request.id} className="p-3 bg-white/5 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center font-bold text-sm">
                              {request.fromUser.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{request.fromUser}</p>
                              <p className="text-xs text-gray-400">Wants to connect</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAcceptConnection(request.id)}
                              className="flex-1 bg-green-500 hover:bg-green-600 py-2 px-3 rounded-lg text-xs font-medium transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectConnection(request.id)}
                              className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 px-3 rounded-lg text-xs font-medium transition-colors"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Connections */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-4">People You May Know</h3>
                  {isLoading ? (
                    <div className="text-center py-4">
                      <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm text-gray-400">Loading suggestions...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {connections.map(connection => (
                        <div key={connection.walletAddress} className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center font-bold">
                            {connection.displayName?.[0] || connection.walletAddress.slice(0, 1).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{connection.displayName || `User ${connection.walletAddress.slice(-6)}`}</p>
                            <p className="text-xs text-gray-400 truncate">SkillChain Professional</p>
                            <p className="text-xs text-gray-500">{connection.connections || 0} connections</p>
                          </div>
                          <button
                            onClick={() => handleConnect(connection.walletAddress)}
                            disabled={(connection as any).isConnected}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                              (connection as any).isConnected
                                ? 'bg-gray-600 text-gray-300'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                          >
                            {(connection as any).isConnected ? 'Sent' : 'Connect'}
                          </button>
                        </div>
                      ))}
                      {connections.length === 0 && (
                        <p className="text-gray-400 text-sm text-center py-4">
                          No suggestions available yet
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Main Feed */}
              <div className="lg:col-span-2 space-y-6">
                {/* Create Post Form */}
                {showPostForm && (
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">Create Post</h3>
                      <button
                        onClick={() => setShowPostForm(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Post Type Selection */}
                      <div className="flex gap-2 p-1 bg-white/10 rounded-xl">
                        {[
                          { type: 'text', icon: FileText, label: 'Text' },
                          { type: 'image', icon: Image, label: 'Image' },
                          { type: 'video', icon: Video, label: 'Video' },
                          { type: 'article', icon: Globe, label: 'Article' }
                        ].map(({ type, icon: Icon, label }) => (
                          <button
                            key={type}
                            onClick={() => setPostType(type as any)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
                              postType === type ? 'bg-blue-500' : 'hover:bg-white/10'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Content Input */}
                      <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="What's on your mind? Share your professional thoughts..."
                        rows={4}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                      />

                      {/* Actions */}
                      <div className="flex justify-between items-center">
                        <div className="flex gap-3">
                          <button className="text-gray-400 hover:text-white transition-colors">
                            <Camera className="w-5 h-5" />
                          </button>
                          <button className="text-gray-400 hover:text-white transition-colors">
                            <Image className="w-5 h-5" />
                          </button>
                        </div>
                        <button
                          onClick={handleCreatePost}
                          disabled={!newPost.trim()}
                          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Posts Feed */}
                <div className="space-y-6">
                  {posts.map(post => (
                    <div key={post.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white">
                      {/* Post Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center font-bold">
                          {post.author.name[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold">{post.author.name}</h4>
                            {post.author.isVerified && (
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">{post.author.title}</p>
                          <p className="text-gray-500 text-xs">{new Date(post.createdAt).toLocaleDateString()}</p>
                        </div>
                        <button className="text-gray-400 hover:text-white transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Post Content */}
                      <div className="mb-4">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">{post.content}</p>
                        
                        {post.images && (
                          <div className="mt-4 grid grid-cols-1 gap-3">
                            {post.images.map((image, index) => (
                              <div key={index} className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                                <Image className="w-12 h-12 text-blue-400" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex gap-6">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center gap-2 transition-colors ${
                              post.isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                            }`}
                          >
                            <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                            <span className="text-sm">{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-sm">{post.comments}</span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
                            <Share2 className="w-5 h-5" />
                            <span className="text-sm">{post.shares}</span>
                          </button>
                        </div>
                        <button
                          onClick={() => handleBookmark(post.id)}
                          className={`transition-colors ${
                            post.isBookmarked ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                          }`}
                        >
                          <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Sidebar - Trending */}
              <div className="space-y-6">
                {/* Trending Topics */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg font-bold">Trending</h3>
                  </div>
                  <div className="space-y-3">
                    {TRENDING_TOPICS.map((topic, index) => (
                      <div key={topic.id} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">#{topic.title}</p>
                            <p className="text-xs text-gray-400">{topic.posts} posts</p>
                          </div>
                          <span className="text-xs text-green-400 font-medium">{topic.growth}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-4">Your Network</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Connections</span>
                      <span className="font-bold text-blue-400">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Profile Views</span>
                      <span className="font-bold text-green-400">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Post Impressions</span>
                      <span className="font-bold text-purple-400">1.2K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
} 