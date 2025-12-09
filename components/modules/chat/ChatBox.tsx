import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Close, MoreVert, Send } from '@mui/icons-material';
import {
	Avatar,
	Divider,
	IconButton,
	Menu,
	MenuItem,
	Skeleton,
	TextField,
} from '@mui/material';
import { useAuth, useSocket } from '@/hooks';
import { Message } from '@/types/chat.types';
import ChatBubble from './partials/ChatBubble';

interface Props {
	selectedChat: {
		chatId: string;
		partner: string;
	};
	setSelectedChat: React.Dispatch<
		React.SetStateAction<{
			chatId: string;
			partner: string;
		} | null>
	>;
}

function ChatBox({ selectedChat, setSelectedChat }: Props) {
	const [message, setMessage] = useState<Message[]>([]);
	const [MessageContent, setMessageContent] = useState('');
	const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
	const [hasNextMessage, setHasNextMessage] = useState(true);
	const [isHasScrolling, setIsHasScrolling] = useState(false);
	const [optionElement, setOptionElement] = useState<null | HTMLElement>(null);

	const openOption = Boolean(optionElement);
	const chatContainerRef = useRef<HTMLDivElement | null>(null);
	const bottomContainerRef = useRef<HTMLDivElement | null>(null);

	const { authData } = useAuth();
	const { on, emit } = useSocket({
		endpoint: '/chat',
		query: {
			chatId: selectedChat.chatId,
		},
	});

	const groupedMessage = message.reduce(
		(groups: Record<string, Message[]>, msg) => {
			const mDate = moment(msg.created_at);
			let label = mDate.format('DD MMMM YYYY');

			if (mDate.isSame(moment(), 'day')) {
				label = 'Hari Ini';
			} else if (mDate.isSame(moment().subtract(1, 'day'), 'day')) {
				label = 'Kemarin';
			}

			if (!groups[label]) {
				groups[label] = [];
			}

			groups[label].push(msg);

			return groups;
		},
		{}
	);

	function handleSendMessage() {
		emit('sendMessage', { message: MessageContent });
		setMessageContent('');
		bottomContainerRef.current?.scrollIntoView({ behavior: 'smooth' });

		// push new value for pending message with empty message id
		const pendingMessage = {
			message_id: '',
			message: MessageContent,
			created_at: new Date().toISOString(),
			read_at: null,
			sender: {
				user_id: authData?.user_id ?? '',
				name: authData?.name ?? '',
				email: authData?.email ?? '',
			},
			self: true,
		};

		setMessage((prev) => [...prev, pendingMessage]);
	}

	function handleEditMessage() {
		emit('editMessage', {
			message_id: selectedMessage!,
			new_message: MessageContent,
		});

		setSelectedMessage(null);
		setMessageContent('');
	}

	function handleDeleteChat() {
		emit('deleteChat', {
			chat_id: selectedChat.chatId,
		});

		setSelectedChat(null);
		window.location.reload();
	}

	function handleOnScrollChatList(
		event: React.UIEvent<HTMLDivElement, UIEvent>
	) {
		const element = event.currentTarget;
		const { scrollTop, clientHeight, scrollHeight } = element;
		const isOnTop = scrollTop === 0;
		const isOnBottom = scrollTop + clientHeight >= scrollHeight;

		if (isOnTop && hasNextMessage) {
			emit('getNextMessage', { last_message_id: message[0].message_id });
		}

		// State to prevent scrolling to bottom when user scroll up for read history chat
		setIsHasScrolling(!isOnBottom);
	}

	const handleSocketSignal = useCallback(() => {
		on<Message[]>('onConnected', (data) => {
			setMessage(data);
		});

		on<Message[]>('onNextMessage', (data) => {
			if (data.length !== 0) {
				setMessage((prev) => [...data, ...prev]);

				// Scroll into last bubble chat
				chatContainerRef?.current?.scroll({
					top: 30 * data.length,
					left: 0,
					behavior: 'auto',
				});
			} else {
				setHasNextMessage(false);
			}
		});

		on<Message>('onReceiveMessage', (data) => {
			setMessage((prev) => {
				const hasPending = prev.some((msg) => msg.message_id === '');

				if (hasPending) {
					// Replace pending message
					return prev.map((msg) => (msg.message_id === '' ? { ...data } : msg));
				}

				// No pending → message from other user → push to state
				return [...prev, data];
			});
		});

		on<Message>('onMessageEdited', (data) => {
			setMessage((prev) => {
				return prev.map((value) => {
					return value.message_id === data.message_id
						? { ...value, message: data.message }
						: value;
				});
			});
		});

		on<Message>('onMessageReaded', (data) => {
			setMessage((prev) => {
				return prev.map((value) => {
					return value.message_id === data.message_id
						? { ...value, read_at: data.read_at }
						: value;
				});
			});
		});

		on<Message>('onMessageDeleted', (data) => {
			setMessage((prev) => {
				return prev.filter((value) => value.message_id !== data.message_id);
			});
		});
	}, [on]);

	useEffect(() => {
		handleSocketSignal();

		return () => {
			setMessage([]);
			setHasNextMessage(true);
			setIsHasScrolling(false);
			setSelectedMessage(null);
			setMessageContent('');
		};
	}, [handleSocketSignal, selectedChat.chatId]);

	useEffect(() => {
		if (!isHasScrolling) {
			bottomContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [message]);

	return (
		<div className='h-full rounded-md bg-white'>
			<div className='flex flex-row items-center justify-between p-3'>
				<div className='flex flex-row items-center gap-3'>
					<Avatar />
					<p className='text-sm font-semibold'>{selectedChat.partner}</p>
				</div>

				<div>
					<IconButton onClick={() => setSelectedChat(null)}>
						<Close />
					</IconButton>

					<IconButton
						onClick={(event) => setOptionElement(event.currentTarget)}
					>
						<MoreVert />
					</IconButton>

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
								handleDeleteChat();
							}}
							sx={{ color: 'red' }}
						>
							Delete Chat
						</MenuItem>
					</Menu>
				</div>
			</div>

			<Divider />

			<div className='flex h-[660px] w-full flex-col justify-between scroll-smooth p-5'>
				<div
					ref={chatContainerRef}
					className='flex h-full w-full flex-col gap-5 overflow-y-scroll rounded-md bg-gray-50 p-3'
					onScroll={handleOnScrollChatList}
				>
					{hasNextMessage && (
						<div>
							{Array(2)
								.fill('')
								.map((_, index) => (
									<React.Fragment key={index}>
										<div className='flex flex-row gap-3'>
											<Skeleton variant='circular' width={35} height={35} />
											<Skeleton variant='rounded' width={200} height={70} />
										</div>

										<div className='flex flex-row-reverse gap-3'>
											<Skeleton variant='circular' width={35} height={35} />
											<Skeleton variant='rounded' width={200} height={70} />
										</div>
									</React.Fragment>
								))}
						</div>
					)}

					{Object.entries(groupedMessage).map(([date, message]) => (
						<React.Fragment key={date}>
							<div className='flex justify-center'>
								<div className='rounded-full bg-gray-300 p-2'>
									<p className='text-xs'>{date}</p>
								</div>
							</div>

							{message.map((value) => (
								<ChatBubble
									key={value.message_id}
									chatId={selectedChat.chatId}
									messageId={value.message_id}
									name={value.sender.name}
									message={value.message}
									isSelf={value.self}
									sendAt={value.created_at}
									readAt={value.read_at}
									setMessageContent={setMessageContent}
									setSelectedMessage={setSelectedMessage}
								/>
							))}
						</React.Fragment>
					))}

					<div ref={bottomContainerRef} />
				</div>

				<div className='mt-5'>
					<Divider />

					<div className='mt-5 w-full'>
						{selectedMessage && (
							<div className='mb-5 flex w-fit flex-row items-center gap-2 rounded-md bg-gray-200 p-2'>
								<p className='text-xs font-semibold'>Edit Message</p>

								<IconButton
									size='small'
									onClick={() => {
										setSelectedMessage(null);
										setMessageContent('');
									}}
								>
									<Close sx={{ fontSize: 14 }} />
								</IconButton>
							</div>
						)}

						<div className='flex flex-row items-center'>
							<TextField
								value={MessageContent}
								placeholder='Type Message'
								fullWidth
								size='small'
								className={`${selectedMessage ? 'rounded-[10px] bg-gray-200' : ''}`}
								onChange={(event) => setMessageContent(event.target.value)}
								onKeyDown={(event) => {
									if (event.code === 'Enter' && MessageContent.length !== 0) {
										!selectedMessage && handleSendMessage();
										selectedMessage && handleEditMessage();
									}
								}}
							/>

							<IconButton
								disabled={MessageContent.length === 0}
								onClick={() => {
									!selectedMessage && handleSendMessage();
									selectedMessage && handleEditMessage();
								}}
							>
								<Send />
							</IconButton>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ChatBox;
