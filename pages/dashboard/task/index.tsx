import Image from 'next/image';
import React from 'react';
import { ErrorView } from '@/components/modules';
import AssignmentCard from '@/components/modules/class/assignment/partials/AssignmentCard';
import { GetMyTask } from '@/service/api/user/user.query';

function MyTaskPage() {
	const { data, isFetching, isError, refetch } = GetMyTask();
	const myTask = data?.data ?? [];

	return (
		<div>
			<h1 className='text-2xl font-bold'>My Task</h1>

			<div className='mt-10'>
				{myTask.map((value) => (
					<AssignmentCard
						key={value.assignments_id}
						assignmentId={value.assignments_id}
						title={value.title}
						content={value.content}
						attachment={value.attachment}
						dueDate={value.due_date}
						isAvailable={value.is_available}
					/>
				))}
			</div>

			{!isFetching && !isError && myTask.length === 0 && (
				<div className='mt-10 flex w-full flex-col items-center gap-10'>
					<Image
						src='/images/empty_state.svg'
						alt=''
						width={180}
						height={180}
						draggable={false}
					/>

					<p className='text-sm text-gray-500'>No task for now</p>
				</div>
			)}

			{!isFetching && isError && (
				<div className='flex w-full flex-col items-center gap-10'>
					<ErrorView onRefetch={() => refetch()} />
				</div>
			)}
		</div>
	);
}

export default MyTaskPage;
