import { StargateClient, SigningStargateClient } from '@cosmjs/stargate'
import { OfflineSigner } from '@cosmjs/proto-signing'
import { Window as KeplrWindow } from '@keplr-wallet/types'
import { Decimal } from '@cosmjs/math'

declare global {
  interface Window extends KeplrWindow {}
}

// SkillChain network configuration - Updated for Virtual Server
export const SKILLCHAIN_CONFIG = {
  chainId: 'skillchain',
  chainName: 'SkillChain',
  rpc: process.env.NEXT_PUBLIC_SKILLCHAIN_RPC || 'http://45.83.20.3:26657',
  rest: process.env.NEXT_PUBLIC_SKILLCHAIN_API || 'http://45.83.20.3:1317',
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
    },
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

export class SkillChainClient {
  private client: StargateClient | null = null
  private signingClient: SigningStargateClient | null = null

  async connect(): Promise<StargateClient> {
    if (!this.client) {
      this.client = await StargateClient.connect(SKILLCHAIN_CONFIG.rpc)
    }
    return this.client
  }

  async connectWallet(): Promise<{ address: string; signer: OfflineSigner }> {
    if (!window.keplr) {
      throw new Error('Keplr wallet not found. Please install Keplr extension.')
    }

    // Add SkillChain to Keplr if not exists
    try {
      await window.keplr.experimentalSuggestChain({
        chainId: SKILLCHAIN_CONFIG.chainId,
        chainName: SKILLCHAIN_CONFIG.chainName,
        rpc: SKILLCHAIN_CONFIG.rpc,
        rest: SKILLCHAIN_CONFIG.rest,
        bip44: {
          coinType: 118,
        },
        bech32Config: SKILLCHAIN_CONFIG.bech32Config,
        currencies: SKILLCHAIN_CONFIG.currencies,
        feeCurrencies: SKILLCHAIN_CONFIG.feeCurrencies,
        stakeCurrency: SKILLCHAIN_CONFIG.stakeCurrency,
      })
    } catch (error) {
      console.warn('Chain suggestion failed:', error)
    }

    // Enable the chain
    await window.keplr.enable(SKILLCHAIN_CONFIG.chainId)

    // Get offline signer
    const offlineSigner = window.keplr.getOfflineSigner(SKILLCHAIN_CONFIG.chainId)
    const accounts = await offlineSigner.getAccounts()

    if (accounts.length === 0) {
      throw new Error('No accounts found in wallet')
    }

    return {
      address: accounts[0].address,
      signer: offlineSigner,
    }
  }

  async getSigningClient(signer: OfflineSigner): Promise<SigningStargateClient> {
    if (!this.signingClient) {
      this.signingClient = await SigningStargateClient.connectWithSigner(
        SKILLCHAIN_CONFIG.rpc,
        signer,
        {
          gasPrice: {
            denom: 'uskill',
            amount: Decimal.fromUserInput('0.025', 6),
          },
        }
      )
    }
    return this.signingClient
  }

  async getBalance(address: string, denom: string = 'uskill') {
    const client = await this.connect()
    return await client.getBalance(address, denom)
  }

  async getAllBalances(address: string) {
    const client = await this.connect()
    return await client.getAllBalances(address)
  }

