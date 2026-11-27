import { useState, useEffect } from "react";
import { driverClient } from "./driver-shared";
import { ArrowLeft, ChevronDown, Filter, Search, SlidersHorizontal, Plus } from "lucide-react";
import { adminModules } from "./admin-module-spec";

function parseField(raw:string) {
  const [name,rest=""]=raw.split(":");
  const [labelWithStar,type="text"]=name.split("@");
  return {label:labelWithStar.replace("*",""),required:labelWithStar.includes("*"),type,options:rest?rest.split(","):[]};
}
type Draft = Record<string,string>;
const defaultValues: Record<string,Draft> = { currency:{"Código":"MZN","Símbolo":"MT","Nome":"Metical moçambicano"}, appSettings:{"Nome da aplicação":"TWENDE"}, settings:{"Janela gratuita (s)":"120"}, types:{"Comissão (%)":"10"} };
export function AdminModule({id}:{id:string}) {
  const spec=adminModules.find(m=>m.id===id);
  const persistent=["promos","referrals","referralSettings","incentives","banners","notifications"].includes(id);
  const [ids,setIds]=useState<string[]>([]);
  const [busy,setBusy]=useState(false);
  const [ready,setReady]=useState(false);
  const [search,setSearch]=useState("");
  const [filterOpen,setFilterOpen]=useState(false);
  const [columnOpen,setColumnOpen]=useState(false);
  const [filters,setFilters]=useState<Draft>({});
  const [hidden,setHidden]=useState<string[]>([]);
  const [pageSize,setPageSize]=useState("10");
  const [page,setPage]=useState(0);
  const [draft,setDraft]=useState<Draft>(defaultValues[id]||{});
  const [rows,setRows]=useState<Draft[]>([]);
  const [editing,setEditing]=useState<number|null>(null);
  const [formOpen,setFormOpen]=useState(false);
  const [message,setMessage]=useState("");
  useEffect(()=>{let alive=true;if(!persistent)return;setReady(false);void (async()=>{try{const c=await driverClient();const r=await c.from("marketing_drafts").select("id,payload").eq("module",id).order("updated_at",{ascending:false});if(r.error)throw Error();if(!alive)return;const data=r.data??[];const mapped=data.map(x=>Object.fromEntries(Object.entries((x.payload??{}) as Record<string,unknown>).filter(([,v])=>typeof v==="string")) as Draft);setIds(data.map(x=>x.id));setRows(mapped);if(spec&&!spec.columns.length&&mapped[0])setDraft(mapped[0]);setReady(true);}catch{if(alive)setMessage("Não foi possível carregar os rascunhos. Reabre o módulo.");}})();return()=>{alive=false;};},[id,persistent]);
  if(!spec)return null;
  const isSettings=!spec.columns.length && spec.sections.length>0;
  const visible=spec.columns.filter(c=>!hidden.includes(c));
  const filtered=rows.map((row,index)=>({row,index})).filter(({row})=>Object.values(row).join(" ").toLocaleLowerCase().includes(search.toLocaleLowerCase())&&Object.entries(filters).every(([k,v])=>!v||!Object.hasOwn(row,k)||row[k]?.toLocaleLowerCase().includes(v.toLocaleLowerCase())));
  const maxPage=Math.max(0,Math.ceil(filtered.length/Number(pageSize))-1);
  const actualPage=Math.min(page,maxPage);
  const field=(raw:string,values:Draft,change:(key:string,value:string)=>void,filter=false)=>{
    const f=parseField(raw);const value=values[f.label]??"";
    return <label key={raw} className="block space-y-1 text-sm font-medium"><span>{f.label}{f.required&&!filter?" *":""}</span>
      {f.type==="unavailable"?<p className="rounded-lg bg-neutral-100 p-3 text-xs font-normal text-neutral-600">Integração pendente; indisponível nesta pré-visualização.</p>:f.options.length?<select className="tw-field" required={f.required&&!filter} value={value} onChange={e=>change(f.label,e.target.value)}><option value="">{filter?"Todos":"Seleccionar"}</option>{f.options.map(o=><option key={o}>{o}</option>)}</select>:f.type==="textarea"?<textarea className="tw-field min-h-28" required={f.required&&!filter} value={value} onChange={e=>change(f.label,e.target.value)} maxLength={2000}/>:<input className="tw-field" type={f.type} step={f.type==="number"?"any":undefined} required={f.required&&!filter} value={value} onChange={e=>change(f.label,e.target.value)} maxLength={160}/>}
    </label>;
  };
  const open=(index:number|null)=>{setEditing(index);setDraft(index===null?{...(defaultValues[id]||{})}:{...rows[index]});setFormOpen(true);setMessage("");};
  const save=async(another:boolean)=>{if(persistent){if(!ready||busy)return;setBusy(true);setMessage("");try{const c=await driverClient();const index=isSettings?0:editing;const payload={...draft};const target=index===null?undefined:ids[index];const r=target?await c.from("marketing_drafts").update({payload}).eq("id",target).select("id").single():await c.from("marketing_drafts").insert({module:id,payload}).select("id").single();if(r.error)throw Error();if(target){setRows(prev=>prev.map((x,i)=>i===index?payload:x));}else{setIds(prev=>[r.data.id,...prev]);setRows(prev=>[payload,...prev]);}setMessage("Rascunho guardado no Supabase. Nenhuma campanha activada.");if(!isSettings){setDraft({...defaultValues[id]});setEditing(null);setFormOpen(another);setPage(0);}}catch{setMessage("Não foi possível guardar o rascunho.");}finally{setBusy(false);}return;}if(isSettings){setMessage("Rascunho mantido apenas neste ecrã. Nenhuma configuração real foi alterada.");return;}setRows(prev=>editing===null?[...prev,{...draft}]:prev.map((x,i)=>i===editing?{...draft}:x));setMessage("Registo fictício guardado nesta sessão do módulo.");setDraft({...defaultValues[id]});setEditing(null);setFormOpen(another);setPage(0);};
  return <section className="space-y-4">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-bold">{spec.title}</h2><p className="text-sm text-neutral-600 mt-1">{spec.note}</p></div>{spec.sections.length>0&&!isSettings&&!formOpen&&<button type="button" className="tw-primary flex items-center gap-2" onClick={()=>open(null)}><Plus size={18}/>Novo rascunho</button>}</div>
    {spec.approval&&<p className="tw-note">Requer aprovação das regras comerciais. Nenhuma campanha activa.</p>}
    <p className="text-xs text-neutral-600">{persistent?"Rascunhos administrativos persistentes. Não introduzas dados pessoais, credenciais ou contactos reais; não são enviados anúncios nem atribuídas recompensas.":"Utiliza apenas dados fictícios. Os rascunhos ficam na memória deste módulo e desaparecem ao mudar de página. Nenhum dado é enviado ao servidor."}</p>
    {message&&<p role="status" className="tw-note">{message}</p>}
    {(formOpen||isSettings)&&<form className="tw-panel space-y-5" onSubmit={e=>{e.preventDefault();void save((e.nativeEvent as SubmitEvent).submitter?.getAttribute("data-another")==="true");}}>
      <div className="flex justify-between items-center gap-3"><h3 className="text-lg font-bold">{isSettings?"Configuração demonstrativa":editing!==null?"Editar rascunho":"Novo rascunho"}</h3>{!isSettings&&<button type="button" className="tw-secondary flex items-center gap-2" onClick={()=>setFormOpen(false)}><ArrowLeft size={16}/>Voltar</button>}</div>
      {spec.sections.map(section=><fieldset className="border border-neutral-200 rounded-xl p-4 space-y-3" key={section.title}><legend className="font-semibold px-2">{section.title}</legend><div className="grid gap-4 sm:grid-cols-2">{section.fields.map(raw=>field(raw,draft,(key,value)=>setDraft(prev=>({...prev,[key]:value}))))}</div></fieldset>)}
      <div className="flex flex-wrap gap-2"><button className="tw-primary" type="submit" disabled={persistent&&(!ready||busy)}>Guardar rascunho</button>{!isSettings&&editing===null&&<button className="tw-secondary" type="submit" data-another="true" disabled={persistent&&(!ready||busy)}>Guardar e criar outro</button>}<button type="button" className="tw-secondary" onClick={()=>{setDraft({...defaultValues[id]});setMessage("");setFormOpen(false);}}>Cancelar / repor</button></div>
    </form>}
    {spec.columns.length>0&&!formOpen&&<article className="tw-panel !p-0 overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-neutral-200">
        <label className="relative flex-1 min-w-[160px]"><span className="sr-only">Pesquisar registos</span><Search size={16} className="absolute left-3 top-4 text-neutral-500"/><input className="tw-field !pl-9 !mt-0" placeholder="Pesquisar" value={search} onChange={e=>{setSearch(e.target.value);setPage(0);}}/></label>
        {!!spec.filters.length&&<button type="button" aria-expanded={filterOpen} className="tw-secondary flex gap-2 items-center" onClick={()=>setFilterOpen(v=>!v)}><Filter size={17}/>Filtros</button>}
        <button type="button" aria-expanded={columnOpen} className="tw-secondary flex gap-2 items-center" onClick={()=>setColumnOpen(v=>!v)}><SlidersHorizontal size={17}/>Colunas</button>
      </div>
      {filterOpen&&<div className="p-4 border-b border-neutral-200"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{spec.filters.map(raw=>field(raw,filters,(key,value)=>{setFilters(prev=>({...prev,[key]:value}));setPage(0);},true))}</div><button type="button" className="tw-secondary mt-3" onClick={()=>{setFilters({});setPage(0);}}>Limpar filtros</button><p className="text-xs text-neutral-500 mt-2">Filtros aplicam-se aos campos existentes nos rascunhos; filtros de dados reais aguardam integração.</p></div>}
      {columnOpen&&<div className="p-4 border-b border-neutral-200 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{spec.columns.map(c=><label key={c} className="flex gap-2 items-center text-sm"><input type="checkbox" checked={!hidden.includes(c)} disabled={visible.length===1&&!hidden.includes(c)} onChange={e=>setHidden(prev=>e.target.checked?prev.filter(x=>x!==c):[...prev,c])}/>{c}</label>)}</div>}
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-neutral-50"><tr>{visible.map(c=><th key={c} scope="col" className="whitespace-nowrap font-semibold p-3">{c}</th>)}{spec.sections.length>0&&<th scope="col" className="p-3">Acções</th>}</tr></thead><tbody>{filtered.slice(actualPage*Number(pageSize),(actualPage+1)*Number(pageSize)).map(({row,index})=><tr key={index} className="border-t border-neutral-100">{visible.map(c=><td key={c} className="p-3">{row[c]||"—"}</td>)}{spec.sections.length>0&&<td className="p-3"><div className="flex gap-2"><button type="button" className="tw-secondary !min-h-9 !p-2 text-xs" onClick={()=>open(index)}>Editar</button><button type="button" className="tw-secondary !min-h-9 !p-2 text-xs" disabled={persistent&&(!ready||busy)} onClick={async()=>{if(persistent){if(!window.confirm("Eliminar este rascunho?"))return;setBusy(true);try{const c=await driverClient();const r=await c.from("marketing_drafts").delete().eq("id",ids[index]).select("id").single();if(r.error)throw Error();setIds(prev=>prev.filter((_,i)=>i!==index));}catch{setMessage("Não foi possível remover.");return;}finally{setBusy(false);}}setRows(prev=>prev.filter((_,i)=>i!==index));setMessage("Rascunho removido.");}}>Remover</button></div></td>}</tr>)}{!filtered.length&&<tr><td colSpan={visible.length+(spec.sections.length?1:0)} className="p-10 text-center text-neutral-500">{persistent?"Sem rascunhos carregados.":"Nenhum registo de demonstração encontrado. Dados reais ainda não ligados."}</td></tr>}</tbody></table></div>
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 text-xs text-neutral-600 border-t border-neutral-200"><span>{filtered.length} rascunhos</span><label>Por página <select className="border rounded-md bg-white p-2" value={pageSize} onChange={e=>{setPageSize(e.target.value);setPage(0);}}>{["10","25","50"].map(n=><option key={n}>{n}</option>)}</select></label><div className="flex items-center gap-2"><button type="button" className="tw-secondary !min-h-8 !p-2 disabled:opacity-40" disabled={actualPage===0} onClick={()=>setPage(actualPage-1)}>Anterior</button><span>{actualPage+1} / {maxPage+1}</span><button type="button" className="tw-secondary !min-h-8 !p-2 disabled:opacity-40" disabled={actualPage===maxPage} onClick={()=>setPage(actualPage+1)}>Seguinte</button></div></div>
    </article>}
    {spec.actions.length>0&&<details className="tw-panel !p-4"><summary className="font-semibold flex items-center gap-2 cursor-pointer">Acções previstas na versão operacional <ChevronDown size={15}/></summary><div className="flex flex-wrap gap-2 mt-3">{spec.actions.map(action=><span key={action} className="text-xs bg-neutral-100 rounded-full px-3 py-1">{action}</span>)}</div><p className="text-xs text-neutral-600 mt-2">A disponibilidade das acções reais depende de integração, autorização e validação no servidor.</p></details>}
  </section>;
}
