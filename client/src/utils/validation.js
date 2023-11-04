import { notification } from "antd";
import {
  WATCH_BRANDS,
  WATCH_MOVEMENTS,
  WATCH_CASE_MATERIALS,
  BRACELET_STRAP_MATERIALS,
  GENDER,
} from "../constants.js";

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
const validateBrand = (brand) => {
  return WATCH_BRANDS.includes(brand);
};

const validateModelNumber = (modelNumber) => {
  const modelNumberRegex = /[A-Za-z0-9-]{10}/;
  return modelNumberRegex.test(modelNumber);
};

const validateModelName = (modelName) => {
  const modelNameRegex = /^[A-Za-z0-9\s-]+$/;
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
  const emailRegex = /^[a-z0-9.]{6,30}@gmail\.com$/;
  return emailRegex.test(email);
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

export function validateExcelData(data) {
  const validationErrors = [];

  if (data.length === 0) {
    validationErrors.push("Excel data is empty.");
  }

  for (const row of data) {
    const isPastDate = checkPastDate(row.date_of_validation, row.issue_date);
    const isFutureDate = checkFutureDate(row.expiry_date);

    if (!validateCaseSerial(row.case_serial)) {
      validationErrors.push("Invalid Case serial numbers.");
    }

    if (!validateMovementSerial(row.movement_serial)) {
      validationErrors.push("Invalid Movement serial numbers.");
    }

    if (!validateDial(row.dial)) {
      validationErrors.push("Invalid Dial serial numbers.");
    }

    if (!validateBraceletStrap(row.bracelet_strap)) {
      validationErrors.push("Invalid Bracelet or strap serial numbers.");
    }

    if (!validateCrownPusher(row.crown_pusher)) {
      validationErrors.push("Invalid Crown pusher serial numbers.");
    }

    if (!validateBrand(row.brand)) {
      validationErrors.push(`Invalid watch brands.`);
    }

    if (!validateModelNumber(row.model_no)) {
      validationErrors.push("Invalid Model number.");
    }

    if (!validateModelName(row.model_name)) {
      validationErrors.push("Invalid Model name.");
    }

    if (!validateMovement(row.movement)) {
      validationErrors.push(`Invalid watch movement.`);
    }

    if (!validateCaseMaterial(row.case_material)) {
      validationErrors.push(`Invalid watch case material.`);
    }

    if (!validateBraceletStrapMaterial(row.bracelet_strap_material)) {
      validationErrors.push(`Invalid watch bracelet/strap material.`);
    }

    if (!validateYOP(row.yop)) {
      validationErrors.push(`Invalid year of production.`);
    }

    if (!validateGender(row.gender)) {
      validationErrors.push("There are only 2 gender");
    }

    if (!validateEmail(row.user_email)) {
      validationErrors.push("Invalid email.");
    }

    if (!validateValidatedBy(row.validated_by)) {
      validationErrors.push("Invalid validator.");
    }

    if (!isPastDate) {
      validationErrors.push(
        "Date of validation and issue date cannot be current or future date."
      );
    }

    if (!isFutureDate) {
      validationErrors.push("Expiry date cannot be current or past date.");
    }

    // Date validations
    if (row.date_of_validation >= row.issue_date) {
      validationErrors.push(
        "The Date of Validation must occur before the Issue Date."
      );
    }

    if (row.date_of_validation >= row.expiry_date) {
      validationErrors.push(
        "The Date of Validation must occur before the Expiry Date."
      );
    }

    if (row.issue_date >= row.expiry_date) {
      validationErrors.push(
        "The Issue Date must occur before the Expiry Date."
      );
    }

    if (!validateRemarks(row.remarks)) {
      validationErrors.push(
        "Remarks must not exceed 255 characters in length."
      );
    }
  }
  return validationErrors;
}
