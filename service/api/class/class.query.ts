import {
	QueryKey,
	useInfiniteQuery,
	UseInfiniteQueryOptions,
	useQuery,
	UseQueryOptions,
} from '@tanstack/react-query';
import { useInfiniteScroll } from '@/hooks';
import { fetchData } from '@/config/request';
import { ClassDetail, ClassMember, MyClass } from '@/types/class.types';
import {
	ApiError,
	SuccessResponse,
	SuccessResponsePagination,
} from '@/types/client.types';

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
	params?: { [key: string]: string | number },
	options?: UseQueryOptions<SuccessResponse<ClassDetail>, ApiError>
) {
	return useQuery<SuccessResponse<ClassDetail>, ApiError>({
		queryKey: ['class-detail'],
		queryFn: async () => {
			return await fetchData({
				url: '/class/detail',
				inputParams: {
					...params,
				},
			});
		},
		...options,
	});
}

interface InfiniteQuerySelectResult<T> {
	items: T[];
	totalItems: number;
}

export function GetClassMember(
	params?: { [key: string]: string | number },
	options?: UseInfiniteQueryOptions<
		SuccessResponsePagination<ClassMember[]>,
		ApiError,
		InfiniteQuerySelectResult<ClassMember>,
		QueryKey,
		number
	>
) {
	const query = useInfiniteQuery<
		SuccessResponsePagination<ClassMember[]>,
		ApiError,
		InfiniteQuerySelectResult<ClassMember>,
		QueryKey,
		number
	>({
		queryKey: ['class-member', params?.class_id],
		enabled: params?.class_id !== undefined,
		initialPageParam: 1,
		select: (data) => ({
			items: data.pages.flatMap((page) => page.data),
			totalItems: data.pages[0].meta.totalCount,
		}),
		queryFn: async ({ pageParam }) => {
			return await fetchData({
				url: '/class/member',
				inputParams: { page: pageParam, limit: 10, ...params },
			});
		},
		getNextPageParam: ({ meta }) => {
			if (!meta.isLastPage) {
				return meta.nextPage;
			}

			return undefined;
		},
		...options,
	});

	const infiniteRef = useInfiniteScroll<HTMLDivElement>({
		hasNextPage: query.hasNextPage,
		fetchNextPage: query.fetchNextPage,
	});

	return {
		...query,
		infiniteRef,
	};
}
