import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../lib/twende-database.types";
export const requirements=[["identity","Bilhete de identidade"],["license","Carta de condução válida"],["driver_photo","Fotografia do motorista"],["vehicle_registration","Livrete do veículo"],["ownership","Título de propriedade ou autorização de uso"],["insurance","Seguro válido"],["vehicle_photos","Fotografias do veículo"],["transport_license","Licença de transporte aplicável"],["criminal_record","Certificado de registo criminal"]] as const;
export const bucket="driver-private-documents";
// The database generates these fields in BEFORE INSERT triggers. Clients have
// no INSERT grants on them. Keep generated types intact and narrow the write API.
type Tables=Database["public"]["Tables"];
type ClientDatabase=Omit<Database,"public">&{public:Omit<Database["public"],"Tables">&{Tables:Omit<Tables,"pilot_wallet_entries"|"support_messages"|"pilot_ride_messages"|"pilot_driver_availability">&{
 pilot_wallet_entries:Omit<Tables["pilot_wallet_entries"],"Insert">&{Insert:Pick<Tables["pilot_wallet_entries"]["Insert"],"driver_id"|"kind"|"amount_minor"|"reference"|"ride_id">};
 pilot_driver_availability:Omit<Tables["pilot_driver_availability"],"Insert">&{Insert:Pick<Tables["pilot_driver_availability"]["Insert"],"driver_id">};
 pilot_ride_messages:Omit<Tables["pilot_ride_messages"],"Insert">&{Insert:Pick<Tables["pilot_ride_messages"]["Insert"],"ride_id"|"sender_id"|"body">};
 support_messages:Omit<Tables["support_messages"],"Insert">&{Insert:Pick<Tables["support_messages"]["Insert"],"ticket_id"|"sender_id"|"body">};
}}};
export async function driverClient(){const {supabase}=await import("../integrations/supabase/client");return supabase as unknown as SupabaseClient<ClientDatabase>;}
export const states:Record<string,string>={pending:"Pendente",approved:"Aprovado",rejected:"Rejeitado",suspended:"Suspenso",verified:"Verificado"};
