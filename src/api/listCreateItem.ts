import api from "./axios";
import type { ItemDto } from "@/types/item.types";

export async function listCreateItem(listId: string, itemName: string) {
    const response = await api.post<ItemDto>("/lists/" + listId + "/item/add", {name: itemName});
    return response.data;
}