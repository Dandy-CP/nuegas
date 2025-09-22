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
