import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
	path: string;
	children: React.ReactNode;
}

function Layout({ path, children }: LayoutProps) {
	return (
		<div className='flex flex-row'>
			<Sidebar path={path} />

			<div className='w-full'>
				<Navbar />
				<div className='p-6'>{children}</div>
			</div>
		</div>
	);
}

export default Layout;
