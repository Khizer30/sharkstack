import { createSlice } from "@reduxjs/toolkit";
import { fetchServices, createService, deleteService } from "@/store/actions/serviceActions";

const initialState = {
  items: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.services;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(createService.fulfilled, (state, action) => {
        state.items.push(action.payload.service);
      })

      .addCase(deleteService.fulfilled, (state, action) => {
        const deletedId = action.meta.arg;
        state.items = state.items.filter((s) => s.id !== deletedId);
      });
  }
});

export default serviceSlice.reducer;
