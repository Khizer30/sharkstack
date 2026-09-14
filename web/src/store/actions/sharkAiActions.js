import { createAsyncThunk } from "@reduxjs/toolkit";
import { sharkAiService } from "@/services/sharkAiService";

export const sendMessageToSharkAI = createAsyncThunk("sharkAi/sendMessage", async (message, { getState }) => {
  const { sessionId } = getState().sharkAi;
  return sharkAiService.sendMessage({ message, sessionId });
});
