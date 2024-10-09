import axios from "axios";

export const SERVER_BASE_URL = "/api";

let api = axios.create({
    // Setting in the vite.config.ts
    baseURL: SERVER_BASE_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

export default api;
