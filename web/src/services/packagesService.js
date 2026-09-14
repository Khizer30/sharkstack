import { api } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";

export const packagesService = {
  list: () => api.get(ENDPOINTS.PACKAGES.LIST)
};
