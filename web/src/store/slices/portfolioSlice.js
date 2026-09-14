import { createSlice } from "@reduxjs/toolkit";
import { fetchPortfolios, createPortfolio, deletePortfolio } from "@/store/actions/portfolioActions";

const initialState = {
  items: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const portfolioSlice = createSlice({
  name: "portfolios",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolios.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPortfolios.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.portfolios;
      })
      .addCase(fetchPortfolios.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(createPortfolio.fulfilled, (state, action) => {
        state.items.push(action.payload.portfolio);
      })

      .addCase(deletePortfolio.fulfilled, (state, action) => {
        const deletedId = action.meta.arg;
        state.items = state.items.filter((p) => p.id !== deletedId);
      });
  }
});

export default portfolioSlice.reducer;
