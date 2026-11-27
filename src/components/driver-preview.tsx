import { useState } from "react";
import { DriverOnboarding } from "./driver-onboarding";
import { DriverLocation } from "./driver-location";
import {PilotRides} from "./pilot-rides";
import { Wallet, MapPin, Flag } from "lucide-react";

export function DriverPreview() {
  const [demo,setDemo]=useState(false);
  const [online, setOnline] = useState(false);
  const [status, setStatus] = useState<"waiting" | "counter" | "accepted" | "declined">("waiting");
  const [offer, setOffer] = useState("150");
  const [fare, setFare] = useState(120);
  const balance = 500;
  const commission = Math.round(fare * 10) / 100;
  const field = "tw-field";
  const action = "tw-primary disabled:opacity-40";
  const secondary = "tw-secondary";
  const proposed = Number(offer);
  const valid = Number.isFinite(proposed) && proposed > 0 && proposed * 0.1 <= balance;
  if(!demo)return <><DriverOnboarding/><DriverLocation/><PilotRides role="driver"/><button type="button" className="tw-secondary mt-4" onClick={()=>setDemo(true)}>Explorar demonstração de corridas</button></>;
  return (
    <section className="space-y-5 mb-6">
      <button type="button" className="tw-secondary" onClick={()=>setDemo(false)}>Voltar à candidatura</button><p className="tw-note">Demonstração local · Dados fictícios · Sem corridas ou cobranças reais.</p>
      <div className="tw-panel flex items-center justify-between gap-4">
        <div><h2 className="font-bold">Disponibilidade</h2><p className="text-sm flex items-center gap-2"><span aria-hidden="true" className={online ? "w-2.5 h-2.5 rounded-full bg-green-600" : "w-2.5 h-2.5 rounded-full bg-neutral-400"} />{online ? "Online (simulação)" : "Offline"}</p></div>
        <button type="button" role="switch" aria-checked={online} aria-label="Disponibilidade do motorista" className={online ? action : secondary} onClick={() => setOnline(!online)}>{online ? "Ficar offline" : "Ficar online"}</button>
      </div>
      <div className="tw-panel">
        <h2 className="font-semibold flex gap-2 items-center"><Wallet size={20} /> Carteira pré-paga</h2><p className="text-3xl tw-money mt-2">{balance.toFixed(2)} MT</p><p className="text-sm text-neutral-600">Saldo fictício · Comissão inicial: 10%</p>
      </div>
      {!online && <div className="tw-panel text-center"><h2 className="font-semibold">Estás offline</h2><p className="text-neutral-600 text-sm mt-1">Activa a disponibilidade para explorar uma proposta simulada.</p></div>}
      {online && <div className="tw-panel space-y-4">
        <h2 className="text-xl font-bold">Proposta de corrida simulada</h2>
        <div className="rounded-xl bg-neutral-100 p-4 space-y-3"><p className="flex gap-3 items-center"><MapPin size={18} /> Bairro da Natite</p><p className="flex gap-3 items-center"><Flag size={18} /> Aeroporto</p></div>
        <p className="text-2xl tw-money">{fare.toFixed(2)} MT</p>
        <p className="text-sm">Comissão estimada: {commission.toFixed(2)} MT · Valor após comissão: {(fare - commission).toFixed(2)} MT</p>
        {status === "waiting" && <div className="grid gap-2">
          <button type="button" className={action} disabled={commission > balance} onClick={() => setStatus("accepted")}>Aceitar proposta</button>
          <button type="button" className={secondary} onClick={() => setStatus("counter")}>Fazer contraproposta</button>
          <button type="button" className={secondary} onClick={() => setStatus("declined")}>Recusar proposta</button>
        </div>}
        {status === "counter" && <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); if (valid) { setFare(Math.round(proposed * 100) / 100); setStatus("waiting"); } }}>
          <label>Contraproposta (MT)<input className={field} type="number" min="0.01" step="0.01" required value={offer} onChange={(e) => setOffer(e.target.value)} /></label>
          <p className="text-sm">Apenas para simulação; não será enviada a um passageiro.</p>
          <button className={action} disabled={!valid}>Simular contraproposta</button>
          <button type="button" className={secondary} onClick={() => setStatus("waiting")}>Voltar</button>
        </form>}
        {(status === "accepted" || status === "declined") && <div aria-live="polite" className="space-y-3"><p>{status === "accepted" ? "Proposta aceite na demonstração. Nenhum saldo foi debitado." : "Proposta recusada na demonstração."}</p><button type="button" className={secondary} onClick={() => {setFare(120);setOffer("150");setStatus("waiting");}}>Reiniciar demonstração</button></div>}
      </div>}
    </section>
  );
}
