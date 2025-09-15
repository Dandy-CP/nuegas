import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { createContext, useEffect, useMemo, useState } from 'react';
import { fetchData } from '@/config/request';
import { AuthResponse, LoggedInUser } from '@/types/auth.types';
import { SuccessResponse } from '@/types/client.types';

interface Props {
	children: React.ReactNode;
}

export type AuthContextType = {
	authData: LoggedInUser | undefined;
	signIn: (access: SuccessResponse<AuthResponse>) => Promise<void>;
	signOut: () => Promise<void>;
	isAuth: () => Promise<void>;
};

const authContextDefaultValues: AuthContextType = {
	authData: undefined,
	signIn: async (access: SuccessResponse<AuthResponse>) => {},
	signOut: async () => {},
	isAuth: async () => {},
};

export const AuthContext = createContext<AuthContextType>(
	authContextDefaultValues
);

const AuthProvider = ({ children }: Props) => {
	const [authData, setAuthData] = useState<LoggedInUser>();
	const router = useRouter();

	async function getLoggedInUser() {
		try {
			const response = await fetchData<SuccessResponse<LoggedInUser>>({
				url: '/auth/logged-user',
			});

			return response.data;
		} catch (error) {
			console.log(error);
		}
	}

	const signIn = async (access: SuccessResponse<AuthResponse>) => {
		try {
			const { access_token, refresh_token } = access.data;

			// set token JWT to cookies
			Cookies.set('token', access_token, {
				expires: 7,
				secure: true,
			});

			// set refresh token JWT to cookies
			Cookies.set('refresh_token', refresh_token, {
				expires: 7,
				secure: true,
			});

			const loggedInUser = await getLoggedInUser();

			setAuthData(loggedInUser);
			router.replace('/dashboard');
		} catch (error) {
			console.log(error);
		}
	};

	const signOut = async () => {
		try {
			Cookies.remove('token');
			Cookies.remove('refresh_token');

			setAuthData(undefined);
			router.replace('/auth');
		} catch (error) {
			console.log(error);
		}
	};

	const isAuth = async () => {
		try {
			const loggedInUser = await getLoggedInUser();

			if (loggedInUser) {
				setAuthData(loggedInUser);
			} else {
				setAuthData(undefined);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		isAuth();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const valueContext = useMemo(
		() => ({
			authData,
			signIn,
			signOut,
			isAuth,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[authData]
	);

	return (
		<AuthContext.Provider value={valueContext}>{children}</AuthContext.Provider>
	);
};

export default AuthProvider;
