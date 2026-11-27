import {createServerFn} from "@tanstack/react-start";
import {z} from "zod";
import {requireSupabaseAuth} from "../integrations/supabase/auth-middleware";
import {searchConfigured,routeConfigured} from "./street-provider.server";
const point=z.tuple([z.number().min(-180).max(180),z.number().min(-85.05112878).max(85.05112878)]);
export const searchStreet=createServerFn({method:"POST"}).middleware([requireSupabaseAuth]).inputValidator((v:unknown)=>z.object({query:z.string().trim().min(3).max(120)}).parse(v)).handler(async({data,context})=>{if(context.claims.is_anonymous===true)throw Error("Confirmed session required");return searchConfigured(data.query);});
export const calculateStreetRoute=createServerFn({method:"POST"}).middleware([requireSupabaseAuth]).inputValidator((v:unknown)=>z.object({from:point,to:point,vehicle:z.enum(["car","motorcycle"])}).parse(v)).handler(async({data,context})=>{if(context.claims.is_anonymous===true)throw Error("Confirmed session required");return routeConfigured(data.from,data.to,data.vehicle);});
