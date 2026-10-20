import axiosConifg from "../Config/axiosConifg";

const path = "/project";

export const getAll = async (queryParam = undefined) => {
    const url = path + "/get";
    try {
        const result = await axiosConifg.get(url, {
            params: queryParam
        });
        return result.data;
    } catch (err) {
        console.error(err);
        return { data: [] };
    }
};
