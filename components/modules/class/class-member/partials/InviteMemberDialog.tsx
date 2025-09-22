import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { CopyAll } from '@mui/icons-material';
import {
	Button,
	DialogActions,
	DialogTitle,
	IconButton,
	TextField,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { InviteClassMember } from '@/service/api/class/class.mutation';
import { InviteMemberSchema } from '@/schema/class.schema';

interface Props {
	classId: string;
	setIsInviteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
	onRefetch?: () => void;
}

function InviteMemberDialog({
	classId,
	setIsInviteDialogOpen,
	onRefetch,
}: Props) {
	const { mutateAsync, isPending } = InviteClassMember({
		onSuccess() {
			onRefetch && onRefetch();
			setIsInviteDialogOpen(false);
		},
		onError() {
			toast.error('Error on invite member');
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<{ email: string }>({
		resolver: zodResolver(InviteMemberSchema),
	});

	const onSubmit: SubmitHandler<{ email: string }> = (data) => {
		mutateAsync({
			class_id: classId,
			email: [data.email],
		});
	};

	return (
		<>
			<DialogTitle>Invite Member</DialogTitle>

			<div className='p-6'>
				<div className='mb-5'>
					<p className='text-sm font-semibold'>Invitation Link</p>

					<div className='flex flex-row items-center gap-3'>
						<p className='truncate text-sm text-gray-500'>
							http://localhost:3000/
						</p>

						<IconButton>
							<CopyAll />
						</IconButton>
					</div>
				</div>

				<form onSubmit={handleSubmit(onSubmit)}>
					<TextField
						fullWidth
						label='Email'
						placeholder='Insert Member Email'
						disabled={isPending}
						error={errors.email !== undefined}
						helperText={errors.email?.message}
						{...register('email')}
					/>

					<DialogActions>
						<Button
							sx={{ color: 'red' }}
							loading={isPending}
							disabled={isPending}
							onClick={() => setIsInviteDialogOpen(false)}
						>
							Cancel
						</Button>

						<Button type='submit' loading={isPending} disabled={isPending}>
							Invite
						</Button>
					</DialogActions>
				</form>
			</div>
		</>
	);
}

export default InviteMemberDialog;
