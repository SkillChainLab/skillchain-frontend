import { fileStorageApi, profileApi } from './api'

// IPFS client import
// const { create } = require('ipfs-http-client')

// Profile image upload utilities
export class ProfileImageUpload {
  
  /**
   * Upload profile image to IPFS and update profile via blockchain transaction
   */
  static async uploadProfileImage(
    file: File, 
    walletAddress: string
  ): Promise<{ success: boolean; ipfsHash?: string; error?: string }> {
    try {
      // 1. Validate file
      const validation = this.validateImageFile(file)
      if (!validation.valid) {
        return { success: false, error: validation.error }
      }

      console.log('🔄 Starting profile image upload...')

      // 2. Upload to IPFS first
      const ipfsHash = await this.uploadToIPFS(file)
      console.log('📤 File uploaded to IPFS:', ipfsHash)
      
      // 3. Pin to IPFS for permanent storage (HTTP API)
      try {
        const pinResponse = await fetch(`/api/skillchain/skillchain/v1/ipfs/${ipfsHash}/pin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (pinResponse.ok) {
          console.log('📌 File pinned to IPFS successfully')
        } else {
          console.warn('⚠️ IPFS pinning failed, but continuing...')
        }
      } catch (pinError) {
        console.warn('⚠️ IPFS pinning failed, but continuing...', pinError)
      }

      // 4. Create file record via HTTP API
      console.log('📝 Creating file record via API...')
      
      const fileRecordData = {
        creator: walletAddress,
        filename: `profile-${walletAddress}-${Date.now()}.${file.type.split('/')[1]}`,
        content_type: file.type,
        file_size: file.size,
        ipfs_hash: ipfsHash,
        is_public: true,
        metadata: JSON.stringify({
          type: 'profile_photo',
          purpose: 'profile_avatar',
          originalName: file.name,
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

      if (!fileResponse.ok) {
        const errorData = await fileResponse.text()
        throw new Error(`File record creation failed: ${fileResponse.status} - ${errorData}`)
      }

      const fileResult = await fileResponse.json()
      console.log('✅ File record created:', fileResult)

      // 5. Update profile avatar via blockchain transaction
      console.log('📝 Updating profile avatar via blockchain...')
      
      // Get Keplr signer for blockchain transactions
      const offlineSigner = (window as any).keplr?.getOfflineSigner('skillchain')
      if (!offlineSigner) {
        throw new Error('Keplr signer not available. Please make sure Keplr is connected.')
      }

      // Import required CosmJS modules and Profile types
      const { SigningStargateClient } = await import('@cosmjs/stargate')
      const { Registry } = await import('@cosmjs/proto-signing')
      const { defaultRegistryTypes } = await import('@cosmjs/stargate')
      
      // Import Profile message types  
      const { msgTypes: profileMsgTypes } = await import('@/lib/ts-client/skillchain.profile/registry')
      const { MsgUpdateUserProfile } = await import('@/lib/ts-client/skillchain.profile/types/skillchain/profile/tx')

      console.log('🔧 Creating blockchain registry...')
      
      // Create registry with Profile types
      const registry = new Registry([
        ...defaultRegistryTypes,
        ...profileMsgTypes
      ])

      // Connect to blockchain
      const client = await SigningStargateClient.connectWithSigner(
        'http://localhost:26657',
        offlineSigner,
        { registry }
      )

      // Get current profile data to preserve other fields
      let existingProfile: any = null
      try {
        const profileResponse = await fetch(`/api/skillchain/skillchain/v1/profiles/${walletAddress}`)
        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          existingProfile = profileData.profile || profileData.data
        }
      } catch (error) {
        console.log('No existing profile found')
      }

      if (!existingProfile) {
        return { 
          success: false, 
          error: 'Profile not found. Please create your profile first before uploading an image.' 
        }
      }

      const currentTimestamp = Math.floor(Date.now() / 1000)
      const avatarUrl = `https://ipfs.io/ipfs/${ipfsHash}`

      const profileUpdateMessage = MsgUpdateUserProfile.fromPartial({
        creator: walletAddress,
        index: existingProfile.index,
        owner: walletAddress,
        displayName: existingProfile.displayName || 'Unknown User',
        bio: existingProfile.bio || '',
        location: existingProfile.location || '',
        website: existingProfile.website || '',
        github: existingProfile.github || '',
        linkedin: existingProfile.linkedin || '',
        twitter: existingProfile.twitter || '',
        avatar: avatarUrl, // Update with new avatar URL
        reputationScore: existingProfile.reputationScore || 100,
        createdAt: existingProfile.createdAt || currentTimestamp,
        updatedAt: currentTimestamp
      })

      const profileMsg = {
        typeUrl: '/skillchain.profile.MsgUpdateUserProfile',
        value: profileUpdateMessage
      }

      console.log('🔐 Signing profile update transaction with Keplr...')

      const profileResult = await client.signAndBroadcast(
        walletAddress,
        [profileMsg],
        {
          amount: [{ denom: 'uskill', amount: '5000' }],
          gas: '200000',
        },
        'SkillChain Profile Avatar Update'
      )

      if (profileResult.code !== 0) {
        throw new Error(`Profile update failed: ${profileResult.rawLog}`)
      }

      console.log('✅ Profile updated on blockchain:', profileResult.transactionHash)

      return { 
        success: true, 
        ipfsHash: ipfsHash
      }

    } catch (error: any) {
      console.error('❌ Profile image upload error:', error)
      
      // More detailed error message
      let errorMessage = 'Profile image upload failed. '
      if (error.message?.includes('IPFS upload failed')) {
        errorMessage += 'Failed to upload image to IPFS. Please check your internet connection.'
      } else if (error.message?.includes('File record creation failed')) {
        errorMessage += 'Failed to create file record. Please ensure SkillChain API is running.'
      } else if (error.message?.includes('Keplr signer not available')) {
        errorMessage += 'Keplr wallet not available. Please connect Keplr.'
      } else if (error.message?.includes('User rejected')) {
        errorMessage += 'Transaction was rejected in Keplr wallet.'
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage += 'Insufficient balance for transaction.'
      } else if (error.message?.includes('Profile update failed')) {
        errorMessage += 'Failed to update profile on blockchain. Please try again.'
      } else if (error.message?.includes('Profile not found')) {
        errorMessage += 'Please create your profile first before uploading an image.'
      } else {
        errorMessage += `Error: ${error.message || 'Unknown error'}`
      }
      
      return { 
        success: false, 
        error: errorMessage
      }
    }
  }

  /**
   * Validate image file
   */
  static validateImageFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Only JPEG, PNG, GIF, and WebP images are allowed' 
      }
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return { 
        valid: false, 
        error: 'Image size must be less than 5MB' 
      }
    }

