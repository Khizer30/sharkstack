import { createAsyncThunk } from "@reduxjs/toolkit";
import { portfolioService } from "@/services/portfolioService";

export const fetchPortfolios = createAsyncThunk("portfolios/fetchAll", () => portfolioService.list(), {
  condition: (_, { getState }) => getState().portfolios.status === "idle"
});

export const createPortfolio = createAsyncThunk("portfolios/create", (formData) => portfolioService.create(formData));

export const deletePortfolio = createAsyncThunk("portfolios/delete", (id) => portfolioService.remove(id));
