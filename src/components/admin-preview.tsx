import { useState } from "react";
import { ArrowLeft, ArrowRight, LayoutDashboard, CalendarDays, MapPin, Map, CreditCard, CarFront, Users, Navigation, Wallet, FileCheck, Gift, MessageSquare, Ticket, Settings, Search, Menu, X, Tag, Clock, ShieldCheck } from "lucide-react";

const groups = [
  { title: "Visão geral", items: [{id:"overview",label:"Dashboard",icon:LayoutDashboard},{id:"rides",label:"Corridas / reservas",icon:CalendarDays}] },
  { title: "Gestão de localização", items: [{id:"cities",label:"Cidades",icon:MapPin},{id:"zones",label:"Zonas",icon:Map}] },
  { title: "Subscrições · por aprovar", items: [{id:"plans",label:"Planos de subscrição",icon:CreditCard},{id:"subscriptions",label:"Subscrições de motoristas",icon:CreditCard}] },
  { title: "Configuração de corridas", items: [{id:"types",label:"Tipos de corrida",icon:CarFront},{id:"settings",label:"Políticas de cancelamento",icon:Settings}] },
  { title: "Gestão de utilizadores", items: [{id:"drivers",label:"Motoristas",icon:Users},{id:"customers",label:"Passageiros",icon:Users}] },
  { title: "Gestão de motoristas", items: [{id:"tracking",label:"Rastreamento de motoristas",icon:Navigation},{id:"cash",label:"Pontos de cobrança",icon:Wallet},{id:"documents",label:"Documentação",icon:FileCheck},{id:"incentives",label:"Incentivos",icon:Gift},{id:"withdrawals",label:"Pedidos de levantamento",icon:Wallet},{id:"driverTickets",label:"Ocorrências de motoristas",icon:Ticket}] },
  { title: "Finanças e marketing", items: [{id:"wallet",label:"Carteiras e comissões",icon:Wallet},{id:"promos",label:"Códigos promocionais",icon:Tag},{id:"referrals",label:"Bónus por indicação",icon:Gift}] },
  { title: "Atendimento e segurança", items: [{id:"messages",label:"Conversas e mensagens",icon:MessageSquare},{id:"tickets",label:"Tickets de suporte",icon:Ticket},{id:"appeals",label:"Contestações",icon:ShieldCheck},{id:"audit",label:"Auditoria",icon:Clock}] },
];
const allItems=groups.flatMap(g=>g.items);
const metrics = [
  {label:"Comissão de hoje",help:"Receitas da plataforma",module:"wallet"},
  {label:"Ganhos dos motoristas hoje",help:"Após comissão",module:"wallet"},
  {label:"Pagamentos pendentes",help:"Pedidos por liquidar",module:"withdrawals"},
  {label:"Promoções utilizadas hoje",help:"Descontos aplicados",module:"promos"},
  {label:"Códigos promocionais activos",help:"Códigos válidos",module:"promos"},
  {label:"Bónus de indicação pendentes",help:"Por processar",module:"referrals"},
  {label:"Total de conversas",help:"Conversas associadas a corridas",module:"messages"},
  {label:"Conversas abertas",help:"Atendimento activo",module:"messages"},
  {label:"Mensagens não lidas",help:"Aguardam resposta",module:"messages"},
  {label:"Mensagens urgentes",help:"Prioridade elevada",module:"messages"},
  {label:"Mensagens de hoje",help:"Recebidas hoje",module:"messages"},
  {label:"Mensagens desta semana",help:"Recebidas esta semana",module:"messages"},
  {label:"Mensagens deste mês",help:"Recebidas este mês",module:"messages"},
  {label:"Tempo médio de resposta",help:"Desempenho do atendimento",module:"messages"},
  {label:"Tickets abertos",help:"Ocorrências em análise",module:"tickets"},
  {label:"Tickets que exigem atenção",help:"Sem resposta há 24h",module:"tickets"},
  {label:"Tickets não atribuídos",help:"Sem agente responsável",module:"tickets"},
];
const pending: Record<string,{description:string;columns:string[];approval?:boolean}> = {
  plans:{description:"Gestão de planos, preços e condições. A TWENDE mantém o modelo aprovado de comissão por corrida até existir outra decisão.",columns:["Plano","Preço","Periodicidade","Estado"],approval:true},
  subscriptions:{description:"Consulta e gestão de subscrições de motoristas, caso este modelo seja aprovado.",columns:["Motorista","Plano","Início","Estado"],approval:true},
  customers:{description:"Consultar perfis, histórico de corridas e estado das contas dos passageiros.",columns:["Passageiro","Contacto","Corridas","Estado"]},
  tracking:{description:"Visualizar motoristas disponíveis e corridas activas num mapa em tempo real. O GPS ainda não está integrado.",columns:["Motorista","Veículo","Última localização","Disponibilidade"]},
  cash:{description:"Gerir pontos de cobrança ou carregamento presencial, caso sejam aprovados.",columns:["Ponto","Cidade","Responsável","Estado"],approval:true},
  incentives:{description:"Gerir campanhas de incentivo e critérios de elegibilidade após aprovação comercial.",columns:["Campanha","Critério","Valor","Estado"],approval:true},
  withdrawals:{description:"Analisar pedidos de levantamento caso o modelo de carteira venha a permitir levantamentos. Não há movimentações reais.",columns:["Pedido","Motorista","Montante","Estado"],approval:true},
  driverTickets:{description:"Receber ocorrências e acompanhar a resolução dos problemas comunicados pelos motoristas.",columns:["Ocorrência","Motorista","Prioridade","Estado"]},
  promos:{description:"Gerir códigos, validade e descontos após aprovação das regras comerciais.",columns:["Código","Desconto","Validade","Estado"],approval:true},
  referrals:{description:"Gerir indicações e recompensas após aprovação das regras comerciais.",columns:["Referência","Beneficiário","Bónus","Estado"],approval:true},
  messages:{description:"Centralizar conversas de corridas, mensagens urgentes e respostas do atendimento.",columns:["Conversa","Participante","Última mensagem","Estado"]},
  tickets:{description:"Organizar tickets de suporte por prioridade, responsável e estado de resolução.",columns:["Ticket","Assunto","Responsável","Estado"]},
  appeals:{description:"Analisar contestações de penalizações e cancelamentos, respeitando a política aprovada.",columns:["Contestação","Motivo","Data","Estado"]},
  audit:{description:"Consultar o registo de actividades administrativas com acesso restrito.",columns:["Acção","Responsável","Entidade","Data"]},
};


