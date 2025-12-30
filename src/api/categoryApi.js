
import api from "./axios";

export const createCategoryApi = (data) => api.post("/category-management/category", data);

export const getCategoriesApi = (id, page = 1, limit = 10) => api.get(`/category-management/category/${id}?page=${page}&limit=${limit}`);

export const updateCategoryApi = (id,data) => api.patch(`/category-management/category/${id}`, data);

export const deleteCategoryApi = (id) => api.delete(`/category-management/category/${id}`);