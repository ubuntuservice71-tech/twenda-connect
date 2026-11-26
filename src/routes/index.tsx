import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CarFront, Car, ShieldCheck, UserRound } from "lucide-react";
import { AuthPanel } from "../components/auth-panel";
import { AdminPreview } from "../components/admin-preview";
import { DriverPreview } from "../components/driver-preview";
import { PassengerPreview } from "../components/passenger-preview";
export const Route = createFileRoute("/")({ component: Index, head: () => ({ meta: [{title:"TWENDE — Vamos juntos"},{name:"description",content:"Mobilidade em Moçambique."}] }) });
const apps = [
  { id: "passenger", name: "Passageiro", title: "Para onde vamos?", description: "Escolhe o percurso, o veículo e propõe o teu preço.", icon: CarFront, detail: "Planear uma viagem" },
  { id: "driver", name: "Motorista", title: "Conduz com a TWENDE", description: "Gere a tua disponibilidade, propostas e carteira.", icon: Car, detail: "Explorar a área do motorista" },
  { id: "admin", name: "Administração", title: "Centro de operações", description: "Consulta os indicadores e configurações da plataforma.", icon: ShieldCheck, detail: "Explorar o painel de gestão" },
];
function Index() {
  const [role, setRole] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const app = apps.find((a) => a.id === role);
  const back = () => { if(showAuth) setShowAuth(false); else setRole(""); };
  if(role === "admin" && !showAuth) return <div className="twende-shell"><AdminPreview onBack={()=>setRole("")}/></div>;
  return (
    <main className="twende-shell flex flex-col">
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 min-h-18 flex items-center justify-between gap-3">
          <button type="button" aria-label="TWENDE, início" onClick={()=>{setRole("");setShowAuth(false);}} className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
            <img src="/brand/twende-logo.webp" alt="Twende — Vamos juntos." width={96} height={64} className="w-24 h-16 object-contain" />
          </button>
          <button type="button" className="tw-secondary flex items-center gap-2 text-sm" onClick={() => setShowAuth(v => !v)}><UserRound size={18} aria-hidden="true"/>{showAuth ? "Fechar conta" : "Minha conta"}</button>
        </div>
      </header>
      <section className={`w-full mx-auto flex-1 px-4 sm:px-8 py-6 sm:py-10 ${role==="passenger"&&!showAuth?"max-w-2xl":"max-w-xl"}`}>
        {(app || showAuth) && <button type="button" onClick={back} className="flex items-center gap-2 font-semibold mb-4"><ArrowLeft size={20} aria-hidden="true"/>Voltar</button>}
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600"><span className="h-2 w-2 rounded-full bg-yellow-400" aria-hidden="true"/>{showAuth ? "Conta" : app?.name || "Moçambique"} · Pré-visualização</span>
          <h1 className="text-[clamp(2rem,5vw,3rem)] leading-tight font-bold mt-3 mb-2">{showAuth ? "Minha conta" : app?.title || "Vamos juntos."}</h1>
          <p className="text-neutral-600">{showAuth ? "Gerir o acesso à plataforma." : app?.description || "Escolhe como queres utilizar a TWENDE."}</p>
        </div>
        {showAuth ? <AuthPanel /> : app ? (
          role === "passenger" ? <PassengerPreview /> : <DriverPreview />
        ) : (
          <nav className="grid gap-3" aria-label="Interfaces de demonstração">
            {apps.map(({id,name,detail,icon:Icon}) => <button type="button" key={id} onClick={() => setRole(id)} className="tw-panel flex items-center gap-4 text-left hover:border-neutral-500">
              <span className="flex shrink-0 h-14 w-14 items-center justify-center rounded-xl bg-yellow-100"><Icon size={26} aria-hidden="true"/></span>
              <span className="flex-1"><span className="block text-lg font-bold">{name}</span><span className="block text-sm text-neutral-600">{detail}</span></span><ArrowRight size={20} aria-hidden="true"/>
            </button>)}
          </nav>
        )}
      </section>
      <footer className="border-t border-neutral-200 p-4 text-center text-neutral-600 text-sm">TWENDE · Moçambique · Ambiente de demonstração</footer>
    </main>
  );
}
