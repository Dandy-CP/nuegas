import moment from 'moment';
import React from 'react';
import { Avatar } from '@mui/material';

interface Props {
	chatId: string;
	name: string;
	lastMessage: string;
	lastMessageDate: string;
	avatar: string;
	selectedChat: {
		chatId: string;
		partner: string;
	} | null;
	setSelectedChat: React.Dispatch<
		React.SetStateAction<{
			chatId: string;
			partner: string;
		} | null>
	>;
}

function ChatCard({
	chatId,
	name,
	lastMessage,
	lastMessageDate,
	avatar,
	selectedChat,
	setSelectedChat,
}: Props) {
	return (
		<div
			className={`flex h-[60px] cursor-pointer flex-row items-center justify-between rounded-md p-3 hover:bg-gray-200 ${chatId === selectedChat?.chatId ? 'bg-gray-200' : ''}`}
			onClick={() => {
				setSelectedChat({
					chatId: chatId,
					partner: name,
				});
			}}
		>
			<div className='flex w-full flex-row items-center gap-3'>
				<Avatar src={avatar} />

				<div className='w-full'>
					<div className='flex flex-row items-center justify-between'>
						<p className='text-sm font-semibold'>{name}</p>
						<p className='text-xs font-semibold text-gray-500'>
							{moment(lastMessageDate).startOf('minutes').fromNow()}
						</p>
					</div>

					<p>{lastMessage}</p>
				</div>
			</div>
		</div>
	);
}

export default ChatCard;
