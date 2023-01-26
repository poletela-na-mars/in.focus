const {admin, db} = require('../utils/admin');
const config = require('../utils/config');

const firebase = require("firebase/compat/app");

firebase.initializeApp(config);

const {validateLoginData, validateSignUpData, validateUpdatedData} = require('../utils/validators');

const firebaseAuth = require("firebase/compat/auth");
const {response} = require("express");
const {getAuth} = require("firebase-admin/auth");
const os = require("os");
const {storage} = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const auth = firebase.auth();

const reExt = /^(jpeg)|(jpg)|(png)$/;

// const catchTemplate = (err, code, jsonBody) => {
//     console.error(err);
//     return response.status(code).json(jsonBody);
// };

exports.loginUser = (request, response) => {
    const user = {
        email: request.body.email,
        password: request.body.password
    }

    const {valid, errors} = validateLoginData(user);
    if (!valid) return response.status(400).json(errors);

    auth
        .signInWithEmailAndPassword(user.email, user.password)
        .then((data) => {
            return data.user.getIdToken();
        })
        .then((token) => {
            return response.json({token});
        })
        .catch((err) => {
            // catchTemplate(err, 403, {general: 'Wrong credentials, please try again'});
            console.error(err);
            return response.status(403).json({general: 'Wrong credentials, please try again'});
        })
    // });
};

exports.signUpUser = (request, response) => {
    const newUser = {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        phoneNumber: request.body.phoneNumber,
        phoneNumberCountry: request.body.phoneNumberCountry,
        country: request.body.country,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        username: request.body.username
    };

    const {valid, errors} = validateSignUpData(newUser);

    if (!valid) return response.status(400).json(errors);

    let token, userId;
    db
        .doc(`/users/${newUser.username}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                return response.status(400).json({username: 'This username is already taken'});
            } else {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(
                        newUser.email,
                        newUser.password
                    );
            }
        })
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken;
            const userCredentials = {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                username: newUser.username,
                phoneNumber: newUser.phoneNumber,
                phoneNumberCountry: newUser.phoneNumberCountry,
                country: newUser.country,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                editedAt: new Date().toISOString(),
                userId
            };
            return db
                .doc(`/users/${newUser.username}`)
                .set(userCredentials);
        })
        .then(() => {
            return response.status(201).json({token});
        })
        .catch((err) => {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                return response.status(400).json({email: 'Email is already in use'});
            } else {
                return response.status(500).json({general: 'Something went wrong, please try again'});
            }
        });
};

const deleteImage = (profilePicture, username) => {
    const bucket = admin.storage().bucket(config.storageBucket);
    const extReMatch = profilePicture.match(reExt);
    const ext = extReMatch[extReMatch.length - 1];
    const fullPath = `${username}.${ext}`;
    console.log(extReMatch.length);
    console.log(extReMatch[extReMatch.length - 1] + '   path');
    bucket.file(fullPath).delete()
        .then(() => {
            response.json({message: 'File deleted from storage successfully'});
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({
                error: err.code
            });
            // catchTemplate(err, 500, {error: err.code});
        });

    return db.doc(`/users/${username}`).update({
        imageUrl: ''
    })
        .then(() => {
            response.json({message: 'Image URL updated successfully'});
        })
        .catch((err) => {
            // catchTemplate(err, 500, {error: err.code});
            console.error(err);
            return response.status(500).json({
                error: err.code
            });
        });
};

exports.uploadProfileImage = (request, response) => {
    const BusBoy = require('../../node_modules/@fastify/busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({
        headers: request.headers,
        limits: { fileSize: 5  * 1024 * 1024 , files: 1 }
    });

    let imageFileName;
    let imageToBeUploaded = {};
    let limit_reach = false;
    const limit_reach_err = "File is too large/small or several files were selected!";

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log(fieldname, filename, encoding, mimetype);

        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
            return response.status(400).json({
                error: '❌ Wrong file type submitted'
            });
        }

        const reFileName = /^[a-zA-Z0-9_-]{1,80}\.[a-zA-Z]{1,8}$/;
        if (!reFileName.test(filename)) {
            return response.status(400).json({
                error: '❌ Invalid image name or extension of file'
            });
        }

        const imageExtension = filename.split('.')[filename.split('.').length - 1];

        if (!reExt.test(imageExtension)) {
            return response.status(400).json({
                error: '❌ Invalid extension of file'
            });
        }

        imageFileName = `${request.user.username}.${imageExtension}`;

        const filepath = path.join(os.tmpdir(), imageFileName);

        imageToBeUploaded = {
            filepath,
            mimetype
        };

        file.pipe(fs.createWriteStream(filepath));

        file.on('limit', () => {
            fs.unlink(filepath, () => {
                limit_reach = true;
                response.status(455).send(limit_reach_err);
            });
        });

        const fileSize = fs.statSync(filepath);
        if (fileSize.size < 5 * 1024) {
            limit_reach = true;
            response.status(455).send(limit_reach_err);
        }
    });

    if (request.body.profilePicture) {
        deleteImage(imageFileName, request.user.username)
            .then(() => {
                response.json({message: 'Image URL updated successfully'})
            })
            .catch((err) => {
                // catchTemplate(err, 500, {error: err.code});
                console.error(err);
                return response.status(500).json({error: err.code});
            });
    }

    busboy.on('finish', () => {
        if (!limit_reach) {
            admin
                .storage()
                .bucket(config.storageBucket)
                .upload(imageToBeUploaded.filepath, {
                    resumable: false,
                    metadata: {
                        metadata: {
                            contentType: imageToBeUploaded.mimetype,
                        },
                    },
                })
                .then(() => {
                    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
                    return db.doc(`/users/${request.user.username}`).update({
                        imageUrl
                    });
                })
                .then(() => {
                    return response.json({
                        message: '✅ Image uploaded successfully'
                    });
                })
                .catch((err) => {
                    console.error(err);
                    return response.status(500).json({
                        error: err.code
                    });
                })
        }
    });
    busboy.end(request.rawBody);
    request.pipe(busboy);
};

exports.deleteProfileImage = (request, response) => {
    deleteImage(request.body.profilePicture, request.user.username)
        .then(() => {
            return response.json({
                message: '✅ Image deleted successfully'
            });
        })
        .catch((err) => {
            // catchTemplate(err, 500, {error: err.code});
            console.error(err);
            return response.status(500).json({error: err.code});
        });
};

exports.getUserDetail = (request, response) => {
    let userData = {};
    db
        .doc(`/users/${request.user.username}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                userData.userCredentials = doc.data();
                return response.json(userData);
            }
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({error: err.code});
            // catchTemplate(err, 500, {error: err.code});
        });
};

