import { createAsyncThunk } from "@reduxjs/toolkit";
import { activityService } from "@/services/activityService";

export const fetchActivities = createAsyncThunk("activities/fetchAll", () => activityService.list(), {
  condition: (_, { getState }) => getState().activities.status === "idle"
});

export const createActivity = createAsyncThunk("activities/create", (formData) => activityService.create(formData));

export const deleteActivity = createAsyncThunk("activities/delete", (id) => activityService.remove(id));
