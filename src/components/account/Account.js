import {useEffect, useState} from "react";
import {authMiddleWare} from "../../util/auth";
import {CustomizedTextField} from "../login/Login";
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
import {theme} from "../../theme";

import {countries} from "../sign-up/countries";

export const CustomizedCard = styled(Card)(({theme}) => ({
    boxShadow: theme.shadow.boxShadowCard,
    borderRadius: theme.shape.lightRoundedBorderRadius,
}));

const Account = () => {
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
    const [error403, setError403] = useState(false);
    const [image, setImage] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [errors, setErrors] = useState([]);
    const [openSelectionPopup, setOpenSelectionPopup] = useState(false);

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
            .catch((err) => {
                if (err.response.status === 403) {
                    setError403(true);
                }
                // console.log(err);
                return err.response.status(500).json({error: err.code});
            });
    }

    useEffect(() => {
        setMounted(true);
        if (error403) {
            setTimeout(() => {
                navigate("/login")
            }, 0);
        }
    }, [error403, navigate]);

    const handleNamesChange = (event) => {
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
            .catch((err) => {
                // console.log(error);
                err.response.status(500).json({error: err.code});
                window.location.reload();
            });
    };

    const uploadProfileImageHandler = (event) => {
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
                    headers: headers
                },
            )
            .then(() => {
                window.location.reload()
            })
            .then(r => r.json()
                .then(data => ({status: r.status, body: data})))
            .catch((err) => {
                // console.log(err);
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
                        imageErrorMsg = 'File is too large/small or several files were selected';
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
                // console.log(err);
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
                // console.log(error);
                setErrors(error.response.data);
                setButtonLoading(false);
            });
    };

    const deleteAccountButtonClickHandler = () => {
        setOpenSelectionPopup(true);
    };

    const closeSelectionPopupHandler = () => {
        setOpenSelectionPopup(false);
    };

    return uiLoading ? (
        <main className="container">
            {uiLoading && <CircularProgress size={100} className="loader"/>}
        </main>
    ) : (
        <ThemeProvider theme={theme}>
            <Toolbar className="tool-bar"/>
            <Container maxWidth="md">
                <Box style={{padding: theme.spacing(3)}}>
                    <CustomizedCard variant="outlined">
                        <CardContent>
                            <div>
                                <div>
                                    <Typography className="name-surname" gutterBottom variant="h4">
                                        {firstName} {lastName}
                                    </Typography>
                                    <div className="input-file-style-container">
                                        <input type="file"
                                               title="file-upload"
                                               accept="image/*"
                                               onChange={handleImageChange}/>
                                    </div>
                                    {imageError ? (
                                        <div className="custom-error">
                                            {' '}
                                            {imageError}
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
                    </CustomizedCard>

                    <br/>
                    <CustomizedCard variant="outlined">
                        <form autoComplete="off">
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
                                            onChange={handleNamesChange}
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
                                            onChange={handleNamesChange}
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
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <CustomizedTextField
                                            fullWidth
                                            label="User Name"
                                            margin="dense"
                                            name="username"
                                            disabled={true}
                                            variant="outlined"
                                            value={username}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <Autocomplete
                                            id="country"
                                            name="country"
                                            options={countries}
                                            fullWidth
                                            label="Country"
                                            margin="dense"
                                            variant="outlined"
                                            value={country}
                                            renderInput={(params) => <CustomizedTextField {...params}
                                                                                          label="Country"/>}
                                            onChange={(event, value) => handleChangeCountry(event, value)}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <CardActions/>
                        </form>
                    </CustomizedCard>
                    <Grid container
                          spacing={0}
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
                className="selection-popup"
                open={openSelectionPopup}
                onClose={closeSelectionPopupHandler}
                closeAfterTransition
            >
                <Fade in={openSelectionPopup}>
                    <div className="selection-popup-paper">
                        <h3>Do you really want to delete account?</h3>
                        <div className="selection-buttons-container">
                            <button className="selection-buttons-container__yes-button" onClick={deleteUserHandler}>Yes</button>
                            <button className="selection-buttons-container__no-button" onClick={closeSelectionPopupHandler}>No</button>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </ThemeProvider>
    );
};

export default Account;
