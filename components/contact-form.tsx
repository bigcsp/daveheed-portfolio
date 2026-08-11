"use client";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, Loader2, Send } from "lucide-react";
import { useState } from "react";

const TOPICS = ["New project", "Collaboration", "Freelance role", "Just saying hello"];
const MAX = 4000;
const field = "w-full rounded-xl border border-[var(--line)] bg-[var(--card)] px-4 py-3 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-lime focus:ring-2 focus:ring-lime/25";

type Status = { state: "idle" | "sending" | "error" } | { state: "sent"; delivered: boolean };

export function ContactForm({ email = "hello@daveheed.dev" }: { email?: string }) {
  const [values, setValues] = useState({ name: "", email: "", subject: TOPICS[0], message: "", company: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues(v => ({ ...v, [key]: e.target.value }));
    setErrors(prev => (prev[key] ? { ...prev, [key]: "" } : prev));
  };

  function validate() {
    const next: Record<string, string> = {};
    if (values.name.trim().length < 2) next.name = "Please tell me your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) next.email = "That email address doesn't look right.";
    if (values.message.trim().length < 12) next.message = "A little more detail helps — 12 characters minimum.";
    setErrors(next);
    return !Object.keys(next).length;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status.state === "sending" || !validate()) return;
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(values) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        setStatus({ state: "error" });
        setErrors(prev => ({ ...prev, form: data.error || "Please check the fields above." }));
        return;
      }
      setStatus({ state: "sent", delivered: data.delivered !== false });
      setValues({ name: "", email: "", subject: TOPICS[0], message: "", company: "" });
    } catch {
      setStatus({ state: "error" });
      setErrors(prev => ({ ...prev, form: "Network trouble — please try again or email me directly." }));
    }
  }

  if (status.state === "sent") return <motion.div initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} className="glass flex min-h-[26rem] flex-col items-start justify-center gap-4 rounded-2xl p-9">
    <span className="grid h-12 w-12 place-items-center rounded-full bg-lime text-ink"><Check size={22} /></span>
    <h3 className="display text-3xl font-bold">Message received.</h3>
    <p className="max-w-sm text-sm leading-6 text-[var(--muted)]">Thank you for reaching out — I read everything myself and usually reply within a day or two.</p>
    {!status.delivered && <p className="max-w-sm font-mono text-[10px] leading-5 text-[var(--muted)]">Heads up: no mail provider is configured on this deployment, so the message was only logged server-side. Set <span className="text-lime">RESEND_API_KEY</span> and <span className="text-lime">CONTACT_TO_EMAIL</span> to enable delivery.</p>}
    <button onClick={() => setStatus({ state: "idle" })} className="mt-2 text-sm font-medium text-lime hover:underline">Send another message</button>
  </motion.div>;

  return <form onSubmit={submit} noValidate className="glass rounded-2xl p-6 sm:p-9">
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Name" error={errors.name}><input value={values.name} onChange={set("name")} className={field} placeholder="Your name" autoComplete="name" aria-invalid={!!errors.name} /></Field>
      <Field label="Email" error={errors.email}><input value={values.email} onChange={set("email")} type="email" className={field} placeholder="you@company.com" autoComplete="email" aria-invalid={!!errors.email} /></Field>
    </div>

    <div className="mt-6">
      <p className="eyebrow mb-3">What&apos;s this about?</p>
      <div className="flex flex-wrap gap-2">{TOPICS.map(topic => <button key={topic} type="button" onClick={() => setValues(v => ({ ...v, subject: topic }))}
        className={`rounded-full border px-4 py-2 text-xs font-medium transition ${values.subject === topic ? "border-lime bg-lime text-ink" : "border-[var(--line)] text-[var(--muted)] hover:border-lime hover:text-[var(--foreground)]"}`}>{topic}</button>)}</div>
    </div>

    <div className="mt-6">
      <Field label="Message" error={errors.message}>
        <textarea value={values.message} onChange={set("message")} rows={6} maxLength={MAX} className={`${field} resize-y`} placeholder="Tell me about the product, the timeline, and what success looks like." aria-invalid={!!errors.message} />
      </Field>
      <p className="mt-2 text-right font-mono text-[10px] text-[var(--muted)]">{values.message.length} / {MAX}</p>
    </div>

    <input value={values.company} onChange={set("company")} name="company" tabIndex={-1} autoComplete="off" aria-hidden className="absolute left-[-9999px] h-0 w-0 opacity-0" />

    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <motion.button type="submit" disabled={status.state === "sending"} whileTap={{ scale: .97 }}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-lime px-6 py-3.5 text-sm font-bold text-ink transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60">
        {status.state === "sending" ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : <>Send message <Send size={16} /></>}
      </motion.button>
      <p className="text-xs text-[var(--muted)]">Prefer email? <a href={`mailto:${email}`} className="text-lime hover:underline">{email}</a></p>
    </div>

    <AnimatePresence>{errors.form && <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="mt-5 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-400"><AlertCircle size={14} /> {errors.form}</motion.p>}</AnimatePresence>
  </form>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block">
    <span className="eyebrow mb-3 block">{label}</span>
    {children}
    <AnimatePresence>{error && <motion.span initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
      className="mt-2 block text-xs text-red-400">{error}</motion.span>}</AnimatePresence>
  </label>;
}
