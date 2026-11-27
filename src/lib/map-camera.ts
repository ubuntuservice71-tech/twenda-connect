import type {Point} from "./geography";
import {project,unproject} from "./street-geometry";
export type Camera={center:Point;zoom:number};
export const mapWidth=480,mapHeight=320;
export function clampZoom(z:number){return Math.max(3,Math.min(18,Math.round(z)));}
export function panCamera(camera:Camera,dx:number,dy:number):Camera{const p=project(camera.center,camera.zoom);return {...camera,center:unproject([p[0]-dx,p[1]-dy],camera.zoom)};}
export function zoomCamera(camera:Camera,zoom:number,anchor:Point=[mapWidth/2,mapHeight/2]):Camera{
 const z=clampZoom(zoom),p=project(camera.center,camera.zoom),factor=2**(z-camera.zoom),dx=anchor[0]-mapWidth/2,dy=anchor[1]-mapHeight/2;
 return {zoom:z,center:unproject([(p[0]+dx)*factor-dx,(p[1]+dy)*factor-dy],z)};
}
export function fitCamera(points:Point[]):Camera|null{
 if(!points.length)return null;
 const projected=points.map(p=>project(p,0));
 let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
 for(const p of projected){minX=Math.min(minX,p[0]);maxX=Math.max(maxX,p[0]);minY=Math.min(minY,p[1]);maxY=Math.max(maxY,p[1]);}
 // This pilot is local to Mozambique; no antimeridian wrapping.
 const dx=maxX-minX,dy=maxY-minY;
 const zoom=clampZoom(Math.floor(Math.log2(Math.min((mapWidth-96)/Math.max(dx,1e-9),(mapHeight-96)/Math.max(dy,1e-9)))));
 return {center:unproject([(minX+maxX)/2,(minY+maxY)/2],0),zoom};
}
export function gestureCamera(camera:Camera,dx:number,dy:number,scale:number,anchor:Point):Camera{
 const z=clampZoom(camera.zoom+Math.log2(Math.max(0.125,Math.min(8,scale))));
 const zoomed=zoomCamera(camera,z,anchor);
 return panCamera(zoomed,dx,dy);
}
