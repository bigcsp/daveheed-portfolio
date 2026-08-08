import { NextResponse } from "next/server";
export const revalidate = 3600;
const fallback = { followers: 0, public_repos: 2, repos: [
  { name: "errands-website", description: "A logistics-first experience for delivery booking and modern courier operations.", language: "JavaScript", html_url: "https://github.com/bigcsp/errands-website", stargazers_count: 0, fork: false },
  { name: "my-portfolio", description: "A personal home on the web for selected work and technical craft.", language: "JavaScript", html_url: "https://github.com/bigcsp/my-portfolio", stargazers_count: 0, fork: false }
] };
export async function GET() {
  try {
    const [profile, repos] = await Promise.all([
      fetch("https://api.github.com/users/bigcsp", { next: { revalidate } }),
      fetch("https://api.github.com/users/bigcsp/repos?sort=updated&per_page=100", { next: { revalidate } })
    ]);
    if (!profile.ok || !repos.ok) throw new Error("GitHub unavailable");
    const user = await profile.json(); const all = await repos.json();
    const selected = all.filter((r: { fork: boolean }) => !r.fork).sort((a: { name: string }, b: { name: string }) => Number(b.name === "errands-website") - Number(a.name === "errands-website"));
    return NextResponse.json({ followers: user.followers, public_repos: user.public_repos, repos: selected.slice(0, 6) });
  } catch { return NextResponse.json(fallback); }
}
