module.exports = {
    publicRuntimeConfig: {
        // Will be available on both server and client
        NEXT_PUBLIC_EXPLORER_URL: process.env.NEXT_PUBLIC_EXPLORER_URL || 'http://localhost:3000',
        NEXT_PUBLIC_DEFAULT_RPC: process.env.NEXT_PUBLIC_DEFAULT_RPC || 'http://localhost:7777'
      },
  }
  