import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchData } from '@/config/request';
import { ApiError, SuccessResponse } from '@/types/client.types';
import { Post } from '@/types/post.types';

export function GetClassPostTimeline(
	params?: { [key: string]: string | number },
	options?: UseQueryOptions<SuccessResponse<Post[]>, ApiError>
) {
	return useQuery<SuccessResponse<Post[]>, ApiError>({
		queryKey: ['post-timeline'],
		queryFn: async () => {
			return await fetchData({
				url: '/post/timeline',
				inputParams: {
					class_id: params?.class_id ?? '',
					page: params?.page ?? 1,
					limit: params?.limit ?? 10,
				},
			});
		},
		...options,
	});
}
