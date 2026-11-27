import type {Place,RoadRoute} from './street-geometry';
type Status='ok'|'unconfigured'|'unavailable'|'limited';
// The project's public URL and publishable key match the generated Supabase client. No service or Geoapify secret.
const mapsUrl="https://ovchyktojhrbydigwmzq.supabase.co/functions/v1/twende-maps";
const publishableKey="sb_publishable_B88rSiYs2CqUJ5bzWnj0Pw_3CBfMAqc";
export class MapsRequestError extends Error {constructor(public code:string){super(code);}}
export function mapsErrorMessage(e:unknown){const code=e instanceof MapsRequestError?e.code:'';return code==='session'||code==='401'||code==='403'?'Sessão não autorizada para mapas. Volta a iniciar sessão.':code==='404'?'Função de mapas não encontrada.':code==='503'?'Configuração do servidor de mapas incompleta.':code==='network'?'Não foi possível contactar o servidor de mapas. Verifica a ligação e tenta de novo.':'Serviço de mapas indisponível. Tenta novamente.';}

type Args<T>={data:T;headers:Record<string,string>};
async function invoke<T>(action:string,args:Args<object>):Promise<T>{
const auth=new Headers(args.headers).get('Authorization');if(!auth?.startsWith('Bearer ')||auth.slice(7).split('.').length!==3)throw new MapsRequestError('session');
let response:Response;try{response=await fetch(mapsUrl,{method:'POST',headers:{Authorization:auth,apikey:publishableKey,'Content-Type':'application/json'},body:JSON.stringify({...args.data,action}),signal:AbortSignal.timeout(20000),redirect:'error',credentials:'omit'});}catch{throw new MapsRequestError('network');}
if(!response.ok)throw new MapsRequestError(String(response.status));
try{return await response.json() as T;}catch{throw new MapsRequestError('response');}
}
export function searchStreet(args:Args<{query:string}>){return invoke<{status:Status;reason?:string;places:Place[]}>('search',args);}
export function calculateStreetRoute(args:Args<{from:[number,number];to:[number,number];vehicle:'car'|'motorcycle'}>){return invoke<{status:Status;reason?:string;route:RoadRoute|null}>('route',args);}
export function loadGeoTiles(args:Args<{z:number;tiles:{x:number;y:number}[]}>){return invoke<{status:Status;reason?:string;tiles:{x:number;y:number;src:string}[]}>('tiles',args);}
export function autocompleteStreet(args:Args<{query:string}>){return invoke<{status:Status;reason?:string;places:Place[]}>('autocomplete',args);}
export function reverseStreet(args:Args<{point:[number,number]}>){return invoke<{status:Status;reason?:string;place:Place|null}>('reverse',args);}
