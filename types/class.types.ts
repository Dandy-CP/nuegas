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
