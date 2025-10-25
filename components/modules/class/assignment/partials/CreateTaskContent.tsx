import moment from 'moment';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Editor, {
	BtnBold,
	BtnItalic,
	BtnUnderline,
	Toolbar as EditorToolbar,
} from 'react-simple-wysiwyg';
import { toast } from 'react-toastify';
import { Add, Close, Delete, Link, Upload } from '@mui/icons-material';
import {
	AppBar,
	Autocomplete,
	Button,
	createFilterOptions,
	Dialog,
	IconButton,
	TextField,
	Toolbar,
	Tooltip,
	Typography,
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateAssignmentTask } from '@/service/api/assignment/assignment.mutation';
import { CreateTopic, DeleteTopic } from '@/service/api/topic/topic.mutation';
import { GetClassTopic } from '@/service/api/topic/topic.query';
import { CreateAssignment } from '@/types/assignment.types';
import { Topic } from '@/types/topic.types';
import { CreateAssignmentSchema } from '@/schema/class.schema';
import AttachmentLinkForm from '../../AttachmentLinkForm';
import UploadFileForm from '../../UploadFileForm';
import { AttachmentPreview } from '../../partials';

interface Props {
	classId: string;
	className?: string;
	setIsCreateTaskOpen: React.Dispatch<React.SetStateAction<boolean>>;
	onRefetch: () => void;
}

const filter = createFilterOptions<Topic>();

