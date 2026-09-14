import { api } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";

export const jobService = {
  list: () => api.get(ENDPOINTS.JOBS.LIST),
  getById: (id) => api.get(ENDPOINTS.JOBS.GET_BY_ID(id)),
  create: (job) => api.post(ENDPOINTS.JOBS.CREATE, job),
  update: (id, job) => api.patch(ENDPOINTS.JOBS.UPDATE(id), job),
  remove: (id) => api.delete(ENDPOINTS.JOBS.DELETE(id))
};
