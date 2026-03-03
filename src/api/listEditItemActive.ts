import api from "./axios";
import type { ItemDto } from "@/types/item.types";

export async function listEditItemActive(listId: string, item: ItemDto) {
    item.active = !item.active
    const response = await api.patch<ItemDto>("/lists/" + listId + "/item/" + item.id + "/edit", item);
    return response.data;
}