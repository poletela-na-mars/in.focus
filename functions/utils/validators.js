const isEmpty = (string) => {
    return string.trim() === '';
};

const firstNameRegexp = /^[a-zA-Z-]+$/;
const lastNameRegexp = /^[a-zA-Z-]+$/;
const phoneNumberRegexp = /^((8|\+374|\+994|\+995|\+375|\+7|\+380|\+38|\+996|\+998|\+993)[- ]?)?\(?\d{3,5}\)?[- ]?\d[- ]?\d{1}[- ]?\d[- ]?\d[- ]?\d(([- ]?\d)?[- ]?\d)?$/;
const passwordRegexp = /^[A-Za-z0-9]\w{6,}$/;
const emailRegexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


exports.validateLoginData = (data) => {
    let errors = {};
    if (!emailRegexp.test(data.email)) {
        errors.email = 'Wrong Email';
    } else if (isEmpty(data.email)) errors.email = 'Must not be empty';
    if (isEmpty(data.password)) errors.password = 'Must not be empty';
    if (!passwordRegexp.test(data.password)) {
        errors.password = 'Wrong Password';
    } else if (isEmpty(data.password)) {
        errors.password = 'Must not be empty';
    }
    return {
        errors,
        valid: Object.keys(errors).length === 0
    };
};
exports.validateSignUpData = (data) => {
    let errors = {};

    if (isEmpty(data.email)) {
        errors.email = 'Must not be empty';
    } else if (!emailRegexp.test(data.email)) {
        errors.email = 'Must be valid email address';
    }

    if (!firstNameRegexp.test(data.firstName)) {
        errors.firstName = 'First Name must contain only letters';
    } else if (isEmpty(data.firstName)) {
        errors.firstName = 'Must not be empty';
    }

    if (!lastNameRegexp.test(data.lastName)) {
        errors.lastName = 'Last Name must contain only letters';
    } else if (isEmpty(data.lastName)) {
        errors.lastName = 'Must not be empty';
    }

    if (!phoneNumberRegexp.test(data.phoneNumber)) {
        errors.phoneNumber = 'Must be valid phone number';
    } else if (isEmpty(data.phoneNumber)) {
        errors.phoneNumber = 'Must not be empty';
    }

    if (isEmpty(data.country)) errors.country = 'Must not be empty';

    if (!passwordRegexp.test(data.password)) {
        errors.password = 'Password must have at least 6 characters (letters, numbers)';
    } else if (isEmpty(data.password)) {
        errors.password = 'Must not be empty';
    }
    if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must be the same';
    if (isEmpty(data.username)) errors.username = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0
    };
};
