import { apiRequest } from "./client";

interface AiChatResponse {
  reply: string;
}

export function sendAiMessage(message: string): Promise<AiChatResponse> {
  return apiRequest<AiChatResponse>("/ai/chat", { method: "POST", body: { message }, auth: true });
}
