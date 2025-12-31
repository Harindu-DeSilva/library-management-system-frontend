import { useState, useEffect, useCallback } from "react";
import { 
  getCategoriesApi, 
  createCategoryApi,
  deleteCategoryApi,
  updateCategoryApi
} from "../api/categoryApi";

export default function useCategories() {

  const [categories, setCategories] = useState([]);

  // ---- Pagination ----
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);

  // ---- Library Filter ----
  const [selectedLibrary, setSelectedLibrary] = useState("");

  // ---- UI ----
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // ---- Create Form ----
  const [formData, setFormData] = useState({
    category_name: ""
  });


  // FETCH CATEGORIES
  const fetchCategories = useCallback(async (pageNum = 1) => {

    // Stop until library is selected
    if (!selectedLibrary) {
      setCategories([]);
      setTotalCategories(0);
      return;
    }

    try {
      setLoading(true);

      const res = await getCategoriesApi(selectedLibrary, pageNum);

      setCategories(res.data.categories || []);
      setTotalPages(res.data.pagination.totalPages);
      setTotalCategories(res.data.pagination.totalCategories);
      setPageSize(res.data.pagination.pageSize);

    } catch (err) {

      if (err.response?.status === 404) {
        setCategories([]);
        setTotalCategories(0);
      }

      console.error(err.response?.data || err.message);

    } finally {
      setLoading(false);
    }

  }, [selectedLibrary, pageSize]);


  // CREATE CATEGORY
  const createCategory = async () => {
    try {
      setActionLoading(true);

      await createCategoryApi(formData);

      await fetchCategories(page);

      return { success: true };

    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message
      };
    } finally {
      setActionLoading(false);
    }
  };


  // UPDATE CATEGORY
  const updateCategory = async (id) => {
    try {
      setActionLoading(true);

      await updateCategoryApi(id,formData);

      await fetchCategories(page);

      return { success: true };

    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message
      };
    } finally {
      setActionLoading(false);
    }
  };


  // DELETE CATEGORY
  const deleteCategory = async (id) => {
    try {
      setActionLoading(true);

      await deleteCategoryApi(id);
      await fetchCategories(page);

      return { success: true };

    } catch (err) {

      console.error(err.response?.data || err.message);

      return {
        success: false,
        message: err.response?.data?.message || err.message
      };

    } finally {
      setActionLoading(false);
    }
  };


  // INIT FETCH WHEN LIBRARY OR PAGE CHANGES
  useEffect(() => {
    fetchCategories(page);
  }, [page, selectedLibrary, fetchCategories]);


  return {
    categories,

    page,
    setPage,

    totalPages,
    totalCategories,
    pageSize,

    selectedLibrary,
    setSelectedLibrary,

    loading,
    actionLoading,

    formData,
    setFormData,

    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
}
