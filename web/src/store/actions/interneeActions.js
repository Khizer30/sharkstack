import { createAsyncThunk } from "@reduxjs/toolkit";
import { interneeService } from "@/services/interneeService";

export const createInternee = createAsyncThunk("internees/create", (internee) => interneeService.create(internee));

export const fetchInternees = createAsyncThunk("internees/fetchAll", () => interneeService.list(), {
  condition: (_, { getState }) => getState().internees.status === "idle"
});
