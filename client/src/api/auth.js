import {
  requestGet,
  requestPost,
  requestPut,
  requestDelete,
} from "../utils/request";
import {
  CHECK_AUTH_API,
  REGISTER_API,
  LOGIN_API,
  LOGOUT_API,
  GENERATE_OTP_API,
  VERIFY_OTP_API,
  OTP_TIME_LEFT,
  RESET_PASSWORD_API,
} from "../constants";

export async function checkAuth(req) {
  return requestGet(CHECK_AUTH_API, { req });
}

export async function register(req) {
  return requestPost(REGISTER_API, { req });
}

export async function postLogin(req) {
  return requestPost(LOGIN_API, { req });
}

export async function postLogout() {
  return requestGet(LOGOUT_API);
}

export async function generateOTP(req) {
  return requestPost(GENERATE_OTP_API, { req });
}

export async function verifyOTP(req) {
  return requestPost(VERIFY_OTP_API, { req });
}

export async function timeLeft(req) {
  return requestPost(OTP_TIME_LEFT, { req });
}

export async function resetPassword(req) {
  return requestPost(RESET_PASSWORD_API, { req });
}