  // SkillChain specific methods using real blockchain transactions
  async convertSkillToVUSD(
    signer: OfflineSigner,
    address: string,
    amount: string
  ) {
    try {
      console.log('=== Starting SKILL to VUSD conversion ===')
      console.log('Signer:', signer)
      console.log('Address:', address)
      console.log('Amount:', amount)
      
      console.log('Getting signing client...')
      const signingClient = await this.getSigningClient(signer)
      console.log('Signing client ready:', signingClient)
      
      // Create the conversion message
      const msg = {
        typeUrl: '/skillchain.skillchain.MsgConvertSkillToVUSD',
        value: {
          creator: address,
          amount: {
            denom: 'uskill',
            amount: amount
          }
        },
      }
      
      console.log('Message to broadcast:', JSON.stringify(msg, null, 2))

      const fee = {
        amount: [{ denom: 'uskill', amount: '5000' }],
        gas: '200000',
      }
      
      console.log('Fee:', fee)

      console.log('About to call signAndBroadcast - this should trigger Keplr popup...')
      const result = await signingClient.signAndBroadcast(address, [msg], fee)
      console.log('Transaction broadcast result:', result)
      
      if (result.code === 0) {
        console.log('Conversion successful:', result)
        return { 
          success: true, 
          manual: false, 
          txHash: result.transactionHash,
          height: result.height 
        }
      } else {
        throw new Error(`Transaction failed: ${result.rawLog}`)
      }
      
    } catch (error: any) {
      console.error('=== Blockchain conversion error ===')
      console.error('Error type:', typeof error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      console.error('Error object:', error)
      
      // If blockchain transaction fails, fallback to CLI approach
      console.log('Falling back to CLI approach...')
      const command = `skillchaind tx skillchain convert-skill-to-vusd --amount ${amount}uskill --from ${address} --chain-id skillchain --fees 5000uskill --yes --output json`
      
      const result = confirm(`Blockchain transaction failed. Would you like to use CLI approach?

Error: ${error.message}

Please run this command in your terminal:
${command}

Click OK after running the command, then refresh the page to see updated balances.`)
      
      if (result) {
        return { success: true, manual: true, command }
      } else {
        throw new Error('Conversion cancelled by user')
      }
    }
  }

  async convertVUSDToSkill(
    signer: OfflineSigner,
    address: string,
    amount: string
  ) {
    try {
      console.log('Converting VUSD to SKILL using blockchain transaction...')
      
      const signingClient = await this.getSigningClient(signer)
      
      // Create the conversion message
      const msg = {
        typeUrl: '/skillchain.skillchain.MsgConvertVUSDToSkill',
        value: {
          creator: address,
          amount: {
            denom: 'uvusd',
            amount: amount
          }
        },
      }

      const fee = {
        amount: [{ denom: 'uskill', amount: '5000' }],
        gas: '200000',
      }

      console.log('Broadcasting VUSD to SKILL conversion transaction...')
      const result = await signingClient.signAndBroadcast(address, [msg], fee)
      
      if (result.code === 0) {
        console.log('Conversion successful:', result)
        return { 
          success: true, 
          manual: false, 
          txHash: result.transactionHash,
          height: result.height 
        }
      } else {
        throw new Error(`Transaction failed: ${result.rawLog}`)
      }
      
    } catch (error: any) {
      console.error('Blockchain conversion error:', error)
      
      // If blockchain transaction fails, fallback to CLI approach
      console.log('Falling back to CLI approach...')
      const command = `skillchaind tx skillchain convert-vusd-to-skill --amount ${amount}uvusd --from ${address} --chain-id skillchain --fees 5000uskill --yes --output json`
      
      const result = confirm(`Blockchain transaction failed. Would you like to use CLI approach?

Please run this command in your terminal:
${command}

Click OK after running the command, then refresh the page to see updated balances.`)
      
      if (result) {
        return { success: true, manual: true, command }
      } else {
        throw new Error('Conversion cancelled by user')
      }
    }
  }

  async createJobPosting(
    signer: OfflineSigner,
    address: string,
    jobData: {
      index: string
      clientAddress: string
      title: string
      description: string
      skillsRequired: string
      budgetAmount: string
      paymentCurrency: string
      deadline: string
      isActive: string
      createdAt: string
    }
  ) {
    const signingClient = await this.getSigningClient(signer)
    
    const msg = {
      typeUrl: '/skillchain.marketplace.MsgCreateJobPosting',
      value: {
        creator: address,
        ...jobData,
      },
    }

    const fee = {
      amount: [{ denom: 'uskill', amount: '5000' }],
      gas: '200000',
    }

    return await signingClient.signAndBroadcast(address, [msg], fee)
  }
}

export const skillChainClient = new SkillChainClient() 