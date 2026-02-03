import moment from 'moment';
import Link from 'next/link';
import { GetUpcomingTask } from '@/service/api/assignment/assignment.query';

interface Props {
	classId: string;
}

function UpcomingTask({ classId }: Props) {
	const { data } = GetUpcomingTask({ class_id: classId });
	const task = data?.data ?? [];

	return (
		<div>
			{task.length === 0 && <p className='text-sm'>No upcoming task</p>}

			<div className='flex flex-col gap-3'>
				{task.map((value) => (
					<Link
						key={value.assignments_id}
						href={`/dashboard/class/assignment/${value.assignments_id}`}
						className='text-sm hover:text-blue-500 hover:underline'
					>
						<p>{value.title}</p>
						<p>{moment(value.due_date).format('lll')}</p>
					</Link>
				))}
			</div>
		</div>
	);
}

export default UpcomingTask;
