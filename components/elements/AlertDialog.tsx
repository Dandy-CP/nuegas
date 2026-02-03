import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface AlertDialogProps {
	title: string;
	message: string;
	isOpen: boolean;
	onAccept: () => void;
	onClose: () => void;
	isLoading?: boolean;
}

export default function AlertDialog({
	title,
	message,
	isOpen,
	onAccept,
	onClose,
	isLoading = false,
}: AlertDialogProps) {
	const handleClose = () => {
		!isLoading && onClose();
	};

	return (
		<Dialog open={isOpen} onClose={handleClose}>
			<DialogTitle>{title}</DialogTitle>

			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{message}
				</DialogContentText>
			</DialogContent>

			<DialogActions>
				<Button
					disabled={isLoading}
					loading={isLoading}
					onClick={() => {
						onAccept();
					}}
				>
					Yes
				</Button>

				<Button
					disabled={isLoading}
					loading={isLoading}
					onClick={handleClose}
					autoFocus
				>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
}
