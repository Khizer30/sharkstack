import { api } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";

export const interneeService = {
  create: (internee) => api.post(ENDPOINTS.INTERNEES.CREATE, internee),
  list: () => api.get(ENDPOINTS.INTERNEES.LIST)
};
