import {useState,type MouseEvent} from "react";
import {isPoint,type Point,formatCoordinates,parseCoordinates,parseVertices,validPolygon} from "../lib/geography";
type Marker={id:string;point:Point;label:string};
export function CoordinatePanel({center,markers=[],vertices=[],onPick,connect=false}:{center:Point;markers?:Marker[];vertices?:Point[];onPick?:(p:Point)=>void;connect?:boolean}){
 const [zoom,setZoom]=useState(1);
 const span=.2/zoom,cos=Math.max(.1,Math.cos(center[1]*Math.PI/180)),lonSpan=span*1.5/cos;
 const project=(p:Point)=>[150+(p[0]-center[0])*300/lonSpan,100-(p[1]-center[1])*200/span] as const;
 function click(e:MouseEvent<SVGSVGElement>){if(!onPick)return;const box=e.currentTarget.getBoundingClientRect();const x=(e.clientX-box.left)/box.width*300,y=(e.clientY-box.top)/box.height*200;const p=[Number((center[0]+(x-150)*lonSpan/300).toFixed(6)),Number((center[1]-(y-100)*span/200).toFixed(6))];if(isPoint(p))onPick(p);}
 return <div className="space-y-2"><div className="flex flex-wrap gap-2 items-center"><button type="button" className="tw-secondary" disabled={zoom<=.25} onClick={()=>setZoom(z=>z/2)}>− Afastar</button><button type="button" className="tw-secondary" disabled={zoom>=32} onClick={()=>setZoom(z=>z*2)}>+ Aproximar</button><span className="text-xs">Centro: {formatCoordinates(center)}</span></div><svg viewBox="0 0 300 200" preserveAspectRatio="none" className={"w-full aspect-[3/2] rounded-xl border bg-neutral-50 "+(onPick?"cursor-crosshair":"")} onClick={click} role="img" aria-label="Grelha de coordenadas sem mapa de ruas">
 {Array.from({length:11},(_,i)=><g key={i}><path d={"M"+i*30+" 0V200 M0 "+i*20+"H300"} stroke="#d4d4d4" strokeWidth=".5"/></g>)}
 <path d="M150 0V200 M0 100H300" stroke="#a3a3a3" strokeDasharray="3 3"/>
 {vertices.length>=2&&<polygon points={vertices.map(p=>project(p).join(",")).join(" ")} fill="#ffbf0033" stroke="#b77900" strokeWidth="1.5"/>}
 {vertices.map((p,i)=><circle key={i} cx={project(p)[0]} cy={project(p)[1]} r="3" fill="#b77900"/>)}
 {connect&&markers.length===2&&<line x1={project(markers[0]!.point)[0]} y1={project(markers[0]!.point)[1]} x2={project(markers[1]!.point)[0]} y2={project(markers[1]!.point)[1]} stroke="#171717" strokeDasharray="4 3"/>}
 {markers.map(m=><g key={m.id}><circle cx={project(m.point)[0]} cy={project(m.point)[1]} r="4" fill="#ffbf00" stroke="#171717"/><title>{m.label}</title></g>)}
 <text x="8" y="14" fontSize="9" fill="#525252">N ↑</text><text x="8" y="192" fontSize="8" fill="#525252">Grelha geográfica · sem ruas</text></svg><p className="text-xs text-neutral-600">Sem mapas externos. A grelha não mostra ruas, trânsito ou obstáculos. {onPick?"Clica para escolher uma coordenada ou usa o campo de texto.":""}</p></div>;
}
export function ZoneEditor({center,text,onChange,readOnly}:{center:Point;text:string;onChange:(s:string)=>void;readOnly:boolean}){
 const [draw,setDraw]=useState(false),[manual,setManual]=useState("");
 const points=parseVertices(text);const vertices=points??[];
 function append(p:Point){if(!points||vertices.length>=100||vertices.some(v=>v[0]===p[0]&&v[1]===p[1]))return;onChange(JSON.stringify([...vertices,p]));}
 return <div className="space-y-2"><CoordinatePanel center={center} vertices={vertices} {...(!readOnly&&draw?{onPick:append}:{})}/>{!readOnly&&<><div className="flex flex-wrap gap-2"><button type="button" className="tw-primary" onClick={()=>setDraw(v=>!v)}>{draw?"Terminar desenho":"Desenhar polígono"}</button><button type="button" className="tw-secondary" disabled={!vertices.length} onClick={()=>onChange(JSON.stringify(vertices.slice(0,-1)))}>Desfazer vértice</button><button type="button" className="tw-secondary" onClick={()=>{if(window.confirm("Limpar os vértices do rascunho?"))onChange("");}}>Limpar tudo</button></div><label className="text-sm">Adicionar vértice (latitude, longitude)<input className="tw-field" value={manual} onChange={e=>setManual(e.target.value)}/></label><button type="button" className="tw-secondary" disabled={!parseCoordinates(manual)} onClick={()=>{const p=parseCoordinates(manual);if(p){append(p);setManual("");}}}>Adicionar coordenada</button></>}<p role="status" className="text-sm">{points===null?"Coordenadas inválidas.":vertices.length===0?"Sem limites definidos.":validPolygon(vertices)?vertices.length+" vértices — polígono válido na interface.":vertices.length+" vértices — completa um polígono sem cruzamentos."}</p></div>;
}
