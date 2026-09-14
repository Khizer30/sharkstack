import { api } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";

export const teamMemberService = {
  list: () => api.get(ENDPOINTS.TEAM_MEMBERS.LIST)
};
