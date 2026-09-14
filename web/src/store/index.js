import { configureStore } from "@reduxjs/toolkit";
import activityReducer from "@/store/slices/activitySlice";
import applicantReducer from "@/store/slices/applicantSlice";
import interneeReducer from "@/store/slices/interneeSlice";
import jobReducer from "@/store/slices/jobSlice";
import leadReducer from "@/store/slices/leadSlice";
import packageReducer from "@/store/slices/packageSlice";
import portfolioReducer from "@/store/slices/portfolioSlice";
import serviceReducer from "@/store/slices/serviceSlice";
import sharkAiReducer from "@/store/slices/sharkAiSlice";
import teamMemberReducer from "@/store/slices/teamMemberSlice";
import testimonialReducer from "@/store/slices/testimonialSlice";

export const store = configureStore({
  reducer: {
    sharkAi: sharkAiReducer,
    leads: leadReducer,
    jobs: jobReducer,
    applicants: applicantReducer,
    internees: interneeReducer,
    testimonials: testimonialReducer,
    activities: activityReducer,
    packages: packageReducer,
    portfolios: portfolioReducer,
    services: serviceReducer,
    teamMembers: teamMemberReducer
  }
});
