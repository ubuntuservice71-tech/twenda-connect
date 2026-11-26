import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  buildGitHubSnapshot,
  type BranchSummary,
  type GitHubAccount,
  type GitHubSnapshot,
  type RepoSummary,
} from "./github.server";

export type { BranchSummary, GitHubAccount, GitHubSnapshot, RepoSummary };

const snapshotInput = z.object({ repo: z.string().min(1).optional() });

export const getGitHubSnapshot = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => snapshotInput.parse(data))
  .handler(async ({ data }): Promise<GitHubSnapshot> => buildGitHubSnapshot(data));
