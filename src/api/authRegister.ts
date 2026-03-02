import api from "./axios";

export async function authRegister(username: string, password: string) {
    const response = await api.post("/users", {
        username,
        password
    });
    return response;
}