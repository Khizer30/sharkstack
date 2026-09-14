import { createSlice } from "@reduxjs/toolkit";
import { fetchJobs, fetchJobById, createJob, updateJob, deleteJob } from "@/store/actions/jobActions";

const initialState = {
  items: [],
  selected: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.jobs;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.selected = action.payload.job;
      })

      .addCase(createJob.fulfilled, (state, action) => {
        state.items.push(action.payload.job);
      })

      .addCase(updateJob.fulfilled, (state, action) => {
        const updated = action.payload.job;
        state.items = state.items.map((job) => (job.id === updated.id ? updated : job));
        if (state.selected?.id === updated.id) state.selected = updated;
      })

      .addCase(deleteJob.fulfilled, (state, action) => {
        const deletedId = action.meta.arg;
        state.items = state.items.filter((job) => job.id !== deletedId);
        if (state.selected?.id === deletedId) state.selected = null;
      });
  }
});

export default jobSlice.reducer;
