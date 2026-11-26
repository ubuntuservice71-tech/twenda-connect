import { useState } from "react";
import { Car, Bike, MapPin, ArrowRight, Flag } from "lucide-react";

export function PassengerPreview() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicle, setVehicle] = useState<"car" | "bike">("car");
  const [price, setPrice] = useState("");
  const [review, setReview] = useState(false);
  const valid = origin.trim() !== "" && destination.trim() !== "" && origin.trim().toLowerCase() !== destination.trim().toLowerCase() && Number.isFinite(Number(price)) && Number(price) > 0;
  const field = "tw-field";
  return (
    <section className="mb-6 space-y-5 tw-panel">
      <p className="tw-note">Modo demonstração · Nenhuma corrida real será solicitada.</p>
      {review ? (
        <div className="space-y-4" aria-live="polite">
          <h2 className="text-xl font-bold">Rever proposta de corrida</h2>
          <dl className="space-y-2">
            <dt className="text-sm text-neutral-600">Partida</dt><dd>{origin}</dd>
            <dt className="text-neutral-600">Destino</dt><dd>{destination}</dd>
            <dt className="text-neutral-600">Veículo</dt><dd>{vehicle === "car" ? "Carro" : "Motociclo"}</dd>
            <dt className="text-neutral-600">Preço proposto</dt><dd className="text-2xl tw-money">{Number(price).toLocaleString("pt-PT", {minimumFractionDigits: 2, maximumFractionDigits: 2})} MT</dd>
          </dl>
          <p className="text-sm text-neutral-600">A proposta poderá ser aceite ou negociada pelo motorista quando o serviço estiver activo. Não foi enviada.</p>
          <button type="button" className="w-full tw-primary" onClick={() => setReview(false)}>Editar proposta</button>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); if (valid) setReview(true); }}>
          <label className="block space-y-2"><span className="flex items-center gap-2"><MapPin size={18} /> Local de partida</span><input className={field} required maxLength={160} value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Ex.: Bairro da Natite" /></label>
          <label className="block space-y-2"><span className="flex items-center gap-2"><Flag size={18} /> Destino</span><input className={field} required maxLength={160} value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Ex.: Aeroporto" /></label>
          <fieldset><legend className="mb-2 font-semibold">Escolhe o veículo</legend><div className="grid grid-cols-2 gap-3">
            {([{id:"car", label:"Carro", Icon:Car}, {id:"bike", label:"Motociclo", Icon:Bike}] as const).map(({id,label,Icon}) => <button key={id} type="button" aria-pressed={vehicle === id} onClick={() => setVehicle(id)} className={"tw-choice flex flex-col items-center gap-2 rounded-xl border p-4 " + (vehicle === id ? "border-neutral-900 bg-yellow-100 text-black" : "border-neutral-300")}><Icon size={28}/>{label}</button>)}
          </div></fieldset>
          <label className="block space-y-2"><span>Quanto propões pagar? (MT)</span><input className={field} type="number" inputMode="decimal" min="0.01" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0,00" /></label>
          <button type="submit" disabled={!valid} className="w-full tw-primary disabled:opacity-40">Rever proposta <ArrowRight size={18} className="inline ml-2" aria-hidden="true" /></button>
        </form>
      )}
    </section>
  );
}
