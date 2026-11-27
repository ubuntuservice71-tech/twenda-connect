import {useEffect,useState} from "react";
import {MapPin,Search} from "lucide-react";
import {driverClient} from "./driver-shared";
import {autocompleteStreet,searchStreet,reverseStreet,mapsErrorMessage} from "../lib/street-provider.functions";
import type {Place} from "../lib/street-geometry";
import type {Point} from "../lib/geography";
async function headers(){const c=await driverClient();const s=await c.auth.getSession();if(!s.data.session)throw Error("session");return {Authorization:"Bearer "+s.data.session.access_token};}
export async function addressForPoint(p:Point){const r=await reverseStreet({data:{point:[p[0],p[1]]},headers:await headers()});return r.status==="ok"?r.place?.label??null:null;}
export function PlaceSuggestions({query,active,onPick}:{query:string;active:boolean;onPick:(p:Place)=>void}){
 const q=query.trim();const [result,setResult]=useState<{q:string;places:Place[];status:string;message?:string}|null>(null),[manual,setManual]=useState(0);
 useEffect(()=>{if(!active||q.length<3)return;let alive=true;setResult(null);const t=setTimeout(()=>{void (async()=>{try{const args={data:{query:q},headers:await headers()};const r=manual?await searchStreet(args):await autocompleteStreet(args);if(alive)setResult({q,status:r.status,places:r.places??[],message:r.reason==='budget'?'Não foi possível validar a quota no servidor.':r.reason==='provider'?'O fornecedor Geoapify não respondeu à pesquisa.':undefined});}catch(e){if(alive)setResult({q,status:"unavailable",places:[],message:mapsErrorMessage(e)});}})();},manual?0:550);return()=>{alive=false;clearTimeout(t);};},[active,q,manual]);
 useEffect(()=>{setManual(0);},[q,active]);
 if(!active||q.length<3)return null;
 const data=result?.q===q?result:null;
 return <div className="border-t border-neutral-100 bg-white px-3 py-2" aria-label="Sugestões de locais em Lichinga"><p className="text-xs font-semibold text-neutral-500 flex items-center gap-1"><Search size={13}/> Resultados em Lichinga</p>{!data?<p role="status" className="p-2 text-sm">A procurar locais…</p>:data.status==="ok"?<>{data.places.map((p,i)=><button key={p.label+i} type="button" className="w-full text-left flex items-start gap-3 border-b border-neutral-100 py-3 hover:bg-yellow-50 focus-visible:bg-yellow-50" onClick={()=>onPick(p)}><MapPin size={18} className="shrink-0 mt-1"/><span className="text-sm font-medium break-words">{p.label}</span></button>)}{!data.places.length&&<p role="status" className="text-sm py-2">Nenhum local encontrado. Tenta outro nome ou escolhe no mapa.</p>}<button type="button" className="text-sm font-semibold underline py-2" onClick={()=>setManual(n=>n+1)}>Pesquisar nome completo</button></>:<p role="status" className="text-sm py-2">{data.status==="limited"?"Limite diário de pesquisa atingido.":data.status==="unconfigured"?"Serviço de mapas ainda por configurar.":data.message??"Pesquisa indisponível. Escolhe no mapa ou tenta novamente."}</p>}<p className="text-xs text-neutral-500">Geoapify · OpenStreetMap</p>{data?.status==="unavailable"&&<button type="button" className="text-sm font-semibold underline py-2" onClick={()=>setManual(n=>n+1)}>Tentar novamente</button>}</div>;
}
