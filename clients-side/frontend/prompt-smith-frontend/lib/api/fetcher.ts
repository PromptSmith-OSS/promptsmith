import {PROXIED_API_URL} from "@/lib/constants";
import {useState} from 'react';
import useSWR from 'swr';
import {getCSRFToken} from "@/lib/auth/cookieUtils";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const defaultFetcher = (...args: any[]) => fetch(...args).then(res => res.json())


export const resourceFetcher = async (path: string, method: 'GET' | 'POST' | 'DELETE' | 'PUT' = 'GET', body?: unknown,) => {
  const response = await fetch(
    `${PROXIED_API_URL}/api/${path}`,
    {
      method: method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRFToken': method !== 'GET' ? getCSRFToken() || '' : '',
      },
      body: JSON.stringify(body)
    }
  )
  return response.json()
}


export const usePaginatedSWR = (endpoint: string, fetcher = defaultFetcher, initialOffset: number = 0, initialLimit: number = 50,) => {
  const [offset, setOffset] = useState(initialOffset);
  const [limit, setLimit] = useState(initialLimit);

  const {data, error, isLoading} = useSWR(`${endpoint}?offset=${offset}&limit=${limit}`, fetcher);

  return {
    data: data,
    error,
    isLoading,
    pagination: {
      offset,
      setOffset,
      limit,
      setLimit
    }
  };
}
