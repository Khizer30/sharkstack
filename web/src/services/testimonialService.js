import { api } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";

export const testimonialService = {
  list: () => api.get(ENDPOINTS.TESTIMONIALS.LIST),
  create: (testimonial) => api.post(ENDPOINTS.TESTIMONIALS.CREATE, testimonial),
  remove: (id) => api.delete(ENDPOINTS.TESTIMONIALS.DELETE(id))
};
