import { createAsyncThunk } from "@reduxjs/toolkit";
import { testimonialService } from "@/services/testimonialService";

export const fetchTestimonials = createAsyncThunk("testimonials/fetchAll", () => testimonialService.list(), {
  condition: (_, { getState }) => getState().testimonials.status === "idle"
});

export const createTestimonial = createAsyncThunk("testimonials/create", (testimonial) => testimonialService.create(testimonial));

export const deleteTestimonial = createAsyncThunk("testimonials/delete", (id) => testimonialService.remove(id));
