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
    return requestGet(GENERATE_OTP_API, { req });
}

export async function verifyOTP(req) {
    return requestGet(LOGOUT_API, { req });
}