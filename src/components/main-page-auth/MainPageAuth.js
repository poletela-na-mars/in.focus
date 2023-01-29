import {useEffect, useState} from "react";
import {authMiddleWare} from "../../util/auth";
import axios from "axios";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import NotesRoundedIcon from "@mui/icons-material/NotesRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
    AppBar,
    Avatar,
    Box,
    CircularProgress,
    Divider,
    Drawer,
    Fade,
    IconButton,
    InputBase,
    List,
    ListItemButton,
    ListItemIcon,
    Modal,
    styled,
    ThemeProvider,
    Toolbar
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";

import Notes from "../notes/Notes";
import Account from "../account/Account";

import "./MainPageAuth.scss";
import {theme} from "../../theme";
import LogoSVG from "../../LogoSVG";

const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.lightRoundedBorderRadius,
    border: `1px solid ${theme.palette.light.main}`,
    marginLeft: `calc(1em + ${theme.spacing(4)})`,
    backgroundColor: theme.palette.light.light,
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
    color: theme.palette.primary.main,
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: theme.palette.light.dark,
    '&::placeholder': {
        color: theme.palette.light.main,
    },
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        borderRadius: theme.shape.lightRoundedBorderRadius,
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus, &:active': {
                width: '20ch',
            },
        },
        '&:focus, &:active': {
            border: `1px solid ${theme.palette.primary.main}`,
        },
    },
}));

const MainPageAuth = () => {
    const [mounted, setMounted] = useState(false);
    const [profilePicture, setProfilePicture] = useState('');
    const [uiLoading, setUiLoading] = useState(true);
    const [render, setRender] = useState(false);
    const [error403, setError403] = useState(false);
    const [openBar, setOpenBar] = useState(false);
    const [openSelectionPopup, setOpenSelectionPopup] = useState(false);
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
                setUiLoading(false);
                if (response.data.userCredentials.imageUrl) {
                    setProfilePicture(response.data.userCredentials.imageUrl);
                }
            })
            .catch((err) => {
                if (err.response.status === 403) {
                    setError403(true);
                }
                // console.log(error);
                return err.response.status(500).json({error: err.code});
            });
    }

    useEffect(() => {
        setMounted(true);
        if (error403) {
            setTimeout(() => {
                navigate("/login")
            }, 0)
        }
    }, [error403, navigate]);

    const handleDrawerOpen = () => {
        setOpenBar(true);
    };

    const handleDrawerClose = () => {
        setOpenBar(false);
    };

    const iconClassName = (icon) => {
        return isActiveIcon[icon] ? 'icon_active' : 'icon';
    };

    const makeIconsActive = (prevState, icon) => {
        Object.keys(prevState).forEach(key => {
            prevState[key] = false;
        });
        prevState[icon] = true;
        return prevState;
    };

    const logoutButtonClickHandler = () => {
        setOpenSelectionPopup(true);
    };

    const closeSelectionPopupHandler = () => {
        setOpenSelectionPopup(false);
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
                        <AppBar position="fixed" className="app-bar" open={openBar} elevation={0}
                                style={{background: theme.palette.light.light}}>
                            <Toolbar>
                                <IconButton
                                    color="inherit"
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
                            sx={{
                                width: 60,
                                flexShrink: 0,
                                '& .MuiDrawer-paper': {
                                    width: 60,
                                    boxSizing: 'border-box',
                                    overflowX: 'hidden',
                                    border: `1px solid ${theme.palette.light.main}`
                                },
                            }}
                        >
                            <div className="drawer__header">
                                <IconButton onClick={handleDrawerClose}>
                                    <ArrowBackIosNewRoundedIcon fontSize="small" className="icon_gray"/>
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
                                <ListItemButton key="notes" onClick={loadNotePage}>
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
                                </ListItemButton>

                                <ListItemButton key="account" onClick={loadAccountPage}>
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
                                </ListItemButton>

                                <ListItemButton key="logout" onClick={logoutButtonClickHandler}>
                                    <ListItemIcon>
                                        {' '}
                                        <LogoutRoundedIcon fontSize="large" className="icon"/>
                                    </ListItemIcon>
                                </ListItemButton>

                                <Modal
                                    className="selection-popup"
                                    open={openSelectionPopup}
                                    onClose={closeSelectionPopupHandler}
                                    closeAfterTransition
                                >
                                    <Fade in={openSelectionPopup}>
                                        <div className="selection-popup-paper">
                                            <h3>Do you really want to log out?</h3>
                                            <div className="selection-buttons-container">
                                                <button className="selection-buttons-container__yes-button"
                                                        onClick={logoutHandler}>Yes
                                                </button>
                                                <button className="selection-buttons-container__no-button"
                                                        onClick={closeSelectionPopupHandler}>No
                                                </button>
                                            </div>
                                        </div>
                                    </Fade>
                                </Modal>

                            </List>
                        </Drawer>

                        <Box>{render ? <Account/> : <Notes searchReq={searchReq}/>}</Box>
                    </>
                )
            }
        </ThemeProvider>
    );
};

export default MainPageAuth;