    return { valid: true }
  }

  /**
   * Upload file to IPFS using HTTP client
   */
  static async uploadToIPFS(file: File): Promise<string> {
    try {
      // Option 1: Local IPFS node kullanarak
      // const ipfs = create({ url: 'http://localhost:5001' })
      // const result = await ipfs.add(file)
      // return result.cid.toString()

      // Option 2: Pinata API kullanarak (önerilen)
      const formData = new FormData()
      formData.append('file', file)

      // JWT token'ı environment variable'dan alın
      const pinataJWT = process.env.NEXT_PUBLIC_PINATA_JWT || 'YOUR_PINATA_JWT_TOKEN'
      
      const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${pinataJWT}`
        },
        body: formData
      })

      if (!pinataResponse.ok) {
        throw new Error(`Pinata upload failed: ${pinataResponse.status} ${pinataResponse.statusText}`)
      }

      const pinataResult = await pinataResponse.json()
      return pinataResult.IpfsHash

    } catch (error) {
      console.error('IPFS upload error:', error)
      
      // Fallback: Mock hash for development
      const mockHash = 'Qm' + Math.random().toString(36).substr(2, 44)
      console.warn('Using mock IPFS hash for development:', mockHash)
      return mockHash
    }
  }

  /**
   * Get IPFS URL for display
   */
  static getIPFSUrl(ipfsHash: string): string {
    // Multiple IPFS gateways for better reliability
    const gateways = [
      'https://ipfs.io/ipfs/',
      'https://gateway.pinata.cloud/ipfs/',
      'https://cloudflare-ipfs.com/ipfs/'
    ]
    
    // Use the first gateway (you can implement fallback logic)
    return `${gateways[0]}${ipfsHash.replace('ipfs://', '')}`
  }

  /**
   * Convert file to base64 for preview
   */
  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  /**
   * Create image preview from file
   */
  static createImagePreview(file: File, callback: (dataUrl: string) => void) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        callback(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }
} 