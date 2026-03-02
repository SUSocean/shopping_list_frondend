import api from "./axios";

export async function authLogout() {
    const response = await api.post("/auth/logout");
    return response;
}