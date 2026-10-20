import TokenClass from "../component/Service/AuthService";
import axiosConifg from "../Config/axiosConifg";
import { setAuthentication } from "../component/AuthGuard/AuthContext";

axiosConifg.interceptors.request.use((config) => {
    const token = TokenClass.getToken();
    console.log("Token : " + token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosConifg.interceptors.response.use(
    (config) => config,
    async (error) => {
        const { request, response } = error;
        if (response && response.status === 403) {
            if (request && request.url && request.url.includes("/refresh-token")) {
                TokenClass.clearToken();
                setAuthentication(false);
                return Promise.reject("Token Invalid");
            }
            else {
                if (request && request._retry === true) {
                    return Promise.reject("Token Invalid");
                }
                if (!request._retry) {
                    request._retry = true;
                }
                try {
                    const res = await axiosConifg.get("/auth/refresh-token");
                    if (res.data && res.data.token != null) {
                        TokenClass.setToken(res.data.token);
                        setAuthentication(true);
                        return axiosConifg(error.config);
                    }
                } catch (err) {
                    setAuthentication(false);
                    TokenClass.clearToken();
                }
            }
        }
        return Promise.reject(error);
    }
);
