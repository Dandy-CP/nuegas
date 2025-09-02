import { ToastContainer } from 'react-toastify';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AuthProvider from '@/context/AuthProvider';
import { ThemeProvider } from '@emotion/react';
import { QueryClientProvider } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { queryClient } from '@/config/queryClient';
import theme from '@/config/theme';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const pageNoLayout = ['/auth', '/signup', '/_error'];

	return (
		<ThemeProvider theme={theme}>
			<QueryClientProvider client={queryClient}>
				<Head>
					<title>Nuegas</title>
				</Head>

				<AuthProvider>
					{pageNoLayout.includes(router.pathname) ? (
						<Component {...pageProps} />
					) : (
						<Layout path={router.pathname}>
							<Component {...pageProps} />
						</Layout>
					)}
				</AuthProvider>

				<ToastContainer />
			</QueryClientProvider>
		</ThemeProvider>
	);
}
