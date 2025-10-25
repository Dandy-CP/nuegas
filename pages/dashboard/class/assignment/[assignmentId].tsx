import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Divider, Tab, Tabs } from '@mui/material';
import { ErrorView } from '@/components/modules';
import {
	AssignmentTabDetail,
	MemberSubmissionResults,
} from '@/components/modules/class';
import { GetAssignmentDetail } from '@/service/api/assignment/assignment.query';

function AssignmentDetail() {
	const [tabValue, setTabValue] = useState(0);

	const router = useRouter();
	const assignmentId = router.query.assignmentId as string | undefined;
	const classId = router.query.classId as string | undefined;

	const { data, isError, refetch } = GetAssignmentDetail(
		{ assignment_id: assignmentId as string },
		{ queryKey: [assignmentId], enabled: assignmentId !== undefined }
	);

	const assignmentDetail = data?.data;

	if (isError) {
		return (
			<ErrorView
				onRefetch={() => {
					refetch();
				}}
			/>
		);
	}

	return (
		<div>
			{assignmentDetail?.isOwnerClass && (
				<>
					<Tabs
						value={tabValue}
						onChange={(event, value) => setTabValue(value)}
					>
						<Tab label='Detail' />
						<Tab label='Member assignments' />
					</Tabs>

					<Divider />
				</>
			)}

			{tabValue === 0 && (
				<AssignmentTabDetail
					assignmentDetail={assignmentDetail}
					refetch={() => {
						refetch();
					}}
					assignmentId={assignmentId}
					classId={classId}
				/>
			)}

			{tabValue === 1 && (
				<MemberSubmissionResults assignmentId={assignmentId} />
			)}
		</div>
	);
}

export default AssignmentDetail;
