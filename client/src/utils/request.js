async function requestHandler(api, body = {}, method = "GET", contentType = "application/json") {

  let requestOptions = {
    credentials: "include",
  };

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

  try {
    const response = await fetch(api, requestOptions);
    console.log(response.status);

    if (!response.ok) {
      // Handle different error status codes here
      if (response.status === 403) {
        // Redirect to the Forbidden page
        window.location.href = '/unauthorized';
      } else if (response.status === 500) {
        // Redirect to the Internal Server Error page
        window.location.href = '/servererror';
    } else if (response.status === 401) {
      } else {
        // Handle other error status codes here
        throw new Error("An error occurred.");
      }
    }

    const res = await response.json();
    return res;
  } catch (error) {
    // Handle network errors or other exceptions here
    throw error;
  }
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