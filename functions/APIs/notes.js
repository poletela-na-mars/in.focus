const {db} = require("../utils/admin");

exports.getAllNotes = (request, response) => {
    db
        .collection('notes')
        .where('username', '==', request.user.username)
        .orderBy('editedAt', 'desc')
        .get()
        .then((data) => {
            const notes = [];
            data.forEach((doc) => {
                notes.push({
                    noteId: doc.id,
                    title: doc.data().title,
                    username: doc.data().username,
                    body: doc.data().body,
                    createdAt: doc.data().createdAt,
                    editedAt: doc.data().editedAt,
                });
            });
            return response.json(notes);
        })
        .catch((err) => {
            // console.error(err);
            return response.status(500).json({error: err.code});
        });
};

exports.getOneNote = (request, response) => {
    db
        .doc(`/notes/${request.params.noteId}`)
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return response.status(404).json({
                    error: 'Note not found'
                });
            }
            if (doc.data().username !== request.user.username) {
                return response.status(403).json({error: "Unauthorized"})
            }
            const noteData = doc.data();
            noteData.noteId = doc.id;
            return response.json(noteData);
        })
        .catch((err) => {
            // console.error(err);
            return response.status(500).json({error: err.code});
        });
};

exports.postOneNote = (request, response) => {
    if (request.body.body.trim() === '') {
        return response.status(400).json({body: 'Must not be empty'});
    }

    if (request.body.title.trim() === '') {
        return response.status(400).json({title: 'Must not be empty'});
    }

    const newNote = {
        title: request.body.title,
        body: request.body.body,
        createdAt: new Date().toISOString(),
        editedAt: new Date().toISOString(),
        username: request.user.username,
    };

    db
        .collection('notes')
        .add(newNote)
        .then((doc) => {
            const responseNote = newNote;
            responseNote.id = doc.id;
            return response.json(responseNote);
        })
        .catch((err) => {
            return response.status(500).json({error: 'Something went wrong'});
            // console.error(err);
        });
};

exports.deleteNote = (request, response) => {
    const document = db.doc(`/notes/${request.params.noteId}`);
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return response.status(404).json({error: 'Note not found'});
            }
            if (doc.data().username !== request.user.username) {
                return response.status(403).json({error: "Unauthorized"});
            }
            return document.delete();
        })
        .then(() => {
            return response.json({message: 'Deleted successfully'});
        })
        .catch((err) => {
            // console.error(err);
            return response.status(500).json({error: err.code});
        });
};

exports.editNote = (request, response) => {
    if (request.body.noteId || request.body.createdAt) {
        return response.status(403).json({message: 'Not allowed to edit'});
    }

    const document = db.collection('notes').doc(`${request.params.noteId}`);
    document.update(request.body)
        .then(() => {
            return response.json({message: 'Edited successfully'});
        })
        .catch((err) => {
            if (err.code === 5) {
                return response.status(404).json({message: 'Not Found'});
            }
            // console.error(err);
            return response.status(500).json({
                error: err.code
            });
        });
};
