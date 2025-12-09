import Image from 'next/image';
import React from 'react';
import { Refresh } from '@mui/icons-material';
import { Button } from '@mui/material';

interface Props {
	message?: string;
	showRefetch?: boolean;
	onRefetch?: () => void;
}

function ErrorView({ message, showRefetch = true, onRefetch }: Props) {
	return (
		<div className='flex flex-col items-center gap-5'>
			<Image
				src='/images/error_state.svg'
				alt=''
				width={200}
				height={200}
				className='mx-auto'
			/>

			<p className='text-center text-sm font-semibold text-gray-500'>
				{!message ? 'Opps something wrong, please try again' : message}
			</p>

			{showRefetch && (
				<Button
					variant='contained'
					onClick={() => {
						onRefetch && onRefetch();
					}}
					startIcon={<Refresh />}
				>
					Try Again
				</Button>
			)}
		</div>
	);
}

export default ErrorView;
