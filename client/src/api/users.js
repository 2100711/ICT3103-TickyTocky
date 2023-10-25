import { requestGet, requestPost, requestPut, requestDelete } from "../utils/request";
import {
    CREATE_USER_API,
    GET_ALL_USERS_API,
    GET_USER_API,
    UPDATE_USER_API,
    DELETE_USER_API,
} from "../constants";

export async function createUser(req) {
    return requestGet(CREATE_USER_API, { req });
}

export async function getAllUsers(req) {
    return requestGet(GET_ALL_USERS_API, { req });
}

export async function getUser(req) {
    return requestGet(GET_USER_API);
}

export async function updateUser(req) {
    return requestGet(UPDATE_USER_API, { req });
}

export async function deleteUser(req) {
    return requestGet(DELETE_USER_API, { req });
}