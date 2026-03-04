import api from "./axios";

export async function listAddUser(listId: string, username: string) {
    const response = await api.patch("/lists/" + listId + "/users/add", {username});
    return response;
}