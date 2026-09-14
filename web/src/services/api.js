const BASE_URL = import.meta.env.VITE_API_URL ?? "";

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const isFormData = options.body instanceof FormData;
  const res = await fetch(url, {
    ...options,
    headers: isFormData ? options.headers : { "Content-Type": "application/json", ...options.headers }
  });
  if (!res.ok) {
    console.error(`[api] ${options.method ?? "GET"} ${url} failed with ${res.status}`);
    throw new Error(`API error ${res.status}`);
  }
  return res.json();
}

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, body) => request(endpoint, { method: "POST", body: JSON.stringify(body) }),
  postForm: (endpoint, formData) => request(endpoint, { method: "POST", body: formData }),
  put: (endpoint, body) => request(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  patch: (endpoint, body) => request(endpoint, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" })
};
