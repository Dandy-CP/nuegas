import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { MoreVert } from '@mui/icons-material';
import { Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { StartNewChat } from '@/service/api/chat/chat.mutation';
import {
	DeleteClassMember,
	DeletePendingMember,
} from '@/service/api/class/class.mutation';

interface Props {
	type?: 'MEMBER' | 'PENDING';
	profileImage: string | null;
	name: string;
	memberId: string;
	userId: string;
	isClassOwner: boolean;
	showOption?: boolean;
	onRefetch?: () => void;
}

function MemberCard({
	type = 'MEMBER',
	name,
	profileImage,
	memberId,
	userId,
	isClassOwner,
	showOption = true,
	onRefetch,
}: Props) {
	const [optionElement, setOptionElement] = useState<null | HTMLElement>(null);
	const openOption = Boolean(optionElement);

	const router = useRouter();

	const { mutateAsync, isPending } = DeleteClassMember(
		{ member_id: memberId },
		{
			onSuccess() {
				onRefetch && onRefetch();
			},
			onError() {
				toast.error('Error on remove member');
			},
		}
	);

	const {
		mutateAsync: requestDeletePendingMember,
		isPending: isDeletePending,
	} = DeletePendingMember(
		{ invitation_id: memberId },
		{
			onSuccess() {
				onRefetch && onRefetch();
			},
			onError() {
				toast.error('Error on remove pending member');
			},
		}
	);

	const { mutateAsync: requestStartNewChat, isPending: isStartNewChatPending } =
		StartNewChat({
			onSuccess() {
				router.push('/dashboard/message');
			},
			onError(error) {
				if (error.response.data.status === 422) {
					router.push('/dashboard/message');
					return;
				}

				toast.error('Error on start new Chat');
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
					disabled={isPending || isDeletePending || isStartNewChatPending}
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
				{type === 'MEMBER' && (
					<MenuItem
						onClick={() => {
							setOptionElement(null);
							requestStartNewChat({
								receiverId: userId,
							});
						}}
					>
						Send Message
					</MenuItem>
				)}

				{isClassOwner && (
					<MenuItem
						onClick={() => {
							setOptionElement(null);

							if (type === 'MEMBER') mutateAsync();
							if (type === 'PENDING') requestDeletePendingMember();
						}}
						sx={{ color: 'red' }}
					>
						{type === 'MEMBER' ? 'Remove Member' : 'Remove Pending Member'}
					</MenuItem>
				)}
			</Menu>
		</div>
	);
}

export default MemberCard;
