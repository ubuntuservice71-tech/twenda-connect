import { useRef, useState } from "react";
import {pilotCommand} from "./pilot-rides";
import { ArrowRight, ArrowLeft, CarFront, Check, MapPin, LocateFixed, House, BriefcaseBusiness, Plane, Clock, Plus, Route, Info } from "lucide-react";

type Vehicle = "car" | "bike";
type SavedPlace = "Casa" | "Trabalho";
type Stage = "edit" | "review" | "confirmed";

function MotorcycleIcon() {
  return <svg viewBox="0 0 64 40" width="58" height="36" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13" cy="30" r="8"/><circle cx="51" cy="30" r="8"/>
    <path d="M13 30 23 15 32 29H13m19 0 10-15 9 16M42 14l-4-8h9M20 14h-8l4 5h8m2-4h11l5 4H29"/>
    <path d="M33 21h8M48 10h5l2 5h-5"/>
  </svg>;
}
const money = (value:number) => value.toLocaleString("pt-PT",{minimumFractionDigits:2,maximumFractionDigits:2})+" MT";
const parsePrice = (value:string) => /^\d+(?:[.,]\d{1,2})?$/.test(value.trim()) ? Number(value.trim().replace(",",".")) : NaN;

export function PassengerPreview({canSubmit=false,onSubmitted}:{canSubmit?:boolean;onSubmitted?:()=>void}) {
 const [submitting,setSubmitting]=useState(false),[submitError,setSubmitError]=useState("");
  const [origin,setOrigin]=useState("");
  const [destination,setDestination]=useState("");
  const [reference,setReference]=useState("");
  const [showReference,setShowReference]=useState(false);
  const [vehicle,setVehicle]=useState<Vehicle>("car");
  const [price,setPrice]=useState("");
  const [stage,setStage]=useState<Stage>("edit");
  const [locating,setLocating]=useState(false);
  const [locationNotice,setLocationNotice]=useState("");
  const [saved,setSaved]=useState<Partial<Record<SavedPlace,string>>>({});
  const [editingPlace,setEditingPlace]=useState<SavedPlace|null>(null);
  const [placeDraft,setPlaceDraft]=useState("");
  const [recent,setRecent]=useState<string[]>([]);
  const locationRequest=useRef(0);
  const destinationInput=useRef<HTMLInputElement>(null);
  const amount=parsePrice(price);
  const same=origin.trim().toLocaleLowerCase()===destination.trim().toLocaleLowerCase();
  const hasRoute=Boolean(origin.trim()&&destination.trim()&&!same);
  const valid=hasRoute&&Number.isFinite(amount)&&amount>0&&Number.isSafeInteger(Math.round(amount*100))&&Math.round(amount*100)<=1000000000;
  const guidance=!origin.trim()||!destination.trim()?"Indica a partida e o destino para continuar.":same?"Escolhe um destino diferente da partida.":!valid?"Indica um preço válido entre 0,01 MT e 10 000 000 MT.":"Confirma os detalhes antes de avançar.";
  const pickDestination=(value:string)=>{setDestination(value);setEditingPlace(null);};
  const chooseSaved=(place:SavedPlace)=>{
    if(saved[place]){pickDestination(saved[place]!);return;}
    setPlaceDraft("");setEditingPlace(place);
  };
  const locate=()=>{
    if(!navigator.geolocation){setLocationNotice("Localização indisponível neste dispositivo. Introduz a partida manualmente.");return;}
    const request=++locationRequest.current;
    setLocating(true);setLocationNotice("");
    navigator.geolocation.getCurrentPosition(pos=>{
      if(request!==locationRequest.current)return;
      const {latitude,longitude}=pos.coords;
      setOrigin(latitude.toFixed(5)+", "+longitude.toFixed(5));
      setLocating(false);
      setLocationNotice("Coordenadas obtidas. Adiciona uma referência se necessário; o endereço ainda não foi confirmado.");
    },()=>{
      if(request!==locationRequest.current)return;
      setLocating(false);setLocationNotice("Não foi possível obter a localização. Verifica a permissão ou escreve a partida.");
    },{enableHighAccuracy:false,timeout:10000,maximumAge:0});
  };
  const cancelLocation=()=>{locationRequest.current++;setLocating(false);setLocationNotice("");};
  const reset=()=>{cancelLocation();setOrigin("");setDestination("");setReference("");setShowReference(false);setPrice("");setStage("edit");};
  return <section className="tw-rider space-y-5">
    <p className="flex gap-2 items-center text-xs text-neutral-600" role="note"><Info size={16} className="shrink-0" aria-hidden="true"/>Modo piloto — pedidos de teste, sem deslocações ou pagamentos.</p>
    {stage==="edit" ? <>
      <form id="twende-ride-form" className="space-y-5" onSubmit={e=>{e.preventDefault();if(valid){cancelLocation();setStage("review");}}}>
        <section className="tw-panel space-y-4" aria-labelledby="route-title">
          <h2 id="route-title" className="text-lg font-bold">O teu percurso</h2>
          <div className="relative border border-neutral-200 rounded-xl bg-white">
            <div aria-hidden="true" className="absolute left-[26px] top-[39px] bottom-[39px] border-l border-dashed border-neutral-400"/>
            <label className="relative flex items-center gap-3 px-4 py-2">
              <span className="w-5 flex shrink-0 justify-center"><span className="w-3 h-3 border-[3px] border-neutral-900 rounded-full bg-white"/></span>
              <span className="flex-1 min-w-0"><span className="text-xs font-semibold text-neutral-600">Partida</span>
              <input className="tw-rider-route-input" required maxLength={160} value={origin} placeholder="Usar a minha localização" onChange={e=>{cancelLocation();setOrigin(e.target.value);}}/></span>
            </label>
            <div className="ml-12 border-t border-neutral-200"/>
            <label className="relative flex items-center gap-3 px-4 py-2">
              <MapPin size={21} className="shrink-0 text-neutral-900 bg-white" aria-hidden="true"/>
              <span className="flex-1 min-w-0"><span className="text-xs font-semibold text-neutral-600">Destino</span><input ref={destinationInput} className="tw-rider-route-input" required maxLength={160} value={destination} placeholder="Para onde vais?" onChange={e=>setDestination(e.target.value)}/></span>
            </label>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <button type="button" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-800 !min-h-11" disabled={locating} onClick={locate}><LocateFixed size={18} aria-hidden="true"/>{locating?"A obter localização…":"Usar a minha localização"}</button>
            <button type="button" aria-expanded={showReference} className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-800 !min-h-11" onClick={()=>setShowReference(v=>!v)}><Plus size={18} aria-hidden="true"/>{showReference?"Ocultar referência":"Adicionar referência"}</button>
          </div>
          {locationNotice&&<p role="status" className="text-xs text-neutral-600">{locationNotice}</p>}
          {showReference&&<label className="block text-sm font-medium">Referência da partida (opcional)<input className="tw-field" maxLength={160} value={reference} placeholder="Ex.: Em frente à escola" onChange={e=>setReference(e.target.value)}/></label>}
          <div className="border-t border-neutral-100 pt-3">
            <p className="text-xs font-semibold text-neutral-600 mb-2">Destinos rápidos</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={()=>chooseSaved("Casa")} className="tw-rider-chip"><House size={16} aria-hidden="true"/>Casa</button>
              <button type="button" onClick={()=>chooseSaved("Trabalho")} className="tw-rider-chip"><BriefcaseBusiness size={16} aria-hidden="true"/>Trabalho</button>
              <button type="button" onClick={()=>{pickDestination("Aeroporto");destinationInput.current?.focus();}} className="tw-rider-chip"><Plane size={16} aria-hidden="true"/>Aeroporto</button>
            </div>
            {editingPlace&&<div className="mt-3 rounded-xl bg-neutral-50 p-3 space-y-2">
              <label className="block text-sm font-medium">Endereço de {editingPlace.toLowerCase()}<input className="tw-field" maxLength={160} value={placeDraft} onChange={e=>setPlaceDraft(e.target.value)} placeholder="Escreve o endereço"/></label>
              <div className="flex gap-2 flex-wrap"><button type="button" className="tw-secondary text-sm" disabled={!placeDraft.trim()} onClick={()=>{setSaved(prev=>({...prev,[editingPlace]:placeDraft.trim()}));pickDestination(placeDraft.trim());}}>Usar destino</button><button type="button" className="text-sm underline" onClick={()=>setEditingPlace(null)}>Cancelar</button></div>
              <p className="text-xs text-neutral-500">Guardado apenas nesta sessão de demonstração.</p>
            </div>}
            {recent.length>0&&<div className="mt-3"><p className="text-xs text-neutral-600 font-semibold mb-1">Recentes</p>{recent.map(place=><button key={place} type="button" className="flex w-full text-left items-center gap-2 text-sm border-b border-neutral-100" onClick={()=>pickDestination(place)}><Clock size={16} aria-hidden="true"/><span className="break-words">{place}</span></button>)}</div>}
          </div>
        </section>
        <fieldset className="space-y-3"><legend className="text-lg font-bold">Escolhe o veículo</legend>
          <div className="grid grid-cols-2 gap-3">
            {([{id:"car",label:"Carro",detail:"Viagem de carro"},{id:"bike",label:"Motociclo",detail:"1 passageiro"}] as const).map(item=><button type="button" key={item.id} aria-pressed={vehicle===item.id} onClick={()=>setVehicle(item.id)} className="tw-choice relative rounded-xl bg-white border border-neutral-200 p-4 text-left flex flex-col items-start gap-2">
              {vehicle===item.id&&<span className="absolute right-3 top-3 w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center"><Check size={13} aria-hidden="true"/></span>}
              {item.id==="car"?<CarFront size={38} strokeWidth={1.8} aria-hidden="true"/>:<MotorcycleIcon/>}
              <span className="font-bold">{item.label}</span><span className="text-xs text-neutral-600">{item.detail}</span>
            </button>)}
          </div>
        </fieldset>
        <section className="tw-panel space-y-3" aria-labelledby="estimate-title">
          <h2 id="estimate-title" className="font-bold flex items-center gap-2"><Route size={19} aria-hidden="true"/>Estimativa da viagem</h2>
          <div className="grid grid-cols-3 gap-2 text-center">
            {["Distância","Tempo","Preço sugerido"].map(label=><div key={label} className="rounded-lg bg-neutral-50 p-2"><span className="block text-xs text-neutral-600">{label}</span><strong className="block text-lg">—</strong></div>)}
          </div>
          <p className="text-xs text-neutral-600">{hasRoute?"Estimativas indisponíveis até à integração de rotas e tarifários. Podes propor o teu preço.":"Indica a partida e o destino. As estimativas dependem dos dados de rota e tarifário."}</p>
        </section>
        <section className="tw-panel space-y-2">
          <label htmlFor="ride-price" className="block text-lg font-bold">Quanto queres pagar?</label>
          <p className="text-sm text-neutral-600">O motorista poderá aceitar ou negociar a tua proposta.</p>
          <div className="relative"><input id="ride-price" className="tw-field !pr-14 !text-xl font-semibold" type="text" inputMode="decimal" autoComplete="off" required maxLength={14} value={price} onChange={e=>setPrice(e.target.value)} placeholder="Introduz o valor"/><span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold pointer-events-none">MT</span></div>
          {price.trim()&&!Number.isFinite(amount)&&<p role="alert" className="text-xs text-red-700">Usa um valor com até duas casas decimais.</p>}
        </section>
      </form>
      <div className="tw-rider-action">
        <p className="text-xs text-neutral-600 text-center mb-2" aria-live="polite">{guidance}</p>
        <button type="submit" form="twende-ride-form" disabled={!valid} className="tw-rider-cta w-full flex items-center justify-center gap-2">Rever proposta <ArrowRight size={19} aria-hidden="true"/></button>
      </div>
    </>:stage==="review"?<>
      <section className="tw-panel space-y-4">
        <h2 className="text-xl font-bold">Rever proposta</h2>
        <div className="rounded-xl border border-neutral-200 p-4 space-y-3">
          <div className="flex items-start gap-3"><span className="mt-1.5 w-3 h-3 shrink-0 border-[3px] border-neutral-900 rounded-full"/><div className="min-w-0"><p className="text-xs text-neutral-600">Partida</p><p className="font-semibold break-words">{origin}</p>{reference.trim()&&<p className="text-xs text-neutral-600 break-words">{reference}</p>}</div></div>
          <div className="ml-1 border-l border-dashed border-neutral-400 h-3"/>
          <div className="flex items-start gap-3"><MapPin size={19} className="shrink-0" aria-hidden="true"/><div className="min-w-0"><p className="text-xs text-neutral-600">Destino</p><p className="font-semibold break-words">{destination}</p></div></div>
        </div>
        <div className="flex items-center justify-between gap-3"><span className="text-sm text-neutral-600">Veículo</span><strong>{vehicle==="car"?"Carro":"Motociclo"}</strong></div>
        <div className="border-t border-neutral-200 pt-4 flex items-center justify-between gap-3"><span className="text-sm text-neutral-600">Preço proposto</span><strong className="text-2xl tw-money">{money(amount)}</strong></div>
        <p className="text-sm text-neutral-600">O pedido-piloto será guardado e poderá receber propostas de teste. Não haverá deslocações nem cobranças.</p>
        <button type="button" className="tw-secondary w-full flex items-center justify-center gap-2" onClick={()=>setStage("edit")}><ArrowLeft size={17} aria-hidden="true"/>Editar proposta</button>
      </section>
      <div className="tw-rider-action">{submitError&&<p role="alert" className="text-sm text-red-700">{submitError}</p>}{!canSubmit&&<p className="text-sm">Entra e guarda o perfil para criar um pedido-piloto.</p>}<button type="button" className="tw-rider-cta w-full" disabled={!canSubmit||submitting} onClick={async()=>{setSubmitting(true);setSubmitError("");try{await pilotCommand({action:"request",origin:origin.trim(),destination:destination.trim(),vehicle_kind:vehicle==="car"?"car":"motorcycle",price_minor:Math.round(amount*100),pickup_reference:reference.trim()||null});setRecent(prev=>[destination.trim(),...prev.filter(p=>p!==destination.trim())].slice(0,5));setStage("confirmed");onSubmitted?.();}catch{setSubmitError("Pedido recusado. Confirma o perfil e se já existe um pedido aberto.");}finally{setSubmitting(false);}}}>Registar pedido-piloto</button></div>
    </>:<section className="tw-panel text-center space-y-4" aria-live="polite">
      <span className="mx-auto flex w-14 h-14 rounded-full bg-yellow-100 items-center justify-center"><Check size={28} aria-hidden="true"/></span>
      <h2 className="text-xl font-bold">Pedido-piloto registado</h2><p className="text-sm text-neutral-600">A proposta foi guardada para teste. Não houve viagem nem cobrança.</p><button type="button" className="tw-rider-cta w-full" onClick={reset}>Planear outra viagem</button>
    </section>}
  </section>;
}
