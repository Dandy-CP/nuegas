import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { mutationData } from '@/config/request';
import { ApiError } from '@/types/client.types';
import { CreatePostBody } from '@/types/post.types';

export function CreatePost(
	params?: { [key: string]: string | number },
	options?: UseMutationOptions<any, ApiError, CreatePostBody>
) {
	return useMutation<any, ApiError, CreatePostBody>({
		mutationFn: async (body) => {
			return await mutationData({
				url: '/post/create',
				method: 'POST',
				body: {
					content: body.content,
					attachment: body.attachment,
				},
				inputParams: {
					class_id: params?.class_id,
				},
			});
		},
		...options,
	});
}

export function DeletePost(
	params?: { [key: string]: string | number },
	options?: UseMutationOptions<any, ApiError>
) {
	return useMutation<any, ApiError>({
		mutationFn: async (body) => {
			return await mutationData({
				url: '/post',
				method: 'DELETE',
				inputParams: {
					post_id: params?.post_id,
				},
			});
		},
		...options,
	});
}
