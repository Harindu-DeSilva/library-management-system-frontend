import api from "./axios";

export const loginApi = (data) => api.post("/auth/login", data);

export const resetPasswordApi = (data) => api.patch("/auth/reset-password", data);

export const meApi = () => api.get("/auth/me");
