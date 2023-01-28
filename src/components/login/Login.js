import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {
    Box,
    Container,
    createTheme,
    CssBaseline,
    Grid, IconButton, InputAdornment,
    styled,
    TextField,
    ThemeProvider,
    Typography
} from "@mui/material";

import LogoSVG from "../../LogoSVG";

import "./Login.scss";
import {Visibility, VisibilityOff} from "@mui/icons-material";

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
            darker: '#FF7A00',
        },
        neutral: {
            main: '#8613E0',
            contrastText: '#fff',
        },
    },
    shape: {
        borderRadius: '20px'
    }
});

export const CustomizedTextField = styled(TextField)`
  fieldset {
    border-radius: 50px;
  }
`;

const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleChange = (event) => {
        switch (event.target.name) {
            case "email":
                setEmail(event.target.value);
                break;
            case "password":
                setPassword(event.target.value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        const userData = {
            email: email,
            password: password
        };
        axios
            .post('/login', userData)
            .then((response) => {
                localStorage.setItem('AuthToken', `Bearer ${response.data.token}`);
                setLoading(false);
                navigate('/home');
            })
            .catch((error) => {
                console.log(error);
                setErrors(error.response.data);
                setLoading(false);
            });
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    // const handleMouseDownPassword = (evt) => {
    //     setShowPassword(!showPassword);
    //     // evt.preventDefault();
    // };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 6,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 8
                    }}
                >
                    <Link to={"/"} className="logo"><LogoSVG height={35} width={122}/></Link>
                    <Grid container
                          spacing={0}
                          direction="row"
                          alignItems="center"
                          justifyContent="space-evenly"
                          marginBottom="10px"
                    >
                        <Link to="/login" className="sign-switch checked-switch">sign in</Link>
                        <Link to="/signup" className="sign-switch">sign up</Link>
                    </Grid>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <CustomizedTextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            inputProps={{maxLength: 50}}
                            autoFocus
                            helperText={errors.email}
                            error={!!errors.email}
                            onChange={handleChange}
                        />
                        <CustomizedTextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            // type="password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            inputProps={{maxLength: 50}}
                            helperText={errors.password}
                            error={!!errors.password}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="end" sx={{marginRight: 1}}>
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            // onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                            }}
                        />
                        {/*<FormControlLabel*/}
                        {/*    control={<Checkbox value="remember" color="primary" />}*/}
                        {/*    label="Remember me"*/}
                        {/*/>*/}
                        <Grid container
                              spacing={0}
                              direction="column"
                              alignItems="center"
                              justifyContent="center"
                        >
                            <button
                                className="sign-button_login-signup"
                                type="submit"
                                onClick={handleSubmit}
                                disabled={loading || !email || !password}
                            >
                                Sign In
                            </button>
                            {errors.general && (
                                <Typography variant="body2" className="custom-error">
                                    {errors.general}
                                </Typography>
                            )}
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Login;