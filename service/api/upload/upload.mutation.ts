import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { mutationFormData } from '@/config/request';
import { ApiError } from '@/types/client.types';

export function UploadFile(
	options?: UseMutationOptions<any, ApiError, { file: File }>
) {
	return useMutation<any, ApiError, { file: File }>({
		mutationFn: async (body) => {
			return await mutationFormData({
				url: '/files/upload',
				method: 'POST',
				body: {
					file: body.file,
				},
			});
		},
		...options,
	});
}
