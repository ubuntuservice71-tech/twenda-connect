import { useEffect, useState } from "react";

export function AuthPanel() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [account, setAccount] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;
    void import("../integrations/supabase/client").then(({ supabase }) => {
      if (!active) return;
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (active) { setAccount(session?.user.email ?? null); setReady(true); }
      });
      unsubscribe = () => data.subscription.unsubscribe();
    }).catch(() => { if (active) setMessage("Não foi possível iniciar a ligação. Actualiza a página."); });
    return () => { active = false; unsubscribe?.(); };
  }, []);
  const field = "w-full rounded-xl border border-neutral-600 bg-neutral-950 p-3 text-white";
  return (
    <section className="space-y-4 rounded-2xl border border-neutral-700 bg-neutral-900 p-5">
      <h2 className="text-xl font-bold">Conta TWENDE</h2>
      <p className="text-sm text-neutral-300">Autenticação real em fase de teste. As áreas de passageiro, motorista e administração continuam a ser demonstrações públicas, sem acesso a operações reais.</p>
      {!ready ? <p>A iniciar a ligação…</p> : account ? (
        <div className="space-y-3">
          <p>Sessão iniciada: {account}</p>
          <button type="button" disabled={busy} className="rounded-xl bg-yellow-400 p-3 font-bold text-black" onClick={async () => {
            setBusy(true); setMessage("");
            try {
              const { supabase } = await import("../integrations/supabase/client");
              const { error } = await supabase.auth.signOut();
              if (error) throw error;
              setAccount(null); setMessage("Sessão terminada.");
            } catch { setMessage("Não foi possível terminar a sessão. Tenta novamente."); }
            finally { setBusy(false); }
          }}>Terminar sessão</button>
        </div>
      ) : (
        <form className="grid gap-4" onSubmit={async (event) => {
          event.preventDefault(); if (busy) return;
          setBusy(true); setMessage("");
          try {
            const { supabase } = await import("../integrations/supabase/client");
            const credentials = { email: email.trim(), password };
            const { data, error } = mode === "signup" ? await supabase.auth.signUp(credentials) : await supabase.auth.signInWithPassword(credentials);
            if (error) throw error;
            setPassword("");
            setMessage(data.session ? "Sessão iniciada." : "Se o registo for permitido, verifica o teu e-mail para concluir a confirmação.");
          } catch { setMessage("Não foi possível concluir a operação. Verifica os dados ou tenta novamente."); }
          finally { setBusy(false); }
        }}>
          <label>E-mail<input className={field} type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
          <label>Palavra-passe<input className={field} type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={mode === "signup" ? 12 : 1} required value={password} onChange={e => setPassword(e.target.value)} /></label>
          <button disabled={busy} className="rounded-xl bg-yellow-400 p-3 font-bold text-black disabled:opacity-50">{busy ? "A processar…" : mode === "signup" ? "Criar conta de teste" : "Entrar"}</button>
          <button type="button" disabled={busy} className="text-yellow-400 underline" onClick={() => {setMode(mode === "signup" ? "login" : "signup");setPassword("");setMessage("");}}>{mode === "signup" ? "Já tenho conta" : "Criar conta"}</button>
        </form>
      )}
      <p role="status" className="text-sm">{message}</p>
    </section>
  );
}
