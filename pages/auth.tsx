import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks';
import { SignIn } from '@/service/api/auth/auth.mutation';
import { AuthBody } from '@/types/auth.types';
import { SignInSchema } from '@/schema/auth.schema';

function Auth() {
	const [showPassword, setShowPassword] = useState(false);

	const { signIn } = useAuth();

	const { mutateAsync, isPending } = SignIn({
		onSuccess(data) {
			signIn(data);
		},
		onError(error) {
			toast.error(`Ops something wrong: ${error.response.data.message}`);
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AuthBody>({
		resolver: zodResolver(SignInSchema),
	});

	const onSubmit: SubmitHandler<AuthBody> = (data) => {
		mutateAsync({
			email: data.email,
			password: data.password,
		});
	};

	return (
		<div className='desktop:p-5 tablet:p-0 phone:p-0 flex h-screen w-screen items-center justify-center p-20'>
			<div className='desktop:px-10 tablet:px-0 phone:px-0 flex h-[511px] w-full flex-row items-center justify-between gap-10 rounded-[40px] bg-[#546FFF] px-15'>
				<div className='tablet:hidden phone:hidden flex w-1/2 flex-col gap-5'>
					<h1 className='desktop:text-3xl text-4xl font-bold text-white'>
						Your pathway to education <br /> Independence
					</h1>

					<p className='text-lg text-white'>
						Welcome to Nuegas, your all-in-one solution for education
						effortlessly.
					</p>
				</div>

				<div className='tablet:w-full tablet:rounded-none tablet:shadow-none tablet:h-screen phone:rounded-none phone:w-full phone:shadow-none phone:h-screen phone:px-5 flex h-[700px] w-1/2 flex-col items-center justify-between rounded-[32px] bg-white p-15 py-30 shadow-2xl'>
					<Image src='/Logo.png' alt='' width={250} height={42} />

					<form
						className='flex w-full flex-col gap-8'
						onSubmit={handleSubmit(onSubmit)}
					>
						<TextField
							label='Email address'
							variant='outlined'
							disabled={isPending}
							error={errors.email !== undefined}
							helperText={errors.email?.message}
							{...register('email')}
						/>

						<div className='flex flex-col gap-3'>
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

							<Link href='#' className='text-end text-sm hover:underline'>
								Forgot Password?
							</Link>
						</div>

						<Button
							type='submit'
							variant='contained'
							size='large'
							disabled={isPending}
							loading={isPending}
						>
							Sign in
						</Button>
					</form>

					<span className='text-sm'>
						New to Nuegas?{' '}
						<Link href='#' className='text-sm text-blue-500 hover:underline'>
							Sign Up
						</Link>
					</span>
				</div>
			</div>
		</div>
	);
}

export default Auth;
