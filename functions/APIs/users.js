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
const auth = firebase.auth();

const catchTemplate = (err, code, jsonBody) => {
    console.error(err);
    return response.status(code).json(jsonBody);
};

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
        .catch((err) => {
            // catchTemplate(err, 403, {general: 'Wrong credentials, please try again'});
                console.error(err);
                return response.status(403).json({general: 'Wrong credentials, please try again'});
            // })
        });
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

const deleteImage = (imageName) => {
    const bucket = admin.storage().bucket(config.storageBucket);
    const path = `${imageName}`
    return bucket.file(path).delete()
        .then(() => {
            return
        })
        .catch((error) => {
            return
        })
    //TODO -deleting file
};

// Upload profile picture
exports.uploadProfilePhoto = (req, res) => {
    const BusBoy = require('../../node_modules/@fastify/busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({
        headers: req.headers
    });

    let imageFileName;
    let imageToBeUploaded = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {

        console.log(fieldname, filename, encoding, mimetype);

        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
            return res.status(400).json({
                error: '❌ Wrong file type submitted'
            })
        }

        const imageExtension = filename.split('.')[filename.split('.').length - 1];

        // imageFileName = `${Math.round(
        //     Math.random() * 1000000000000
        // )}.${imageExtension}`;
        imageFileName = `${req.user.username}.${imageExtension}`;

        const filepath = path.join(os.tmpdir(), imageFileName);

        imageToBeUploaded = {
            filepath,
            mimetype
        };

        file.pipe(fs.createWriteStream(filepath));
    });

    // deleteImage(imageFileName);
    deleteImage(imageFileName).catch((err) => {
        catchTemplate(err, 500, {error: err.code})
        // console.error(error);
        // return response.status(500).json({error: error.code});
    });

    busboy.on('finish', () => {
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
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`
                return db.doc(`/users/${req.user.username}`).update({
                    imageUrl
                })
            })
            .then(() => {
                return res.json({
                    message: '✅ Image uploaded successfully'
                })
            })
            .catch((err) => {
                console.error(err)
                return res.status(500).json({
                    error: err.code
                })
            })
    });
    busboy.end(req.rawBody);
    req.pipe(busboy);

    // NEW

    // let mimtype;
    // let saveTo;
    // // const bucket = storage.bucket(config.storageBucket);
    //
    // busboy.on('file', function(name, file, filename, encoding, mimetype) {
    //     console.log('File [' + name + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
    //     const imageExtension = filename.split('.')[filename.split('.').length - 1];
    //     imageFileName = filename + '.' + imageExtension;
    //     saveTo = path.join(os.tmpdir(), filename);
    //     file.pipe(fs.createWriteStream(saveTo));
    //     mimtype = mimetype;
    //
    // });
    //
    // busboy.on('finish', async function() {
    //     await admin.storage().bucket(config.storageBucket).upload(saveTo, {
    //         resumable: false,
    //         gzip: true,
    //         metadata:{
    //             metadata:{
    //                 contentType: mimtype
    //             }
    //         }
    //     })
    //         .then(() => {
    //                         const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`
    //                         return db.doc(`/users/${req.user.username}`).update({
    //                             imageUrl
    //                         })
    //                     })
    //                     .then(() => {
    //                         return res.json({
    //                             message: '✅ Image uploaded successfully'
    //                         })
    //                     })
    //         .catch(err => {
    //             console.error(err);
    //             return res.status(400).send(JSON.stringify(err, ["message", "arguments", "type", "name"]));
    //         });
    //
    //     res.end();
    // });
    // req.pipe(busboy);

    //NEW

    // const busboy = new BusBoy({headers: req.headers});
    // let imageFileName;
    // let imageTobeUploaded = {};
    // busboy.on('file',(fieldname, file, filename, encoding, mimeType) => {
    //     //my.image.png
    //     const imageExtension = filename.split('.')[filename.split('.').length - 1];
    //     //12345678900.png
    //     imageFileName = `${Math.round(Math.random()*100000000000)}.${imageExtension}`;
    //     const filepath = path.join(os.tmpdir(), imageFileName);
    //     imageTobeUploaded = {filepath, mimeType};
    //     file.pipe(fs.createWriteStream(filepath));
    // })
    // busboy.on('finish', () => {
    //     admin.storage().bucket(config.storageBucket).upload(imageTobeUploaded.filepath, {
    //         resumable: false,
    //         metadata:{
    //             metadata:{
    //                 contentType:imageTobeUploaded.mimeType
    //             }
    //         }
    //     })
    //         .then( () => {
    //             const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`
    //             return db.doc(`/users/${req.user.handle}`).update({imageUrl});
    //         })
    //         .then( () => {
    //             return res.json({message: "Image Uploaded Successfully"});
    //         })
    //         .catch(err => {
    //             console.error(err);
    //             return res.status(400).json({ error : err.code});
    //         })
    // });
    // busboy.end(req.rawBody);
};

// exports.uploadProfilePhoto = (request, response) => {
//     const Busboy = require('../../node_modules/@fastify/busboy');
//     const path = require('path');
//     const os = require('os');
//     const fs = require('fs');
//     // const busboy = new Busboy({headers: request.headers});
//     const busboy = new Busboy({headers: request.headers, limits: {files: 1, fileSize: 10000000}});
//
//     let imageFileName;
//     let imageToBeUploaded = {};
//     let filePath;
//     let limitReach = false;
//     const limitReachErr = "You have attached more than one file or your file is too large";
//
//     console.log(os.tmpdir());
//     console.log(imageFileName);
//
//     busboy.on('file', (fieldName, file, fileName, encoding, mimetype) => {
//         if (mimetype !== 'image/png' && mimetype !== 'image/jpeg' && mimetype !== 'image/jpg') {
//             return response.status(400).json({error: 'Wrong file type submitted'});
//         }
//         const imageExtension = fileName.split('.')[fileName.split('.').length - 1];
//         imageFileName = `${request.user.username}.${imageExtension}`;
//         console.log(os.tmpdir());
//         console.log(imageFileName);
//         filePath = path.join(os.tmpdir(), imageFileName);
//         imageToBeUploaded = {filePath, mimetype};
//         file.pipe(fs.createWriteStream(filePath));
//     });
//     deleteImage(imageFileName).catch((err) => {
//         catchTemplate(err, 500, {error: err.code})
//         // console.error(error);
//         // return response.status(500).json({error: error.code});
//     });
//     busboy.on('limit', () => {
//         fs.unlink(filePath, () => {
//             limitReach = true;
//             return response.status(455).send(limitReachErr);
//         })
//     });
//     busboy.on('finish', () => {
//         admin
//             .storage()
//             .bucket()
//             .upload(imageToBeUploaded.filePath, {
//                 resumable: false,
//                 metadata: {
//                     metadata: {
//                         contentType: imageToBeUploaded.mimetype
//                     }
//                 }
//             })
//             .then(() => {
//                 const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
//                 return db.doc(`/users/${request.user.username}`).update({
//                     imageUrl
//                 });
//             })
//             .then(() => {
//                 if (!limitReach) {
//                     return response.json({message: 'Image uploaded successfully'});
//                 }
//             })
//             .catch((err) => {
//                 catchTemplate(err, 500, {error: err.code});
//                 // console.error(err);
//                 // return response.status(500).json({error: err.code});
//             });
//     });
//     busboy.end(request.rawBody);
// };

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
            // console.error(err);
            // return response.status(500).json({error: err.code});
            catchTemplate(err, 500, {error: err.code});
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
            // console.error(err);
            // return response.status(500).json({
            //     message: "Cannot update the value"
            // });
            catchTemplate(err, 500, {message: "Cannot update the value"});
        });
};

