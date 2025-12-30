import { useState, useEffect } from "react";
import { getLibrariesApi } from "../api/libraryApi";

export default function useLibraries() {

  const [libraries, setLibraries] = useState([]);
  const [libLoading, setLibLoading] = useState(false);
  const [libError, setLibError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLibraries, setTotalLibraries] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchLibraries = async () => {
      setLibLoading(true);
      setLibError(null);

      try {
        const res = await getLibrariesApi();
        setLibraries(res.data.libraries || []);
        setTotalPages(res.data.pagination.totalPages);
        setTotalLibraries(res.data.pagination.totalLibraries);
        setPageSize(res.data.pagination.pageSize);
      } catch (err) {
        setLibError("Failed to load libraries");
      } finally {
        setLibLoading(false);
      }
    };

    fetchLibraries();
  }, []);

  return { libraries, libLoading, libError, totalPages, totalLibraries, pageSize };
}
