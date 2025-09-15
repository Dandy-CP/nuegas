import React from 'react';
import { Card, Skeleton } from '@mui/material';
import { UserAvatar } from '@/components/elements';
import { GetClassPostTimeline } from '@/service/api/post/post.query';
import ErrorView from '../ErrorView';
import { InputPost, PostCard } from './partials';

interface Props {
	classId: string;
	isWritingPost: boolean;
	isClassOwner: boolean;
	setIsWritingPost: React.Dispatch<React.SetStateAction<boolean>>;
}

function PostTimeline({
	classId,
	isWritingPost,
	isClassOwner,
	setIsWritingPost,
}: Props) {
	const { data, isError, hasNextPage, infiniteRef, refetch } =
		GetClassPostTimeline({ class_id: classId });

	const postTimeline = data ?? [];

	return (
		<>
			<Card elevation={3} className='flex flex-col gap-5 p-5'>
				<button
					className='flex cursor-pointer flex-row items-center gap-5'
					onClick={() => setIsWritingPost(true)}
				>
					<UserAvatar />
					<p className='text-md'>Announce something to your class</p>
				</button>

				{isWritingPost && (
					<InputPost
						classId={classId}
						setIsWritingPost={setIsWritingPost}
						onSuccess={() => {
							refetch();
						}}
					/>
				)}
			</Card>

			<div className='flex flex-col gap-5 pt-5'>
				{postTimeline.map((value) => (
					<PostCard
						key={value.post_id}
						postId={value.post_id}
						username={value.user.name}
						postContent={value.content}
						attachment={value.attachment}
						postedAt={value.created_at}
						isClassOwner={isClassOwner}
						onSuccess={() => {
							refetch();
						}}
					/>
				))}

				{hasNextPage && (
					<div ref={infiniteRef} className='flex flex-col gap-5'>
						{Array(2)
							.fill('')
							.map((_, index) => (
								<Skeleton key={index} variant='rounded' height={200} />
							))}
					</div>
				)}
			</div>

			{isError && (
				<div className='my-40 flex flex-col items-center'>
					<ErrorView onRefetch={() => refetch()} />
				</div>
			)}
		</>
	);
}

export default PostTimeline;
