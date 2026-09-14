import { createSlice } from "@reduxjs/toolkit";
import { createApplicant, fetchApplicants } from "@/store/actions/applicantActions";

const initialState = {
  items: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const applicantSlice = createSlice({
  name: "applicants",
  initialState,
  reducers: {
    resetApplicantStatus(state) {
      state.status = "idle";
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createApplicant.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createApplicant.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createApplicant.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchApplicants.fulfilled, (state, action) => {
        state.items = action.payload.applicants ?? [];
      });
  }
});

export const { resetApplicantStatus } = applicantSlice.actions;
export default applicantSlice.reducer;
