import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { FileCopy } from '@mui/icons-material';
import {
	Button,
	DialogActions,
	DialogTitle,
	LinearProgress,
	styled,
} from '@mui/material';
import { UploadFile } from '@/service/api/upload/upload.mutation';

interface Props {
	setIsUploadDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleOnAddAttachment(url: string): void;
}

function UploadFileForm({
	setIsUploadDialogOpen,
	handleOnAddAttachment,
}: Props) {
	const [file, setFile] = useState<File | null>();
	const [previewFile, setPreviewFile] = useState<string | null>(null);

	const { mutateAsync, progress, isPending } = UploadFile({
		onSuccess(data) {
			handleOnAddAttachment(data.data.url);
			setIsUploadDialogOpen(false);
		},
		onError() {
			toast.error('Error on uploading');
		},
	});

	const VisuallyHiddenInput = styled('input')({
		clip: 'rect(0 0 0 0)',
		clipPath: 'inset(50%)',
		height: 1,
		overflow: 'hidden',
		position: 'absolute',
		bottom: 0,
		left: 0,
		whiteSpace: 'nowrap',
		width: 1,
	});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0] || null;

		setFile(selectedFile);

		if (selectedFile) {
			const objectUrl = URL.createObjectURL(selectedFile);
			setPreviewFile(objectUrl);
		} else {
			setPreviewFile(null);
		}
	};

	function handleUploadFile() {
		mutateAsync({
			file: file as File,
		});
	}

	return (
		<>
			<DialogTitle>Upload Files</DialogTitle>

			<div className='flex flex-col items-center justify-center gap-5 p-5'>
				{previewFile ? (
					<>
						{file?.type.includes('image') ? (
							<Image src={previewFile} alt='' width={400} height={400} />
						) : (
							<a
								href={previewFile}
								target='_blank'
								className='flex w-full flex-row items-center gap-5 rounded-md border border-gray-300 p-3'
							>
								<FileCopy className='text-gray-500' />

								<p className='font-semibold hover:text-blue-500'>
									{file?.name}
								</p>
							</a>
						)}
					</>
				) : (
					<Button
						component='label'
						role={undefined}
						variant='text'
						tabIndex={-1}
						className='mx-auto'
					>
						<Image src='/images/upload.svg' alt='' width={250} height={250} />
						<VisuallyHiddenInput
							type='file'
							onChange={(event) => handleFileChange(event)}
							multiple
						/>
					</Button>
				)}

				{previewFile && !isPending && (
					<div className='flex w-full flex-row justify-center gap-3'>
						<Button
							fullWidth
							variant='outlined'
							color='error'
							onClick={() => setPreviewFile(null)}
						>
							Remove
						</Button>

						<Button
							fullWidth
							variant='contained'
							onClick={() => handleUploadFile()}
						>
							Upload
						</Button>
					</div>
				)}

				{isPending && (
					<div className='w-full'>
						<p className='mb-2 text-center'>Uploading...</p>
						<LinearProgress variant='determinate' value={progress} />
					</div>
				)}
			</div>

			<DialogActions>
				<Button
					sx={{ color: 'red' }}
					onClick={() => setIsUploadDialogOpen(false)}
					disabled={isPending}
					loading={isPending}
				>
					Cancel
				</Button>
			</DialogActions>
		</>
	);
}

export default UploadFileForm;
