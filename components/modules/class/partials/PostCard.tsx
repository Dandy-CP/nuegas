import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Group, MoreVert } from '@mui/icons-material';
import {
	Button,
	Card,
	Divider,
	IconButton,
	Menu,
	MenuItem,
} from '@mui/material';
import parse from 'html-react-parser';
import moment from 'moment';
import { UserAvatar } from '@/components/elements';
import { GetComment } from '@/service/api/comment/comment.query';
import { DeletePost } from '@/service/api/post/post.mutation';
import InputComment from './InputComment';
import PostComment from './PostComment';

interface Props {
	postId: string;
	username: string;
	postedAt: string;
	postContent: string;
	isClassOwner: boolean;
	onSuccess: () => void;
}

function PostCard({
	postId,
	username,
	postContent,
	postedAt,
	isClassOwner,
	onSuccess,
}: Props) {
	const [optionElement, setOptionElement] = useState<null | HTMLElement>(null);
	const [showAllComment, setIsShowAllComment] = useState(false);
	const openOption = Boolean(optionElement);

	const { data, refetch } = GetComment(
		{
			post_id: postId,
			page: 1,
			limit: 10,
		},
		{
			queryKey: [postId],
		}
	);

	const comment = data?.data ?? [];

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

			<Divider sx={{ marginY: 2 }} />

			{comment.length !== 0 && (
				<Button
					size='small'
					startIcon={<Group />}
					sx={{ marginBottom: 1 }}
					onClick={() => setIsShowAllComment((prev) => !prev)}
				>
					<p>{comment.length} Class Comment</p>
				</Button>
			)}

			<div className='flex flex-col'>
				{comment.slice(showAllComment ? 0 : comment.length - 1).map((value) => (
					<PostComment
						key={value.comment_id}
						commentId={value.comment_id}
						username={value.user.name}
						content={value.content}
						commentedAt={value.created_at}
						onSuccess={() => {
							refetch();
						}}
					/>
				))}
			</div>

			<InputComment
				paramsId={{ post_id: postId }}
				onSuccess={() => {
					refetch();
				}}
			/>
		</Card>
	);
}

export default PostCard;
