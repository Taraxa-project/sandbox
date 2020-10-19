module.exports = {
    publicRuntimeConfig: {
        // Will be available on both server and client
        NEXT_PUBLIC_EXPLORER_URL: process.env.NEXT_PUBLIC_EXPLORER_URL || 'http://localhost:3000',
        NEXT_PUBLIC_DEFAULT_RPC: process.env.NEXT_PUBLIC_DEFAULT_RPC || 'http://localhost:7777'
    },
    async headers() {
        return [
            {
                // mathching all API routes
                source: "/api/:path*",
                headers: [
                { key: "Access-Control-Allow-Credentials", value: "true" },
                { key: "Access-Control-Allow-Origin", value: "*" },
                { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
                { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                ]
            }
        ]
    }
}
