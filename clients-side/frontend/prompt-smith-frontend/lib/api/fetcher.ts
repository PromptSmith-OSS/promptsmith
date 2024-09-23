import {PROXIED_API_URL} from "@/lib/constants";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const fetcher = (...args: any[]) => fetch(...args).then(res => res.json())


export const resourceFetcher = async (path: string, method: 'GET' | 'POST' | 'DELETE' | 'PUT' = 'GET') => {
  const response = await fetch(
    `${PROXIED_API_URL}/api/${path}`,
    {
      method: method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    }
  )
  return response.json()
}
