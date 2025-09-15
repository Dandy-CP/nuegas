import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Send } from '@mui/icons-material';
import { IconButton, TextField } from '@mui/material';
import { UserAvatar } from '@/components/elements';
import { CreateComment } from '@/service/api/comment/comment.mutation';

interface Props {
	paramsId: { [key: string]: string | number };
	onSuccess: () => void;
}

function InputComment({ paramsId, onSuccess }: Props) {
	const [content, setContent] = useState('');

	const { mutateAsync, isPending } = CreateComment(paramsId, {
		onSuccess() {
			setContent('');
			onSuccess();
		},
		onError() {
			toast.error('Error on post comment');
		},
	});

	return (
		<div className='mt-5 flex flex-row justify-between gap-5'>
			<UserAvatar />

			<TextField
				value={content}
				label='Add comment'
				fullWidth
				size='small'
				disabled={isPending}
				onChange={(event) => setContent(event.target.value)}
				onKeyDown={(event) => {
					if (event.code === 'Enter' && content.length !== 0) {
						mutateAsync({ content: content });
					}
				}}
			/>

			<IconButton
				disabled={isPending || content.length === 0}
				onClick={() => {
					mutateAsync({ content: content });
				}}
			>
				<Send />
			</IconButton>
		</div>
	);
}

export default InputComment;
