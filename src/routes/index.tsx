import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminPreview } from "../components/admin-preview";
import { DriverPreview } from "../components/driver-preview";
import { PassengerPreview } from "../components/passenger-preview";
export const Route = createFileRoute("/")({ component: Index });
const apps = [
  { id: "passenger", name: "Passageiro", title: "Para onde vamos?", description: "A tua próxima viagem começa aqui." },
  { id: "driver", name: "Motorista", title: "Conduz com a TWENDE", description: "A tua próxima oportunidade começa aqui." },
  { id: "admin", name: "Administração", title: "Centro de operações", description: "Gestão da plataforma TWENDE." },
];
function Index() {
  const [role, setRole] = useState("");
  const app = apps.find((a) => a.id === role);
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <header className="flex items-center justify-between p-6 border-b border-neutral-800">
        <strong className="text-3xl font-black tracking-tight text-yellow-400">TWENDE</strong>
        <span className="text-sm">{app?.name || "Moçambique"}</span>
      </header>
      <section className="w-full max-w-4xl mx-auto flex-1 px-6 py-16">
        <small className="text-yellow-400 font-bold tracking-widest">TWENDE · PROTÓTIPO</small>
        <h1 className="text-5xl font-black mt-4 mb-5">{app?.title || "Vamos juntos."}</h1>
        <p className="text-neutral-300 text-lg mb-8">{app?.description || "Escolhe a interface que pretendes explorar."}</p>
        {app ? (
          <>
            {role === "passenger" ? <PassengerPreview /> : role === "driver" ? <DriverPreview /> : <AdminPreview />}
            <button type="button" onClick={() => setRole("")} className="text-yellow-400 underline">Voltar à pré-visualização</button>
          </>
        ) : (
          <nav className="grid gap-4" aria-label="Interfaces de demonstração">
            {apps.map((a) => <button type="button" key={a.id} onClick={() => setRole(a.id)} className="flex justify-between items-center rounded-2xl bg-yellow-400 text-black font-bold text-lg p-5 hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">{a.name}<span aria-hidden="true">→</span></button>)}
          </nav>
        )}
      </section>
      <footer className="p-6 text-center text-neutral-400 text-sm">TWENDE · Moçambique · Pré-visualização</footer>
    </main>
  );
}
