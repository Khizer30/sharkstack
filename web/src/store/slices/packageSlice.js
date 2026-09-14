import { createSlice } from "@reduxjs/toolkit";
import { fetchPackages } from "@/store/actions/packageActions";

const initialState = {
  items: [],
  status: "idle",
  error: null
};

const packageSlice = createSlice({
  name: "packages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackages.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.packages;
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default packageSlice.reducer;
