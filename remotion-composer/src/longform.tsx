import React from "react";
import { AbsoluteFill, Composition, interpolate, registerRoot, useCurrentFrame } from "remotion";

type SceneProps = { title: string; explanation: string; takeaway: string; index: number; total: number; topic: string };

const Scene: React.FC<SceneProps> = ({title, explanation, takeaway, index, total, topic}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 30], [0, 1], {extrapolateRight: "clamp"});
  const drift = Math.sin(frame / 45) * 25;
  const pulse = 0.9 + Math.sin(frame / 24) * 0.07;
  const palette = ["#2563eb", "#7c3aed", "#059669", "#ea580c", "#db2777"];
  const accent = palette[index % palette.length];
  return <AbsoluteFill style={{backgroundColor:"#f8fafc",fontFamily:"Arial, sans-serif",color:"#0f172a",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,left:0,height:14,width:`${((index + 1) / total) * 100}%`,background:accent}}/>
    <div style={{position:"absolute",top:80,left:85,fontSize:28,fontWeight:700,color:accent}}>{topic.toUpperCase()} · LESSON {index + 1} / {total}</div>
    <div style={{position:"absolute",left:80,top:175,width:740,opacity:enter,transform:`translateY(${(1-enter)*35}px)`}}>
      <div style={{fontSize:66,fontWeight:800,lineHeight:1.12}}>{title}</div>
      <div style={{fontSize:35,lineHeight:1.45,marginTop:38,color:"#334155"}}>{explanation}</div>
      <div style={{marginTop:45,borderLeft:`10px solid ${accent}`,padding:"20px 28px",background:"#e2e8f0",borderRadius:12,fontSize:30,fontWeight:700}}>{takeaway}</div>
    </div>
    <svg width="440" height="500" viewBox="0 0 440 500" style={{position:"absolute",right:25,top:175}}>
      <circle cx={220+drift} cy="220" r={150*pulse} fill={accent} opacity=".12"/>
      <circle cx="220" cy="220" r="112" fill="none" stroke={accent} strokeWidth="12" strokeDasharray="35 20" transform={`rotate(${frame/3} 220 220)`}/>
      <rect x="150" y="150" width="140" height="140" rx="24" fill={accent} transform={`rotate(${frame/7} 220 220)`}/>
      <circle cx="220" cy="220" r="35" fill="#fff"/>
      <path d="M 80 390 Q 220 330 360 390" fill="none" stroke={accent} strokeWidth="9" strokeLinecap="round"/>
      {[0,1,2,3,4].map(n=><circle key={n} cx={110+n*55} cy={390-Math.sin((frame/25)+n)*12} r="10" fill={accent}/>)}
    </svg>
    <div style={{position:"absolute",bottom:45,left:85,fontSize:22,color:"#64748b"}}>2D ANIMATED EXPLAINER · OPENMONTAGE</div>
  </AbsoluteFill>;
};

const Root: React.FC = () => <Composition id="LongformScene" component={Scene}
  fps={24} width={1280} height={720} durationInFrames={1440}
  defaultProps={{title:"How the Internet Works",explanation:"Information moves across connected networks.",takeaway:"Networks exchange packets.",index:0,total:20,topic:"The Internet"}} />;

registerRoot(Root);
