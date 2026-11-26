import { useState } from "react";

const documents = ["Bilhete de identidade", "Carta de condução válida", "Fotografia do motorista", "Livrete do veículo", "Título de propriedade ou autorização de uso", "Seguro válido", "Fotografias do veículo", "Licença de transporte aplicável", "Número de telefone verificado", "Certificado de registo criminal"];
const panel = "tw-panel space-y-4";
const primary = "tw-primary disabled:opacity-40";
const field = "tw-field";
const initial = { commission: 10, freeMinutes: 2, waitMinutes: 5, cancellationFee: "", absenceFee: "" };

export function AdminPreview() {
  const [tab, setTab] = useState("overview");
  const [checked, setChecked] = useState<string[]>([]);
  const [status, setStatus] = useState("Pendente");
  const [settings, setSettings] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [notice, setNotice] = useState("");
  const tabs = [{id:"overview",label:"Resumo"},{id:"drivers",label:"Motoristas"},{id:"rides",label:"Corridas"},{id:"wallet",label:"Carteiras"},{id:"settings",label:"Configurações"}];
  return (
    <section className="space-y-5 mb-6">
      <p className="tw-note">Painel demonstrativo · Dados fictícios · Sem permissões administrativas reais.</p>
      <nav aria-label="Módulos administrativos" className="flex flex-wrap gap-2">{tabs.map(t => <button type="button" key={t.id} aria-pressed={tab===t.id} onClick={()=>setTab(t.id)} className={tab===t.id?primary:"tw-secondary"}>{t.label}</button>)}</nav>
      {tab==="overview" && <div className="grid gap-3 sm:grid-cols-2">{[["Motoristas pendentes",status==="Pendente"?"1":"0"],["Motoristas aprovados",status==="Aprovado"?"1":"0"],["Corridas simuladas","1"],["Comissão configurada",saved.commission+"%"]].map(([label,value])=><article key={label} className={panel}><p>{label}</p><strong className="text-3xl tw-money">{value}</strong></article>)}</div>}
      {tab==="drivers" && <article className={panel}>
        <h2 className="text-xl font-bold">Candidatura de motorista fictício</h2><p>Estado: {status}</p><p className="text-sm">Simula a verificação de cada requisito antes de aprovar.</p>
        {documents.map(doc=><label key={doc} className="flex gap-3 items-center min-h-11 py-2 border-b border-neutral-100"><input type="checkbox" disabled={status!=="Pendente"} checked={checked.includes(doc)} onChange={e=>setChecked(prev=>e.target.checked?[...prev,doc]:prev.filter(x=>x!==doc))}/>{doc}</label>)}
        <div><p className="text-sm">{checked.length} de {documents.length} requisitos verificados</p><progress className="w-full h-2 accent-neutral-900" value={checked.length} max={documents.length} aria-label="Progresso de verificação" /></div>
        {status==="Pendente"?<div className="flex flex-wrap gap-2"><button type="button" className={primary} disabled={checked.length!==documents.length} onClick={()=>setStatus("Aprovado")}>Aprovar</button><button type="button" className="tw-secondary" onClick={()=>setStatus("Rejeitado")}>Rejeitar</button></div>:<button type="button" className={primary} onClick={()=>{setStatus("Pendente");setChecked([]);}}>Reiniciar demonstração</button>}
      </article>}
      {tab==="rides" && <article className={panel}><h2 className="text-xl font-bold">Corrida fictícia #001</h2><p>Bairro da Natite → Aeroporto</p><p>Valor: 120,00 MT</p><p>Estado: concluída (exemplo)</p><p>Comissão estimada: {(120*saved.commission/100).toFixed(2)} MT</p></article>}
      {tab==="wallet" && <article className={panel}><h2 className="text-xl font-bold">Carteira pré-paga demonstrativa</h2><p>Motorista fictício</p><strong className="text-3xl tw-money">500,00 MT</strong><p>Comissão configurada: {saved.commission}%</p><p className="text-sm">Nenhuma operação financeira real disponível.</p></article>}
      {tab==="settings" && <form className={panel} onSubmit={e=>{e.preventDefault();setSaved({...settings});setNotice("Configurações guardadas apenas nesta demonstração.");}}>
        <h2 className="text-xl font-bold">Regras da plataforma</h2>
        {([{key:"commission",label:"Comissão (%)",max:100},{key:"freeMinutes",label:"Cancelamento gratuito após confirmação (minutos)",max:1440},{key:"waitMinutes",label:"Espera por ausência do passageiro (minutos)",max:1440}] as const).map(({key,label,max})=><label key={key} className="block">{label}<input className={field} type="number" min="0" max={max} step={key==="commission"?"0.01":"1"} required value={settings[key]} onChange={e=>{setSettings(prev=>({...prev,[key]:e.target.valueAsNumber}));setNotice("");}}/></label>)}
        {([{key:"cancellationFee",label:"Taxa após chegada do motorista (MT)"},{key:"absenceFee",label:"Taxa por ausência (MT)"}] as const).map(({key,label})=><label key={key} className="block">{label}<input className={field} type="number" min="0" step="0.01" placeholder="Por definir" value={settings[key]} onChange={e=>{setSettings(prev=>({...prev,[key]:e.target.value}));setNotice("");}}/></label>)}
        <p className="text-sm">Cancelamento gratuito antes da atribuição; sem penalização por segurança; advertência por cancelamentos abusivos; direito de contestação.</p>
        <button className={primary}>Guardar configurações simuladas</button><p aria-live="polite">{notice}</p>
      </form>}
    </section>
  );
}
