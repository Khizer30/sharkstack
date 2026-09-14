import { createSlice } from "@reduxjs/toolkit";
import { createInternee, fetchInternees } from "@/store/actions/interneeActions";

const initialState = {
  items: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  lastInternee: null
};

const interneeSlice = createSlice({
  name: "internees",
  initialState,
  reducers: {
    resetInterneeStatus(state) {
      state.status = "idle";
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createInternee.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createInternee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lastInternee = action.payload.internee;
      })
      .addCase(createInternee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchInternees.fulfilled, (state, action) => {
        state.items = action.payload.internees ?? [];
      });
  }
});

export const { resetInterneeStatus } = interneeSlice.actions;
export default interneeSlice.reducer;
