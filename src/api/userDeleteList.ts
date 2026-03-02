import api from "./axios";

export async function userDeleteList(id: string) {
    const response = await api.patch("/users/lists/remove/" + id);
    return response;
}