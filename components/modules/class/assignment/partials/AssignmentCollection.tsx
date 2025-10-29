import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Add, Link, Upload } from '@mui/icons-material';
import { Button, Card, Dialog, Menu, MenuItem } from '@mui/material';
import { Comment } from '@/components/modules/comment';
import {
	CreateSubmissionResult,
	UpdateSubmissionResult,
} from '@/service/api/assignment/assignment.mutation';
import { GetSubmissionDetail } from '@/service/api/assignment/assignment.query';
import { GetComment } from '@/service/api/comment/comment.query';
import AttachmentLinkForm from '../../AttachmentLinkForm';
import UploadFileForm from '../../UploadFileForm';
import { AttachmentPreview } from '../../partials';

interface Props {
	isAvailable: boolean;
	assignmentId: string;
}

function AssignmentCollection({ isAvailable, assignmentId }: Props) {
	const [attachment, setAttachment] = useState<string[]>([]);
	const [isAttachmentDialogOpen, setIsAttachmentDialogOpen] = useState(false);
	const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
	const [optionElement, setOptionElement] = useState<null | HTMLElement>(null);

	const openOption = Boolean(optionElement);

	const { data, refetch } = GetSubmissionDetail(
		{
			assignment_id: assignmentId,
		},
		{
			queryKey: [],
			enabled: assignmentId !== undefined,
		}
	);

	const submissionDetail = data?.data;

	const { mutateAsync, isPending } = CreateSubmissionResult(
		{
			assignment_id: assignmentId,
		},
		{
			onSuccess() {
				refetch();
			},
			onError() {
				toast.error('Error on create submission');
			},
		}
	);

	const {
		mutateAsync: requestUpdateSubmission,
		isPending: isUpdateSubmissionPending,
	} = UpdateSubmissionResult(
		{
			assignment_id: assignmentId,
			result_id: submissionDetail?.result_id ?? '',
		},
		{
			onSuccess() {
				refetch();
				toast.success('Success update submission');
			},
			onError() {
				toast.error('Error on update submission');
			},
		}
	);

	function handleSubmitSubmission() {
		if (submissionDetail) {
			return requestUpdateSubmission({ attachment: attachment });
		}

		return mutateAsync({ attachment: attachment });
	}

	function handleOnAddAttachment(url: string) {
		setAttachment((prev) => [...prev, url]);
	}

	function handleOnDeleteAttachment(index: number) {
		const updatedAttachment = attachment.filter((_, idx) => idx !== index);

		setAttachment(updatedAttachment);
	}

	useEffect(() => {
		if (submissionDetail) {
			setAttachment(submissionDetail.attachment);
		}
	}, [submissionDetail]);

	return (
		<div className='flex flex-col gap-5'>
			<Card elevation={3} className='w-[300px] p-5'>
				<div className='mb-3 flex flex-row justify-between'>
					<p className='font-semibold'>Task</p>
					<p
						className={`font-semibold ${submissionDetail ? 'text-green-600' : 'text-red-500'}`}
					>
						{submissionDetail ? 'Submitted' : 'Not Submitted'}
					</p>
				</div>

				<AttachmentPreview
					showDelete={isAvailable}
					attachment={attachment}
					onDeleteAttachment={handleOnDeleteAttachment}
				/>

				{isAvailable && (
					<div className='mt-3 flex flex-col gap-3'>
						<Button
							variant='outlined'
							startIcon={<Add />}
							fullWidth
							onClick={(event) => setOptionElement(event.currentTarget)}
							disabled={isPending || isUpdateSubmissionPending}
						>
							Add or create
						</Button>

						<Menu
							id='basic-menu'
							anchorEl={optionElement}
							open={openOption}
							onClose={() => setOptionElement(null)}
							slotProps={{
								paper: {
									sx: {
										width: '260px',
									},
								},
								list: {
									'aria-labelledby': 'basic-button',
								},
							}}
						>
							<MenuItem
								onClick={() => {
									setIsAttachmentDialogOpen(true);
									setOptionElement(null);
								}}
								sx={{ gap: 1 }}
							>
								<Link fontSize='small' />
								Link
							</MenuItem>

							<MenuItem
								onClick={() => {
									setIsUploadDialogOpen(true);
									setOptionElement(null);
								}}
								sx={{ gap: 1 }}
							>
								<Upload fontSize='small' />
								Upload
							</MenuItem>
						</Menu>

						<Button
							variant='contained'
							fullWidth
							disabled={
								isPending ||
								isUpdateSubmissionPending ||
								attachment.length === 0
							}
							onClick={() => {
								handleSubmitSubmission();
							}}
						>
							Submit
						</Button>
					</div>
				)}
			</Card>

			{submissionDetail && (
				<Card elevation={3} className='w-[300px] p-5'>
					<Comment
						showAvatar={false}
						paramsId={{
							assignments_result_id: submissionDetail?.result_id ?? '',
						}}
					/>
				</Card>
			)}

			<Dialog fullWidth open={isAttachmentDialogOpen}>
				<AttachmentLinkForm
					handleOnAddAttachment={handleOnAddAttachment}
					setIsAttachmentDialogOpen={setIsAttachmentDialogOpen}
				/>
			</Dialog>

			<Dialog fullWidth open={isUploadDialogOpen}>
				<UploadFileForm
					setIsUploadDialogOpen={setIsUploadDialogOpen}
					handleOnAddAttachment={handleOnAddAttachment}
				/>
			</Dialog>
		</div>
	);
}

export default AssignmentCollection;
