import { createAsyncThunk } from "@reduxjs/toolkit";
import { jobService } from "@/services/jobService";

export const fetchJobs = createAsyncThunk("jobs/fetchAll", () => jobService.list(), { condition: (_, { getState }) => getState().jobs.status === "idle" });

export const fetchJobById = createAsyncThunk("jobs/fetchById", (id) => jobService.getById(id));

export const createJob = createAsyncThunk("jobs/create", (job) => jobService.create(job));

export const updateJob = createAsyncThunk("jobs/update", ({ id, job }) => jobService.update(id, job));

export const deleteJob = createAsyncThunk("jobs/delete", (id) => jobService.remove(id));
