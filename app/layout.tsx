import type { Metadata } from "next";
import { CursorGlow, ScrollProgress } from "@/components/motion-bits";
import "./globals.css";
export const metadata: Metadata = { title: "English Daveheed — Full-stack Developer", description: "Portfolio of English Daveheed, building refined web applications, logistics products, and digital experiences.", keywords: ["Full-stack developer", "Next.js", "React", "Nigeria", "Logistics"], openGraph: { title: "English Daveheed — Full-stack Developer", description: "Digital products with purpose and precision.", type: "website" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" suppressHydrationWarning><body><div className="noise" /><ScrollProgress /><CursorGlow />{children}</body></html>; }
