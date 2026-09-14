import { createSlice } from "@reduxjs/toolkit";
import { fetchTestimonials, createTestimonial, deleteTestimonial } from "@/store/actions/testimonialActions";

const initialState = {
  items: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const testimonialSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.testimonials;
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(createTestimonial.fulfilled, (state, action) => {
        state.items.push(action.payload.testimonial);
      })

      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        const deletedId = action.meta.arg;
        state.items = state.items.filter((t) => t.id !== deletedId);
      });
  }
});

export default testimonialSlice.reducer;
