import api from "./axios";
import type { OpenedList } from "@/types/list.types";

export async function listGet(listId: string) {
    const response = await api.get<OpenedList>("/lists/" + listId);
    return response.data;
}