export default () => ({
	node_env: process.env.NODE_ENV,
	database: {
		host: process.env.POSTGRES_URL,
	},
	auth: {
		server_url: process.env.AUTH_SERVER_URL,
		issuer_url: process.env.AUTH_ISSUER_URL,
		management_api_credentials: process.env.MANAGEMENT_API_CREDENTIALS,
	},
	throttle: {
		ttl: parseInt(process.env.THROTTLE_TTL) || 60000,
		limit: parseInt(process.env.THROTTLE_LIMIT) || 1000,
	},
});
