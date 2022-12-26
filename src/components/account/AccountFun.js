import {useEffect, useState} from "react";
import {authMiddleWare} from "../../util/auth";
import {CustomizedTextField, theme} from "../login/LoginFun";
import axios from "axios";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Container,
    Grid,
    styled,
    ThemeProvider,
    Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";

import "./Account.scss";

// function CloudUploadIcon() {
//     return null;
// }

export const CustomizedCard = styled(Card)`
  box-shadow: 4px 6px 8px 0 rgba(0, 0, 0, 0.05);
  border-radius: 20px;
`;

const AccountFun = (props) => {
    const navigate = useNavigate();

    const [mounted, setMounted] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [username, setUsername] = useState('');
    const [country, setCountry] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [uiLoading, setUiLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [imageError, setImageError] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [error403, setError403] = useState(false);
    const [image, setImage] = useState('');
    const [content, setContent] = useState('');
    // const [userId, setUserId] = useState('');

    if (!mounted) {
        authMiddleWare(navigate);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = {Authorization: `${authToken}`};
        axios
            .get('/user')
            .then((response) => {
                setFirstName(response.data.userCredentials.firstName);
                setLastName(response.data.userCredentials.lastName);
                setEmail(response.data.userCredentials.email);
                setPhoneNumber(response.data.userCredentials.phoneNumber);
                setCountry(response.data.userCredentials.country);
                setUsername(response.data.userCredentials.username);
                setUiLoading(false);
                // setUserId(response.data.userCredentials.userId);
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    setError403(true);
                }
                console.log(error);
                setErrorMsg('Error in retrieving the data');
            });
    }

    useEffect(() => {
        setMounted(true);
        if (error403) {
            setTimeout(() => {
                navigate("/login")
            }, 0)
            // navigate("/login");
        }
    }, [error403, navigate])

    //TODO - какие точно нужны, проверить
    const handleChange = (event) => {
        switch (event.target.name) {
            case "firstName":
                setFirstName(event.target.value);
                break;
            case "lastName":
                setLastName(event.target.value);
                break;
            case "username":
                setUsername(event.target.value);
                break;
            case "email":
                setEmail(event.target.value);
                break;
            default:
                break;
        }
    };

    const handleImageChange = (event) => {
        // this.setState({
        //     image: event.target.files[0]
        // });
        setProfilePicture(event.target.files[0]);
    };

    const deleteUserHandler = (event) => {
        authMiddleWare(navigate);
        const authToken = localStorage.getItem("AuthToken");
        axios.defaults.headers.common = {Authorization: `${authToken}`};

        event.preventDefault();
        setUiLoading(true);
        // const userData = {
        //     username: username,
        // };
        axios
            .delete(`/users/${username}`)
            .then(() => {
                localStorage.removeItem('AuthToken');
                setUiLoading(false);
                navigate('/login');
            })
            .catch((error) => {
                console.log(error);
                // setErrors(error.response.data);
                // setLoading(false);
            });
    };

    const profilePictureHandler = (event) => {
        event.preventDefault();
        setUiLoading(true);
        authMiddleWare(navigate);
        const authToken = localStorage.getItem('AuthToken');
        let form_data = new FormData();
        form_data.append('image', setImage());
        form_data.append('content', content);
        axios.defaults.headers.common = {Authorization: `${authToken}`};
        axios
            .post('/user/image', form_data, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    navigate("/login");
                }
                console.log(error);
                setUiLoading(false);
                setImageError('Error in posting the data');
            });
    };

    const updateFormValues = (event) => {
        event.preventDefault();
        setButtonLoading(true);
        authMiddleWare(navigate);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = {Authorization: `${authToken}`};
        const formRequest = {
            firstName: firstName,
            lastName: lastName,
            country: country
        };
        axios
            .post('/user', formRequest)
            .then(() => {
                setButtonLoading(false);
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    navigate("/login");
                }
                console.log(error);
                setButtonLoading(false);
            });
    };

    // const {classes, ...rest} = this.props;
    return uiLoading === true ? (
        <main className="container">
            {/*<div className="toolbar"/>*/}
            {uiLoading && <CircularProgress size={100} className="loader"/>}
        </main>
    ) : (
        <ThemeProvider theme={theme}>
            <main className="content container">
                {/*<div className="toolbar"/>*/}
                {/*<Card {...rest} className={clsx(classes.root, classes)}>*/}
                <Container maxWidth="md">
                    <Box className="box">
                        <CustomizedCard variant="outlined">
                            <CardContent>
                                <div className="details">
                                    <div>
                                        <Typography className="name-surname" gutterBottom variant="h4">
                                            {firstName} {lastName}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            type="submit"
                                            size="small"
                                            // startIcon={<CloudUploadIcon/>}
                                            className="upload-button"
                                            onClick={profilePictureHandler}
                                        >
                                            Upload Photo
                                        </Button>
                                        <input type="file" onChange={handleImageChange}/>

                                        {imageError ? (
                                            <div className="custom-error">
                                                {' '}
                                                Wrong Image Format || Supported Format are PNG and JPG
                                            </div>
                                        ) : false}
                                    </div>
                                </div>
                                <div className="progress"/>
                            </CardContent>
                            {/*<Divider/>*/}
                        </CustomizedCard>

                        <br/>
                        {/*<Card {...rest} className={clsx(classes.root, classes)}>*/}
                        <CustomizedCard variant="outlined">
                            <form autoComplete="off" noValidate>
                                {/*<Divider/>*/}
                                <CardContent>
                                    <Grid container spacing={3}>
                                        <Grid item md={6} xs={12}>
                                            <CustomizedTextField
                                                fullWidth
                                                label="First name"
                                                margin="dense"
                                                name="firstName"
                                                variant="outlined"
                                                value={firstName}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <CustomizedTextField
                                                fullWidth
                                                label="Last name"
                                                margin="dense"
                                                name="lastName"
                                                variant="outlined"
                                                value={lastName}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <CustomizedTextField
                                                fullWidth
                                                label="Email"
                                                margin="dense"
                                                name="email"
                                                variant="outlined"
                                                disabled={true}
                                                value={email}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <CustomizedTextField
                                                fullWidth
                                                label="Phone Number"
                                                margin="dense"
                                                name="phone"
                                                type="number"
                                                variant="outlined"
                                                disabled={true}
                                                value={phoneNumber}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <CustomizedTextField
                                                fullWidth
                                                label="User Name"
                                                margin="dense"
                                                name="userHandle"
                                                disabled={true}
                                                variant="outlined"
                                                value={username}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <CustomizedTextField
                                                fullWidth
                                                label="Country"
                                                margin="dense"
                                                name="country"
                                                variant="outlined"
                                                value={country}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                {/*<Divider/>*/}
                                <CardActions/>
                            </form>
                        </CustomizedCard>
                        {/*<Button*/}
                        {/*    color="primary"*/}
                        {/*    variant="contained"*/}
                        {/*    type="submit"*/}
                        {/*    className="submit-button"*/}
                        {/*    onClick={updateFormValues}*/}
                        {/*    disabled={*/}
                        {/*        buttonLoading ||*/}
                        {/*        !firstName ||*/}
                        {/*        !lastName ||*/}
                        {/*        !country*/}
                        {/*    }*/}
                        {/*>*/}
                        <Grid container
                              spacing={0}
                              direction="column"
                              alignItems="center"
                              justifyContent="center"
                        >
                            <button
                                className="delete-account-button"
                                type="submit"
                                onClick={deleteUserHandler}
                            >
                                Delete Account
                            </button>
                            <button
                                className="save-details-button"
                                type="submit"
                                onClick={updateFormValues}
                                disabled={
                                    buttonLoading ||
                                    !firstName ||
                                    !lastName ||
                                    !country
                                }
                            >
                                Save Details
                            </button>
                        </Grid>
                    </Box>
                </Container>
                {/*    Save details*/}
                {/*    {buttonLoading && <CircularProgress size={30}/>}*/}
                {/*</Button>*/}
            </main>
        </ThemeProvider>
    );
};

export default AccountFun;