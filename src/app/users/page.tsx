'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Users, 
  MapPin, 
  Globe, 
  Github, 
  Linkedin, 
  Twitter,
  Filter,
  Grid3X3,
  List,
  Star,
  Verified,
  Clock
} from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
import AppLayout from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ConnectButton from '@/components/ConnectButton'
import { cn } from '@/components/ui/DesignSystem'

interface User {
  walletAddress: string
  displayName: string
  bio: string
  location: string
  website: string
  github: string
  linkedin: string
  twitter: string
  avatar: string
  reputationScore: number
  profileCreatedOnBlockchain: boolean
}

type ViewMode = 'grid' | 'list'
type SortBy = 'newest' | 'reputation' | 'name'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortBy>('newest')
  const [showFilters, setShowFilters] = useState(false)
  
  const { walletInfo } = useWallet()

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterAndSortUsers()
  }, [searchTerm, users, sortBy])

  const loadUsers = async () => {
    if (!walletInfo) return
    
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/social/users', {
        headers: {
          'Authorization': `Bearer ${walletInfo.address}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
        console.log('👥 Loaded', data.users?.length || 0, 'users')
      } else {
        console.error('Failed to load users:', response.status)
      }
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortUsers = () => {
    let filtered = users

    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = users.filter(user =>
        user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort users
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'reputation':
          return b.reputationScore - a.reputationScore
        case 'name':
          return a.displayName.localeCompare(b.displayName)
        case 'newest':
        default:
          return 0 // Keep original order for newest
      }
    })

    setFilteredUsers(filtered)
  }

  const getAvatarUrl = (avatar: string) => {
    if (!avatar) return null
    if (avatar.startsWith('http')) return avatar
    if (avatar.startsWith('Qm') || avatar.startsWith('bafy')) {
      return `https://gateway.pinata.cloud/ipfs/${avatar}`
    }
    return avatar
  }

  const handleConnectionChange = () => {
    loadUsers()
  }

  const UserCard = ({ user }: { user: User }) => (
    <Card hover className="h-full">
      <CardContent className="p-6">
        {/* Avatar & Basic Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden flex-shrink-0">
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
            {user.profileCreatedOnBlockchain && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Verified className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {user.displayName}
              </h3>
              {user.reputationScore >= 200 && (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate">
              {user.walletAddress.slice(0, 12)}...{user.walletAddress.slice(-8)}
            </p>
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">{user.reputationScore}</span>
              </div>
              <span className="text-sm text-gray-400">reputation</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {user.bio}
          </p>
        )}

        {/* Location */}
        {user.location && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-4">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{user.location}</span>
          </div>
        )}

        {/* Social Links */}
        <div className="flex items-center gap-3 mb-6">
          {user.website && (
            <a
              href={user.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 transition-colors"
            >
              <Globe className="w-4 h-4" />
            </a>
          )}
          {user.github && (
            <a
              href={user.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {user.linkedin && (
            <a
              href={user.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {user.twitter && (
            <a
              href={user.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Connect Button */}
        <ConnectButton
          targetUser={{
            walletAddress: user.walletAddress,
            displayName: user.displayName
          }}
          onConnectionChange={handleConnectionChange}
          className="w-full"
        />
      </CardContent>
    </Card>
  )

  const UserListItem = ({ user }: { user: User }) => (
    <Card hover>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
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
            {user.profileCreatedOnBlockchain && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Verified className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                {user.displayName}
              </h3>
              {user.reputationScore >= 200 && (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 truncate">
              {user.bio || `${user.walletAddress.slice(0, 12)}...${user.walletAddress.slice(-8)}`}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span>{user.reputationScore}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              {user.website && (
                <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
                  <Globe className="w-4 h-4" />
                </a>
              )}
              {user.github && (
                <a href={user.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>
            <ConnectButton
              targetUser={{
                walletAddress: user.walletAddress,
                displayName: user.displayName
              }}
              onConnectionChange={handleConnectionChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (!walletInfo) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Please connect your wallet to discover and connect with other users in the SkillChain community.
              </p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Find Talent
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover and connect with talented professionals in the SkillChain community
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, bio, location, or wallet address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Newest</option>
                  <option value="reputation">Reputation</option>
                  <option value="name">Name</option>
                </select>

                {/* View Mode */}
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-2 rounded-l-lg transition-colors',
                      viewMode === 'grid' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-2 rounded-r-lg transition-colors',
                      viewMode === 'list' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {searchTerm ? 'No users found' : 'No users available'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters' 
                  : 'Check back later for new members'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                Found {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>

            {/* Users Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredUsers.map((user) => (
                  <UserCard key={user.walletAddress} user={user} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <UserListItem key={user.walletAddress} user={user} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
} 