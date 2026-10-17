/* SECTOR KORHAL v12 — split module: core */
window.Korhal=window.Korhal||{};
window.Korhal.modules=window.Korhal.modules||{};
window.Korhal.modules.core=window.Korhal.modules.core||{};
// Three quality presets: Balanced is the stable default for every launch.
window.FXQ=1;window.KORHAL_QUALITY='balanced';window.korhalShowFPS=false;

addEventListener('keydown',e=>{if(e.key=='Escape'){const c=document.getElementById('cv');window.__esc={c:c&&c.style.cursor,m:typeof mode!='undefined'&&mode,h:typeof hpEl!='undefined'&&hpEl&&!hpEl.hidden}}},true);
const W=2400,H=1600,$=i=>document.getElementById(i),cv=$('cv'),ctx=cv.getContext('2d'),mm=$('mm'),mc=mm.getContext('2d');
const T={
scv:{n:'SCV',hp:60,sp:1.9,rg:14,d:5,cd:30,c:50,s:1,rad:11.5,bt:240,fc:['#fff',1]},
marine:{n:'Marine',hp:40,sp:2.1,rg:115,d:6,cd:15,c:50,s:1,rad:8,bt:300,aa:1,fc:['#ffe27a',1.5]},
firebat:{n:'Firebat',hp:50,sp:2.1,rg:32,d:8,cd:20,c:50,g:25,s:1,rad:9,bt:330,spl:30,req:'academy',fc:['#ff8a1f',7]},
medic:{n:'Medic',hp:60,sp:2.3,rg:0,d:0,cd:1,c:50,g:25,s:1,rad:8,bt:330,req:'academy'},
vulture:{n:'Vulture',hp:80,sp:3.6,rg:110,d:20,cd:30,c:75,s:2,rad:11,bt:360,fc:['#9ff',2]},
tank:{n:'Siege Tank',hp:150,sp:1.5,rg:200,d:30,cd:60,c:150,g:100,s:2,rad:15,bt:540,ar:1,spl:20,fc:['#fff',4]},
wraith:{n:'Wraith',hp:120,sp:2.8,rg:130,d:12,cd:20,c:150,g:100,s:2,rad:11,bt:540,air:1,aa:1,fc:['#f55',2]},
zergling:{n:'Zergling',hp:35,sp:3.2,rg:14,d:5,cd:14,rad:8,fc:['#fff',2]},
hydra:{n:'Hydralisk',hp:80,sp:2.2,rg:115,d:11,cd:25,rad:11,aa:1,fc:['#8f4',2]},
muta:{n:'Mutalisk',hp:120,sp:3.2,rg:100,d:9,cd:28,rad:11,air:1,aa:1,fc:['#c6f',3]},
ultra:{n:'Ultralisk',hp:400,sp:2.6,rg:22,d:20,cd:25,rad:20,ar:3,spl:34,fc:['#fff',5]},
cc:{n:'Command Center',hp:1200,size:84,c:400,bt:900,sup:10,vis:270},
depot:{n:'Supply Depot',hp:400,size:44,c:100,bt:300,sup:8},
barracks:{n:'Barracks',hp:750,size:64,c:150,bt:480},
factory:{n:'Factory',hp:850,size:64,c:150,g:100,bt:540,req:'barracks'},
starport:{n:'Starport',hp:850,size:64,c:150,g:100,bt:540,req:'factory'},
academy:{n:'Academy',hp:600,size:52,c:150,bt:420,req:'barracks'},
refinery:{n:'Refinery',hp:500,size:48,c:75,bt:300},
hatchery:{n:'Hatchery',hp:1800,size:92,vis:200},
sunken:{n:'Sunken Colony',hp:300,size:34,rg:150,d:30,cd:40,ar:2,fc:['#d6f',3]}};
let res={m:200,g:0},U=[],B=[],P=[],GY=[],EX=[],FX=[],AL=[],VS=[],sel=[],grp={},CK={},cam={x:0,y:0},mode=null,frame=0,wave=1,wt=2700,stim=0,msgS='',msgT=0,alertT=0,started=0,over=0,paused=0,sig='',ms={x:0,y:0,in:0},drag=null,lastClk=0,supplyWarned=0;
const R=e=>e.rad||e.size/2,D=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),say=s=>{msgS=s;msgT=200},all=()=>U.concat(B),has=t=>B.some(b=>b.team==1&&b.t==t&&b.done);
// Universal sight range for Terran and Zerg units/buildings. Combat range is unchanged.
const SIGHT_SCALE=1.18;
const sightRadius=e=>Math.round(((e.siege?310:(T[e.t].vis||(e.air?230:190)))+(e.air?0:elev(e.x,e.y)*65))*SIGHT_SCALE);
addEventListener('korhal:reset',()=>{supplyWarned=0});

