import React from 'react';
import { useAuth } from '@/hooks';
import { Avatar as AvatarMUI } from '@mui/material';

function Avatar() {
	const { authData } = useAuth();

	return (
		<div>
			<AvatarMUI src=''>{authData?.name.split('')[0].toUpperCase()}</AvatarMUI>
		</div>
	);
}

export default Avatar;
