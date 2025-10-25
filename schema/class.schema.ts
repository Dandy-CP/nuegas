import { z } from 'zod';

export const CreateClassSchema = z.object({
	class_name: z.string().nonempty({ error: 'Class name is Required' }),
	class_description: z
		.string()
		.nonempty({ error: 'Class description is Required' }),
});

export const JoinClassSchema = z.object({
	class_code: z.string().nonempty({ error: 'Class code id Required' }),
});

export const AttachmentUrlSchema = z.object({
	url: z.url({ error: 'Url not valid' }),
});

export const InviteMemberSchema = z.object({
	email: z.email({ error: 'Email not valid' }),
});

export const CreateAssignmentSchema = z.object({
	title: z.string().nonempty({ error: 'Title is required' }),
	content: z.string().nonempty({ error: 'Content is required' }),
	// topic: z.string(),
	// attachment: z.array(z.string()),
	start_date: z.string().nonempty({ error: 'Start date is required' }),
	due_date: z.string().nonempty({ error: 'End date is required' }),
});

export const GivePointResultSchema = z.object({
	point: z
		.number({ error: 'Point must be 1 - 100' })
		.nonnegative({ error: 'Number cannot be negative' }),
});
