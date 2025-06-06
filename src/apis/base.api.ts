import { BASE_API_URL } from "@/config/app.config";
import Axios from "axios";

const baseAxios = Axios.create({
    timeout: 60000,
    baseURL: BASE_API_URL,
    headers: {
        "Content-type": "application/json",
    },
});

baseAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        const { message } = error?.response?.data || {};
        if (typeof message === "string") error.message = message;
        else if (Array.isArray(message)) error.message = message.join(", ");

        return Promise.reject(error);
    },
);


export default baseAxios;
