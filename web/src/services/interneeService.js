import { api } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";

export const interneeService = {
  create: (internee) => {
    // If resume file exists, use FormData
    if (internee.resume instanceof File) {
      const formData = new FormData();
      formData.append("name", internee.name);
      formData.append("email", internee.email);
      formData.append("phone", internee.phone);
      formData.append("about", internee.about);
      formData.append("resume", internee.resume);
      return api.postForm(ENDPOINTS.INTERNEES.CREATE, formData);
    }
    // Otherwise use JSON
    return api.post(ENDPOINTS.INTERNEES.CREATE, internee);
  },
  list: () => api.get(ENDPOINTS.INTERNEES.LIST)
};
