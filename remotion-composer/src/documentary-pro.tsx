import React from "react";
import {AbsoluteFill,Audio,Composition,Img,interpolate,registerRoot,staticFile,useCurrentFrame} from "remotion";

type Shot={chapter:string;beat:string;caption:string;scene:string;index:number;total:number;durationFrames:number;background?:string;narrationAudio?:string};
const Stick:React.FC<{x:number;y:number;frame:number;scale?:number;walking?:boolean}>=({x,y,frame,scale=1,walking=false})=>{
 const swing=walking?Math.sin(frame/7)*35:0;const arm=Math.sin(frame/13)*10;
 return <g transform={`translate(${x} ${y}) scale(${scale})`} stroke="#f1f5f9" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none">
 <circle cy="-105" r="28" fill="#142538"/><path d="M0 -76 L0 35 M0 -35 L-48 5 M0 -35 L48 5"/>
 <path d={`M0 35 L${-35+swing} 112 M0 35 L${35-swing} 112`}/><path d={`M-48 5 L${-65+arm} 35 M48 5 L${65-arm} 35`}/></g>
};
const Documentary:React.FC<Shot>=({chapter,beat,caption,scene,index,total,durationFrames,background,narrationAudio})=>{
 const frame=useCurrentFrame();const nature=/forest|wildlife|future|sunrise/.test(scene);
 const fade=interpolate(frame,[0,20,Math.max(21,durationFrames-20),durationFrames],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 const zoom=1+frame/Math.max(1,durationFrames)*0.07;
 const accent=nature?"#85d6a5":"#94c9f9";
 return <AbsoluteFill style={{background:"#07121f",color:"#f8fafc",fontFamily:"Arial,sans-serif",overflow:"hidden"}}>
 {background?<AbsoluteFill style={{transform:`scale(${zoom})`}}><Img src={staticFile(background)} style={{width:"100%",height:"100%",objectFit:"cover"}}/></AbsoluteFill>:
 <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:"absolute",transform:`scale(${zoom})`}}>
 <defs><linearGradient id="bg" x2="0" y2="1"><stop stopColor={nature?"#1d4b43":"#142e4c"}/><stop offset="1" stopColor="#07121f"/></linearGradient></defs>
 <rect width="1920" height="1080" fill="url(#bg)"/>
 {scene==="space"?<><circle cx="1390" cy="500" r="360" fill="#23668b"/><path d="M1120 400 Q1280 260 1480 400 T1660 560 Q1450 530 1310 720Z" fill="#43826b"/>{Array.from({length:90},(_,i)=><circle key={i} cx={(i*193)%1920} cy={(i*137)%1080} r={i%3+1} fill="#dce9ff"/>)}</>:
 <><path d="M0 850 Q420 760 850 850 T1920 815 L1920 1080 H0Z" fill={nature?"#183d32":"#1b3148"}/>
 {Array.from({length:13},(_,i)=>nature?<g key={i} transform={`translate(${i*165-25} ${820+i%3*35})`}><path d="M0 -280 L-105 0 H105Z" fill="#27614b"/><path d="M0 -190 L-90 40 H90Z" fill="#327455"/><rect x="-12" y="20" width="24" height="100" fill="#584a39"/></g>:<g key={i}><rect x={i*155} y={450+i%4*45} width="115" height="400" fill="#253a50"/>{Array.from({length:12},(_,j)=><rect key={j} x={i*155+17+j%3*30} y={480+i%4*45+Math.floor(j/3)*62} width="16" height="27" fill={scene==="blackout"&&frame>durationFrames/3?"#1a2836":"#e7c785"}/>)}</g>)}
 <Stick x={430+Math.sin(frame/45)*20} y={820} frame={frame} walking={scene==="people"||scene==="wildlife"}/>
 <Stick x={690} y={835} frame={frame+17} scale={0.8}/>
 </>}</svg>}
 <AbsoluteFill style={{background:"linear-gradient(90deg,rgba(3,9,18,.48),transparent 75%)"}}/>
 <div style={{position:"absolute",left:100,top:76,fontSize:27,fontWeight:700,letterSpacing:6,color:accent}}>THE WORLD THAT EXISTS WITHOUT US</div>
 <div style={{position:"absolute",left:100,right:100,bottom:110,opacity:fade}}>
 <div style={{fontSize:28,color:accent,letterSpacing:4,fontWeight:700}}>{chapter.toUpperCase()}</div>
 <div style={{fontSize:80,fontWeight:800,lineHeight:1.05,marginTop:20,maxWidth:1500,textShadow:"0 4px 20px #000"}}>{beat}</div>
 <div style={{fontSize:38,color:"#e2e8f0",marginTop:22,maxWidth:1420,textShadow:"0 2px 12px #000"}}>{caption}</div></div>
 <div style={{position:"absolute",bottom:55,left:100,width:1720,height:5,background:"#ffffff33"}}><div style={{width:`${100*(index+1)/total}%`,height:"100%",background:accent}}/></div>
 {narrationAudio?<Audio src={staticFile(narrationAudio)}/>:null}
 </AbsoluteFill>;
};
const Root:React.FC=()=> <Composition id="DocumentaryPro1080" component={Documentary} fps={24} width={1920} height={1080} durationInFrames={1440} calculateMetadata={({props})=>({durationInFrames:props.durationFrames})} defaultProps={{chapter:"The Last Second",beat:"The world falls silent",caption:"What happens when humanity disappears?",scene:"city",index:0,total:20,durationFrames:1440}}/>;
registerRoot(Root);
