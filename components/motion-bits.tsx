"use client";
import { animate, motion, useInView, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Thin lime progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: .001 });
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-lime" aria-hidden />;
}

/** Soft light that trails the pointer. Skipped on touch / reduced-motion. */
export function CursorGlow() {
  const x = useMotionValue(-500), y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 180, damping: 30 }), sy = useSpring(y, { stiffness: 180, damping: 30 });
  const background = useMotionTemplate`radial-gradient(340px circle at ${sx}px ${sy}px, rgba(188,255,74,.10), transparent 72%)`;
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setOn(true);
    const move = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);
  if (!on) return null;
  return <motion.div style={{ background }} className="pointer-events-none fixed inset-0 z-[55]" aria-hidden />;
}

/** Counts up to `value` the first time it scrolls into view. */
export function Counter({ value, className }: { value: number | string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: .6 });
  const [shown, setShown] = useState(typeof value === "number" ? 0 : value);
  useEffect(() => {
    if (typeof value !== "number") { setShown(value); return; }
    if (!inView) return;
    const controls = animate(0, value, { duration: 1.1, ease: [0.16, 1, .3, 1], onUpdate: v => setShown(Math.round(v)) });
    return () => controls.stop();
  }, [inView, value]);
  return <span ref={ref} className={className}>{shown}</span>;
}

/** Card that tips towards the pointer and lifts a little on hover. */
export function Tilt({ children, className, strength = 7 }: { children: ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(.5), my = useMotionValue(.5);
  const rx = useSpring(useTransform(my, [0, 1], [strength, -strength]), { stiffness: 220, damping: 22 });
  const ry = useSpring(useTransform(mx, [0, 1], [-strength, strength]), { stiffness: 220, damping: 22 });
  function move(e: React.PointerEvent<HTMLDivElement>) {
    const r = ref.current?.getBoundingClientRect(); if (!r) return;
    mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height);
  }
  return <motion.div ref={ref} onPointerMove={move} onPointerLeave={() => { mx.set(.5); my.set(.5); }}
    style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }} whileHover={{ y: -6 }} className={className}>{children}</motion.div>;
}

/** Button/link that leans toward the cursor while it is nearby. */
export function Magnetic({ children, className, href, target, pull = .32 }: { children: ReactNode; className?: string; href: string; target?: string; pull?: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 240, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 240, damping: 18 });
  function move(e: React.PointerEvent<HTMLAnchorElement>) {
    const r = ref.current?.getBoundingClientRect(); if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * pull); y.set((e.clientY - (r.top + r.height / 2)) * pull);
  }
  return <motion.a ref={ref} href={href} target={target} style={{ x, y }} onPointerMove={move}
    onPointerLeave={() => { x.set(0); y.set(0); }} whileTap={{ scale: .96 }} className={className}>{children}</motion.a>;
}

/** Word-by-word entrance for headlines. */
export function SplitText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return <span className={className}>{text.split(" ").map((word, i) => <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
    <motion.span className="inline-block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ delay: delay + i * .06, duration: .8, ease: [0.16, 1, .3, 1] }}>{word}&nbsp;</motion.span>
  </span>)}</span>;
}

/** Returns the id of the section currently filling most of the viewport. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const nodes = ids.map(id => document.getElementById(id)).filter((n): n is HTMLElement => Boolean(n));
    if (!nodes.length) return;
    const io = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-45% 0px -45% 0px", threshold: [0, .25, .5, 1] });
    nodes.forEach(n => io.observe(n));
    return () => io.disconnect();
  }, [ids]);
  return active;
}
