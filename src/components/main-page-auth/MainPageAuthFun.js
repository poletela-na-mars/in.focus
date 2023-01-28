import {useEffect, useState} from "react";
import {authMiddleWare} from "../../util/auth";
import axios from "axios";
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
    AppBar,
    Avatar,
    Box,
    CircularProgress,
    Divider,
    Drawer,
    Fade,
    IconButton, InputBase,
    List,
    ListItem,
    ListItemIcon,
    Modal, styled,
    ThemeProvider,
    Toolbar
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";

import Notes from "../notes/Notes";
import AccountFun from "../account/AccountFun";

import "./MainPageAuth.scss";
import {theme} from "../login/LoginFun";
import LogoSVG from "../../LogoSVG";

const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    border: '1px solid #D9D9D9',
    // backgroundColor: alpha(theme.palette.common.white, 0.15),
    marginLeft: `calc(1em + ${theme.spacing(4)})`,
    backgroundColor: '#FFFFFF',
    // '&:focus, &:active': {
    //     border: '1px solid #8613E0',
    // },
    // marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#8613E0'
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: '#252525',
    '&::placeholder': {
        color: '#D9D9D9'
    },
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        borderRadius: theme.shape.borderRadius,
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus, &:active': {
                width: '20ch',
            },
        },
        '&:focus, &:active': {
            border: '1px solid #8613E0',
        },
    },
}));

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
    const [openDeterminePopup, setOpenDeterminePopup] = useState(false);
    const [isActiveIcon, setActiveIcon] = useState({'notes': true, 'account': false});
    const [searchReq, setSearchReq] = useState('');

    const navigate = useNavigate();

    const loadAccountPage = () => {
        setRender(true);
    };

    const loadNotePage = () => {
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
                if (response.data.userCredentials.imageUrl) {
                    setProfilePicture(response.data.userCredentials.imageUrl);
                }
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

    const logoutButtonClickHandler = () => {
        setOpenDeterminePopup(true);
    };

    const closeDeterminePopupHandler = () => {
        setOpenDeterminePopup(false);
    };

    const handleChangeSearchReq = (event) => {
        setSearchReq(event.target.value);
    };

    return (
        <ThemeProvider theme={theme}>
            {(uiLoading === true) ?
                (<div className="container">
                    {uiLoading && <CircularProgress size={100} className="loader"/>}
                </div>)
                : (
                    <>
                        {/*<Box className="container">*/}
                        {/*<CssBaseline/>*/}
                        {/*    <AppBar position="fixed" className="app-bar" open={openBar} elevation={0}*/}
                        <AppBar position="fixed" className="app-bar" open={openBar} elevation={0}
                                style={{background: '#fff'}}>
                            <Toolbar>
                                {/*<Typography variant="h6" noWrap>*/}
                                {/*    in.focus*/}
                                {/*</Typography>*/}
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    onClick={handleDrawerOpen}
                                    edge="start"
                                    sx={{marginRight: `calc(1em + ${theme.spacing(4)})`}}
                                >
                                    <MenuRoundedIcon fontSize="large" className="icon"/>
                                </IconButton>
                                <Link to={"/home"} className="logo-home"><LogoSVG width={122} height={35}
                                /></Link>
                                <Search>
                                    <SearchIconWrapper>
                                        <SearchRoundedIcon/>
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        className="search-input"
                                        name="searchReq"
                                        placeholder="Search…"
                                        inputProps={{'aria-label': 'search'}}
                                        onChange={handleChangeSearchReq}
                                        value={searchReq}
                                    />
                                </Search>
                            </Toolbar>
                        </AppBar>
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
                                    border: '1px solid #e5e5e5'
                                },
                            }}
                        >
                            {/*<div className={classes.toolbar} />*/}
                            <div className="drawer-header">
                                <IconButton onClick={handleDrawerClose}>
                                    {/*<img src={hide} alt="Arrow Left Icon"/>*/}
                                    <ArrowBackIosNewRoundedIcon fontSize="small" className="icon-gray"/>
                                </IconButton>
                            </div>
                            <center>
                                <Avatar src={profilePicture} className="avatar"/>
                                <p>
                                    {' '}
                                </p>
                            </center>
                            <Divider light/>
                            <List>
                                <ListItem button key="Notes" onClick={loadNotePage}>
                                    <ListItemIcon>
                                        {' '}
                                        <NotesRoundedIcon fontSize="large" className={iconClassName('notes')}
                                                          onClick={() => {
                                                              setActiveIcon(prevState => {
                                                                  return makeIconsActive(prevState, 'notes');
                                                              });
                                                              handleDrawerClose();
                                                          }}/>
                                    </ListItemIcon>
                                    {/*<ListItemText primary="Todo"/>*/}
                                </ListItem>

                                <ListItem button key="Account" onClick={loadAccountPage}>
                                    <ListItemIcon>
                                        {' '}
                                        <ManageAccountsRoundedIcon fontSize="large" className={iconClassName('account')}
                                                                   onClick={() => {
                                                                       setActiveIcon(prevState => {
                                                                           return makeIconsActive(prevState, 'account');
                                                                       });
                                                                       handleDrawerClose();
                                                                   }}/>
                                    </ListItemIcon>
                                    {/*<ListItemText primary="Account"/>*/}
                                </ListItem>

                                <ListItem button key="Logout" onClick={logoutButtonClickHandler}>
                                    <ListItemIcon>
                                        {' '}
                                        <LogoutRoundedIcon fontSize="large" className="icon"/>
                                    </ListItemIcon>
                                    {/*<ListItemText primary="Logout"/>*/}
                                </ListItem>

                                <Modal
                                    className="determine-popup"
                                    open={openDeterminePopup}
                                    onClose={closeDeterminePopupHandler}
                                    closeAfterTransition
                                >
                                    <Fade in={openDeterminePopup}>
                                        <div className="determine-popup-paper">
                                            <h3>Do you really want to log out?</h3>
                                            <div className="determine-buttons-container">
                                                <button className="yes-button" onClick={logoutHandler}>Yes</button>
                                                <button className="no-button" onClick={closeDeterminePopupHandler}>No
                                                </button>
                                            </div>
                                        </div>
                                    </Fade>
                                </Modal>

                            </List>
                        </Drawer>

                        <Box>{render ? <AccountFun/> : <Notes searchReq={searchReq}/>}</Box>
                        {/*</Box>*/}
                    </>
                )
            }
        </ThemeProvider>
    );
};

export default MainPageAuthFun;
