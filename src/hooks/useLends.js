import { useState, useEffect, useCallback } from "react";
import {
  fetchAllLendBooksApi,
  lendBookApi,
  updateLendRecordApi
} from "../api/lendApi";

export default function useLends(page = 1, initialPageSize = 10) {

  // ---------- UI STATES ----------
  const [lendLoading, setLendLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [lendError, setLendError] = useState(null);

  // ---------- DATA ----------
  const [lendBooks, setLendBooks] = useState([]);
  const [totalLendPages, setTotalLendPages] = useState(1);
  const [totalLends, setTotalLends] = useState(0);
  const [lendPageSize, setLendPageSize] = useState(initialPageSize);

  // 🔍 SEARCH
  const [search, setSearch] = useState("");

  // ---------- FORM ----------
  const [formLendingData, setFormLendingData] = useState({
    category_id: "",
    library_id: "",
    quantity: "",
    lend_user_id: "",
    due_date: "",
    return_date: "",
    book_id: ""
  });

  // ---------- FETCH LENDS ----------
  const fetchLends = useCallback(async () => {
    setLendLoading(true);
    setLendError(null);

    try {
      const res = await fetchAllLendBooksApi({
        page,
        lendPageSize,
        search
      });

      setLendBooks(res.data.result.lends || []);
      setTotalLendPages(res.data.result.pagination.totalPages);
      setTotalLends(res.data.result.pagination.totalLendRecords);
      setLendPageSize(res.data.result.pagination.pageSize);

    } catch (err) {
      console.error(err);
      setLendError("Failed to load lending records");
    } finally {
      setLendLoading(false);
    }
  }, [page, lendPageSize, search]);

  // 🔥 AUTO FETCH
  useEffect(() => {
    fetchLends();
  }, [fetchLends]);

  // ---------- LEND BOOK ----------
  const lendBook = async (bookId) => {
    try {
      setActionLoading(true);

      await lendBookApi(bookId, {
        category_id: formLendingData.category_id,
        lend_user_id: formLendingData.lend_user_id,
        library_id: formLendingData.library_id,
        quantity: Number(formLendingData.quantity),
        due_date: formLendingData.due_date
      });

      await fetchLends();
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

  // ---------- UPDATE LEND ----------
  const updateLend = async (lendId) => {
    try {
      setActionLoading(true);

      await updateLendRecordApi(lendId, formLendingData);
      await fetchLends();

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

  // ---------- RETURN ----------
  return {
    lendBooks,
    lendLoading,
    lendError,
    totalLendPages,
    totalLends,
    lendPageSize,

    search,
    setSearch,

    actionLoading,
    formLendingData,
    setFormLendingData,

    lendBook,
    updateLend,

    refetchLends: fetchLends
  };
}
