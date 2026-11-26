// Server-only GitHub access. This module reads connector credentials from the
// server runtime and is never reachable from browser code: component code
// imports the *.functions.ts wrapper, not this file.

const GATEWAY_BASE = "https://connector-gateway.lovable.dev/github";

export type GitHubCredentials =
  | { mode: "gateway"; lovableApiKey: string; connectionApiKey: string }
  | { mode: "none" };

/**
 * Credentials come from the linked GitHub connector only. Nothing is hardcoded
 * and nothing is ever returned to the browser.
 */
export function readCredentials(env: Record<string, string | undefined> = process.env): GitHubCredentials {
  const lovableApiKey = env["LOVABLE_API_KEY"]?.trim();
  const connectionApiKey = env["GITHUB_API_KEY"]?.trim();

  if (lovableApiKey && connectionApiKey) {
    return { mode: "gateway", lovableApiKey, connectionApiKey };
  }

  return { mode: "none" };
}

export class GitHubNotConnectedError extends Error {
  constructor() {
    super("No GitHub connection is linked to this project yet.");
    this.name = "GitHubNotConnectedError";
  }
}

export class GitHubApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "GitHubApiError";
    this.status = status;
  }
}

/** Removes every credential value from provider error text before it can travel to the client. */
export function redactSecrets(text: string, secrets: readonly string[]): string {
  let out = text;
  for (const secret of secrets) {
    if (!secret) continue;
    out = out.split(secret).join("[redacted]");
  }
  return out;
}

/** Turns a GitHub status code and error body into a code the UI can explain. */
export function classifyGitHubError(
  status: number,
  body: string,
): "unauthorized" | "forbidden" | "rate_limited" | "not_found" | "unknown" {
  if (status === 401) return "unauthorized";
  if (status === 404) return "not_found";
  if (status === 403 && /rate limit/i.test(body)) return "rate_limited";
  if (status === 403) return "forbidden";
  return "unknown";
}

export type RepoSummary = {
  owner: string;
  name: string;
  fullName: string;
  defaultBranch: string;
  isPrivate: boolean;
  isFork: boolean;
  description: string | null;
  htmlUrl: string;
  pushedAt: string | null;
};

function asRaw(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

function stringField(raw: Record<string, unknown>, key: string): string | null {
  const value = raw[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function summarizeRepo(raw: unknown): RepoSummary {
  const data = asRaw(raw);
  const fullName = stringField(data, "full_name") ?? stringField(data, "name") ?? "unknown";
  const [owner, name] = fullName.split("/");

  return {
    owner: owner ?? "unknown",
    name: name ?? owner ?? "unknown",
    fullName,
    defaultBranch: stringField(data, "default_branch") ?? "unknown",
    isPrivate: data["private"] === true,
    isFork: data["fork"] === true,
    description: stringField(data, "description"),
    htmlUrl: stringField(data, "html_url") ?? `https://github.com/${fullName}`,
    pushedAt: stringField(data, "pushed_at"),
  };
}

export type BranchSummary = { name: string; sha: string };

export function summarizeBranch(raw: unknown): BranchSummary | null {
  const data = asRaw(raw);
  const name = stringField(data, "name");
  const sha = stringField(asRaw(data["commit"]), "sha");
  if (!name || !sha) return null;
  return { name, sha };
}

export function parseRepoRef(input: string): { owner: string; repo: string } | null {
  const match = input.trim().match(/^([\w.-]+)\/([\w.-]+)$/);
  if (!match) return null;
  return { owner: match[1]!, repo: match[2]! };
}

/** GET through the Lovable connector gateway; never call api.github.com directly. */
export async function githubGet<T = unknown>(
  path: string,
  query?: Record<string, string | number>,
): Promise<T> {
  const credentials = readCredentials();
  if (credentials.mode === "none") throw new GitHubNotConnectedError();

  const url = new URL(GATEWAY_BASE + path);
  for (const [key, value] of Object.entries(query ?? {})) {
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${credentials.lovableApiKey}`,
      "X-Connection-Api-Key": credentials.connectionApiKey,
    },
  });

  const body = await response.text();

  if (!response.ok) {
    throw new GitHubApiError(
      response.status,
      redactSecrets(body, [credentials.lovableApiKey, credentials.connectionApiKey]).slice(0, 600),
    );
  }

  return JSON.parse(body) as T;
}

export type GitHubAccount = { login: string; name: string | null; avatarUrl: string | null };

export type GitHubSnapshot =
  | { status: "not_connected" }
  | {
      status: "error";
      code: "unauthorized" | "forbidden" | "rate_limited" | "not_found" | "unknown";
      message: string;
      httpStatus?: number;
    }
  | { status: "ok"; account: GitHubAccount; repos: RepoSummary[]; selected: null }
  | { status: "ok"; account: GitHubAccount; repos: null; selected: { repo: RepoSummary; branches: BranchSummary[] } };

/**
 * Reads the account, the repositories, and the branches of one repository.
 * Runs server-side only: the result carries public repository metadata and
 * never a credential value.
 */
export async function buildGitHubSnapshot(
  input: { repo?: string | undefined } = {},
): Promise<GitHubSnapshot> {
  try {
    const accountRaw = await githubGet<Record<string, unknown>>("/user");
    const login = typeof accountRaw["login"] === "string" ? accountRaw["login"] : "unknown";
    const account: GitHubAccount = {
      login,
      name: typeof accountRaw["name"] === "string" ? accountRaw["name"] : null,
      avatarUrl: typeof accountRaw["avatar_url"] === "string" ? accountRaw["avatar_url"] : null,
    };

    const ref = input.repo ? parseRepoRef(input.repo) : null;
    if (!ref) {
      const repos = (await githubGet<unknown[]>("/user/repos", { per_page: 30, sort: "pushed" }))
        .map(summarizeRepo)
        .filter((repo) => repo.fullName !== "unknown");
      return { status: "ok", account, repos, selected: null };
    }

    const repo = summarizeRepo(await githubGet<Record<string, unknown>>(`/repos/${ref.owner}/${ref.repo}`));
    const branches = (
      await githubGet<unknown[]>(`/repos/${ref.owner}/${ref.repo}/branches`, { per_page: 100 })
    )
      .map(summarizeBranch)
      .filter((branch): branch is BranchSummary => branch !== null);

    return { status: "ok", account, repos: null, selected: { repo, branches } };
  } catch (error) {
    if (error instanceof GitHubNotConnectedError) {
      return { status: "not_connected" };
    }

    if (error instanceof GitHubApiError) {
      return {
        status: "error",
        code: classifyGitHubError(error.status, error.message),
        message: error.message,
        httpStatus: error.status,
      };
    }

    console.error("GitHub request failed", error);
    return { status: "error", code: "unknown", message: "Não foi possível contactar o GitHub." };
  }
}

