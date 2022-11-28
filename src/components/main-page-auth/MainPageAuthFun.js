import {useEffect, useState} from "react";
import {authMiddleWare} from "../../util/auth";
import axios from "axios";
import {
    AppBar,
    Avatar,
    CircularProgress,
    CssBaseline,
    Divider,
    Drawer,
    List,
    ListItem, ListItemIcon, ListItemText,
    Toolbar,
    Typography
} from "@mui/material";
import Account from "../account/Account";
import Notes from "../notes/Notes";
import {useNavigate} from "react-router-dom";
import AccountFun from "../account/AccountFun";

const MainPageAuthFun = (props) => {
    const [mounted, setMounted] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [uiLoading, setUiLoading] = useState(true);
    const [imageLoading, setImageLoading] = useState(false);
    const [render, setRender] = useState(false);
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [country, setCountry] = useState('');
    const [username, setUsername] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();

    const loadAccountPage = (event) => {
        // this.setState({render: true});
        setRender(true);
    };

    const loadTodoPage = (event) => {
        // this.setState({render: false});
        setRender(false);
    };

    const logoutHandler = (event) => {
        localStorage.removeItem('AuthToken');
        // this.props.history.push('/login');
        navigate("/login");
    };

    if (!mounted) {
        // Code for componentWillMount here
        // This code is called only one time before intial render
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
                setProfilePicture(response.data.userCredentials.imageUrl);
                // this.setState({
                //     firstName: response.data.userCredentials.firstName,
                //     lastName: response.data.userCredentials.lastName,
                //     email: response.data.userCredentials.email,
                //     phoneNumber: response.data.userCredentials.phoneNumber,
                //     country: response.data.userCredentials.country,
                //     username: response.data.userCredentials.username,
                //     uiLoading: false,
                //     profilePicture: response.data.userCredentials.imageUrl
                // });
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    // this.props.history.push('/login')
                    navigate("/login");
                }
                console.log(error);
                // this.setState({errorMsg: 'Error in retrieving the data'});
                setErrorMsg("Error in retrieving the data");
            });
    }

    useEffect(() => {
        setMounted(true)
    }, [])


    return (
        <>
            {(uiLoading === true) ?
                (<div className="root">
                    {uiLoading && <CircularProgress size={150} className="ui-progess"/>}
                </div>)
                : (
                    <div className="root">
                        <CssBaseline/>
                        <AppBar position="fixed" className="app-bar">
                            <Toolbar>
                                <Typography variant="h6" noWrap>
                                    TodoApp
                                </Typography>
                            </Toolbar>
                        </AppBar>
                        <Drawer
                            className="drawer"
                            variant="permanent"
                            // classes={{
                            //     paper: drawer-paper
                            // }}
                        >
                            {/*<div className={classes.toolbar} />*/}
                            <div/>
                            <Divider/>
                            <center>
                                <Avatar src={profilePicture} className="avatar"/>
                                <p>
                                    {' '}
                                    {firstName} {lastName}
                                </p>
                            </center>
                            <Divider/>
                            <List>
                                <ListItem button key="Todo" onClick={loadTodoPage}>
                                    <ListItemIcon>
                                        {' '}
                                        {/*<NotesIcon />{' '}*/}
                                    </ListItemIcon>
                                    <ListItemText primary="Todo"/>
                                </ListItem>

                                <ListItem button key="Account" onClick={loadAccountPage}>
                                    <ListItemIcon>
                                        {' '}
                                        {/*<AccountBoxIcon />{' '}*/}
                                    </ListItemIcon>
                                    <ListItemText primary="Account"/>
                                </ListItem>

                                <ListItem button key="Logout" onClick={logoutHandler}>
                                    <ListItemIcon>
                                        {' '}
                                        {/*<ExitToAppIcon />{' '}*/}
                                    </ListItemIcon>
                                    <ListItemText primary="Logout"/>
                                </ListItem>
                            </List>
                        </Drawer>

                        <div>{render ? <AccountFun/> : <Notes/>}</div>
                    </div>
                )
            }
        </>
    );
};

export default MainPageAuthFun;