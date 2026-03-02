import api from "./axios";

export async function userCreateList(listName: string) {
    const response = await api.post("/users/lists", {name: listName});
    return response;
}