exports.updateUserDetails = (request, response) => {
    const updatedData = {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        country: request.body.country,
    };

    const {valid, errors} = validateUpdatedData(updatedData);

    if (!valid) return response.status(400).json(errors);

    let document = db.collection('users').doc(`${request.user.username}`);
    document.update(request.body)
        .then(() => {
            response.json({message: 'Updated successfully'});
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({
                message: "Cannot update the value"
            });
            // catchTemplate(err, 500, {message: "Cannot update the value"});
        });
};

exports.deleteUser = (request, response) => {
    const userNotes = db.collection('notes');
    userNotes
        .where("username", "==", request.params.username)
        .get()
        .then(snap => {
            snap.forEach(doc => {
                doc.ref.delete();
            });
        })
        .then(() => {
            response.json({message: 'Notes deleted from DB successfully'});
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({error: err.code});
            // catchTemplate(err, 500, {error: err.code});
        });

    const document = db.doc(`/users/${request.params.username}`);
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return response.status(404).json({error: "User not found"})
            }
            if (doc.data().username !== request.user.username) {
                return response.status(403).json({error: "Unauthorized"})
            }
            auth.currentUser.delete()
                .then(() => {
                    response.json({message: "Deleted from Auth Base successfully"});
                })
                .catch((err) => {
                    console.error(err);
                    return response.status(500).json({error: err.code});
                    // catchTemplate(err, 500, {error: err.code});
                })
            return document.delete();
        })
        .then(() => {
            response.json({message: 'Deleted from DB successfully'});
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({error: err.code});
            // catchTemplate(err, 500, {error: err.code});
        });
};
