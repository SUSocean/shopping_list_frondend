import api from "./axios";
import type { ItemDto } from "@/types/item.types";

export async function listEditItemName(listId: string, item: ItemDto, newName: string) {
    item.name=newName
    const response = await api.patch<ItemDto>("/lists/" + listId + "/item/" + item.id + "/edit", item);
    return response.data;
}