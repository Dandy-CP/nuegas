import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchData } from '@/config/request';
import { MyClass } from '@/types/class.types';
import { ApiError, SuccessResponse } from '@/types/client.types';

export function GetMyClass(
	options?: UseQueryOptions<SuccessResponse<MyClass[]>, ApiError>
) {
	return useQuery<SuccessResponse<MyClass[]>, ApiError>({
		queryKey: ['my-class'],
		queryFn: async () => {
			return await fetchData({
				url: '/class/my-class',
				inputParams: {
					page: 1,
					limit: 10,
				},
			});
		},
		...options,
	});
}

export function GetJoinedClass(
	options?: UseQueryOptions<SuccessResponse<MyClass[]>, ApiError>
) {
	return useQuery<SuccessResponse<MyClass[]>, ApiError>({
		queryKey: ['joined-class'],
		queryFn: async () => {
			return await fetchData({
				url: '/class/joined-class',
				inputParams: {
					page: 1,
					limit: 10,
				},
			});
		},
		...options,
	});
}
