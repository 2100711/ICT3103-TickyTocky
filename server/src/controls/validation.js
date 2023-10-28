import { SerialNumberModel } from "../models/SerialNumbers.js";

// AUTH
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#\$%^&\+=])(?!.*\s).{14,128}$/;
    return passwordRegex.test(password);
};

const validateName = (firstName, lastName) => {
    const nameRegex = /^[A-Za-z\s-']{2,50}$/;

    if (firstName && lastName) {
        return nameRegex.test(firstName) && nameRegex.test(lastName);
    }

    return false;
};

const checkDupEmail = async (email) => {
    const dupEmail = await SerialNumberModel.findOne(email);
    return dupEmail ? true : false;
}

// const checkDupName = async (f_name, l_name) => {
//     const dupName = await SerialNumberModel.findOne({
//         $and: [
//             { f_name },
//             { l_name },
//         ],
//     });
//     return dupName ? true : false;
// }

export const validateRegister = async (req, res, next) => {
    const { email, password, f_name, l_name } = req.body;

    const isDupEmail = checkDupEmail(email);

    const isDupName = checkDupName(f_name, l_name);

    const errors = {
        conflict_409: [],
        badRequest_400: [],
    };

    if (isDupEmail) {
        errors.conflict_409.push('A user with this email address already exists. Please use a different email address.');
    }

    // if (isDupName) {
    //     errors.conflict_409.push('A user with this name already exists. Please provide a different name.');
    // }

    if (!validateEmail(email)) {
        errors.badRequest_400.push('Invalid email address. Please enter a valid Gmail address.');
    }

    if (!validatePassword(password)) {
        errors.badRequest_400.push('Invalid password. Password must be at least 14 characters long and include a combination of letters, numbers, and special characters.');
    }

    if (!validateName(f_name, l_name)) {
        errors.badRequest_400.push('Invalid name. Please provide a valid name with 2 to 50 characters, including letters, spaces, hyphens, and apostrophes.');
    }

    // Check for any validation errors
    if (errors.conflict_409.length > 0 || errors.badRequest_400.length > 0) {
        const response = {};

        if (errors.conflict_409.length > 0) {
            response.conflict_409 = errors.conflict_409;
        }

        if (errors.badRequest_400.length > 0) {
            response.badRequest_400 = errors.badRequest_400;
        }

        return res.status(400).json(response);
    }

    next();
};

// SERIAL_NUMBERS
const validateCaseSerial = (caseSerial) => {
    const caseSerialRegex = /^[A-Za-z0-9]{8}$/;
    return caseSerialRegex.test(caseSerial);
};

const validateMovementSerial = (movementSerial) => {
    const movementSerialRegex = /^[A-Za-z0-9]{10,12}$/;
    return movementSerialRegex.test(movementSerial);
};

const validateDial = (dial) => {
    const dialRegex = /^[A-Za-z0-9]{8}$/;
    return dialRegex.test(dial);
};

const validateBraceletStrap = (braceletStrap) => {
    const braceletStrapRegex = /^[A-Za-z0-9]{6,8}$/;
    return braceletStrapRegex.test(braceletStrap);
};

const validateCrownPusher = (crownPusher) => {
    const crownPusherRegex = /^[A-Za-z0-9]{5,7}$/;
    return crownPusherRegex.test(crownPusher);
};

const checkDupSerial = async (case_serial,
    movement_serial,
    dial,
    bracelet_strap,
    crown_pusher) => {
    const dupSerial = await SerialNumberModel.findOne({
        $or: [
            { case_serial },
            { movement_serial },
            { dial },
            { bracelet_strap },
            { crown_pusher },
        ],
    });
    return dupSerial ? true : false;
}

// WATCHES
const validateModelNumber = (modelNumber) => {
    const modelNumberRegex = /[A-Za-z0-9-]{10}/;
    return modelNumberRegex.test(modelNumber);
};

const validateModelName = (modelName) => {
    const modelNameRegex = /\b[A-Za-z0-9-]+(?:\s[A-Za-z0-9-]+)+\b/;
    return modelNameRegex.test(modelName);
};

// CERTS
const validateCertId = (cert_id) => {
    const certIdRegex = /^[A-Z0-9]{16}$/;
    return certIdRegex.test(cert_id);
};

const validateValidatedBy = (validatedBy) => {
    const validatedByRegex = /^[A-Za-z\s-']{2,50}$/;
    return validatedByRegex.test(validatedBy);
};

const validateRemarks = (remarks) => {
    const remarksRegex = /^.{1,255}$/;
    return remarksRegex.test(remarks);
};

const checkDupCertId = async (cert_id) => {
    const dupCertId = await SerialNumberModel.findOne(cert_id);
    return dupCertId ? true : false;
}

export const validateCert = (req, res, next) => {
    const {
        case_serial,
        movement_serial,
        dial,
        bracelet_strap,
        crown_pusher,
        model_no,
        model_name,
        cert_id,
        validated_by,
        date_of_validation,
        watch_id,
        issue_date,
        expiry_date,
        remarks,
    } = req.body;

    const isDupSerial = checkDupSerial(case_serial, movement_serial, dial, bracelet_strap, crown_pusher);
    const isDupCertId = checkDupCertId(cert_id);

    const errors = {
        conflict_409: [],
        badRequest_400: [],
    };

    if (isDupSerial) {
        errors.conflict_409.push('A record with these serial numbers already exists. Please check and provide unique serial numbers.');
    }

    if (isDupCertId) {
        errors.conflict_409.push('A record with this cert id already exists. Please check and provide unique cert id.');
    }

    if (!validateCaseSerial(case_serial)) {
        errors.badRequest_400.push('Case serial numbers must be 8 characters long and contain only letters and numbers.');
    }

    if (!validateMovementSerial(movement_serial)) {
        errors.badRequest_400.push('Movement serial numbers must be 10-12 characters long and contain only letters and numbers.');
    }

    if (!validateDial(dial)) {
        errors.badRequest_400.push('Dial serial numbers must be 8 characters long and contain only letters and numbers.');
    }

    if (!validateBraceletStrap(bracelet_strap)) {
        errors.badRequest_400.push('Bracelet or strap serial numbers must be 6-8 characters long and contain only letters and numbers.');
    }

    if (!validateCrownPusher(crown_pusher)) {
        errors.badRequest_400.push('Crown pusher serial numbers must be 5-7 characters long and contain only letters and numbers.');
    }

    if (!validateModelNumber(model_no)) {
        errors.badRequest_400.push('Model number must consist of 10 alphanumeric characters or hyphens.');
    }

    if (!validateModelName(model_name)) {
        errors.badRequest_400.push('Model name must contain only letters, numbers, and hyphens, separated by spaces.');
    }

    if (!validateCertId(cert_id)) {
        errors.badRequest_400.push('Cert id must be 16 alphanumeric');
    }

    // Validate "validated_by"
    if (!validateValidatedBy(validated_by)) {
        errors.badRequest_400.push('Validated by must be between 2 and 50 characters, using only letters, spaces, hyphens, and single quotes.');
    }

    // Date validations
    if (date_of_validation >= issue_date) {
        errors.badRequest_400.push('The Date of Validation must occur before the Issue Date.');
    }

    if (date_of_validation >= expiry_date) {
        errors.badRequest_400.push('The Date of Validation must occur before the Expiry Date.');
    }

    if (issue_date >= expiry_date) {
        errors.badRequest_400.push('The Issue Date must occur before the Expiry Date.');
    }

    if (!validateRemarks(remarks)) {
        errors.badRequest_400.push('Remarks must not exceed 255 characters in length.');
    }

    // Check for any validation errors
    if (errors.conflict_409.length > 0 || errors.badRequest_400.length > 0) {
        const response = {};

        if (errors.conflict_409.length > 0) {
            response.conflict_409 = errors.conflict_409;
        }

        if (errors.badRequest_400.length > 0) {
            response.badRequest_400 = errors.badRequest_400;
        }

        return res.status(400).json(response);
    }

    // If there are no errors, proceed
    next();
};