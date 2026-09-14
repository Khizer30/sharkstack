import { createAsyncThunk } from "@reduxjs/toolkit";
import { packagesService } from "@/services/packagesService";

export const fetchPackages = createAsyncThunk("packages/fetchAll", () => packagesService.list(), {
  condition: (_, { getState }) => getState().packages.status === "idle"
});
