
import api from "./axios";

export const createUserApi = (data) => api.post("/user-management/users", data);

export const getUsersApi = (page = 1, limit = 10, search = "") => api.get(`/user-management/users?page=${page}&limit=${limit}&search=${search}`);

export const getUserByIdApi = (id) => api.get(`/user-management/users/${id}`);

export const updateUserApi = (id,data) => api.patch(`/user-management/users/${id}`, data);

export const deleteUserApi = (id) => api.delete(`/user-management/users/${id}`);