import {NextResponse} from 'next/server';
import {createSimpleAuthSession} from '@/lib/session';
import {SimpleSigninSchema} from '@/lib/definitions'


/**
 * Simple key login
 * @param req
 * @constructor
 */
export async function POST(req: Request) {
  const formData = await req.formData();
  const bearerToken = formData.get('bearerToken') as string;
  const validatedFields = SimpleSigninSchema.safeParse({
    bearerToken,
  })

  if (!validatedFields.success) {
    return NextResponse.json({errors: validatedFields.error.flatten().fieldErrors});
  }

  // ping API protected health endpoint
  const api_url = process.env.API_URL;
  const url = `${api_url}/api/protected-ping`

  try {
    // to verify the bearer token is valid or not
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    });
    if (response.status !== 200) {
      return NextResponse.json({message: 'Failed to authenticate with API'});
    }
  } catch (error) {
    console.error('Failed to authenticate', url, error);
    return NextResponse.json({message: 'Failed to authenticate with API'});
  }


  await createSimpleAuthSession(bearerToken);
  return NextResponse.redirect('http://localhost:3000/dashboard');
}
