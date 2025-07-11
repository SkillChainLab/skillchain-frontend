'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface WalletInfo {
  address: string
  name: string
  skillBalance: number
  vusdBalance: number
  chainId: string
  isConnected: boolean
}

interface WalletContextType {
  walletInfo: WalletInfo | null
  isConnecting: boolean
  error: string | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  refreshBalances: () => Promise<void>
  copyAddress: () => Promise<void>
  copied: boolean
}

type KeplrWindow = Window & {
  keplr?: any
}

declare const window: KeplrWindow

const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Using our SkillChain network that's running on virtual server
const SKILLCHAIN_CHAIN_ID = 'skillchain'
const SKILLCHAIN_CHAIN_CONFIG = {
  chainId: SKILLCHAIN_CHAIN_ID,
  chainName: 'SkillChain',
  rpc: process.env.NEXT_PUBLIC_SKILLCHAIN_RPC || 'http://45.83.20.3:26657',
  rest: process.env.NEXT_PUBLIC_SKILLCHAIN_API || 'http://45.83.20.3:1317',
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: 'skill',
    bech32PrefixAccPub: 'skillpub',
    bech32PrefixValAddr: 'skillvaloper',
    bech32PrefixValPub: 'skillvaloperpub',
    bech32PrefixConsAddr: 'skillvalcons',
    bech32PrefixConsPub: 'skillvalconspub',
  },
  currencies: [
    {
      coinDenom: 'SKILL',
      coinMinimalDenom: 'uskill',
      coinDecimals: 6,
    },
    {
      coinDenom: 'VUSD',
      coinMinimalDenom: 'uvusd',
      coinDecimals: 6,
    }
  ],
  feeCurrencies: [
    {
      coinDenom: 'SKILL',
      coinMinimalDenom: 'uskill',
      coinDecimals: 6,
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.04,
      },
    },
  ],
  stakeCurrency: {
    coinDenom: 'SKILL',
    coinMinimalDenom: 'uskill',
    coinDecimals: 6,
  },
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Wallet connection disabled for landing page
    // Only initialize once
    // if (!initialized) {
    //   initializeWallet()
    // }
    setInitialized(true) // Mark as initialized without connecting
    
    // Listen for Keplr account changes
    const handleKeplrAccountChange = () => {
      console.log('Keplr account changed, reloading wallet info...')
      // Only reload if we currently have a wallet connected
      const currentConnection = localStorage.getItem('skillchain-wallet-connected')
      if (currentConnection === 'true') {
        loadWalletInfo()
      }
    }

    // Add event listener for Keplr account changes
    if (window.keplr) {
      window.addEventListener('keplr_keystorechange', handleKeplrAccountChange)
    }

    // Cleanup event listener
    return () => {
      if (window.keplr) {
        window.removeEventListener('keplr_keystorechange', handleKeplrAccountChange)
      }
    }
  }, [initialized]) // Only depend on initialized flag

  const initializeWallet = async () => {
    // Check if we have a stored connection
    const storedConnection = localStorage.getItem('skillchain-wallet-connected')
    
    if (!window.keplr) {
      console.log('Keplr not available')
      setInitialized(true)
      return
    }

    if (storedConnection === 'true') {
      console.log('Found stored wallet connection, attempting to reconnect...')
      setIsConnecting(true)
      
      try {
        // Try to enable the chain (this will work if user previously connected)
        await window.keplr.enable(SKILLCHAIN_CHAIN_ID)
        
        // Load wallet information
        await loadWalletInfo()
        
        console.log('Successfully reconnected to wallet')
      } catch (error) {
        console.log('Failed to reconnect to wallet:', error)
        // Clear stored connection if reconnection fails
        localStorage.removeItem('skillchain-wallet-connected')
      } finally {
        setIsConnecting(false)
      }
    } else {
      // Still check if Keplr is already connected to SkillChain
      await checkExistingConnection()
    }
    
    // Mark as initialized
    setInitialized(true)
  }

  const checkExistingConnection = async () => {
    if (!window.keplr) return

    try {
      // Check if Keplr is already connected to SkillChain
      const key = await window.keplr.getKey(SKILLCHAIN_CHAIN_ID)
      if (key) {
        console.log('Found existing Keplr connection to SkillChain')
        await loadWalletInfo()
        // Store the connection
        localStorage.setItem('skillchain-wallet-connected', 'true')
      }
    } catch (error) {
      console.log('No existing Keplr connection found')
    }
  }

  const connectWallet = async () => {
    if (!window.keplr) {
      setError('Keplr wallet is not installed. Please install Keplr extension.')
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      // Add SkillChain to Keplr
      await window.keplr.experimentalSuggestChain(SKILLCHAIN_CHAIN_CONFIG)
      
      // Enable the chain
      await window.keplr.enable(SKILLCHAIN_CHAIN_ID)
      
      // Load wallet information
      await loadWalletInfo()
      
      // Store successful connection
      localStorage.setItem('skillchain-wallet-connected', 'true')
      
    } catch (error: any) {
      setError(error.message || 'Failed to connect wallet')
      // Remove stored connection on error
      localStorage.removeItem('skillchain-wallet-connected')
    } finally {
      setIsConnecting(false)
    }
  }

  const loadWalletInfo = async () => {
    try {
      const offlineSigner = window.keplr!.getOfflineSigner(SKILLCHAIN_CHAIN_ID)
      const accounts = await offlineSigner.getAccounts()
      
      if (accounts.length > 0) {
        let skillBalance = 0
        let vusdBalance = 0
        
        // Try to get real blockchain balances by connecting directly to SkillChain RPC
        try {
          // Import CosmJS to connect directly to blockchain
          const { StargateClient } = await import('@cosmjs/stargate')
          
          // Connect to SkillChain RPC
          const client = await StargateClient.connect('http://localhost:26657')
          
          // Get all balances for the account
          const balances = await client.getAllBalances(accounts[0].address)
          
          // Parse SKILL balance
          const skillCoin = balances.find(coin => coin.denom === 'uskill')
          if (skillCoin) {
            skillBalance = parseInt(skillCoin.amount) / 1000000
          }
          
          // Parse VUSD balance  
          const vusdCoin = balances.find(coin => coin.denom === 'uvusd')
          if (vusdCoin) {
            vusdBalance = parseInt(vusdCoin.amount) / 1000000
          }
          
          // Close the client connection
          client.disconnect()
          
        } catch (rpcError) {
          // Fallback to SkillChain API v1 position endpoint
          try {
            const response = await fetch(`http://localhost:1317/skillchain/v1/vusd/position/${accounts[0].address}`)
            const positionData = await response.json()
            
            if (positionData.data) {
              // Parse the position data from SkillChain API
              if (positionData.data.skill_collateral) {
                const skillAmount = positionData.data.skill_collateral.replace('uskill', '')
                skillBalance = parseInt(skillAmount) / 1000000
              }
              if (positionData.data.vusd_balance) {
                const vusdAmount = positionData.data.vusd_balance.replace('uvusd', '')
                vusdBalance = parseInt(vusdAmount) / 1000000
              }
            }
          } catch (apiError) {
            // Final fallback - only use if both RPC and API fail
            skillBalance = 100
            vusdBalance = 2
          }
        }
        
        setWalletInfo({
          address: accounts[0].address,
          name: accounts[0].name || 'My Wallet',
          skillBalance,
          vusdBalance,
          chainId: SKILLCHAIN_CHAIN_ID,
          isConnected: true
        })
      }
    } catch (error: any) {
      setError('Failed to load wallet information')
    }
  }

  const disconnectWallet = () => {
    setWalletInfo(null)
    setError(null)
    // Clear stored connection
    localStorage.removeItem('skillchain-wallet-connected')
  }

  const refreshBalances = async () => {
    if (walletInfo) {
      await loadWalletInfo()
    }
  }

  const copyAddress = async () => {
    if (walletInfo?.address) {
      await navigator.clipboard.writeText(walletInfo.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const value: WalletContextType = {
    walletInfo,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    refreshBalances,
    copyAddress,
    copied
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

export default WalletContext 