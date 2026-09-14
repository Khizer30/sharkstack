import { api } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";

export const portfolioService = {
  list: () => api.get(ENDPOINTS.PORTFOLIOS.LIST),
  create: (formData) => api.postForm(ENDPOINTS.PORTFOLIOS.CREATE, formData),
  remove: (id) => api.delete(ENDPOINTS.PORTFOLIOS.DELETE(id))
};
