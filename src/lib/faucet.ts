// Token Faucet Utility for SkillChain

const FAUCET_URL = process.env.NEXT_PUBLIC_FAUCET_URL || 'http://45.83.20.3:4500'

export interface FaucetResponse {
  success: boolean
  message: string
  txHash?: string
  error?: string
}

export class FaucetService {
  // Request SKILL tokens from faucet
  static async requestSkillTokens(address: string): Promise<FaucetResponse> {
    try {
      const response = await fetch(`${FAUCET_URL}/faucet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to request SKILL tokens')
      }

      return {
        success: true,
        message: 'SKILL tokens sent successfully',
        txHash: data.txHash,
      }
    } catch (error) {
      console.error('Error requesting SKILL tokens:', error)
      return {
        success: false,
        message: 'Failed to request SKILL tokens',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // Request VUSD tokens from faucet
  static async requestVUSDTokens(address: string): Promise<FaucetResponse> {
    try {
      const response = await fetch(`${FAUCET_URL}/faucet/vusd`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to request VUSD tokens')
      }

      return {
        success: true,
        message: 'VUSD tokens sent successfully',
        txHash: data.txHash,
      }
    } catch (error) {
      console.error('Error requesting VUSD tokens:', error)
      return {
        success: false,
        message: 'Failed to request VUSD tokens',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // Get faucet status
  static async getFaucetStatus(): Promise<{ available: boolean; message: string }> {
    try {
      const response = await fetch(`${FAUCET_URL}/status`)
      const data = await response.json()

      return {
        available: response.ok,
        message: data.message || 'Faucet is operational',
      }
    } catch (error) {
      console.error('Error checking faucet status:', error)
      return {
        available: false,
        message: 'Faucet is not available',
      }
    }
  }
}

// Hook for using faucet in React components
export const useFaucet = () => {
  const requestSkillTokens = async (address: string) => {
    return await FaucetService.requestSkillTokens(address)
  }

  const requestVUSDTokens = async (address: string) => {
    return await FaucetService.requestVUSDTokens(address)
  }

  const checkFaucetStatus = async () => {
    return await FaucetService.getFaucetStatus()
  }

  return {
    requestSkillTokens,
    requestVUSDTokens,
    checkFaucetStatus,
  }
} 