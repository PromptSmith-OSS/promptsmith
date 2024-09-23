import {PROXIED_API_URL} from "@/lib/constants";


export const fetchResource = async (path: string, method: 'GET' | 'POST' | 'DELETE' | 'PUT' = 'GET') => {
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
  console.log(response.status, response.statusText)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}
