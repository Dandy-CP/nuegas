export interface MyClass {
	class_id: string;
	name: string;
	description: string;
	class_code: string;
	memberCount: number;
	created_at: string;
	updated_at: string;
}

export interface CreateClassBody {
	class_name: string;
	class_description: string;
}

export interface JoinClassBody {
	class_code: string;
}

export interface ClassDetail {
	class_id: string;
	name: string;
	description: string;
	class_code: string;
	created_at: string;
	updated_at: string;
	isOwner: boolean;
	class_members: ClassMember[];
	class_assignments: ClassAssignment[];
	class_quiz: ClassQuiz[];
	class_timeline: ClassTimeline[];
}

export interface ClassAssignment {
	assignments_id: string;
	title: string;
	content: string;
	attachment: string[];
	start_date: string;
	due_date: string;
	is_available: boolean;
	created_at: string;
	updated_at: string;
	class_id: string;
	user_id: string;
	topic_id: string;
}

export interface ClassMember {
	class_member_id: string;
	role: string;
	created_at: string;
	updated_at: string;
	user: User;
}

export interface PendingMember {
	id: string;
	email: string;
	class_id: string;
	token: string;
	status: string;
	created_at: string;
	expires_at: string;
}

export interface User {
	user_id: string;
	name: string;
	email: string;
	profile_image: null;
}

export interface ClassQuiz {
	quiz_id: string;
	title: string;
	description: string;
	attachment: string[];
	start_date: string;
	due_date: string;
	is_available: boolean;
	created_at: string;
	updated_at: string;
	class_id: string;
	user_id: string;
	topic_id: string;
}

export interface ClassTimeline {
	post_id: string;
	content: string;
	attachment: any[];
	created_at: string;
	updated_at: string;
	class_id: string;
	user_id: string;
}

export interface AttachmentMeta {
	title: string;
	description: string;
	image: string;
	favicon: string;
	url: string;
	type: string;
}

export interface ClassMember {
	class_member_id: string;
	role: string;
	created_at: string;
	updated_at: string;
	user: User;
}

export interface InviteMemberBody {
	class_id: string;
	email: string[];
}
