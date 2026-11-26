import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  buildGitHubSnapshot,
  classifyGitHubError,
  GitHubApiError,
  githubGet,
  parseRepoRef,
  readCredentials,
  redactSecrets,
  summarizeBranch,
  summarizeRepo,
} from "./github.server";

const LOVABLE_KEY = "lovable-secret-value-123";
const CONNECTION_KEY = "github-connection-secret-456";

describe("GitHub connection", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("refuses to call GitHub when no connector is linked", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(githubGet("/user")).rejects.toThrow(/No GitHub connection/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends credentials as headers only, never inside the request URL", async () => {
    vi.stubEnv("LOVABLE_API_KEY", LOVABLE_KEY);
    vi.stubEnv("GITHUB_API_KEY", CONNECTION_KEY);
    const fetchMock = vi.fn(async (_url: string | URL, _init?: RequestInit) =>
      Response.json({ login: "twenda" }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const user = await githubGet<{ login: string }>("/user", { per_page: 5 });

    expect(user.login).toBe("twenda");
    const url = String(fetchMock.mock.calls[0]?.[0]);
    const init = fetchMock.mock.calls[0]?.[1];
    expect(url).toContain("connector-gateway.lovable.dev/github/user");
    expect(url).not.toContain(LOVABLE_KEY);
    expect(url).not.toContain(CONNECTION_KEY);
    expect(new URL(url).searchParams.get("per_page")).toBe("5");
    const headers = (init?.headers ?? {}) as Record<string, string>;
    expect(headers["Authorization"]).toBe(`Bearer ${LOVABLE_KEY}`);
    expect(headers["X-Connection-Api-Key"]).toBe(CONNECTION_KEY);
  });

  it("keeps both connector keys out of provider error text", async () => {
    vi.stubEnv("LOVABLE_API_KEY", LOVABLE_KEY);
    vi.stubEnv("GITHUB_API_KEY", CONNECTION_KEY);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(`bad token ${LOVABLE_KEY} and ${CONNECTION_KEY}`, { status: 401 })),
    );

    await expect(githubGet("/user")).rejects.toThrow(GitHubApiError);
    await expect(githubGet("/user")).rejects.toThrow(
      /bad token \[redacted\] and \[redacted\]/,
    );
  });

  it("reads the connection only from the server runtime", () => {
    expect(readCredentials({})).toEqual({ mode: "none" });
    expect(readCredentials({ LOVABLE_API_KEY: "a" })).toEqual({ mode: "none" });
    expect(readCredentials({ LOVABLE_API_KEY: "a", GITHUB_API_KEY: "b" })).toEqual({
      mode: "gateway",
      lovableApiKey: "a",
      connectionApiKey: "b",
    });
  });

  it("removes credential values from error text", () => {
    expect(redactSecrets("token abc123 here", ["abc123"])).toBe("token [redacted] here");
    expect(redactSecrets("nothing to hide", [])).toBe("nothing to hide");
  });

  it("classifies provider failures by status", () => {
    expect(classifyGitHubError(401, "Bad credentials")).toBe("unauthorized");
    expect(classifyGitHubError(404, "Not Found")).toBe("not_found");
    expect(classifyGitHubError(403, "API rate limit exceeded")).toBe("rate_limited");
    expect(classifyGitHubError(403, "Resource not accessible")).toBe("forbidden");
    expect(classifyGitHubError(502, "Bad Gateway")).toBe("unknown");
  });

  it("reports the repository and its active branch", () => {
    const repo = summarizeRepo({
      full_name: "twenda/twenda-app",
      default_branch: "main",
      private: true,
      description: "App twenda",
      html_url: "https://github.com/twenda/twenda-app",
      pushed_at: "2026-11-26T21:15:00Z",
    });

    expect(repo.owner).toBe("twenda");
    expect(repo.name).toBe("twenda-app");
    expect(repo.defaultBranch).toBe("main");
    expect(repo.isPrivate).toBe(true);
    expect(repo.pushedAt).toBe("2026-11-26T21:15:00Z");
  });

  it("falls back to the repo name when the owner is missing", () => {
    const repo = summarizeRepo({ name: "twenda-app" });
    expect(repo.name).toBe("twenda-app");
    expect(repo.defaultBranch).toBe("unknown");
  });

  it("keeps branch name and head commit together", () => {
    expect(summarizeBranch({ name: "main", commit: { sha: "c9736d4" } })).toEqual({
      name: "main",
      sha: "c9736d4",
    });
    expect(summarizeBranch({ name: "broken" })).toBeNull();
  });

  it("accepts only owner/repo references", () => {
    expect(parseRepoRef("twenda/twenda-app")).toEqual({ owner: "twenda", repo: "twenda-app" });
    expect(parseRepoRef("twenda-app")).toBeNull();
    expect(parseRepoRef("owner/repo/extra")).toBeNull();
  });

  it("asks for a connection before contacting GitHub", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const snapshot = await buildGitHubSnapshot();

    expect(snapshot).toEqual({ status: "not_connected" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("lists repositories and their active branch once connected", async () => {
    vi.stubEnv("LOVABLE_API_KEY", LOVABLE_KEY);
    vi.stubEnv("GITHUB_API_KEY", CONNECTION_KEY);
    vi.stubGlobal(
      "fetch",
      vi.fn(async (request: string | URL) => {
        const url = String(request);
        if (url.includes("/user/repos")) {
          return Response.json([
            {
              full_name: "twenda/twenda-app",
              default_branch: "main",
              private: true,
              description: "App twenda",
              html_url: "https://github.com/twenda/twenda-app",
              pushed_at: "2026-11-26T21:15:00Z",
            },
          ]);
        }
        return Response.json({ login: "twenda", name: "Twenda", avatar_url: null });
      }),
    );

    const snapshot = await buildGitHubSnapshot();

    expect(snapshot.status).toBe("ok");
    if (snapshot.status !== "ok") return;
    expect(snapshot.account.login).toBe("twenda");
    expect(snapshot.repos?.[0]?.fullName).toBe("twenda/twenda-app");
    expect(snapshot.repos?.[0]?.defaultBranch).toBe("main");
    expect(JSON.stringify(snapshot)).not.toContain(LOVABLE_KEY);
    expect(JSON.stringify(snapshot)).not.toContain(CONNECTION_KEY);
  });
});
