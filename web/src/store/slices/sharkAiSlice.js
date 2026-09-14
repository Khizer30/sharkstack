import { createSlice } from "@reduxjs/toolkit";
import { session } from "@/storage";
import { sendMessageToSharkAI } from "@/store/actions/sharkAiActions";

const SESSION_KEY = "sharkai_session_id";

const initialState = {
  sessionId: session.get(SESSION_KEY) ?? null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  lastReply: null,
  quickReplies: []
};

const sharkAiSlice = createSlice({
  name: "sharkAi",
  initialState,
  reducers: {
    resetSharkAiSession(state) {
      state.sessionId = null;
      state.lastReply = null;
      state.quickReplies = [];
      state.status = "idle";
      state.error = null;
      session.remove(SESSION_KEY);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageToSharkAI.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendMessageToSharkAI.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sessionId = action.payload.sessionId;
        state.lastReply = action.payload.reply;
        state.quickReplies = action.payload.quickReplies ?? [];
        session.set(SESSION_KEY, action.payload.sessionId);
      })
      .addCase(sendMessageToSharkAI.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export const { resetSharkAiSession } = sharkAiSlice.actions;
export default sharkAiSlice.reducer;
