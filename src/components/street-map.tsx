import {useState} from "react";
import {launchCity} from "../lib/launch-city";
import {formatCoordinates,type Point} from "../lib/geography";
import {project,unproject,visibleTiles} from "../lib/street-geometry";
const W=480,H=320;
const template=import.meta.env["VITE_TWENDE_TILE_URL"] as string|undefined;
const tileUrl=template&&template.startsWith("https://")&&["{z}","{x}","{y}"].every(k=>template.includes(k))?template:"https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const defaultCenter=launchCity.center;
export function StreetMap({start,end,route=[],onPick}:{start:Point|null;end:Point|null;route?:Point[];onPick:(p:Point)=>void}){
 const [enabled,setEnabled]=useState(false),[center,setCenter]=useState<Point>(start??end??defaultCenter),[zoom,setZoom]=useState(13),[failure,setFailure]=useState(false);
 const [x,y]=project(center,zoom);const screen=(p:Point)=>{const a=project(p,zoom);return [a[0]-x+W/2,a[1]-y+H/2];};
 const pan=(dx:number,dy:number)=>setCenter(unproject([x+dx,y+dy],zoom));
 if(!enabled)return <div className="rounded-xl border p-3 space-y-2"><strong>Mapa de ruas</strong><p className="text-xs">Ao abrir, o fornecedor de cartografia recebe a área visualizada e dados técnicos do navegador. Não abras se não pretenderes partilhar essa área. O mapa público OSM é apenas para testes moderados.</p><button type="button" className="tw-secondary" onClick={()=>{setCenter(start??end??launchCity.center);setEnabled(true);}}>Abrir mapa de teste</button></div>;
 return <div className="space-y-2"><div className="flex flex-wrap gap-2"><button type="button" className="tw-secondary" disabled={zoom<=3} onClick={()=>setZoom(z=>z-1)}>−</button><button type="button" className="tw-secondary" disabled={zoom>=18} onClick={()=>setZoom(z=>z+1)}>+</button>{[["Norte",0,-120],["Sul",0,120],["Oeste",-120,0],["Este",120,0]].map(([label,dx,dy])=><button key={label} type="button" className="tw-secondary" onClick={()=>pan(Number(dx),Number(dy))}>{label}</button>)}<button type="button" className="tw-secondary" disabled={!start} onClick={()=>{if(start)setCenter(start);}}>Centrar partida</button><button type="button" className="tw-secondary" disabled={!end} onClick={()=>{if(end)setCenter(end);}}>Centrar destino</button></div>
 <div className="relative overflow-hidden rounded-xl border bg-neutral-100 aspect-[3/2]">
 {visibleTiles(center,zoom,W,H).map(t=><img key={zoom+"/"+t.x+"/"+t.y} alt="" draggable={false} referrerPolicy="strict-origin-when-cross-origin" onError={()=>setFailure(true)} src={tileUrl.replace("{z}",String(zoom)).replace("{x}",String(t.x)).replace("{y}",String(t.y))} className="absolute max-w-none select-none pointer-events-none" style={{left:t.left/W*100+"%",top:t.top/H*100+"%",width:256/W*100+"%",height:256/H*100+"%"}}/>)}
 <svg viewBox="0 0 480 320" preserveAspectRatio="none" className="absolute inset-0 h-full w-full cursor-crosshair" role="img" aria-label="Mapa de ruas, selecção de ponto" onClick={e=>{const b=e.currentTarget.getBoundingClientRect();const p=unproject([x-W/2+(e.clientX-b.left)/b.width*W,y-H/2+(e.clientY-b.top)/b.height*H],zoom);onPick(p);}}>
 {route.length>1&&<polyline points={route.map(p=>screen(p).join(",")).join(" ")} fill="none" stroke="#171717" strokeWidth="5" strokeLinejoin="round"/>}
 {[start,end].map((p,i)=>p&&<g key={i}><circle cx={screen(p)[0]} cy={screen(p)[1]} r="9" stroke="#171717" strokeWidth="2" fill={i?"#FFBF00":"white"}/><title>{i?"Destino":"Partida"}</title></g>)}
 <path d="M232 160H248M240 152V168" stroke="#171717" strokeWidth="1.5"/></svg>
 <a className="absolute bottom-0 right-0 bg-white px-1 text-[10px] underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a></div>
 {failure&&<p role="status" className="text-xs">Alguns mosaicos não carregaram. Não uses zonas em branco como referência.</p>}<p className="text-xs">Centro: {formatCoordinates(center)}. Escolhe um ponto no mapa ou usa o centro. Lichinga é o centro inicial quando não existem coordenadas escolhidas. Não define a tua localização.</p><button type="button" className="tw-secondary" onClick={()=>onPick(center)}>Usar centro do mapa</button> <button type="button" className="tw-secondary" onClick={()=>setEnabled(false)}>Fechar mapa</button></div>;
}
