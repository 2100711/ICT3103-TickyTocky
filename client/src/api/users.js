import { requestGet, requestPost, requestPut, requestDelete } from "../utils/request";
import {
    GET_ALL_USERS_API,
} from "../constants";

export async function getAllUsers() {
    return requestGet(GET_ALL_USERS_API);
}