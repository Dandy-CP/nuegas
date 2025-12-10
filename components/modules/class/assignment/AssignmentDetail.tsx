import parse from 'html-react-parser';
import moment from 'moment';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { MoreVert } from '@mui/icons-material';
import { Dialog, Divider, IconButton, Menu, MenuItem } from '@mui/material';
import { DeleteAssignmentTask } from '@/service/api/assignment/assignment.mutation';
import { Assignment } from '@/types/assignment.types';
import { Comment } from '../../comment';
import { AttachmentPreview } from '../partials';
import AssignmentCollection from './partials/AssignmentCollection';
import UpdateTaskContent from './partials/UpdateTaskContent';

interface Props {
	assignmentDetail: Assignment | undefined;
	refetch: () => void;
	assignmentId?: string;
	classId?: string;
}

function AssignmentDetail({
	assignmentDetail,
	refetch,
	assignmentId,
	classId,
}: Props) {
	const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
	const [optionElement, setOptionElement] = useState<null | HTMLElement>(null);

	const openOption = Boolean(optionElement);

	const { mutateAsync } = DeleteAssignmentTask(
		{
			assignment_id: assignmentId as string,
		},
		{
			onSuccess() {
				window.location.replace(`/dashboard/class/${classId}`);
			},
			onError() {
				toast.error('Error on delete assignment');
			},
		}
	);

	return (
		<div className='mt-10 px-10'>
			<div className='flex flex-row justify-between gap-20'>
				<div className='w-full'>
					<Link
						href={`/dashboard/class/${classId}`}
						className='font-semibold hover:text-blue-500 hover:underline'
					>
						{assignmentDetail?.class.name}
					</Link>

					<div className='flex flex-row items-center justify-between'>
						<h1 className='text-3xl'>{assignmentDetail?.title}</h1>

						{assignmentDetail?.isOwnerClass && (
							<IconButton
								onClick={(event) => setOptionElement(event.currentTarget)}
							>
								<MoreVert />
							</IconButton>
						)}

						<Menu
							id='basic-menu'
							anchorEl={optionElement}
							open={openOption}
							onClose={() => setOptionElement(null)}
							slotProps={{
								list: {
									'aria-labelledby': 'basic-button',
								},
							}}
						>
							<MenuItem
								onClick={() => {
									setIsEditTaskOpen(true);
									setOptionElement(null);
								}}
							>
								Edit Assignment
							</MenuItem>

							<MenuItem
								onClick={() => {
									setOptionElement(null);
									mutateAsync();
								}}
								sx={{ color: 'red' }}
							>
								Delete Assignment
							</MenuItem>
						</Menu>
					</div>

					<p className='mt-1 text-sm font-semibold text-gray-500'>
						Posted on: {moment(assignmentDetail?.start_date).format('lll')}
					</p>

					<p className='text-end text-sm font-semibold text-gray-500'>
						Due Date: {moment(assignmentDetail?.due_date).format('lll')}
					</p>

					<Divider sx={{ my: 1 }} />

					<div className='my-5'>{parse(assignmentDetail?.content ?? '')}</div>

					{assignmentDetail?.attachment.length !== 0 && (
						<AttachmentPreview
							attachment={assignmentDetail?.attachment ?? []}
						/>
					)}

					<Divider sx={{ my: 1 }} />

					<Comment paramsId={{ assignment_id: assignmentId as string }} />
				</div>

				<div>
					{!assignmentDetail?.isOwnerClass && (
						<AssignmentCollection
							isAvailable={assignmentDetail?.is_available ?? false}
							assignmentId={assignmentId as string}
						/>
					)}
				</div>
			</div>

			<Dialog
				fullScreen
				open={isEditTaskOpen}
				slotProps={{ paper: { sx: { borderRadius: 0, padding: 0 } } }}
			>
				<UpdateTaskContent
					assignmentData={assignmentDetail}
					classId={classId as string}
					taskName={assignmentDetail?.title}
					setIsEditTaskOpen={setIsEditTaskOpen}
					onRefetch={() => {
						refetch();
					}}
				/>
			</Dialog>
		</div>
	);
}

export default AssignmentDetail;
