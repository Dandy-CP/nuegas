import axios from 'axios';
import Cookies from 'js-cookie';

export const client = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
	headers: {
		Accept: 'application/json',
	},
});

client.interceptors.request.use(
	async (config) => {
		const token = Cookies.get('token');

		// Set Header Authorization in Every Request with a Bearer token
		config.headers.Authorization = token ? `Bearer ${token}` : '';

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

client.interceptors.response.use(undefined, (error) => {
	const token = Cookies.get('token');
	const unauthorizedCode = error.response.status === 401;

	// If a token exists and unauthorized code is true, then
	// Remove token from cookies and replace to the auth page
	if (token && unauthorizedCode) {
		Cookies.remove('token');
		window.location.replace('/auth');
	}

	return Promise.reject(error);
});
