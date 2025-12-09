import { setupSocketEvents, SocketStatus } from '@/utils/socketEvents';
import Cookies from 'js-cookie';
import qs from 'querystring';
import { useState, useRef, useEffect, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

interface Props {
	endpoint: string;
	query?: { [key: string]: any };
}

function useSocket({ endpoint, query }: Props) {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [status, setStatus] = useState<SocketStatus>({
		isConnected: false,
		reconnecting: false,
	});

	const socketRef = useRef<Socket | null>(null);

	const url = `${process.env.NEXT_PUBLIC_BASE_WS_URL}${endpoint}?${qs.stringify(query)}`;

	// Function to emit messages
	const emit = useCallback(
		(event: string, data: { [key: string]: string | number }) => {
			if (socketRef.current) {
				socketRef.current.emit(event, data);
			}
		},
		[]
	);

	// Function to subscribe to an event
	const on = useCallback(<T>(event: string, func: (data: T) => void) => {
		if (socketRef.current) {
			socketRef.current.on(event, (data) => func(data.data));

			// Return a cleanup function
			return () => {
				if (socketRef.current) {
					socketRef.current.off(event, func);
				}
			};
		}
	}, []);

	useEffect(() => {
		const socket = io(url, {
			extraHeaders: {
				Authorization: `Bearer ${Cookies.get('token')}`,
			},
		});

		// listen to socket events
		const cleanup = setupSocketEvents(socket, setStatus);

		socketRef.current = socket;
		setSocket(socket);

		return () => {
			socket.disconnect();
			socketRef.current = null;
			cleanup(); // cleanup events
		};
	}, [url]);

	return { socket, status, emit, on };
}

export default useSocket;
