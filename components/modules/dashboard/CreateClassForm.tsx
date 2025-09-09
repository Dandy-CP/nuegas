import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { CreateClassSchema } from '@/schema/class.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, DialogActions, DialogTitle, TextField } from '@mui/material';
import { CreateClass } from '@/service/api/class/class.mutation';
import { CreateClassBody } from '@/types/class.types';

interface Props {
	setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	onSuccess: () => void;
}

function CreateClassForm({ setIsModalOpen, onSuccess }: Props) {
	const { mutateAsync, isPending } = CreateClass({
		onSuccess() {
			onSuccess();
		},
		onError() {
			toast.error('Error on create new class');
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateClassBody>({
		resolver: zodResolver(CreateClassSchema),
	});

	const onSubmit: SubmitHandler<CreateClassBody> = (data) => {
		mutateAsync({
			class_name: data.class_name,
			class_description: data.class_description,
		});
	};

	return (
		<>
			<DialogTitle>Create New Class</DialogTitle>

			<div className='p-5'>
				<form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-8'>
					<TextField
						fullWidth
						label='Class name'
						error={errors.class_name !== undefined}
						helperText={errors.class_name?.message}
						disabled={isPending}
						{...register('class_name')}
					/>

					<TextField
						fullWidth
						label='Class description'
						error={errors.class_description !== undefined}
						helperText={errors.class_description?.message}
						disabled={isPending}
						{...register('class_description')}
					/>

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
							Create
						</Button>
					</DialogActions>
				</form>
			</div>
		</>
	);
}

export default CreateClassForm;
