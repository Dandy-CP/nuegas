import { useState } from 'react';
import { Divider, Tab, Tabs } from '@mui/material';
import { ClassForum } from '@/components/modules/class';

function ClassDetailPage() {
	const [tabValue, setTabValue] = useState(0);

	return (
		<div>
			<Tabs
				value={tabValue}
				onChange={(event, value) => setTabValue(value)}
				centered
			>
				<Tab label='Forum' />
				<Tab label='Assignment' />
				<Tab label='Quiz' />
				<Tab label='Member' />
			</Tabs>

			<Divider />

			<div className='mt-10 px-15'>
				{tabValue === 0 && <ClassForum />}

				{tabValue === 1 && <h1>Assignment</h1>}

				{tabValue === 2 && <h1>Quiz</h1>}

				{tabValue === 3 && <h1>Member</h1>}
			</div>
		</div>
	);
}

export default ClassDetailPage;
