import { createContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { AuthResponse } from '@/types/auth.types';
import { SuccessResponse } from '@/types/client.types';

interface Props {
	children: React.ReactNode;
}

export type AuthContextType = {
	authData: AuthResponse | null;
	signIn: (access: SuccessResponse<AuthResponse>) => Promise<void>;
	signOut: () => Promise<void>;
	isAuth: () => Promise<void>;
};

const authContextDefaultValues: AuthContextType = {
	authData: null,
	signIn: async (access: SuccessResponse<AuthResponse>) => {},
	signOut: async () => {},
	isAuth: async () => {},
};

export const AuthContext = createContext<AuthContextType>(
	authContextDefaultValues
);

const AuthProvider = ({ children }: Props) => {
	const [authData, setAuthData] = useState<AuthResponse | null>(null);
	const router = useRouter();

	const signIn = async (access: SuccessResponse<AuthResponse>) => {
		try {
			const { name, email, access_token, refresh_token } = access.data;

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

			// set user data object to local storage
			localStorage.setItem('userData', JSON.stringify({ name, email }));

			setAuthData(access.data);
			router.replace('/dashboard');
		} catch (error) {
			console.log(error);
		}
	};

	const signOut = async () => {
		try {
			Cookies.remove('token');
			localStorage.removeItem('userData');
			setAuthData(null);
			router.replace('/auth');
		} catch (error) {
			console.log(error);
		}
	};

	const isAuth = async () => {
		try {
			const userValue = localStorage.getItem('userData');

			if (userValue !== null) {
				const userJSON = JSON.parse(userValue) as AuthResponse;
				setAuthData(userJSON);
			} else {
				setAuthData(null);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		isAuth();
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
