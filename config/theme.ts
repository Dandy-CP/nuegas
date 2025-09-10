import { createTheme } from '@mui/material';

const theme = createTheme({
	palette: {
		primary: {
			main: '#546FFF',
		},
	},
	components: {
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					fieldset: {
						borderRadius: '10px',
					},
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 12,
				},
			},
		},
		MuiDialog: {
			styleOverrides: {
				paper: {
					backgroundColor: '#eff5ff',
					borderRadius: 12,
					padding: 5,
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 12,
				},
			},
		},
	},
});

export default theme;
