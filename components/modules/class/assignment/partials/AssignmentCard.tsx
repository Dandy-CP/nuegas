import parse from 'html-react-parser';
import moment from 'moment';
import React, { useState } from 'react';
import { AssignmentOutlined, MoreVert } from '@mui/icons-material';
import { Button, Divider, IconButton, Menu, MenuItem } from '@mui/material';
import { AttachmentPreview } from '../../partials';

interface Props {
	classId: string;
	assignmentId: string;
	title: string;
	content: string;
	attachment: string[];
	dueDate: string;
	isAvailable: boolean;
}

function AssignmentCard({
	classId,
	assignmentId,
	title,
	content,
	attachment,
	dueDate,
	isAvailable,
}: Props) {
	const [optionElement, setOptionElement] = useState<null | HTMLElement>(null);
	const [showMore, setShowMore] = useState(false);

	const openOption = Boolean(optionElement);

	return (
		<div className={`rounded-md bg-white ${showMore ? 'shadow-md' : ''}`}>
			<div
				className='cursor-pointer rounded-t-md p-5 hover:bg-gray-100'
				onClick={() => setShowMore((prev) => !prev)}
			>
				<div className='flex flex-row items-center justify-between rounded-md'>
					<div className='flex flex-row items-center gap-3'>
						<div
							className={`flex h-10 w-10 items-center justify-center rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}
						>
							<AssignmentOutlined sx={{ color: 'white' }} />
						</div>

						<p className='text-sm font-semibold'>{title}</p>
					</div>

					<p className='text-sm font-semibold'>
						Due Date: {moment(dueDate).format('lll')}
					</p>
				</div>
			</div>

			{showMore && (
				<div className='p-5 pt-0'>
					<Divider />

					<div className='my-5'>{parse(content)}</div>

					{attachment.length !== 0 && (
						<AttachmentPreview attachment={attachment} />
					)}

					<Divider />

					<Button
						sx={{ mt: 1 }}
						href={`/dashboard/class/assignment/${assignmentId}?classId=${classId}`}
					>
						See instruction
					</Button>
				</div>
			)}
		</div>
	);
}

export default AssignmentCard;
