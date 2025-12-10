import { Comment } from './comment.types';

export interface Assignment {
	assignments_id: string;
	title: string;
	content: string;
	attachment: string[];
	start_date: string;
	due_date: string;
	is_available: boolean;
	created_at: string;
	updated_at: string;
	isOwnerClass: boolean;
	topic: {
		topic_id: string;
		name: string;
	};
	class: {
		class_id: string;
		name: string;
	};
}

export interface UpcomingTask {
	assignments_id: string;
	title: string;
	due_date: string;
}

export interface Submission {
	result_id: string;
	attachment: string[];
	point: number;
	submited_at: string;
	created_at: string;
	updated_at: string;
	user: {
		user_id: string;
		name: string;
	};
	comment: Comment[];
}

export interface SubmissionResult {
	result_id: string;
	attachment: string[];
	point: number;
	submited_at: string;
	created_at: string;
	updated_at: string;
	user: {
		user_id: string;
		name: string;
	};
}

export interface CreateAssignment {
	title: string;
	content: string;
	start_date: string;
	due_date: string;
}

export interface CreateAssignmentBody {
	title: string;
	content: string;
	topic?: string | null;
	attachment?: string[] | null;
	start_date: string;
	due_date: string;
}

export interface UpdateAssignmentBody {
	title: string;
	content: string;
	topic?: string | null;
	attachment?: string[] | null;
	start_date: string;
	due_date: string;
}
