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
	},
});

export default theme;