exports.deleteUser = (request, response) => {
    // const user = {
    //     username: request.body.username,
    // }
    // db.collection('users').document(FirebaseAuth.getInstance().currentUser.uid).delete()
    //     .addOnSuccessListener { FirebaseAuth.getInstance().currentUser!!.delete().addOnCompleteListener {//Go to login screen} }
    // .addOnFailureListener { ... }

    // /**Как получить uid*/
    // const uid = db.collection('users').doc(`${user.username}`).uid;

    // const user = auth.currentUser;
    //
    // user.delete().then(() => {
    //     console.log('Successfully deleted user');
    // })
    //     .catch((error) => {
    //         console.error(error);
    //         return response.status(500).json({
    //             message: "Error deleting user"
    //         });
    //     });

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
            // console.error(err);
            // return response.status(500).json({error: err.code});
            catchTemplate(err, 500, {error: err.code});
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
                    // console.error(err);
                    // return response.status(500).json({error: err.code});
                    catchTemplate(err, 500, {error: err.code});
                })
            return document.delete();
        })
        .then(() => {
            response.json({message: 'Deleted from DB successfully'});
        })
        .catch((err) => {
            // console.error(err);
            // return response.status(500).json({error: err.code});
            catchTemplate(err, 500, {error: err.code});
        });

    // return auth.currentUser.delete();

    // auth.currentUser.delete().then(() => {
    //     response.json({message: 'Deleted from Auth Base successfully'});
    // })
    //     .catch((err) => {
    //         console.error(err);
    //         return response.status(500).json({error: err.code});
    //     });
    // db.collection("users").document(currentUser.uid).delete()
    //     .addOnSuccessListener { Fireba.getInstance().currentUser!!.delete().addOnCompleteListener {//Go to login screen} }
    // .addOnFailureListener { ... }

    // getAuth()
    //     // .deleteUser(auth.currentUser.uid)
    //     .deleteUser(uid)
    //     .then(() => {
    //         console.log('Successfully deleted user');
    //     })
    //     .catch((error) => {
    //         // console.log('Error deleting user: ', error);
    //         console.error(error);
    //         return response.status(500).json({
    //             message: "Error deleting user"
    //         });
    //     });
};