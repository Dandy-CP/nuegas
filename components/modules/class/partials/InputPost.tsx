import React, { useState } from 'react';
import Editor, {
	BtnBold,
	BtnItalic,
	BtnUnderline,
	Toolbar,
} from 'react-simple-wysiwyg';
import { toast } from 'react-toastify';
import { Link, Upload } from '@mui/icons-material';
import { Button, Dialog, IconButton, Tooltip } from '@mui/material';
import { CreatePost } from '@/service/api/post/post.mutation';
import AttachmentLinkForm from '../AttachmentLinkForm';
import UploadFileForm from '../UploadFileForm';
import AttachmentPreview from './AttachmentPreview';

interface Props {
	classId: string;
	setIsWritingPost: React.Dispatch<React.SetStateAction<boolean>>;
	onSuccess: () => void;
}

function InputPost({ classId, setIsWritingPost, onSuccess }: Props) {
	const [postContent, setPostContent] = useState('');
	const [attachment, setAttachment] = useState<string[]>([]);
	const [isAttachmentDialogOpen, setIsAttachmentDialogOpen] = useState(false);
	const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

	const { mutateAsync, isPending } = CreatePost(
		{ class_id: classId },
		{
			onSuccess() {
				setPostContent('');
				setIsWritingPost(false);
				onSuccess();
			},
			onError() {
				toast.error('Error on create class post');
			},
		}
	);

	function handleOnAddAttachment(url: string) {
		setAttachment((prev) => [...prev, url]);
	}

	function handleOnDeleteAttachment(index: number) {
		const updatedAttachment = attachment.filter((_, idx) => idx !== index);

		setAttachment(updatedAttachment);
	}

	async function onSubmitPost() {
		mutateAsync({
			content: postContent,
			attachment: attachment,
		});
	}

	return (
		<div>
			<Editor
				value={postContent}
				onChange={(e) => setPostContent(e.target.value)}
				disabled={isPending}
				containerProps={{
					style: {
						height: 250,
						backgroundColor: '#F0F3F4',
						borderRadius: 5,
						border: 'none',
						flexDirection: 'column-reverse',
					},
				}}
			>
				<Toolbar>
					<BtnBold />
					<BtnItalic />
					<BtnUnderline />
				</Toolbar>
			</Editor>

			<div className='mt-5 mb-5 flex flex-row justify-between'>
				<div className='flex flex-row gap-3'>
					<Tooltip title='Upload file'>
						<IconButton
							disabled={isPending}
							onClick={() => setIsUploadDialogOpen(true)}
						>
							<Upload />
						</IconButton>
					</Tooltip>

					<Tooltip title='Attach Link'>
						<IconButton
							disabled={isPending}
							onClick={() => setIsAttachmentDialogOpen(true)}
						>
							<Link />
						</IconButton>
					</Tooltip>
				</div>

				<div className='flex flex-row gap-5'>
					<Button
						loading={isPending}
						disabled={isPending}
						onClick={() => setIsWritingPost(false)}
					>
						Cancel
					</Button>

					<Button
						variant='contained'
						loading={isPending}
						disabled={isPending || postContent.length === 0}
						onClick={() => onSubmitPost()}
					>
						Post
					</Button>
				</div>
			</div>

			<AttachmentPreview
				showDelete
				attachment={attachment}
				onDeleteAttachment={handleOnDeleteAttachment}
			/>

			<Dialog fullWidth open={isAttachmentDialogOpen}>
				<AttachmentLinkForm
					handleOnAddAttachment={handleOnAddAttachment}
					setIsAttachmentDialogOpen={setIsAttachmentDialogOpen}
				/>
			</Dialog>

			<Dialog fullWidth open={isUploadDialogOpen}>
				<UploadFileForm
					setIsUploadDialogOpen={setIsUploadDialogOpen}
					handleOnAddAttachment={handleOnAddAttachment}
				/>
			</Dialog>
		</div>
	);
}

export default InputPost;
