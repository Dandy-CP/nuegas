export interface ChatList {
	chatId: string;
	partner: {
		id: string;
		name: string;
		email: string;
	};
	lastMessage: {
		message_id: string;
		chat_id: string;
		sender_id: string;
		message: string;
		created_at: string;
		updated_at: string;
		read_at: string | null;
	};
}

export interface Message {
	message_id: string;
	message: string;
	created_at: string;
	read_at: string | null;
	sender: {
		user_id: string;
		name: string;
		email: string;
	};
	self: boolean;
}

export interface StartNewChatBody {
	receiverId: string;
}
