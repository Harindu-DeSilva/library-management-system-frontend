
import api from "./axios";

export const lendBookApi = (id,data) => api.post(`/lending-book/lending/${id}`, data);

export const fetchAllLendBooksApi = ({page = 1,limit = 10,search = ""}) => {
  return api.get(`/lending-book/lending`, {
    params: {
      page,
      limit,
      search
    }
  });
};

export const updateLendRecordApi = (id,data) => api.patch(`/lending-book/update-lending/lending/${id}`, data);
export const downloadLendRecordsApi = () => api.get("/lending-book/lending/export", { responseType: "blob" });