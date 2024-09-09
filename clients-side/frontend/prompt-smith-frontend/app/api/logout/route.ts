import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/session';

export async function GET() {
  deleteSession();

  return NextResponse.json({ message: 'Logged out successfully' });
}



export async function POST() {
  deleteSession();

  return NextResponse.json({ message: 'Logged out successfully' });
}
