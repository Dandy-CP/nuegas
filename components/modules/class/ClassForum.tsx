import { useState } from 'react';
import { MoreVert, Settings } from '@mui/icons-material';
import { Button, Card, IconButton, Tooltip } from '@mui/material';
import { ClassDetail } from '@/types/class.types';
import PostTimeline from './PostTimeline';
import UpcomingTask from './partials/UpcomingTask';

interface Props {
	classId: string;
	classDetail?: ClassDetail;
	isClassOwner: boolean;
}

function ClassForum({ classId, classDetail, isClassOwner }: Props) {
	const [isWritingPost, setIsWritingPost] = useState(false);

	return (
		<div>
			<div
				className={`relative h-[250px] w-full rounded-xl bg-[url('/images/class_cover.jpg')] bg-cover bg-center bg-no-repeat p-5`}
			>
				<div className='absolute inset-0 rounded-xl bg-gradient-to-l from-black/20 via-black/20 to-transparent' />

				<div className='flex flex-row items-center justify-between'>
					<div>
						<p className='text-2xl font-bold text-white'>{classDetail?.name}</p>
						<p className='text-md text-white'>{classDetail?.description}</p>
					</div>

					{isClassOwner && (
						<Button
							variant='contained'
							startIcon={<Settings />}
							sx={{ backgroundColor: 'white', color: '#546FFF' }}
						>
							Class Options
						</Button>
					)}
				</div>
			</div>

			<div className='mt-5 flex w-full flex-row gap-10'>
				<div className='flex w-[25%] flex-col gap-5'>
					{isClassOwner && (
						<Card variant='outlined' className='p-3'>
							<div className='flex flex-row items-center justify-between'>
								<p className='text-sm font-semibold'>Class Code</p>
								<Tooltip title='Class options'>
									<IconButton>
										<MoreVert />
									</IconButton>
								</Tooltip>
							</div>

							<p className='text-2xl font-bold text-[#546FFF]'>
								{classDetail?.class_code}
							</p>
						</Card>
					)}

					<Card variant='outlined' className='p-3'>
						<p className='mb-2 text-sm font-semibold'>Upcoming task</p>
						<UpcomingTask classId={classId} />
					</Card>
				</div>

				<div className='w-full'>
					<PostTimeline
						classId={classId}
						isWritingPost={isWritingPost}
						setIsWritingPost={setIsWritingPost}
						isClassOwner={isClassOwner}
					/>
				</div>
			</div>
		</div>
	);
}

export default ClassForum;
