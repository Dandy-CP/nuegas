import React, { useState } from 'react';
import { Add } from '@mui/icons-material';
import { Button, Dialog, Divider } from '@mui/material';
import { Loader } from '@/components/elements';
import { GetAssignmentList } from '@/service/api/assignment/assignment.query';
import { Assignment } from '@/types/assignment.types';
import ErrorView from '../../ErrorView';
import AssignmentCard from './partials/AssignmentCard';
import CreateTaskContent from './partials/CreateTaskContent';

interface Props {
	classId: string;
	isClassOwner: boolean;
	className?: string;
}

function ClassAssignment({ classId, isClassOwner, className }: Props) {
	const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

	const { data, isFetching, isError, refetch } = GetAssignmentList({
		class_id: classId,
	});

	const assignmentList = data?.data ?? [];

	const groupedAssignment = assignmentList.reduce<Record<string, Assignment[]>>(
		(acc, item) => {
			const topicName = item.topic?.name ?? 'non-topic';

			if (!acc[topicName]) {
				acc[topicName] = [];
			}

			acc[topicName].push(item);

			return acc;
		},
		{}
	);

	const sortedAssignment = Object.entries(groupedAssignment).sort(
		([a], [b]) => {
			if (a === 'non-topic') return -1;
			if (b === 'non-topic') return 1;
			return a.localeCompare(b);
		}
	);

	if (isError) {
		return (
			<div className='my-40'>
				<ErrorView onRefetch={() => refetch()} />
			</div>
		);
	}

	if (isFetching) {
		return <Loader />;
	}

	return (
		<div>
			{isClassOwner && (
				<Button
					variant='contained'
					startIcon={<Add />}
					onClick={() => setIsCreateTaskOpen(true)}
				>
					Create Task
				</Button>
			)}

			{sortedAssignment.map(([topicName, assignment]) => (
				<div key={topicName} className='mt-6 flex flex-col gap-5'>
					{topicName !== 'non-topic' && (
						<>
							<p className='text-2xl font-semibold'>{topicName}</p>
							<Divider />
						</>
					)}

					{assignment.map((value) => (
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
			))}

			<Dialog
				fullScreen
				open={isCreateTaskOpen}
				slotProps={{ paper: { sx: { borderRadius: 0, padding: 0 } } }}
			>
				<CreateTaskContent
					classId={classId}
					className={className}
					setIsCreateTaskOpen={setIsCreateTaskOpen}
					onRefetch={() => {
						refetch();
					}}
				/>
			</Dialog>
		</div>
	);
}

export default ClassAssignment;
