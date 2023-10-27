// AUTH
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#\$%^&\+=])(?!.*\s).{14,128}$/;
    return passwordRegex.test(password);
};

const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s-']{2,50}$/;
    return nameRegex.test(name);
};

export const validateRegister = async (req, res, next) => {
    const { email, password, name } = req.body;

    if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({ error: 'Invalid password' });
    }

    if (!validateName(name)) {
        return res.status(400).json({ error: 'Invalid name' });
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
const validateValidatedBy = (validatedBy) => {
    const validatedByRegex = /^[A-Za-z\s-']{2,50}$/;
    return validatedByRegex.test(validatedBy);
};

const validateRemarks = (remarks) => {
    const remarksRegex = /^.{1,255}$/;
    return remarksRegex.test(remarks);
};

export const validateCert = (req, res, next) => {
    const {
        case_serial,
        movement_serial,
        dial,
        bracelet_strap,
        crown_pusher,
        model_no,
        model_name,
        validated_by,
        date_of_validation,
        watch_id,
        issue_date,
        expiry_date,
        remarks,
    } = req.body;

    const errors = [];

    if (!validateCaseSerial(case_serial)) {
        errors.push('Case serial numbers must be 8 characters long and contain only letters and numbers.');
    }

    if (!validateMovementSerial(movement_serial)) {
        errors.push('Movement serial numbers must be 10-12 characters long and contain only letters and numbers.');
    }

    if (!validateDial(dial)) {
        errors.push('Dial serial numbers must be 8 characters long and contain only letters and numbers.');
    }

    if (!validateBraceletStrap(bracelet_strap)) {
        errors.push('Bracelet or strap serial numbers must be 6-8 characters long and contain only letters and numbers.');
    }

    if (!validateCrownPusher(crown_pusher)) {
        errors.push('Crown pusher serial numbers must be 5-7 characters long and contain only letters and numbers.');
    }

    if (!validateModelNumber(model_no)) {
        errors.push('Model number must be 10 alphanumeric characters or hyphens.');
    }

    if (!validateModelName(model_name)) {
        errors.push('Model name must contain only letters, numbers, and hyphens, separated by spaces.');
    }

    // Validate "validated_by"
    if (!validateValidatedBy(validated_by)) {
        errors.push('Validated by must be between 2 to 50 characters. Use only letters, spaces, hyphens, and single quotes.');
    }

    // Date validations
    if (date_of_validation >= issue_date) {
        errors.push('Date of validation must be before Issue Date.');
    }

    if (date_of_validation >= expiry_date) {
        errors.push('Date of validation must be before Expiry Date.');
    }

    if (issue_date >= expiry_date) {
        errors.push('Issue Date must be before Expiry Date.');
    }

    if (!validateRemarks(remarks)) {
        errors.push('Remarks must not exceed 255 characters.');
    }

    // Check for any validation errors
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // If there are no errors, proceed
    next();
};