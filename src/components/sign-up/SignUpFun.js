import "../login/Login.scss";
import "./SignUp.scss";
import {Autocomplete, Box, Container, CssBaseline, Grid, styled, ThemeProvider, Typography} from "@mui/material";
import {MuiTelInput} from "mui-tel-input";
import {useState} from "react";
import axios from "axios";
import {CustomizedTextField, theme} from "../login/Login";
import {Link, useNavigate} from "react-router-dom";
import LogoSVG from "../../LogoSVG";
import {countries} from "./countries";

export const CustomizedMuiTelInput = styled(MuiTelInput)`
  fieldset {
    border-radius: 50px;
  }
`;

const SignUpFun = (props) => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [country, setCountry] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    //TODO -сделать универсально
    const handleChange = (event) => {
        // this.setState({
        //     [event.target.name]: event.target.value
        // });
        switch (event.target.name) {
            case "firstName":
                setFirstName(event.target.value);
                break;
            case "lastName":
                setLastName(event.target.value);
                break;
            case "userName":
                setUsername(event.target.value);
                break;
            // case "phoneNumber":
            //     setPhoneNumber(event.target.value);
            //     break;
            // case "country":
            //     setCountry(event.target.value);
            //     break;
            case "confirmPassword":
                setConfirmPassword(event.target.value);
                break;
            case "email":
                setEmail(event.target.value);
                break;
            case "password":
                setPassword(event.target.value);
                break;
        }
    };

    const handleChangeTel = (newValue, info) => {
        // this.setState({
        //     phoneNumber: "+" + info.countryCallingCode + newValue
        // });
        setPhoneNumber("+" + info.countryCallingCode + newValue);
    };

    const handleChangeCountry = (event, newValue) => {
        // this.setState({
        //     country: newValue
        // });
        setCountry(newValue);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // this.setState({loading: true});
        setLoading(true);
        const newUserData = {
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            country: country,
            username: username,
            email: email,
            password: password,
            confirmPassword: confirmPassword
        };
        axios
            .post('/signup', newUserData)
            .then((response) => {
                localStorage.setItem('AuthToken', `${response.data.token}`);
                // this.setState({
                //     loading: false,
                // });
                setLoading(false)
                // this.props.history.push('/');
                navigate("/home");
            })
            .catch((error) => {
                // this.setState({
                //     errors: error.response.data,
                //     loading: false
                // });
                setErrors(error.response.data);
                setLoading(false);
            });
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="sm">
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
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
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
                                    onChange={handleChange}
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
                                    onChange={handleChange}
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
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <CustomizedMuiTelInput
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="phoneNumber"
                                    label="Phone Number"
                                    name="phoneNumber"
                                    autoComplete="phoneNumber"
                                    defaultCountry="RU"
                                    splitCallingCode
                                    helperText={errors.phoneNumber}
                                    error={!!errors.phoneNumber}
                                    value={phoneNumber}
                                    onChange={handleChangeTel}
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
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="country"
                                    name="country"
                                    options={countries}
                                    renderInput={(params) => <CustomizedTextField {...params}
                                                                                  fullWidth required
                                                                                  label="Country"/>}
                                    autoComplete="country"
                                    onChange={(event, value) => handleChangeCountry(event, value)}
                                    helperText={errors.country}
                                    error={!!errors.country}
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
                                    onChange={handleChange}
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
                                    onChange={handleChange}
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
                                onClick={handleSubmit}
                                disabled={loading ||
                                    !email ||
                                    !password ||
                                    !firstName ||
                                    !lastName ||
                                    !country ||
                                    !username ||
                                    !phoneNumber}
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
};

export default SignUpFun;