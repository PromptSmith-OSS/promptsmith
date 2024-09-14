import {NextRequest, NextResponse} from 'next/server'


export const revalidate = 5

export async function GET(req: NextRequest) {
  // fetch data from api
  const api_url = process.env.API_URL;
  const url = `${api_url}/api/prompt`
  const response = await fetch(url, {
    method: 'GET',
    headers: req.headers
  })
  if (response.status !== 200) {
    return NextResponse.json({message: 'Failed to fetch prompt'}, {status: 500})
  }
  const data = await response.json()
  return NextResponse.json(data)
}
