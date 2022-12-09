import {useEffect, useState} from "react";
import {authMiddleWare} from "../../util/auth";
import axios from "axios";
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import {
    AppBar,
    Avatar,
    CircularProgress,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ThemeProvider,
    Toolbar
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";

import Notes from "../notes/Notes";
import AccountFun from "../account/AccountFun";

import "./MainPageAuth.scss";
import {theme} from "../login/LoginFun";
import LogoSVG from "../../LogoSVG";

// export const CustomizedAppBar = styled(AppBar)`
//   color: white;
// `;

// const CustomizedDrawer = styled(Drawer)`
// '& .MuiDrawer-paper': {
//   width: 15px;
//   box-sizing: border-box;
// },
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
    const [isActiveIcon, setActiveIcon] = useState({'notes': true, 'account': false});

    const navigate = useNavigate();

    const loadAccountPage = () => {
        setRender(true);
    };

    const loadTodoPage = () => {
        setRender(false);
    };

    const logoutHandler = () => {
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

    const iconClassName = (icon) => {
        return isActiveIcon[icon] === true ? 'icon-active' : 'icon';
    };

    const makeIconsActive = (prevState, icon) => {
        Object.keys(prevState).forEach(key => {
            prevState[key] = false;
        });
        prevState[icon] = true;
        return prevState;
    };

    return (
        <ThemeProvider theme={theme}>
            {(uiLoading === true) ?
                (<div className="container">
                    {uiLoading && <CircularProgress size={100} className="loader"/>}
                </div>)
                : (
                    <div className="container">
                        {/*<CssBaseline/>*/}
                        <AppBar position="fixed" className="app-bar" open={openBar} elevation={0} style={{background: '#fff'}}>
                            <Toolbar sx={{}}>
                                {/*<Typography variant="h6" noWrap>*/}
                                {/*    in.focus*/}
                                {/*</Typography>*/}
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    onClick={handleDrawerOpen}
                                    edge="start"
                                    // sx={{mr: 2, ...(openBar && {display: 'none'})}}
                                >
                                    <MenuRoundedIcon fontSize="large" className="icon" />
                                </IconButton>
                                <Link to={"/home"} className="logo-home"><LogoSVG width={122} height={35}
                                /></Link>
                            </Toolbar>
                        </AppBar>
                        {/*TODO: добавить поиск*/}
                        <Drawer
                            className="drawer"
                            variant="persistent"
                            transitionDuration={500}
                            anchor="left"
                            open={openBar}
                            // classes={{
                            //     paper: drawer-paper
                            // }}
                            sx={{
                                    width: 60,
                                    flexShrink: 0,
                                    '& .MuiDrawer-paper': {
                                        width: 60,
                                        boxSizing: 'border-box',
                                        overflowX: 'hidden',
                                    },
                                }}
                        >
                            {/*<div className={classes.toolbar} />*/}
                            {/*<Divider/>*/}
                            <div className="drawer-header">
                                <IconButton onClick={handleDrawerClose}>
                                    {/*<img src={hide} alt="Arrow Left Icon"/>*/}
                                    <ArrowBackIosNewRoundedIcon fontSize="small" className="icon-gray" />
                                </IconButton>
                            </div>
                            <center>
                                <Avatar src={profilePicture} className="avatar"/>
                                <p>
                                    {' '}
                                    {/*{firstName} {lastName}*/}
                                </p>
                            </center>
                            <Divider/>
                            <List>
                                <ListItem button key="Notes" onClick={loadTodoPage}>
                                    <ListItemIcon>
                                        {' '}
                                        <NotesRoundedIcon fontSize="large" className={iconClassName('notes')} onClick={() => {
                                            setActiveIcon(prevState => {
                                                return makeIconsActive(prevState, 'notes');
                                            });
                                            handleDrawerClose();
                                        }} />
                                    </ListItemIcon>
                                    {/*<ListItemText primary="Todo"/>*/}
                                </ListItem>

                                <ListItem button key="Account" onClick={loadAccountPage}>
                                    <ListItemIcon>
                                        {' '}
                                        <ManageAccountsRoundedIcon fontSize="large" className={iconClassName('account')} onClick={() => {
                                            setActiveIcon(prevState => {
                                                return makeIconsActive(prevState, 'account');
                                            });
                                            handleDrawerClose();
                                        }} />
                                    </ListItemIcon>
                                    {/*<ListItemText primary="Account"/>*/}
                                </ListItem>

                                <ListItem button key="Logout" onClick={logoutHandler}>
                                    <ListItemIcon>
                                        {' '}
                                        <LogoutRoundedIcon fontSize="large" className="icon" />
                                    </ListItemIcon>
                                    {/*<ListItemText primary="Logout"/>*/}
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