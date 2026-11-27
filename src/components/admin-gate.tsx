import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../lib/twende-database.types";
import { AdminPreview } from "./admin-preview";
import { AuthPanel } from "./auth-panel";
import { AuditView } from "./staff-admin";

type Access = "checking" | "signed-out" | "denied" | "allowed" | "auditor" | "error";

export function AdminGate({onBack}:{onBack:()=>void}) {
  const [access,setAccess]=useState<Access>("checking");
  const [attempt,setAttempt]=useState(0);
  useEffect(()=>{
    let active=true;
    let revision=0;
    let unsubscribe:(()=>void)|undefined;
    let client:SupabaseClient<Database>|undefined;
    const verify=async()=>{
      if(!client||!active)return;
      const current=++revision;
      setAccess("checking");
      try {
        const {data,error}=await client.auth.getUser();
        if(!active||current!==revision)return;
        if(!data.user){setAccess(error&&error.name!=="AuthSessionMissingError"?"error":"signed-out");return;}
        if(error){setAccess("error");return;}
        if(!data.user.email_confirmed_at){setAccess("denied");return;}
        const result=await client.from("user_roles").select("role").eq("user_id",data.user.id).eq("role","admin").maybeSingle();
        if(!active||current!==revision)return;if(result.error){setAccess("error");return;}if(result.data?.role==="admin"){setAccess("allowed");return;}const staff=await client.from("staff_assignments").select("role_code,active").eq("user_id",data.user.id).maybeSingle();if(active&&current===revision)setAccess(staff.error?"error":staff.data?.active&&staff.data.role_code==="auditor"?"auditor":"denied");
      }catch{if(active&&current===revision)setAccess("error");}
    };
    const focus=()=>{void verify();};
    void import("../integrations/supabase/client").then(({supabase})=>{
      if(!active)return;
      client=supabase as unknown as SupabaseClient<Database>;
      const {data}=client.auth.onAuthStateChange((event)=>{
        if(!active)return;
        if(event==="SIGNED_OUT"){revision++;setAccess("signed-out");}
        else {revision++;setAccess("checking");setTimeout(()=>{if(active)void verify();},0);}
      });
      unsubscribe=()=>data.subscription.unsubscribe();
      window.addEventListener("focus",focus);
      void verify();
    }).catch(()=>{if(active)setAccess("error");});
    return ()=>{active=false;revision++;unsubscribe?.();window.removeEventListener("focus",focus);};
  },[attempt]);
  if(access==="auditor")return <main className="twende-shell p-5"><button className="tw-secondary" onClick={onBack}>Voltar</button><AuditView/><AuthPanel/></main>;
  if(access==="allowed")return <div className="twende-shell"><AdminPreview onBack={onBack}/></div>;
  return <main className="twende-shell"><section className="max-w-md mx-auto p-5 sm:py-12 space-y-4">
    <button type="button" className="tw-secondary" onClick={onBack}>Voltar</button>
    <img src="/brand/twende-logo.webp" width={144} height={96} alt="TWENDE — Vamos juntos" className="mx-auto object-contain"/>
    <h1 className="text-2xl font-bold">Acesso administrativo</h1>
    {access==="checking"?<p role="status">A verificar a sessão e as permissões…</p>:<>
      {access==="denied"&&<p role="alert" className="tw-note">Esta conta ainda não tem acesso administrativo autorizado. É necessário confirmar o e-mail e receber a função de administrador no servidor.</p>}
      {access==="error"&&<p role="alert" className="tw-note">Não foi possível verificar o acesso. O painel permanece bloqueado.</p>}
      <AuthPanel/>
      <button type="button" className="tw-secondary w-full" onClick={()=>setAttempt(n=>n+1)}>Verificar acesso novamente</button>
    </>}
    <p className="text-xs text-neutral-600">As permissões são verificadas na base de dados. O painel ainda contém operações demonstrativas; esta verificação não substitui as políticas RLS.</p>
  </section></main>;
}
