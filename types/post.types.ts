import { Comment } from './comment.types';

export interface CreatePostBody {
	content: string;
	attachment: string[];
}

export interface Post {
	post_id: string;
	content: string;
	attachment: string[];
	created_at: string;
	updated_at: string;
	user: {
		user_id: string;
		name: string;
		profile_image: null;
	};
	comment: Comment[];
}
