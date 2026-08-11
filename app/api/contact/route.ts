import { NextResponse } from "next/server";

export const runtime = "nodejs";

const LIMIT = 5, WINDOW = 10 * 60_000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) for (const [k, v] of hits) if (!v.some(t => now - t < WINDOW)) hits.delete(k);
  return recent.length > LIMIT;
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

/** Sends through Resend when configured; otherwise reports the message as undelivered. */
async function deliver(payload: { name: string; email: string; subject: string; message: string }) {
  const key = process.env.RESEND_API_KEY, to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) { console.info("[contact] no mail provider configured — message not sent:", payload); return false; }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
      to: [to],
      reply_to: payload.email,
      subject: `Portfolio enquiry — ${payload.subject}`,
      text: `From: ${payload.name} <${payload.email}>\nTopic: ${payload.subject}\n\n${payload.message}`
    })
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
  return true;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (rateLimited(ip)) return NextResponse.json({ ok: false, error: "Too many messages — please try again later." }, { status: 429 });

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 }); }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(body.name), email = str(body.email), message = str(body.message);
  const subject = str(body.subject) || "General enquiry";

  // Hidden field real people never fill in.
  if (str(body.company)) return NextResponse.json({ ok: true, delivered: true });

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Please tell me your name.";
  if (!isEmail(email)) errors.email = "That email address doesn't look right.";
  if (message.length < 12) errors.message = "A little more detail helps — 12 characters minimum.";
  if (name.length > 80 || email.length > 160 || subject.length > 120 || message.length > 4000) errors.message = "That message is longer than the form allows.";
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  try {
    const delivered = await deliver({ name, email, subject, message });
    return NextResponse.json({ ok: true, delivered });
  } catch (err) {
    console.error("[contact] delivery failed:", err);
    return NextResponse.json({ ok: false, error: "The message couldn't be sent. Please email me directly." }, { status: 502 });
  }
}
