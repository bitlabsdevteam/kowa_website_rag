import { NextResponse } from 'next/server';

import { checkAndConsumeRateLimit } from '@/lib/assistant/store';
import { sendContactEmail } from '@/lib/email/resend';

type ContactRequest = {
  companyName?: string;
  email?: string;
  query?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = ((await request.json().catch(() => null)) ?? null) as ContactRequest | null;
  if (!body) {
    return NextResponse.json({ error: 'invalid JSON payload' }, { status: 400 });
  }

  const companyName = body.companyName?.trim() ?? '';
  const email = body.email?.trim() ?? '';
  const query = body.query?.trim() ?? '';

  if (!companyName) {
    return NextResponse.json({ error: 'companyName is required' }, { status: 400 });
  }
  if (!email) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 });
  }
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: 'email is invalid' }, { status: 400 });
  }
  if (!query) {
    return NextResponse.json({ error: 'query is required' }, { status: 400 });
  }

  if (!checkAndConsumeRateLimit(`contact:${email}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests, please try again later' }, { status: 429 });
  }

  try {
    await sendContactEmail({ companyName, email, query });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to send message' },
      { status: 500 },
    );
  }
}
