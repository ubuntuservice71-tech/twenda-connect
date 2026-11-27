import type {Place,RoadRoute} from './street-geometry';
type Status='ok'|'unconfigured'|'unavailable'|'limited';
// The project's public URL and publishable key match the generated Supabase client. No service or Geoapify secret.
const mapsUrl="https://ovchyktojhrbydigwmzq.supabase.co/functions/v1/twende-maps";
const publishableKey="sb_publishable_B88rSiYs2CqUJ5bzWnj0Pw_3CBfMAqc";
export class MapsRequestError extends Error {constructor(public code:string){super(code);}}
export function mapsErrorMessage(e:unknown){const code=e instanceof MapsRequestError?e.code:e instanceof Error&&e.message==='session'?'session':'';return code==='session'?'Sessão não autorizada para este diagnóstico administrativo.':code==='401'||code==='403'?'O servidor recusou o acesso público aos mapas. Contacta o suporte se persistir.':code==='404'?'Função de mapas não encontrada.':code==='503'?'Configuração do servidor de mapas incompleta.':code==='500'?'Erro interno na função de mapas (HTTP 500).':code==='429'?'Limite de pedidos atingido. Aguarda antes de tentar novamente.':code==='response'?'O servidor devolveu uma resposta inválida.':code==='network'?'Não foi possível contactar o servidor de mapas. Verifica a ligação e tenta de novo.':/^\d{3}$/.test(code)?'Servidor de mapas: HTTP '+code+'.':'Não foi possível preparar a pesquisa. Tenta novamente.';}

type Args<T>={data:T;headers?:Record<string,string>};
async function invoke<T>(action:string,args:Args<object>):Promise<T>{
const auth=new Headers(args.headers).get('Authorization');const token=auth?.startsWith('Bearer ')&&auth.slice(7).split('.').length===3?auth:undefined;
let response:Response;try{response=await fetch(mapsUrl,{method:'POST',headers:{...(token?{Authorization:token}:{}),apikey:publishableKey,'Content-Type':'application/json'},body:JSON.stringify({...args.data,action}),signal:AbortSignal.timeout(20000),redirect:'error',credentials:'omit'});}catch{throw new MapsRequestError('network');}
if(!response.ok)throw new MapsRequestError(String(response.status));
try{return await response.json() as T;}catch{throw new MapsRequestError('response');}
}
export function searchStreet(args:Args<{query:string}>){return invoke<{status:Status;reason?:string;places:Place[]}>('search',args);}
export function calculateStreetRoute(args:Args<{from:[number,number];to:[number,number];vehicle:'car'|'motorcycle'}>){return invoke<{status:Status;reason?:string;route:RoadRoute|null}>('route',args);}
export function loadGeoTiles(args:Args<{z:number;tiles:{x:number;y:number}[]}>){return invoke<{status:Status;reason?:string;tiles:{x:number;y:number;src:string}[]}>('tiles',args);}
export function autocompleteStreet(args:Args<{query:string}>){return invoke<{status:Status;reason?:string;places:Place[]}>('autocomplete',args);}
export function reverseStreet(args:Args<{point:[number,number]}>){return invoke<{status:Status;reason?:string;place:Place|null}>('reverse',args);}

export function searchNamedPlaces(args:Args<{query:string}>){return invoke<{status:Status;reason?:string;places:Place[]}>('places',args);}

// The public catalogue always uses the publishable key, independently of a stale user session.
export async function searchPublicCatalogue(query:string):Promise<{label:string;longitude:number;latitude:number;category:string}[]>{
 const q=query.trim();if(q.length<3||q.length>120)return [];
 let response:Response;try{response=await fetch(mapsUrl.replace('/functions/v1/twende-maps','/rest/v1/rpc/search_local_places'),{method:'POST',headers:{apikey:publishableKey,'Content-Type':'application/json'},body:JSON.stringify({q}),signal:AbortSignal.timeout(10000),redirect:'error',credentials:'omit'});}catch{throw new MapsRequestError('network');}
 if(!response.ok)throw new MapsRequestError(String(response.status));const rows:unknown=await response.json();if(!Array.isArray(rows))throw new MapsRequestError('response');return rows.slice(0,8).filter((x):x is {label:string;longitude:number;latitude:number;category:string}=>x!==null&&typeof x==='object'&&typeof x.label==='string'&&typeof x.longitude==='number'&&typeof x.latitude==='number'&&typeof x.category==='string');
}
