import { useState, useEffect, useCallback } from "react";
import { getLibrariesApi } from "../api/libraryApi";

export default function useLibraries(page = 1, search = "") {

  const [libraries, setLibraries] = useState([]);
  const [libLoading, setLibLoading] = useState(false);
  const [libError, setLibError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLibraries, setTotalLibraries] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const fetchLibraries = useCallback(async () => {
    setLibLoading(true);
    setLibError(null);

    try {
      const res = await getLibrariesApi({
        page,
        limit: pageSize,
        search
      });

      setLibraries(res.data.libraries || []);
      setTotalPages(res.data.pagination.totalPages);
      setTotalLibraries(res.data.pagination.totalLibraries);
      setPageSize(res.data.pagination.pageSize);

    } catch (err) {
      console.error(err);
      setLibError("Failed to load libraries");
    } finally {
      setLibLoading(false);
    }
  }, [page, search, pageSize]);

  
  useEffect(() => {
    fetchLibraries();
  }, [fetchLibraries]);

  return {
    libraries,
    libLoading,
    libError,
    totalPages,
    totalLibraries,
    pageSize,
    refetchLibraries: fetchLibraries
  };
}
