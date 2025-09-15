import parse from 'html-react-parser';
import moment from 'moment';
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
	Skeleton,
} from '@mui/material';
import { UserAvatar } from '@/components/elements';
import { GetComment } from '@/service/api/comment/comment.query';
import { DeletePost } from '@/service/api/post/post.mutation';
import ErrorView from '../../ErrorView';
import AttachmentPreview from './AttachmentPreview';
import InputComment from './InputComment';
import PostComment from './PostComment';

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
	const [commentLimit, setCommentLimit] = useState(1);
	const openOption = Boolean(optionElement);

	const { data, isError, hasNextPage, infiniteRef, refetch } = GetComment({
		post_id: postId,
		limit: commentLimit,
	});

	const comment = data?.items ?? [];
	const totalComment = data?.totalItems ?? 0;

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

			{comment.length !== 0 && (
				<Button
					variant='text'
					size='small'
					startIcon={<Group />}
					onClick={() => {
						setCommentLimit(5);
					}}
				>
					{totalComment} Comment Class
				</Button>
			)}

			<div className='flex max-h-[200px] flex-col overflow-auto'>
				{comment.map((value) => (
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

				{hasNextPage && commentLimit !== 1 && (
					<div ref={infiniteRef} className='mt-3 flex flex-col gap-3'>
						{Array(2)
							.fill('')
							.map((_, index) => (
								<Skeleton key={index} variant='rounded' height={80} />
							))}
					</div>
				)}
			</div>

			{isError && (
				<div className='mt-5'>
					<ErrorView
						onRefetch={() => {
							refetch();
						}}
					/>
				</div>
			)}

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
