import parse from 'html-react-parser';
import moment from 'moment';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { MoreVert } from '@mui/icons-material';
import { Card, Divider, IconButton, Menu, MenuItem } from '@mui/material';
import { UserAvatar } from '@/components/elements';
import { DeletePost } from '@/service/api/post/post.mutation';
import { Comment } from '../../comment';
import AttachmentPreview from './AttachmentPreview';

interface Props {
	postId: string;
	username: string;
	postedAt: string;
	postContent: string;
	attachment: string[];
	isClassOwner: boolean;
	onSuccess: () => void;
}

function PostCard({
	postId,
	username,
	postContent,
	attachment,
	postedAt,
	isClassOwner,
	onSuccess,
}: Props) {
	const [optionElement, setOptionElement] = useState<null | HTMLElement>(null);
	const openOption = Boolean(optionElement);

	const { mutateAsync } = DeletePost(
		{ post_id: postId },
		{
			onSuccess() {
				onSuccess();
			},
			onError() {
				toast.error('Error on delete post');
			},
		}
	);

	return (
		<Card elevation={0} variant='outlined' className='p-5'>
			<div className='flex flex-row justify-between'>
				<div className='flex flex-row gap-5'>
					<UserAvatar />

					<div>
						<p className='text-sm font-semibold'>{username}</p>
						<p className='text-sm text-gray-500'>
							{moment(postedAt).format('LLLL')}
						</p>
					</div>
				</div>

				{isClassOwner && (
					<IconButton
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
						Delete Post
					</MenuItem>
				</Menu>
			</div>

			<div className='my-5'>{parse(postContent)}</div>

			{attachment.length !== 0 && <AttachmentPreview attachment={attachment} />}

			<Divider sx={{ marginY: 2 }} />

			<Comment paramsId={{ post_id: postId }} />
		</Card>
	);
}

export default PostCard;
