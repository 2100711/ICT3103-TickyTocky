import { notification } from "antd";
import { WATCH_BRANDS, WATCH_MOVEMENTS, WATCH_CASE_MATERIALS, BRACELET_STRAP_MATERIALS, GENDER } from "../constants.js";
import { getUser } from "../api/users";
import { checkSerial } from "../api/serials";

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

const checkDupSerial = async (serial) => {
    const dupSerial = await checkSerial(serial);
    return dupSerial ? true : false;
};

// WATCHES
const validateBrand = (brand) => {
    return WATCH_BRANDS.includes(brand);
};

const validateModelNumber = (modelNumber) => {
    const modelNumberRegex = /[A-Za-z0-9-]{10}/;
    return modelNumberRegex.test(modelNumber);
};

const validateModelName = (modelName) => {
    const modelNameRegex = /\b[A-Za-z0-9-]+(?:\s[A-Za-z0-9-]+)+\b/;
    return modelNameRegex.test(modelName);
};

const validateMovement = (movement) => {
    return WATCH_MOVEMENTS.includes(movement);
};

const validateCaseMaterial = (caseMaterial) => {
    return WATCH_CASE_MATERIALS.includes(caseMaterial);
};

const validateBraceletStrapMaterial = (braceletStrapMaterial) => {
    return BRACELET_STRAP_MATERIALS.includes(braceletStrapMaterial);
};

const validateYOP = (yop) => {
    const year = parseInt(yop);
    const current = new Date().getFullYear();

    if (year < 1969 || year > current) {
        return false;
    }
    return true;
};

const validateGender = (gender) => {
    return GENDER.includes(gender);
};

// CERT
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(email);
};

const checkDupEmail = async (email) => {
    const dupEmail = await getUser(email);
    return dupEmail ? true : false;
};


const validateValidatedBy = (validatedBy) => {
    const validatedByRegex = /^[A-Za-z\s-']{2,50}$/;
    return validatedByRegex.test(validatedBy);
};

const checkPastDate = (dateOfValidation, issueDate) => {
    const currentDate = new Date();
    if (dateOfValidation >= currentDate || issueDate >= currentDate) {
        return false;
    }
    return true;
};

const checkFutureDate = (expiryDate) => {
    const currentDate = new Date();
    if (expiryDate <= currentDate) {
        return false;
    }
    return true;
};

const validateRemarks = (remarks) => {
    const remarksRegex = /^.{1,255}$/;
    return remarksRegex.test(remarks);
};

export const validateCert = (case_serial,
    movement_serial,
    dial,
    bracelet_strap,
    crown_pusher,
    brand,
    model_no,
    model_name,
    movement,
    case_material,
    bracelet_strap_material,
    yop,
    gender,
    user_email,
    validated_by,
    date_of_validation,
    watch_id,
    issue_date,
    expiry_date,
    remarks, ) => {

    const {
        case_serial,
        movement_serial,
        dial,
        bracelet_strap,
        crown_pusher,
    } = serial;

    const isDupSerial = checkDupSerial(serial);

    const isDupEmail = checkDupEmail(user_email);

    const isPastDate = checkPastDate(date_of_validation, issue_date);

    const isFutureDate = checkFutureDate(expiry_date);

    const errors = {};

    if (isDupEmail) {
        errors.push(
            "User does not exist. Please provide a valid email."
        );
    }

    if (isDupSerial) {
        errors.push(
            "A record with these serial numbers already exists. Please check and provide unique serial numbers."
        );
    }

    if (!validateCaseSerial(case_serial)) {
        errors.push(
            "Case serial numbers must be 8 characters long and contain only letters and numbers."
        );
    }

    if (!validateMovementSerial(movement_serial)) {
        errors.push(
            "Movement serial numbers must be 10-12 characters long and contain only letters and numbers."
        );
    }

    if (!validateDial(dial)) {
        errors.push(
            "Dial serial numbers must be 8 characters long and contain only letters and numbers."
        );
    }

    if (!validateBraceletStrap(bracelet_strap)) {
        errors.push(
            "Bracelet or strap serial numbers must be 6-8 characters long and contain only letters and numbers."
        );
    }

    if (!validateCrownPusher(crown_pusher)) {
        errors.push(
            "Crown pusher serial numbers must be 5-7 characters long and contain only letters and numbers."
        );
    }

    if (!validateBrand(brand)) {
        errors.push(
            `Invalid brand: ${brand}. Please choose from the list of valid watch brands.`
        );
    }

    if (!validateModelNumber(model_no)) {
        errors.push(
            "Model number must consist of 10 alphanumeric characters or hyphens."
        );
    }

    if (!validateModelName(model_name)) {
        errors.push(
            "Model name must contain only letters, numbers, and hyphens, separated by spaces."
        );
    }

    if (!validateMovement(movement)) {
        errors.push(
            `Invalid movmement: ${movement}. Please choose from the list of valid watch movement.`
        );
    }

    if (!validateCaseMaterial(case_material)) {
        errors.push(
            `Invalid case material: ${case_material}. Please choose from the list of valid watch case material.`
        );
    }

    if (!validateBraceletStrapMaterial(bracelet_strap_material)) {
        errors.push(
            `Invalid case material: ${bracelet_strap_material}. Please choose from the list of valid watch bracelet/strap material.`
        );
    }

    if (!validateYOP(yop)) {
        errors.push(
            `Invalid year: ${yop}. Please choose from the list of valid year of production.`
        );
    }

    if (!validateValidatedBy(validated_by)) {
        errors.push(
            "Validated by must be between 2 and 50 characters, using only letters, spaces, hyphens, and single quotes."
        );
    }

    if (!isPastDate) {
        errors.push(
            "Date of validation and issue date cannot be current or future date."
        );
    }

    if (!isFutureDate) {
        errors.push(
            "Expiry date cannot be current or past date."
        );
    }

    // Date validations
    if (date_of_validation >= issue_date) {
        errors.push(
            "The Date of Validation must occur before the Issue Date."
        );
    }

    if (date_of_validation >= expiry_date) {
        errors.push(
            "The Date of Validation must occur before the Expiry Date."
        );
    }

    if (issue_date >= expiry_date) {
        errors.push(
            "The Issue Date must occur before the Expiry Date."
        );
    }

    if (!validateRemarks(remarks)) {
        errors.push(
            "Remarks must not exceed 255 characters in length."
        );
    }

    // Check for any validation errors
    if (errors.length > 0) {
        notification.error({
            message: "Certificates Creation Failed",
            description: { errors },
            duration: 5,
        });
    }
};