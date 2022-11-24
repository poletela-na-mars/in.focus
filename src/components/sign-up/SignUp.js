import {Component} from "react";
import axios from "axios";
import {Box, Button, Container, CssBaseline, Grid, TextField, ThemeProvider, Typography} from "@mui/material";
import {CustomizedTextField, theme} from "../login/Login";
import {Link} from "react-router-dom";
import LogoSVG from "../../LogoSVG";

import "./../login/Login.scss";

class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            country: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
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
        event.preventDefault();
        this.setState({loading: true});
        const newUserData = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phoneNumber: this.state.phoneNumber,
            country: this.state.country,
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword
        };
        axios
            .post('/signup', newUserData)
            .then((response) => {
                localStorage.setItem('AuthToken', `${response.data.token}`);
                this.setState({
                    loading: false,
                });
                // this.props.history.push('/');
            })
            .catch((error) => {
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
                    ><Link to={"/"} className="logo"><LogoSVG height={35} width={122}/></Link>
                        <Grid container
                              spacing={0}
                              direction="row"
                              alignItems="center"
                              justifyContent="space-evenly"
                              marginBottom="10px"
                        >
                            <Link to="/login" className="sign-switch">sign in</Link>
                            <Link to="/signup" className="sign-switch checked-switch">sign up</Link>
                        </Grid>
                        <Box component="form" onSubmit={this.handleSubmit} noValidate sx={{mt: 1}}>
                            <Grid container spacing={2} marginTop="3px">
                                <Grid item xs={12} sm={6}>
                                    <CustomizedTextField
                                        autoFocus
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        name="firstName"
                                        autoComplete="firstName"
                                        helperText={errors.firstName}
                                        error={!!errors.firstName}
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <CustomizedTextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Last Name"
                                        name="lastName"
                                        autoComplete="lastName"
                                        helperText={errors.lastName}
                                        error={!!errors.lastName}
                                        onChange={this.handleChange}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <CustomizedTextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="username"
                                        label="User Name"
                                        name="username"
                                        autoComplete="username"
                                        helperText={errors.username}
                                        error={!!errors.username}
                                        onChange={this.handleChange}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <CustomizedTextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="phoneNumber"
                                        label="Phone Number"
                                        name="phoneNumber"
                                        autoComplete="phoneNumber"
                                        pattern="[7-9]{1}[0-9]{9}"
                                        helperText={errors.phoneNumber}
                                        error={!!errors.phoneNumber}
                                        onChange={this.handleChange}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <CustomizedTextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        helperText={errors.email}
                                        error={!!errors.email}
                                        onChange={this.handleChange}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <CustomizedTextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="country"
                                        label="Country"
                                        name="country"
                                        autoComplete="country"
                                        helperText={errors.country}
                                        error={!!errors.country}
                                        onChange={this.handleChange}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <CustomizedTextField
                                        variant="outlined"
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
                                </Grid>
                                <Grid item xs={12}>
                                    <CustomizedTextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        type="password"
                                        id="confirmPassword"
                                        autoComplete="current-password"
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container
                                  spacing={0}
                                  direction="column"
                                  alignItems="center"
                                  justifyContent="center"
                                  marginTop="20px"
                            >
                                <Typography variant="body2" marginTop="15px">
                                    By using in.focus you accept our
                                    Terms of Service and Privacy Policy
                                </Typography>
                                <button
                                    className="sign-button_login-signup"
                                    type="submit"
                                    onClick={this.handleSubmit}
                                    disabled={loading ||
                                        !this.state.email ||
                                        !this.state.password ||
                                        !this.state.firstName ||
                                        !this.state.lastName ||
                                        !this.state.country ||
                                        !this.state.username ||
                                        !this.state.phoneNumber}
                                >
                                    Sign Up
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

export default SignUp;