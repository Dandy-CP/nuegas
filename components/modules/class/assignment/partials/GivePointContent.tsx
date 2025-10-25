import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Button, DialogActions, DialogTitle, TextField } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { GivePointResult } from '@/service/api/assignment/assignment.mutation';
import { GivePointResultSchema } from '@/schema/class.schema';

interface Props {
	selectedName: string;
	assignmentId: string;
	resultId: string;
	setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	onSuccess: () => void;
}

function GivePointContent({
	selectedName,
	assignmentId,
	resultId,
	setIsModalOpen,
	onSuccess,
}: Props) {
	const { mutateAsync, isPending } = GivePointResult(
		{
			assignment_id: assignmentId,
			result_id: resultId,
		},
		{
			onSuccess() {
				onSuccess();
				setIsModalOpen(false);
			},
			onError() {
				toast.error('Error on give point');
			},
		}
	);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<{ point: number }>({
		resolver: zodResolver(GivePointResultSchema),
	});

	const onSubmit: SubmitHandler<{ point: number }> = (data) => {
		mutateAsync({ point: data.point });
	};

	return (
		<>
			<DialogTitle>Give Point to {selectedName}</DialogTitle>

			<div className='p-5'>
				<form onSubmit={handleSubmit(onSubmit)}>
					<TextField
						placeholder='Give point 1 - 100'
						type='number'
						fullWidth
						slotProps={{
							htmlInput: {
								min: 1,
								max: 100,
							},
						}}
						error={errors.point !== undefined}
						helperText={errors.point?.message}
						{...register('point', { valueAsNumber: true })}
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
							Give Point
						</Button>
					</DialogActions>
				</form>
			</div>
		</>
	);
}

export default GivePointContent;
