
import api from "./axios";

export const createLibraryApi = (data) => api.post("/superAdmin/library", data);

export const getLibrariesApi = () => api.get(`/superAdmin/library`);

export const getLibraryByIdApi = (id) => api.get(`/superAdmin/library/${id}`);

export const updateLibraryApi = (id,data) => api.patch(`/superAdmin/library/${id}`, data);

export const deleteLibraryApi = (id) => api.delete(`/superAdmin/library/${id}`);