import { useRouter } from 'next/router';
import { useState } from 'react';
import { Divider, Tab, Tabs } from '@mui/material';
import { ErrorView } from '@/components/modules';
import {
	ClassAssignment,
	ClassForum,
	ClassMember,
} from '@/components/modules/class';
import { GetClassDetail } from '@/service/api/class/class.query';

function ClassDetailPage() {
	const [tabValue, setTabValue] = useState(0);

	const router = useRouter();
	const classId = router.query.classId as string;

	const { data, isError, refetch } = GetClassDetail(
		{ class_id: classId },
		{ queryKey: [classId], enabled: classId !== undefined }
	);

	const classDetail = data?.data;
	const isClassOwner = data?.data.isOwner ?? false;

	if (isError) {
		return (
			<div className='my-40'>
				<ErrorView onRefetch={() => refetch()} />
			</div>
		);
	}

	return (
		<div>
			<Tabs
				value={tabValue}
				onChange={(event, value) => setTabValue(value)}
				centered
			>
				<Tab label='Forum' />
				<Tab label='Assignment' />
				<Tab label='Member' />
			</Tabs>

			<Divider />

			<div className='mt-10 px-15'>
				{tabValue === 0 && (
					<ClassForum
						classId={classId}
						classDetail={classDetail}
						isClassOwner={isClassOwner}
					/>
				)}

				{tabValue === 1 && (
					<ClassAssignment
						classId={classId}
						isClassOwner={isClassOwner}
						className={classDetail?.name}
					/>
				)}

				{tabValue === 2 && (
					<ClassMember classId={classId} isClassOwner={isClassOwner} />
				)}
			</div>
		</div>
	);
}

export default ClassDetailPage;
