import {useEffect, useState} from "react";
import {authMiddleWare} from "../../util/auth";
import {CustomizedTextField, theme} from "../login/LoginFun";
import axios from "axios";
import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Container,
    Fade,
    Grid,
    Modal,
    styled,
    ThemeProvider,
    Toolbar,
    Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";

import "./Account.scss";
import {countries} from "../sign-up/countries";

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
    // const [profilePicture, setProfilePicture] = useState('');
    const [uiLoading, setUiLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [imageError, setImageError] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [error403, setError403] = useState(false);
    const [image, setImage] = useState('');
    const [content, setContent] = useState('');
    const [errors, setErrors] = useState([]);
    const [openDeterminePopup, setOpenDeterminePopup] = useState(false);
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
            // case "username":
            //     setUsername(event.target.value);
            //     break;
            // case "email":
            //     setEmail(event.target.value);
            //     break;
            // case "phone":
            //     setPhoneNumber(event.target.value);
            //     break;
            default:
                break;
        }
    };

    const handleImageChange = (event) => {
        // this.setState({
        //     image: event.target.files[0]
        // });
        setImage(event.target.files[0]);
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

    // const upload = () => {
    //     if (image == null)
    //         return;
    //     storage.ref(`/images/${image.name}`).put(image)
    //         .on("state_changed" , alert("success") , alert);
    // };

    const profilePictureHandler = (event) => {
        const headers = Object.keys({header: 'multipart/form-data'}).reduce((newHeaders, key) => {
            newHeaders[key.toLowerCase()] = {header: 'multipart/form-data'}[key];
            return newHeaders;
        }, {});
        event.preventDefault();
        // const headers = {
        //     'content-type': 'multipart/form-data'
        // };
        setUiLoading(true);
        authMiddleWare(navigate);
        const authToken = localStorage.getItem('AuthToken');
        let form_data = new FormData();
        form_data.append('image', image);
        //form_data.append('content', content);
        axios.defaults.headers.common = {Authorization: `${authToken}`};
        // axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
        axios
            .post('/user/image', form_data, {
            //     headers: {
            //         'content-type': 'multipart/form-data'
            //     },
                //     headers: headers
                // },
                headers: {
                    'content-type': headers['Content-Type'],
                },
                transformRequest: (data, request) => { // This is all that matters
                    return data;
                },
            })
            // .then((res) => {
            //     res.json();
            // })
            // .then(json => {
            //     console.log(json)
            // })
            .then(r =>  r.json().then(data => ({status: r.status, body: data})))
            .then(obj => console.log(obj))
            // .post('/user/image', form_data, {
            //     headers: {
            //         'content-type': 'multipart/form-data'
            //     },
            // })
            .then(() => {
                window.location.reload()
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

    const handleChangeCountry = (event, newValue) => {
        setCountry(newValue);
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
            .put('/user', formRequest)
            .then(() => {
                setButtonLoading(false);
                setErrors([]);
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    navigate('/login');
                }
                console.log(error);
                setErrors(error.response.data);
                setButtonLoading(false);
            });
    };

    const deleteAccountButtonClickHandler = () => {
        setOpenDeterminePopup(true);
    };

    const closeDeleteAccountButtonPopupHandler = () => {
        setOpenDeterminePopup(false);
    };

    return uiLoading === true ? (
        <main className="container">
            {/*<div className="toolbar"/>*/}
            {uiLoading && <CircularProgress size={100} className="loader"/>}
        </main>
    ) : (
        <ThemeProvider theme={theme}>
            {/*<main className="content container">*/}
            <Toolbar className="tool-bar" />
            <Container maxWidth="md">
                    <Box className="box" style={{padding: theme.spacing(3)}}>
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
                                                Wrong Image Format || Supported Formats are PNG and JPG
                                            </div>
                                        ) : false}
                                    </div>
                                </div>
                                <div className="progress"/>
                            </CardContent>
                            {/*<Divider/>*/}
                        </CustomizedCard>

                        <br/>
                        <CustomizedCard variant="outlined">
                            <form autoComplete="off">
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
                                                helperText={errors.firstName}
                                                error={!!errors.firstName}
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
                                                helperText={errors.lastName}
                                                error={!!errors.lastName}
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
                                        {/*<Grid item md={6} xs={12}>*/}
                                        {/*    <CustomizedTextField*/}
                                        {/*        fullWidth*/}
                                        {/*        label="Country"*/}
                                        {/*        margin="dense"*/}
                                        {/*        name="country"*/}
                                        {/*        variant="outlined"*/}
                                        {/*        value={country}*/}
                                        {/*        onChange={handleChange}*/}
                                        {/*    />*/}
                                        {/*</Grid>*/}
                                        <Grid item md={6} xs={12}>
                                            <Autocomplete
                                                // disablePortal
                                                id="country"
                                                name="country"
                                                options={countries}
                                                fullWidth
                                                label="Country"
                                                margin="dense"
                                                variant="outlined"
                                                value={country}
                                                renderInput={(params) => <CustomizedTextField {...params}
                                                                                              // fullWidth
                                                                                              label="Country"/>}
                                                onChange={(event, value) => handleChangeCountry(event, value)}
                                                // helperText={errors.country}
                                                // error={!!errors.country}
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
                              // direction="column"
                              alignItems="center"
                              justifyContent="center"
                        >
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
                            <button
                                className="delete-account-button"
                                type="submit"
                                onClick={deleteAccountButtonClickHandler}
                            >
                                Delete Account
                            </button>
                        </Grid>
                    </Box>
                </Container>

                <Modal
                    className="determine-popup"
                    open={openDeterminePopup}
                    onClose={closeDeleteAccountButtonPopupHandler}
                    closeAfterTransition
                >
                    <Fade in={openDeterminePopup}>
                        <div className="determine-popup-paper">
                            <h3>Do you really want to delete account?</h3>
                            <div className="determine-buttons-container">
                                <button className="yes-button" onClick={deleteUserHandler}>Yes</button>
                                <button className="no-button" onClick={closeDeleteAccountButtonPopupHandler}>No</button>
                            </div>
                        </div>
                    </Fade>
                </Modal>

            {/*</main>*/}
        </ThemeProvider>
    );
};

export default AccountFun;