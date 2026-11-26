import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FolderGitIcon, GitBranchIcon, GitCommitIcon, RefreshCwIcon, ShieldCheckIcon } from "lucide-react";

import { getGitHubSnapshot, type GitHubSnapshot, type RepoSummary } from "@/lib/github.functions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Estado do repositório · twenda" },
      {
        name: "description",
        content:
          "Consulta o repositório do GitHub associado ao projeto twenda e o ramo ativo, com as credenciais guardadas no servidor.",
      },
      { name: "author", content: "twenda" },
      { property: "og:title", content: "Estado do repositório · twenda" },
      {
        property: "og:description",
        content: "Repositório e ramo ativo do projeto twenda, consultados de forma segura.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["github-snapshot"],
      queryFn: () => getGitHubSnapshot({ data: {} }),
    }),
  component: RepositoryStatus,
});

const ERROR_COPY: Record<string, string> = {
  unauthorized:
    "As credenciais da ligação ao GitHub já não são aceites. Pede a ligação outra vez no chat para regenerá-las.",
  forbidden: "A ligação atual não tem permissão para ler este repositório.",
  rate_limited: "O GitHub está a limitar temporariamente as pedidos desta ligação. Tenta outra vez daqui a pouco.",
  not_found: "Esse repositório não existe ou a ligação não tem acesso a ele.",
  unknown: "O GitHub devolveu um erro inesperado.",
};

function RepositoryStatus() {
  const { data, isFetching, refetch } = useSuspenseQuery<GitHubSnapshot>({
    queryKey: ["github-snapshot"],
    queryFn: () => getGitHubSnapshot({ data: {} }),
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs tracking-[0.22em] text-muted-foreground uppercase">twenda</span>
            <span className="font-mono text-xs text-muted-foreground">/ estado do repositório</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void refetch()}
            className="gap-2 font-mono text-xs uppercase"
          >
            <RefreshCwIcon className="size-3.5" />
            Atualizar
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        <div className="space-y-2">
          <h1 className="font-sans text-3xl font-semibold tracking-tight">
            Repositório associado e ramo ativo
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            A leitura passa pelo servidor: os tokens de acesso nunca chegam ao browser, nem aparecem em pedidos,
            páginas ou registos.
          </p>
        </div>

        {isFetching && data.status !== "ok" ? (
          <div className="space-y-3">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : null}

        {data.status === "not_connected" ? <NotConnected /> : null}

        {data.status === "error" ? (
          <Card>
            <CardHeader>
              <CardTitle className="font-sans text-base">Não foi possível ler o GitHub</CardTitle>
              <CardDescription>
                {ERROR_COPY[data.code] ?? ERROR_COPY["unknown"]}
                {data.httpStatus ? (
                  <span className="mt-1 block font-mono text-xs">estado HTTP {data.httpStatus}</span>
                ) : null}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Podes tentar de novo, ou pedir a ligação outra vez no chat.
              </p>
              <Button variant="outline" size="sm" onClick={() => void refetch()} className="gap-2">
                <RefreshCwIcon className="size-3.5" />
                Tentar de novo
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {data.status === "ok" && data.selected ? <Selected snapshot={data} /> : null}

        {data.status === "ok" && !data.selected ? <RepositoryList snapshot={data} /> : null}
      </main>
    </div>
  );
}

function NotConnected() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-sans text-base">Ligação ao GitHub em falta</CardTitle>
        <CardDescription>
          Ainda não há uma ligação GitHub guardada neste projeto, por isso esta página não consegue ler
          repositórios nem ramos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Para a criar, escreve no chat «liga o GitHub» e confirma o cartão que aparece. Também podes ligá-la em
          Conectores no espaço de trabalho.
        </p>
        <p className="text-sm text-muted-foreground">
          Se queres guardar o código deste projeto no GitHub, usa Definições do projeto → Git: a sincronização
          cria o repositório e mantém-no em dia.
        </p>
        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <ShieldCheckIcon className="mt-0.5 size-4 shrink-0" />
          Quando a ligação existir, os tokens ficam apenas no servidor e esta página passa a mostrar o
          repositório, o ramo ativo e o último commit.
        </p>
      </CardContent>
    </Card>
  );
}

function RepositoryList({ snapshot }: { snapshot: Extract<GitHubSnapshot, { status: "ok" }> }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Badge variant="outline" className="gap-1.5 font-mono text-xs">
          <span className="size-1.5 rounded-full bg-primary" />
          {snapshot.account.login}
        </Badge>
        <span className="text-muted-foreground">
          {snapshot.repos?.length ?? 0} repositórios visíveis para esta ligação
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-sans text-base">Repositórios</CardTitle>
          <CardDescription>Ordenados pelo último envio para o GitHub.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 p-2">
          {snapshot.repos && snapshot.repos.length > 0 ? (
            snapshot.repos.map((repo) => <RepoRow key={repo.fullName} repo={repo} />)
          ) : (
            <p className="px-3 py-6 text-sm text-muted-foreground">
              Esta ligação ainda não vê nenhum repositório.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RepoRow({ repo }: { repo: RepoSummary }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md px-3 py-2.5 hover:bg-accent">
      <div className="min-w-0">
        <a
          href={repo.htmlUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 font-mono text-sm hover:underline"
        >
          <FolderGitIcon className="size-4 shrink-0 text-muted-foreground" />
          <span>{repo.fullName}</span>
        </a>
        {repo.description ? (
          <p className="mt-0.5 truncate pl-6 text-xs text-muted-foreground">{repo.description}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2 font-mono text-xs text-muted-foreground">
        <Badge variant="secondary" className="gap-1 font-mono text-xs">
          <GitBranchIcon className="size-3" />
          {repo.defaultBranch}
        </Badge>
        <span>{repo.isPrivate ? "privado" : "público"}</span>
      </div>
    </div>
  );
}

function Selected({ snapshot }: { snapshot: Extract<GitHubSnapshot, { status: "ok" }> }) {
  const selected = snapshot.selected;
  if (!selected) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-baseline gap-2 font-mono text-sm">
        <span className="text-muted-foreground">~/</span>
        <span className="font-semibold">{selected.repo.fullName}</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-sans text-base">Ramo ativo</CardTitle>
          <CardDescription>
            {selected.repo.defaultBranch} é o ramo padrão; o SHA é o último commit que lá está.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 font-mono text-sm">
            <GitBranchIcon className="size-4 text-muted-foreground" />
            <span className="font-semibold">{selected.repo.defaultBranch}</span>
            <Badge variant="outline" className="gap-1 font-mono text-xs">
              <GitCommitIcon className="size-3" />
              {selected.branches.find((b) => b.name === selected.repo.defaultBranch)?.sha.slice(0, 7) ?? "—"}
            </Badge>
          </div>
          <ul className="divide-y divide-border rounded-md border border-border">
            {selected.branches.slice(0, 12).map((branch) => (
              <li key={branch.name} className="flex items-center justify-between gap-3 px-3 py-2 font-mono text-xs">
                <span className="flex items-center gap-2">
                  <GitBranchIcon className="size-3 text-muted-foreground" />
                  {branch.name}
                </span>
                <span className="text-muted-foreground">{branch.sha.slice(0, 7)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
