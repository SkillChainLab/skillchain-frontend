'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, MapPin, Star, Calendar, Briefcase, Users, MessageSquare, UserPlus, Share2, Edit, Camera, ExternalLink, Plus } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { useWallet } from '@/contexts/WalletContext'
import { profileApi } from '@/lib/api'
import { ProfileImageUpload } from '@/lib/profileImageUpload'

interface UserProfile {
  id: string
  address: string
  name: string
  title: string
  avatar?: string
  location: string
  joinedDate: string
  type: 'freelancer' | 'client'
  rating: number
  totalJobs: number
  totalEarned: number
  bio: string
  skills: string[]
  skillsDetailed?: any[] // Detailed skills from blockchain
  languages: string[]
  experience: Experience[]
  portfolio: PortfolioItem[]
  socialLinks: SocialLinks
  connections: number
  posts: number
  isConnected: boolean
  isOwnProfile: boolean
}

interface Experience {
  id: string
  title: string
  company: string
  duration: string
  description: string
  technologies?: string[]
}

interface PortfolioItem {
  id: string
  title: string
  description: string
  image: string
  url?: string
  technologies: string[]
  budget?: number
}

interface SocialLinks {
  website?: string
  linkedin?: string
  github?: string
  twitter?: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'experience' | 'posts'>('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [showSkillForm, setShowSkillForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profileIndex, setProfileIndex] = useState<string>('')
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const { walletInfo } = useWallet()

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    displayName: '',
    bio: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    twitter: ''
  })

  // Avatar upload state for profile creation
  const [profileAvatarFile, setProfileAvatarFile] = useState<File | null>(null)
  const [profileAvatarPreview, setProfileAvatarPreview] = useState<string | null>(null)

  // Skill form state
  const [skillForm, setSkillForm] = useState({
    skill_name: '',
    proficiency: 'intermediate',
    experience: ''
  })

  // Load user profile on wallet connection
  useEffect(() => {
    if (walletInfo) {
      loadUserProfile()
    }
  }, [walletInfo])

  // Debug avatar values
  useEffect(() => {
    if (user?.avatar) {
      console.log('🖼️ Avatar raw value:', user.avatar)
      console.log('🌐 Avatar processed URL:', getAvatarUrl(user.avatar))
    }
  }, [user?.avatar])

  const loadUserProfile = async () => {
    if (!walletInfo) return
    
    try {
      setIsLoading(true)
      
      console.log('Querying blockchain for profile data...')
      
      // Query profile from blockchain using gRPC-web or REST API
      try {
        const response = await fetch(`/api/skillchain/skillchain/v1/profiles/${walletInfo.address}`)
        
        if (response.ok) {
          const profileData = await response.json()
          console.log('Profile data from blockchain:', profileData)
          
          // Convert blockchain data to UserProfile format
          if (profileData.profile || profileData.data) {
            const profile = profileData.profile || profileData.data
            
            // Store profile index for updates
            setProfileIndex(profile.index || `profile-${walletInfo.address.slice(-8)}`)
            
            // Also fetch user skills
            let userSkills: string[] = []
            let userSkillsDetailed: any[] = []
            try {
              const skillsResponse = await fetch(`/api/skillchain/skillchain/v1/profiles/${walletInfo.address}/skills`)
              if (skillsResponse.ok) {
                const skillsData = await skillsResponse.json()
                console.log('Skills data from blockchain:', skillsData)
                
                // Extract skill names and detailed info from the response
                if (skillsData.skills && Array.isArray(skillsData.skills)) {
                  userSkills = skillsData.skills.map((skill: any) => skill.skillName || 'Unknown Skill')
                  userSkillsDetailed = skillsData.skills
                  console.log('Parsed skills:', userSkills)
                  console.log('Detailed skills:', userSkillsDetailed)
                }
              } else {
                console.log('No skills found or error fetching skills')
              }
            } catch (skillsError) {
              console.log('Error fetching skills:', skillsError)
            }
            
            setUser({
              id: profile.creator || walletInfo.address,
              address: profile.creator || walletInfo.address,
              name: profile.displayName || profile.name || profile.display_name || 'Unknown User',
              title: profile.bio || profile.description || 'SkillChain User',
              avatar: profile.avatar || undefined,
              location: profile.location || '',
              joinedDate: profile.created_at || new Date().toISOString(),
              type: 'freelancer',
              rating: profile.reputationScore ? profile.reputationScore / 100 : profile.reputation_score ? profile.reputation_score / 100 : 5.0,
              totalJobs: 0,
              totalEarned: 0,
              bio: profile.bio || profile.description || '',
              skills: userSkills, // Use skills from blockchain
              skillsDetailed: userSkillsDetailed,
              languages: ['English'],
              experience: [],
              portfolio: [],
              socialLinks: {
                website: profile.website || undefined,
                linkedin: profile.linkedin || undefined,
                github: profile.github || undefined,
                twitter: profile.twitter || undefined
              },
              connections: 0,
              posts: 0,
              isConnected: false,
              isOwnProfile: true
            })
          } else {
            console.log('No profile found on blockchain')
            setUser(null)
          }
        } else if (response.status === 404) {
          console.log('Profile not found - user has not created profile yet')
          setUser(null)
        } else {
          console.log('Error querying profile:', response.status, response.statusText)
          setUser(null)
        }
      } catch (queryError) {
        console.log('Error querying profile from blockchain:', queryError)
        setUser(null)
      }
      
    } catch (error) {
      console.error('Failed to load profile:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!walletInfo) return

    try {
      setIsLoading(true)
      
      const isUpdate = user && profileIndex
      console.log(isUpdate ? 'Updating profile with blockchain transaction...' : 'Creating profile with blockchain transaction...')
      
      // 1. If avatar file selected, upload to IPFS first
      let avatarUrl = ''
      if (profileAvatarFile && !isUpdate) {
        console.log('📤 Uploading avatar to IPFS first...')
        
        try {
          const ipfsHash = await ProfileImageUpload.uploadToIPFS(profileAvatarFile)
          avatarUrl = `https://ipfs.io/ipfs/${ipfsHash}`
          console.log('✅ Avatar uploaded to IPFS:', avatarUrl)
          
          // Also create file record for avatar
          const fileRecordData = {
            creator: walletInfo.address,
            filename: `profile-${walletInfo.address}-${Date.now()}.${profileAvatarFile.type.split('/')[1]}`,
            content_type: profileAvatarFile.type,
            file_size: profileAvatarFile.size,
            ipfs_hash: ipfsHash,
            is_public: true,
            metadata: JSON.stringify({
              type: 'profile_photo',
              purpose: 'profile_avatar',
              originalName: profileAvatarFile.name,
              uploadedAt: new Date().toISOString()
            })
          }

          const fileResponse = await fetch('/api/skillchain/skillchain/v1/files', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(fileRecordData)
          })

          if (fileResponse.ok) {
            console.log('✅ File record created for avatar')
          } else {
            console.warn('⚠️ File record creation failed, but continuing...')
          }
        } catch (avatarError) {
          console.warn('⚠️ Avatar upload failed, creating profile without avatar:', avatarError)
          avatarUrl = '' // Continue without avatar
        }
      }
      
      // 2. Get signer from Keplr
      const offlineSigner = (window as any).keplr?.getOfflineSigner('skillchain')
      if (!offlineSigner) {
        throw new Error('Keplr signer not available. Please make sure Keplr is connected.')
      }
      
      // 3. Import required CosmJS modules and generated proto types
      const { SigningStargateClient } = await import('@cosmjs/stargate')
      const { Registry } = await import('@cosmjs/proto-signing')
      const { defaultRegistryTypes } = await import('@cosmjs/stargate')
      
      // Import SkillChain message types from generated proto files
      const { msgTypes } = await import('@/lib/ts-client/skillchain.profile/registry')
      const { MsgCreateUserProfile, MsgUpdateUserProfile } = await import('@/lib/ts-client/skillchain.profile/types/skillchain/profile/tx')
      
      console.log('Creating protobuf registry with SkillChain message types...')
      
      // Create registry with default Cosmos types + SkillChain types
      const registry = new Registry([
        ...defaultRegistryTypes,
        ...msgTypes
      ])
      
      console.log('Connecting to SkillChain with protobuf registry...')
      
      // Connect with protobuf registry
      const client = await SigningStargateClient.connectWithSigner(
        'http://localhost:26657',
        offlineSigner,
        { 
          registry
        }
      )
      
      console.log(isUpdate ? 'Creating user profile update message...' : 'Creating user profile message...')
      
      const currentTimestamp = Math.floor(Date.now() / 1000) // Unix timestamp
      let msg: any
      
      if (isUpdate) {
        // Update existing profile
        const messageValue = MsgUpdateUserProfile.fromPartial({
          creator: walletInfo.address,
          index: profileIndex,
          owner: walletInfo.address,
          displayName: profileForm.displayName,
          bio: profileForm.bio,
          location: profileForm.location,
          website: profileForm.website,
          github: profileForm.github,
          linkedin: profileForm.linkedin,
          twitter: profileForm.twitter,
          avatar: user?.avatar || '', // Keep existing avatar or empty
          reputationScore: user?.rating ? Math.floor(user.rating * 100) : 100, // Keep existing reputation
          createdAt: user?.joinedDate ? Math.floor(new Date(user.joinedDate).getTime() / 1000) : currentTimestamp,
          updatedAt: currentTimestamp
        })
        
        msg = {
          typeUrl: '/skillchain.profile.MsgUpdateUserProfile',
          value: messageValue
        }
      } else {
        // Create new profile
        const profileIndex = `profile-${Date.now()}-${walletInfo.address.slice(-8)}`
        setProfileIndex(profileIndex) // Store for future updates
        
        const messageValue = MsgCreateUserProfile.fromPartial({
          creator: walletInfo.address,
          index: profileIndex,
          owner: walletInfo.address,
          displayName: profileForm.displayName,
          bio: profileForm.bio,
          location: profileForm.location,
          website: profileForm.website,
          github: profileForm.github,
          linkedin: profileForm.linkedin,
          twitter: profileForm.twitter,
          avatar: avatarUrl, // Use uploaded avatar URL or empty string
          reputationScore: 100, // Starting reputation score
          createdAt: currentTimestamp,
          updatedAt: currentTimestamp
        })
        
        msg = {
          typeUrl: '/skillchain.profile.MsgCreateUserProfile',
          value: messageValue
        }
      }
      
      console.log('Message to sign:', msg)
      
      const fee = {
        amount: [{ denom: 'uskill', amount: '5000' }],
        gas: '200000',
      }
      
      console.log('Signing with Keplr...')
      const result = await client.signAndBroadcast(
        walletInfo.address,
        [msg],
        fee,
        isUpdate ? 'SkillChain Profile Update' : 'SkillChain Profile Creation'
      )
      
      console.log('Transaction result:', result)
      
      if (result.code === 0) {
        alert(`✅ Profile ${isUpdate ? 'updated' : 'created'} successfully! 
        
🔗 Transaction Hash: ${result.transactionHash}
👤 Display Name: ${profileForm.displayName}
📍 Location: ${profileForm.location}
${avatarUrl ? '🖼️ Avatar: Uploaded to IPFS' : ''}
⛽ Gas Used: ${result.gasUsed}

Your profile is now on the blockchain!`)
        
        // Update user state with form data
        setUser(prev => ({
          id: walletInfo.address,
          address: walletInfo.address,
          name: profileForm.displayName || 'SkillChain User',
          title: profileForm.bio || 'SkillChain Professional',
          avatar: avatarUrl || prev?.avatar, // Use new avatar or keep existing
          location: profileForm.location || '',
          joinedDate: prev?.joinedDate || new Date().toISOString(),
          type: 'freelancer',
          rating: prev?.rating || 5.0,
          totalJobs: prev?.totalJobs || 0,
          totalEarned: prev?.totalEarned || 0,
          bio: profileForm.bio || '',
          skills: prev?.skills || [],
          skillsDetailed: prev?.skillsDetailed || [],
          languages: ['English'],
          experience: prev?.experience || [],
          portfolio: prev?.portfolio || [],
          socialLinks: {
            website: profileForm.website || undefined,
            linkedin: profileForm.linkedin || undefined,
            github: profileForm.github || undefined,
            twitter: profileForm.twitter || undefined
          },
          connections: prev?.connections || 0,
          posts: prev?.posts || 0,
          isConnected: false,
          isOwnProfile: true
        }))
        
        setIsEditing(false)
        // Reset form
        setProfileForm({
          displayName: '',
          bio: '',
          location: '',
          website: '',
          github: '',
          linkedin: '',
          twitter: ''
        })
        // Reset avatar states
        setProfileAvatarFile(null)
        setProfileAvatarPreview(null)
        
        // Also try to load from blockchain in background (for future updates)
        setTimeout(() => {
          loadUserProfile()
        }, 3000)
      } else {
        throw new Error(`Transaction failed: ${result.rawLog}`)
      }
      
    } catch (error: any) {
      console.error(`Failed to ${user ? 'update' : 'create'} profile:`, error)
      
      // More detailed error message
      let errorMessage = `Profile ${user ? 'update' : 'creation'} failed. `
      if (error.message?.includes('User rejected')) {
        errorMessage += 'Transaction was rejected in Keplr wallet.'
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage += 'Insufficient balance for transaction.'
      } else if (error.message?.includes('connection')) {
        errorMessage += 'Could not connect to SkillChain blockchain. Please ensure it is running on localhost:26657.'
      } else {
        errorMessage += `Error: ${error.message || 'Unknown error'}`
      }
      
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!walletInfo) return

    try {
      setIsLoading(true)
      
      console.log('Creating skill with blockchain transaction...')
      
      // Get signer from Keplr
      const offlineSigner = (window as any).keplr?.getOfflineSigner('skillchain')
      if (!offlineSigner) {
        throw new Error('Keplr signer not available. Please make sure Keplr is connected.')
      }
      
      // Import required CosmJS modules and generated proto types
      const { SigningStargateClient } = await import('@cosmjs/stargate')
      const { Registry } = await import('@cosmjs/proto-signing')
      const { defaultRegistryTypes } = await import('@cosmjs/stargate')
      
      // Import SkillChain message types from generated proto files
      const { msgTypes } = await import('@/lib/ts-client/skillchain.profile/registry')
      const { MsgCreateUserSkill } = await import('@/lib/ts-client/skillchain.profile/types/skillchain/profile/tx')
      
      console.log('Creating protobuf registry with SkillChain message types...')
      
      // Create registry with default Cosmos types + SkillChain types
      const registry = new Registry([
        ...defaultRegistryTypes,
        ...msgTypes
      ])
      
      console.log('Connecting to SkillChain with protobuf registry...')
      
      // Connect with protobuf registry
      const client = await SigningStargateClient.connectWithSigner(
        'http://localhost:26657',
        offlineSigner,
        { 
          registry
        }
      )
      
      console.log('Creating user skill message...')
      
      // Generate unique index for the skill (using timestamp + skill name hash)
      const skillIndex = `skill-${Date.now()}-${skillForm.skill_name.toLowerCase().replace(/\s+/g, '-')}`
      const currentTimestamp = Math.floor(Date.now() / 1000) // Unix timestamp
      
      // Create message value using the proper protobuf message structure
      const messageValue = MsgCreateUserSkill.fromPartial({
        creator: walletInfo.address,
        index: skillIndex,
        owner: walletInfo.address,
        skillName: skillForm.skill_name,
        proficiencyLevel: skillForm.proficiency,
        yearsExperience: parseInt(skillForm.experience) || 0,
        verified: false, // Initially not verified
        verifiedBy: '', // No verifier initially
        verificationDate: 0, // No verification date initially
        endorsementCount: 0 // No endorsements initially
      })
      
      const msg = {
        typeUrl: '/skillchain.profile.MsgCreateUserSkill',
        value: messageValue
      }
      
      console.log('Message to sign:', msg)
      
      const fee = {
        amount: [{ denom: 'uskill', amount: '5000' }],
        gas: '200000',
      }
      
      console.log('Signing with Keplr...')
      const result = await client.signAndBroadcast(
        walletInfo.address,
        [msg],
        fee,
        'SkillChain Skill Addition'
      )
      
      console.log('Transaction result:', result)
      
      if (result.code === 0) {
        alert(`✅ Skill added successfully! 
        
🔗 Transaction Hash: ${result.transactionHash}
🎯 Skill: ${skillForm.skill_name}
📊 Proficiency: ${skillForm.proficiency}
📅 Experience: ${skillForm.experience} years
⛽ Gas Used: ${result.gasUsed}

Your skill is now on the blockchain!`)
        
        // Update user skills in state
        if (user) {
          setUser(prev => prev ? ({
            ...prev,
            skills: [...prev.skills, skillForm.skill_name],
            skillsDetailed: [...prev.skillsDetailed || [], user.skillsDetailed?.find(s => s.skillName === skillForm.skill_name) || {}]
          }) : null)
        }
        
        setSkillForm({ skill_name: '', proficiency: 'intermediate', experience: '' })
        setShowSkillForm(false)
        
        // Reload profile data to get updated skills from blockchain
        setTimeout(() => {
          loadUserProfile()
        }, 2000)
      } else {
        throw new Error(`Transaction failed: ${result.rawLog}`)
      }
      
    } catch (error: any) {
      console.error('Failed to add skill:', error)
      
      // More detailed error message
      let errorMessage = 'Skill addition failed. '
      if (error.message?.includes('User rejected')) {
        errorMessage += 'Transaction was rejected in Keplr wallet.'
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage += 'Insufficient balance for transaction.'
      } else if (error.message?.includes('connection')) {
        errorMessage += 'Could not connect to SkillChain blockchain. Please ensure it is running on localhost:26657.'
      } else {
        errorMessage += `Error: ${error.message || 'Unknown error'}`
      }
      
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = () => {
    if (!user) return
    setUser(prev => prev ? ({ 
      ...prev, 
      isConnected: !prev.isConnected, 
      connections: prev.isConnected ? prev.connections - 1 : prev.connections + 1 
    }) : null)
  }

  // Profile image upload handler
  const handleImageUpload = async (file: File) => {
    if (!walletInfo) {
      setUploadError('Please connect your Keplr wallet first')
      return
    }

    setIsUploadingImage(true)
    setUploadError('')
    
    try {
      console.log('🔄 Starting profile image upload...')
      
      // Check if Keplr is available
      if (!(window as any).keplr) {
        throw new Error('Keplr wallet not found. Please install and setup Keplr wallet.')
      }

      // Request account access
      await (window as any).keplr.enable('skillchain')
      
      const result = await ProfileImageUpload.uploadProfileImage(file, walletInfo.address)
      
      if (result.success) {
        if (result.ipfsHash) {
          const newAvatarUrl = ProfileImageUpload.getIPFSUrl(result.ipfsHash)
          setUser(prev => prev ? {
            ...prev,
            avatar: newAvatarUrl
          } : null)
          console.log('✅ Profile image uploaded successfully!')
          
          // Show success message
          alert('Profile image uploaded successfully to blockchain!')
          
          // Refresh profile data
          await loadUserProfile()
        }
      } else {
        setUploadError(result.error || 'Upload failed')
        console.error('❌ Upload failed:', result.error)
      }
    } catch (error: any) {
      console.error('❌ Profile image upload error:', error)
      
      let errorMessage = 'Profile image upload failed. '
      if (error.message?.includes('User rejected')) {
        errorMessage += 'Transaction was rejected in Keplr wallet.'
      } else if (error.message?.includes('not found')) {
        errorMessage += 'Please install and setup Keplr wallet.'
      } else if (error.message?.includes('enable')) {
        errorMessage += 'Please allow access to SkillChain in Keplr wallet.'
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage += 'Network error. Please check your connection and try again.'
      } else if (error.message?.includes('API')) {
        errorMessage += 'API error. Please ensure SkillChain API is running.'
      } else {
        errorMessage += `Error: ${error.message || 'Unknown error'}`
      }
      
      setUploadError(errorMessage)
    } finally {
      setIsUploadingImage(false)
    }
  }

  // Avatar display URL helper
  const getAvatarUrl = (avatar?: string): string | null => {
    if (!avatar) return null
    
    // If already a full URL, return as is
    if (avatar.startsWith('http')) {
      return avatar
    }
    
    // If IPFS protocol URL, convert to gateway URL
    if (avatar.startsWith('ipfs://')) {
      return ProfileImageUpload.getIPFSUrl(avatar.replace('ipfs://', ''))
    }
    
    // If just IPFS hash (Qm... format), convert to gateway URL
    if (avatar.startsWith('Qm') || avatar.startsWith('bafy')) {
      return ProfileImageUpload.getIPFSUrl(avatar)
    }
    
    // Otherwise return as is (might be relative URL or other format)
    return avatar
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
            <span className="text-lg font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/marketplace" className="text-gray-300 hover:text-white transition-colors">Marketplace</Link>
            <Link href="/convert" className="text-gray-300 hover:text-white transition-colors">Convert</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 relative z-10 container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Empty State - No Wallet Connected */}
          {!walletInfo && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center text-white">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <Users className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold mb-6">Connect Your Wallet</h2>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                Connect your Keplr wallet to view and manage your SkillChain profile
              </p>
              <p className="text-blue-400 text-lg">
                Please use the "Connect Wallet" button in the navigation above
              </p>
            </div>
          )}

          {/* Empty State - No Profile Created */}
          {walletInfo && !user && !isEditing && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center text-white">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <UserPlus className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold mb-6">Create Your Profile</h2>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                You haven't created a profile yet. Create your SkillChain profile to start connecting with other professionals and showcase your skills.
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
              >
                Create Profile on Blockchain
              </button>
            </div>
          )}

          {/* Profile Creation Form for new users */}
          {isEditing && walletInfo && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white mb-8">
              <h3 className="text-2xl font-bold mb-6">
                {user?.name ? 'Edit Profile' : 'Create Your Profile'}
              </h3>
              <form onSubmit={handleCreateProfile} className="space-y-6">
                {/* Avatar Upload Section - Only for new profiles */}
                {!user && (
                  <div className="mb-6">
                    <label className="block text-gray-300 mb-3">Profile Avatar (Optional)</label>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold overflow-hidden">
                          {profileAvatarPreview ? (
                            <img 
                              src={profileAvatarPreview} 
                              alt="Avatar preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            profileForm.displayName?.[0] || '?'
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              // Validate file
                              const validation = ProfileImageUpload.validateImageFile(file)
                              if (!validation.valid) {
                                alert(validation.error)
                                return
                              }
                              
                              setProfileAvatarFile(file)
                              
                              // Create preview
                              const reader = new FileReader()
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setProfileAvatarPreview(event.target.result as string)
                                }
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                          style={{ display: 'none' }}
                          id="profile-avatar-upload"
                        />
                        <label
                          htmlFor="profile-avatar-upload"
                          className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 p-2 rounded-full transition-colors cursor-pointer"
                        >
                          <Camera className="w-3 h-3 text-white" />
                        </label>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-400 mb-2">
                          Upload a profile photo (optional). You can also add one later.
                        </p>
                        <p className="text-xs text-gray-500">
                          Supported: JPEG, PNG, GIF, WebP. Max size: 5MB
                        </p>
                        {profileAvatarFile && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-sm text-green-400">✓ {profileAvatarFile.name}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setProfileAvatarFile(null)
                                setProfileAvatarPreview(null)
                              }}
                              className="text-red-400 hover:text-red-300 text-sm underline"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Display Name</label>
                    <input
                      type="text"
                      value={profileForm.displayName}
                      onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="Your display name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Location</label>
                    <input
                      type="text"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Bio</label>
                  <textarea
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 h-32 resize-none"
                    placeholder="Tell others about yourself and your expertise..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Website</label>
                    <input
                      type="url"
                      value={profileForm.website}
                      onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">GitHub</label>
                    <input
                      type="url"
                      value={profileForm.github}
                      onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">LinkedIn</label>
                    <input
                      type="url"
                      value={profileForm.linkedin}
                      onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Twitter</label>
                    <input
                      type="url"
                      value={profileForm.twitter}
                      onChange={(e) => setProfileForm({ ...profileForm, twitter: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 py-3 rounded-xl font-semibold transition-all"
                  >
                    {isLoading ? (user?.name ? 'Updating Profile...' : 'Creating Profile...') : (user?.name ? 'Update Profile on Blockchain' : 'Create Profile on Blockchain')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Skill Addition Form */}
          {showSkillForm && walletInfo && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white mb-8">
              <h3 className="text-2xl font-bold mb-6">Add New Skill</h3>
              <form onSubmit={handleAddSkill} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Skill Name</label>
                    <input
                      type="text"
                      value={skillForm.skill_name}
                      onChange={(e) => setSkillForm({ ...skillForm, skill_name: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="e.g. React, Python, Blockchain"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Proficiency Level</label>
                    <select
                      value={skillForm.proficiency}
                      onChange={(e) => setSkillForm({ ...skillForm, proficiency: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Years of Experience</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={skillForm.experience}
                      onChange={(e) => setSkillForm({ ...skillForm, experience: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="e.g. 3"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 py-3 rounded-xl font-semibold transition-all"
                  >
                    {isLoading ? 'Adding...' : 'Add Skill'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSkillForm(false)}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Upload Error Message */}
          {uploadError && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl mb-6">
              <p className="text-sm">⚠️ Image upload failed: {uploadError}</p>
              <button 
                onClick={() => setUploadError(null)}
                className="text-red-300 hover:text-red-100 text-xs mt-1 underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Upload Loading Message */}
          {isUploadingImage && (
            <div className="bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-3 rounded-2xl mb-6">
              <p className="text-sm">📤 Uploading profile image to IPFS...</p>
            </div>
          )}

          {/* Profile Header */}
          {user && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white mb-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Side - Avatar & Basic Info */}
                <div className="flex flex-col items-center lg:items-start">
                  {/* Profile Image */}
                  <div className="relative">
                    <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl lg:text-3xl font-bold">
                      {user?.avatar ? (
                        <>
                          <img 
                            src={getAvatarUrl(user.avatar) || undefined} 
                            alt={user.name}
                            className="w-full h-full rounded-full object-cover"
                            onLoad={() => console.log('✅ Avatar loaded:', getAvatarUrl(user.avatar))}
                            onError={(e) => {
                              console.log('❌ Avatar image failed to load:', getAvatarUrl(user.avatar))
                              const target = e.currentTarget as HTMLImageElement
                              target.style.display = 'none'
                              const fallback = target.parentElement?.querySelector('.fallback-avatar') as HTMLElement
                              if (fallback) {
                                fallback.style.display = 'flex'
                              }
                            }}
                          />
                          <div className="fallback-avatar" style={{ display: 'none' }}>
                            {user.name[0]}
                          </div>
                        </>
                      ) : (
                        user?.name[0]
                      )}
                    </div>
                    {user?.isOwnProfile && (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              handleImageUpload(e.target.files[0])
                            }
                          }}
                          style={{ display: 'none' }}
                          id="profile-image-upload"
                          disabled={isUploadingImage}
                        />
                        <label
                          htmlFor="profile-image-upload"
                          className={`absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 p-2 rounded-full transition-colors cursor-pointer ${
                            isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <Camera className="w-4 h-4 text-white" />
                        </label>
                        {isUploadingImage && (
                          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Upload Error Display */}
                  {uploadError && (
                    <div className="w-full max-w-md bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-400 text-sm">
                      {uploadError}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 text-center lg:text-left">
                    <div>
                      <div className="text-2xl font-bold text-blue-400">{user?.connections}</div>
                      <div className="text-gray-400 text-sm">Connections</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">{user?.totalJobs}</div>
                      <div className="text-gray-400 text-sm">Projects</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-400">{user?.posts}</div>
                      <div className="text-gray-400 text-sm">Posts</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 mt-6 w-full lg:w-auto">
                    {user?.isOwnProfile ? (
                      <>
                      <button
                        onClick={() => {
                          // Populate form with existing profile data
                          if (user) {
                            setProfileForm({
                              displayName: user.name || '',
                              bio: user.bio || '',
                              location: user.location || '',
                              website: user.socialLinks.website || '',
                              github: user.socialLinks.github || '',
                              linkedin: user.socialLinks.linkedin || '',
                              twitter: user.socialLinks.twitter || ''
                            })
                          }
                          setIsEditing(true)
                        }}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-semibold transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Profile
                      </button>
                        <button
                          onClick={() => setShowSkillForm(true)}
                          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Skill
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleConnect}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                            user?.isConnected 
                              ? 'bg-gray-600 hover:bg-gray-700' 
                              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                          }`}
                        >
                          <UserPlus className="w-4 h-4" />
                          {user?.isConnected ? 'Connected' : 'Connect'}
                        </button>
                        <button className="flex items-center gap-2 border border-gray-500 hover:bg-white/10 px-6 py-3 rounded-xl font-semibold transition-colors">
                          <MessageSquare className="w-4 h-4" />
                          Message
                        </button>
                      </>
                    )}
                    <button className="flex items-center gap-2 border border-gray-500 hover:bg-white/10 px-6 py-3 rounded-xl font-semibold transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share Profile
                    </button>
                  </div>
                </div>

                {/* Right Side - Profile Info */}
                <div className="flex-1">
                  <div className="mb-4">
                    <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
                    <p className="text-xl text-blue-400 mb-3">{user?.title}</p>
                    <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {user?.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Joined {user?.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : 'Unknown'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        {user?.rating} rating
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-300 leading-relaxed mb-6">{user?.bio}</p>

                  {/* Social Links */}
                  <div className="flex gap-4 mb-6">
                    {user?.socialLinks.website && (
                      <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                    {user?.socialLinks.linkedin && (
                      <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                        <Users className="w-5 h-5" />
                      </a>
                    )}
                    {user?.socialLinks.github && (
                      <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {user?.skillsDetailed && user.skillsDetailed.length > 0 ? (
                        user.skillsDetailed.map((skill, index) => (
                          <div
                            key={skill.index || index}
                            className="bg-blue-500/20 text-blue-400 px-3 py-2 rounded-full text-sm font-medium border border-blue-400/30"
                          >
                            <div className="flex flex-col items-center">
                              <span className="font-semibold">{skill.skillName}</span>
                              <span className="text-xs text-blue-300 capitalize">{skill.proficiencyLevel}</span>
                              {skill.yearsExperience > 0 && (
                                <span className="text-xs text-blue-300">{skill.yearsExperience}y exp</span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : user?.skills && user.skills.length > 0 ? (
                        user.skills.map((skill: string) => (
                          <span
                            key={skill}
                            className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">No skills added yet</span>
                      )}
                      {user?.isOwnProfile && (
                        <button 
                          onClick={() => setShowSkillForm(true)}
                          className="bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add Skill
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          {user && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-2 mb-8">
              <div className="flex gap-2">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'portfolio', label: 'Portfolio' },
                  { id: 'experience', label: 'Experience' },
                  { id: 'posts', label: 'Posts' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-3 px-4 rounded-2xl font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content */}
          {user && (
            <div className="space-y-8">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Activity */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white">
                    <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">Completed project: DeFi Trading Platform</p>
                          <p className="text-gray-400 text-sm">2 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">Connected with 5 new professionals</p>
                          <p className="text-gray-400 text-sm">1 week ago</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white">
                    <h3 className="text-2xl font-bold mb-6">Languages</h3>
                    <div className="space-y-3">
                      {user?.languages.map(language => (
                        <div key={language} className="flex justify-between items-center">
                          <span className="font-medium">{language}</span>
                          <span className="text-gray-400">Fluent</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'portfolio' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {user?.portfolio.map(item => (
                    <div key={item.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white group hover:bg-white/10 transition-colors">
                      <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mb-4 flex items-center justify-center">
                        <Briefcase className="w-12 h-12 text-blue-400" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-gray-300 mb-4">{item.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.technologies.map(tech => (
                          <span key={tech} className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-400 font-semibold">${item.budget?.toLocaleString()}</span>
                        {item.url && (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                  {user?.isOwnProfile && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white border-dashed border-white/30 flex flex-col items-center justify-center min-h-[300px] hover:bg-white/10 transition-colors cursor-pointer">
                      <Plus className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-400 font-semibold">Add Portfolio Item</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="space-y-6">
                  {user?.experience.map(exp => (
                    <div key={exp.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold mb-1">{exp.title}</h4>
                          <p className="text-blue-400 font-semibold mb-2">{exp.company}</p>
                          <p className="text-gray-400 mb-4">{exp.duration}</p>
                          <p className="text-gray-300 leading-relaxed mb-4">{exp.description}</p>
                          {exp.technologies && (
                            <div className="flex flex-wrap gap-2">
                              {exp.technologies.map(tech => (
                                <span key={tech} className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {user?.isOwnProfile && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white border-dashed border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                      <Plus className="w-6 h-6 text-gray-400 mr-2" />
                      <span className="text-gray-400 font-semibold">Add Experience</span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'posts' && (
                <div className="space-y-6">
                  {/* Create Post Section */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold">Your Posts</h3>
                      <Link
                        href="/social"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-2 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        New Post
                      </Link>
                    </div>
                    
                    {/* Sample Posts */}
                    <div className="space-y-6">
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                        <div className="mb-4">
                          <p className="text-gray-300 leading-relaxed">
                            🚀 Just completed an amazing DeFi project on SkillChain! The power of blockchain-based freelancing is incredible. Smart contracts ensure fair payment and the VUSD economy makes international transactions seamless.
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-white/10">
                          <span>2 days ago</span>
                          <div className="flex gap-4">
                            <span>24 likes</span>
                            <span>8 comments</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                        <div className="mb-4">
                          <p className="text-gray-300 leading-relaxed">
                            Looking forward to connecting with more talented developers in the SkillChain ecosystem. The future of freelancing is decentralized! 💼
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-white/10">
                          <span>1 week ago</span>
                          <div className="flex gap-4">
                            <span>18 likes</span>
                            <span>12 comments</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center mt-8">
                      <Link
                        href="/social"
                        className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                      >
                        View All Posts & Social Feed →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
} 