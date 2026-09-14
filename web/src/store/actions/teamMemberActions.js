import { createAsyncThunk } from "@reduxjs/toolkit";
import { teamMemberService } from "@/services/teamMemberService";

export const fetchTeamMembers = createAsyncThunk("teamMembers/fetchAll", () => teamMemberService.list(), {
  condition: (_, { getState }) => getState().teamMembers.status === "idle"
});
