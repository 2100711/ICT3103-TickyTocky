// CLIENT URL
export const HOME_URL = "/";
export const ABOUT_US_URL = "/about-us";
export const LOGIN_URL = "/login";
export const REGISTER_URL = "/register";
export const ADMIN_URL = "/admin";

// SERVER URL
export const SERVER_URL = "http://localhost:3001";
export const CERTS_URL = `${SERVER_URL}/certs`;
export const USERS_URL = `${SERVER_URL}/users`;
export const AUTH_URL = `${SERVER_URL}/auth`;

// CERT API
export const CREATE_CERT_API = `${CERTS_URL}/create-cert`;
export const CREATE_CERTS_API = `${CERTS_URL}/create-certs`;
export const GET_ALL_CERTS_API = `${CERTS_URL}/all-certs`;
export const GET_CERT_API = `${CERTS_URL}/:certID`;
export const UPDATE_CERT_API = `${CERTS_URL}/:certID`;
export const DELETE_CERT_API = `${CERTS_URL}/`;

// USER API
export const CREATE_USER_API = `${USERS_URL}/`;
export const GET_ALL_USERS_API = `${USERS_URL}/all-users`;
export const GET_USER_API = `${USERS_URL}/:email`;
export const UPDATE_USER_API = `${USERS_URL}/`;
export const DELETE_USER_API = `${USERS_URL}/`;

//AUTH API
export const CHECK_AUTH_API = `${AUTH_URL}/check-auth`;
export const REGISTER_API = `${AUTH_URL}/register`;
export const LOGIN_API = `${AUTH_URL}/login`;
export const LOGOUT_API = `${AUTH_URL}/logout`;
export const GENERATE_OTP_API = `${AUTH_URL}/generate-otp`;
export const VERIFY_OTP_API = `${AUTH_URL}/verify-otp`;