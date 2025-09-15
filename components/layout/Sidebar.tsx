import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {
	ChecklistOutlined,
	DashboardOutlined,
	SchoolOutlined,
	ChatOutlined,
	SettingsOutlined,
} from '@mui/icons-material';

interface Props {
	path: string;
}

function Sidebar({ path }: Props) {
	const menu = [
		{
			label: 'Dashboard',
			Icon: DashboardOutlined,
			href: '/dashboard',
		},
		{
			label: 'My Task',
			Icon: ChecklistOutlined,
			href: '/dashboard/task',
		},
		{
			label: 'My Class',
			Icon: SchoolOutlined,
			href: '/dashboard/class',
		},
		{
			label: 'Message',
			Icon: ChatOutlined,
			href: '/dashboard/message',
		},
		{
			label: 'Settings',
			Icon: SettingsOutlined,
			href: '/dashboard/setting',
		},
	];

	return (
		<div className='sticky top-0 flex h-screen w-[330px] flex-col gap-10 bg-white p-6'>
			<Image
				src='/Logo.png'
				alt='logo'
				width={188}
				height={40}
				className='mx-auto'
			/>

			<div className='flex flex-col gap-5'>
				{menu.map((value, index) => (
					<Link
						href={value.href}
						className={`flex flex-row gap-3 rounded-[10px] px-5 py-3 text-[#8E92BC] hover:bg-[#F5F5F7] ${path === value.href ? 'bg-[#F5F5F7] text-black' : ''}`}
						key={index}
					>
						<value.Icon />
						<p className='font-semibold'>{value.label}</p>
					</Link>
				))}
			</div>
		</div>
	);
}

export default Sidebar;
