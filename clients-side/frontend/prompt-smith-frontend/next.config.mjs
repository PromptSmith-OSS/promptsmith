/** @type {import('next').NextConfig} */



const nextConfig = {
    /**
     * Use rewrites to proxy requests to the API server
     * API server will not consider this as CORS request but same region request
     * @returns {Promise<[{destination: string, source: string}]>}
     */
    async rewrites() {
        return [
            {
                source: "/api/bff/:path*",
                destination: (process.env.API_URL || 'http://0.0.0.0:8000') + "/:path*",
            },
        ];
    },
    // output: 'standalone',
};

export default nextConfig;
