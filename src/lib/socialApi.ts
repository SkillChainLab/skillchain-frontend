// Social API for handling friendships, connections, and messaging
// Uses MongoDB Atlas for efficient social data management

export interface UserConnection {
  id: string
  fromUser: string // wallet address
  toUser: string // wallet address
  status: 'pending' | 'accepted' | 'blocked'
  createdAt: string
  updatedAt: string
  mutualConnections?: number
}

export interface Message {
  id: string
  conversationId: string
  senderId: string // wallet address
  recipientId: string // wallet address
  content: string
  type: 'text' | 'image' | 'file'
  attachments?: MessageAttachment[]
  timestamp: string
  isRead: boolean
  isEdited: boolean
  editedAt?: string
}

export interface MessageAttachment {
  id: string
  filename: string
  contentType: string
  size: number
  url: string
}

export interface Conversation {
  id: string
  participants: string[] // wallet addresses
  lastMessage?: Message
  lastActivity: string
  isActive: boolean
  metadata?: {
    projectId?: string
    projectTitle?: string
    projectBudget?: number
  }
}

export interface SocialProfile {
  walletAddress: string
  displayName: string
  avatar?: string
  isOnline: boolean
  lastSeen: string
  connections: number
  mutualConnections?: string[] // for suggestions
}

class SocialAPI {
  private baseUrl: string

  constructor() {
    // Use environment variable for API base URL
    this.baseUrl = process.env.NEXT_PUBLIC_SOCIAL_API_URL || '/api/social'
  }

  // Connection Management
  async sendConnectionRequest(toUser: string): Promise<UserConnection> {
    const response = await fetch(`${this.baseUrl}/connections/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ toUser })
    })

    if (!response.ok) {
      throw new Error('Failed to send connection request')
    }

    return response.json()
  }

  async acceptConnectionRequest(connectionId: string): Promise<UserConnection> {
    const response = await fetch(`${this.baseUrl}/connections/${connectionId}/accept`, {
      method: 'POST'
    })

    if (!response.ok) {
      throw new Error('Failed to accept connection request')
    }

    return response.json()
  }

  async rejectConnectionRequest(connectionId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/connections/${connectionId}/reject`, {
      method: 'POST'
    })

    if (!response.ok) {
      throw new Error('Failed to reject connection request')
    }
  }

  async removeConnection(connectionId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/connections/${connectionId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Failed to remove connection')
    }
  }

  async getUserConnections(userId: string, status?: 'pending' | 'accepted'): Promise<UserConnection[]> {
    const params = new URLSearchParams()
    if (status) params.append('status', status)

    const response = await fetch(`${this.baseUrl}/connections/${userId}?${params}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch user connections')
    }

    return response.json()
  }

  async getSuggestedConnections(userId: string, limit = 10): Promise<SocialProfile[]> {
    const response = await fetch(`${this.baseUrl}/connections/suggestions/${userId}?limit=${limit}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch connection suggestions')
    }

    return response.json()
  }

  // Messaging
  async createConversation(participantId: string, metadata?: any): Promise<Conversation> {
    const response = await fetch(`${this.baseUrl}/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        participantId,
        metadata 
      })
    })

    if (!response.ok) {
      throw new Error('Failed to create conversation')
    }

    return response.json()
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    const response = await fetch(`${this.baseUrl}/conversations/${userId}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch conversations')
    }

    return response.json()
  }

  async getConversationMessages(conversationId: string, page = 1, limit = 50): Promise<Message[]> {
    const response = await fetch(`${this.baseUrl}/conversations/${conversationId}/messages?page=${page}&limit=${limit}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch messages')
    }

    return response.json()
  }

  async sendMessage(conversationId: string, content: string, type: 'text' | 'image' | 'file' = 'text', attachments?: MessageAttachment[]): Promise<Message> {
    const response = await fetch(`${this.baseUrl}/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content,
        type,
        attachments
      })
    })

    if (!response.ok) {
      throw new Error('Failed to send message')
    }

    return response.json()
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/messages/${messageId}/read`, {
      method: 'POST'
    })

    if (!response.ok) {
      throw new Error('Failed to mark message as read')
    }
  }

  async markConversationAsRead(conversationId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/conversations/${conversationId}/read`, {
      method: 'POST'
    })

    if (!response.ok) {
      throw new Error('Failed to mark conversation as read')
    }
  }

  async editMessage(messageId: string, newContent: string): Promise<Message> {
    const response = await fetch(`${this.baseUrl}/messages/${messageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: newContent })
    })

    if (!response.ok) {
      throw new Error('Failed to edit message')
    }

    return response.json()
  }

  async deleteMessage(messageId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/messages/${messageId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Failed to delete message')
    }
  }

  // Social Profile
  async updateSocialProfile(profileData: Partial<SocialProfile>): Promise<SocialProfile> {
    const response = await fetch(`${this.baseUrl}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    })

    if (!response.ok) {
      throw new Error('Failed to update social profile')
    }

    return response.json()
  }

  async getSocialProfile(userId: string): Promise<SocialProfile> {
    const response = await fetch(`${this.baseUrl}/profile/${userId}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch social profile')
    }

    return response.json()
  }

  async updateOnlineStatus(isOnline: boolean): Promise<void> {
    const response = await fetch(`${this.baseUrl}/profile/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isOnline })
    })

    if (!response.ok) {
      throw new Error('Failed to update online status')
    }
  }

  // Search
  async searchUsers(query: string, limit = 20): Promise<SocialProfile[]> {
    const response = await fetch(`${this.baseUrl}/search/users?q=${encodeURIComponent(query)}&limit=${limit}`)
    
    if (!response.ok) {
      throw new Error('Failed to search users')
    }

    return response.json()
  }

  // File Upload for Messages
  async uploadMessageAttachment(file: File): Promise<MessageAttachment> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${this.baseUrl}/upload/attachment`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Failed to upload attachment')
    }

    return response.json()
  }

  // Real-time features (WebSocket connection)
  connectWebSocket(userId: string, onMessage?: (data: any) => void): WebSocket | null {
    if (typeof window === 'undefined') return null

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'
    const ws = new WebSocket(`${wsUrl}?userId=${userId}`)

    ws.onopen = () => {
      console.log('🔗 Connected to social WebSocket')
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (onMessage) {
          onMessage(data)
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }

    ws.onclose = () => {
      console.log('🔌 Disconnected from social WebSocket')
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    return ws
  }
}

export const socialApi = new SocialAPI()
export default socialApi 