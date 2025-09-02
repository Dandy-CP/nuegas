import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { mutationData } from '@/config/request';
import {
	AuthResponse,
	AuthBody,
	SignUpBody,
	SignUpResponse,
} from '@/types/auth.types';
import { ApiError, SuccessResponse } from '@/types/client.types';

export function SignIn(
	options?: UseMutationOptions<
		SuccessResponse<AuthResponse>,
		ApiError,
		AuthBody
	>
) {
	return useMutation<SuccessResponse<AuthResponse>, ApiError, AuthBody>({
		mutationFn: async (body) => {
			return await mutationData({
				url: '/auth/signin',
				method: 'POST',
				body: {
					...body,
				},
			});
		},
		...options,
	});
}

export function SignUp(
	options?: UseMutationOptions<
		SuccessResponse<SignUpResponse>,
		ApiError,
		SignUpBody
	>
) {
	return useMutation<SuccessResponse<SignUpResponse>, ApiError, SignUpBody>({
		mutationFn: async (body) => {
			return await mutationData({
				url: '/auth/signup',
				method: 'POST',
				body: {
					...body,
				},
			});
		},
		...options,
	});
}
