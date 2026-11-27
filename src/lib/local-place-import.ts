export type DraftImport={name:string;aliases:string;category:string;neighbourhood:string;latitude:number|null;longitude:number|null;source_note:string};
export const importHeader="nome\tcategoria\tbairro\tnomes_alternativos\tlatitude\tlongitude\tfonte";
const categories=new Set(["bairro","combustivel","escola","saude","mercado","hotel","restaurante","rua","transporte","outro"]);
export function parseDraftImport(raw:string):DraftImport[]{
 if(raw.length>100000)throw Error("Texto demasiado longo.");
 const lines=raw.replace(/^\uFEFF/,"").split(/\r?\n/).filter(l=>l.trim());
 if(lines[0]?.trim()!==importHeader)throw Error("O cabeçalho deve corresponder ao modelo.");
 if(lines.length<2||lines.length>101)throw Error("Inclui 1 a 100 locais.");
 return lines.slice(1).map((line,i)=>{const cells=line.split("\t").map(x=>x.trim());if(cells.length!==7)throw Error("Linha "+(i+2)+": esperadas sete colunas.");const [name,category,neighbourhood,aliases,lat,lon,source_note]=cells as [string,string,string,string,string,string,string];if(name.length<2||name.length>120||!categories.has(category)||neighbourhood.length>120||aliases.length>500||source_note.length<5||source_note.length>500)throw Error("Linha "+(i+2)+": campos inválidos.");const latitude=lat?Number(lat.replace(",",".")):null,longitude=lon?Number(lon.replace(",",".")):null;if((latitude===null)!==(longitude===null)||(latitude!==null&&(!Number.isFinite(latitude)||latitude< -13.5||latitude> -13.1))||(longitude!==null&&(!Number.isFinite(longitude)||longitude<35.04||longitude>35.45)))throw Error("Linha "+(i+2)+": coordenadas inválidas ou fora da área piloto.");return {name,category,neighbourhood,aliases,latitude,longitude,source_note};});
}