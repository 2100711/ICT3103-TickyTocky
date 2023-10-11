async function requestHandler(
    api,
    body = {},
    method = "GET",
    contentType = "application/json"
) {
    let requestOptions = {};

    if (method !== "GET" && contentType === "application/json") {
        requestOptions = {
            method: method,
            credentials: "include",
            mode: "cors",
            headers: {
                "Content-Type": contentType,
            },
            body: JSON.stringify(body.req),
        };
    }
    if (contentType === "multipart/form-data") {
        requestOptions = {
            method: method,
            credentials: "include",
            mode: "cors",
            body: body.req,
        };
    }
    const response = await fetch(api, requestOptions);
    const res = await response.json();
    if (!response.ok) {
        throw new Error(res.error);
    }
    return res;
}

export async function requestGet(api) {
    return requestHandler(api);
}

export async function requestPost(api, body, contentType) {
    return requestHandler(api, body, "POST", contentType);
}

export async function requestPut(api, body) {
    return requestHandler(api, { req: body }, "PUT");
}

export async function requestDelete(api, body) {
    return requestHandler(api, body, "DELETE");
}