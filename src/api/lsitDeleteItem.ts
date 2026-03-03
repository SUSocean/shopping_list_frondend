import api from "./axios";
import type { ItemDto } from "@/types/item.types";

export async function listDeleteItem(listId: string, itemId: string) {
    const response = await api.patch<ItemDto>("/lists/" + listId + "/item/" + itemId +"/remove");
    return response.data;
}