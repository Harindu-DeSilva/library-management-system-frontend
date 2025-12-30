import { useState, useEffect } from "react";
import { getCategoriesApi } from "../api/categoryApi";

export default function useCategories() {

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState(null);
  const [selectedLibrary, setSelectedLibrary] = useState("");

  useEffect(() => {

    // Do nothing until a library is selected
    if (!selectedLibrary) {
      setCategories([]);
      setTotalCategories(0);
      return;
    }

    const fetchCategories = async () => {
      setCatLoading(true);
      setCatError(null);

      try {
        const res = await getCategoriesApi(selectedLibrary, page);

        setCategories(res.data.categories || []);
        setTotalPages(res.data.pagination.totalPages);
        setTotalCategories(res.data.pagination.totalCategories);
        setPageSize(res.data.pagination.pageSize);

      } catch (err) {

        if (err.response?.status === 404) {
          setCategories([]);
          setTotalCategories(0);
          setCatError("No categories found for this library.");
        } else {
          setCatError("Failed to load categories");
        }

      } finally {
        setCatLoading(false);
      }
    };

    fetchCategories();

  }, [selectedLibrary, page]);  

  return {
    page,
    setPage,
    totalPages,
    totalCategories,
    pageSize,
    categories,
    catLoading,
    catError,
    selectedLibrary,
    setSelectedLibrary,
  };
}
