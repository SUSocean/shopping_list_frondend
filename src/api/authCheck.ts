import api from "./axios";

export async function checkAuth() {
    const response = await api.get("/auth/check");
    return response.status == 200;
}