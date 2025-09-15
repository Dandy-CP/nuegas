import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
	Avatar,
	Button,
	DialogActions,
	DialogTitle,
	TextField,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks';
import { JoinClass } from '@/service/api/class/class.mutation';
import { JoinClassBody } from '@/types/class.types';
import { JoinClassSchema } from '@/schema/class.schema';

interface Props {
	setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	onSuccess: () => void;
}

function JoinClassForm({ setIsModalOpen, onSuccess }: Props) {
	const { authData } = useAuth();

	const { mutateAsync, isPending } = JoinClass({
		onSuccess() {
			onSuccess();
		},
		onError() {
			toast.error('Error on join class');
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<JoinClassBody>({
		resolver: zodResolver(JoinClassSchema),
	});

	const onSubmit: SubmitHandler<JoinClassBody> = (data) => {
		mutateAsync({
			class_code: data.class_code,
		});
	};

	return (
		<>
			<DialogTitle>Join Class</DialogTitle>

			<div className='p-5'>
				<div className='rounded-xl bg-gray-300 p-3 py-5'>
					<p className='mb-5 text-sm font-semibold'>
						You are currently logged in as
					</p>

					<div className='flex flex-row items-center gap-5'>
						<Avatar>{authData?.name.split('')[0].toUpperCase()}</Avatar>

						<div>
							<p>{authData?.name}</p>
							<p className='text-sm'>{authData?.email}</p>
						</div>
					</div>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className='mt-5'>
					<div className='flex flex-col gap-5 rounded-xl bg-gray-300 p-3 py-5'>
						<div>
							<p className='text-sm font-semibold'>Class Code</p>
							<p className='text-sm'>
								Ask your owner for the class code, then enter it here.
							</p>
						</div>

						<TextField
							label='Class Code'
							fullWidth
							error={errors.class_code !== undefined}
							helperText={errors.class_code?.message}
							disabled={isPending}
							{...register('class_code')}
						/>
					</div>

					<div className='my-5'>
						<p className='text-sm font-semibold'>
							To log in using a class code
						</p>

						<ul className='list-disc p-5 text-sm'>
							<li>Use an authorized account</li>

							<li>
								Use a class code consisting of 5-8 letters or numbers, no spaces
								or symbols
							</li>
						</ul>
					</div>

					<DialogActions>
						<Button
							sx={{ color: 'red' }}
							onClick={() => setIsModalOpen(false)}
							disabled={isPending}
							loading={isPending}
						>
							Cancel
						</Button>

						<Button type='submit' disabled={isPending} loading={isPending}>
							Join
						</Button>
					</DialogActions>
				</form>
			</div>
		</>
	);
}

export default JoinClassForm;
