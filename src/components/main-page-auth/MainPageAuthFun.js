import {useEffect, useState} from "react";
import {authMiddleWare} from "../../util/auth";
import axios from "axios";
import {
    AppBar,
    Avatar,
    CircularProgress,
    CssBaseline,
    Divider,
    Drawer, IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText, styled, TextField, ThemeProvider,
    Toolbar,
    Typography
} from "@mui/material";
// import MenuIcon from '@mui/icons-material/Menu';
import {Link, useNavigate} from "react-router-dom";

import Notes from "../notes/Notes";
import AccountFun from "../account/AccountFun";

import "./MainPageAuth.scss";
import {theme} from "../login/LoginFun";
import menu from "./../../img/menu_icon.png";
import LogoSVG from "../../LogoSVG";

// export const CustomizedAppBar = styled(AppBar)`
//   color: white;
// `;

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
    const [error403, setError403] = useState(false);
    const [openBar, setOpenBar] = useState(false);

    const navigate = useNavigate();

    const loadAccountPage = (evt) => {
        setRender(true);
    };

    const loadTodoPage = (evt) => {
        setRender(false);
    };

    const logoutHandler = (evt) => {
        localStorage.removeItem('AuthToken');
        navigate("/login");
    };

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
                setProfilePicture(response.data.userCredentials.imageUrl);
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    setError403(true);
                }
                console.log(error);
                setErrorMsg("Error in retrieving the data");
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

    const handleDrawerOpen = () => {
        setOpenBar(true);
    };

    const handleDrawerClose = () => {
        setOpenBar(false);
    };

    return (
        <ThemeProvider theme={theme}>
            {(uiLoading === true) ?
                (<div className="container">
                    {uiLoading && <CircularProgress size={100} className="loader"/>}
                </div>)
                : (
                    <div className="container">
                        <CssBaseline/>
                        <AppBar position="fixed" className="app-bar" open={openBar} style={{background: '#fff'}}>
                            <Toolbar>
                                {/*<Typography variant="h6" noWrap>*/}
                                {/*    in.focus*/}
                                {/*</Typography>*/}
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    onClick={handleDrawerOpen}
                                    edge="start"
                                    // sx={{ mr: 2, ...(open && { display: 'none' }) }}
                                >
                                    <img src={menu} alt="Menu Icon"/>
                                </IconButton>
                                <Link to={"/home"} className="logo-home"><LogoSVG width={122} height={35}
                                /></Link>
                            </Toolbar>
                        </AppBar>
                        {/*TODO: добавить поиск*/}
                        <Drawer
                            className="drawer"
                            variant="persistent"
                            transitionDuration={2}
                            anchor="left"
                            open={openBar}
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
        </ThemeProvider>
    );
};

export default MainPageAuthFun;