// ---------- UI ----------
function updHUD(){$('m').textContent=Math.max(0,Math.round(res.m));$('g').textContent=Math.max(0,Math.round(res.g));const s=sup();$('s').textContent=Math.round(s.u)+'/'+Math.round(s.x);$('w').textContent='Wave '+wave+' in '+Math.ceil(wt/60)+'s';
 const blocked=s.x>0&&s.u>=s.x;
 if(blocked&&!supplyWarned&&started&&!over){supplyWarned=1;say('SUPPLY BLOCKED — BUILD MORE SUPPLY DEPOTS');try{snd('warn')}catch(e){}}
 if(!blocked)supplyWarned=0;
}
function updSel(){const p=$('sel');if(!sel.length){p.innerHTML='<b>Nothing selected</b><br>Drag to select units, click a building for orders.';return}
 if(sel.length>1){const c={};sel.forEach(e=>c[T[e.t].n]=(c[T[e.t].n]||0)+1);p.innerHTML='<b>'+sel.length+' selected</b><br>'+Object.entries(c).map(([k,v])=>v+'× '+k).join('<br>');return}
 const e=sel[0],t=T[e.t];let h='<b>'+t.n+'</b>'+(e.b&&!e.done?' (building '+(e.pr/t.bt*100|0)+'%)':'')+'<br>HP '+Math.round(e.hp)+'/'+Math.round(e.maxHp);
 if(t.d)h+='<br>Damage '+(e.siege?65:t.d)+' · Armor '+(t.ar||0);if(e.stimT>0)h+='<br>Stimmed';if(e.siege)h+='<br>Sieged';
 if(e.b&&e.q&&e.q.length)h+='<br>Training: '+e.q.map((q,i)=>T[q].n+(i?'':' '+(e.qt/T[q].bt*100|0)+'%')).join(', ');
 if(e.rs)h+='<br>Stim Pack '+(e.rt/12|0)+'%';p.innerHTML=h}
// Keep affordability separate from HUD/portrait invalidation. Both the keyboard
// command callbacks and the pointer buttons inspect the same button.disabled state.
// This runs from the simulation clock at least every 8 ticks, even when the HUD
// signature doesn't change; only buttons whose state changed touch the DOM.
function refreshCardAffordability(){
 const c=$('card');if(!c||!sel.length||sel[0].team!==1)return;
 const subject=sel[0],available=sup(),qCount=subject.b?(subject.q?.length||0):0;
 c.querySelectorAll('.b[data-ak]').forEach(button=>{
  const key=button.dataset.ak;let disabled=false;
  if(key==='stim') disabled=!!(stim||subject.rs||res.m<100||res.g<100);
  else if(T[key]){
   const data=T[key];
   disabled=!!(data.req&&!has(data.req))||res.m<(data.c||0)||res.g<(data.g||0);
   if(!data.size) disabled=disabled||available.u+(data.s||0)>available.x||qCount>=5;
  } else return; // attack-move, hold, rally, etc. aren't resource actions
  if(button.disabled!==disabled){
   button.disabled=disabled;
   button.classList.toggle('x',disabled);
   button.setAttribute('aria-disabled',disabled?'true':'false');
  }
 });
}

