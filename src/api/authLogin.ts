import api from "./axios";

export async function authLogin(username: string, password: string) {
    const response = await api.post("/auth/login", {    
        "username": username.trim(),
        "password": password.trim()
    });
    return response;
}