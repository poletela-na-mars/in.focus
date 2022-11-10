const {admin, db} = require('../utils/admin');
const config = require('../utils/config');

const firebase = require("firebase/compat/app");

firebase.initializeApp(config);

const {validateLoginData, validateSignUpData} = require('../utils/validators');

const firebaseAuth = require("firebase/compat/auth");
const auth = firebase.auth();

// Login
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
        .catch((error) => {
            console.error(error);
            return response.status(403).json({general: 'Wrong credentials, please try again'});
        })
};

exports.signUpUser = (request, response) => {
    const newUser = {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        phoneNumber: request.body.phoneNumber,
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
                country: newUser.country,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId
            };
            return db
                .doc(`/users/${newUser.username}`)
                .set(userCredentials);
        })
        .then(() => {
            return response.status(201).json({token});
        })
        .catch((error) => {
            console.error(error);
            if (error.code === 'auth/email-already-in-use') {
                return response.status(400).json({email: 'Email already in use'});
            } else {
                return response.status(500).json({general: 'Something went wrong, please try again'});
            }
        });
}

const deleteImage = (imageName) => {
    const bucket = admin.storage().bucket();
    const path = `${imageName}`
    return bucket.file(path).delete()
        .then(() => {
        })
        .catch((error) => {
        })
};

// Upload profile picture
exports.uploadProfilePhoto = (request, response) => {
    const Busboy = require('../../node_modules/@fastify/busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');
    // const busboy = new Busboy({headers: request.headers});
    const busboy = new Busboy({headers: request.headers, limits: {files: 1, fileSize: 10000000}});

    let imageFileName;
    let imageToBeUploaded = {};
    let filePath;
    let limitReach = false;
    const limitReachErr = "You have attached more than one file or your file is too large";

    busboy.on('file', (fieldName, file, fileName, encoding, mimetype) => {
        if (mimetype !== 'image/png' && mimetype !== 'image/jpeg') {
            return response.status(400).json({error: 'Wrong file type submitted'});
        }
        const imageExtension = fileName.split('.')[fileName.split('.').length - 1];
        imageFileName = `${request.user.username}.${imageExtension}`;
        filePath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = {filePath, mimetype};
        file.pipe(fs.createWriteStream(filePath));
    });
    deleteImage(imageFileName).catch((error) => {
        console.error(error);
        return response.status(500).json({error: error.code});
    });
    busboy.on('limit', () => {
        fs.unlink(filePath, () => {
            limitReach = true;
            return response.status(455).send(limitReachErr);
        })
    });
    busboy.on('finish', () => {
        admin
            .storage()
            .bucket()
            .upload(imageToBeUploaded.filePath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageToBeUploaded.mimetype
                    }
                }
            })
            .then(() => {
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
                return db.doc(`/users/${request.user.username}`).update({
                    imageUrl
                });
            })
            .then(() => {
                if (!limitReach) {
                    return response.json({message: 'Image uploaded successfully'});
                }
            })
            .catch((error) => {
                console.error(error);
                return response.status(500).json({error: error.code});
            });
    });
    busboy.end(request.rawBody);
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
        .catch((error) => {
            console.error(error);
            return response.status(500).json({ error: error.code });
        });
};

exports.updateUserDetails = (request, response) => {
    let document = db.collection('users').doc(`${request.user.username}`);
    document.update(request.body)
        .then(()=> {
            response.json({message: 'Updated successfully'});
        })
        .catch((error) => {
            console.error(error);
            return response.status(500).json({
                message: "Cannot update the value"
            });
        });
};