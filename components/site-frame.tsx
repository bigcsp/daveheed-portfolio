import Link from "next/link";
import { ArrowLeft, Github } from "lucide-react";
import type { ReactNode } from "react";

export function SiteFrame({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children: ReactNode }) {
  return <main className="min-h-screen"><div className="fixed inset-0 -z-10 grid-bg" />
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[color:var(--background)]/85 backdrop-blur-xl"><div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6"><Link href="/" className="display text-xl font-bold">ED<span className="text-lime">.</span></Link><nav className="flex items-center gap-4 text-xs text-[var(--muted)] sm:gap-7"><Link href="/about" className="hover:text-[var(--foreground)]">About</Link><Link href="/projects" className="hover:text-[var(--foreground)]">Projects</Link><Link href="/contact" className="hover:text-[var(--foreground)]">Contact</Link></nav></div></header>
    <section className="mx-auto max-w-[1200px] px-6 pb-16 pt-20 sm:pt-28"><Link href="/" className="mb-12 inline-flex items-center gap-2 text-xs text-[var(--muted)] hover:text-lime"><ArrowLeft size={14}/> Back home</Link><p className="eyebrow">{eyebrow}</p><h1 className="display mt-6 max-w-4xl text-5xl font-bold leading-[.88] sm:text-7xl">{title}</h1>{children}</section>
    <footer className="border-t border-[var(--line)] px-6 py-7"><div className="mx-auto flex max-w-[1200px] items-center justify-between text-xs text-[var(--muted)]"><span>© {new Date().getFullYear()} English Daveheed</span><a href="https://github.com/bigcsp" target="_blank" className="flex items-center gap-2 hover:text-lime"><Github size={14}/> GitHub</a></div></footer>
  </main>;
}
