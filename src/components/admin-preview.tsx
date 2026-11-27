import { useState } from "react";
import {LiveDashboard} from "./live-dashboard";
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
import {StaffAdmin,AuditView} from "./staff-admin";
import {CancellationPolicy} from "./cancellation-policy";
import {SettlementList} from "./pilot-settlement";
import { ArrowLeft, LayoutDashboard, CalendarDays, MapPin, Map, CreditCard, CarFront, Users, Navigation, Wallet, FileCheck, Gift, MessageSquare, Ticket, Settings, Search, Menu, X, Tag, Clock, ShieldCheck, FileText, Globe, Image, HelpCircle, SlidersHorizontal, KeyRound, RefreshCw } from "lucide-react";

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
export function AdminPreview({onBack}: {onBack?: () => void}) {
  const [tab, setTab] = useState("overview");
  const [locationCity,setLocationCity]=useState("");
  
const [query,setQuery]=useState("");
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
          {tab==="overview" && <LiveDashboard navigate={changeTab}/>}
          {(tab==="cities"||tab==="zones") ? <LocationAdmin key={tab+locationCity} kind={tab} cityFilter={locationCity} onZones={id=>{setLocationCity(id);setTab("zones");}}/> : (tab==="types"||tab==="settings") ? <><PricingAdmin key={tab} kind={tab}/>{tab==="settings"&&<CancellationPolicy admin/>}</> : (tab==="drivers"||tab==="documents") ? <DriverAdmin key={tab} documentsOnly={tab==="documents"}/> : tab==="customers" ? <PassengerAdmin/> : tab==="tracking" ? <TrackingAdmin/> : tab==="rides" ? <PilotRides role="admin"/> : ["wallet","commissions","transactions","walletTransactions"].includes(tab) ? <Finance key={tab} admin mode={tab}/> : tab==="invoices" ? <SettlementList admin/> : tab==="payments" ? <PaymentPilot admin/> : tab==="appeals" ? <><CancellationPolicy admin/><SupportDesk role="admin" mode="appeals"/></> : ["tickets","messages","driverTickets","refunds"].includes(tab) ? <SupportDesk key={tab} role="admin" mode={tab}/> : ["about","privacy","terms","contact","faq"].includes(tab) ? <ContentAdmin key={tab} kind={tab}/> : ["admins","roles","permissions"].includes(tab) ? <StaffAdmin key={tab} mode={tab}/> : tab==="audit" ? <AuditView/> : tab!=="overview" && <AdminModule key={tab} id={tab}/>}


        </main>
      </div>
    </div>
  );
}
