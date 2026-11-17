"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchBlogTags } from "@/lib/api/admin/blog-tags";
import type { ApiError, Paging } from "@/lib/api/client";
import type { BlogTag } from "@/types/admin/blog-tag";

export function useBlogTags(token: string, page: number, search: string) {
  const [version, setVersion] = useState(0);
  const requestKey = JSON.stringify([token, page, search, version]);
  const [state, setState] = useState<{
    key: string; tags: BlogTag[]; paging: Paging | null; error: string | null; unauthorized: boolean;
  }>({ key: "", tags: [], paging: null, error: null, unauthorized: false });

  useEffect(() => {
    const controller = new AbortController();
    fetchBlogTags(token, page, search, controller.signal).then((result) => {
      if (!controller.signal.aborted) setState({ key: requestKey, ...result, error: null, unauthorized: false });
    }).catch((error: ApiError) => {
      if (!controller.signal.aborted) setState({ key: requestKey, tags: [], paging: null,
        error: error.message || "Gagal memuat tag blog.", unauthorized: error.status === 401 });
    });
    return () => controller.abort();
  }, [token, page, search, requestKey]);

  const reload = useCallback(() => setVersion((value) => value + 1), []);
  return { ...state, isLoading: state.key !== requestKey, reload };
}
