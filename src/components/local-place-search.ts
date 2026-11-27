import {searchPublicCatalogue} from "../lib/street-provider.functions";
import type {Place} from "../lib/street-geometry";
import {isPoint} from "../lib/geography";
export async function searchLocalPlaces(query:string):Promise<Place[]>{
 const rows=await searchPublicCatalogue(query);
 return rows.flatMap(p=>{const point=[p.longitude,p.latitude];return isPoint(point)?[{label:p.label,point}]:[];});
}
