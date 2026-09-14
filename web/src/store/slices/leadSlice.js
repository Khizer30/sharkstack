import { createSlice } from "@reduxjs/toolkit";
import { createLead } from "@/store/actions/leadActions";

const initialState = {
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  lastLead: null
};

const leadSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    resetLeadStatus(state) {
      state.status = "idle";
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createLead.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lastLead = action.payload.lead;
      })
      .addCase(createLead.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export const { resetLeadStatus } = leadSlice.actions;
export default leadSlice.reducer;
