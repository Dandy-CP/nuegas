import { z } from 'zod';

export const SignInSchema = z.object({
	email: z.email({ message: 'Email not valid' }),
	password: z.string().min(8, { message: 'Password min 8 Character' }),
});

export const SignUpSchema = z.object({
	name: z.string().min(3, { message: 'Name min 3 Character' }),
	email: z.email({ message: 'Email not valid' }),
	password: z.string().min(8, { message: 'Password min 8 Character' }),
});
