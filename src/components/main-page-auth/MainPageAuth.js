import {Component} from "react";
import axios from "axios";

import {authMiddleWare} from "../../util/auth";
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

import "./MainPageAuth.scss";
import {useNavigate} from "react-router-dom";
// const styles = (theme) => ({
//     root: {
//         display: 'flex'
//     },
//     appBar: {
//         zIndex: theme.zIndex.drawer + 1
//     },
//     drawer: {
//         width: drawerWidth,
//         flexShrink: 0
//     },
//     drawerPaper: {
//         width: drawerWidth
//     },
//     content: {
//         flexGrow: 1,
//         padding: theme.spacing(3)
//     },
//     avatar: {
//         height: 110,
//         width: 100,
//         flexShrink: 0,
//         flexGrow: 0,
//         marginTop: 20
//     },
//     uiProgess: {
//         position: 'fixed',
//         zIndex: '1000',
//         height: '31px',
//         width: '31px',
//         left: '50%',
//         top: '35%'
//     },
//     toolbar: theme.mixins.toolbar
// });

class MainPageAuth extends Component {
    state = {
        render: false
    };

    loadAccountPage = (event) => {
        this.setState({ render: true });
    };

    loadTodoPage = (event) => {
        this.setState({ render: false });
    };

    logoutHandler = (event) => {
        localStorage.removeItem('AuthToken');
        this.props.history.push('/login');
    };

    navigateToLogin = () => {
        const navigate = useNavigate();
        navigate("/login");
    };

    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            profilePicture: '',
            uiLoading: true,
            imageLoading: false
        };
    }

    componentWillMount = () => {
        authMiddleWare(this.props.history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        axios
            .get('/user')
            .then((response) => {
                console.log(response.data);
                this.setState({
                    firstName: response.data.userCredentials.firstName,
                    lastName: response.data.userCredentials.lastName,
                    email: response.data.userCredentials.email,
                    phoneNumber: response.data.userCredentials.phoneNumber,
                    country: response.data.userCredentials.country,
                    username: response.data.userCredentials.username,
                    uiLoading: false,
                    profilePicture: response.data.userCredentials.imageUrl
                });
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    // this.props.history.push('/login')
                    this.navigateToLogin();
                }
                console.log(error);
                this.setState({ errorMsg: 'Error in retrieving the data' });
            });
    };

    render() {
        const { classes } = this.props;
        if (this.state.uiLoading === true) {
            return (
                <div className="root">
                    {this.state.uiLoading && <CircularProgress size={150} className="ui-progess" />}
                </div>
            );
        } else {
            return (
                <div className="root">
                    <CssBaseline />
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
                        <div  />
                        <Divider />
                        <center>
                            <Avatar src={this.state.profilePicture} className="avatar" />
                            <p>
                                {' '}
                                {this.state.firstName} {this.state.lastName}
                            </p>
                        </center>
                        <Divider />
                        <List>
                            <ListItem button key="Todo" onClick={this.loadTodoPage}>
                                <ListItemIcon>
                                    {' '}
                                    {/*<NotesIcon />{' '}*/}
                                </ListItemIcon>
                                <ListItemText primary="Todo" />
                            </ListItem>

                            <ListItem button key="Account" onClick={this.loadAccountPage}>
                                <ListItemIcon>
                                    {' '}
                                    {/*<AccountBoxIcon />{' '}*/}
                                </ListItemIcon>
                                <ListItemText primary="Account" />
                            </ListItem>

                            <ListItem button key="Logout" onClick={this.logoutHandler}>
                                <ListItemIcon>
                                    {' '}
                                    {/*<ExitToAppIcon />{' '}*/}
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItem>
                        </List>
                    </Drawer>

                    <div>{this.state.render ? <Account /> : <Notes />}</div>
                </div>
            );
        }
    }
}

export default MainPageAuth;