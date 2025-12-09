import Image from 'next/image';
import { useState } from 'react';
import { Add } from '@mui/icons-material';
import { Button, Dialog, Skeleton } from '@mui/material';
import { ClassCard } from '@/components/elements';
import { GetMyClass } from '@/service/api/class/class.query';
import ErrorView from '../ErrorView';
import CreateClassForm from './CreateClassForm';

function MyClassList() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { data, isFetching, isError, refetch } = GetMyClass();
	const myClassList = data?.data ?? [];

	return (
		<div>
			<div className='flex flex-row justify-between'>
				<h1 className='text-2xl font-bold'>My Class</h1>
				<Button
					variant='contained'
					size='small'
					startIcon={<Add />}
					onClick={() => setIsModalOpen(true)}
				>
					Create New Class
				</Button>
			</div>

			<div className='mt-10 flex flex-row flex-wrap gap-5'>
				{!isFetching &&
					myClassList.map((value) => (
						<ClassCard
							key={value.class_id}
							classId={value.class_id}
							className={value.name}
							classDescription={value.description}
							type='my-class'
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

			{!isFetching && !isError && myClassList.length === 0 && (
				<div className='flex w-full flex-col items-center gap-10'>
					<Image
						src='/images/empty_state.svg'
						alt=''
						width={180}
						height={180}
						draggable={false}
					/>

					<p className='text-sm text-gray-500'>
						Create new class to start your own class
					</p>
				</div>
			)}

			{!isFetching && isError && (
				<div className='flex w-full flex-col items-center gap-10'>
					<ErrorView onRefetch={() => refetch()} />
				</div>
			)}

			<Dialog fullWidth open={isModalOpen}>
				<CreateClassForm
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

export default MyClassList;
