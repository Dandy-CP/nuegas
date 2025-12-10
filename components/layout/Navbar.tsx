import React from 'react';
import { Logout } from '@mui/icons-material';
import {
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Skeleton,
	Tooltip,
} from '@mui/material';
import { useAuth } from '@/hooks';
import { UserAvatar } from '../elements';

function Navbar() {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const { authData, signOut } = useAuth();

	const isMenuOpen = Boolean(anchorEl);

	const handleOnClose = () => {
		setAnchorEl(null);
	};

	return (
		<div className='flex h-[80px] w-full flex-row items-center justify-between px-6'>
			<div className='flex flex-col gap-1'>
				{authData?.name ? (
					<h1 className='text-2xl font-semibold'>Hi, {authData?.name}</h1>
				) : (
					<Skeleton width={200} height={50} />
				)}

				<p className='text-sm font-medium'>Lets finish your task today!</p>
			</div>

			<Tooltip title='Account'>
				<IconButton
					onClick={(event) => setAnchorEl(event.currentTarget)}
					size='small'
					sx={{ ml: 2 }}
					aria-controls={isMenuOpen ? 'account-menu' : undefined}
					aria-haspopup='true'
					aria-expanded={isMenuOpen ? 'true' : undefined}
				>
					<UserAvatar />
				</IconButton>
			</Tooltip>

			<Menu
				anchorEl={anchorEl}
				id='account-menu'
				open={isMenuOpen}
				onClose={handleOnClose}
				onClick={handleOnClose}
				slotProps={{
					paper: {
						elevation: 0,
						sx: {
							overflow: 'visible',
							filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							mt: 1.5,
							'& .MuiAvatar-root': {
								width: 32,
								height: 32,
								ml: -0.5,
								mr: 1,
							},
							'&::before': {
								content: '""',
								display: 'block',
								position: 'absolute',
								top: 0,
								right: 14,
								width: 10,
								height: 10,
								bgcolor: 'background.paper',
								transform: 'translateY(-50%) rotate(45deg)',
								zIndex: 0,
							},
						},
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<MenuItem
					onClick={() => {
						signOut();
					}}
					sx={{ color: 'red' }}
				>
					<ListItemIcon>
						<Logout fontSize='small' sx={{ color: 'red' }} />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
		</div>
	);
}

export default Navbar;