function CreateTaskContent({
	classId,
	className,
	setIsCreateTaskOpen,
	onRefetch,
}: Props) {
	const [selectedTopic, setSelectedTopic] = useState<Topic | null>();
	const [attachment, setAttachment] = useState<string[]>([]);
	const [isAttachmentDialogOpen, setIsAttachmentDialogOpen] = useState(false);
	const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<CreateAssignment>({
		defaultValues: {
			title: '',
			content: '',
			start_date: '',
			due_date: '',
		},
		resolver: zodResolver(CreateAssignmentSchema),
	});

	const { data, isFetching, refetch } = GetClassTopic({
		class_id: classId,
	});

	const { mutateAsync, isPending } = CreateAssignmentTask(
		{
			class_id: classId,
		},
		{
			onSuccess() {
				onRefetch();
				setIsCreateTaskOpen(false);
			},
			onError() {
				toast.error('Error on create assignment');
			},
		}
	);

	const { mutateAsync: createTopicRequest, isPending: isCreateTopicPending } =
		CreateTopic(
			{
				class_id: classId,
			},
			{
				onSuccess(data) {
					refetch();
					setSelectedTopic(data.data);
				},
				onError() {
					toast.error('Error on Create Topic');
				},
			}
		);

	const { mutateAsync: deleteTopicRequest, isPending: isDeleteTopicPending } =
		DeleteTopic({
			onSuccess() {
				refetch();
			},
			onError() {
				toast.error('Error on Delete Topic');
			},
		});

	const classTopic = data?.data ?? [];

	function handleOnAddAttachment(url: string) {
		setAttachment((prev) => [...prev, url]);
	}

	function handleOnDeleteAttachment(index: number) {
		const updatedAttachment = attachment.filter((_, idx) => idx !== index);

		setAttachment(updatedAttachment);
	}

	const onSubmit: SubmitHandler<CreateAssignment> = (data) => {
		const payload = {
			title: data.title,
			content: data.content,
			start_date: data.start_date,
			due_date: data.due_date,
			...(attachment.length !== 0 && { attachment: attachment }),
			...(selectedTopic?.topic_id && { topic: selectedTopic.topic_id }),
		};

		mutateAsync(payload);
	};

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<AppBar
					color='default'
					elevation={0}
					sx={{ position: 'relative', backgroundColor: 'white' }}
					className='border-b border-gray-300'
				>
					<Toolbar>
						<IconButton
							edge='start'
							color='inherit'
							onClick={() => setIsCreateTaskOpen(false)}
							aria-label='close'
						>
							<Close />
						</IconButton>

						<Typography sx={{ ml: 2, flex: 1 }}>Create Task</Typography>

						<Button
							type='submit'
							variant='contained'
							startIcon={<Add />}
							disabled={isPending}
						>
							Create New Task
						</Button>
					</Toolbar>
				</AppBar>

				<div className='flex flex-row justify-between'>
					<div className='flex w-full flex-col gap-5 p-5'>
						<div className='flex w-full flex-col gap-5 rounded-lg border border-gray-300 bg-white p-5'>
							<TextField
								label='Task Title'
								fullWidth
								className='rounded-xl bg-[#F0F3F4]'
								error={errors.title !== undefined}
								helperText={errors.title?.message}
								disabled={isPending}
								{...register('title')}
							/>

							<Controller
								name='content'
								control={control}
								disabled={isPending}
								render={({ field }) => (
									<div>
										<Editor
											value={field.value}
											onChange={(event) => field.onChange(event.target.value)}
											disabled={isPending}
											containerProps={{
												style: {
													height: 250,
													backgroundColor: '#F0F3F4',
													borderRadius: 5,
													border:
														errors.content === undefined
															? 'none'
															: '1px solid red',
													flexDirection: 'column-reverse',
												},
											}}
										>
											<EditorToolbar>
												<BtnBold />
												<BtnItalic />
												<BtnUnderline />
											</EditorToolbar>
										</Editor>

										<p className='mt-3 ml-3 text-xs text-red-500'>
											{errors.content?.message}
										</p>
									</div>
								)}
							/>

							<AttachmentPreview
								showDelete
								attachment={attachment}
								onDeleteAttachment={handleOnDeleteAttachment}
							/>
						</div>

						<div className='w-full rounded-lg border border-gray-300 bg-white p-5'>
							<p className='mb-5 font-semibold text-gray-500'>Attachment</p>

							<div className='flex flex-row justify-center gap-3'>
								<Tooltip title='Upload file'>
									<IconButton
										size='large'
										disabled={isPending}
										onClick={() => setIsUploadDialogOpen(true)}
									>
										<Upload fontSize='large' />
									</IconButton>
								</Tooltip>

								<Tooltip title='Attach Link'>
									<IconButton
										size='large'
										disabled={isPending}
										onClick={() => setIsAttachmentDialogOpen(true)}
									>
										<Link fontSize='large' />
									</IconButton>
								</Tooltip>
							</div>
						</div>
					</div>

					<div className='flex h-screen w-1/3 flex-col gap-5 border-l border-l-gray-300 bg-white p-5'>
						<h1 className='text-xl font-semibold'>{className}</h1>

						<div>
							<p className='mb-3 text-sm font-semibold text-gray-500'>
								Start Date
							</p>

							<LocalizationProvider dateAdapter={AdapterMoment}>
								<Controller
									name='start_date'
									control={control}
									disabled={isPending}
									render={({ field }) => (
										<DateTimePicker
											label='Select Start Date'
											value={moment(field.value)}
											onChange={(newValue) =>
												field.onChange(moment(newValue).toISOString())
											}
											slots={{
												textField: (props) => (
													<TextField
														{...props}
														error={errors.start_date !== undefined}
														helperText={errors.start_date?.message}
													/>
												),
											}}
											sx={{
												width: '100%',
											}}
											enableAccessibleFieldDOMStructure={false}
										/>
									)}
								/>
							</LocalizationProvider>
						</div>

						<div>
							<p className='mb-3 text-sm font-semibold text-gray-500'>
								End Date
							</p>
							<LocalizationProvider dateAdapter={AdapterMoment}>
								<Controller
									name='due_date'
									control={control}
									disabled={isPending}
									render={({ field }) => (
										<DateTimePicker
											label='Select End Date'
											value={moment(field.value)}
											onChange={(newValue) =>
												field.onChange(moment(newValue).toISOString())
											}
											slots={{
												textField: (props) => (
													<TextField
														{...props}
														error={errors.due_date !== undefined}
														helperText={errors.due_date?.message}
													/>
												),
											}}
											sx={{
												width: '100%',
											}}
											enableAccessibleFieldDOMStructure={false}
										/>
									)}
								/>
							</LocalizationProvider>
						</div>

						<div>
							<p className='mb-3 text-sm font-semibold text-gray-500'>
								Class Topic
							</p>

							<Autocomplete
								value={selectedTopic}
								options={classTopic}
								selectOnFocus
								clearOnBlur
								handleHomeEndKeys
								freeSolo
								disabled={
									isFetching ||
									isCreateTopicPending ||
									isDeleteTopicPending ||
									isPending
								}
								onChange={(event, newValue) => {
									if (typeof newValue === 'string') {
										return;
									}

									if (newValue && newValue.topic_id.length === 0) {
										// Create a new value from the user input

										const nameValue = newValue.name
											.split('-')[1]
											.replaceAll('"', '');

										createTopicRequest({
											name: nameValue,
										});
									} else {
										setSelectedTopic(newValue);
									}
								}}
								filterOptions={(options, params) => {
									const filtered = filter(options, params);
									const { inputValue } = params;

									// Suggest the creation of a new value
									const isExisting = options.some(
										(option) => inputValue === option.name
									);

									if (inputValue !== '' && !isExisting) {
										filtered.push({
											name: `Add Topic - "${inputValue}"`,
											topic_id: '',
											class_id: '',
										});
									}

									return filtered;
								}}
								getOptionLabel={(option) => {
									// Value selected with enter, right from the input
									if (typeof option === 'string') {
										return option;
									}

									if (option.topic_id.length === 0) {
										return option.name.split('-')[1].replaceAll('"', '');
									}

									// Regular option
									return option.name;
								}}
								renderOption={(props, option) => {
									const { key, ...optionProps } = props;

									return (
										<div key={key} className='relative'>
											<li className='p-3' {...optionProps}>
												{option.name}
											</li>

											{option.topic_id !== selectedTopic?.topic_id && (
												<div className='absolute top-0 right-0'>
													<IconButton
														onClick={() => {
															deleteTopicRequest({
																topic_id: option.topic_id,
															});
														}}
													>
														<Delete color='error' fontSize='small' />
													</IconButton>
												</div>
											)}
										</div>
									);
								}}
								renderInput={(params) => (
									<TextField {...params} label='Select Topic' />
								)}
							/>
						</div>
					</div>
				</div>
			</form>

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
		</>
	);
}

export default CreateTaskContent;
