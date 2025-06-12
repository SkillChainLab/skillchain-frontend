'use client'

import { useState, useEffect } from 'react'
import { ArrowUpDown, Wallet, RefreshCw, TrendingUp } from 'lucide-react'
import { skillChainClient } from '@/lib/blockchain'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { useWallet } from '@/contexts/WalletContext'

export default function ConvertPage() {
  const { walletInfo, refreshBalances } = useWallet()
  const [convertDirection, setConvertDirection] = useState<'skill-to-vusd' | 'vusd-to-skill'>('skill-to-vusd')
  const [amount, setAmount] = useState('')
  const [isConverting, setIsConverting] = useState(false)

  const handleConvert = async () => {
    if (!walletInfo || !amount) return
    
    try {
      setIsConverting(true)
      const microAmount = (parseFloat(amount) * 1000000).toString()
      
      console.log('Starting conversion process:', {
        direction: convertDirection,
        amount: amount,
        microAmount: microAmount,
        address: walletInfo.address
      })
      
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
      const { msgTypes } = await import('@/lib/ts-client/skillchain.skillchain/registry')
      const { MsgConvertSkillToVUSD, MsgConvertVUSDToSkill } = await import('@/lib/ts-client/skillchain.skillchain/types/skillchain/skillchain/tx')
      
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
      
      console.log('Creating conversion message...')
      
      // Create the conversion message using proper protobuf structure
      const msgType = convertDirection === 'skill-to-vusd' ? '/skillchain.skillchain.MsgConvertSkillToVUSD' : '/skillchain.skillchain.MsgConvertVUSDToSkill'
      const denom = convertDirection === 'skill-to-vusd' ? 'uskill' : 'uvusd'
      
      // Create message value using the proper protobuf message structure
      const messageValue = convertDirection === 'skill-to-vusd' 
        ? MsgConvertSkillToVUSD.fromPartial({
            creator: walletInfo.address,
            amount: {
              denom: denom,
              amount: microAmount
            }
          })
        : MsgConvertVUSDToSkill.fromPartial({
            creator: walletInfo.address,
            amount: {
              denom: denom,
              amount: microAmount
            }
          })
      
      const msg = {
        typeUrl: msgType,
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
        `SkillChain ${convertDirection === 'skill-to-vusd' ? 'SKILL to VUSD' : 'VUSD to SKILL'} conversion`
      )
      
      console.log('Transaction result:', result)
      
      if (result.code === 0) {
        alert(`✅ Conversion successful! 
        
🔗 Transaction Hash: ${result.transactionHash}
📊 Direction: ${convertDirection === 'skill-to-vusd' ? 'SKILL → VUSD' : 'VUSD → SKILL'}
💰 Amount: ${amount} ${convertDirection === 'skill-to-vusd' ? 'SKILL' : 'VUSD'}
⛽ Gas Used: ${result.gasUsed}

Your balances will update in a few seconds...`)
        
        // Refresh balances after conversion
        setTimeout(async () => {
          await refreshBalances()
        }, 3000)
      } else {
        throw new Error(`Transaction failed: ${result.rawLog}`)
      }
      
    } catch (error: any) {
      console.error('Conversion failed:', error)
      
      // More detailed error message
      let errorMessage = 'Conversion failed. '
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
      setIsConverting(false)
      setAmount('')
    }
  }

  const calculateOutput = () => {
    if (!amount) return '0'
    const inputAmount = parseFloat(amount)
    if (convertDirection === 'skill-to-vusd') {
      return (inputAmount * 0.5).toFixed(2) // 1 SKILL = $0.50 = 0.5 VUSD
    } else {
      return (inputAmount * 2).toFixed(2) // 1 VUSD = 2 SKILL at $0.50/SKILL
    }
  }

  const flipDirection = () => {
    setConvertDirection(convertDirection === 'skill-to-vusd' ? 'vusd-to-skill' : 'skill-to-vusd')
    setAmount('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex flex-col">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <Navigation 
        title="VUSD Converter"
        backLink="/"
        showBackButton={true}
      />

      <div className="container mx-auto px-6 py-12">
        <div className="text-center text-white mb-16">
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              VUSD Converter
            </span>
          </h1>
          <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Convert between SKILL tokens and stable VUSD with guaranteed rates
          </p>
          
          {/* Rate Display */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3">
              <span className="text-blue-400 font-semibold">1 SKILL = $0.50</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3">
              <span className="text-green-400 font-semibold">1 VUSD = $1.00</span>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto">
          {/* Wallet Connection */}
          {!walletInfo ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center text-white">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <Wallet className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold mb-6">Connect Your Wallet</h2>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                Connect your Keplr wallet to start converting between SKILL and VUSD tokens
              </p>
              <p className="text-blue-400 text-lg">
                Please use the "Connect Wallet" button in the navigation above
              </p>
            </div>
          ) : (
            <>
              {/* Wallet Info */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Your Balances</h3>
                  <button
                    onClick={refreshBalances}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all hover:scale-105"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 text-center">
                    <div className="text-blue-400 text-sm mb-2">SKILL Balance</div>
                    <div className="text-3xl font-bold">{walletInfo.skillBalance.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">${(walletInfo.skillBalance * 0.5).toLocaleString()}</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-6 text-center">
                    <div className="text-green-400 text-sm mb-2">VUSD Balance</div>
                    <div className="text-3xl font-bold">{walletInfo.vusdBalance.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">≈ ${walletInfo.vusdBalance.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Conversion Interface */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-8 text-center">Convert Tokens</h3>
                
                {/* From Token */}
                <div className="space-y-6">
                  <div className="bg-white/10 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-gray-300">From</label>
                      <div className="text-sm text-gray-400">
                        Balance: {convertDirection === 'skill-to-vusd' ? walletInfo.skillBalance : walletInfo.vusdBalance}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="flex-1 bg-transparent text-2xl font-bold outline-none placeholder-gray-500"
                      />
                      <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
                        <div className={`w-6 h-6 rounded-full ${convertDirection === 'skill-to-vusd' ? 'bg-gradient-to-r from-blue-400 to-purple-500' : 'bg-gradient-to-r from-green-400 to-emerald-500'}`}></div>
                        <span className="font-semibold">
                          {convertDirection === 'skill-to-vusd' ? 'SKILL' : 'VUSD'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Flip Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={flipDirection}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:scale-105 hover:rotate-180 duration-300"
                    >
                      <ArrowUpDown className="w-6 h-6" />
                    </button>
                  </div>

                  {/* To Token */}
                  <div className="bg-white/10 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-gray-300">To</label>
                      <div className="text-sm text-gray-400">
                        Balance: {convertDirection === 'skill-to-vusd' ? walletInfo.vusdBalance : walletInfo.skillBalance}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 text-2xl font-bold text-gray-300">
                        {calculateOutput()}
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
                        <div className={`w-6 h-6 rounded-full ${convertDirection === 'skill-to-vusd' ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-blue-400 to-purple-500'}`}></div>
                        <span className="font-semibold">
                          {convertDirection === 'skill-to-vusd' ? 'VUSD' : 'SKILL'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Convert Button */}
                  <button
                    onClick={handleConvert}
                    disabled={!amount || isConverting || parseFloat(amount) <= 0}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25"
                  >
                    {isConverting ? (
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Converting...
                      </div>
                    ) : (
                      `Convert ${convertDirection === 'skill-to-vusd' ? 'SKILL to VUSD' : 'VUSD to SKILL'}`
                    )}
                  </button>

                  {/* Conversion Info */}
                  {amount && (
                    <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 font-semibold">Conversion Details</span>
                      </div>
                      <div className="text-sm text-gray-300 space-y-1">
                        <div className="flex justify-between">
                          <span>Exchange Rate:</span>
                          <span>{convertDirection === 'skill-to-vusd' ? '1 SKILL = 0.5 VUSD' : '1 VUSD = 2 SKILL'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>You'll receive:</span>
                          <span className="font-semibold">{calculateOutput()} {convertDirection === 'skill-to-vusd' ? 'VUSD' : 'SKILL'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
} 