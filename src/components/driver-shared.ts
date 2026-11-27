import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../lib/twende-database.types";
export const requirements=[["identity","Bilhete de identidade"],["license","Carta de condução válida"],["driver_photo","Fotografia do motorista"],["vehicle_registration","Livrete do veículo"],["ownership","Título de propriedade ou autorização de uso"],["insurance","Seguro válido"],["vehicle_photos","Fotografias do veículo"],["transport_license","Licença de transporte aplicável"],["criminal_record","Certificado de registo criminal"]] as const;
export const bucket="driver-private-documents";
export async function driverClient(){const {supabase}=await import("../integrations/supabase/client");return supabase as unknown as SupabaseClient<Database>;}
export const states:Record<string,string>={pending:"Pendente",approved:"Aprovado",rejected:"Rejeitado",suspended:"Suspenso",verified:"Verificado"};
