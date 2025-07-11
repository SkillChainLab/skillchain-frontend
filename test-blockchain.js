#!/usr/bin/env node
// Test script to verify SkillChain blockchain connectivity

const BLOCKCHAIN_ENDPOINTS = {
  rpc: 'http://45.83.20.3:26657',
  rest: 'http://45.83.20.3:1317',
  faucet: 'http://45.83.20.3:4500'
}

async function testBlockchainConnection() {
  console.log('🔍 Testing SkillChain blockchain connectivity...\n')
  
  // Test RPC endpoint
  try {
    console.log('🔄 Testing RPC endpoint...')
    const rpcResponse = await fetch(`${BLOCKCHAIN_ENDPOINTS.rpc}/status`)
    if (rpcResponse.ok) {
      const rpcData = await rpcResponse.json()
      console.log('✅ RPC endpoint is working')
      console.log(`   Network: ${rpcData.result.node_info.network}`)
      console.log(`   Latest block: ${rpcData.result.sync_info.latest_block_height}`)
    } else {
      console.log('❌ RPC endpoint failed')
    }
  } catch (error) {
    console.log('❌ RPC endpoint error:', error.message)
  }
  
  // Test REST API endpoint
  try {
    console.log('\n🔄 Testing REST API endpoint...')
    const restResponse = await fetch(`${BLOCKCHAIN_ENDPOINTS.rest}/cosmos/base/tendermint/v1beta1/node_info`)
    if (restResponse.ok) {
      const restData = await restResponse.json()
      console.log('✅ REST API endpoint is working')
      console.log(`   Network: ${restData.default_node_info.network}`)
      console.log(`   Moniker: ${restData.default_node_info.moniker}`)
    } else {
      console.log('❌ REST API endpoint failed')
    }
  } catch (error) {
    console.log('❌ REST API endpoint error:', error.message)
  }
  
  // Test Faucet endpoint
  try {
    console.log('\n🔄 Testing Faucet endpoint...')
    const faucetResponse = await fetch(`${BLOCKCHAIN_ENDPOINTS.faucet}/status`)
    if (faucetResponse.ok) {
      const faucetData = await faucetResponse.json()
      console.log('✅ Faucet endpoint is working')
      console.log(`   Status: ${faucetData.status || 'Available'}`)
    } else {
      console.log('❌ Faucet endpoint failed')
    }
  } catch (error) {
    console.log('❌ Faucet endpoint error:', error.message)
  }
  
  console.log('\n🎉 Blockchain connectivity test completed!')
}

// Run the test
testBlockchainConnection().catch(console.error) 