import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useState } from 'react';
import { mutationFormData } from '@/config/request';
import { ApiError, SuccessResponse } from '@/types/client.types';

interface UploadResponse {
	file_id: string;
	filename: string;
	url: string;
	mimetype: string;
	size: number;
	uploaded_by: string;
	created_at: string;
}

export function UploadFile(
	options?: UseMutationOptions<
		SuccessResponse<UploadResponse>,
		ApiError,
		{ file: File }
	>
) {
	const [progress, setProgress] = useState(0);

	const mutation = useMutation<
		SuccessResponse<UploadResponse>,
		ApiError,
		{ file: File }
	>({
		mutationFn: async (body) => {
			return await mutationFormData({
				url: '/files/upload',
				method: 'POST',
				body: {
					file: body.file,
				},
				config: {
					onUploadProgress(progressEvent) {
						if (progressEvent.total) {
							const percent = Math.round(
								(progressEvent.loaded * 100) / progressEvent.total
							);
							setProgress(percent);
						}
					},
				},
			});
		},
		...options,
	});

	return {
		...mutation,
		progress,
	};
}
