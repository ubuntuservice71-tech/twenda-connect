import {driverClient} from '../components/driver-shared';
import type {Place,RoadRoute} from './street-geometry';
type Status='ok'|'unconfigured'|'unavailable'|'limited';
type Args<T>={data:T;headers:Record<string,string>};
async function invoke<T>(action:string,args:Args<object>):Promise<T>{
const c=await driverClient();
const r=await c.functions.invoke<T>('twende-maps',{body:{...args.data,action},headers:args.headers});
if(r.error||!r.data)throw Error('Maps unavailable');return r.data;
}
export function searchStreet(args:Args<{query:string}>){return invoke<{status:Status;places:Place[]}>('search',args);}
export function calculateStreetRoute(args:Args<{from:[number,number];to:[number,number];vehicle:'car'|'motorcycle'}>){return invoke<{status:Status;route:RoadRoute|null}>('route',args);}
export function loadGeoTiles(args:Args<{z:number;tiles:{x:number;y:number}[]}>){return invoke<{status:Status;tiles:{x:number;y:number;src:string}[]}>('tiles',args);}
export function autocompleteStreet(args:Args<{query:string}>){return invoke<{status:Status;places:Place[]}>('autocomplete',args);}
export function reverseStreet(args:Args<{point:[number,number]}>){return invoke<{status:Status;place:Place|null}>('reverse',args);}
