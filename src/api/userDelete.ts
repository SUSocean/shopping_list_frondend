import api from "./axios";

export async function userDelete() {
    const response = await api.delete("/users");
    return response.data;
}