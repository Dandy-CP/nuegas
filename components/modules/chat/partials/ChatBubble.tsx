import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Check, DoneAll, MoreVert, Schedule } from '@mui/icons-material';
import { Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { useSocket } from '@/hooks';

interface Props {
	isSelf: boolean;
	name: string;
	sendAt: string;
	message: string;
	readAt: string | null;
	chatId: string;
	messageId: string;
	setMessageContent: React.Dispatch<React.SetStateAction<string>>;
	setSelectedMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

function ChatBubble({
	isSelf,
	message,
	name,
	readAt,
	sendAt,
	chatId,
	messageId,
	setMessageContent,
	setSelectedMessage,
}: Props) {
	const [optionElement, setOptionElement] = useState<null | HTMLElement>(null);
	const openOption = Boolean(optionElement);

	const { emit } = useSocket({
		endpoint: '/chat',
		query: {
			chatId: chatId,
		},
	});

	const bubbleComponentRef = useRef<HTMLDivElement | null>(null);

	function handleDeleteMessage() {
		emit('deleteMessage', {
			message_id: messageId,
		});
	}

	useEffect(() => {
		if (!bubbleComponentRef.current || readAt !== null) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && readAt === null && !isSelf) {
						// send signal read message when component is visible
						emit('readMessage', {
							message_id: messageId,
							read_at: new Date().toISOString(),
						});

						observer.disconnect();
					}
				});
			},
			{ threshold: 0.5 }
		);

		observer.observe(bubbleComponentRef.current);

		return () => observer.disconnect();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messageId, readAt]);

	return (
		<div
			ref={bubbleComponentRef}
			className={`flex flex-row gap-3 ${isSelf ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
		>
			<Avatar sx={{ width: 35, height: 35 }} />

			<div
				className={`w-fit rounded-xl bg-gray-300 px-3 py-2 ${isSelf ? 'rounded-tr-none' : 'rounded-tl-none'}`}
			>
				<div className='flex flex-row items-center gap-1'>
					<p className='text-xs font-bold'>{name}</p>
					<p className='text-xs text-gray-500'>{moment(sendAt).format('LT')}</p>

					{isSelf && (
						<IconButton
							size='small'
							onClick={(event) => setOptionElement(event.currentTarget)}
						>
							<MoreVert sx={{ fontSize: 13 }} />
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
								setSelectedMessage(messageId);
								setMessageContent(message);
							}}
						>
							Edit Message
						</MenuItem>

						<MenuItem
							onClick={() => {
								setOptionElement(null);
								handleDeleteMessage();
							}}
							sx={{ color: 'red' }}
						>
							Delete Message
						</MenuItem>
					</Menu>
				</div>

				<p className='my-1 text-sm'>{message}</p>

				{isSelf && (
					<div className='mt-2 flex flex-row items-center justify-end gap-1'>
						<p className='text-[10px] text-gray-500'>
							{messageId === ''
								? 'Pending'
								: readAt === null
									? 'Delivered'
									: 'Read'}
						</p>

						{messageId === '' ? (
							<Schedule sx={{ fontSize: 13 }} />
						) : readAt === null ? (
							<Check sx={{ fontSize: 13 }} />
						) : (
							<DoneAll sx={{ fontSize: 13 }} />
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default ChatBubble;
