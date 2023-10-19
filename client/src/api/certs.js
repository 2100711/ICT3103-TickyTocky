import { requestGet, requestPost, requestPut, requestDelete } from "../utils/request";
import {
    CREATE_CERT_API,
    CREATE_CERTS_API,
    GET_ALL_CERTS_API,
    GET_CERT_API,
    UPDATE_CERT_API,
    DELETE_CERT_API,
} from "../constants";

export async function createCert(req) {
    return requestPost(CREATE_CERT_API, { req });
}

export async function createCerts(file) {
    const formData = new FormData();
    formData.append('file', file); // 'file' is the File object obtained from the file input field
    console.log("idkkkkkk", formData);
    return requestPost(CREATE_CERTS_API, formData, 'multipart/form-data');
}

export async function getAllCerts(req) {
    return requestGet(GET_ALL_CERTS_API, { req });
}

export async function getCert(req) {
    return requestGet(GET_CERT_API, { req });
}

export async function updateCert(req) {
    return requestPut(UPDATE_CERT_API, { req });
}

export async function deleteCert(req) {
    return requestDelete(DELETE_CERT_API, { req });
}