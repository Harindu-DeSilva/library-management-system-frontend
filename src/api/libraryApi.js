
import api from "./axios";

export const createLibraryApi = (data) => api.post("/superAdmin/library", data);

export const getLibrariesApi = ({page = 1,limit = 10,search = ""}) => {
  return api.get("/superAdmin/library", {
    params: {
      page,
      limit,
      search
    }
  });
};


export const getLibraryByIdApi = (id) => api.get(`/superAdmin/library/${id}`);

export const updateLibraryApi = (id,data) => api.patch(`/superAdmin/library/${id}`, data);

export const deleteLibraryApi = (id) => api.delete(`/superAdmin/library/${id}`);