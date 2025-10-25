import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchData } from '@/config/request';
import { ApiError, SuccessResponse } from '@/types/client.types';
import { Topic } from '@/types/topic.types';

export function GetClassTopic(
	params?: { [key: string]: string | number },
	options?: UseQueryOptions<SuccessResponse<Topic[]>, ApiError>
) {
	return useQuery<SuccessResponse<Topic[]>, ApiError>({
		queryKey: ['class-topic'],
		queryFn: async () => {
			return await fetchData({
				url: '/topic',
				inputParams: params,
			});
		},
		...options,
	});
}
