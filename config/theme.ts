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
					borderRadius: 10,
				},
			},
		},
		MuiDialog: {
			styleOverrides: {
				paper: {
					backgroundColor: '#eff5ff',
					borderRadius: 18,
					padding: 5,
				},
			},
		},
	},
});

export default theme;
