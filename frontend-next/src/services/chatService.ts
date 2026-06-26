import { post } from "./apiClient";
import type { ChatRequest, ChatResponse } from "@/types/chat";

export async function sendChatMessage(
  payload: ChatRequest,
  token: string,
): Promise<ChatResponse> {
  return post<ChatResponse>("/api/v1/chat/message", payload, token);
}
