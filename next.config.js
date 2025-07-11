/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Exclude MongoDB from client-side bundling
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        child_process: false,
        worker_threads: false,
        'mongodb-client-encryption': false,
        aws4: false,
        'mongodb-connection-string-url': false,
        'saslprep': false,
        'supports-color': false,
        'bson': false
      }
      
      // Exclude MongoDB entirely from client bundle
      config.externals = config.externals || []
      config.externals.push({
        mongodb: 'mongodb',
        'mongodb-client-encryption': 'mongodb-client-encryption'
      })
    }
    
    return config
  },
  
  // Updated config for Next.js 15
  serverExternalPackages: ['mongodb'],
  
  // Proxy configuration for CORS issues - Updated for Virtual Server
  async rewrites() {
    return [
      {
        source: '/api/skillchain/:path*',
        destination: process.env.NEXT_PUBLIC_SKILLCHAIN_API + '/skillchain/:path*' || 'http://45.83.20.3:1317/skillchain/:path*'
      }
    ]
  }
}

module.exports = nextConfig 