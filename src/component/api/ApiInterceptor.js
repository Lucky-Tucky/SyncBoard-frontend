import axios from "axios";
import TokenClass from "../Service/AuthService";
import axiosConifg from "../../Config/axiosConifg";

axios.interceptors.request.use((config) => {
    const token = TokenClass.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
});

axios.interceptors.response.use(
    (config) => config,
    async (error) => {
        const { request, response } = error;
        if (response.status === 403 || response.status === 401) {
            if (request.url.includes("/refresh-token")) {
                TokenClass.clearToken();
                window.location.href = "/";
                return Promise.reject("Token Invalid");
            }
            else {
                if (request._retry == true) {
                    return Promise.reject("Token Invalid");
                }
                request._retry = true;
                try {
                    const response = await axiosConifg.get("/auth/refresh-token");
                    if (response.data.token != null) {
                        TokenClass.setToken(response.token);
                        return axios(error.config);
                    }
                } catch (error) {
                    window.location.href = "/";
                    TokenClass.clearToken();
                }

            }
        }
        return Promise.reject(error);
    }
)