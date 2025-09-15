import React from 'react';
import { Delete, FileCopy } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useLinkPreview } from '@/hooks';

interface Props {
	attachment: string[];
	showDelete?: boolean;
	onDeleteAttachment?: (index: number) => void;
}

function AttachmentPreview({
	attachment,
	showDelete = false,
	onDeleteAttachment,
}: Props) {
	const { preview, onDeletePreviewAttachment } = useLinkPreview({
		attachment: attachment,
	});

	return (
		<div className='flex flex-col gap-3'>
			<div className='flex flex-row flex-wrap gap-3'>
				{preview.map((value, index) => (
					<React.Fragment key={index}>
						{value.type === 'link' && (
							<div className='relative'>
								<a
									href={value.url}
									target='_blank'
									className='flex w-[250px] flex-row items-center gap-5 rounded-md border border-gray-300 p-3'
								>
									<img
										src={value.favicon}
										alt=''
										className='h-[50px] w-[50px] rounded-md'
									/>

									<div className='w-[150px]'>
										<p className='truncate font-semibold hover:text-blue-500'>
											{value.title}
										</p>

										<p className='truncate text-sm text-gray-500'>
											{value.description}
										</p>
									</div>
								</a>

								{showDelete && (
									<IconButton
										sx={{
											position: 'absolute',
											top: 0,
											right: 0,
										}}
										onClick={() => {
											onDeleteAttachment && onDeleteAttachment(index);
											onDeletePreviewAttachment(index);
										}}
									>
										<Delete sx={{ fontSize: '20px', color: 'red' }} />
									</IconButton>
								)}
							</div>
						)}
					</React.Fragment>
				))}

				{preview.map((value, index) => (
					<React.Fragment key={index}>
						{value.type === 'file' && (
							<div className='relative'>
								<a
									href={value.url}
									target='_blank'
									className='flex h-full w-[250px] flex-row items-center gap-5 rounded-md border border-gray-300 p-3'
								>
									<FileCopy className='text-gray-500' />

									<p className='truncate font-semibold hover:text-blue-500'>
										{value.title}
									</p>
								</a>

								{showDelete && (
									<IconButton
										sx={{
											position: 'absolute',
											top: 0,
											right: 0,
										}}
										onClick={() => {
											onDeleteAttachment && onDeleteAttachment(index);
										}}
									>
										<Delete sx={{ fontSize: '20px', color: 'red' }} />
									</IconButton>
								)}
							</div>
						)}
					</React.Fragment>
				))}
			</div>

			<div className='flex flex-row gap-3'>
				{preview.map((value, index) => (
					<React.Fragment key={index}>
						{value.type === 'image' && (
							<div className='relative'>
								<a href={value.url} target='_blank'>
									<img
										src={value.url}
										alt=''
										className='h-[150px] rounded-md'
									/>
								</a>

								{showDelete && (
									<IconButton
										sx={{
											position: 'absolute',
											top: 0,
											right: 0,
										}}
										onClick={() => {
											onDeleteAttachment && onDeleteAttachment(index);
										}}
									>
										<Delete sx={{ fontSize: '20px', color: 'red' }} />
									</IconButton>
								)}
							</div>
						)}
					</React.Fragment>
				))}
			</div>
		</div>
	);
}

export default AttachmentPreview;
