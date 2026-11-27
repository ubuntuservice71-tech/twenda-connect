export const rideLabels:Record<string,string>={requested:"À procura (piloto)",assigned:"Acordo confirmado",en_route:"Motorista a caminho",arrived:"Motorista chegou",in_progress:"Viagem iniciada",completed:"Viagem concluída",cancelled:"Cancelado",expired:"Expirado"};
export const activeRideStates=["requested","assigned","en_route","arrived","in_progress"];
export const driverBusyStates=["assigned","en_route","arrived","in_progress"];
export const nextDriverStep:Record<string,{action:string;label:string}>={assigned:{action:"depart",label:"Simular partida do motorista"},en_route:{action:"arrive",label:"Registar chegada de teste"},arrived:{action:"start",label:"Iniciar viagem de teste"},in_progress:{action:"complete",label:"Concluir viagem de teste"}};
