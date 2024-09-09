import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/session';

export async function GET() {
  deleteSession();

  return NextResponse.redirect('http://localhost:3000/login');
}



export async function POST() {
  deleteSession();

  return NextResponse.json({ message: 'Logged out successfully' });
}
