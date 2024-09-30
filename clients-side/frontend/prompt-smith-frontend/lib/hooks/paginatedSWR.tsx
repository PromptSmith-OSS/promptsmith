'use client'
import {useState} from "react";
import useSWR from "swr";
import {defaultFetcher} from "@/lib/api/fetcher";

export const usePaginatedSWR = (endpoint: string, fetcher = defaultFetcher, initialOffset: number = 0, initialLimit: number = 50,) => {
  const [offset, setOffset] = useState(initialOffset);
  const [limit, setLimit] = useState(initialLimit);

  const {data, error, isLoading, mutate} = useSWR(`${endpoint}?offset=${offset}&limit=${limit}`, fetcher);

  return {
    data: data,
    error,
    isLoading,
    mutate,
    pagination: {
      offset,
      setOffset,
      limit,
      setLimit
    }
  };
}
