export const ENDPOINTS = {
  CHAT: {
    SEND_MESSAGE: "/chatbot/chat"
  },
  LEADS: {
    CREATE: "/leads",
    LIST: "/leads"
  },
  JOBS: {
    CREATE: "/jobs",
    LIST: "/jobs",
    GET_BY_ID: (id) => `/jobs/${id}`,
    UPDATE: (id) => `/jobs/${id}`,
    DELETE: (id) => `/jobs/${id}`
  },
  APPLICANTS: {
    CREATE: "/applicants",
    LIST: "/applicants"
  },
  INTERNEES: {
    CREATE: "/internees",
    LIST: "/internees",
    PAYMENT_STATUS: (id) => `/internees/${id}/payment-status`
  },
  TESTIMONIALS: {
    CREATE: "/testimonials",
    LIST: "/testimonials",
    DELETE: (id) => `/testimonials/${id}`
  },
  ACTIVITIES: {
    CREATE: "/activities",
    LIST: "/activities",
    DELETE: (id) => `/activities/${id}`
  },
  PORTFOLIOS: {
    CREATE: "/portfolios",
    LIST: "/portfolios",
    DELETE: (id) => `/portfolios/${id}`
  },
  SERVICES: {
    CREATE: "/services",
    LIST: "/services",
    DELETE: (id) => `/services/${id}`
  },
  TEAM_MEMBERS: {
    LIST: "/team-members"
  },
  PACKAGES: {
    LIST: "/packages"
  }
};
