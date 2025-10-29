import React, { useState } from 'react';
import { Group } from '@mui/icons-material';
import { Button, Skeleton } from '@mui/material';
import { GetComment } from '@/service/api/comment/comment.query';
import ErrorView from '../ErrorView';
import InputComment from './partials/InputComment';
import PostComment from './partials/PostComment';

interface Props {
	paramsId: { [key: string]: string };
	showAvatar?: boolean;
}

function Comment({ paramsId, showAvatar = true }: Props) {
	const [commentLimit, setCommentLimit] = useState(1);

	const { data, isError, hasNextPage, infiniteRef, refetch } = GetComment({
		...paramsId,
		limit: commentLimit,
	});

	const commentData = data?.items ?? [];
	const totalComment = data?.totalItems ?? 0;

	return (
		<div>
			{commentData.length !== 0 && (
				<Button
					variant='text'
					size='small'
					startIcon={<Group />}
					onClick={() => {
						setCommentLimit(5);
					}}
				>
					{totalComment} Comment
				</Button>
			)}

			<div className='flex max-h-[200px] flex-col overflow-auto'>
				{commentData.map((value) => (
					<PostComment
						key={value.comment_id}
						commentId={value.comment_id}
						username={value.user.name}
						content={value.content}
						commentedAt={value.created_at}
						showAvatar={showAvatar}
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
				paramsId={paramsId}
				showAvatar={showAvatar}
				onSuccess={() => {
					refetch();
				}}
			/>
		</div>
	);
}

export default Comment;
