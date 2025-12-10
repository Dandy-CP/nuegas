export interface MyTask {
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
	class: {
		class_id: string;
		name: string;
	};
}
