import { createAsyncThunk } from "@reduxjs/toolkit";
import { leadService } from "@/services/leadService";

export const createLead = createAsyncThunk("leads/create", async (lead) => leadService.create(lead));
