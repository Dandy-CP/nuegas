import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { mutationData } from '@/config/request';
import { ApiError, SuccessResponse } from '@/types/client.types';
import { Topic } from '@/types/topic.types';

export function CreateTopic(
	params?: { [key: string]: string | number },
	options?: UseMutationOptions<
		SuccessResponse<Topic>,
		ApiError,
		{ name: string }
	>
) {
	return useMutation<SuccessResponse<Topic>, ApiError, { name: string }>({
		mutationFn: async (body) => {
			return await mutationData({
				url: '/topic',
				method: 'POST',
				body: {
					name: body.name,
				},
				inputParams: params,
			});
		},
		...options,
	});
}

export function DeleteTopic(
	options?: UseMutationOptions<any, ApiError, { topic_id: string }>
) {
	return useMutation<any, ApiError, { topic_id: string }>({
		mutationFn: async (body) => {
			return await mutationData({
				url: '/topic',
				method: 'DELETE',
				inputParams: {
					topic_id: body.topic_id,
				},
			});
		},
		...options,
	});
}
