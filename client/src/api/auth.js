import { requestGet, requestPost, requestPut, requestDelete } from "../utils/request";
import {
    GET_AUTH_API,
    LOGIN_API,
    LOGOUT_API,
} from "../constants";

export async function getAuth() {
    return requestGet(GET_AUTH_API);
}

export async function login(req) {
    return requestPost(LOGIN_API, { req });
}

export async function logout() {
    return requestGet(LOGOUT_API);
}