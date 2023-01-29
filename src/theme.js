import {createTheme} from "@mui/material";

export const theme = createTheme({
    typography: {
        fontFamily: [
            'Geometria Light'
        ].join(','),
        h4: {
            fontFamily: [
                'Geometria Medium'
            ].join(','),
        },
    },
    palette: {
        primary: {
            main: '#8613E0',
            // darker: '#FF7A00',
        },
        secondary: {
            main: '#FF7A00',
        },
        light: {
            light: '#FFFFFF',
            main: '#D9D9D9',
            dark: '#252525',
        }
    },
    shape: {
        lightRoundedBorderRadius: '20px',
        roundedBorderRadius: '50px',
    },
    shadow: {
        boxShadowCard: '4px 6px 8px 0 rgba(0, 0, 0, 0.05)'
    },
});
