import {
  requestGet,
  requestPost,
  requestPut,
  requestDelete,
} from "../utils/request";
import { GET_AUTH_API, LOGIN_API, LOGOUT_API } from "../constants";

export async function getAuth() {
  return requestGet(GET_AUTH_API);
}

export async function postLogin(req) {
  return requestPost(LOGIN_API, { req });
}

export async function getLogout() {
  return requestGet(LOGOUT_API);
}

export async function test() {
  try {
    return requestGet("http://localhost:3001/test");
  } catch (error) {
    throw error;
  }
}
