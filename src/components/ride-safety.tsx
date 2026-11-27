import {useEffect,useState} from "react";
import {driverClient} from "./driver-shared";
import type {Database} from "../lib/twende-database.types";
import {rideLabels} from "../lib/ride-lifecycle";
type T=Database["public"]["Tables"];
type Ride=T["rides"]["Row"];
type Identity=T["pilot_ride_identity"]["Row"];
type Pin=T["pilot_start_pins"]["Row"];
export function RideSafety({ride,role,uid,revision,onRenew,busy}:{ride:Ride;role:"passenger"|"driver"|"admin";uid:string;revision:number;onRenew:()=>void;busy:boolean}){
 const [identity,setIdentity]=useState<Identity|null>(null),[pin,setPin]=useState<Pin|null>(null),[message,setMessage]=useState(""),[incident,setIncident]=useState(""),[saving,setSaving]=useState(false),[refresh,setRefresh]=useState(0);
 const passenger=role==="passenger"&&ride.passenger_id===uid;
 const participant=passenger||(role==="driver"&&ride.driver_id===uid);
 useEffect(()=>{let alive=true;setIdentity(null);setPin(null);void driverClient().then(async c=>{
 const i=await c.from("pilot_ride_identity").select("*").eq("ride_id",ride.id).maybeSingle();if(i.error)throw Error();if(!alive)return;setIdentity(i.data);
 if(passenger&&ride.status==="arrived"){const s=await c.from("pilot_start_pins").select("*").eq("ride_id",ride.id).maybeSingle();if(s.error)throw Error();if(alive)setPin(s.data);}
 }).catch(()=>{if(alive)setMessage("Não foi possível consultar os dados de segurança.");});return()=>{alive=false;};},[ride.id,ride.status,passenger,revision,refresh]);
 async function report(){if(!participant||!incident.trim())return;setSaving(true);setMessage("");try{const c=await driverClient();const r=await c.from("support_tickets").insert({owner_id:uid,source:passenger?"passenger":"driver",ride_id:ride.id,subject:"Incidente de segurança — piloto",category:"safety",description:incident.trim()}).select("id").single();if(r.error)throw Error();setIncident("");setMessage("Ticket urgente registado. Não foi enviado alerta externo; consulta o suporte.");}catch{setMessage("Não foi possível registar o incidente.");}finally{setSaving(false);}}
 async function copy(){if(!participant)return;try{await navigator.clipboard.writeText("TWENDE — corrida de teste "+ride.id.slice(0,8)+" · "+(rideLabels[ride.status]??ride.status)+" · "+(identity?identity.make+" "+identity.model+" · matrícula "+identity.plate:"Veículo por confirmar"));setMessage("Resumo de teste copiado. Partilha manualmente apenas com alguém de confiança.");}catch{setMessage("Cópia indisponível neste navegador.");}}
 return <section className="border rounded-xl p-3 space-y-3"><h3 className="font-bold">Segurança da viagem-piloto</h3>
 {identity&&<div className="rounded-lg bg-neutral-50 p-3"><p className="text-xs">Identificação registada na atribuição</p><strong>{identity.driver_name}</strong><p>{identity.make} {identity.model} · {identity.plate}</p><p className="text-xs">Confirma os dados. A fotografia do motorista não é disponibilizada por este módulo.</p></div>}
 {passenger&&ride.status==="arrived"&&<div className="rounded-lg bg-yellow-50 p-3 space-y-2"><h4 className="font-bold">PIN de início (teste)</h4>{pin?<><p className="text-2xl font-bold tracking-widest">{pin.attempts<5&&Date.parse(pin.expires_at)>Date.now()?pin.pin:"—"}</p><p className="text-xs">Validade: {new Date(pin.expires_at).toLocaleTimeString("pt-PT",{timeZone:"Africa/Maputo"})} · Tentativas restantes: {5-pin.attempts}</p></>:<p>PIN indisponível.</p>}<p className="text-xs">Mostra apenas ao motorista atribuído quando estiveres pronto para iniciar. Nunca partilhes em mensagens ou com terceiros.</p><button type="button" className="tw-secondary" onClick={()=>setRefresh(n=>n+1)}>Actualizar PIN</button> <button type="button" className="tw-secondary" disabled={busy} onClick={onRenew}>Renovar PIN</button><p className="text-xs">Renovação permitida após 60 segundos.</p></div>}
 {participant&&<><button type="button" className="tw-secondary" onClick={()=>void copy()}>Copiar resumo para partilhar</button><p className="text-xs">Sem PIN, telefone, endereços ou GPS. A cópia não envia mensagens automaticamente.</p><form className="space-y-2" onSubmit={e=>{e.preventDefault();void report();}}><label>Comunicar incidente de teste<textarea className="tw-field" required maxLength={2000} value={incident} onChange={e=>setIncident(e.target.value)}/></label><button className="tw-secondary" disabled={saving||!incident.trim()}>Registar incidente no suporte</button></form></>}
 <p className="tw-note">Não é serviço de emergência. Em perigo real, procura assistência local imediatamente. Não há SOS, localização partilhada em directo nem monitorização de emergência.</p>{message&&<p role="status" className="text-sm">{message}</p>}</section>;
}