const documents = ["Bilhete de identidade", "Carta de condução válida", "Fotografia do motorista", "Livrete do veículo", "Título de propriedade ou autorização de uso", "Seguro válido", "Fotografias do veículo", "Licença de transporte aplicável", "Número de telefone verificado", "Certificado de registo criminal"];
const panel = "tw-panel space-y-4";
const primary = "tw-primary disabled:opacity-40";
const field = "tw-field";
const initial = { commission: 10, freeMinutes: 2, waitMinutes: 5, cancellationFee: "", absenceFee: "" };

export function AdminPreview({onBack}: {onBack?: () => void}) {
  const [tab, setTab] = useState("overview");
  const [checked, setChecked] = useState<string[]>([]);
  const [status, setStatus] = useState("Pendente");
  const [settings, setSettings] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [notice, setNotice] = useState("");
  const [query,setQuery]=useState("");
  const [menu,setMenu]=useState(false);
  const [catalog,setCatalog]=useState<Record<string,string[]>>({cities:[],zones:[],types:["Carro","Motociclo"]});
  const [draft,setDraft]=useState("");
  const [catalogError,setCatalogError]=useState("");
  const selected=allItems.find(item=>item.id===tab);
  const changeTab=(id:string)=>{setTab(id);setMenu(false);setDraft("");setCatalogError("");};
  const filtered=groups.map(g=>({...g,items:g.items.filter(i=>i.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))})).filter(g=>g.items.length);
  const isCatalog=tab==="cities"||tab==="zones"||tab==="types";
  const info=pending[tab];
  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-neutral-200 bg-white px-4 py-2 sm:px-6">
        <div className="flex items-center gap-3">
          <button type="button" className="lg:hidden tw-secondary" aria-label={menu?"Fechar menu":"Abrir menu"} aria-expanded={menu} onClick={()=>setMenu(v=>!v)}>{menu?<X size={20}/>:<Menu size={20}/>}</button>
          <span className="text-xl font-extrabold tracking-tight flex items-center gap-2"><span className="w-2.5 h-6 bg-yellow-400 rounded-sm" aria-hidden="true"/>TWENDE</span>
          <span className="hidden sm:inline text-sm text-neutral-500 border-l pl-3">Administração</span>
        </div>
        <button type="button" onClick={onBack} className="tw-secondary flex items-center gap-2 text-sm"><ArrowLeft size={16}/> <span>Voltar</span></button>
      </header>
      <div className="lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
        <aside className={`${menu?"block":"hidden"} lg:block lg:sticky lg:top-[65px] lg:h-[calc(100dvh-65px)] overflow-y-auto border-r border-neutral-200 bg-white p-3`}>
          <label className="relative block"><span className="sr-only">Pesquisar módulo</span><Search size={16} className="absolute left-3 top-4 text-neutral-500"/><input className="tw-field !pl-9 !mt-0 text-sm" placeholder="Pesquisar módulo" value={query} onChange={e=>setQuery(e.target.value)}/></label>
          <nav aria-label="Menu administrativo" className="space-y-5 mt-4">
            {filtered.map(g=><div key={g.title}><p className="px-2 pb-1 text-xs font-semibold text-neutral-500">{g.title}</p>{g.items.map(({id,label,icon:Icon})=><button key={id} type="button" aria-current={tab===id?"page":undefined} onClick={()=>changeTab(id)} className={`w-full flex items-center gap-3 text-left rounded-lg px-3 py-2 text-sm ${tab===id?"bg-yellow-100 font-bold text-neutral-900":"text-neutral-700 hover:bg-neutral-100"}`}><Icon size={17} className="shrink-0" aria-hidden="true"/><span>{label}</span></button>)}</div>)}
            {!filtered.length&&<p className="text-sm text-neutral-500 px-2">Nenhum módulo encontrado.</p>}
          </nav>
        </aside>
        <main className="min-w-0 p-4 sm:p-6 lg:p-8 space-y-5 max-w-[1600px] w-full">
          <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-semibold text-neutral-500">Administração / {selected?.label}</p><h1 className="text-3xl font-bold mt-1">{selected?.label}</h1></div><span className="rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-semibold">Ambiente de demonstração</span></div>
          <p className="tw-note">Pré-visualização pública, sem acesso a dados reais ou privilégios administrativos. Os indicadores não ligados à base de dados aparecem como “—”.</p>
          {tab==="overview" && <>
            <h2 className="text-lg font-bold">Indicadores de operação</h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {metrics.map(m=><button type="button" key={m.label} onClick={()=>changeTab(m.module)} className="tw-panel !p-4 flex flex-col items-start text-left gap-2 hover:border-neutral-500"><span className="text-sm text-neutral-600">{m.label}</span><strong className="text-2xl tw-money">—</strong><span className="text-xs text-neutral-500">{m.help} · Não ligado</span><span className="mt-auto flex items-center gap-1 text-xs font-semibold">Ver módulo <ArrowRight size={13}/></span></button>)}
            </div>
            <h2 className="text-lg font-bold">Simulação e regras iniciais</h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[["Candidaturas pendentes",status==="Pendente"?"1":"0"],["Motoristas aprovados",status==="Aprovado"?"1":"0"],["Corridas simuladas","1"],["Comissão configurada",saved.commission+"%"]].map(([label,value])=><article key={label} className={panel}><p className="text-sm text-neutral-600">{label}</p><strong className="text-2xl tw-money">{value}</strong></article>)}</div>
          </>}
          {isCatalog && <section className={panel}>
            <h2 className="text-xl font-bold">Catálogo de {selected?.label.toLocaleLowerCase()}</h2><p className="text-sm text-neutral-600">Adicionar e remover registos nesta demonstração local. Não altera a base de dados nem activa serviços.</p>
            <form className="flex flex-wrap items-end gap-3" onSubmit={e=>{e.preventDefault();const name=draft.trim();if(!name)return;if((catalog[tab]||[]).some(n=>n.toLocaleLowerCase()===name.toLocaleLowerCase())){setCatalogError("Já existe um registo com esse nome.");return;}setCatalog(prev=>({...prev,[tab]:[...(prev[tab]||[]),name]}));setDraft("");setCatalogError("");}}><label className="flex-1 min-w-[180px]">Nome<input className={field} maxLength={100} required value={draft} onChange={e=>{setDraft(e.target.value);setCatalogError("");}}/></label><button className={primary} disabled={!draft.trim()}>Adicionar</button></form>
            {catalogError&&<p role="alert" className="text-red-700 text-sm">{catalogError}</p>}
            <div className="divide-y divide-neutral-200">{(catalog[tab]||[]).map(name=><div key={name} className="flex items-center justify-between gap-3 py-2"><span>{name}</span><button type="button" className="tw-secondary text-sm" onClick={()=>setCatalog(prev=>({...prev,[tab]:prev[tab].filter(n=>n!==name)}))} aria-label={"Remover "+name}>Remover</button></div>)}</div>
            {!catalog[tab]?.length&&<p className="text-neutral-500 text-sm">Nenhum registo de demonstração.</p>}
          </section>}
          {info && <section className={panel}><h2 className="text-xl font-bold">{selected?.label}</h2><p className="text-sm text-neutral-600">{info.description}</p><p className="tw-note">{info.approval?"Funcionalidade proposta; requer aprovação das regras de negócio.":"Integração operacional pendente."}</p><div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-neutral-100"><tr>{info.columns.map(c=><th key={c} scope="col" className="p-3 whitespace-nowrap font-semibold">{c}</th>)}</tr></thead><tbody><tr><td colSpan={info.columns.length} className="text-center p-8 text-neutral-500">Sem dados ligados a este módulo.</td></tr></tbody></table></div></section>}
      {(tab==="drivers"||tab==="documents") && <article className={panel}>
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
        </main>
      </div>
    </div>
  );
}
