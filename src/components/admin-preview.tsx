import { useState } from "react";
import { AdminModule } from "./admin-module";
import { LocationAdmin } from "./location-admin";
import { PricingAdmin } from "./pricing-admin";
import { DriverAdmin } from "./driver-admin";
import { PassengerAdmin } from "./passenger-area";
import { TrackingAdmin } from "./driver-location";
import {PilotRides} from "./pilot-rides";
import {Finance} from "./finance";
import {PaymentPilot} from "./payment-pilot";
import {SupportDesk} from "./support-desk";
import {ContentAdmin} from "./cms-content";
import { ArrowLeft, ArrowRight, LayoutDashboard, CalendarDays, MapPin, Map, CreditCard, CarFront, Users, Navigation, Wallet, FileCheck, Gift, MessageSquare, Ticket, Settings, Search, Menu, X, Tag, Clock, ShieldCheck, FileText, Globe, Image, HelpCircle, SlidersHorizontal, KeyRound, RefreshCw } from "lucide-react";

const groups = [
  { title: "Visão geral", items: [{id:"overview",label:"Dashboard",icon:LayoutDashboard},{id:"rides",label:"Corridas / reservas",icon:CalendarDays}] },
  { title: "Gestão de localização", items: [{id:"cities",label:"Cidades",icon:MapPin},{id:"zones",label:"Zonas",icon:Map}] },
  { title: "Subscrições · por aprovar", items: [{id:"plans",label:"Planos de subscrição",icon:CreditCard},{id:"subscriptions",label:"Subscrições de motoristas",icon:CreditCard}] },
  { title: "Configuração de corridas", items: [{id:"types",label:"Tipos de corrida",icon:CarFront},{id:"settings",label:"Políticas de cancelamento",icon:Settings}] },
  { title: "Gestão de utilizadores", items: [{id:"drivers",label:"Motoristas",icon:Users},{id:"customers",label:"Passageiros",icon:Users}] },
  { title: "Gestão de motoristas", items: [{id:"tracking",label:"Rastreamento de motoristas",icon:Navigation},{id:"cash",label:"Pontos de cobrança",icon:Wallet},{id:"documents",label:"Documentação",icon:FileCheck},{id:"incentives",label:"Incentivos",icon:Gift},{id:"withdrawals",label:"Pedidos de levantamento",icon:Wallet},{id:"driverTickets",label:"Ocorrências de motoristas",icon:Ticket}] },
  { title: "Marketing", items: [{id:"notifications",label:"Enviar notificações",icon:MessageSquare},{id:"promos",label:"Códigos promocionais",icon:Tag},{id:"referrals",label:"Bónus por indicação",icon:Gift},{id:"referralNetwork",label:"Rede de indicações",icon:Users}] },
  { title: "Configuração fiscal", items: [{id:"taxes",label:"Regras fiscais por cidade",icon:FileText}] },
  { title: "Finanças", items: [{id:"commissions",label:"Comissões",icon:Wallet},{id:"invoices",label:"Facturas",icon:FileText},{id:"transactions",label:"Transacções",icon:CreditCard},{id:"wallet",label:"Carteiras",icon:Wallet},{id:"walletTransactions",label:"Movimentos de carteira",icon:Wallet}] },
  { title: "Atendimento e segurança", items: [{id:"refundSettings",label:"Configuração de reembolsos",icon:Settings},{id:"refunds",label:"Pedidos de reembolso",icon:Wallet},{id:"messages",label:"Conversas e mensagens",icon:MessageSquare},{id:"tickets",label:"Tickets de suporte",icon:Ticket},{id:"appeals",label:"Contestações",icon:ShieldCheck},{id:"audit",label:"Auditoria",icon:Clock}] },
  { title: "Conteúdos", items: [{id:"about",label:"Sobre nós",icon:FileText},{id:"privacy",label:"Política de privacidade",icon:ShieldCheck},{id:"terms",label:"Termos e condições",icon:FileText},{id:"contact",label:"Contactos",icon:MessageSquare},{id:"banners",label:"Imagens de banners",icon:Image},{id:"faq",label:"Perguntas frequentes",icon:HelpCircle}] },
  { title: "Configurações", items: [{id:"appSettings",label:"Configurações da aplicação",icon:Settings},{id:"payments",label:"Métodos de pagamento",icon:CreditCard},{id:"referralSettings",label:"Valores de indicação",icon:Gift},{id:"currency",label:"Moeda",icon:Wallet},{id:"firebase",label:"Notificações e OTP",icon:Settings},{id:"languages",label:"Idiomas",icon:Globe},{id:"integrations",label:"Integrações",icon:SlidersHorizontal},{id:"subscriptionSettings",label:"Configuração de subscrições",icon:CreditCard},{id:"radius",label:"Raio de procura de motoristas",icon:MapPin}] },
  { title: "Utilizadores do sistema", items: [{id:"admins",label:"Administradores",icon:Users},{id:"roles",label:"Funções",icon:ShieldCheck},{id:"permissions",label:"Permissões",icon:KeyRound}] },
  { title: "Sistema", items: [{id:"updates",label:"Actualizações do sistema",icon:RefreshCw}] },
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
const bookingColumns=["Código da corrida","Passageiro","Motorista","Partida","Destino","Valor total (MT)","Estado","Data de criação"];
function EmptyTrend({title,legend}:{title:string;legend:string[]}) {
  return <article className="tw-panel !p-4 min-w-0 space-y-3">
    <h2 className="font-bold text-base">{title}</h2>
    <div className="relative h-44 rounded-md border border-neutral-100 overflow-hidden" role="img" aria-label={title+": sem dados ligados"}>
      <svg viewBox="0 0 480 160" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {[20,45,70,95,120,145].map(y=><line key={y} x1="22" x2="466" y1={y} y2={y} stroke="#e5e5e5" strokeWidth="1"/>)}
        <path d="M22 10 V145 H466" fill="none" stroke="#d4d4d4" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center"><span className="bg-white px-3 py-2 text-xs text-neutral-600 rounded border border-neutral-200">Sem dados ligados</span></div>
    </div>
    <div className="flex flex-wrap justify-center gap-3 text-xs text-neutral-600">{legend.map((item,i)=><span key={item} className="flex items-center gap-1.5"><span className={["h-2.5 w-2.5 rounded-sm bg-blue-500","h-2.5 w-2.5 rounded-sm bg-green-600","h-2.5 w-2.5 rounded-sm bg-amber-500"][i%3]} aria-hidden="true"/>{item}</span>)}</div>
  </article>;
}
function DashboardCard({label,help,tone,onClick}:{label:string;help:string;tone:string;onClick:()=>void}) {
  const accent=tone==="green"?"border-b-green-500 text-green-700":tone==="red"?"border-b-red-500 text-red-700":tone==="amber"?"border-b-amber-500 text-amber-700":"border-b-blue-500 text-blue-700";
  return <button type="button" onClick={onClick} className={"flex min-w-0 flex-col items-start gap-1 rounded-xl border border-neutral-200 border-b-2 bg-white p-4 text-left shadow-sm hover:bg-neutral-50 "+accent}>
    <span className="text-xs font-medium text-neutral-600">{label}</span><strong className="text-2xl tw-money text-neutral-950">—</strong><span className="text-xs">{help}</span>
  </button>;
}

const panel = "tw-panel space-y-4";
const primary = "tw-primary disabled:opacity-40";
const initial = { commission: 10, freeMinutes: 2, waitMinutes: 5, cancellationFee: "", absenceFee: "" };

export function AdminPreview({onBack}: {onBack?: () => void}) {
  const [tab, setTab] = useState("overview");
  const [locationCity,setLocationCity]=useState("");
  
  const saved = initial;
  
  const [query,setQuery]=useState("");
  const [bookingSearch,setBookingSearch]=useState("");
  const [pageSize,setPageSize]=useState("10");
  const [menu,setMenu]=useState(false);
  const selected=allItems.find(item=>item.id===tab);
  const changeTab=(id:string)=>{setLocationCity("");setTab(id);setMenu(false);};
  const filtered=groups.map(g=>({...g,items:g.items.filter(i=>i.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))})).filter(g=>g.items.length);
  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-neutral-200 bg-white px-4 py-2 sm:px-6">
        <div className="flex items-center gap-3">
          <button type="button" className="lg:hidden tw-secondary" aria-label={menu?"Fechar menu":"Abrir menu"} aria-expanded={menu} onClick={()=>setMenu(v=>!v)}>{menu?<X size={20}/>:<Menu size={20}/>}</button>
          <span className="text-xl font-extrabold tracking-tight flex items-center gap-2"><img src="/brand/twende-logo.webp" alt="Twende — Vamos juntos." width={96} height={64} className="w-24 h-16 object-contain" /></span>
          <span className="hidden sm:inline text-sm text-neutral-500 border-l pl-3">Administração</span>
        </div>
        <button type="button" onClick={onBack} className="tw-secondary flex items-center gap-2 text-sm"><ArrowLeft size={16}/> <span>Voltar</span></button>
      </header>
      <div className="lg:grid lg:grid-cols-[236px_minmax(0,1fr)]">
        <aside className={`${menu?"block":"hidden"} lg:block lg:sticky lg:top-[81px] lg:h-[calc(100dvh-81px)] overflow-y-auto border-r border-neutral-200 bg-white p-3`}>
          <label className="relative block"><span className="sr-only">Pesquisar módulo</span><Search size={16} className="absolute left-3 top-4 text-neutral-500"/><input className="tw-field !pl-9 !mt-0 text-sm" placeholder="Pesquisar módulo" value={query} onChange={e=>setQuery(e.target.value)}/></label>
          <nav aria-label="Menu administrativo" className="space-y-4 mt-4">
            {filtered.map(g=><div key={g.title}><p className="px-2 pb-1 text-xs font-semibold text-neutral-500">{g.title}</p>{g.items.map(({id,label,icon:Icon})=><button key={id} type="button" aria-current={tab===id?"page":undefined} onClick={()=>changeTab(id)} className={`w-full flex items-center gap-3 text-left rounded-lg px-3 py-1.5 text-sm !min-h-10 ${tab===id?"bg-yellow-100 font-bold text-neutral-900":"text-neutral-700 hover:bg-neutral-100"}`}><Icon size={17} className="shrink-0" aria-hidden="true"/><span>{label}</span></button>)}</div>)}
            {!filtered.length&&<p className="text-sm text-neutral-500 px-2">Nenhum módulo encontrado.</p>}
          </nav>
        </aside>
        <main className="min-w-0 p-4 sm:p-5 lg:p-7 space-y-4 max-w-[1600px] w-full">
          <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-semibold text-neutral-500">Administração / {selected?.label}</p><h1 className="text-2xl font-bold mt-1">{selected?.label}</h1></div><span className="rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-semibold">Ambiente de demonstração</span></div>
          <p className="tw-note">Painel com módulos reais e demonstrativos. Os indicadores ainda não ligados aparecem como “—”.</p>
          {tab==="overview" && <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {metrics.map((m,i)=><DashboardCard key={m.label} label={m.label} help={m.help} tone={[8,15].includes(i)?"red":[2,5,6,14].includes(i)?"amber":[0,3,7,9,13].includes(i)?"green":"blue"} onClick={()=>changeTab(m.module)}/>)}
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              <EmptyTrend title="Tendências de tickets" legend={["Novos tickets","Tickets resolvidos"]}/>
              <EmptyTrend title="Tendências de transacções" legend={["Créditos","Débitos","Carteiras activas"]}/>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {([{label:"Saldo total",help:"Carteiras da plataforma",tone:"green"},{label:"Créditos de hoje",help:"Carregamentos e créditos",tone:"blue"},{label:"Débitos de hoje",help:"Comissões e débitos",tone:"amber"}]).map(m=><DashboardCard key={m.label} {...m} onClick={()=>changeTab("wallet")}/>)}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {([{label:"Total de utilizadores",help:"Utilizadores da plataforma",tone:"green",module:"customers"},{label:"Motoristas activos",help:"Motoristas disponíveis",tone:"amber",module:"tracking"},{label:"Corridas de hoje",help:"Reservas efectuadas hoje",tone:"amber",module:"rides"},{label:"Veículos activos",help:"Veículos em serviço",tone:"blue",module:"types"}]).map(({module,...m})=><DashboardCard key={m.label} {...m} onClick={()=>changeTab(module)}/>)}
            </div>
            <section className="tw-panel !p-0 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-neutral-200"><h2 className="font-bold">Últimas corridas</h2><label className="relative"><span className="sr-only">Pesquisar corridas</span><Search size={15} className="absolute left-3 top-4 text-neutral-500"/><input className="tw-field !pl-9 !mt-0 !min-h-10 text-sm" placeholder="Pesquisar" value={bookingSearch} onChange={e=>setBookingSearch(e.target.value)}/></label></div>
              <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-neutral-50"><tr>{bookingColumns.map(c=><th key={c} scope="col" className="p-3 font-semibold whitespace-nowrap">{c}</th>)}</tr></thead><tbody><tr><td colSpan={bookingColumns.length} className="p-10 text-center text-neutral-500">{bookingSearch.trim()?"Pesquisa indisponível: base de dados ainda não ligada ao painel.":"Sem corridas reais disponíveis nesta pré-visualização."}</td></tr></tbody></table></div>
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-t border-neutral-200 text-xs text-neutral-600"><span>Registos não carregados</span><label className="flex items-center gap-2">Por página<select className="rounded-md border border-neutral-300 bg-white p-2" value={pageSize} onChange={e=>setPageSize(e.target.value)}>{["10","25","50"].map(n=><option key={n}>{n}</option>)}</select></label><div className="flex items-center gap-2"><button type="button" disabled aria-label="Página anterior" className="tw-secondary opacity-40 !min-h-8 !p-2"><ArrowLeft size={14}/></button><span>—</span><button type="button" disabled aria-label="Página seguinte" className="tw-secondary opacity-40 !min-h-8 !p-2"><ArrowRight size={14}/></button></div></div>
            </section>
            <div className="grid gap-4 xl:grid-cols-2"><EmptyTrend title="Visão geral das corridas" legend={["Corridas"]}/><EmptyTrend title="Visão geral da receita" legend={["Receita (MT)"]}/></div>
            <h2 className="text-lg font-bold">Simulação e regras iniciais</h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[["Candidaturas pendentes","—"],["Motoristas aprovados","—"],["Corridas simuladas","1"],["Comissão configurada",saved.commission+"%"]].map(([label,value])=><article key={label} className={panel}><p className="text-sm text-neutral-600">{label}</p><strong className="text-2xl tw-money">{value}</strong></article>)}</div>
          </>}
          {(tab==="cities"||tab==="zones") ? <LocationAdmin key={tab+locationCity} kind={tab} cityFilter={locationCity} onZones={id=>{setLocationCity(id);setTab("zones");}}/> : (tab==="types"||tab==="settings") ? <PricingAdmin key={tab} kind={tab}/> : (tab==="drivers"||tab==="documents") ? <DriverAdmin key={tab} documentsOnly={tab==="documents"}/> : tab==="customers" ? <PassengerAdmin/> : tab==="tracking" ? <TrackingAdmin/> : tab==="rides" ? <PilotRides role="admin"/> : ["wallet","commissions","transactions","walletTransactions"].includes(tab) ? <Finance key={tab} admin mode={tab}/> : tab==="payments" ? <PaymentPilot admin/> : ["tickets","messages","driverTickets","refunds","appeals"].includes(tab) ? <SupportDesk key={tab} role="admin" mode={tab}/> : ["about","privacy","terms","contact","faq"].includes(tab) ? <ContentAdmin key={tab} kind={tab}/> : tab!=="overview" && <AdminModule key={tab} id={tab}/>}
      {tab==="rides" && <article className={panel}><h2 className="text-xl font-bold">Corrida fictícia #001</h2><p>Bairro da Natite → Aeroporto</p><p>Valor: 120,00 MT</p><p>Estado: concluída (exemplo)</p><p>Comissão estimada: {(120*saved.commission/100).toFixed(2)} MT</p></article>}

        </main>
      </div>
    </div>
  );
}
