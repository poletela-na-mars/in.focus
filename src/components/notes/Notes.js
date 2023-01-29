import {forwardRef, useEffect, useState} from "react";
import {
    AppBar,
    Box,
    Button,
    CardActions,
    CardContent,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Slide,
    TextField,
    ThemeProvider,
    Toolbar,
    Typography
} from "@mui/material";
import {authMiddleWare} from "../../util/auth";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import "./Notes.scss";
import {theme} from "../../theme";

import {AddCircleRounded, CloseRounded} from "@mui/icons-material";
import {CustomizedCard} from "../account/Account";

const MAX_TITLE_LENGTH = 30;
const MAX_BODY_LENGTH = 65;

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props}/>;
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
                // console.log(err);
                err.response.status(500).json({error: err.code});
                window.location.reload();
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

    const DialogTitleWrapper = (props) => {
        const {children, onClose} = props;
        return (
            <DialogTitle component="h6" className="top-panel">
                {children}
                {onClose ? (
                    <IconButton className="close-button" onClick={onClose}>
                        <CloseRounded/>
                    </IconButton>
                ) : null}
            </DialogTitle>
        );
    };

    dayjs.extend(relativeTime);

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
            editedAt: new Date().toISOString(),
        };

        let options;
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
                setOpen(false);
                window.location.reload();
            })
            .catch((err) => {
                setOpen(true);
                setErrors([...errors, err.response.data]);
                err.response.status(500).json({error: err.code});
                // console.log(error);
            });
    };

    const handleViewClose = () => {
        setViewOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
            {(uiLoading === true) ?
                (<div className="container">
                    {uiLoading && <CircularProgress size={100} className="loader"/>}
                </div>) : (
                    <main className="content" style={{padding: theme.spacing(3)}}>
                        <Toolbar className="tool-bar"/>
                        <div className="add-notes-button">
                            <IconButton
                                size="large"
                                onClick={handleClickOpen}
                            >
                                <AddCircleRounded fontSize="large" className="icon_active"/>
                            </IconButton>
                        </div>
                        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                            <AppBar className="app-bar">
                                <Toolbar>
                                    <IconButton edge="start" color="inherit" onClick={handleClose}>
                                        <CloseRounded/>
                                    </IconButton>
                                    <Typography variant="h6" className="button-type-title"
                                                sx={{marginLeft: theme.spacing(2)}}>
                                        {buttonType === "Edit" ? "Edit Note" : "Create a new Note"}
                                    </Typography>
                                    <Button
                                        color="inherit"
                                        onClick={handleSubmit}
                                        className="submit-button"
                                        disabled={
                                            !title.trim() ||
                                            !body.trim()
                                        }
                                    >
                                        {buttonType === "Edit" ? "Save" : "Submit"}
                                    </Button>
                                </Toolbar>
                            </AppBar>

                            <form className="form" noValidate style={{
                                marginTop: theme.spacing(3),
                                marginLeft: theme.spacing(1.5),
                                marginRight: theme.spacing(1.5)
                            }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            minRows={1}
                                            maxRows={2}
                                            inputProps={{maxLength: 100}}
                                            multiline
                                            className="note-title"
                                            label="Note Title"
                                            name="title"
                                            autoComplete="noteTitle"
                                            helperText={errors.title}
                                            value={title}
                                            error={!!errors.title}
                                            onChange={handleChange}
                                            sx={{marginTop: theme.spacing(8)}}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            className="note-details"
                                            label="Note Details"
                                            name="body"
                                            autoComplete="noteDetails"
                                            multiline
                                            maxRows={20}
                                            inputProps={{maxLength: 500}}
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
                            {notes.length !== 0 ? (notes.filter((note) => {
                                    return note.title.includes(props.searchReq) || note.body.includes(props.searchReq)
                                }).map((note) => (
                                    <Grid item xs={12} sm={6} key={note.noteId}>
                                        <CustomizedCard className="top-panel" variant="outlined">
                                            <CardContent className="view-field-card" onClick={() => handleViewOpen({note})}>
                                                <Typography variant="h5" component="h2" className="card-text">
                                                    {note.title.length > MAX_TITLE_LENGTH ? `${note.title.slice(0, MAX_TITLE_LENGTH)}...` : note.title}
                                                </Typography>
                                                <Typography color="textSecondary" className="card-text card-text__date">
                                                    {`last changes ${(note.createdAt !== note.editedAt) ? dayjs(note.editedAt).fromNow() : dayjs(note.createdAt).fromNow()}`}
                                                </Typography>
                                                <Typography variant="body2" component="p" className="card-text">
                                                    {note.body.length > MAX_BODY_LENGTH ? `${note.body.slice(0, MAX_BODY_LENGTH)}...` : note.body}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>

                                                <Button size="small" color="primary"
                                                        onClick={() => handleEditClickOpen({note})}>
                                                    Edit
                                                </Button>
                                                <Button size="small" color="primary"
                                                        onClick={() => deleteNoteHandler({note})}>
                                                    Delete
                                                </Button>
                                            </CardActions>
                                        </CustomizedCard>
                                    </Grid>
                                ))) :
                                (
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: '80vh',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: 2,
                                            textAlign: 'center'
                                        }}
                                    >
                                        <Typography color="textSecondary" component="h2" variant="h5">You don't have any
                                            notes now</Typography>
                                    </Box>
                                )
                            }
                        </Grid>

                        <Dialog
                            onClose={handleViewClose}
                            open={viewOpen}
                            fullWidth
                            className="dialog-style"
                        >
                            <DialogTitleWrapper onClose={handleViewClose}>
                                {title}
                            </DialogTitleWrapper>
                            <DialogContent dividers sx={{padding: theme.spacing(2), margin: 0}}>
                                <TextField
                                    fullWidth
                                    name="body"
                                    multiline
                                    minRows={20}
                                    maxRows={25}
                                    value={body}
                                    variant="standard"
                                    InputProps={{
                                        disableUnderline: true,
                                        readOnly: true
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
