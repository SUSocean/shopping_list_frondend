import { Q } from "node_modules/react-router/dist/development/index-react-server-client-MKTlCGL3.d.mts";
import api from "./axios";
import type { ItemDto } from "@/types/item.types";

export async function listReorder(list: OpenedList, firstItem: ItemDto, secondItem: ItemDto) {


    // const response = await api.patch<ItemDto>("/lists/" + listId + "/item/" + item.id + "/edit", item);
    return response.data;
}