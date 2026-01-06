import { useState, useEffect, useCallback } from "react";
import { fetchAllLendBooksApi, lendBookApi } from "../api/lendApi";
import { getBooksByCategoryApi } from "../api/bookApi";

export default function useLends(page = 1, pageSize = 10) {

  // ---- UI ----
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [lendBooks, setLendBooks] = useState([]);
  const [lendLoading, setLendLoading] = useState(false);
  const [lendError, setLendError] = useState(null);
  const [totalLendPages, setTotalLendPages] = useState(1);
  const [totalLends, setTotalLends] = useState(0);
  const [lendPageSize, setLendPageSize] = useState(pageSize);


  // ---- Create Form ----
  const [formLendingData, setFormLendingData] = useState({
    category_id: "",
    library_id:"",
    quantity: "",
    lend_user_id:"",
    due_date: ""
  });


   useEffect(() => {
    const fetchLends = async () => {
      setLendLoading(true);
      setLendError(null);
      try {
        const res = await fetchAllLendBooksApi(page, lendPageSize);
        setLendBooks(res.data.result.lends || []);
        setTotalLendPages(res.data.result.pagination.totalPages);
        setTotalLends(res.data.result.pagination.totalLendRecords);
        setLendPageSize(res.data.result.pagination.pageSize);
      } catch (err) {
        setLendError("Failed to load lends");
      } finally {
        setLendLoading(false);
      }
    };
    fetchLends();
  }, [page, lendPageSize]); 


  // LEND BOOK
  const lendBook = async (id) => {
    try {
      setActionLoading(true);


      await lendBookApi(id, {
      category_id: formLendingData.category_id,
      lend_user_id: formLendingData.lend_user_id,
      library_id: formLendingData.library_id,
      quantity: Number(formLendingData.quantity),
      due_date: formLendingData.due_date,
    });



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


  return {

    loading,
    actionLoading,

    lendBooks,
    lendLoading,
    lendError,
    totalLendPages,
    totalLends,
    lendPageSize,
    formLendingData,
    setFormLendingData,
    lendBook,
  };
}
