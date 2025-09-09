import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Folder, MoreVert } from '@mui/icons-material';
import { Divider, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';

interface Props {
	classId: string;
	className: string;
	classDescription: string;
	type?: 'my-class' | 'joined-class';
}

function ClassCard({ classId, className, classDescription, type }: Props) {
	const [optionElement, setOptionElement] = useState<null | HTMLElement>(null);
	const openOption = Boolean(optionElement);

	return (
		<div className='w-[32%] cursor-pointer rounded-xl bg-white hover:shadow-xl'>
			<Link href={`/dashboard/class/${classId}`}>
				<Image
					alt=''
					src='/images/class_cover.jpg'
					layout='responsive'
					width={700}
					height={475}
					className='rounded-t-xl'
				/>

				<div className='p-3'>
					<p className='font-semibold'>{className}</p>
					<p className='text-sm'>{classDescription}</p>
				</div>
			</Link>

			{type === 'my-class' && (
				<>
					<Divider variant='middle' />

					<div className='my-2 flex flex-row justify-end px-2'>
						<Link href={`/dashboard/class/folder/${classId}`}>
							<Tooltip title={`Open folder ${className}`}>
								<IconButton>
									<Folder />
								</IconButton>
							</Tooltip>
						</Link>

						<Tooltip title='Class options'>
							<IconButton
								aria-controls={openOption ? 'basic-menu' : undefined}
								aria-expanded={openOption ? 'true' : undefined}
								onClick={(event) => setOptionElement(event.currentTarget)}
							>
								<MoreVert />
							</IconButton>
						</Tooltip>

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
							<MenuItem onClick={() => setOptionElement(null)}>Edit</MenuItem>
							<MenuItem onClick={() => setOptionElement(null)}>
								Copy Invitation Link
							</MenuItem>
							<MenuItem
								onClick={() => setOptionElement(null)}
								sx={{ color: 'red' }}
							>
								Delete
							</MenuItem>
						</Menu>
					</div>
				</>
			)}
		</div>
	);
}

export default ClassCard;
