const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const app = require("express")();

const {
    getAllNotes,
    postOneNote,
    deleteNote,
    editNote
} = require("./APIs/notes");

const {
    loginUser,
    signUpUser,
    uploadProfilePhoto,
    getUserDetail,
    updateUserDetails
} = require("./APIs/users")

const auth = require('./utils/auth');

app.get("/notes", auth, getAllNotes);
app.post("/note", auth, postOneNote);
app.delete("/note/:noteId", auth, deleteNote);
app.put("/note/:noteId", auth, editNote);
app.post("/login", loginUser);
app.post("/signup", signUpUser);
app.post('/user/image', auth, uploadProfilePhoto);
app.get('/user', auth, getUserDetail);
app.put('/user', auth, updateUserDetails);

exports.api = functions.https.onRequest(app);

//firebase serve