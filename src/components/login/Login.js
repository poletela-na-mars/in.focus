import "@emotion/react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {
    Box,
    Container,
    createTheme,
    CssBaseline,
    Grid,
    styled,
    TextField,
    ThemeProvider,
    Typography
} from "@mui/material";
import {Component} from "react";

import "./Login.scss";

import LogoSVG from "../../LogoSVG";

export const theme = createTheme({
    typography: {
        fontFamily: [
            'Geometria Light'
        ].join(',')
    },
    palette: {
        primary: {
            main: '#8613E0',
            darker: '#FF7A00',
        },
        neutral: {
            main: '#8613E0',
            contrastText: '#fff',
        }
    }
});

export const CustomizedTextField = styled(TextField)`
  fieldset {
    border-radius: 50px;
  }
`;

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            errors: [],
            loading: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
            this.setState({
                errors: nextProps.UI.errors
            });
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleSubmit = (event) => {
        const navigate = useNavigate();

        event.preventDefault();
        this.setState({loading: true});
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        axios
            .post('/login', userData)
            .then((response) => {
                localStorage.setItem('AuthToken', `Bearer ${response.data.token}`);
                this.setState({
                    loading: false,
                });
                //this.props.history.push('/');
                navigate('/home');
                console.log('here');
                // return <Navigate to="/home" />
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    errors: error.response.data,
                    loading: false
                });
            });
    };

    render() {
        const {errors, loading} = this.state;
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
                        <Box component="form" onSubmit={this.handleSubmit} noValidate sx={{mt: 1}}>
                            <CustomizedTextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                helperText={errors.email}
                                error={!!errors.email}
                                onChange={this.handleChange}
                            />
                            <CustomizedTextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                helperText={errors.password}
                                error={!!errors.password}
                                onChange={this.handleChange}
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
                                    onClick={this.handleSubmit}
                                    disabled={loading || !this.state.email || !this.state.password}
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
    }
}

export default Login;
