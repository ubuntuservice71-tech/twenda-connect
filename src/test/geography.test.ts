import {describe,it,expect} from "vitest";
import {parseCoordinates,distanceKm,validPolygon,rankRecent,parseVertices} from "../lib/geography";
describe("Local geography",()=>{
 it("validates coordinate text and order",()=>{expect(parseCoordinates("-12.9, 40.5")).toEqual([40.5,-12.9]);expect(parseCoordinates("91, 40")).toBeNull();expect(parseCoordinates("Aeroporto")).toBeNull();});
 it("computes approximate great-circle distance",()=>{expect(distanceKm([0,0],[0,1])).toBeCloseTo(111.195,2);expect(distanceKm([40,-12],[40,-12])).toBe(0);});
 it("validates simple polygons and rejects crossing or duplicate vertices",()=>{expect(validPolygon([[0,0],[1,0],[1,1],[0,1]])).toBe(true);expect(validPolygon([[0,0],[1,1],[0,1],[1,0]])).toBe(false);expect(validPolygon([[0,0],[1,0],[0,0]])).toBe(false);expect(parseVertices("[[181,0]]")).toBeNull();});
 it("ranks recent accurate positions within radius",()=>{const now=Date.parse("2026-11-27T00:00:00Z");const row=(id:string,lat:number,age:number,accuracy=10)=>({driver_id:id,latitude:lat,longitude:0,updated_at:new Date(now-age).toISOString(),accuracy_m:accuracy});expect(rankRecent([0,0],[row("far",.1,100),row("near",.01,100),row("stale",.001,300001),row("inaccurate",.001,100,300),row("outside",1,100)],now,20).map(x=>x.driver_id)).toEqual(["near","far"]);});
});
