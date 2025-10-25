import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchData } from '@/config/request';
import {
	Assignment,
	Submission,
	SubmissionResult,
} from '@/types/assignment.types';
import {
	ApiError,
	SuccessResponse,
	SuccessResponsePagination,
} from '@/types/client.types';

export function GetAssignmentList(
	params?: { [key: string]: string | number },
	options?: UseQueryOptions<SuccessResponse<Assignment[]>, ApiError>
) {
	return useQuery<SuccessResponse<Assignment[]>, ApiError>({
		queryKey: ['class-assignment'],
		queryFn: async () => {
			return await fetchData({
				url: '/assignment',
				inputParams: params,
			});
		},
		...options,
	});
}

export function GetAssignmentDetail(
	params?: { [key: string]: string | number },
	options?: UseQueryOptions<SuccessResponse<Assignment>, ApiError>
) {
	return useQuery<SuccessResponse<Assignment>, ApiError>({
		queryKey: ['assignment-detail'],
		queryFn: async () => {
			return await fetchData({
				url: '/assignment/detail',
				inputParams: params,
			});
		},
		...options,
	});
}

export function GetSubmissionDetail(
	params?: { [key: string]: string | number },
	options?: UseQueryOptions<SuccessResponse<Submission>, ApiError>
) {
	return useQuery<SuccessResponse<Submission>, ApiError>({
		queryKey: ['submission-detail'],
		queryFn: async () => {
			return await fetchData({
				url: '/assignment/result-detail',
				inputParams: params,
			});
		},
		...options,
	});
}

export function GetAllSubmissionResult(
	params?: { [key: string]: string | number },
	options?: UseQueryOptions<
		SuccessResponsePagination<SubmissionResult[]>,
		ApiError
	>
) {
	return useQuery<SuccessResponsePagination<SubmissionResult[]>, ApiError>({
		queryKey: ['all-submission-result'],
		queryFn: async () => {
			return await fetchData({
				url: '/assignment/all-member-result',
				inputParams: params,
			});
		},
		...options,
	});
}
