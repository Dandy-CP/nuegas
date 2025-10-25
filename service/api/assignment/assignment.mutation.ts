import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { mutationData } from '@/config/request';
import {
	CreateAssignmentBody,
	UpdateAssignmentBody,
} from '@/types/assignment.types';
import { ApiError } from '@/types/client.types';

export function CreateAssignmentTask(
	params?: { [key: string]: string | number },
	options?: UseMutationOptions<any, ApiError, CreateAssignmentBody>
) {
	return useMutation<any, ApiError, CreateAssignmentBody>({
		mutationFn: async (body) => {
			return await mutationData({
				url: '/assignment',
				method: 'POST',
				body: body,
				inputParams: params,
			});
		},
		...options,
	});
}

export function UpdateAssignmentTask(
	params?: { [key: string]: string | number },
	options?: UseMutationOptions<any, ApiError, UpdateAssignmentBody>
) {
	return useMutation<any, ApiError, UpdateAssignmentBody>({
		mutationFn: async (body) => {
			return await mutationData({
				url: '/assignment',
				method: 'PUT',
				body: body,
				inputParams: params,
			});
		},
		...options,
	});
}

export function DeleteAssignmentTask(
	params?: { [key: string]: string | number },
	options?: UseMutationOptions<any, ApiError>
) {
	return useMutation<any, ApiError>({
		mutationFn: async () => {
			return await mutationData({
				url: '/assignment',
				method: 'DELETE',
				inputParams: params,
			});
		},
		...options,
	});
}

export function CreateSubmissionResult(
	params?: { [key: string]: string | number },
	options?: UseMutationOptions<any, ApiError, { attachment: string[] }>
) {
	return useMutation<any, ApiError, { attachment: string[] }>({
		mutationFn: async (body) => {
			return await mutationData({
				url: '/assignment/result',
				method: 'POST',
				body: body,
				inputParams: params,
			});
		},
		...options,
	});
}

export function UpdateSubmissionResult(
	params?: { [key: string]: string | number },
	options?: UseMutationOptions<any, ApiError, { attachment: string[] }>
) {
	return useMutation<any, ApiError, { attachment: string[] }>({
		mutationFn: async (body) => {
			return await mutationData({
				url: '/assignment/result',
				method: 'PUT',
				body: body,
				inputParams: params,
			});
		},
		...options,
	});
}

export function GivePointResult(
	params?: { [key: string]: string | number },
	options?: UseMutationOptions<any, ApiError, { point: number }>
) {
	return useMutation<any, ApiError, { point: number }>({
		mutationFn: async (body) => {
			return await mutationData({
				url: '/assignment/result-point',
				method: 'POST',
				body: body,
				inputParams: params,
			});
		},
		...options,
	});
}
