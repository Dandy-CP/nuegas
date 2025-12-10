import React, { useState } from 'react';
import { PersonAddOutlined } from '@mui/icons-material';
import { Dialog, Divider, IconButton } from '@mui/material';
import { Loader } from '@/components/elements';
import { useAuth } from '@/hooks';
import {
	GetClassMember,
	GetPendingMember,
} from '@/service/api/class/class.query';
import ErrorView from '../../ErrorView';
import InviteMemberDialog from './partials/InviteMemberDialog';
import MemberCard from './partials/MemberCard';

interface Props {
	classId: string;
	isClassOwner: boolean;
}

function ClassMember({ classId, isClassOwner }: Props) {
	const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

	const { authData } = useAuth();

	const { data, isFetching, isError, refetch } = GetClassMember({
		class_id: classId,
	});
	const {
		data: pendingMemberData,
		isFetching: isPendingMemberFetching,
		isError: isPendingMemberError,
		refetch: refetchPendingMember,
	} = GetPendingMember({ class_id: classId });

	const member = data?.items?.filter((value) => value.role !== 'OWNER') ?? [];
	const pendingMember = pendingMemberData?.data ?? [];
	const owner = data?.items.filter((value) => value.role === 'OWNER') ?? [];

	if (isError) {
		return (
			<div className='my-40'>
				<ErrorView onRefetch={() => refetch()} />
			</div>
		);
	}

	if (isFetching || isPendingMemberFetching) {
		return <Loader />;
	}

	return (
		<div className='px-30'>
			<div>
				<h1 className='text-2xl font-semibold'>Class Owner</h1>
				<Divider sx={{ marginY: 2 }} />

				<MemberCard
					isClassOwner={isClassOwner}
					name={owner[0]?.user.name}
					profileImage={owner[0]?.user.profile_image}
					memberId={owner[0]?.class_member_id}
					userId={owner[0]?.user.user_id}
					showOption={owner[0]?.user.user_id !== authData?.user_id}
					onRefetch={() => {
						refetch();
					}}
				/>
			</div>

			{isClassOwner && pendingMember.length !== 0 && (
				<div className='mt-10'>
					<div className='flex flex-row items-center justify-between'>
						<h1 className='text-2xl font-semibold'>Pending Member</h1>

						<p className='text-sm font-semibold'>
							{pendingMember.length ?? 0} Pending Member
						</p>
					</div>

					<Divider sx={{ marginY: 2 }} />

					{pendingMember.map((value) => (
						<MemberCard
							key={value.id}
							type='PENDING'
							isClassOwner={isClassOwner}
							name={value.email}
							profileImage=''
							memberId={value.id}
							userId={value.id}
							onRefetch={() => {
								refetchPendingMember();
							}}
						/>
					))}

					{isPendingMemberError && (
						<ErrorView onRefetch={() => refetchPendingMember()} />
					)}
				</div>
			)}

			<div className='mt-10'>
				<div className='flex flex-row items-center justify-between'>
					<h1 className='text-2xl font-semibold'>Class Member</h1>

					<div className='flex flex-row items-center gap-3'>
						<p className='text-sm font-semibold'>
							{data?.totalItems ?? 0} Member
						</p>

						{isClassOwner && (
							<IconButton onClick={() => setIsInviteDialogOpen(true)}>
								<PersonAddOutlined />
							</IconButton>
						)}
					</div>
				</div>

				<Divider sx={{ marginY: 2 }} />

				{member.map((value) => (
					<MemberCard
						key={value.class_member_id}
						isClassOwner={isClassOwner}
						name={value.user.name}
						profileImage={value.user.profile_image}
						memberId={value.class_member_id}
						userId={value.user.user_id}
						showOption={value.user.user_id !== authData?.user_id}
						onRefetch={() => {
							refetch();
						}}
					/>
				))}
			</div>

			<Dialog fullWidth open={isInviteDialogOpen}>
				<InviteMemberDialog
					classId={classId}
					setIsInviteDialogOpen={setIsInviteDialogOpen}
					onRefetch={() => {
						refetch();
						refetchPendingMember();
					}}
				/>
			</Dialog>
		</div>
	);
}

export default ClassMember;
