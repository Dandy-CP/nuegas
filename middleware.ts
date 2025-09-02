import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const { cookies, nextUrl } = request;
	const { pathname } = nextUrl;

	const token = cookies.get('token')?.value;
	const isRootPage = pathname === '/';
	const isAuthPage = pathname === '/auth' || pathname === '/signup';
	const isDashboardPage = pathname.includes('dashboard');

	if (token && isRootPage) {
		// If the user is already authenticated and tries to access the root page,
		// then redirect them to the dashboard page
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	if (!token && isRootPage) {
		// If the user is not authenticated and tries to access the root page,
		// then redirect them to the auth page
		return NextResponse.redirect(new URL('/auth', request.url));
	}

	if (token && isAuthPage) {
		// If the user is already authenticated and tries to access the auth page,
		// then redirect them to the home page
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	if (!token && isDashboardPage) {
		// If the user not authenticated and tries to access the dashboard page,
		// then redirect them to the auth page
		return NextResponse.redirect(new URL('/auth', request.url));
	}

	// continue to the next middleware or the requested page
	return NextResponse.next();
}
