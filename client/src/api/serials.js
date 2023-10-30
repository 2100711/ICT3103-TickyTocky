import {
    requestGet,
} from "../utils/request";
import {
    CHECK_SERIAL,
} from "../constants";

export async function checkSerial(req) {
    return requestGet(CHECK_SERIAL, { req });
}