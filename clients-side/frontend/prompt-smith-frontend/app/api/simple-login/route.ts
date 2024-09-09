import {NextResponse} from 'next/server';
import {createSimpleAuthSession} from '@/lib/session';
import {SimpleSigninSchema} from '@/lib/definitions'

export async function POST(req: Request) {

  const formData = await req.formData();
  console.log('formData', formData);

  const bearerToken = formData.get('bearerToken') as string;


  const validatedFields = SimpleSigninSchema.safeParse({
    bearerToken,
  })

  if (!validatedFields.success) {
    return NextResponse.json({errors: validatedFields.error.flatten().fieldErrors});
  }

  await createSimpleAuthSession(bearerToken);
  return NextResponse.json({message: 'Logged in successfully'});
}