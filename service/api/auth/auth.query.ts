import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchData } from '@/config/request';
import { LoggedInUser } from '@/types/auth.types';
import { ApiError, SuccessResponse } from '@/types/client.types';

export function GetLoggedInUser(
	options?: UseQueryOptions<SuccessResponse<LoggedInUser>, ApiError>
) {
	return useQuery<SuccessResponse<LoggedInUser>, ApiError>({
		queryKey: ['loggedIn-user'],
		queryFn: async () => {
			return await fetchData({
				url: '/auth/logged-user',
			});
		},
		...options,
	});
}
