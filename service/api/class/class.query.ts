import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchData } from '@/config/request';
import { ClassDetail, MyClass } from '@/types/class.types';
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

export function GetClassDetail(
	params: { class_id: string },
	options?: UseQueryOptions<SuccessResponse<ClassDetail>, ApiError>
) {
	return useQuery<SuccessResponse<ClassDetail>, ApiError>({
		queryKey: ['class-detail'],
		queryFn: async () => {
			return await fetchData({
				url: '/class/detail',
				inputParams: {
					class_id: params.class_id,
				},
			});
		},
		...options,
	});
}
