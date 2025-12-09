import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { Divider } from '@mui/material';
import { ErrorView } from '@/components/modules';
import { ChatBox, ChatCard } from '@/components/modules/chat';
import { useSocket } from '@/hooks';
import { ChatList } from '@/types/chat.types';

interface SelectedChat {
	chatId: string;
	partner: string;
}

function Index() {
	const [chatList, setChatList] = useState<ChatList[]>([]);
	const [selectedChat, setSelectedChat] = useState<SelectedChat | null>(null);

	const { status, on } = useSocket({
		endpoint: '/chat',
		query: { isChatList: true },
	});

	const handleSocketSignal = useCallback(() => {
		on<ChatList[]>('onChatList', (data) => {
			setChatList(data);
		});

		on<ChatList>('onChatListUpdate', (data) => {
			setChatList((prev) => {
				return prev.map((value) => {
					return value.chatId === data.chatId ? { ...value, ...data } : value;
				});
			});
		});
	}, [on]);

	useEffect(() => {
		handleSocketSignal();
	}, [handleSocketSignal, selectedChat]);

	if (!status.isConnected) {
		return (
			<div className='flex h-[80vh] flex-col items-center justify-center gap-5'>
				<Image
					src='/images/connecting.svg'
					alt=''
					width={300}
					height={300}
					draggable={false}
				/>

				<p className='font-semibold text-gray-500'>Connecting please wait...</p>
			</div>
		);
	}

	if (status.error) {
		return (
			<div className='flex h-[80vh] items-center justify-center'>
				<ErrorView
					message='Opps chat service is unavailable'
					showRefetch={false}
				/>
			</div>
		);
	}

	if (status.isConnected && chatList.length === 0) {
		return (
			<div className='flex h-[80vh] flex-col items-center justify-center gap-3'>
				<Image
					src='/images/connected.svg'
					alt=''
					width={200}
					height={200}
					draggable={false}
				/>

				<p className='text-sm font-semibold text-gray-500'>
					Start conversation with your joined class mate
				</p>
			</div>
		);
	}

	return (
		<div className='flex h-[85vh] flex-row'>
			<div className='flex w-1/2 flex-col gap-2 overflow-y-scroll px-3'>
				{chatList.map((value) => (
					<ChatCard
						key={value.chatId}
						chatId={value.chatId}
						name={value.partner.name}
						lastMessage={
							value?.lastMessage?.message ??
							`Start new Chat with ${value.partner.name}`
						}
						lastMessageDate={value?.lastMessage?.created_at}
						avatar={''}
						selectedChat={selectedChat}
						setSelectedChat={setSelectedChat}
					/>
				))}
			</div>

			<Divider orientation='vertical' flexItem />

			<div className='h-full w-full px-3'>
				{selectedChat && (
					<ChatBox
						selectedChat={selectedChat}
						setSelectedChat={setSelectedChat}
					/>
				)}

				{!selectedChat && (
					<div className='flex h-full w-full flex-col items-center justify-center gap-5'>
						<Image
							src='/images/connected.svg'
							alt=''
							width={200}
							height={200}
							draggable={false}
						/>

						<p className='font-semibold text-gray-500'>
							Select Chat to start messaging
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default Index;
