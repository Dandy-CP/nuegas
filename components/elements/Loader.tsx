import React from 'react';
import { CircularProgress } from '@mui/material';

function Loader() {
	return (
		<div className='flex h-[80vh] w-full flex-col items-center justify-center gap-3'>
			<CircularProgress />
			<p className='text-sm font-semibold'>Please Wait...</p>
		</div>
	);
}

export default Loader;
