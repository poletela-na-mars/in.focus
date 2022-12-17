import {forwardRef, useEffect, useState} from "react";
import {
    AppBar,
    Button,
    Card,
    CardActions,
    CardContent, CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton, Slide,
    TextField, ThemeProvider,
    Toolbar,
    Typography
} from "@mui/material";
import {authMiddleWare} from "../../util/auth";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import "./Notes.scss";

import {AddCircleRounded} from "@mui/icons-material";
import {CloseRounded} from "@mui/icons-material";
import {theme} from "../login/LoginFun";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Notes = (props) => {
    const navigate = useNavigate();

    const [mounted, setMounted] = useState(false);
    const [notes, setNotes] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [noteId, setNoteId] = useState('');
    const [errors, setErrors] = useState([]);
    const [open, setOpen] = useState(false);
    const [uiLoading, setUiLoading] = useState(true);
    const [buttonType, setButtonType] = useState('');
    const [viewOpen, setViewOpen] = useState(false);
    const [error403, setError403] = useState(false);

    if (!mounted) {
        authMiddleWare(navigate);
        const authToken = localStorage.getItem("AuthToken");
        axios.defaults.headers.common = {Authorization: `${authToken}`};
        axios
            .get("/notes")
            .then((response) => {
                setNotes(response.data);
                setUiLoading(false);
            })
            .catch((err) => {
                console.log(err);
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
        const value = event.target.value;
        switch (event.target.name) {
            case "title":
                setTitle(value);
                break;
            case "body":
                setBody(value);
                break;
            default:
                break;
        }
    };

    const deleteNoteHandler = (data) => {
        authMiddleWare(navigate);
        const authToken = localStorage.getItem("AuthToken");
        axios.defaults.headers.common = {Authorization: `${authToken}`};
        let noteId = data.note.noteId;
        axios
            .delete(`note/${noteId}`)
            .then(() => {
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleEditClickOpen = (data) => {
        setTitle(data.note.title);
        setBody(data.note.body);
        setNoteId(data.note.noteId);
        setButtonType("Edit");
        setOpen(true);
    };

    const handleViewOpen = (data) => {
        setTitle(data.note.title);
        setBody(data.note.body);
        setViewOpen(true);
    };

    // const DialogTitle = withStyles(styles)((props) => {const { children, classes, onClose, ...other } = props;
    const DialogTitle = ({onClose, children}) => {
        return (
            <DialogTitle disableTypography className="root">
                <Typography variant="h6">{children}</Typography>
                {onClose ? (
                    <IconButton aria-label="close" className="closeButton" onClick={onClose}>
                        <CloseRounded/>
                    </IconButton>
                ) : null}
            </DialogTitle>
        );
    };

    // const DialogContent = withStyles((theme) => ({
    //   viewRoot: {
    //     padding: theme.spacing(2)
    //   }
    // }))(MuiDialogContent);

    dayjs.extend(relativeTime);
    // const { classes } = this.props;
    // const { open, errors, viewOpen } = this.state;

    const handleClickOpen = () => {
        setNoteId('');
        setTitle('');
        setBody('');
        setButtonType('');
        setOpen(true);
    };

    const handleSubmit = (event) => {
        authMiddleWare(navigate);
        event.preventDefault();
        const userNote = {
            title: title,
            body: body,
        };
        let options = {};
        if (buttonType === "Edit") {
            options = {
                url: `/note/${noteId}`,
                method: "put",
                data: userNote
            };
        } else {
            options = {
                url: "/note",
                method: "post",
                data: userNote
            };
        }
        const authToken = localStorage.getItem("AuthToken");
        axios.defaults.headers.common = {Authorization: `${authToken}`};
        axios(options)
            .then(() => {
                // this.setState({ open: false });
                setOpen(false);
                window.location.reload();
            })
            .catch((error) => {
                // this.setState({ open: true, errors: error.response.data });
                setOpen(true);
                setErrors([...errors, error.response.data]);
                console.log(error);
            });
    };

    const handleViewClose = () => {
        setViewOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // if (uiLoading === true) {
    //     return (
    //         <main className="content"}>
    //             <div className="toolbar" />
    //             {uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
    //
    //         </main>
    //     );
    return (
        <ThemeProvider theme={theme}>
            {(uiLoading === true) ?
                (<div className="container">
                    {uiLoading && <CircularProgress size={100} className="loader"/>}
                </div>) : (
                    <main className="content">
                        {/*<div className="toolbar"/>*/}
                        <div className="toolbar"/>
                        <IconButton
                            className="floatingButton"
                            color="primary"
                            aria-label="Add Note"
                            onClick={handleClickOpen}
                        >
                            <AddCircleRounded fontSize="large" className="icon"/>
                        </IconButton>
                        {/*<Dialog fullScreen open={open} onClose={handleClose}>*/}
                        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                            <AppBar className="appBar">
                                <Toolbar>
                                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                                        <CloseRounded/>
                                    </IconButton>
                                    <Typography variant="h6" className="title">
                                        {buttonType === "Edit" ? "Edit Note" : "Create a new Note"}
                                    </Typography>
                                    <Button
                                        autoFocus
                                        color="inherit"
                                        onClick={handleSubmit}
                                        className="submitButton"
                                    >
                                        {buttonType === "Edit" ? "Save" : "Submit"}
                                    </Button>
                                </Toolbar>
                            </AppBar>

                            <form className="form" noValidate>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="noteTitle"
                                            label="Note Title"
                                            name="title"
                                            autoComplete="noteTitle"
                                            helperText={errors.title}
                                            value={title}
                                            error={!!errors.title}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="noteDetails"
                                            label="Note Details"
                                            name="body"
                                            autoComplete="noteDetails"
                                            multiline
                                            rows={25}
                                            rowsMax={25}
                                            helperText={errors.body}
                                            error={!!errors.body}
                                            onChange={handleChange}
                                            value={body}
                                        />
                                    </Grid>
                                </Grid>
                            </form>
                        </Dialog>

                        <Grid container spacing={2}>
                            {notes.map((note) => (
                                <Grid item xs={12} sm={6} key={noteId}>
                                    <Card className="root" variant="outlined">
                                        <CardContent>
                                            <Typography variant="h5" component="h2">
                                                {note.title}
                                            </Typography>
                                            <Typography className="pos" color="textSecondary">
                                                {`created ${dayjs(note.createdAt).fromNow()}`}
                                            </Typography>
                                            <Typography variant="body2" component="p">
                                                {`${note.body.substring(0, 65)}`}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" color="primary" onClick={() => handleViewOpen({note})}>
                                                {' '}
                                                View{' '}
                                            </Button>
                                            <Button size="small" color="primary"
                                                    onClick={() => handleEditClickOpen({note})}>
                                                Edit
                                            </Button>
                                            <Button size="small" color="primary"
                                                    onClick={() => deleteNoteHandler({note})}>
                                                Delete
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Dialog
                            onClose={handleViewClose}
                            aria-labelledby="customized-dialog-title"
                            open={viewOpen}
                            fullWidth
                            className="dialogStyle"
                            // classes={{paperFullWidth: classes.dialogeStyle}}
                        >
                            <DialogTitle id="customized-dialog-title" onClose={handleViewClose}>
                                {title}
                            </DialogTitle>
                            <DialogContent dividers>
                                <TextField
                                    fullWidth
                                    id="noteDetails"
                                    name="body"
                                    multiline
                                    readonly
                                    rows={1}
                                    rowsMax={25}
                                    value={body}
                                    InputProps={{
                                        disableUnderline: true
                                    }}
                                />
                            </DialogContent>
                        </Dialog>
                    </main>
                )
            }
        </ThemeProvider>
    );
};

export default Notes;