import parse from 'html-react-parser';
import moment from 'moment';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Group, MoreVert } from '@mui/icons-material';
import {
	Button,
	Dialog,
	Divider,
	IconButton,
	Menu,
	MenuItem,
	Skeleton,
} from '@mui/material';
import { DeleteAssignmentTask } from '@/service/api/assignment/assignment.mutation';
import { GetComment } from '@/service/api/comment/comment.query';
import { Assignment } from '@/types/assignment.types';
import ErrorView from '../../ErrorView';
import { AttachmentPreview, InputComment, PostComment } from '../partials';
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

	const {
		data: commentData,
		isError: isCommentError,
		hasNextPage,
		infiniteRef,
		refetch: refetchComment,
	} = GetComment({
		assignment_id: assignmentId as string,
	});

	const comment = commentData?.items ?? [];
	const totalComment = commentData?.totalItems ?? 0;

	return (
		<div className='mt-10 px-10'>
			<div className='flex flex-row justify-between gap-20'>
				<div className='w-full'>
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

					<Button variant='text' size='small' startIcon={<Group />}>
						{totalComment} Comment Class
					</Button>

					<div className='flex max-h-[300px] flex-col overflow-auto'>
						{comment.map((value) => (
							<PostComment
								key={value.comment_id}
								commentId={value.comment_id}
								username={value.user.name}
								content={value.content}
								commentedAt={value.created_at}
								onSuccess={() => {
									refetchComment();
								}}
							/>
						))}

						{hasNextPage && (
							<div ref={infiniteRef} className='mt-3 flex flex-col gap-3'>
								{Array(2)
									.fill('')
									.map((_, index) => (
										<Skeleton key={index} variant='rounded' height={80} />
									))}
							</div>
						)}
					</div>

					{isCommentError && (
						<div className='mt-5'>
							<ErrorView
								onRefetch={() => {
									refetchComment();
								}}
							/>
						</div>
					)}

					<InputComment
						paramsId={{ assignment_id: assignmentId as string }}
						onSuccess={() => {
							refetchComment();
						}}
					/>
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
