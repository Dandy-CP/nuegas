import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, DialogActions, DialogTitle, TextField } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { AttachmentUrlSchema } from '@/schema/class.schema';

interface Props {
	setIsAttachmentDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleOnAddAttachment(url: string): void;
}

function AttachmentLinkForm({
	setIsAttachmentDialogOpen,
	handleOnAddAttachment,
}: Props) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<{ url: string }>({
		resolver: zodResolver(AttachmentUrlSchema),
	});

	const onSubmit: SubmitHandler<{ url: string }> = (data) => {
		handleOnAddAttachment(data.url);
		setIsAttachmentDialogOpen(false);
	};

	return (
		<>
			<DialogTitle>Add link attachment</DialogTitle>

			<div className='p-5'>
				<form onSubmit={handleSubmit(onSubmit)}>
					<TextField
						fullWidth
						label='Link'
						error={errors.url !== undefined}
						helperText={errors.url?.message}
						{...register('url')}
					/>

					<DialogActions>
						<Button
							sx={{ color: 'red' }}
							onClick={() => setIsAttachmentDialogOpen(false)}
						>
							Cancel
						</Button>

						<Button type='submit'>Add</Button>
					</DialogActions>
				</form>
			</div>
		</>
	);
}

export default AttachmentLinkForm;
