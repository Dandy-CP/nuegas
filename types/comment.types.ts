export interface Comment {
	comment_id: string;
	content: string;
	created_at: string;
	updated_at: string;
	user: {
		user_id: string;
		name: string;
		profile_image: null | string;
	};
}

export interface CreateCommentBody {
	content: string;
}
