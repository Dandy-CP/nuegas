import { useEffect, useRef } from 'react';

interface UseInfiniteScrollProps {
	hasNextPage: boolean;
	fetchNextPage: () => void;
	threshold?: number;
	debounceMs?: number;
}

function useInfiniteScroll<T extends HTMLElement>({
	hasNextPage,
	fetchNextPage,
	threshold = 1,
	debounceMs = 1000,
}: UseInfiniteScrollProps) {
	const loaderRef = useRef<T | null>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (!loaderRef.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage) {
					if (timeoutRef.current) clearTimeout(timeoutRef.current);

					timeoutRef.current = setTimeout(() => {
						fetchNextPage();
					}, debounceMs);
				}
			},
			{ threshold }
		);

		observer.observe(loaderRef.current);

		return () => {
			// eslint-disable-next-line react-hooks/exhaustive-deps
			if (loaderRef.current) observer.unobserve(loaderRef.current);
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, [hasNextPage, fetchNextPage, threshold, debounceMs]);

	return loaderRef;
}

export default useInfiniteScroll;
