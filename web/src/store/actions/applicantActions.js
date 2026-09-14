import { createAsyncThunk } from "@reduxjs/toolkit";
import { applicantService } from "@/services/applicantService";

export const createApplicant = createAsyncThunk("applicants/create", (formData) => applicantService.create(formData));

export const fetchApplicants = createAsyncThunk("applicants/fetchAll", () => applicantService.list(), {
  condition: (_, { getState }) => getState().applicants.status === "idle"
});
