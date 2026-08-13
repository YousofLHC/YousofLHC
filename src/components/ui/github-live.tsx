import Link from "next/link";
import { ArrowUpRight, GitBranch, Star } from "lucide-react";

interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

interface Profile {
  name: string | null;
  login: string;
  followers: number;
  public_repos: number;
}

const USER = "YousofLHC";

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "phd-website" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function daysAgo(iso: string): string {
  const d = (Date.now() - new Date(iso).getTime()) / 86400000;
  if (d < 1) return "today";
  if (d < 2) return "yesterday";
  return `${Math.floor(d)}d ago`;
}

export async function GithubLive() {
  const [profile, repos] = await Promise.all([
    fetchJson<Profile>(`https://api.github.com/users/${USER}`),
    fetchJson<Repo[]>(`https://api.github.com/users/${USER}/repos?sort=updated&per_page=5&type=public`),
  ]);

  const fallback = (
    <Link href={`https://github.com/${USER}`} target="_blank" rel="noreferrer" className="contact-card group">
      <div className="c-icon">
        <GitBranch size={20} />
      </div>
      <div className="label">GitHub</div>
      <div className="name">{USER}</div>
      <div className="desc">Check out my code and projects.</div>
      <span className="link-arrow">
        View Profile <ArrowUpRight size={15} />
      </span>
    </Link>
  );

  if (!profile || !repos) return fallback;

  const top = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 3);

  return (
    <Link href={`https://github.com/${USER}`} target="_blank" rel="noreferrer" className="contact-card group">
      <div className="c-icon">
        <GitBranch size={20} />
      </div>
      <div className="label">GitHub · live feed</div>
      <div className="name">{profile.name ?? profile.login}</div>
      <div className="desc">
        {profile.followers} followers · {profile.public_repos} public repos
      </div>
      <div className="gh-list">
        {top.map((r) => (
          <div key={r.name} className="gh-repo" title={r.description ?? r.name}>
            <span className="gh-repo-name">{r.name}</span>
            <span className="gh-repo-meta">
              {r.language && (
                <>
                  <span className="gh-dot" />
                  {r.language}
                </>
              )}
              {r.stargazers_count > 0 && (
                <span className="gh-star">
                  <Star size={11} />
                  {r.stargazers_count}
                </span>
              )}
              <span>· {daysAgo(r.updated_at)}</span>
            </span>
          </div>
        ))}
      </div>
      <span className="link-arrow">
        View Profile <ArrowUpRight size={15} />
      </span>
    </Link>
  );
}
