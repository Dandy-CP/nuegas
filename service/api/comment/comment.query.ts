import {
	QueryKey,
	useInfiniteQuery,
	UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import { useInfiniteScroll } from '@/hooks';
import { fetchData } from '@/config/request';
import { ApiError, SuccessResponsePagination } from '@/types/client.types';
import { Comment } from '@/types/comment.types';

interface InfiniteQuerySelectResult<T> {
	items: T[];
	totalItems: number;
}

export function GetComment(
	params?: { [key: string]: string | number },
	options?: UseInfiniteQueryOptions<
		SuccessResponsePagination<Comment[]>,
		ApiError,
		InfiniteQuerySelectResult<Comment>,
		QueryKey,
		number
	>
) {
	const query = useInfiniteQuery<
		SuccessResponsePagination<Comment[]>,
		ApiError,
		InfiniteQuerySelectResult<Comment>,
		QueryKey,
		number
	>({
		queryKey: [
			'comment',
			params?.post_id,
			params?.assignment_id,
			params?.assignments_result_id,
			params?.limit,
		],
		initialPageParam: 1,
		select: (data) => ({
			items: data.pages.flatMap((page) => page.data),
			totalItems: data.pages[0].meta.totalCount,
		}),
		queryFn: async ({ pageParam }) => {
			return await fetchData({
				url: '/comment',
				inputParams: {
					page: pageParam,
					limit: params?.limit ?? 5,
					...params,
				},
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
