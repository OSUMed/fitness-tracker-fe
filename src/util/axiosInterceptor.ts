import axios from "axios";

const axiosInstance = axios.create({
  withCredentials: true,
});

// Request interceptor to inject the token before each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log(
        "Request Interceptor: Authorization header set with token.",
        token
      );
    } else {
      console.log(
        "Request Interceptor: No access token found in local storage."
      );
    }
    return config;
  },
  (error) => {
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh, custom headers, and 401 errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Check for token refresh in headers
    const newToken = response.headers["authorization-refresh"];
    console.log("axiosInstance response.headers are: ", response.headers);
    console.log(
      `Response from URL: ${response.config.url} with method: ${response.config.method}`
    );
    console.log("Response headers:", response.headers);
    if (newToken) {
      localStorage.setItem("accessToken", newToken);
      console.log(
        "Response Interceptor: New token stored in local storage.",
        newToken
      );
    } else {
      console.log("Response Interceptor: No new token provided in headers.");
    }

    // Check for other custom headers
    const refreshTokenExpired =
      response.headers["refresh-token-expired"] === "true";
    if (refreshTokenExpired) {
      console.log(
        "Response Interceptor: Refresh token expired, redirecting to sign in."
      );
      localStorage.clear();
      window.location.href = "/signin";
    }

    return response;
  },
  (error) => {
    // Check for 401 Unauthorized error
    if (error.response && error.response.status === 401) {
      console.log(
        "Response Interceptor: 401 Unauthorized error, redirecting to sign in."
      );
      localStorage.clear();
      window.location.href = "/signin";
    } else {
      console.error("Response Interceptor Error:", error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
