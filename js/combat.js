/* SECTOR KORHAL v12 — split module: combat */
window.Korhal=window.Korhal||{};
window.Korhal.modules=window.Korhal.modules||{};
window.Korhal.modules.combat=window.Korhal.modules.combat||{};
// ---------- orders ----------
function issue(x,y,am){const us=sel.filter(e=>!e.b),c=Math.ceil(Math.sqrt(us.length));us.forEach((u,i)=>{u.tx=x+((i%c)-(c-1)/2)*24;u.ty=y+(Math.floor(i/c)-(c-1)/2)*24;u.st=am?'amove':'move';u.tg=null})}
function rclick(x,y){if(!sel.length||sel[0].b||sel[0].team!=1)return;
 const en=AL.find(e=>e.team==2&&seen(e)&&(e.b?e.sn||1:1)&&hit(e,x,y));if(en){sel.forEach(u=>{if(!u.b&&T[u.t].d){u.st='atk';u.tg=en}});snd('click');return}
 const p=P.find(p=>p.a>0&&Math.hypot(p.x-x,p.y-y)<22);if(p){sel.forEach(u=>{if(u.t=='scv'){u.st='mine';u.pt=p;u.cr=0}});snd('click');return}
 issue(x,y,0);FX.push({k:'bm',x,y,r:12,l:14,m:14,c:'#7cf5c0'});snd('click')}
function ok(t,x,y){const half=T[t].size/2,s=half+2;if(x<s||y<s||x>W-s||y>H-s)return 0;
 if(B.some(b=>Math.abs(b.x-x)<T[t].size/2+T[b.t].size/2-1&&Math.abs(b.y-y)<T[t].size/2+T[b.t].size/2-1))return 0;
  if(U.some(u=>u.team==1&&u.st=='build'&&u.job&&Math.abs(u.job.x-x)<T[t].size/2+T[u.job.t].size/2&&Math.abs(u.job.y-y)<T[t].size/2+T[u.job.t].size/2))return 0;
 // Match collision to the *visible ground footprint*, not the glow/plume or
 // decoration around minerals and geysers. Allow a small service aisle.
 if(P.some(p=>p.a>0&&Math.abs(p.x-x)<half+16&&Math.abs(p.y-y)<half+16))return 0;
 if(GY.some(g=>Math.abs(g.x-x)<half+19&&Math.abs(g.y-y)<half+19))return 0;
 const level=elev(x,y);
 for(let a=x-half+2;a<x+half;a+=12)for(let b=y-half+2;b<y+half;b+=12)if(bs(a,b)||elev(a,b)!==level)return 0;
 return 1}

function snap(t,x,y){if(t=='refinery'){
  // Accept clicks over the tall plume as well as the circular ground geyser.
  const nearby=GY.map(g=>({g,d:Math.hypot(g.x-x,(g.y-y)*K)})).filter(v=>v.d<82).sort((a,b)=>a.d-b.d);
  const v=nearby[0];if(!v)return{x,y,ok:0,reason:'Click on a vespene geyser'};
  const g=v.g,occupied=!!(g.r&&g.r.hp>0),size=T.refinery.size;
  const overlap=B.some(b=>b.hp>0&&Math.abs(b.x-g.x)<(b.size+size)/2-3&&Math.abs(b.y-g.y)<(b.size+size)/2-3);
  const claimed=U.some(u=>u.team==1&&u.st=='build'&&u.job?.t=='refinery'&&Math.hypot(u.job.x-g.x,u.job.y-g.y)<20);
  return{x:g.x,y:g.y,ok:!occupied&&!overlap&&!claimed,g,reason:occupied?'Geyser already taken':overlap?'Geyser footprint blocked':claimed?'Geyser reserved':''};
 }
 if(t=='cc'){const e=EX.find(e=>Math.hypot(e.x-x,e.y-y)<140&&!B.some(b=>b.t=='cc'&&Math.hypot(b.x-e.x,b.y-e.y)<60));if(e)return{x:e.x,y:e.y,ok:ok(t,e.x,e.y)}}
 return{x,y,ok:ok(t,x,y)}}
window.korhalBuildWorkers=[];
window.beginConstruction=function(type){
 const workers=sel.filter(e=>e.t==='scv'&&e.team===1&&e.hp>0);
 if(!workers.length)return false;
 window.korhalBuildWorkers=workers.slice();sel=workers;mode=type;
 drag=null;sig='';updSel();card();return true;
};
function place(x,y){
 const type=mode,d=T[type];if(!d||!d.size)return;
 const workers=[...new Set([...window.korhalBuildWorkers,...sel])].filter(e=>e.t==='scv'&&e.team===1&&e.hp>0&&!e.b&&U.includes(e));

 if(!workers.length){say('Select at least one SCV to construct '+d.n);snd('err');return}
 const s=snap(type,x,y);
 if(!s.ok){say(s.reason||(type=='refinery'?'Select a free geyser':'Cannot build there — location blocked'));snd('err');return}
 if(res.m<d.c||res.g<(d.g||0)){say('Not enough '+(res.m<d.c?'minerals':'vespene gas'));snd('err');mode=null;ms.in=0;const tip=document.getElementById('tip');if(tip)tip.style.display='none';return}
 // Reserve and display the footprint on the click. Only an SCV operates it.
 const worker=workers.sort((a,b)=>D(a,s)-D(b,s))[0];
 res.m-=d.c;res.g-=d.g||0;
 const b=mk(type,1,s.x,s.y);b.act=-1;b.awaiting=1;b.lastBuilderFrame=frame;
 if(s.g)s.g.r=b;
 worker.job=null;worker.st='bldg';worker.tb=b;worker.tg=null;worker.pa=null;worker.cr=0;
 FX.push({k:'bm',x:b.x,y:b.y,r:Math.max(20,b.size*.55),l:18,m:18,c:'#7cf5c0'});
 say(d.n+' foundation placed — SCV assigned');snd('click');
 mode=null;window.korhalBuildWorkers=[];ms.in=0;cv.style.cursor='crosshair';const tip=document.getElementById('tip');if(tip)tip.style.display='none';
 sig='';updHUD();updSel();card();
}
function train(b,t){const d=T[t];if(b.q.length>=5)return say('Queue full');if(res.m<d.c||res.g<(d.g||0)){say(res.m<d.c?'Not enough minerals':'Not enough vespene gas');return snd('err')}
 const s=sup();if(s.u+d.s>s.x){say('Build more Supply Depots');return snd('err')}res.m-=d.c;res.g-=d.g||0;b.q.push(t);snd('click')}
function research(b){if(stim||b.rs)return;if(res.m<100||res.g<100){say('Need 100 minerals and 100 gas');return snd('err')}res.m-=100;res.g-=100;b.rs=1;b.rt=0;snd('click')}
const siege=()=>sel.forEach(u=>{if(u.t=='tank'){u.siege^=1;u.sw=50;u.st='idle';u.tg=null;u.tx=u.x;u.ty=u.y;snd('tank2',u.x,u.y);FX.push({k:'bm',x:u.x,y:u.y,r:u.siege?48:30,l:22,m:22,c:'#7cf5c0'})}}),
 doStim=()=>sel.forEach(u=>{if((u.t=='marine'||u.t=='firebat')&&u.hp>10&&!(u.stimT>0)){u.hp-=10;u.stimT=360;snd('click')}});

window.Korhal.modules.combat.loaded=true;
