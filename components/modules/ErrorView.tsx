import React from 'react';
import Image from 'next/image';
import { Refresh } from '@mui/icons-material';
import { Button } from '@mui/material';

interface Props {
	message?: string;
	onRefetch: () => void;
}

function ErrorView({ message, onRefetch }: Props) {
	return (
		<div className='flex flex-col gap-5'>
			<Image
				src='/images/error_state.svg'
				alt=''
				width={200}
				height={200}
				className='mx-auto'
			/>

			<p className='text-sm font-semibold text-gray-500'>
				{!message ? 'Opps something wrong, please try again' : message}
			</p>

			<Button
				variant='contained'
				size='small'
				onClick={() => onRefetch()}
				startIcon={<Refresh />}
			>
				Try Again
			</Button>
		</div>
	);
}

export default ErrorView;
