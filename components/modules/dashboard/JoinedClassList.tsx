import Image from 'next/image';
import { useState } from 'react';
import { Add } from '@mui/icons-material';
import { Button, Dialog, Skeleton } from '@mui/material';
import { ClassCard } from '@/components/elements';
import { GetJoinedClass } from '@/service/api/class/class.query';
import ErrorView from '../ErrorView';
import JoinClassForm from './JoinClassForm';

function JoinedClassList() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { data, isFetching, isError, refetch } = GetJoinedClass();
	const joinedClassList = data?.data ?? [];

	return (
		<div className='mt-10'>
			<div className='flex flex-row justify-between'>
				<h1 className='text-2xl font-bold'>Joined Class</h1>
				<Button
					variant='contained'
					size='small'
					startIcon={<Add />}
					onClick={() => setIsModalOpen(true)}
				>
					Join Class
				</Button>
			</div>

			<div className='mt-10 flex flex-row flex-wrap gap-5'>
				{!isFetching &&
					joinedClassList.map((value) => (
						<ClassCard
							key={value.class_id}
							classId={value.class_id}
							className={value.name}
							classDescription={value.description}
						/>
					))}

				{isFetching &&
					Array(3)
						.fill('')
						.map((_, index) => (
							<Skeleton
								key={index}
								variant='rounded'
								width='32%'
								height={150}
								sx={{
									borderRadius: 3,
								}}
							/>
						))}
			</div>

			{!isFetching && joinedClassList.length === 0 && (
				<div className='flex w-full flex-col items-center gap-10'>
					<Image
						src='/images/empty_state.svg'
						alt=''
						width={180}
						height={180}
						draggable={false}
					/>

					<p className='text-sm text-gray-500'>Join class to start</p>
				</div>
			)}

			{!isFetching && isError && (
				<div className='flex w-full flex-col items-center gap-10'>
					<ErrorView onRefetch={() => refetch()} />
				</div>
			)}

			<Dialog fullWidth open={isModalOpen}>
				<JoinClassForm
					setIsModalOpen={setIsModalOpen}
					onSuccess={() => {
						refetch();
						setIsModalOpen(false);
					}}
				/>
			</Dialog>
		</div>
	);
}

export default JoinedClassList;
