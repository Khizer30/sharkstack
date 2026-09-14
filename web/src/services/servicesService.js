import { api } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";

export const servicesService = {
  list: () => api.get(ENDPOINTS.SERVICES.LIST),
  create: (service) => api.post(ENDPOINTS.SERVICES.CREATE, service),
  remove: (id) => api.delete(ENDPOINTS.SERVICES.DELETE(id))
};
