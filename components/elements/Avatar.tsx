import React from 'react';
import { Avatar as AvatarMUI } from '@mui/material';
import { useAuth } from '@/hooks';

function Avatar() {
	const { authData } = useAuth();

	return (
		<div>
			<AvatarMUI src={authData?.profile_image ?? ''}>
				{authData?.name.split('')[0].toUpperCase()}
			</AvatarMUI>
		</div>
	);
}

export default Avatar;
