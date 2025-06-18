// SkillChain API Configuration - Use proxy to avoid CORS
const API_BASE_URL = '/api/skillchain/skillchain/v1'

// Response interface matching documentation
interface ApiResponse<T = any> {
  data?: T
  message: string
  timestamp: string
  error?: string
  code?: number
  details?: string
}

// ============================================================================
// SKILLCHAIN CORE MODULE
// ============================================================================

// vUSD Operations
export const vusdApi = {
  // Get vUSD treasury status
  getTreasuryStatus: async (): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/vusd/treasury`)
    return response.json()
  },

  // Get user vUSD position
  getUserPosition: async (address: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/vusd/position/${address}`)
    return response.json()
  },

  // Convert SKILL to vUSD
  convertSkillToVUSD: async (data: { from_address: string; amount: string }): Promise<ApiResponse> => {
    // Convert frontend data to API format
    const apiData = {
      creator: data.from_address,
      amount: data.amount + 'uskill'  // Add denomination
    }
    
    const response = await fetch(`${API_BASE_URL}/vusd/convert/skill-to-vusd`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiData)
    })
    
    // Handle response based on content type
    const contentType = response.headers.get('content-type')
    let result
    
    if (contentType && contentType.includes('application/json')) {
      result = await response.json()
    } else {
      const text = await response.text()
      result = {
        error: text,
        message: text,
        timestamp: new Date().toISOString()
      }
    }
    
    if (!response.ok) {
      throw new Error(result.error || result.message || `HTTP ${response.status}`)
    }
    
    return result
  },

  // Convert vUSD to SKILL
  convertVUSDToSkill: async (data: { from_address: string; amount: string }): Promise<ApiResponse> => {
    // Convert frontend data to API format
    const apiData = {
      creator: data.from_address,
      amount: data.amount + 'uvusd'  // Add denomination
    }
    
    const response = await fetch(`${API_BASE_URL}/vusd/convert/vusd-to-skill`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiData)
    })
    
    // Handle response based on content type
    const contentType = response.headers.get('content-type')
    let result
    
    if (contentType && contentType.includes('application/json')) {
      result = await response.json()
    } else {
      const text = await response.text()
      result = {
        error: text,
        message: text,
        timestamp: new Date().toISOString()
      }
    }
    
    if (!response.ok) {
      throw new Error(result.error || result.message || `HTTP ${response.status}`)
    }
    
    return result
  },

  // Get vUSD price
  getPrice: async (): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/vusd/price`)
    return response.json()
  },

  // Update vUSD price
  updatePrice: async (data: { authority: string; new_price: string }): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/vusd/price`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  }
}

// Token Operations  
export const tokenApi = {
  // Burn tokens
  burnTokens: async (data: { burner_address: string; amount: string }): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/tokens/burn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Get token supply
  getSupply: async (): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/tokens/supply`)
    return response.json()
  }
}

// Module Parameters
export const paramsApi = {
  // Get module parameters
  getParams: async (): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/params`)
    return response.json()
  }
}

// ============================================================================
// PROFILE MODULE  
// ============================================================================

