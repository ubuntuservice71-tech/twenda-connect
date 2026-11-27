// Proposed reference formula only, not a commercial fare or a charge.
export type FareInput={baseKm:number|null;baseMinor:number|null;perKmMinor:number|null;perMinuteMinor:number|null;minimumMinor:number|null;distanceKm:number;minutes:number;commissionBps:number;nightMultiplier?:number};
export function referenceFare(i:FareInput){
 const {baseKm,baseMinor,perKmMinor,perMinuteMinor,minimumMinor,distanceKm,minutes,commissionBps}=i;
 if(baseKm===null||baseMinor===null||perKmMinor===null||perMinuteMinor===null||minimumMinor===null)return null;
 if(![baseKm,baseMinor,perKmMinor,perMinuteMinor,minimumMinor,distanceKm,minutes,commissionBps].every(n=>Number.isFinite(n)&&n>=0)||distanceKm<=0||minutes<=0||commissionBps>10000||!Number.isInteger(commissionBps)||![baseMinor,perKmMinor,perMinuteMinor,minimumMinor].every(Number.isSafeInteger))return null;
 const multiplier=i.nightMultiplier??1;if(!Number.isFinite(multiplier)||multiplier<1||multiplier>100)return null;
 const extraKm=Math.max(0,distanceKm-baseKm);
 const distanceMinor=Math.round(extraKm*perKmMinor),timeMinor=Math.round(minutes*perMinuteMinor);
 const beforeNight=Math.max(minimumMinor,baseMinor+distanceMinor+timeMinor);
 const totalMinor=Math.round(beforeNight*multiplier);
 if(!Number.isSafeInteger(totalMinor)||totalMinor<=0||totalMinor>1000000000)return null;
 const commissionMinor=Math.round(totalMinor*commissionBps/10000);
 return {distanceMinor,timeMinor,totalMinor,commissionMinor,driverMinor:totalMinor-commissionMinor};
}
export function withinNight(time:string,start:string,end:string){const valid=(v:string)=>/^([01]\d|2[0-3]):[0-5]\d$/.test(v);if(![time,start,end].every(valid)||start===end)return false;return start<end?time>=start&&time<end:time>=start||time<end;}
