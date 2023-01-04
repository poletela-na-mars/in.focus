const {matchIsValidTel} = require("mui-tel-input");
const isEmpty = (string) => {
    return string.trim() === '';
};

const firstNameRegexp = /^[a-zA-Z-]{2,30}$/;
const lastNameRegexp = /^[a-zA-Z-]{2,30}$/;
const userNameRegexp = /^[A-Za-z0-9-_]{2,30}$/;
// const phoneNumberRegexp = /^((8|\+374|\+994|\+995|\+375|\+7|\+380|\+38|\+996|\+998|\+993)[- ]?)?\(?\d{3,5}\)?[- ]?\d[- ]?\d{1}[- ]?\d[- ]?\d[- ]?\d(([- ]?\d)?[- ]?\d)?$/;
const passwordRegexp = /^[A-Za-z0-9!@#$%^&*_-]\w{5,50}$/;
const emailRegexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


const basicValidation = (data, errors) => {
    if (!firstNameRegexp.test(data.firstName)) {
        errors.firstName = 'First Name must contain only letters (min. 2)';
    } else if (isEmpty(data.firstName)) {
        errors.firstName = 'Must not be empty';
    }

    if (!lastNameRegexp.test(data.lastName)) {
        errors.lastName = 'Last Name must contain only letters (min. 2)';
    } else if (isEmpty(data.lastName)) {
        errors.lastName = 'Must not be empty';
    }

    // if (isEmpty(data.country)) errors.country = 'Must not be empty';

    return errors;
};

exports.validateLoginData = (data) => {
    let errors = {};

    if (!emailRegexp.test(data.email)) {
        errors.email = 'Wrong Email';
    } else if (isEmpty(data.email) || data.email.length > 50) errors.email = 'Must not be empty';

    if (isEmpty(data.password)) errors.password = 'Must not be empty';

    if (!passwordRegexp.test(data.password) || data.email.length > 50) {
        errors.password = 'Wrong Password';
    } else if (isEmpty(data.password)) {
        errors.password = 'Must not be empty';
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0
    };
};

exports.validateUpdatedData = (data) => {
    // let errors = {};

    // if (!firstNameRegexp.test(data.firstName)) {
    //     errors.firstName = 'First Name must contain only letters (min. 2)';
    // } else if (isEmpty(data.firstName)) {
    //     errors.firstName = 'Must not be empty';
    // }
    //
    // if (!lastNameRegexp.test(data.lastName)) {
    //     errors.lastName = 'Last Name must contain only letters (min. 2)';
    // } else if (isEmpty(data.lastName)) {
    //     errors.lastName = 'Must not be empty';
    // }
    //
    // if (isEmpty(data.country)) errors.country = 'Must not be empty';

    console.log('VALIDATED 1');

    let errors = basicValidation(data, {});

    console.log('VALIDATED 2');

    return {
        errors,
        valid: Object.keys(errors).length === 0
    };
};

exports.validateSignUpData = (data) => {
    // let errors = {};

    let errors = basicValidation(data, {});

    if (isEmpty(data.email)) {
        errors.email = 'Must not be empty';
    } else if (!emailRegexp.test(data.email) || data.email.length > 50) {
        errors.email = 'Must be valid email address and not more than 50 characters';
    }

    // if (!firstNameRegexp.test(data.firstName)) {
    //     errors.firstName = 'First Name must contain only letters (min. 2)';
    // } else if (isEmpty(data.firstName)) {
    //     errors.firstName = 'Must not be empty';
    // }
    //
    // if (!lastNameRegexp.test(data.lastName)) {
    //     errors.lastName = 'Last Name must contain only letters (min. 2)';
    // } else if (isEmpty(data.lastName)) {
    //     errors.lastName = 'Must not be empty';
    // }
    //
    // if (isEmpty(data.country)) errors.country = 'Must not be empty';

    if (!matchIsValidTel(data.phoneNumber, data.phoneNumberCountry)) {
        errors.phoneNumber = 'Must be valid phone number';
    } else if (isEmpty(data.phoneNumber)) {
        errors.phoneNumber = 'Must not be empty';
    }

    if (!passwordRegexp.test(data.password)) {
        errors.password = 'Password must have at least 6 characters (max. 50) and may have special symbols (!@#$%^&*_-)';
    } else if (isEmpty(data.password)) {
        errors.password = 'Must not be empty';
    }
    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Passwords must be the same';
    } else if (isEmpty(data.confirmPassword)) {
        errors.confirmPassword = 'Must not be empty';
    }
    if (!userNameRegexp.test(data.username)) {
        errors.username = 'Username must have at least 6 characters (letters, numbers). You may also use \'-\' and \'_\'.';
    } else if (isEmpty(data.username)) {
        errors.username = 'Must not be empty';
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0
    };
};
