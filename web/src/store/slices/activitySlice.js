import { createSlice } from "@reduxjs/toolkit";
import { fetchActivities, createActivity, deleteActivity } from "@/store/actions/activityActions";

const initialState = {
  items: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const activitySlice = createSlice({
  name: "activities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.activities;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(createActivity.fulfilled, (state, action) => {
        state.items.push(action.payload.activity);
      })

      .addCase(deleteActivity.fulfilled, (state, action) => {
        const deletedId = action.meta.arg;
        state.items = state.items.filter((a) => a.id !== deletedId);
      });
  }
});

export default activitySlice.reducer;