export const profileApi = {
  // Create profile
  createProfile: async (data: {
    creator: string
    name: string
    description: string
    avatar?: string
    website?: string
    location?: string
  }): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/profiles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // List profiles
  listProfiles: async (pageKey?: string, limit: number = 50): Promise<ApiResponse> => {
    const params = new URLSearchParams()
    if (pageKey) params.append('page_key', pageKey)
    params.append('limit', limit.toString())
    
    const response = await fetch(`${API_BASE_URL}/profiles?${params}`)
    return response.json()
  },

  // Get profile
  getProfile: async (address: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/profiles/${address}`)
    return response.json()
  },

  // Update profile
  updateProfile: async (address: string, data: {
    name?: string
    description?: string
    avatar?: string
    website?: string
    location?: string
  }): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/profiles/${address}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Add skill
  addSkill: async (address: string, data: {
    skill_name: string
    proficiency_level: string
    years_of_experience: number
    is_verified?: boolean
    verification_details?: string
  }): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/profiles/${address}/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // List user skills
  getUserSkills: async (address: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/profiles/${address}/skills`)
    return response.json()
  },

  // Get specific skill
  getSkill: async (address: string, skillId: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/profiles/${address}/skills/${skillId}`)
    return response.json()
  },

  // Endorse skill
  endorseSkill: async (address: string, skillId: string, data: {
    endorser_address: string
    endorsement_type: string
    stake_amount: string
    comment: string
  }): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/profiles/${address}/skills/${skillId}/endorse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  }
}

// ============================================================================
// MARKETPLACE MODULE
// ============================================================================

export const marketplaceApi = {
  // Create job posting
  createJob: async (data: {
    creator: string
    title: string
    description: string
    required_skills: string[]
    budget: string
    deadline: string
    category: string
    payment_type: string
  }): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // List job postings
  listJobs: async (params?: {
    category?: string
    status?: string
    min_budget?: string
    max_budget?: string
  }): Promise<ApiResponse> => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value)
      })
    }
    
    const response = await fetch(`${API_BASE_URL}/jobs?${searchParams}`)
    return response.json()
  },

  // Get job posting
  getJob: async (jobId: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`)
    return response.json()
  },

  // Update job posting
  updateJob: async (jobId: string, data: any): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Close job posting
  closeJob: async (jobId: string, data: { creator: string; reason: string }): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/close`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Submit proposal
  submitProposal: async (jobId: string, data: {
    creator: string
    proposed_budget: string
    timeline: string
    description: string
    experience: string
  }): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/proposals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // List proposals
  listProposals: async (jobId: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/proposals`)
    return response.json()
  },

  // Get proposal
  getProposal: async (proposalId: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}`)
    return response.json()
  },

  // Accept proposal
  acceptProposal: async (proposalId: string, data: { creator: string; message: string }): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // Reject proposal
  rejectProposal: async (proposalId: string, data: { creator: string; reason: string }): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/proposals/${proposalId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  }
}

// ============================================================================
// FILE STORAGE MODULE
// ============================================================================

export const fileStorageApi = {
  // Upload file to IPFS
  uploadFile: async (data: {
    creator: string
    file_name: string
    file_size: number
    file_type: string
    ipfs_hash: string
    description?: string
  }): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/files`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // List files
  listFiles: async (owner?: string): Promise<ApiResponse> => {
    const params = new URLSearchParams()
    if (owner) params.append('owner', owner)
    
    const response = await fetch(`${API_BASE_URL}/files?${params}`)
    return response.json()
  },

  // Get file details
  getFile: async (fileId: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/files/${fileId}`)
    return response.json()
  },

  // Pin IPFS hash
  pinToIPFS: async (hash: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/ipfs/pin/${hash}`, {
      method: 'POST'
    })
    return response.json()
  },

  // Check IPFS status
  getIPFSStatus: async (hash: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/ipfs/status/${hash}`)
    return response.json()
  }
}

// ============================================================================
// LEGACY COMPATIBILITY (old endpoint names)
// ============================================================================

// For backward compatibility with existing code
export const conversionApi = vusdApi
export const bankApi = {
  getBalances: async (address: string) => {
    // Use Cosmos SDK standard endpoint for actual balances
    const response = await fetch(`http://localhost:1317/cosmos/bank/v1beta1/balances/${address}`)
    return response.json()
  },
  getBalance: async (address: string, denom: string = 'uskill') => {
    const response = await fetch(`http://localhost:1317/cosmos/bank/v1beta1/balances/${address}`)
    const data = await response.json()
    const coin = data.balances?.find((b: any) => b.denom === denom)
    return { balance: coin || { denom, amount: '0' } }
  },
  getSupply: tokenApi.getSupply
} 