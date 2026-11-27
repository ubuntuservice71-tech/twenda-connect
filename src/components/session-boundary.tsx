import {useEffect,useState,type ReactNode} from "react";
import {driverClient} from "./driver-shared";
export function SessionBoundary({children}:{children:ReactNode}){
 const [identity,setIdentity]=useState<string|null>(null),[error,setError]=useState(false);
 useEffect(()=>{let alive=true;let unsubscribe:(()=>void)|undefined;
 void driverClient().then(c=>{if(!alive)return;const s=c.auth.onAuthStateChange((_event,session)=>{if(alive)setIdentity(session?.user.id??"anonymous");});unsubscribe=()=>s.data.subscription.unsubscribe();}).catch(()=>{if(alive)setError(true);});
 return()=>{alive=false;unsubscribe?.();};},[]);
 if(error)return <p role="alert" className="tw-note">Não foi possível verificar a sessão. Actualiza a página.</p>;
 if(identity===null)return <p role="status">A verificar sessão…</p>;
 return <div key={identity}>{children}</div>;
}
