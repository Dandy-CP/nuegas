import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { mutationData } from '@/config/request';
import { CreateClassBody, JoinClassBody } from '@/types/class.types';
import { ApiError } from '@/types/client.types';

export function CreateClass(
	options?: UseMutationOptions<any, ApiError, CreateClassBody>
) {
	return useMutation<any, ApiError, CreateClassBody>({
		mutationFn: async (body) => {
			return await mutationData({
				url: '/class/create-my-class',
				method: 'POST',
				body: {
					class_name: body.class_name,
					class_description: body.class_description,
				},
			});
		},
		...options,
	});
}

export function JoinClass(
	options?: UseMutationOptions<any, ApiError, JoinClassBody>
) {
	return useMutation<any, ApiError, JoinClassBody>({
		mutationFn: async (body) => {
			return await mutationData({
				url: `/class/join-class?class_code=${body.class_code}`,
				method: 'POST',
			});
		},
		...options,
	});
}
