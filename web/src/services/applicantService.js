import { api } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";

export const applicantService = {
  create: (formData) => api.postForm(ENDPOINTS.APPLICANTS.CREATE, formData),
  list: () => api.get(ENDPOINTS.APPLICANTS.LIST)
};
