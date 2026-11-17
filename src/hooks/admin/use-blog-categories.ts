"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchBlogCategories } from "@/lib/api/admin/blog-categories";
import type { ApiError, Paging } from "@/lib/api/client";
import type { BlogCategory } from "@/types/admin/blog-category";

export function useBlogCategories(token: string, page: number, search: string) {
  const [version, setVersion] = useState(0);
  const requestKey = JSON.stringify([token, page, search, version]);
  const [state, setState] = useState<{
    key: string; categories: BlogCategory[]; paging: Paging | null; error: string | null; unauthorized: boolean;
  }>({ key: "", categories: [], paging: null, error: null, unauthorized: false });

  useEffect(() => {
    const controller = new AbortController();
    fetchBlogCategories(token, page, search, controller.signal).then((result) => {
      if (!controller.signal.aborted) setState({ key: requestKey, ...result, error: null, unauthorized: false });
    }).catch((error: ApiError) => {
      if (!controller.signal.aborted) setState({ key: requestKey, categories: [], paging: null,
        error: error.message || "Gagal memuat kategori blog.", unauthorized: error.status === 401 });
    });
    return () => controller.abort();
  }, [token, page, search, requestKey]);

  const reload = useCallback(() => setVersion((value) => value + 1), []);
  return { ...state, isLoading: state.key !== requestKey, reload };
}
