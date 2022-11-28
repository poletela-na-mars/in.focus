import {useEffect, useState} from "react";
import {authMiddleWare} from "../../util/auth";
import axios from "axios";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    TextField,
    Typography
} from "@mui/material";
import clsx from "clsx";
import {useNavigate} from "react-router-dom";

import "./Account.scss";

function CloudUploadIcon() {
    return null;
}

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

    if (!mounted) {
        authMiddleWare(navigate);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = {Authorization: `${authToken}`};
        axios
            .get('/user')
            .then((response) => {
                console.log(response.data);
                setFirstName(response.data.userCredentials.firstName);
                setLastName(response.data.userCredentials.lastName);
                setEmail(response.data.userCredentials.email);
                setPhoneNumber(response.data.userCredentials.phoneNumber);
                setCountry(response.data.userCredentials.country);
                setUsername(response.data.userCredentials.username);
                setUiLoading(false);
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    // this.props.history.push('/login');
                    navigate("/login");
                }
                console.log(error);
                // this.setState({errorMsg: 'Error in retrieving the data'});
                setErrorMsg('Error in retrieving the data');
            });
    }

    useEffect(() => {
        setMounted(true)
    }, [])

    //TODO - какие точно нужны проверить
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

    const profilePictureHandler = (event) => {
        event.preventDefault();
        // this.setState({
        //     uiLoading: true
        // });
        setUiLoading(true);
        authMiddleWare(navigate);
        const authToken = localStorage.getItem('AuthToken');
        let form_data = new FormData();
        form_data.append('image', this.state.image);
        form_data.append('content', this.state.content);
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
                    // this.props.history.push('/login');
                    navigate("/login");
                }
                console.log(error);
                // this.setState({
                //     uiLoading: false,
                //     imageError: 'Error in posting the data'
                // });
                setUiLoading(false);
                setImageError('Error in posting the data');
            });
    };

    const updateFormValues = (event) => {
        event.preventDefault();
        // this.setState({buttonLoading: true});
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
                // this.setState({buttonLoading: false});
                setButtonLoading(false);
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    // this.props.history.push('/login');
                    navigate("/login");
                }
                console.log(error);
                // this.setState({
                //     buttonLoading: false
                // });
                setButtonLoading(false);
            });
    };

    // const {classes, ...rest} = this.props;
    return uiLoading === true ? (
        <main className="content">
            <div className="toolbar"/>
            {uiLoading && <CircularProgress size={150} className="ui-progress"/>}
        </main>
    ) : (
        <main className="content">
            <div className="toolbar"/>
            {/*<Card {...rest} className={clsx(classes.root, classes)}>*/}
            <Card>
                <CardContent>
                    <div className="details">
                        <div>
                            <Typography className="location-text" gutterBottom variant="h4">
                                {firstName} {lastName}
                            </Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                type="submit"
                                size="small"
                                startIcon={<CloudUploadIcon/>}
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
                <Divider/>
            </Card>

            <br/>
            {/*<Card {...rest} className={clsx(classes.root, classes)}>*/}
            <Card>
                <form autoComplete="off" noValidate>
                    <Divider/>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item md={6} xs={12}>
                                <TextField
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
                                <TextField
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
                                <TextField
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
                                <TextField
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
                                <TextField
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
                                <TextField
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
                    <Divider/>
                    <CardActions/>
                </form>
            </Card>
            <Button
                color="primary"
                variant="contained"
                type="submit"
                className="submit-button"
                onClick={updateFormValues}
                disabled={
                    buttonLoading ||
                    !firstName ||
                    !lastName ||
                    !country
                }
            >
                Save details
                {buttonLoading && <CircularProgress size={30} className="progress"/>}
            </Button>
        </main>
    );
};

export default AccountFun;