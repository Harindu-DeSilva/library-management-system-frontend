
import api from "./axios";

export const createBookApi = (data) => api.post("/book-management/books", data,{headers: { "Content-Type": "multipart/form-data" }});

export const getAllBooksApi = (page = 1, limit = 10) => api.get(`/book-management/books?page=${page}&limit=${limit}`);

export const getBooksByCategoryApi = (id, page = 1, limit = 10) => api.get(`/book-management/books/${id}?page=${page}&limit=${limit}`);

export const updateBooksApi = (id,data) => api.patch(`/book-management/books/${id}`, data);

export const deleteBooksApi = (id) => api.delete(`/book-management/books/${id}`);