function card(){const c=$('card');c.innerHTML='';CK={};if(!sel.length||sel[0].team!=1)return;const f=sel[0];
 const A=(l,k,s,fn,off,key)=>{const b=document.createElement('button');b.className='b'+(off?' x':'');b.dataset.ak=key||'';b.disabled=!!off;b.setAttribute('aria-disabled',off?'true':'false');b.innerHTML='<b>'+k.toUpperCase()+'</b> '+l+'<small>'+s+'</small>';b.onclick=()=>{au();if(!b.disabled)fn()};c.appendChild(b);CK[k]=()=>{if(!b.disabled)fn()}},
  cs=t=>T[t].c+(T[t].g?' / '+T[t].g+'g':''),off=t=>!!(T[t].req&&!has(T[t].req))||res.m<T[t].c||res.g<(T[t].g||0);
 if(f.b){if(!f.done)return;const tr=(t,k)=>A(T[t].n,k,cs(t)+' · '+T[t].s+' supply',()=>train(f,t),off(t)||sup().u+T[t].s>sup().x||f.q.length>=5,t);
  ({cc:()=>tr('scv','s'),barracks:()=>{tr('marine','m');tr('firebat','f');tr('medic','d')},factory:()=>{tr('vulture','v');tr('tank','t')},starport:()=>tr('wraith','w'),academy:()=>A('Stim Pack','t','100 / 100g',()=>research(f),stim||f.rs||res.m<100||res.g<100,'stim')}[f.t]||(()=>{}))();if(f.t=='cc'||f.t=='barracks'||f.t=='factory'||f.t=='starport')A('Set rally point','l','or right-click the map',()=>{window.rallyOn&&rallyOn()});return}
 if(sel.some(e=>e.t=='scv')){const bd=(t,k)=>A(T[t].n,k,cs(t),()=>window.beginConstruction(t),off(t)||false,t);A('Attack-move','a','then click · SCVs fight',()=>{mode='am'});bd('depot','d');bd('barracks','b');bd('refinery','r');bd('academy','y');bd('factory','f');bd('starport','s');bd('cc','c');return}
 if(sel.some(e=>T[e.t].d))A('Attack-move','a','then click',()=>{mode='am'});
 if(sel.some(e=>e.t=='tank'))A('Siege / Unsiege','s','toggle',siege);
 if(stim&&sel.some(e=>e.t=='marine'||e.t=='firebat'))A('Stim Pack','t','-10 HP, faster',doStim,false,'stim')}
function pick(x1,y1,x2,y2,add){
 if(mode&&T[mode]?.size&&window.korhalBuildWorkers?.length)return;
 const my=e=>e.team==1&&e.hp>0;
 let r=[];
 if(Math.hypot(x2-x1,y2-y1)<6){
  const px=x2,py=y2*K;
  const candidates=U.filter(my).map(u=>{
   const ux=u.x,uy=u.y*K-(u.air?LF+5:(u.t=='scv'?10:11));
   const dx=Math.abs(px-ux),dy=Math.abs(py-uy),rx=u.rad+(u.t=='scv'?12:9),ry=u.t=='scv'?24:Math.max(19,u.rad*K+12);
   return{u,inside:dx<=rx&&dy<=ry,score:(dx/rx)**2+(dy/ry)**2};
  }).filter(v=>v.inside).sort((a,b)=>a.score-b.score);
  const u=candidates.length?candidates[0].u:null;
  const b=B.find(e=>my(e)&&hit(e,x2,y2,2));
  r=u?[u]:b?[b]:[];
  if(u&&Date.now()-lastClk<350&&sel[0]&&sel[0].t==u.t)r=U.filter(e=>my(e)&&e.t==u.t&&e.x>cam.x&&e.x<cam.x+cv.width&&e.y*K>cam.y&&e.y*K<cam.y+cv.height);
  lastClk=Date.now();
 }else{
  r=U.filter(e=>my(e)&&e.x>=Math.min(x1,x2)&&e.x<=Math.max(x1,x2)&&e.y>=Math.min(y1,y2)&&e.y<=Math.max(y1,y2));
 }
 sel=add?[...new Set([...sel,...r])]:r;sig='';updSel();card();if(sel[0])selSnd();
}

window.Korhal.modules.core.loaded=true;
