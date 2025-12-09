import { Socket } from 'socket.io-client';

export interface SocketStatus {
	isConnected: boolean;
	reconnecting: boolean;
	error?: string | null;
}

export function setupSocketEvents(
	socket: Socket,
	setStatus: (status: SocketStatus) => void
) {
	// --- CONNECTED ---
	socket.on('connect', () => {
		console.info('🟢 Socket connected:', socket.id);
		setStatus({ isConnected: true, reconnecting: false, error: null });
	});

	// --- DISCONNECTED ---
	socket.on('disconnect', (reason) => {
		console.warn('🔴 Socket disconnected:', reason);
		setStatus({ isConnected: false, reconnecting: false });
	});

	// --- CONNECT ERROR ---
	socket.on('connect_error', (err) => {
		console.error('❌ Connection error:', err.message);
		setStatus({ isConnected: false, reconnecting: false, error: err.message });
	});

	// --- RECONNECT SUCCESS ---
	socket.on('reconnect', (attemptNumber) => {
		console.log('♻️ Socket reconnected after', attemptNumber, 'tries');
		setStatus({ isConnected: true, reconnecting: false, error: null });
	});

	// --- RECONNECT ERROR ---
	socket.on('reconnect_error', (err) => {
		console.error('⚠️ Reconnect error:', err.message);
		setStatus({
			isConnected: false,
			reconnecting: true,
			error: err.message,
		});
	});

	// --- RECONNECT FAILED ---
	socket.on('reconnect_failed', () => {
		console.error('🚫 Reconnect failed');
		setStatus({ isConnected: false, reconnecting: false });
	});

	return () => {
		socket.off('connect');
		socket.off('disconnect');
		socket.off('connect_error');
		socket.off('reconnect');
		socket.off('reconnect_error');
		socket.off('reconnect_failed');
		socket.off('error');
	};
}
