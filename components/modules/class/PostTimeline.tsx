import React from 'react';
import { Card } from '@mui/material';
import { UserAvatar } from '@/components/elements';
import { GetClassPostTimeline } from '@/service/api/post/post.query';
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
	const { data, refetch } = GetClassPostTimeline(
		{ class_id: classId },
		{
			queryKey: [],
			enabled: classId !== undefined,
		}
	);

	const postTimeline = data?.data ?? [];

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
						postedAt={value.created_at}
						isClassOwner={isClassOwner}
						onSuccess={() => {
							refetch();
						}}
					/>
				))}
			</div>
		</>
	);
}

export default PostTimeline;
