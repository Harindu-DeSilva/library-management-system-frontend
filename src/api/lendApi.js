
import api from "./axios";

export const lendBookApi = (id,data) => api.post(`/lending-book/lending/${id}`, data, {headers: { "Content-Type": "multipart/form-data" }});