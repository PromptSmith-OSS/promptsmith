/** @type {import('next').NextConfig} */

const api_url = process.env.API_URL;

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
                destination: api_url + "/:path*",
            },
        ];
    },
};

export default nextConfig;
