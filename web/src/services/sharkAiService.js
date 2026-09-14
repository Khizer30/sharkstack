import { api } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";

export const sharkAiService = {
  sendMessage: ({ message, sessionId }) => api.post(ENDPOINTS.CHAT.SEND_MESSAGE, sessionId ? { message, sessionId } : { message })
};
