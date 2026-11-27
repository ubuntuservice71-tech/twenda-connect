import {driverClient} from "./driver-shared";
import type {Place} from "../lib/street-geometry";
import {isPoint} from "../lib/geography";
export async function searchLocalPlaces(query:string):Promise<Place[]>{
 const c=await driverClient();const r=await c.rpc("search_local_places",{q:query.trim()});if(r.error)throw Error("Local catalogue unavailable");
 return (r.data??[]).flatMap(p=>{const point=[p.longitude,p.latitude];return isPoint(point)?[{label:p.label,point}]:[];});
}
