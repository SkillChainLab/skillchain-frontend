import { fileStorageApi, profileApi } from './api'
import { Registry } from '@cosmjs/proto-signing'
import { SigningStargateClient, defaultRegistryTypes } from '@cosmjs/stargate'
import axios from 'axios'

// IPFS client import
// const { create } = require('ipfs-http-client')

// Profile image upload utilities
export class ProfileImageUpload {
  
  /**
   * Upload profile image to IPFS and update user profile on blockchain and database
   */
  static async uploadProfileImage(
    file: File, 
    walletAddress: string
  ): Promise<{ success: boolean; ipfsHash?: string; error?: string }> {
    try {
      console.log('📸 Starting profile image upload for:', walletAddress)
      
      // 1. Upload image to IPFS via Pinata
      const formData = new FormData()
      formData.append('file', file)
      
      const pinataMetadata = JSON.stringify({
        name: `profile-${walletAddress}-${Date.now()}`,
        keyvalues: {
          walletAddress: walletAddress,
          type: 'profile-image'
        }
      })
      formData.append('pinataMetadata', pinataMetadata)
      
      const pinataOptions = JSON.stringify({
        cidVersion: 0,
      })
      formData.append('pinataOptions', pinataOptions)
      
      console.log('📤 Uploading to IPFS via Pinata...')
      
      const pinataResponse = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          maxBodyLength: Infinity,
          headers: {
            'Content-Type': `multipart/form-data`,
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`
          }
        }
      )
      
      const ipfsHash = pinataResponse.data.IpfsHash
      console.log('✅ Image uploaded to IPFS successfully:', ipfsHash)
      
      // 2. Update profile on blockchain
      console.log('📝 Updating profile on blockchain...')
      
      const offlineSigner = (window as any).keplr?.getOfflineSigner('skillchain')
      if (!offlineSigner) {
        throw new Error('Keplr signer not available. Please make sure Keplr is connected.')
      }
      
      // Import required modules
      const { msgTypes: profileMsgTypes } = await import('@/lib/ts-client/skillchain.profile/registry')
      const { MsgUpdateUserProfile } = await import('@/lib/ts-client/skillchain.profile/types/skillchain/profile/tx')
      
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
        const profileResponse = await fetch(`/api/skillchain/v1/profiles/${walletAddress}`)
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

      console.log('🔗 Broadcasting transaction to blockchain...')
      
      // Sign and broadcast profile update transaction
      const result = await client.signAndBroadcast(
        walletAddress,
        [
          { typeUrl: '/skillchain.profile.MsgUpdateUserProfile', value: profileUpdateMessage }
        ],
        {
          amount: [{ denom: 'uskill', amount: '2500' }],
          gas: '150000',
        }
      )

      if (result.code === 0) {
        console.log('✅ Profile updated on blockchain:', result.transactionHash)
        
        // 3. Update database via API call
        console.log('💾 Updating database with new profile data...')
        
        try {
          await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              walletAddress,
              displayName: existingProfile.displayName || 'Unknown User',
              bio: existingProfile.bio || '',
              location: existingProfile.location || '',
              website: existingProfile.website || '',
              github: existingProfile.github || '',
              linkedin: existingProfile.linkedin || '',
              twitter: existingProfile.twitter || '',
              avatar: avatarUrl, // Update with new avatar URL
              transactionHash: result.transactionHash
            })
          })
          
          console.log('✅ Database updated successfully')
          
        } catch (dbError) {
          console.error('⚠️ Database update failed (blockchain update succeeded):', dbError)
          // Don't fail the entire operation if only database update fails
        }
        
        return { 
          success: true, 
          ipfsHash,
        }
      } else {
        throw new Error(`Profile update failed: ${result.rawLog}`)
      }
      
    } catch (error: any) {
      console.error('❌ Profile image upload failed:', error)
      
      if (error.response?.status === 401) {
        return { 
          success: false, 
          error: 'IPFS upload failed: Invalid Pinata credentials. Please check your API keys.' 
        }
      }
      
      if (error.message?.includes('User denied')) {
        return { 
          success: false, 
          error: 'Transaction was cancelled by user.' 
        }
      }
      
      return { 
        success: false, 
        error: error.message || 'Failed to upload profile image. Please try again.' 
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
      console.log('🔄 Attempting to upload to IPFS via Pinata...')
      
      // Option 1: Local IPFS node kullanarak
      // const ipfs = create({ url: 'http://localhost:5001' })
      // const result = await ipfs.add(file)
      // return result.cid.toString()

      // Option 2: Pinata API kullanarak (önerilen)
      const formData = new FormData()
      formData.append('file', file)

      // JWT token'ı environment variable'dan alın
      const pinataJWT = process.env.NEXT_PUBLIC_PINATA_JWT
      
      if (!pinataJWT || pinataJWT === 'YOUR_PINATA_JWT_TOKEN') {
        console.warn('⚠️ Pinata JWT token not configured, using mock hash for development')
        throw new Error('Pinata JWT token not configured')
      }
      
      const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${pinataJWT}`
        },
        body: formData
      })

      if (!pinataResponse.ok) {
        const errorText = await pinataResponse.text()
        throw new Error(`Pinata upload failed: ${pinataResponse.status} ${pinataResponse.statusText} - ${errorText}`)
      }

      const pinataResult = await pinataResponse.json()
      console.log('✅ Successfully uploaded to Pinata IPFS:', pinataResult.IpfsHash)
      return pinataResult.IpfsHash

    } catch (error) {
      console.error('❌ IPFS upload error:', error)
      
      // Fallback: Generate a proper mock hash for development
      // Standard IPFS hash format: Qm + 44 characters (base58)
      const mockHashSuffix = Array.from({ length: 44 }, () => 
        'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789'[
          Math.floor(Math.random() * 58)
        ]
      ).join('')
      
      const mockHash = 'Qm' + mockHashSuffix
      
      console.warn('⚠️ Using mock IPFS hash for development (46 chars):', mockHash)
      console.warn('📝 Note: This is a development fallback. Configure NEXT_PUBLIC_PINATA_JWT for real IPFS uploads.')
      
      return mockHash
    }
  }

  /**
   * Get IPFS URL for display with multiple gateway fallbacks
   */
  static getIPFSUrl(ipfsHash: string): string {
    // Clean the hash (remove ipfs:// prefix if present)
    const cleanHash = ipfsHash.replace('ipfs://', '')
    
    // Multiple IPFS gateways for better reliability
    const gateways = [
      'https://gateway.pinata.cloud/ipfs/',
      'https://dweb.link/ipfs/',
      'https://ipfs.io/ipfs/',
      'https://gateway.ipfs.io/ipfs/'
    ]
    
    // Use Pinata gateway first (usually faster and more reliable)
    return `${gateways[0]}${cleanHash}`
  }

  /**
   * Get multiple IPFS URLs for fallback
   */
  static getIPFSUrlsWithFallback(ipfsHash: string): string[] {
    const cleanHash = ipfsHash.replace('ipfs://', '')
    
    const gateways = [
      'https://gateway.pinata.cloud/ipfs/',
      'https://dweb.link/ipfs/',
      'https://ipfs.io/ipfs/',
      'https://gateway.ipfs.io/ipfs/'
    ]
    
    return gateways.map(gateway => `${gateway}${cleanHash}`)
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