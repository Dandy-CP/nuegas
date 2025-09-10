import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { mutationData } from '@/config/request';
import { ApiError } from '@/types/client.types';
import { CreateCommentBody } from '@/types/comment.types';

export function CreateComment(
	params?: { [key: string]: string | number },
	options?: UseMutationOptions<any, ApiError, CreateCommentBody>
) {
	return useMutation<any, ApiError, CreateCommentBody>({
		mutationFn: async (body) => {
			return await mutationData({
				url: '/comment',
				method: 'POST',
				body: {
					content: body.content,
				},
				inputParams: params,
			});
		},
		...options,
	});
}

export function DeleteComment(
	params?: { [key: string]: string | number },
	options?: UseMutationOptions<any, ApiError>
) {
	return useMutation<any, ApiError>({
		mutationFn: async (body) => {
			return await mutationData({
				url: '/comment',
				method: 'DELETE',
				inputParams: params,
			});
		},
		...options,
	});
}
