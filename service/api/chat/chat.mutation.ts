import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { mutationData } from '@/config/request';
import { StartNewChatBody } from '@/types/chat.types';
import { ApiError } from '@/types/client.types';

export function StartNewChat(
	options?: UseMutationOptions<any, ApiError, StartNewChatBody>
) {
	return useMutation<any, ApiError, StartNewChatBody>({
		mutationFn: async (body) => {
			return await mutationData({
				url: '/chat/new-chat',
				method: 'POST',
				inputParams: {
					receiverId: body.receiverId,
				},
			});
		},
		...options,
	});
}
