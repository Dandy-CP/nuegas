import {
	QueryKey,
	useInfiniteQuery,
	UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import { useInfiniteScroll } from '@/hooks';
import { fetchData } from '@/config/request';
import { ApiError, SuccessResponsePagination } from '@/types/client.types';
import { Post } from '@/types/post.types';

export function GetClassPostTimeline(
	params?: { [key: string]: string | number },
	options?: UseInfiniteQueryOptions<
		SuccessResponsePagination<Post[]>, // Success Response from API
		ApiError, // Error Response
		Post[], // Data Response
		QueryKey, // Query-key type
		number // page params type
	>
) {
	const query = useInfiniteQuery<
		SuccessResponsePagination<Post[]>,
		ApiError,
		Post[],
		QueryKey,
		number
	>({
		queryKey: ['post-timeline', params],
		enabled: params?.class_id !== undefined,
		initialPageParam: 1,
		select: (data) => data.pages.flatMap((page) => page.data),
		queryFn: async ({ pageParam }) => {
			return await fetchData({
				url: '/post/timeline',
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
