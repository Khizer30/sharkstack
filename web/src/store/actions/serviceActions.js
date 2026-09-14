import { createAsyncThunk } from "@reduxjs/toolkit";
import { servicesService } from "@/services/servicesService";

export const fetchServices = createAsyncThunk("services/fetchAll", () => servicesService.list(), {
  condition: (_, { getState }) => getState().services.status === "idle"
});

export const createService = createAsyncThunk("services/create", (service) => servicesService.create(service));

export const deleteService = createAsyncThunk("services/delete", (id) => servicesService.remove(id));
