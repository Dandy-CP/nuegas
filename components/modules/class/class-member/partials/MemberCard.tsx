import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { MoreVert } from '@mui/icons-material';
import { Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { DeleteClassMember } from '@/service/api/class/class.mutation';

interface Props {
	profileImage: string | null;
	role: string;
	name: string;
	memberId: string;
	userId: string;
	isClassOwner: boolean;
	showOption?: boolean;
	onRefetch?: () => void;
}

function MemberCard({
	name,
	role,
	profileImage,
	memberId,
	isClassOwner,
	showOption = true,
	onRefetch,
}: Props) {
	const [optionElement, setOptionElement] = useState<null | HTMLElement>(null);
	const openOption = Boolean(optionElement);

	const { mutateAsync, isPending } = DeleteClassMember({
		onSuccess() {
			onRefetch && onRefetch();
		},
		onError() {
			toast.error('Error on remove member');
		},
	});

	return (
		<div className='flex cursor-pointer flex-row items-center justify-between rounded-lg p-3 hover:bg-gray-200'>
			<div className='flex flex-row items-center gap-5'>
				<Avatar src={profileImage ?? ''}>
					{name?.split('')[0].toUpperCase()}
				</Avatar>

				<p>{name}</p>
			</div>

			{showOption && (
				<IconButton
					disabled={isPending}
					onClick={(event) => setOptionElement(event.currentTarget)}
				>
					<MoreVert />
				</IconButton>
			)}

			<Menu
				id='basic-menu'
				anchorEl={optionElement}
				open={openOption}
				onClose={() => setOptionElement(null)}
				slotProps={{
					list: {
						'aria-labelledby': 'basic-button',
					},
				}}
			>
				<MenuItem
					onClick={() => {
						setOptionElement(null);
					}}
				>
					Send Message
				</MenuItem>

				{isClassOwner && (
					<MenuItem
						onClick={() => {
							setOptionElement(null);
							mutateAsync({
								member_id: memberId,
							});
						}}
						sx={{ color: 'red' }}
					>
						Remove Member
					</MenuItem>
				)}
			</Menu>
		</div>
	);
}

export default MemberCard;
