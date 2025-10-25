import React, { useState } from 'react';
import { Close, Group } from '@mui/icons-material';
import {
	Avatar,
	Button,
	Dialog,
	Divider,
	IconButton,
	Skeleton,
} from '@mui/material';
import { GetAllSubmissionResult } from '@/service/api/assignment/assignment.query';
import { GetComment } from '@/service/api/comment/comment.query';
import ErrorView from '../../ErrorView';
import { AttachmentPreview, InputComment, PostComment } from '../partials';
import GivePointContent from './partials/GivePointContent';

interface Props {
	assignmentId?: string;
}

interface SelectedResult {
	member_name: string;
	result_id: string;
	attachment: string[];
	point: number;
}

function MemberSubmissionResults({ assignmentId }: Props) {
	const [showResult, setShowResult] = useState(false);
	const [selectedResult, setSelectedResult] = useState<SelectedResult | null>();
	const [isGivePointModalShow, setIsGivePointModalShow] = useState(false);

	const {
		data: commentData,
		isError: isCommentError,
		hasNextPage,
		infiniteRef,
		refetch: refetchComment,
	} = GetComment({
		assignments_result_id: selectedResult?.result_id ?? '',
	});

	const { data, isError, refetch } = GetAllSubmissionResult({
		assignment_id: assignmentId as string,
	});

	const memberResult = data?.data ?? [];
	const comment = commentData?.items ?? [];
	const totalComment = commentData?.totalItems ?? 0;

	return (
		<div className='flex h-[80vh] flex-row'>
			<div className='mt-5'>
				{memberResult.map((value) => (
					<div
						key={value.result_id}
						className='flex h-[60px] w-[450px] cursor-pointer flex-row items-center justify-between p-3 hover:bg-gray-200'
						onClick={() => {
							setShowResult(true);
							setSelectedResult({
								member_name: value.user.name,
								result_id: value.result_id,
								attachment: value.attachment,
								point: value.point,
							});
						}}
					>
						<div className='flex flex-row items-center gap-3'>
							<Avatar />
							<p className='text-sm'>{value.user.name}</p>
						</div>

						<div className='flex flex-row gap-2'>
							<Divider orientation='vertical' flexItem />

							{value.point === 0 ? (
								<Button
									onClick={() => {
										setIsGivePointModalShow(true);
									}}
								>
									Give Point
								</Button>
							) : (
								<Button
									onClick={() => {
										setIsGivePointModalShow(true);
									}}
								>
									{value.point} / 100
								</Button>
							)}
						</div>
					</div>
				))}

				{isError && (
					<ErrorView
						onRefetch={() => {
							refetch();
						}}
					/>
				)}
			</div>

			<Divider orientation='vertical' flexItem />

			{showResult && (
				<div className='mt-5 w-full'>
					<div className='flex h-full w-full flex-col justify-between p-2'>
						<div className='flex flex-col gap-5'>
							<div className='flex flex-row justify-between'>
								<h1 className='text-xl'>{selectedResult?.member_name}</h1>

								<div className='flex flex-row items-center gap-5'>
									<p>{selectedResult?.point} / 100</p>

									<IconButton
										className='mr-auto'
										onClick={() => {
											setShowResult(false);
											setSelectedResult(null);
										}}
									>
										<Close fontSize='small' />
									</IconButton>
								</div>
							</div>

							<AttachmentPreview
								attachment={selectedResult?.attachment ?? []}
							/>
						</div>

						<div>
							<Divider />

							<Button variant='text' size='small' startIcon={<Group />}>
								{totalComment} Private Comment
							</Button>

							<div className='flex max-h-[150px] flex-col overflow-auto'>
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
								paramsId={{
									assignments_result_id: selectedResult?.result_id ?? '',
								}}
								onSuccess={() => {
									refetchComment();
								}}
							/>
						</div>
					</div>
				</div>
			)}

			<Dialog fullWidth open={isGivePointModalShow}>
				<GivePointContent
					selectedName={selectedResult?.member_name ?? ''}
					assignmentId={assignmentId ?? ''}
					resultId={selectedResult?.result_id ?? ''}
					setIsModalOpen={setIsGivePointModalShow}
					onSuccess={() => {
						refetch();
						setSelectedResult(null);
						setShowResult(false);
					}}
				/>
			</Dialog>
		</div>
	);
}

export default MemberSubmissionResults;
