import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchData } from '@/config/request';
import { ApiError, SuccessResponse } from '@/types/client.types';
import { Comment } from '@/types/comment.types';

export function GetComment(
	params?: { [key: string]: string | number },
	options?: UseQueryOptions<SuccessResponse<Comment[]>, ApiError>
) {
	return useQuery<SuccessResponse<Comment[]>, ApiError>({
		queryKey: ['comment'],
		queryFn: async () => {
			return await fetchData({
				url: '/comment',
				inputParams: params,
			});
		},
		...options,
	});
}
