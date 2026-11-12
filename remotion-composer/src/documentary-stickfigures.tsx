import React from "react";
import {AbsoluteFill, Composition, interpolate, registerRoot, useCurrentFrame} from "remotion";

type Props={chapter:string;beat:string;caption:string;scene:string;index:number;total:number;durationFrames:number};
const Figure:React.FC<{x:number;y:number;scale?:number;frame:number;walking?:boolean;color?:string}>=({x,y,scale=1,frame,walking=false,color="#e2e8f0"})=>{
 const swing=walking?Math.sin(frame/9)*18:0;
 return <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={color} strokeWidth="7" strokeLinecap="round" fill="none">
 <circle cx="0" cy="-70" r="19"/><path d="M0 -50 V30 M0 -15 L-32 12 M0 -15 L32 12"/>
 <path d={`M0 30 L${-25+swing} 78 M0 30 L${25-swing} 78`}/></g>
};
const Scene:React.FC<Props>=({chapter,beat,caption,scene,index,total,durationFrames})=>{
 const frame=useCurrentFrame();const fade=interpolate(frame,[0,24,durationFrames-25,durationFrames-1],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 const t=frame/24;const moon=scene==="space";const nature=["forest","wildlife","future","sunrise"].includes(scene);
 const accent=nature?"#64d8a3":"#67b8ff";
 return <AbsoluteFill style={{background:moon?"#050b1c":nature?"#0c241e":"#101827",color:"#f8fafc",fontFamily:"Arial,sans-serif",opacity:fade}}>
 <svg width="1280" height="720" viewBox="0 0 1280 720" style={{position:"absolute",inset:0}}>
 <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor={nature?"#163b37":"#142945"}/><stop offset="1" stopColor={nature?"#06170f":"#070b15"}/></linearGradient></defs>
 <rect width="1280" height="720" fill="url(#sky)"/>
 {moon?<><circle cx="930" cy="365" r="240" fill="#1c6392"/><path d="M740 310 Q850 200 1020 280 T1130 400 Q980 350 860 480 Z" fill="#387d69" opacity=".9"/><ellipse cx="930" cy="365" rx="245" ry="240" fill="none" stroke="#8ad6ff" strokeWidth="5" opacity=".4"/>{Array.from({length:65},(_,i)=><circle key={i} cx={(i*197)%1280} cy={(i*107)%720} r={i%3+1} fill="#fff" opacity=".65"/>)}</>:
 <>
 <path d="M0 560 Q200 520 420 565 T900 550 T1280 545 L1280 720 L0 720Z" fill={nature?"#174b32":"#18283d"}/>
 {nature?Array.from({length:12},(_,i)=><g key={i} transform={`translate(${i*115-20} ${515+(i%3)*25})`}><path d="M0 0 L-38 70 H38Z M0 -45 L-32 30 H32Z" fill="#286a4a"/><rect x="-5" y="60" width="10" height="40" fill="#5a4734"/></g>):Array.from({length:10},(_,i)=><g key={i}><rect x={i*140} y={310+(i%3)*65} width={95+(i%2)*30} height="260" fill="#27394c"/>{Array.from({length:9},(_,j)=><rect key={j} x={i*140+15+(j%3)*27} y={345+(i%3)*65+Math.floor(j/3)*48} width="13" height="21" fill={scene==="blackout"&&frame>durationFrames/3?"#17212c":"#f5cc77"} opacity=".8"/>)}</g>)}
 {["people","city","traffic","pets","wildlife","hospital","school","factory","station","sunrise"].includes(scene)&&<><Figure x={250+Math.sin(frame/40)*12} y={545} frame={frame} walking={scene==="wildlife"||scene==="people"}/><Figure x={430} y={550} scale={0.85} frame={frame+18}/><Figure x={580} y={560} scale={0.7} frame={frame}/></>}
 {scene==="traffic"&&<g transform={`translate(${Math.min(450,frame*2)} 0)`}><rect x="700" y="530" width="220" height="58" rx="12" fill="#d65c59"/><circle cx="750" cy="590" r="20" fill="#0f172a"/><circle cx="870" cy="590" r="20" fill="#0f172a"/></g>}
 </>}
 </svg>
 <div style={{position:"absolute",top:45,left:65,fontSize:22,letterSpacing:5,color:accent,fontWeight:700}}>THE WORLD THAT EXISTS WITHOUT US</div>
 <div style={{position:"absolute",bottom:76,left:65,right:65,background:"rgba(4,10,20,.75)",padding:"24px 30px",borderLeft:`7px solid ${accent}`,borderRadius:10}}>
 <div style={{fontSize:22,color:accent,letterSpacing:3}}>{chapter.toUpperCase()}</div>
 <div style={{fontSize:45,fontWeight:800,marginTop:8}}>{beat}</div>
 <div style={{fontSize:25,marginTop:10,color:"#cbd5e1"}}>{caption}</div></div>
 <div style={{position:"absolute",bottom:22,right:65,fontSize:17,color:"#94a3b8"}}>{index+1} / {total}</div>
 </AbsoluteFill>;
};
const Root:React.FC=()=> <Composition id="DocumentaryStickFigure" component={Scene} fps={24} width={1280} height={720} durationInFrames={1440} calculateMetadata={({props})=>({durationInFrames:props.durationFrames})} defaultProps={{chapter:"The Last Second",beat:"Humanity vanishes",caption:"The planet keeps moving.",scene:"city",index:0,total:20,durationFrames:1440}}/>;
registerRoot(Root);
