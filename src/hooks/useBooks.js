import { useState, useEffect, useCallback } from "react";
import { createBookApi, deleteBooksApi, getAllBooksApi, getBooksByCategoryApi, updateBooksApi } from "../api/bookApi";

export default function useBooks() {

  const [books, setBooks] = useState([]);

  // ---- Pagination ----
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  // ---- CATEGORY Filter ----
  const [selectedCategory, setSelectedCategory] = useState("");

  // ---- Book Filter------
  const [selectedBook, setSelectedBook] = useState("");

  // ---- UI ----
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // ---- Create Form ----
  const [formData, setFormData] = useState({
    title: "",
    author:"",
    category_id: "",
    status:"",
    quantity: ""
  });


  // FETCH CATEGORIES
  const fetchBooks = useCallback(async (pageNum = 1) => {

    // Stop until library is selected
    if (!selectedCategory) {
      setBooks([]);
      setTotalBooks(0);
      return;
    }

    try {
      setLoading(true);

      const res = await getBooksByCategoryApi(selectedCategory, pageNum);

      setBooks(res.data.books || []);
      setTotalPages(res.data.pagination.totalPages);
      setTotalBooks(res.data.pagination.totalBooks);
      setPageSize(res.data.pagination.pageSize);

    } catch (err) {

      if (err.response?.status === 404) {
        setBooks([]);
        setTotalBooks(0);
      }

      console.error(err.response?.data || err.message);

    } finally {
      setLoading(false);
    }

  }, [selectedCategory, pageSize]);


  // CREATE BOOK
  const createBook = async () => {
    try {
      setActionLoading(true);

      const form = new FormData();
      form.append("title", formData.title);
      form.append("author", formData.author);
      form.append("category_id", formData.category_id);
      form.append("quantity", Number(formData.quantity));
      form.append("status", formData.status);
      if (formData.image) form.append("image", formData.image);

      await createBookApi(form);

      await fetchBooks(page);

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


  // UPDATE BOOK
  const updateBook = async (id) => {
    try {
      setActionLoading(true);

      const form = new FormData();
      form.append("title", formData.title);
      form.append("author", formData.author);
      form.append("category_id", formData.category_id);
      form.append("status", formData.status);
      
      console.log('s: ',formData.status);
      console.log('q: ',formData.quantity);
      form.append("quantity",formData.quantity);
      if (formData.image) form.append("image", formData.image);
      console.log(form.quantity);
      await updateBooksApi(id,form);

      await fetchBooks(page);

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


  // DELETE BOOK
  const deleteBook = async (id) => {
    try {
      setActionLoading(true);

      await deleteBooksApi(id);
      await fetchBooks(page);

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
    fetchBooks(page);
  }, [page, selectedCategory, fetchBooks]);


  return {
    books,

    page,
    setPage,

    totalPages,
    totalBooks,
    pageSize,

    selectedCategory,
    setSelectedCategory,

    selectedBook,
    setSelectedBook,

    loading,
    actionLoading,

    formData,
    setFormData,

    fetchBooks,
    createBook,
    updateBook,
    deleteBook
  };
}
