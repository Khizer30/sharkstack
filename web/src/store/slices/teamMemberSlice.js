import { createSlice } from "@reduxjs/toolkit";
import { fetchTeamMembers } from "@/store/actions/teamMemberActions";

const initialState = {
  items: [],
  status: "idle",
  error: null
};

const teamMemberSlice = createSlice({
  name: "teamMembers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.teamMembers;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default teamMemberSlice.reducer;
