import {useEffect, useState} from "react";
import {authMiddleWare} from "../../util/auth";
import {CustomizedTextField, theme} from "../login/LoginFun";
import axios from "axios";
import {
    Autocomplete,
    Box,
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
    const [uiLoading, setUiLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [imageError, setImageError] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [error403, setError403] = useState(false);
    const [image, setImage] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [errors, setErrors] = useState([]);
    const [openDeterminePopup, setOpenDeterminePopup] = useState(false);

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
                if (response.data.userCredentials.imageUrl) {
                    setProfilePicture(response.data.userCredentials.imageUrl);
                }
                setUiLoading(false);
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
        }
    }, [error403, navigate])

    const handleChange = (event) => {
        switch (event.target.name) {
            case "firstName":
                setFirstName(event.target.value);
                break;
            case "lastName":
                setLastName(event.target.value);
                break;
            default:
                break;
        }
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const deleteUserHandler = (event) => {
        authMiddleWare(navigate);
        const authToken = localStorage.getItem("AuthToken");
        axios.defaults.headers.common = {Authorization: `${authToken}`};
        event.preventDefault();
        setUiLoading(true);
        axios
            .delete(`/users/${username}`)
            .then(() => {
                localStorage.removeItem('AuthToken');
                setUiLoading(false);
                navigate('/login');
            })
            .catch((error) => {
                console.log(error);
                window.location.reload();
                // setErrors(error.response.data);
                // setLoading(false);
            });
    };

    const uploadProfileImageHandler = (event) => {
        // const headers = Object.keys({header: 'multipart/form-data'}).reduce((newHeaders, key) => {
        //     newHeaders[key.toLowerCase()] = {header: 'multipart/form-data'}[key];
        //     return newHeaders;
        // }, {});
        event.preventDefault();
        const headers = {
            'content-type': 'multipart/form-data'
        };
        setUiLoading(true);
        authMiddleWare(navigate);
        const authToken = localStorage.getItem('AuthToken');
        let form_data = new FormData();
        form_data.append('image', image);
        form_data.append('prevImage', profilePicture);
        axios.defaults.headers.common = {Authorization: `${authToken}`};
        axios
            .post('/user/image', form_data, {
                    //     headers: {
                    //         'content-type': 'multipart/form-data'
                    //     },
                    headers: headers
                },
                // headers: {
                //     'content-type': headers['Content-Type'],
                // },
                // transformRequest: (data, request) => {
                //     return data;
                // },
            )
            .then(() => {
                window.location.reload()
            })
            .then(r => r.json()
                .then(data => ({status: r.status, body: data})))
            .catch((err) => {
                console.log(err);
                setUiLoading(false);
                let imageErrorMsg;

                switch (err.response.status) {
                    case 403:
                        navigate("/login");
                        break;
                    case 400:
                        imageErrorMsg = 'Invalid image name or extension of file. Supported Formats are PNG and JPG';
                        break;
                    case 455:
                        imageErrorMsg = 'File is too large or several files were selected';
                        break;
                    default:
                        imageErrorMsg = 'Something went wrong while uploading image';
                }

                setImageError(imageErrorMsg);
            });
    };

    const deleteProfileImageHandler = (event) => {
        event.preventDefault();
        authMiddleWare(navigate);
        const authToken = localStorage.getItem("AuthToken");
        axios
            .delete('user/image', {
                headers: {
                    Authorization: `${authToken}`,
                },
                data: {profilePicture: profilePicture},
            })
            .then(() => {
                window.location.reload();
            })
            .catch((err) => {
                if (err.response.status === 403) {
                    navigate("/login");
                }
                console.log(err);
                setUiLoading(false);
                setImageError('Error in deleting image');
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
            <Toolbar className="tool-bar"/>
            <Container maxWidth="md">
                <Box className="box" style={{padding: theme.spacing(3)}}>
                    <CustomizedCard variant="outlined">
                        <CardContent>
                            <div className="details">
                                <div>
                                    <Typography className="name-surname" gutterBottom variant="h4">
                                        {firstName} {lastName}
                                    </Typography>
                                    <div className="input-file-style-container">
                                        <input type="file"
                                               accept="image/*"
                                               className="input-file-button"
                                               onChange={handleImageChange}/>
                                    </div>
                                    {imageError ? (
                                        <div className="custom-error">
                                            {' '}
                                            {imageError}
                                            {/*Wrong Image Format || Supported Formats are PNG and JPG*/}
                                        </div>
                                    ) : false}
                                    <div className="upload-and-delete-image-container">
                                        <button
                                            type="submit"
                                            className="upload-image-button"
                                            onClick={uploadProfileImageHandler}
                                            disabled={
                                                buttonLoading ||
                                                !image
                                            }
                                        >
                                            Upload Photo
                                        </button>
                                        <button
                                            type="submit"
                                            className="delete-image-button"
                                            onClick={deleteProfileImageHandler}
                                            disabled={
                                                buttonLoading ||
                                                !profilePicture
                                            }
                                        >
                                            Delete Photo
                                        </button>
                                    </div>
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
