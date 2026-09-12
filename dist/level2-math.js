(function(root){const M={
 power:(x,p)=>x===0&&p===0?null:x**p,
 angleType:a=>a===0?'Zero angle':a<90?'Acute':a===90?'Right':a<180?'Obtuse':a===180?'Straight':a<360?'Reflex':'Full turn',
 point:(a,r=140,cx=220,cy=190)=>[cx+r*Math.cos(a*Math.PI/180),cy-r*Math.sin(a*Math.PI/180)],
 missing:(type,k)=>type==='line'?180-k:type==='point'?360-120-k:type==='cross'?k:(180-k)/5,
 polygon(points){if(points.length!==4)return null;const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
 const intersects=(a,b,c,d)=>cross(a,b,c)*cross(a,b,d)<=0&&cross(c,d,a)*cross(c,d,b)<=0;
 if(intersects(points[0],points[1],points[2],points[3])||intersects(points[1],points[2],points[3],points[0]))return null;
 const area=points.reduce((s,p,i)=>s+p[0]*points[(i+1)%4][1]-points[(i+1)%4][0]*p[1],0);if(Math.abs(area)<100)return null;
 let angles=points.map((p,i)=>{const prev=points[(i+3)%4],next=points[(i+1)%4],u=[prev[0]-p[0],prev[1]-p[1]],v=[next[0]-p[0],next[1]-p[1]],len=Math.hypot(...u)*Math.hypot(...v);if(len<1)return NaN;let a=Math.acos(Math.max(-1,Math.min(1,(u[0]*v[0]+u[1]*v[1])/len)))*180/Math.PI;return (u[0]*v[1]-u[1]*v[0])*area>0?360-a:a});return angles.every(a=>Number.isFinite(a)&&a>1&&a<359)?angles:null;
 }
};root.L2Math=M;if(typeof module!=='undefined')module.exports=M;})(typeof window==='undefined'?globalThis:window);
