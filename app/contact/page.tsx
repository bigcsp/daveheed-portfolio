import { Github, Mail, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { SiteFrame } from "@/components/site-frame";

export const metadata = { title: "Contact — English Daveheed" };

const channels = [["Email", "hello@daveheed.dev", "mailto:hello@daveheed.dev", Mail], ["GitHub", "@bigcsp", "https://github.com/bigcsp", Github], ["WhatsApp", "Start a chat", "https://wa.me/", MessageCircle]] as const;

export default function ContactPage() {
  return <SiteFrame eyebrow="Contact / 03" title={<>Let&apos;s build the<br/><span className="text-lime">next useful thing.</span></>}>
    <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">{channels.map(([label, text, href, Icon]) => <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} className="group min-h-48 bg-[var(--background)] p-7 transition hover:bg-lime hover:text-ink"><Icon size={19}/><p className="eyebrow mt-12 group-hover:text-ink">{label}</p><p className="mt-2 text-sm text-[var(--muted)] group-hover:text-ink/70">{text}</p></a>)}</div>
    <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
      <div><h2 className="display text-4xl font-bold leading-[.98]">Send a message.</h2><p className="mt-5 max-w-sm leading-7 text-[var(--muted)]">Share the shape of the project, your timeline, and what a good outcome looks like. I usually reply within a day or two.</p></div>
      <ContactForm />
    </div>
    <p className="mt-8 font-mono text-[10px] leading-5 text-[var(--muted)]">Replace the email and WhatsApp link with your real contact details, and set <span className="text-lime">RESEND_API_KEY</span> + <span className="text-lime">CONTACT_TO_EMAIL</span> so form submissions reach your inbox.</p>
  </SiteFrame>;
}
