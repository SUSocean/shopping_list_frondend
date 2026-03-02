import api from "./axios";
import type { UserDto } from "@/types/user.types";

export async function getMe() {
    const response = await api.get<UserDto>("/users/me");
    return response.data;
}