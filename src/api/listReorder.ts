import api from "./axios";
import type { OpenedList } from "@/types/list.types";

export async function listReorder(list: OpenedList, firstItemPos: number, secondItemPos: number) {
    [list.items[firstItemPos], list.items[secondItemPos]] = [list.items[secondItemPos], list.items[firstItemPos]]
    const itemsOrder = []
    
    for(let i = 0; i < list.items.length; i++){
        itemsOrder.push(list.items[i].id)
    }

    const response = await api.patch("/lists/" + list.id + "/reorder" , {itemsOrder});
    return response.data;
}