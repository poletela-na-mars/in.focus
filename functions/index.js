const functions = require("firebase-functions");
const helmet = require('helmet');

const app = require("express")();
app.disable('x-powered-by');
app.use(helmet());

const {
    getAllNotes,
    getOneNote,
    postOneNote,
    deleteNote,
    editNote
} = require("./APIs/notes");

const {
    loginUser,
    signUpUser,
    uploadProfileImage,
    getUserDetail,
    updateUserDetails,
    deleteUser,
    deleteProfileImage
} = require("./APIs/users")

const auth = require('./utils/auth');

// Notes
app.get("/notes", auth, getAllNotes);
app.get('/note/:noteId', auth, getOneNote);
app.post("/note", auth, postOneNote);
app.delete("/note/:noteId", auth, deleteNote);
app.put("/note/:noteId", auth, editNote);


// User
app.post("/login", loginUser);
app.post("/signup", signUpUser);
app.post("/user/image", auth, uploadProfileImage);
app.get("/user", auth, getUserDetail);
app.put("/user", auth, updateUserDetails);
app.delete("/users/:username", auth, deleteUser);
app.delete("/user/image", auth, deleteProfileImage);

exports.api = functions.https.onRequest(app);

//firebase serve