import { api } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";

export const leadService = {
  create: (lead) => {
    const payload = { ...lead };
    if (!payload.companyName?.trim()) delete payload.companyName;
    return api.post(ENDPOINTS.LEADS.CREATE, payload);
  }
};
