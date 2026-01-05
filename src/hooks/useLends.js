import { useState, useEffect, useCallback } from "react";
import { lendBookApi } from "../api/lendApi";
import { getBooksByCategoryApi } from "../api/bookApi";

export default function useLends() {

  // ---- UI ----
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // ---- Create Form ----
  const [formLendingData, setFormLendingData] = useState({
    category_id: "",
    library_id:"",
    quantity: "",
    lend_user_id:"",
    due_date: ""
  });


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

    formLendingData,
    setFormLendingData,
    lendBook,
  };
}
