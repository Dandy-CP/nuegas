import moment from 'moment';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { MoreVert } from '@mui/icons-material';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { UserAvatar } from '@/components/elements';
import { useAuth } from '@/hooks';
import { DeleteComment } from '@/service/api/comment/comment.mutation';

interface Props {
	showAvatar?: boolean;
	commentId: string;
	username: string;
	commentedAt: string;
	content: string;
	onSuccess: () => void;
}

function PostComment({
	showAvatar = true,
	commentId,
	username,
	content,
	commentedAt,
	onSuccess,
}: Props) {
	const [optionElement, setOptionElement] = useState<null | HTMLElement>(null);
	const openOption = Boolean(optionElement);

	const { authData } = useAuth();

	const { mutateAsync, isPending } = DeleteComment(
		{ comment_id: commentId },
		{
			onSuccess() {
				onSuccess();
			},
			onError() {
				toast.error('Error on delete comment');
			},
		}
	);

	return (
		<div className='flex flex-row items-center gap-5 rounded-md p-3 hover:bg-gray-100'>
			{showAvatar && <UserAvatar />}

			<div className='flex w-full flex-row items-center justify-between'>
				<div>
					<div className='flex flex-row items-center gap-2'>
						<p className='text-sm font-semibold'>{username}</p>
						<p className='text-xs text-gray-500'>
							{moment(commentedAt).format('ll')}
						</p>
					</div>

					<p>{content}</p>
				</div>

				{authData?.name === username && (
					<IconButton
						disabled={isPending}
						onClick={(event) => setOptionElement(event.currentTarget)}
					>
						<MoreVert />
					</IconButton>
				)}

				<Menu
					id='basic-menu'
					anchorEl={optionElement}
					open={openOption}
					onClose={() => setOptionElement(null)}
					slotProps={{
						list: {
							'aria-labelledby': 'basic-button',
						},
					}}
				>
					<MenuItem
						onClick={() => {
							setOptionElement(null);
							mutateAsync();
						}}
						sx={{ color: 'red' }}
					>
						Delete Comment
					</MenuItem>
				</Menu>
			</div>
		</div>
	);
}

export default PostComment;
