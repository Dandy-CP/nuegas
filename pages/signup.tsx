import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUp } from '@/service/api/auth/auth.mutation';
import { SignUpBody } from '@/types/auth.types';
import { SignUpSchema } from '@/schema/auth.schema';

function SignUpPage() {
	const [showPassword, setShowPassword] = useState(false);

	const router = useRouter();

	const { mutateAsync, isPending } = SignUp({
		onSuccess(data) {
			toast.success('Success Sign up, Please Login with your account');
			router.push('/auth');
		},
		onError(error) {
			toast.error(`Ops something wrong: ${error.response.data.message}`);
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpBody>({
		resolver: zodResolver(SignUpSchema),
	});

	const onSubmit: SubmitHandler<SignUpBody> = (data) => {
		mutateAsync({
			name: data.name,
			email: data.email,
			password: data.password,
		});
	};

	return (
		<div className='flex h-screen w-screen items-center justify-center'>
			<div className='tablet:w-full tablet:rounded-none tablet:shadow-none tablet:h-screen phone:rounded-none phone:w-full phone:shadow-none phone:h-screen phone:px-5 flex h-[700px] w-2/5 flex-col items-center justify-between rounded-[32px] bg-white p-15 py-30 shadow-2xl'>
				<Image src='/Logo.png' alt='' width={250} height={42} />

				<form
					className='flex w-full flex-col gap-5'
					onSubmit={handleSubmit(onSubmit)}
				>
					<TextField
						label='Your name'
						variant='outlined'
						disabled={isPending}
						error={errors.name !== undefined}
						helperText={errors.name?.message}
						{...register('name')}
					/>

					<TextField
						label='Email address'
						variant='outlined'
						disabled={isPending}
						error={errors.email !== undefined}
						helperText={errors.email?.message}
						{...register('email')}
					/>

					<TextField
						label='Password'
						type={showPassword ? 'text' : 'password'}
						disabled={isPending}
						error={errors.password !== undefined}
						helperText={errors.password?.message}
						slotProps={{
							input: {
								endAdornment: (
									<InputAdornment position='end'>
										<IconButton
											onClick={() => setShowPassword((show) => !show)}
											onMouseDown={(event) => event.preventDefault()}
											onMouseUp={(event) => event.preventDefault()}
											edge='end'
										>
											{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								),
							},
						}}
						{...register('password')}
					/>

					<Button
						type='submit'
						variant='contained'
						size='large'
						disabled={isPending}
						loading={isPending}
					>
						Sign up
					</Button>
				</form>

				<span className='text-sm'>
					Have Nuegas account?{' '}
					<Link href='/auth' className='text-sm text-blue-500 hover:underline'>
						Sign In
					</Link>
				</span>
			</div>
		</div>
	);
}

export default SignUpPage;
