import axiosConifg from "../Config/axiosConifg";
import TokenClass from "../component/Service/AuthService";


const path = "/auth";

export const signUpSubmit = async (form) => {
    const url = path + "/signup";
    try {
        const response = await axiosConifg.post(url, form);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

export const loginSubmit = async (form) => {
    const url = path + "/login";
    try {
        const response = await axiosConifg.post(url, form);
        if (response?.data?.token != null) {
            TokenClass.setToken(response.data.token);
        }
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}