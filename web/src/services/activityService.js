import { api } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";

export const activityService = {
  list: () => api.get(ENDPOINTS.ACTIVITIES.LIST),
  create: (formData) => api.postForm(ENDPOINTS.ACTIVITIES.CREATE, formData),
  remove: (id) => api.delete(ENDPOINTS.ACTIVITIES.DELETE(id))
};
