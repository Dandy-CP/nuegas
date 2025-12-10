import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchData } from '@/config/request';
import { ApiError, SuccessResponse } from '@/types/client.types';
import { MyTask } from '@/types/user.types';

export function GetMyTask(
	params?: { [key: string]: string | number },
	options?: UseQueryOptions<SuccessResponse<MyTask[]>, ApiError>
) {
	return useQuery<SuccessResponse<MyTask[]>, ApiError>({
		queryKey: ['my-task'],
		queryFn: async () => {
			return await fetchData({
				url: '/user/my-task',
				inputParams: params,
			});
		},
		...options,
	});
}
