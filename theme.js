import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#1a237e',
            light: '#534bae',
            dark: '#000051',
        },
        secondary: {
            main: '#ff6f00',
            light: '#ffa040',
            dark: '#c43e00',
        },
        background: {
            default: '#f5f5f7',
        }
    },
    typography: {
        h3: {
            fontWeight: 700,
        },
        h4: {
            fontWeight: 600,
        }
    }
}); 