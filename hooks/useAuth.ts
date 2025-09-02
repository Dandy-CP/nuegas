import { useContext } from 'react';
import { AuthContextType, AuthContext } from '@/context/AuthProvider';

/**
 * Custom Hooks for Auth
 *
 * ```ts
 * // Example use
 * const { signIn, signOut, isAuth, authData } = useAuth();
 * ```
 * @param signIn - function to handle signIn auth
 * @param signOut - function to handle singOut auth
 * @param isAuth - function to check Auth
 * @param authData - variable data auth
 */

const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return context;
};

export default useAuth;
