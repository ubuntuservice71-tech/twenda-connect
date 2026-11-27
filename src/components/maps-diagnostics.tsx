import {useState} from "react";
import {driverClient} from "./driver-shared";
import {autocompleteStreet,searchStreet,reverseStreet,calculateStreetRoute,loadGeoTiles,mapsErrorMessage} from "../lib/street-provider.functions";
import {searchLocalPlaces} from "./local-place-search";
import {visibleTiles} from "../lib/street-geometry";
import {launchCity} from "../lib/launch-city";
type Result={name:string;status:string;detail:string};
const center:[number,number]=[...launchCity.center];
export function MapsDiagnostics(){
 const [rows,setRows]=useState<Result[]>([]),[busy,setBusy]=useState(false),[last,setLast]=useState("");
 async function run(){setBusy(true);setRows([]);setLast("");const add=(name:string,status:string,detail:string)=>setRows(r=>[...r,{name,status,detail}]);let headers:Record<string,string>;
 try{const c=await driverClient();const s=await c.auth.getSession();if(s.error||!s.data.session)throw Error("session");const u=await c.auth.getUser();if(u.error||!u.data.user)throw Error("session");headers={Authorization:"Bearer "+s.data.session.access_token};add("Sessão Supabase","ok","Utilizador autenticado; servidor de Auth respondeu.");}catch(e){add("Sessão Supabase","erro",mapsErrorMessage(e));setBusy(false);return;}
 async function check(name:string,fn:()=>Promise<{status:string;detail:string}>){try{const r=await fn();add(name,r.status,r.detail);}catch(e){add(name,"erro",mapsErrorMessage(e));}}
 await check("Catálogo local",async()=>{const r=await searchLocalPlaces("Global");return {status:"ok",detail:r.length+" resultado(s) verificado(s) — zero também é válido."};});
 await check("Pesquisa Geoapify",async()=>{const r=await searchStreet({data:{query:"Aeroporto de Lichinga"},headers});return {status:r.status,detail:r.status==="ok"?r.places.length+" resultado(s)":r.reason??"Sem resposta válida"};});
 await check("Preenchimento automático",async()=>{const r=await autocompleteStreet({data:{query:"Lichinga"},headers});return {status:r.status,detail:r.status==="ok"?r.places.length+" resultado(s)":r.reason??"Sem resposta válida"};});
 await check("Nome a partir de coordenadas",async()=>{const r=await reverseStreet({data:{point:center},headers});return {status:r.status==="ok"&&!r.place?"sem resultado":r.status,detail:r.place?.label??r.reason??"Sem nome confirmado"};});
 for(const vehicle of ["car","motorcycle"] as const)await check(vehicle==="car"?"Rota carro":"Rota motociclo",async()=>{const r=await calculateStreetRoute({data:{from:center,to:[35.252,-13.292],vehicle},headers});return {status:r.status,detail:r.route?(r.route.distance/1000).toFixed(2)+" km · "+Math.ceil(r.route.duration/60)+" min":r.reason??"Sem rota válida"};});
 await check("Mosaico Geoapify",async()=>{const t=visibleTiles(center,13)[0];if(!t)throw Error();const r=await loadGeoTiles({data:{z:13,tiles:[{x:t.x,y:t.y}]},headers});return {status:r.status,detail:r.tiles.length+" imagem(ns) recebida(s)"};});
 setLast(new Date().toLocaleString("pt-PT"));setBusy(false);}
 return <section className="tw-panel space-y-3"><h2 className="font-bold text-xl">Diagnóstico operacional de mapas</h2><p className="tw-note">Teste real, apenas por acção explícita. Usa pontos públicos aproximados de Lichinga, nunca o GPS do administrador. Consome até 24 unidades da quota piloto; não mostra chaves, tokens nem dados privados. Não efectua corridas ou pagamentos.</p><button className="tw-primary" disabled={busy} onClick={()=>void run()}>{busy?"A verificar serviços…":"Executar diagnóstico real"}</button>{rows.map(r=><div key={r.name} className="border rounded-lg p-3"><strong>{r.name}</strong><p className="text-sm">{r.status==="ok"?"Resposta recebida":r.status} · {r.detail}</p></div>)}{last&&<p className="text-xs">Última execução nesta sessão: {last}</p>}<p className="text-xs">Um mapa OSM visível não prova que o Geoapify está activo. Resultados vazios devem ser avaliados separadamente de erros de ligação.</p></section>;
}
