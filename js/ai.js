/* SECTOR KORHAL v12 — split module: ai / simulation extensions */
window.Korhal=window.Korhal||{};
window.Korhal.modules=window.Korhal.modules||{};
window.Korhal.modules.ai=window.Korhal.modules.ai||{};
(()=>{try{const PF=[],rn=(a,b)=>a+Math.random()*(b-a),pf=o=>{if(window.FXQ!==0&&PF.length<(FXQ===2?150:80))PF.push(o)},on=(x,y)=>x>cam.x-50&&x<cam.x+cv.width+50&&y*K>cam.y-60&&y*K<cam.y+cv.height+60;let lt=performance.now(),lf=-1;addEventListener('korhal:reset',()=>{PF.length=0});window.boomFX=e=>{try{if(!seen(e)||!on(e.x,e.y))return;const bg=e.b,z0=e.air?LF:0,c=e.team==2?'#9c5':'#fa5';for(let i=0;i<(bg?12:4);i++){const a=rn(0,6.28),s=rn(.6,bg?3.6:2.2);pf({k:'d',x:e.x,y:e.y,z:z0+rn(0,8),vx:Math.cos(a)*s,vy:Math.sin(a)*s*.6,vz:rn(1,bg?5:3),l:rn(30,60),m:60,c:i%3?c:'#888'})}for(let i=0;i<(bg?3:1);i++)pf({k:'s',x:e.x+rn(-10,10),y:e.y+rn(-6,6),z:z0+rn(0,12),vx:rn(-.3,.3),vy:rn(-.2,.2),vz:rn(.3,.8),r:rn(8,bg?24:12),l:rn(50,100),m:100});pf({k:'r',x:e.x,y:e.y,r:bg?e.size*.9:R(e)*3,l:22,m:22})}catch(x){}};window.hitFX=(u,t)=>{try{if(!seen(t)||!on(t.x,t.y))return;for(let i=0;i<3;i++){const a=rn(0,6.28);pf({k:'p',x:t.x,y:t.y,z:(t.air?LF:0)+6,vx:Math.cos(a)*1.6,vy:Math.sin(a),vz:rn(.5,2),l:rn(8,16),m:16,c:u.team==1?'#ffe9a0':'#c8ff80'})}}catch(x){}};const dP=dt=>{ctx.save();ctx.translate(-cam.x,-cam.y);for(let i=PF.length-1;i>=0;i--){const p=PF[i];if((p.l-=dt)<=0){PF.splice(i,1);continue}const q=p.l/p.m,y=p.y*K;p.x+=(p.vx||0)*dt;p.y+=(p.vy||0)*dt;if(p.k=='s'){p.z+=p.vz*dt;p.r+=.12*dt;ctx.globalAlpha=q*.35;ctx.fillStyle='#2a2622';ctx.beginPath();ctx.arc(p.x,y-p.z,p.r,0,7);ctx.fill()}else if(p.k=='u'){p.r+=.25*dt;ctx.globalAlpha=q*.2;ctx.fillStyle='#b9a47a';ctx.beginPath();ctx.ellipse(p.x,y,p.r,p.r*K,0,0,7);ctx.fill()}else if(p.k=='r'){const r=p.r*(1-q)+4;ctx.globalAlpha=q*.6;ctx.strokeStyle='#ffd79a';ctx.lineWidth=1+q*4;ctx.beginPath();ctx.ellipse(p.x,y,r,r*K,0,0,7);ctx.stroke()}else{p.vz-=(p.k=='d'?.18:.1)*dt;p.z+=p.vz*dt;if(p.z<0){p.z=0;p.vz*=-.3;p.vx*=.6;p.vy*=.6}ctx.globalAlpha=Math.min(1,q*1.6);ctx.globalCompositeOperation=p.k=='p'?'lighter':'source-over';ctx.fillStyle=p.c;ctx.fillRect(p.x,y-p.z,2.2,2.2)}}ctx.restore();ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'};const _t=terrain;terrain=function(){_t();window.korhalBakeTerrain?.()};const _b=drawB;drawB=function(b){_b(b);try{if(b.team!=1||!b.done||!HH[b.t]||(b.t==='depot'&&b.lowered))return;const s=T[b.t].size,x=b.x+s*.34,y=b.y*K-s*K*.25-HH[b.t],o=(frame+(b.x|0))%90<12;ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle=o?'#ff6a55':'#4a1a14';ctx.fillRect(x-1.5,y-1.5,3,3);if(o){const g=ctx.createRadialGradient(x,y,0,x,y,14);g.addColorStop(0,'rgba(255,90,70,.7)');g.addColorStop(1,'rgba(255,90,70,0)');ctx.fillStyle=g;ctx.fillRect(x-14,y-14,28,28)}ctx.restore()}catch(x){}};/* v23: mineral patches intentionally have no animated sparkle/glint overlay. */const _d=draw;draw=function(){_d();try{const n=performance.now(),dt=Math.min(3,(n-lt)/16.67);lt=n;dP(dt);if(frame%5==0&&frame!=lf){lf=frame;U.forEach(u=>{if(u.air||!(u.team==1||seen(u)))return;if(u._x!=null&&Math.hypot(u.x-u._x,u.y-u._y)>2.5&&Math.random()<.6)pf({k:'u',x:u.x,y:u.y,r:R(u)*.5,l:26,m:26});u._x=u.x;u._y=u.y})}}catch(x){}};let rmode=0,pg={},lf2=-1;const RP={cc:1,barracks:1,factory:1,starport:1},rb=()=>sel.filter(e=>e.b&&e.team==1&&e.done&&RP[e.t]),rOff=()=>{rmode=0;cv.style.cursor=''};window.rallyOn=()=>{if(!rb().length)return;mode=null;rmode=1;cv.style.cursor='cell';say('Click the map to set the rally point (Esc cancels)')};const setR=(x,y)=>{const p=P.find(q=>q.a>0&&Math.hypot(q.x-x,q.y-y)<22),n=rb();n.forEach(b=>{b.rl={x:p?p.x:x,y:p?p.y:y,p}});if(n.length){const r=n[0].rl;pf({k:'r',x:r.x,y:r.y,r:30,l:22,m:22});pf({k:'r',x:r.x,y:r.y,r:52,l:30,m:30});snd('click');say(p?'Rally point set on minerals':'Rally point set')}};cv.addEventListener('mousedown',e=>{if(!rmode||e.button!=0)return;e.stopImmediatePropagation();const r=cv.getBoundingClientRect();setR(e.clientX-r.left+cam.x,(e.clientY-r.top+cam.y)/K);rOff()},true);addEventListener('keydown',e=>{if(e.key=='Escape')rOff()});const _rc=rclick;rclick=function(x,y){rOff();if(sel.length&&sel[0].b&&sel[0].team==1){setR(x,y);return}_rc(x,y)};window.onSpawn=(b,u,k)=>{try{pf({k:'r',x:u.x,y:u.y,r:18,l:16,m:16});for(let i=0;i<5;i++){const a=rn(0,6.28);pf({k:'p',x:u.x,y:u.y,z:4,vx:Math.cos(a),vy:Math.sin(a)*.6,vz:rn(.5,1.6),l:rn(10,18),m:18,c:'#9ff'})}const r=b.rl;if(!r)return;if(k=='scv'&&r.p){if(r.p.a>0){u.st='mine';u.pt=r.p}return}u.tx=r.x+rn(-16,16);u.ty=r.y+rn(-16,16);u.st=k=='scv'?'move':'amove';u.tg=null}catch(x){}};window.doneFX=b=>{try{if(b.team!=1)return;pf({k:'r',x:b.x,y:b.y,r:b.size,l:26,m:26});for(let i=0;i<14;i++){const a=rn(0,6.28);pf({k:'p',x:b.x+Math.cos(a)*b.size/2,y:b.y+Math.sin(a)*b.size/2,z:rn(0,10),vx:Math.cos(a)*.8,vy:Math.sin(a)*.5,vz:rn(1,3),l:rn(16,30),m:30,c:'#aff'})}}catch(x){}};const _h=hurtTeam;hurtTeam=function(e){_h(e);try{if(e.team==1&&frame-(pg.f==null?-999:pg.f)>120)pg={f:frame,x:e.x,y:e.y}}catch(x){}};const flag=(x,y)=>{const t=frame*.1,rr=13+Math.sin(t)*2;ctx.save();ctx.translate(x,y);ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(2,1,9,3,0,0,7);ctx.fill();ctx.strokeStyle='#ffd24a';ctx.globalAlpha=.5+.3*Math.sin(t);ctx.beginPath();ctx.ellipse(0,0,rr,rr*K,0,0,7);ctx.stroke();ctx.globalAlpha=1;ctx.fillStyle='#cbb';ctx.fillRect(-1,-26,2,26);ctx.fillStyle='#ffd24a';ctx.beginPath();ctx.moveTo(1,-26);ctx.lineTo(15+Math.sin(t*2)*2,-22+Math.sin(t*2+1)*1.5);ctx.lineTo(1,-16);ctx.closePath();ctx.fill();ctx.restore()};const _d2=draw;draw=function(){_d2();try{ctx.save();ctx.translate(-cam.x,-cam.y);B.forEach(b=>{if(b.team!=1)return;const s=T[b.t].size;if(!b.done&&frame%7==0)pf({k:'p',x:b.x+rn(-s/2,s/2),y:b.y+rn(-s/2,s/2),z:rn(4,HH[b.t]||16),vx:rn(-.4,.4),vy:0,vz:rn(.5,1.5),l:rn(8,14),m:14,c:'#ffd27a'});const pq=b.q&&b.q.length?b.qt/T[b.q[0]].bt:b.rs?b.rt/1200:-1;if(b.done&&pq>=0){const x=b.x,y=b.y*K-s*K/2-(HH[b.t]||20)-8;ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(x-17,y-1,34,6);ctx.fillStyle='#5cf';ctx.fillRect(x-16,y,32*Math.min(1,pq),4);if(b.q&&b.q.length>1){ctx.fillStyle='#fff';ctx.font='bold 9px Courier New';ctx.textAlign='left';ctx.fillText('x'+b.q.length,x+19,y+5)}}if(b.rl&&sel.includes(b)){const r=b.rl;ctx.save();ctx.strokeStyle='rgba(255,210,74,.7)';ctx.lineWidth=1.5;ctx.setLineDash([6,5]);ctx.lineDashOffset=-frame*.4;ctx.beginPath();ctx.moveTo(b.x,b.y*K);ctx.lineTo(r.x,r.y*K);ctx.stroke();ctx.restore();flag(r.x,r.y*K)}});ctx.restore();if(rmode&&ms.in)flag(ms.x,ms.y);const k=192/W;B.forEach(b=>{if(b.team==1&&b.rl&&sel.includes(b)){mc.fillStyle='#ffd24a';mc.fillRect(b.rl.x*k-1.5,b.rl.y*k-1.5,3,3)}});if(pg.f!=null&&frame-pg.f<150){const q=(frame-pg.f)/150;mc.strokeStyle='rgba(255,70,70,'+(1-q)+')';mc.lineWidth=2;mc.beginPath();mc.arc(pg.x*k,pg.y*k,3+q*16,0,7);mc.stroke()}}catch(x){}};Object.assign(T,{pool:{n:'Spawning Pool',hp:750,size:56,bt:600},den:{n:'Hydralisk Den',hp:700,size:56,bt:600},evo:{n:'Evolution Chamber',hp:700,size:48,bt:480},spire:{n:'Spire',hp:900,size:52,bt:900},cav:{n:'Ultralisk Cavern',hp:900,size:60,bt:900},spore:{n:'Spore Colony',hp:300,size:30,bt:360,rg:170,d:14,cd:25,ar:2,aa:1,ao:1,fc:['#9ff',2]}});Object.assign(HH,{pool:16,den:22,evo:18,spire:44,cav:30,spore:26});T.hatchery.bt=1500;T.sunken.bt=420;
const ZD={pool:(x,y,h)=>{el(x,y,h*.55,h*.28,'#5fc12e');el(x,y,h*.32,h*.16,'#d8ff7a');el(x+Math.sin(frame*.08)*5,y-3-frame%20*.3,2,2,'rgba(220,255,160,.6)')},den:(x,y)=>{for(let i=-1;i<2;i++)poly([x+i*11-4,y,x+i*11+3,y-24+Math.abs(i)*6,x+i*11+7,y],'#d9c49a')},evo:(x,y)=>{el(x-8,y-3,7,6,'rgba(255,120,200,.85)');el(x+8,y-3,6,5,'rgba(255,180,230,.85)')},spire:(x,y)=>poly([x-9,y,x+Math.sin(frame*.03)*3,y-40,x+9,y],'#caa3dc'),cav:(x,y)=>{poly([x-18,y,x-12,y-28,x-6,y],'#eee3c8');poly([x+6,y,x+12,y-28,x+18,y],'#eee3c8')},spore:(x,y)=>el(x,y-6,8+Math.sin(frame*.1)*1.2,10,'#7fe0e0')};
const _b2=drawB;drawB=function(b){_b2(b);try{const z=0;if(z){ctx.save();ctx.globalAlpha=b.done?1:.35+.65*b.pr/T[b.t].bt;z(b.x,b.y*K-HH[b.t],T[b.t].size/2);ctx.restore()}}catch(x){}};
const _a=acq;acq=function(u,r){const t=T[u.t];if(!t.ao)return _a(u,r);let b=null,m=r;for(const e of nearEntities(u.x,u.y,r)){if(e.team==u.team||e.hp<=0||!e.air)continue;const d=D(u,e)-R(e);if(d<m){m=d;b=e}}return b};
let AI={m:0,cd:{},last:0};
const spot=()=>{const m=B.find(b=>b.team==2&&b.t=='hatchery'&&b.done);if(!m)return null;return EX.filter(e=>!B.some(b=>(b.t=='cc'||b.t=='hatchery')&&Math.hypot(b.x-e.x,b.y-e.y)<90)&&!B.some(b=>b.team==1&&Math.hypot(b.x-e.x,b.y-e.y)<220)&&!U.some(u=>u.team==1&&D(u,e)<240)).sort((p,q)=>D(p,m)-D(q,m))[0]||null};
const mkb=(t,x,y)=>{const e=mk(t,2,x,y);e.done=0;e.pr=0;e.hp=e.maxHp*.1;if(seen(e))pf({k:'r',x,y,r:34,l:24,m:24});return e};
const put=(t,h,fr)=>{const c=B.find(b=>b.team==1),d=T[t].size,g=c?Math.atan2(c.y-h.y,c.x-h.x):0;for(let i=0;i<24;i++){const a=g+(fr?rn(-1,1):Math.PI+rn(-1.2,1.2)),r=h.size/2+d/2+rn(14,60+i*4),x=h.x+Math.cos(a)*r,y=h.y+Math.sin(a)*r;if(ok(t,x,y)&&!U.some(u=>u.team==1&&D(u,{x,y})<160))return mkb(t,x,y)}return null};
const aiTick=()=>{if(over)return;if(frame<=1){AI={m:100,cd:{},last:0};B.forEach(b=>{if(b.team==2)b.gd=1});return}if(frame%60)return;const Z=B.filter(b=>b.team==2),H=Z.filter(b=>b.t=='hatchery'),hd=H.filter(b=>b.done),sec=frame/60,ts=[1.35,1,.75][cfg.d];if(!hd.length)return;AI.m=Math.min(1500,AI.m+hd.length*2.4*DF.m);
hd.forEach(h=>{if(!h.gd){h.gd=1;for(let i=0,n=Math.ceil(3*DF.m);i<n;i++)mk('zergling',2,h.x-50+i*20,h.y+70).guard=1;mk('hydra',2,h.x+60,h.y-40).guard=1;if(seen(h))say('The Swarm has established a new hatchery!')}});
if(frame<AI.last)return;const cnt=t=>Z.filter(b=>b.t==t).length,dn=t=>Z.some(b=>b.t==t&&b.done),near=(h,t)=>Z.filter(b=>b.t==t&&Math.hypot(b.x-h.x,b.y-h.y)<260).length,sk=Math.min(4,2+(sec/200|0)),sp=sec>420?2:1,hs=hd.find(h=>near(h,'sunken')<sk),ps=hd.find(h=>near(h,'spore')<sp),ex=spot();
const L=[['pool',40,150,cnt('pool')<1,()=>put('pool',hd[0],0)],['hatchery',100,300,H.length==hd.length&&H.length<2+[1,2,3][cfg.d]&&ex,()=>mkb('hatchery',ex.x,ex.y)],['den',140,200,cnt('den')<1&&dn('pool'),()=>put('den',hd[0],0)],['sunken',90,100,hs,()=>put('sunken',hs,1)],['evo',220,150,cnt('evo')<1&&dn('pool'),()=>put('evo',hd[0],0)],['spore',170,75,(sec>300||U.some(u=>u.team==1&&u.air))&&ps,()=>put('spore',ps,0)],['spire',330,300,cnt('spire')<1&&dn('den'),()=>put('spire',hd[0],0)],['cav',450,300,cnt('cav')<1&&dn('spire'),()=>put('cav',hd[0],0)]];
for(const [t,at,cost,cond,fn] of L){if(sec<at*ts||frame<(AI.cd[t]||0)||!cond)continue;if(AI.m<cost)break;const e=fn();if(e){AI.m-=cost;AI.cd[t]=frame+(t=='hatchery'?3600*ts:t=='sunken'?900:1200);AI.last=frame+420;break}AI.cd[t]=frame+600}};
const _s=step;step=function(){_s();try{aiTick()}catch(x){}};
const _w=spawnWave;spawnWave=function(){const n0=U.length;_w();try{const hd=B.filter(b=>b.team==2&&b.t=='hatchery'&&b.done),c=B.find(b=>b.team==1);if(!hd.length||!c)return;const nu=U.slice(n0),w=wave-1,dn=t=>B.some(b=>b.team==2&&b.t==t&&b.done),add=(t,k,h)=>{k=Math.round(k*DF.m);for(let i=0;i<k;i++){const u=mk(t,2,h.x+rn(-65,65),h.y+rn(-65,65));u.st='amove';u.tx=c.x;u.ty=c.y;nu.push(u)}};nu.forEach((u,i)=>{const h=hd[i%hd.length];u.x=u.lx=h.x+rn(-65,65);u.y=u.ly=h.y+rn(-65,65)});if(dn('pool'))add('zergling',w*.8|0,hd[0]);if(dn('den'))add('hydra',w/3|0,hd[hd.length-1]);if(dn('spire')&&w>=4)add('muta',w/4|0,hd[0]);if(dn('cav')&&w>=6)add('ultra',w/6|0,hd[0]);for(let k=2;k<hd.length;k++){add('zergling',2+w,hd[k]);add('hydra',w>>2,hd[k])}if(dn('evo'))nu.forEach(u=>{u.maxHp*=1.15;u.hp=u.maxHp})}catch(x){}};
}catch(x){}})()
;


// ===== Sector Korhal v2: tech tree, detection, upgrades, new Zerg threats =====
let SCN=[],MN=[],UP={iw:0,ia:0,vw:0,va:0},UPB={},STAT={k:0,l:0,h:0,sc:0},SPD=1,SPA=0,ZUP=0,LW=0,IDX=0,ERR=0;
const INF={marine:1,firebat:1,medic:1},VEH={vulture:1,tank:1,goliath:1,wraith:1,bc:1},LDB={marine:1,firebat:1},rnd=(a,b)=>a+Math.random()*(b-a),
 UPD={iw:{n:'Infantry Weapons',c:[100,175,250],g:[100,175,250],t:[1200,1800,2400]},ia:{n:'Infantry Armor',c:[100,175,250],g:[100,175,250],t:[1200,1800,2400]},
  vw:{n:'Vehicle & Ship Weapons',c:[100,175,250],g:[100,175,250],t:[1500,2100,2700]},va:{n:'Vehicle Plating',c:[100,175,250],g:[100,175,250],t:[1500,2100,2700]}},
 RN=['I','II','III'];
const oops=x=>{if(ERR++<6)console.error(x)};
function resetV2(){SCN=[];MN=[];UP={iw:0,ia:0,vw:0,va:0};UPB={};STAT={k:0,l:0,h:0,sc:0};SPA=0;ZUP=0;LW=0;IDX=0}

Object.assign(T,{
 goliath:{n:'Goliath',hp:125,sp:2.2,rg:125,d:12,cd:22,c:100,g:50,s:2,rad:11,bt:420,aa:1,ar:1,req:'armory',fc:['#ffd36a',2]},
 bc:{n:'Battlecruiser',hp:500,sp:1.4,rg:135,d:14,cd:20,c:400,g:300,s:6,rad:19,bt:1200,air:1,aa:1,ar:3,req:'armory',fc:['#7cf',4]},
 brood:{n:'Broodling',hp:30,sp:2.9,rg:14,d:4,cd:14,rad:6,fc:['#fff',1]},
 lurker:{n:'Lurker',hp:150,sp:2.0,rg:165,d:22,cd:40,rad:13,spl:26,ar:1,fc:['#f8c',3]},
 bunker:{n:'Bunker',hp:350,size:44,c:100,bt:300,req:'barracks',ar:1},
 turret:{n:'Missile Turret',hp:250,size:34,c:100,bt:300,req:'ebay',rg:190,d:18,cd:20,aa:1,ao:1,fc:['#ffd36a',2]},
 ebay:{n:'Engineering Bay',hp:850,size:56,c:125,bt:420},
 armory:{n:'Armory',hp:750,size:60,c:150,g:100,bt:480,req:'factory'},
 comsat:{n:'Comsat Station',hp:500,size:44,c:50,g:50,bt:360,req:'academy'}});
Object.assign(HH,{bunker:16,turret:22,ebay:24,armory:28,comsat:20});

// ---------- detection, damage and armor ----------
function detd(e){
 if(e.team==2){
  for(const s of SCN)if((s.x-e.x)**2+(s.y-e.y)**2<s.r*s.r)return 1;
  for(const b of B)if(b.team==1&&b.done&&b.t=='turret'&&(b.x-e.x)**2+(b.y-e.y)**2<48400)return 1;
  return 0}
 for(const b of B)if(b.team==2&&b.done&&b.t=='spore'&&(b.x-e.x)**2+(b.y-e.y)**2<40000)return 1;
 return 0}
function dmgU(u,t,dm){
 if(u.team==1){if(INF[u.t])dm+=UP.iw;else if(VEH[u.t])dm*=1+.1*UP.vw;if(u.t=='goliath'&&t.air)dm*=1.8}
 else if(!u.b&&ZUP)dm+=ZUP;
 return dm}
function armU(e){return e.team==1&&!e.b?(INF[e.t]?UP.ia:VEH[e.t]?UP.va:0):0}

// loaded bunker units still count against supply
const _sup3=sup;sup=function(){const r=_sup3();B.forEach(b=>{if(b.team==1&&b.ld)b.ld.forEach(q=>r.u+=T[q.t].s)});return r};

// ---------- sounds and sprites ----------
Object.assign(S,{goliath:()=>{nz(.06,.12,4000);tn(600,.07,'square',.04,-300)},bc:()=>{nz(.12,.2,900);tn(180,.2,'sawtooth',.08,-60)},
 brood:()=>nz(.04,.08,3500),lurker:()=>{nz(.15,.2,700);tn(110,.2,'sawtooth',.08,-60)},lurkb:()=>{nz(.3,.2,400);tn(70,.35,'sine',.2,-30)},
 turret:()=>{nz(.08,.15,2500);tn(700,.1,'square',.04,-400)},yamato:()=>{nz(.8,.4,300);tn(50,.9,'sine',.4,-20);tn(1800,.5,'sawtooth',.05,-1500)},
 scan:()=>{tn(400,.5,'sine',.1,900);tn(800,.5,'sine',.06,1200,.1)},mine:()=>{tn(120,.2,'square',.1,-60);nz(.2,.15,800)}});
Object.assign(SEL,{
 goliath:[()=>{rdo();vxs(120,'ao',.1,1.3,.1);tn(200,.1,'square',.05,-80,.3)}],
 bc:[()=>{tn(60,.7,'sawtooth',.07,40);rdo(.2);vxs(95,'uo',.12,1.4,.3)}],
 bunker:[()=>{nxs(.1,.2,900,'bandpass');tn(180,.15,'square',.07,-80,.1)}],
 turret:[()=>{tn(500,.15,'square',.05,-200);nxs(.2,.1,3000,'highpass',.1)}],
 ebay:[()=>{tn(600,.06,'square',.05);tn(900,.06,'square',.05,0,.08);nxs(.2,.08,4000,'highpass',.15)}],
 armory:[()=>{tn(100,.2,'square',.08,-30);nxs(.3,.1,1200,'bandpass',.05)}],
 comsat:[()=>{[0,.1,.2].forEach((d,i)=>tn(1100+i*220,.07,'sine',.06,0,d))}]});
Object.assign(DR,{
 goliath:()=>{rc(-8,-7,16,14,'#6a7a58');rc(-11,-9,6,5,'#333');rc(-11,4,6,5,'#333');el(0,0,7,7,'#9aae7c');rc(4,-5,12,3,'#222');rc(4,2,12,3,'#222')},
 bc:()=>{poly([-22,0,-14,-12,12,-8,26,0,12,8,-14,12],'#8a9db8');poly([-14,-12,12,-8,6,0,-10,0],'#b4c6de');el(10,0,6,3,'#f66');rc(-18,-4,8,8,'#46566e');el(-4,0,5,4,'#7cf')},
 brood:()=>{el(0,0,6,4,'#b4552c');el(5,0,2.5,2.5,'#e99');rc(4,-5,3,1,'#ddd');rc(4,4,3,1,'#ddd')},
 lurker:u=>{if(u.bur){el(0,0,12,8,'#6c2f52');for(let i=-1;i<2;i++)poly([i*7-2,0,i*7,-10-(i==0?4:0),i*7+2,0],'#e9bcd8')}
  else{el(-2,0,15,9,'#8c3f6a');el(11,0,6,5,'#b56a96');for(let i=0;i<3;i++)poly([-8+i*7,-8,-6+i*7,-16,-4+i*7,-8],'#e9bcd8');poly([8,5,22,9,12,2],'#ddd')}}});

// cloaked or burrowed units: faint when hidden, translucent when detected
const _du3=drawU;
drawU=function(u){
 if(!u.cl)return _du3(u);
 if(u.team==2){
  if(!vis(u.x,u.y))return;
  if(!detd(u)){const t=frame*.1+u.id;ctx.save();ctx.globalAlpha=.16+.08*Math.sin(t);ctx.strokeStyle='#cfe';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(u.x,u.y*K-2,R(u)*(1+.1*Math.sin(t)),R(u)*K*1.1,0,0,7);ctx.stroke();ctx.restore();return}
  ctx.save();ctx.globalAlpha=.75;_du3(u);ctx.restore();return}
 ctx.save();ctx.globalAlpha=.5;_du3(u);ctx.restore()};

// building decorations
const ZB={
 bunker:(b,x,y)=>{rc(x-14,y-5,28,6,'#10151b');rc(x-17,y+3,34,3,'#6b5c40');ctx.fillStyle='#7cf5c0';ctx.font='bold 10px Courier New';ctx.textAlign='center';ctx.fillText((b.ld?b.ld.length:0)+'/4',x,y+16)},
 turret:(b,x,y)=>{rc(x-3,y-14,6,14,'#444');el(x,y-16,9,5,'#8aa');rc(x-9,y-23,5,9,'#d6a82e');rc(x+4,y-23,5,9,'#d6a82e')},
 ebay:(b,x,y)=>{el(x,y,16,7,'#3a7bd5');rc(x-12,y-2,24,4,'#e8a02a');el(x+8,y-5,3,3,'#bfe3ff')},
 armory:(b,x,y)=>{rc(x-18,y-8,36,6,'#c8791a');rc(x-14,y+1,28,6,'#c8791a');rc(x-18,y-8,4,15,'#6b4310')},
 comsat:(b,x,y)=>{const p=SCN.length&&b.done?Math.sin(frame*.3)*2:0;el(x,y-4,13,6,'#cfd9e8');el(x,y-4,8,3.5,'#566274');rc(x-1,y-14,2,10,'#e7c53a');if(p)el(x,y-16,4+p,3,'rgba(120,255,255,.6)')}};
const _db3=drawB;
drawB=function(b){
 _db3(b);
 try{return;const s=T[b.t].size;ctx.save();ctx.globalAlpha=b.done?1:.35+.65*b.pr/T[b.t].bt;ZB[b.t](b,b.x-s*.1,b.y*K-HH[b.t]);ctx.restore()}catch(x){oops(x)}};

// ---------- orders and abilities ----------
const stopSel=()=>sel.forEach(u=>{if(u.b)return;u.st='idle';u.tg=null;u.tx=u.x;u.ty=u.y;u.ym=null;u.yw=0;u.rtg=null;u.bk=null});
const cloak=()=>sel.forEach(u=>{if(u.t!='wraith')return;if(u.en==null)u.en=100;if(u.cl)u.cl=0;else if(u.en>=25){u.en-=25;u.cl=1}else{say('Not enough energy');snd('err')}});
const dropMine=()=>sel.forEach(u=>{if(u.t!='vulture')return;if(u.mn==null)u.mn=3;if(u.mn>0){u.mn--;MN.push({x:u.x,y:u.y,a:60});snd('click')}else{say('No spider mines left');snd('err')}});
function doScan(x,y){
 const cs=B.filter(b=>b.team==1&&b.t=='comsat'&&b.done).sort((a,b)=>(b.en==null?50:b.en)-(a.en==null?50:a.en))[0];
 if(!cs){say('No Comsat Station');snd('err');return}
 const en=cs.en==null?50:cs.en;if(en<50){say('Comsat charging ('+Math.floor(en/50*100)+'%)');snd('err');return}
 cs.en=en-50;SCN.push({x,y,r:320,l:600});STAT.sc++;snd('scan');say('Scanner sweep');FX.push({k:'bm',x,y,r:140,l:20,m:20,c:'#5ff'})}
function doYamato(x,y){
 const t=AL.find(e=>e.team==2&&seen(e)&&hit(e,x,y));
 if(!t){say('Select an enemy target');snd('err');return}
 const bs=sel.filter(u=>u.t=='bc'&&!(u.yc>0));
 if(!bs.length){say('Yamato Cannon recharging');snd('err');return}
 bs.forEach(u=>{u.ym=t;u.yw=0});snd('click');say('Yamato Cannon charging')}
const repTarget=(x,y)=>AL.find(e=>e.team==1&&e.hp<e.maxHp&&(e.b?e.done:(VEH[e.t]||e.t=='scv'))&&hit(e,x,y));
function doRepair(x,y){
 const t=repTarget(x,y);if(!t){say('Nothing to repair there');snd('err');return}
 const w=sel.filter(u=>u.t=='scv'&&u!==t);w.forEach(u=>{u.st='rep';u.rtg=t});if(w.length)snd('click')}
function unload(b){
 const L=b.ld||[];if(!L.length)return;
 L.forEach((u,i)=>{u.x=u.lx=b.x+(i-1.5)*18;u.y=u.ly=b.y+b.size/2+16;u.tx=u.x;u.ty=u.y;u.st='idle';u.bk=null;U.push(u)});
 b.ld=[];snd('done');sig=''}
function upgrade(b,k){
 const d=UPD[k],lv=UP[k];if(lv>=3||UPB[k]||b.up)return;
 const c=d.c[lv],g=d.g[lv];if(res.m<c||res.g<g){say('Need '+c+' minerals and '+g+' gas');snd('err');return}
 res.m-=c;res.g-=g;UPB[k]=1;b.up={k,t:0,tot:d.t[lv]};snd('click');sig=''}
function cancelQ(b){
 if(b.q.length){const k=b.q.pop();res.m+=T[k].c;res.g+=T[k].g||0;if(!b.q.length)b.qt=0;snd('click');say(T[k].n+' cancelled')}
 else if(b.up){const d=UPD[b.up.k],lv=UP[b.up.k];res.m+=d.c[lv];res.g+=d.g[lv];UPB[b.up.k]=0;b.up=null;snd('click');say('Research cancelled');sig=''}}
function cancelBld(b){res.m+=Math.floor(T[b.t].c*.75);res.g+=Math.floor((T[b.t].g||0)*.75);b.cancelled=1;b.hp=0;snd('click')}
function setSpd(d){const L=[1,1.5,2,3];SPD=L[Math.max(0,Math.min(L.length-1,L.indexOf(SPD)+d))];say('Game speed '+SPD+'x')}
function selIdle(){
 const s=U.filter(u=>u.team==1&&u.t=='scv'&&u.st=='idle');if(!s.length){say('No idle SCVs');return}
 const u=s[(IDX++)%s.length];sel=[u];cam.x=u.x-cv.width/2;cam.y=u.y*K-cv.height/2;clampCam();sig='';updSel();card();selSnd()}
function selArmy(){
 const s=U.filter(u=>u.team==1&&u.t!='scv'&&u.t!='convoy'&&u.hp>0&&!u.b);if(!s.length){say('No army units');return}
 sel=s;sig='';updSel();card();selSnd()}

// right-click: load bunker, repair
const _rc3=rclick;
rclick=function(x,y){
 try{
  if(sel.length&&!sel[0].b&&sel[0].team==1){
   const bk=B.find(b=>b.team==1&&b.t=='bunker'&&b.done&&hit(b,x,y));
   if(bk&&sel.some(u=>LDB[u.t])){
    bk.ld=bk.ld||[];
    const room=4-bk.ld.length-U.filter(u=>u.st=='load'&&u.bk===bk).length;
    sel.filter(u=>LDB[u.t]).slice(0,Math.max(0,room)).forEach(u=>{u.st='load';u.bk=bk;u.tg=null});
    if(room<=0){say('Bunker is full');snd('err')}else snd('click');
    return}
   if(sel.some(u=>u.t=='scv')&&!AL.find(e=>e.team==2&&seen(e)&&hit(e,x,y))){
    const rt=repTarget(x,y);
    if(rt){sel.filter(u=>u.t=='scv'&&u!==rt).forEach(u=>{u.st='rep';u.rtg=rt});snd('click');return}}}
 }catch(e){oops(e)}
 _rc3(x,y)};

// targeted abilities take the next left click
cv.addEventListener('mousedown',e=>{
 if(e.button!=0||!(mode=='scan'||mode=='yam'||mode=='rep'))return;
 e.stopImmediatePropagation();
 const r=cv.getBoundingClientRect(),x=e.clientX-r.left+cam.x,y=(e.clientY-r.top+cam.y)/K,m=mode;mode=null;
 if(m=='scan')doScan(x,y);else if(m=='yam')doYamato(x,y);else doRepair(x,y)},true);

// ---------- command card ----------
function mkBtn(l,k,s,fn,off){
 const c=$('card'),b=document.createElement('button');
 b.className='b'+(off?' x':'');b.innerHTML='<b>'+k.toUpperCase()+'</b> '+l+'<small>'+s+'</small>';
 b.onclick=()=>{au();if(!off)fn()};c.appendChild(b);if(!off)CK[k]=fn}
function upBtn(b,k,key){
 const d=UPD[k],lv=UP[k],max=lv>=3,off=max||!!UPB[k]||!!b.up||(!max&&(res.m<d.c[lv]||res.g<d.g[lv]));
 mkBtn(max?d.n+' (max)':d.n+' '+RN[lv],key,max?'fully upgraded':UPB[k]?'researching...':d.c[lv]+' / '+d.g[lv]+'g · '+Math.round(d.t[lv]/60)+'s',()=>upgrade(b,k),off)}
const _card3=card;
card=function(){
 _card3();
 try{
  const f=sel[0],cs=t=>T[t].c+(T[t].g?' / '+T[t].g+'g':''),rq=t=>!!(T[t].req&&!has(T[t].req))||res.m<T[t].c||res.g<(T[t].g||0);
  if(f&&f.team==1){
   if(f.b){
    if(!f.done)mkBtn('Cancel build','c','refund 75%',()=>cancelBld(f));
    else{
     const tr=(t,k)=>mkBtn(T[t].n,k,cs(t)+' · '+T[t].s+' supply',()=>train(f,t),rq(t)||sup().u+T[t].s>sup().x||f.q.length>=5);
     if(f.t=='factory')tr('goliath','g');
     if(f.t=='starport')tr('bc','b');
     if(f.t=='ebay'){upBtn(f,'iw','w');upBtn(f,'ia','a')}
     if(f.t=='armory'){upBtn(f,'vw','w');upBtn(f,'va','a')}
     if(f.t=='bunker')mkBtn('Unload all','u','right-click marines to load',()=>unload(f));
     if(['cc','barracks','factory','starport','ebay','armory'].includes(f.t))mkBtn('Cancel','c','last queued / research',()=>cancelQ(f))}
   }else{
    const us=sel.filter(e=>!e.b);
    if(us.some(e=>e.t=='scv')){
     const bd=(t,k)=>mkBtn(T[t].n,k,cs(t),()=>window.beginConstruction(t),rq(t));
     bd('ebay','e');bd('bunker','u');bd('turret','t');bd('armory','g');bd('comsat','k');
     mkBtn('Repair','v','click a damaged building or mech',()=>{mode='rep'})}
    if(us.some(e=>e.t=='wraith'))mkBtn('Cloak','k','toggle · 25 energy',cloak);
    if(us.some(e=>e.t=='vulture'))mkBtn('Spider Mine','i','drop at feet',dropMine);
    if(us.some(e=>e.t=='bc'))mkBtn('Yamato Cannon','y','then click target',()=>{mode='yam'});
    if(us.length)mkBtn('Stop','x','cancel orders',stopSel)}}
  if(B.some(b=>b.team==1&&b.t=='comsat'&&b.done))mkBtn('Scan','z','50 energy · reveal + detect',()=>{mode='scan'})
 }catch(x){oops(x)}};

const _us3=updSel;
updSel=function(){
 _us3();
 try{
  let x='';
  if(sel.length==1){
   const e=sel[0];
   if(e.t=='wraith')x+='<br>Energy '+Math.floor(e.en==null?100:e.en)+(e.cl?' · Cloaked':'');
   if(e.t=='bc')x+='<br>Yamato '+(e.yc>0?Math.ceil(e.yc/60)+'s':'ready');
   if(e.t=='vulture')x+='<br>Spider Mines '+(e.mn==null?3:e.mn);
   if(e.t=='bunker'&&e.done)x+='<br>Loaded '+((e.ld||[]).length)+'/4';
   if(e.t=='comsat'&&e.done)x+='<br>Energy '+Math.floor(e.en==null?50:e.en)+'/200';
   if(e.up)x+='<br>'+UPD[e.up.k].n+' '+(e.up.t/e.up.tot*100|0)+'%'}
  const up=['iw','ia','vw','va'].filter(k=>UP[k]).map(k=>k.toUpperCase()+UP[k]).join(' ');
  if(up)x+='<br><span style="color:#fc4">Upgrades '+up+'</span>';
  if(x)$('sel').innerHTML+=x
 }catch(e){oops(e)}};

// ---------- unit behavior ----------
function lurkerAI(u){
 const t=T.lurker;if(u.cd>0)u.cd--;if(u.sw>0){u.sw--;return}
 let tg=null,m=260;
 for(const e of nearEntities(u.x,u.y,m)){if(e.team==u.team||e.hp<=0||e.air)continue;const d=D(u,e)-R(e)+(e.b?40:0);if(d<m){m=d;tg=e}}
 if(!u.bur){
  if(tg&&m<=t.rg-10){u.bur=1;u.cl=1;u.sw=40;u.idl=0;snd('lurkb',u.x,u.y);return}
  if(tg&&m<230){mv(u,tg.x,tg.y,t.sp);return}
  if(Math.hypot(u.tx-u.x,u.ty-u.y)>4)mv(u,u.tx,u.ty,t.sp);
  return}
 if(tg&&m<=t.rg){atk(u,tg,t.rg,t.d);u.ang=Math.atan2(tg.y-u.y,tg.x-u.x);u.idl=0;return}
 if(++u.idl>150){u.bur=0;u.cl=0;u.sw=30}}
const _up3=upd;
upd=function(u){
 if(u.life!=null&&--u.life<=0){u.hp=0;u.to=1;return}
 if(u.t=='wraith'){if(u.en==null)u.en=100;if(u.cl){u.en-=.07;if(u.en<=0){u.en=0;u.cl=0}}else u.en=Math.min(200,u.en+.02)}
 if(u.t=='bc'){
  if(u.yc>0)u.yc--;
  if(u.ym){
   const t=u.ym;
   if(t.hp<=0){u.ym=null;u.yw=0}
   else{
    const dd=D(u,t)-R(t);u.ang=Math.atan2(t.y-u.y,t.x-u.x);
    if(dd>230){mv(u,t.x,t.y,T.bc.sp*.8);return}
    u.yw++;
    if(u.yw>=50){
     t.hp-=Math.max(1,250-(T[t.t].ar||0));hurtTeam(t);
     FX.push({k:'ln',x1:u.x,y1:u.y,x2:t.x,y2:t.y,l:20,m:20,c:'#9ef',w:9},{k:'ln',x1:u.x,y1:u.y,x2:t.x,y2:t.y,l:20,m:20,c:'#fff',w:3},{k:'bm',x:t.x,y:t.y,r:70,l:24,m:24,c:'#7cf'});
     for(let i=0;i<10;i++)FX.push({k:'sp',x:t.x,y:t.y,vx:rnd(-5,5),vy:rnd(-5,5),l:25,c:'#9ef'});
     u.yc=1500;u.ym=null;u.yw=0;snd('yamato')}
    return}}}
 if(u.t=='scv'&&u.st=='rep'){
  const t=u.rtg;
  if(!t||t.hp<=0||t.hp>=t.maxHp||(t.b&&!t.done)){u.st='idle';u.rtg=null;return}
  if(D(u,t)>R(t)+16){mv(u,t.x,t.y,T.scv.sp);return}
  const d=T[t.t],bt=d.bt||300,rate=t.maxHp/(bt*1.2);
  u.rc=(u.rc||0)+(d.c||50)*.25/bt;
  if(u.rc>=1){if(res.m<1){u.st='idle';u.rtg=null;say('Not enough minerals to repair');snd('err');return}res.m-=1;u.rc-=1}
  t.hp=Math.min(t.maxHp,t.hp+rate);u.ang=Math.atan2(t.y-u.y,t.x-u.x);
  if(frame%7==0)FX.push({k:'sp',x:t.x+rnd(-R(t),R(t))*.5,y:t.y+rnd(-R(t),R(t))*.4,vx:rnd(-1,1),vy:rnd(-2,0),l:14,c:'#ffe27a'});
  return}
 if(u.st=='load'){
  const bk=u.bk;
  if(!bk||bk.hp<=0||!bk.done||(bk.ld||[]).length>=4){u.st='idle';u.bk=null;return}
  if(D(u,bk)<bk.size/2+18){bk.ld.push(u);U=U.filter(x=>x!==u);sel=sel.filter(x=>x!==u);u.st='idle';snd('click');sig='';return}
  mv(u,bk.x,bk.y,T[u.t].sp);return}
 if(u.t=='lurker')return lurkerAI(u);
 _up3(u)};

// ---------- per-frame systems ----------
const _s3=step;
step=function(){
 _s3();
 try{
  SCN.forEach(s=>s.l--);SCN=SCN.filter(s=>s.l>0);
  B.forEach(b=>{
   if(b.team!=1||!b.done)return;
   if(b.t=='comsat')b.en=Math.min(200,(b.en==null?50:b.en)+.02);
   if(b.up&&++b.up.t>=b.up.tot){const k=b.up.k;UP[k]++;UPB[k]=0;b.up=null;say(UPD[k].n+' '+RN[UP[k]-1]+' complete');snd('done');sig=''}
   if(b.t=='bunker'&&b.ld&&b.ld.length)b.ld.forEach(u=>{
    u.x=b.x;u.y=b.y;if(u.cd>0)u.cd--;
    const t=T[u.t];if(!t.d)return;
    const r=t.rg+30,e=acq(u,r);if(e&&D(u,e)-R(e)<=r)atk(u,e,r,t.d)});
   if(b.t=='turret'){const t=T.turret,e=acq(b,t.rg+R(b));if(e&&D(b,e)-R(e)<=t.rg+R(b))atk(b,e,t.rg,t.d)}});
  Object.keys(UPB).forEach(k=>{if(UPB[k]&&!B.some(b=>b.team==1&&b.up&&b.up.k==k))UPB[k]=0});
  let boom=0;
  MN.forEach(m=>{
   if(m.a>0){m.a--;return}
   const e=U.find(u=>u.team==2&&!u.air&&!u.cl&&u.hp>0&&(u.x-m.x)**2+(u.y-m.y)**2<3600);
   if(!e)return;
   m.d=1;boom=1;
   U.forEach(u=>{if(u.team==2&&!u.air&&!u.cl&&u.hp>0&&D(u,m)<80)u.hp-=100});
   FX.push({k:'bm',x:m.x,y:m.y,r:80,l:16,m:16,c:'#fb5'});
   for(let i=0;i<8;i++)FX.push({k:'sp',x:m.x,y:m.y,vx:rnd(-4,4),vy:rnd(-4,4),l:22,c:'#fb5'});
   snd('boom',m.x,m.y)});
  if(boom)MN=MN.filter(m=>!m.d)
 }catch(x){oops(x)}};

// kills, losses, broodlings and bunker release
const _bf3=window.boomFX;
window.boomFX=function(e){
 try{
  if(!e.cancelled&&!e.to){if(e.team==2)STAT.k++;else STAT.l++;if(e.team==2&&e.t=='hatchery')STAT.h++}
  if(e.t=='bunker'&&e.ld&&e.ld.length)unload(e);
  if(e.b&&e.team==2&&e.t!='sunken'&&e.t!='spore'){
   const c=B.find(b=>b.team==1),n=e.t=='hatchery'?6:3;
   for(let i=0;i<n;i++){const u=mk('brood',2,e.x+rnd(-25,25),e.y+rnd(-20,20));u.life=720;if(c){u.st='amove';u.tx=c.x;u.ty=c.y}}}
 }catch(x){oops(x)}
 return _bf3&&_bf3(e)};

// waves: add lurkers, scale Zerg attack with Evolution Chamber
const _sw3=spawnWave;
spawnWave=function(){
 _sw3();
 try{
  const hd=B.filter(b=>b.team==2&&b.t=='hatchery'&&b.done),c=B.find(b=>b.team==1);
  if(!hd.length||!c)return;
  const w=wave-1,dn=t=>B.some(b=>b.team==2&&b.t==t&&b.done);
  ZUP=dn('evo')?Math.min(3,(w-1)>>2):0;
  if(dn('den')&&w>=7){
   const k=Math.round(((w-5)/3|0)*DF.m);
   for(let i=0;i<k;i++){const h=hd[i%hd.length],u=mk('lurker',2,h.x+rnd(-65,65),h.y+rnd(-65,65));u.st='amove';u.tx=c.x;u.ty=c.y}
   if(k&&!LW){LW=1;say('Burrowed Lurkers! Build Missile Turrets or scan with a Comsat')}}
 }catch(x){oops(x)}};

// ---------- HUD, effects, end screen ----------
const objEl=document.createElement('span');objEl.id='obj';objEl.style.color='#c9f';$('top').insertBefore(objEl,$('w'));
const _uh3=updHUD;
updHUD=function(){_uh3();try{objEl.textContent='HATCHERIES '+B.filter(b=>b.team==2&&b.t=='hatchery').length+(SPD!=1?' · '+SPD+'x':'')}catch(x){oops(x)}};
const _d3=draw;
draw=function(){
 _d3();
 try{
  const k=192/W;
  ctx.save();ctx.translate(-cam.x,-cam.y);
  MN.forEach(m=>{const y=m.y*K;el(m.x+2,y+2,6,3,'rgba(0,0,0,.35)');el(m.x,y,5,3,'#39424d');el(m.x,y-1,2.5,1.6,m.a>0?'#664':(frame%40<6?'#f54':'#612'))});
  SCN.forEach(s=>{
   const q=s.l/600,p=Math.min(1,(1-q)*6+.1);
   ctx.globalAlpha=Math.min(1,q*3)*.8;ctx.strokeStyle='#5ff';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(s.x,s.y*K,s.r*p,s.r*K*p,0,0,7);ctx.stroke();
   ctx.globalAlpha=.3*q;ctx.setLineDash([8,8]);ctx.beginPath();ctx.ellipse(s.x,s.y*K,s.r,s.r*K,0,0,7);ctx.stroke();ctx.setLineDash([])});
  ctx.globalAlpha=1;
  U.forEach(u=>{if(u.t=='bc'&&u.ym&&u.yw>0){const r=10+u.yw*.5;ctx.globalAlpha=.6;ctx.strokeStyle='#9ef';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(u.x,u.y*K-LF,r,r*K,0,0,7);ctx.stroke();ctx.globalAlpha=1}});
  B.forEach(b=>{if(b.team==1&&b.done&&b.up){const s=T[b.t].size,x=b.x,y=b.y*K-s*K/2-HH[b.t]-8;ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(x-17,y-1,34,6);ctx.fillStyle='#fc4';ctx.fillRect(x-16,y,32*b.up.t/b.up.tot,4)}});
  ctx.restore();
  if(ms.in&&(mode=='scan'||mode=='yam'||mode=='rep')){
   ctx.save();ctx.lineWidth=2;ctx.strokeStyle=mode=='scan'?'#5ff':mode=='yam'?'#f66':'#7f9';ctx.beginPath();
   if(mode=='scan')ctx.ellipse(ms.x,ms.y,320,320*K,0,0,7);
   else{ctx.arc(ms.x,ms.y,mode=='yam'?14:11,0,7);ctx.moveTo(ms.x-20,ms.y);ctx.lineTo(ms.x+20,ms.y);ctx.moveTo(ms.x,ms.y-20);ctx.lineTo(ms.x,ms.y+20)}
   ctx.stroke();ctx.restore()}
  SCN.forEach(s=>{mc.strokeStyle='rgba(95,255,255,.85)';mc.lineWidth=1;mc.beginPath();mc.arc(s.x*k,s.y*k,s.r*k,0,7);mc.stroke()})
 }catch(x){oops(x)}};
const _end3=end;
end=function(t,c){
 _end3(t,c);
 try{const s=frame/60|0;$('op').textContent='Time '+(s/60|0)+':'+String(s%60).padStart(2,'0')+'  ·  Zerg destroyed '+STAT.k+'  ·  Units and buildings lost '+STAT.l+'  ·  Hatcheries razed '+STAT.h+'  ·  Waves survived '+(wave-1)+'  ·  Scans '+STAT.sc}catch(x){oops(x)}};
$('ob').onclick=startGame;

// Game speed is handled exclusively by the fixed timestep in the animation clock.

// ---------- hotkeys and field manual ----------
const hpEl=document.createElement('div');hpEl.id='hp';hpEl.hidden=true;
hpEl.innerHTML='<div class="in"><h2>FIELD MANUAL</h2><div class="g">'
 +'<div><h4>COMMAND</h4>Drag to select, Shift adds, double-click picks all of a type.<br>Right-click: move, attack, mine, repair, load a bunker.<br><b>A</b> attack-move &middot; <b>X</b> stop &middot; <b>C</b> cancel &middot; <b>L</b> rally<br><b>,</b> idle SCV &middot; <b>.</b> whole army &middot; Ctrl+1-9 groups<br><b>-</b> / <b>=</b> game speed &middot; <b>P</b> pause &middot; <b>N</b> sound</div>'
 +'<div><h4>ABILITIES</h4><b>T</b> stim marines and firebats<br><b>S</b> siege or unsiege tanks<br><b>K</b> wraith cloak (energy)<br><b>I</b> vulture spider mine<br><b>Y</b> Battlecruiser Yamato Cannon<br><b>V</b> SCV repair (costs minerals)<br><b>Z</b> Comsat scan, 50 energy<br><b>U</b> unload a bunker</div>'
 +'<div><h4>TECH</h4>Engineering Bay: infantry upgrades, Missile Turrets.<br>Armory: vehicle upgrades, Goliaths, Battlecruisers.<br>Academy: medics, firebats, Comsat Station.<br>Bunker holds 4 marines or firebats.</div>'
 +'<div><h4>THE SWARM</h4>Burrowed Lurkers and cloaked units cannot be targeted until detected. Missile Turrets (short range) and Comsat scans detect them.<br>Spore Colonies detect your cloaked wraiths.<br>Destroyed Zerg structures release Broodlings.</div>'
 +'</div><p>Press ? or click to close.</p></div>';
$('gc').appendChild(hpEl);
const toggleHelp=()=>{hpEl.hidden=!hpEl.hidden};
hpEl.onclick=()=>{hpEl.hidden=true};
addEventListener('keydown',e=>{
 if(!started||over)return;const k=e.key;
 if(k=='?'||k=='/'){toggleHelp();e.preventDefault()}
 else if(k=='Escape')hpEl.hidden=true;
 else if(k==',')selIdle();
 else if(k=='.')selArmy();
 else if(k=='-'||k=='_')setSpd(-1);
 else if(k=='='||k=='+')setSpd(1)});

// ---------- third map ----------
MAPS.push({n:'Frozen Reach',d:'Ice world. Open flanks, a rock-ridge center and an expansion on every side. You hold the west.',
 sw:'linear-gradient(135deg,#2c5575,#8fb5cc)',base:'#9db8c9',
 pal:['#a9c4d6','#c7dbe8','#8fb0c6','#d8e8f2','#7b9db5','#b5ccdc','#9fbfd2'],sp:['#e8f4fb','#6a8ca3','#ffffff'],tint:'rgba(210,235,255,.18)',
 l:['#6f8f8a','#7ea39c','#6a8782','#9bc2ba','#d8f0ea'],q:['#3f6a6a','#4a7c7c','#5a9090'],bu:['#8fb3b8','#a8c9cc','#bddde0'],fl:['#fff','#cfe9ff','#9ad0e8','#e8f6ff'],
 pc:[340,800],ec:[2060,800],en:[1560,420],
 f:[[340,800,3.14],[2060,800,0],[840,420,4.71],[840,1180,1.57],[1200,800,4.71],[1560,420,4.71],[1560,1180,1.57]],
 g:[[440,630],[440,980],[1960,630],[1960,980],[960,500],[960,1100],[1440,500],[1440,1100]],
 x:[[840,420],[840,1180],[1200,800],[1560,420],[1560,1180]],
 p:[{cx:10.7,cy:25,rx:9,ry:8.4,s:'e',a:25},{cx:64.5,cy:25,rx:9,ry:8.4,s:'w',a:25}],
 w:[{cx:33,cy:8,rx:1.8,ry:6},{cx:33,cy:42,rx:1.8,ry:6},{cx:42,cy:8,rx:1.8,ry:6},{cx:42,cy:42,rx:1.8,ry:6},{cx:37.5,cy:15,rx:4,ry:1.4},{cx:37.5,cy:35,rx:4,ry:1.4}]});
menu();

;

(()=>{
const rn=(a,b)=>a+Math.random()*(b-a),zE=[],zAP=[],zon=(x,y)=>x>cam.x-60&&x<cam.x+cv.width+60&&y*K>cam.y-60&&y*K<cam.y+cv.height+60,zbio=e=>!e.b&&!e.air&&['scv','marine','firebat','medic','zergling','hydra','ultra'].includes(e.t);
let zshk=0,zlt=0,zlak=0;addEventListener('korhal:reset',()=>{zE.length=0;zshk=zlt=zlak=0});const zsp={},zadd=o=>{if(zE.length<650){o.a=0;o.z=o.z||0;zE.push(o)}};
// ================= HUD / UI =================
try{const st=document.createElement('style');st.textContent=`
#top{background:linear-gradient(#2a3d45,#0e171b);border-bottom:3px solid #4d6b75;box-shadow:0 2px 10px #000;letter-spacing:1px}
#top b{display:inline-block;min-width:46px;text-align:right;color:#fff;font-size:15px;text-shadow:0 0 6px currentColor}
#top .m::before{content:'\\25C6 ';color:#7ff}#top .g::before{content:'\\2601 ';color:#7f7}#top .s::before{content:'\\25A3 ';color:#fc4}
@keyframes zbad{0%,60%{color:#f33;transform:scale(1.5)}100%{transform:none}}
#alr{position:absolute;inset:0;pointer-events:none;z-index:3}@keyframes zalr{0%,50%{box-shadow:inset 0 0 110px 26px rgba(255,40,40,.65)}25%,75%,100%{box-shadow:inset 0 0 0 0 rgba(255,40,40,0)}}
#bot{height:172px;background:linear-gradient(#1d282d,#0b1013 45%,#080c0f);border-top:3px solid #4d6b75;box-shadow:inset 0 2px 0 #223841,0 -4px 14px #000;gap:8px;padding:8px}
#mm{border:3px ridge #5a7a84;box-shadow:0 0 0 2px #0a1114,inset 0 0 12px #000,0 0 14px rgba(124,245,192,.15);border-radius:2px}
#sel{width:320px;display:flex;flex-wrap:wrap;gap:8px;align-content:flex-start;border:2px groove #3d5963;background:linear-gradient(#08161b,#050c0f);box-shadow:inset 0 0 14px #000;border-radius:3px}
#sel .zn{color:#5a8;line-height:1.6}#sel small{display:block;color:#5cd;font-size:11px}
.pt{width:76px;height:76px;border:2px inset #4d7783;background:#020708;image-rendering:pixelated;box-shadow:0 0 10px rgba(124,245,192,.2)}
.zi{flex:1;min-width:0;line-height:1.45;font-size:12px}.zi b{color:#fff;letter-spacing:2px}.zf{color:#fc4;font-weight:bold}
.hb{height:6px;background:#2a0808;border:1px solid #000;margin:2px 0}.hb.big{height:9px}.hb i{display:block;height:100%;box-shadow:inset 0 -2px 0 rgba(0,0,0,.35)}
.zg{display:grid;grid-template-columns:repeat(8,34px);gap:3px;flex-basis:100%}.ui{width:34px;cursor:pointer;border:1px solid #2f5662;background:#0a1a20}.ui:hover{border-color:#7cf5c0}.ui canvas{width:32px;height:32px;display:block}.ui .hb{height:4px;margin:0;border:0}
.zc{flex-basis:100%;color:#9cb;font-size:11px}.zq{display:flex;gap:3px;margin-top:3px}.zq span{position:relative;width:34px;height:20px;background:#0a1a20;border:1px solid #2f5662;font-size:9px;line-height:18px;text-align:center;overflow:hidden}.zq i{position:absolute;left:0;bottom:0;height:3px;background:#7cf5c0}
.b{background:linear-gradient(#2b4a53,#142a31);border:2px outset #4d7783;border-radius:2px;color:#cfe;text-shadow:0 1px 1px #000;box-shadow:0 2px 4px #000;position:relative}
.b b:first-child{display:inline-block;background:#06100f;color:#ffe27a;border:1px solid #5a7;padding:0 5px;margin-right:4px;font-size:11px}
.b:hover{filter:brightness(1.35);color:#fff;background:linear-gradient(#3b6a73,#1a3a43)}.b:hover b:first-child{color:#ffe27a}.b:active{border-style:inset;transform:translateY(1px)}.b.x{opacity:.4;filter:grayscale(.8)}`;document.head.appendChild(st);
const al=document.createElement('div');al.id='alr';$('gc').appendChild(al)}catch(e){console.error(e)}
const zpt=c=>{const t=c.dataset.t,e=T[t],g=c.getContext('2d'),s=c.width/32,air=t=='wraith'||t=='muta',mech=t=='vulture'||t=='tank'||t=='ultra';g.setTransform(s,0,0,s,0,0);g.fillStyle='#03181d';g.fillRect(0,0,32,32);g.strokeStyle=c.dataset.z?'#f66':'#7cf5c0';g.fillStyle=c.dataset.z?'rgba(255,100,100,.18)':'rgba(124,245,192,.18)';g.lineWidth=1.4;g.beginPath();
 if(e.size){g.rect(7,9,18,16);g.moveTo(7,9);g.lineTo(16,3);g.lineTo(25,9)}else if(air){g.moveTo(16,6);g.lineTo(28,24);g.lineTo(16,19);g.lineTo(4,24);g.closePath()}else if(mech){g.rect(4,17,24,8);g.rect(10,9,12,8);g.moveTo(22,13);g.lineTo(30,13)}else{g.arc(16,10,5,0,7);g.moveTo(7,28);g.quadraticCurveTo(16,12,25,28);g.moveTo(21,19);g.lineTo(30,17)}
 g.fill();g.stroke();g.fillStyle='rgba(0,0,0,.28)';for(let y=0;y<32;y+=2)g.fillRect(0,y,32,1)};
try{updSel=function(){const p=$('sel');if(!sel.length){p.innerHTML='<div class=zn>NO UNIT SELECTED<small>Drag to select · right-click to command</small></div>';return}
 const hb=(e,c)=>{const f=Math.max(0,Math.min(1,e.hp/e.maxHp));return '<div class="hb '+(c||'')+'"><i style="width:'+(f*100|0)+'%;background:'+(f>.6?'#3d3':f>.3?'#fd3':'#f33')+'"></i></div>'};
 if(sel.length>1){const c={};sel.forEach(e=>c[T[e.t].n]=(c[T[e.t].n]||0)+1);p.innerHTML='<div class=zg>'+sel.slice(0,24).map((e,i)=>'<div class=ui data-i='+i+'><canvas width=32 height=32 data-t='+e.t+(e.team==2?' data-z=1':'')+'></canvas>'+hb(e)+'</div>').join('')+'</div><div class=zc>'+sel.length+' selected · '+Object.entries(c).map(([k,v])=>v+' '+k).join(', ')+'</div>'}
 else{const e=sel[0],t=T[e.t];let h='<canvas class=pt width=64 height=64 data-t='+e.t+(e.team==2?' data-z=1':'')+'></canvas><div class=zi><b>'+t.n.toUpperCase()+'</b>'+(e.b&&!e.done?' <small>BUILDING '+(e.pr/t.bt*100|0)+'%</small>':'')+hb(e,'big')+'<div>'+Math.ceil(e.hp)+' / '+e.maxHp+'</div>';
  if(t.d)h+='<div>ATK '+(e.siege?65:t.d)+' &nbsp; ARM '+(t.ar||0)+'</div>';if(e.stimT>0)h+='<div class=zf>STIMMED</div>';if(e.siege)h+='<div class=zf>SIEGE MODE</div>';if(e.cl)h+='<div class=zf>CLOAKED</div>';
  if(e.b&&e.q&&e.q.length)h+='<div class=zq>'+e.q.map((q,i)=>'<span title="'+T[q].n+'">'+T[q].n.slice(0,3).toUpperCase()+(i?'':'<i style="width:'+(e.qt/T[q].bt*100|0)+'%"></i>')+'</span>').join('')+'</div>';
  p.innerHTML=h+'</div>'}
 p.querySelectorAll('canvas[data-t]').forEach(zpt)};
$('sel').addEventListener('pointerdown',ev=>{const i=ev.target.closest('.ui');if(!i)return;const u=sel[+i.dataset.i];if(u){sel=ev.shiftKey?sel.filter(x=>x!==u):[u];sig='';updSel();card();selSnd()}})}catch(e){console.error(e)}
// ================= terrain damage marks =================
const zst=(x,y,r,c,a)=>{if(!tt)return;tt.save();tt.globalAlpha=a;tt.fillStyle=c;tt.beginPath();for(let i=0;i<8;i++){const an=i/8*6.283,rr=r*rn(.55,1.25);tt[i?'lineTo':'moveTo'](x+Math.cos(an)*rr,y+Math.sin(an)*rr*.7)}tt.closePath();tt.fill();tt.restore()},
zsc=(x,y,r)=>{if(!tt)return;tt.save();const g=tt.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,'rgba(0,0,0,.75)');g.addColorStop(.6,'rgba(24,14,6,.4)');g.addColorStop(1,'rgba(0,0,0,0)');tt.translate(x,y);tt.scale(1,.7);tt.fillStyle=g;tt.beginPath();tt.arc(0,0,r,0,7);tt.fill();tt.globalAlpha=.3;tt.strokeStyle='#d8c090';tt.lineWidth=1.2;tt.beginPath();tt.arc(0,0,r*.42,.4,2.7);tt.stroke();tt.restore()};
// ================= combat visuals =================
const zblast=(x,y,r,n)=>{for(let i=0;i<n;i++)zadd({k:'pf',x:x+rn(-r,r)*.5,y:y+rn(-r,r)*.3,z:rn(0,r),vz:rn(.2,1.2),vx:rn(-.5,.5),r:rn(r*.3,r*.6),l:rn(14,28),c:i%2?'#ff8a1f':'#ffd45a',fire:1});for(let i=0;i<n/2;i++)zadd({k:'pf',x:x+rn(-r,r)*.6,y:y+rn(-r,r)*.3,z:rn(4,r),vz:rn(.4,1.1),r:rn(r*.4,r*.8),l:rn(40,80),c:'#3a3631'});for(let i=0;i<n;i++)zadd({k:'sp',x,y,z:r*.5,vx:rn(-3,3),vy:rn(-1.8,1.8),vz:rn(2,6),l:rn(20,40),c:'#ffc65a'});zadd({k:'rg',x,y,r:r*2.2,l:14})},
zimp=(u,t,hv)=>{if(!zon(t.x,t.y))return;const dx=t.x-u.x,dy=t.y-u.y,d=Math.hypot(dx,dy)||1,bio=zbio(t),zg=t.team==2,z=t.air?LF:6,col=bio?(zg?'#b6ff4a':'#d33'):'#ffd36b';
 zadd({k:'pf',x:t.x,y:t.y,z,r:hv?16:7,l:hv?9:5,c:'#fff3c0',fire:1});for(let i=0;i<(hv?14:5);i++)zadd({k:'sp',x:t.x,y:t.y,z,vx:-dx/d*rn(.3,2)+rn(-1.5,1.5),vy:-dy/d*rn(.2,1)+rn(-1,1),vz:rn(1,hv?5:3),l:rn(14,30),c:col,bl:bio});
 if(hv){zsc(t.x,t.y,26);zadd({k:'rg',x:t.x,y:t.y,r:46,l:16});zshk=Math.max(zshk,hv>1?6:3);for(let i=0;i<5;i++)zadd({k:'pf',x:t.x+rn(-14,14),y:t.y+rn(-8,8),z:rn(0,10),vz:rn(.3,1),r:rn(8,14),l:rn(30,60),c:'#4a4540'})}
 else if(bio&&Math.random()<.35)zst(t.x+rn(-7,7),t.y+rn(-5,5),rn(2,4),zg?'#6a9d1c':'#7a1010',.5);else if(!bio&&!t.air&&Math.random()<.25)zst(t.x+rn(-5,5),t.y+rn(-4,4),rn(2,4),'#000',.3)},
zshot=(u,t)=>{const ty=u.t,dx=t.x-u.x,dy=t.y-u.y,d=Math.hypot(dx,dy)||1,z0=u.air?LF:8,z1=t.air?LF:8,l=Math.max(3,d/22|0),tr=(c,w,sm,ll)=>zadd({k:'tr',x1:u.x,y1:u.y,x2:t.x,y2:t.y,z:z0,z2:z1,c,w,sm,l:ll||l,end:()=>zimp(u,t,ty=='tank'?1:0)});
 if(ty=='tank'&&u.siege){zadd({k:'ar',x1:u.x,y1:u.y,x2:t.x,y2:t.y,h:70+d*.25,l:22,end:()=>zimp(u,t,2)});for(let i=0;i<8;i++)zadd({k:'pf',x:u.x+dx/d*14,y:u.y+dy/d*14,z:14,vx:rn(-1,1),vz:rn(.2,1),r:rn(5,9),l:rn(20,40),c:'#aaa'});/* steady siege camera */}
 else if(ty=='firebat')for(let i=0;i<9;i++){const s=rn(2.6,4.2);zadd({k:'pf',x:u.x,y:u.y,z:z0,vx:dx/d*s+rn(-.5,.5),vy:dy/d*s+rn(-.5,.5),vz:rn(-.1,.3),r:rn(3,6),l:rn(9,16),c:i%3?'#ff8a1f':'#ffd45a',fire:1})}
 else if(ty=='zergling'||ty=='ultra'){zadd({k:'sl',x:t.x,y:t.y,l:7,c:ty=='ultra'?'#ffe9a0':'#e8ffd0',r:ty=='ultra'?22:12,ang:Math.atan2(dy,dx)});if(ty=='ultra')zimp(u,t,1);else zimp(u,t,0)}
 else if(ty=='wraith'){tr('#9df',2,1,l+4);zadd({k:'tr',x1:u.x,y1:u.y-6,x2:t.x,y2:t.y,z:z0,z2:z1,c:'#9df',w:2,sm:1,l:l+4})}
 else if(ty=='muta')tr('#b6ff4a',4,1,l+3);else if(ty=='hydra')tr('#b6ff4a',2);else if(ty=='vulture')tr('#ffb347',2.2);else if(ty=='marine')tr('#ffe27a',1.6);else if(ty=='tank')tr('#ffd27a',3,0,l+2);else tr('#fff',1.5)},
zdeath=e=>{if(!seen(e)||!zon(e.x,e.y))return;const b=e.b,bio=zbio(e),zg=e.team==2,s=b?e.size:R(e)*2;
 if(b){for(let i=0;i<6;i++)zadd({k:'dl',l:i*7+1,end:()=>{zblast(e.x+rn(-s*.4,s*.4),e.y+rn(-s*.3,s*.3),18,14);zshk=Math.max(zshk,i==5?14:6)}});zsc(e.x,e.y,s*.75);for(let i=0;i<5;i++)zst(e.x+rn(-s*.4,s*.4),e.y+rn(-s*.3,s*.3),rn(5,10),'#2a2420',.6);zadd({k:'wk',x:e.x,y:e.y,l:360})}
 else if(bio){const c=zg?'#b6ff4a':'#c22';for(let i=0;i<(e.t=='ultra'?26:14);i++)zadd({k:'sp',x:e.x,y:e.y,z:6,vx:rn(-2.2,2.2),vy:rn(-1.4,1.4),vz:rn(1.5,4.5),l:rn(25,45),c:i%3?c:(zg?'#5a8a18':'#700'),bl:1,gib:1});zst(e.x,e.y,rn(8,13)*(e.t=='ultra'?1.8:1),zg?'#6a9d1c':'#7a1010',.55);if(e.t=='firebat'||e.t=='ultra')zblast(e.x,e.y,22,16);if(e.t=='ultra')zshk=Math.max(zshk,8)}
 else if(e.air){zblast(e.x,e.y,14,10);zadd({k:'dl',l:18,end:()=>{zblast(e.x,e.y,16,12);zsc(e.x,e.y,22);zshk=Math.max(zshk,3)}})}
 else{zblast(e.x,e.y,22,18);zsc(e.x,e.y,s*1.3);zadd({k:'wk',x:e.x,y:e.y,l:240});zshk=Math.max(zshk,e.t=='tank'?6:3)}};
try{const _bf=window.boomFX;window.boomFX=function(e){if(_bf)_bf(e);try{zdeath(e)}catch(x){}};window.hitFX=()=>{};
const _atk=atk;atk=function(u,tg,rg,dm){const c0=u.cd,n0=FX.length;_atk(u,tg,rg,dm);if(c0>0||!(u.cd>0))return;try{for(let i=FX.length-1;i>=n0;i--)if(FX[i].k=='ln')FX.splice(i,1);if(seen(tg)||seen(u))zshot(u,tg)}catch(e){}}}catch(e){console.error(e)}
const zdraw=()=>{if(!zE.length)return;ctx.save();ctx.translate(-cam.x,-cam.y);for(let i=zE.length-1;i>=0;i--){const p=zE[i];if(++p.a>=p.l){zE.splice(i,1);if(p.end)try{p.end(p)}catch(x){}continue}const q=p.a/p.l,k=p.k;
 if(k=='tr'){const x=p.x1+(p.x2-p.x1)*q,y=p.y1+(p.y2-p.y1)*q,f0=Math.max(0,q-.4),x0=p.x1+(p.x2-p.x1)*f0,y0=p.y1+(p.y2-p.y1)*f0,z=p.z+(p.z2-p.z)*q,zz=p.z+(p.z2-p.z)*f0;ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.95;ctx.strokeStyle=p.c;ctx.lineWidth=p.w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x0,y0*K-zz);ctx.lineTo(x,y*K-z);ctx.stroke();ctx.fillStyle='#fff';ctx.fillRect(x-1.5,y*K-z-1.5,3,3);if(p.sm&&p.a%2==0)zE.push({k:'pf',a:0,x,y,z,vz:.2,r:3,l:24,c:'#bbb'})}
 else if(k=='ar'){const x=p.x1+(p.x2-p.x1)*q,y=p.y1+(p.y2-p.y1)*q,h=Math.sin(q*Math.PI)*p.h+8;ctx.globalAlpha=.55;ctx.strokeStyle='#ff5a40';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(p.x2,p.y2*K,14-q*8,(14-q*8)*.6,0,0,7);ctx.stroke();ctx.globalAlpha=.4;ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(x,y*K,5,2.5,0,0,7);ctx.fill();ctx.globalAlpha=1;ctx.fillStyle='#ffe8a0';ctx.fillRect(x-2,y*K-h-2,4,4);if(p.a%2==0)zE.push({k:'pf',a:0,x,y,z:h,vz:0,r:3.5,l:30,c:'#9a9a9a'})}
 else if(k=='pf'){p.x+=p.vx||0;p.y+=p.vy||0;p.z+=p.vz||0;ctx.globalCompositeOperation=p.fire?'lighter':'source-over';ctx.globalAlpha=(p.fire?.8:.4)*(1-q);ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y*K-p.z,p.r*(p.fire?1-q*.5:1+q*.8),0,7);ctx.fill()}
 else if(k=='sp'){p.vz-=.2;p.x+=p.vx;p.y+=p.vy;p.z+=p.vz;if(p.z<0){p.z=0;if(p.bl&&!p.st){p.st=1;zst(p.x,p.y,rn(1.5,3.5),p.c,.55)}p.vz*=-.25;p.vx*=.5;p.vy*=.5}ctx.globalCompositeOperation=p.bl?'source-over':'lighter';ctx.globalAlpha=1-q*q;ctx.fillStyle=p.c;const s=p.gib?3:2;ctx.fillRect(p.x,p.y*K-p.z,s,s)}
 else if(k=='rg'){const r=p.r*q+4;ctx.globalAlpha=(1-q)*.6;ctx.strokeStyle='#ffd79a';ctx.lineWidth=1+(1-q)*4;ctx.beginPath();ctx.ellipse(p.x,p.y*K-4,r,r*K,0,0,7);ctx.stroke()}
 else if(k=='sl'){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=1-q;ctx.strokeStyle=p.c;ctx.lineWidth=3*(1-q)+1;ctx.beginPath();ctx.arc(p.x,p.y*K-8,p.r,p.ang-1.3+q*1.1,p.ang-.2+q*1.1);ctx.stroke()}
 else if(k=='wk'){if(p.a%5==0)zE.push({k:'pf',a:0,x:p.x+rn(-8,8),y:p.y+rn(-4,4),z:4,vz:rn(.3,.7),r:rn(4,7),l:rn(40,70),c:'#4a4540'});if(p.a%11==0)zE.push({k:'pf',a:0,x:p.x+rn(-8,8),y:p.y+rn(-4,4),z:3,vz:.4,r:rn(3,5),l:16,c:'#ff8a1f',fire:1})}}
 ctx.restore()};
// ================= audio cues =================
const zspeak=(t,urgent,gap)=>{try{if(mute||!AC||!window.speechSynthesis)return;const n=Date.now();if(zsp[t]&&n-zsp[t]<(gap||6000))return;zsp[t]=n;if(urgent)speechSynthesis.cancel();rdo();const u=new SpeechSynthesisUtterance(t);u.rate=1.02;u.pitch=.55;u.volume=.9;const v=speechSynthesis.getVoices().filter(x=>/^en/i.test(x.lang));u.voice=v.find(x=>/male|daniel|alex|david|fred/i.test(x.name))||v[0]||null;setTimeout(()=>speechSynthesis.speak(u),90)}catch(e){}},
AK={scv:[150,'uo','ia'],marine:[105,'ao','ae'],firebat:[80,'ou','ao'],medic:[240,'ea','ia'],vulture:[130,'ai','ae'],tank:[65,'oo','ao'],wraith:[170,'ei','ia']},
zack=k=>{try{if(!AC||mute||Date.now()-zlak<260)return;const us=sel.filter(u=>!u.b&&AK[u.t]);if(!us.length)return;zlak=Date.now();const t=us[Math.random()*us.length|0].t,[f,m,a]=AK[t];rdo();
 if(k=='atk'){vxs(f*.9,a+a[1],.07,1.7,.07);nxs(.04,.2,3000,'bandpass',.02);if(t=='tank')tn(60,.3,'sawtooth',.1,-20,.05);if(t=='vulture')tn(90,.3,'sawtooth',.05,260,.05)}
 else{vxs(f,m+m[0],.1,1.4,.07);if(t=='tank'||t=='vulture')nxs(.35,.1,500,'lowpass',.05,1500);if(t=='wraith')tn(600,.3,'sawtooth',.03,500,.05)}}catch(e){}},
zflash=(id,an)=>{const e=$(id);if(!e)return;e.style.animation='none';e.offsetWidth;e.style.animation=an},
zmsg=s=>{if(/researched/i.test(s))zspeak('Research complete');else if(/complete/i.test(s))zspeak('Construction complete');
 else if(/under attack/i.test(s)){zspeak(/base/i.test(s)?'Our base is under attack!':'Our forces are under attack!',1,9000);S.warn();zflash('alr','zalr 1.3s')}
 else if(/minerals|resources/i.test(s)){zspeak('Not enough minerals');zflash('m','zbad .7s')}
 else if(/gas/i.test(s)){zspeak('Not enough vespene gas');zflash('g','zbad .7s')}
 else if(/^Build more/i.test(s)){zspeak('Additional supply depots required');zflash('s','zbad .7s')}
 else if(/incoming/i.test(s))zspeak('Warning. Zerg wave approaching.',0,4000);else if(/Cannot build/i.test(s))zspeak('Cannot build there')};
try{S.warn=()=>{[0,.3,.6].forEach(d=>{tn(880,.14,'square',.06,0,d);tn(660,.14,'square',.06,0,d+.15)})};S.err=()=>{tn(150,.1,'square',.1);tn(110,.16,'square',.1,0,.11)};S.done=()=>{[523,659,784,1047].forEach((f,i)=>tn(f,.2,'triangle',.08,0,i*.08))};
const _ht=hurtTeam;hurtTeam=function(e){const a=alertT;_ht(e);if(alertT!=a){say(e.b?'Our base is under attack!':'Our forces are under attack!');zAP.push({x:e.x,y:e.y,t:300})}};
const _is=issue;issue=function(x,y,am){_is(x,y,am);zack(am?'atk':'mv')};
const _rc=rclick;rclick=function(x,y){if(sel.length&&!sel[0].b&&sel[0].team==1&&AL.find(e=>e.team==2&&seen(e)&&(e.b?e.sn||1:1)&&hit(e,x,y)))zack('atk');_rc(x,y)}}catch(e){console.error(e)}
const zhud=()=>{if(msgT>zlt)zmsg(msgS);zlt=msgT;for(let i=zAP.length-1;i>=0;i--){const p=zAP[i];if(--p.t<=0){zAP.splice(i,1);continue}mc.strokeStyle='rgba(255,70,70,'+Math.min(1,p.t/60)+')';mc.lineWidth=2;mc.beginPath();mc.arc(p.x*192/W,p.y*128/H,3+(p.t%40)/4,0,7);mc.stroke()}
 if(frame%15==0){const s=sup();$('s').style.color=s.u>=s.x?'#f55':''}
 if(zshk){zshk=0}if(cv.style.transform)cv.style.transform=''};
const _dr=draw;draw=function(){_dr();try{zdraw();zhud()}catch(e){console.error(e)}};
})();
;

(()=>{try{
const Rd=Math.random,rn=(a,b)=>a+Rd()*(b-a),SX={k:0,l:0,c:0,r:0},TH=['SWARM','AIR RAID','ARMORED','STANDARD'],th=w=>w%5==0?'BOSS':w<3?'STANDARD':TH[Rd()*4|0],mmss=f=>{const s=Math.max(0,f)/60|0;return(s/60|0)+':'+('0'+s%60).slice(-2)},rcnt=()=>U.filter(u=>u.team==1&&u.rk&&u.hp>0).length;
let CP={q:0,e:0},pm=null,CR=[],bx=[],bm2=[],NT='STANDARD',nc=0,wm=1,pw=0;addEventListener('korhal:reset',()=>{CP.q=CP.e=0;CR.length=0;bx.length=0;bm2.length=0;NT='STANDARD';nc=0;wm=1;pw=0;SX.k=SX.l=SX.c=SX.r=0;pm=null});
const grab=(u,c)=>{SX.c++;const r=Rd();let m;if(r<.3){const v=150+(Rd()*150|0);res.m+=v;m='+'+v+' minerals'}else if(r<.5){const v=75+(Rd()*75|0);res.g+=v;m='+'+v+' gas'}else if(r<.72){U.forEach(e=>{if(e.team==1)e.hp=Math.min(e.maxHp,e.hp+e.maxHp*.5)});m='army repaired 50%'}else if(r<.88){CP.q=CP.e=0;m='commander powers recharged!'}else{for(let i=0;i<4;i++)mk('marine',1,c.x+rn(-30,30),c.y+rn(-30,30));m='4 marines joined you'}say('Supply crate: '+m);snd('done');FX.push({k:'bm',x:c.x,y:c.y,r:50,l:24,m:24,c:'#ffd24a'})};
const strike=s=>{if(s.k=='q'){AL.filter(e=>e.team==2&&Math.hypot(e.x-s.x,e.y-s.y)<105+R(e)).forEach(e=>{e.hp-=e.b?320:300;e.kb=null});FX.push({k:'bm',x:s.x,y:s.y,r:120,l:34,m:34,c:'#fff'},{k:'bm',x:s.x,y:s.y,r:80,l:26,m:26,c:'#ff8a3a'});for(let i=0;i<24;i++)FX.push({k:'sp',x:s.x,y:s.y,vx:Rd()*10-5,vy:Rd()*10-5,l:30,c:'#fc6'});s.fl=frame;bm2.push(s);snd('boom',s.x,s.y)}else{[['marine',5],['medic',2],['tank',1]].forEach(([t,n])=>{for(let i=0;i<n;i++){const a=Rd()*6.28;mk(t,1,s.x+Math.cos(a)*38,s.y+Math.sin(a)*28)}});FX.push({k:'bm',x:s.x,y:s.y,r:70,l:30,m:30,c:'#7cf5c0'});snd('done');say('Reinforcements have landed')}};
const tick=()=>{if(frame<=1){CP={q:1200,e:3000};pm=null;CR=[];bx=[];bm2=[];NT='STANDARD';nc=3600+Rd()*1800|0;wm=1;pw=0;SX.k=SX.l=SX.c=SX.r=0;return}if(over)return;
bx=bx.filter(s=>{if(frame<s.t)return 1;strike(s);return 0});
if(frame>=nc&&CR.length<3){for(let i=0;i<30;i++){const x=rn(120,W-120),y=rn(120,H-120);if(!bs(x,y)&&!B.some(b=>Math.hypot(b.x-x,b.y-y)<140)&&!P.some(p=>Math.hypot(p.x-x,p.y-y)<90)){CR.push({x,y,e:frame+9000});break}}nc=frame+4500+Rd()*3000|0}
CR=CR.filter(c=>{if(frame>c.e)return 0;const u=U.find(u=>u.team==1&&!u.air&&Math.hypot(u.x-c.x,u.y-c.y)<30);if(!u)return 1;grab(u,c);return 0})};
const killed=e=>{const k=e.kb;if(e.team==2){if(!e.b)SX.k++;if(e.boss){res.m+=300;res.g+=100;say('ALPHA ULTRALISK SLAIN!  +300 minerals  +100 gas');CR.push({x:e.x,y:e.y,e:frame+9000})}if(k&&k.hp>0&&k.team==1&&!k.b&&!e.b){k.kl=(k.kl||0)+1;const rk=k.kl>=20?3:k.kl>=10?2:k.kl>=4?1:0;if((k.rk||0)<rk){k.rk=rk;k.maxHp*=1.12;k.hp=Math.min(k.maxHp,k.hp+k.maxHp*.3);SX.r++;FX.push({k:'bm',x:k.x,y:k.y,r:26,l:20,m:20,c:'#ffd24a'})}}}else if(!e.b)SX.l++};
const _bx=window.boomFX;window.boomFX=e=>{try{killed(e)}catch(x){}_bx&&_bx(e)};
const _dm=dmgU;dmgU=function(u,t,d){return _dm(u,t,d)*(1+(u.rk||0)*.12)};
const add=(t,k,nu)=>{const hh=B.filter(b=>b.team==2&&b.t=='hatchery'&&b.done),tg=B.find(b=>b.team==1);if(!hh.length||!tg)return;k=Math.round(k*DF.m);for(let i=0;i<k;i++){const h=hh[Rd()*hh.length|0],u=mk(t,2,h.x+rn(-70,70),h.y+rn(-70,70));u.st='amove';u.tx=tg.x;u.ty=tg.y;nu.push(u)}};
const _w=spawnWave;spawnWave=function(){const n0=U.length;_w();try{const w=wave-1,t=NT,nu=U.slice(n0);if(t=='SWARM')add('zergling',4+w*2,nu);else if(t=='AIR RAID')add('muta',2+(w/2|0),nu);else if(t=='ARMORED'){add('ultra',1+(w/5|0),nu);add('hydra',2+w,nu)}else if(t=='BOSS'){add('ultra',1,nu);const b=nu[nu.length-1];if(b){b.boss=1;b.maxHp=b.hp=b.maxHp*3;b.rad*=1.3}add('zergling',6+w,nu);add('hydra',w,nu)}NT=th(wave);say('WAVE '+w+(t=='STANDARD'?'':' - '+t)+(t=='BOSS'?': ALPHA ULTRALISK!':' incoming!'))}catch(x){}};
const _s=step;step=function(){_s();try{tick()}catch(x){}};
const _e=end;end=function(t,c){const w=over;_e(t,c);if(!w&&over){try{$('op').textContent='Time '+mmss(frame)+'  |  Waves survived '+(wave-1)+'  |  Zerg killed '+SX.k+'  |  Units lost '+SX.l+'  |  Promotions '+SX.r+'  |  Crates '+SX.c}catch(x){}}};
const _r=rclick;rclick=function(x,y){pm=null;cv.style.cursor='';_r(x,y)};
addEventListener('keydown',e=>{if(!started||over)return;const l=e.key.toLowerCase();if(l=='q'||l=='e'){if(frame<CP[l]){say((l=='q'?'Orbital Strike':'Drop Pods')+' recharging: '+mmss(CP[l]-frame));snd('err');e.stopImmediatePropagation();return}pm=l;mode=null;cv.style.cursor='crosshair';say(l=='q'?'Orbital Strike: click a target (Esc cancels)':'Drop Pods: click a landing zone (Esc cancels)');e.stopImmediatePropagation()}else if(e.key=='Escape'){pm=null;cv.style.cursor=''}},true);
cv.addEventListener('mousedown',e=>{if(!pm||e.button!=0)return;e.stopImmediatePropagation();const r=cv.getBoundingClientRect(),x=e.clientX-r.left+cam.x,y=(e.clientY-r.top+cam.y)/K;CP[pm]=frame+(pm=='q'?5400:9000);bx.push({k:pm,x,y,t:frame+(pm=='q'?80:110)});say(pm=='q'?'Orbital Strike inbound...':'Drop pods inbound...');snd('warn');pm=null;cv.style.cursor=''},true);
const _d=draw;draw=function(){_d();ctx.save();try{ctx.translate(-cam.x,-cam.y);
CR.forEach(c=>{if(!vis(c.x,c.y))return;const y=c.y*K,b=Math.sin(frame*.08)*3,g=ctx.createLinearGradient(0,y-70,0,y);g.addColorStop(0,'rgba(255,220,120,0)');g.addColorStop(1,'rgba(255,220,120,.5)');ctx.fillStyle=g;ctx.fillRect(c.x-3,y-70,6,70);ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(c.x,y+4,13,5,0,0,7);ctx.fill();ctx.fillStyle='#caa24a';ctx.fillRect(c.x-9,y-16+b,18,14);ctx.fillStyle='#ffe38a';ctx.fillRect(c.x-9,y-16+b,18,4);ctx.fillStyle='#6b4f1a';ctx.fillRect(c.x-1,y-16+b,2,14)});
U.forEach(u=>{if(u.hp<=0||!(u.team==1||seen(u)))return;if(u.rk){const y=u.y*K-R(u)-16;ctx.strokeStyle='#ffd24a';ctx.lineWidth=1.6;for(let i=0;i<u.rk;i++){ctx.beginPath();ctx.moveTo(u.x-4,y-i*3+2);ctx.lineTo(u.x,y-i*3-1);ctx.lineTo(u.x+4,y-i*3+2);ctx.stroke()}}if(u.boss){ctx.strokeStyle='rgba(255,60,60,.85)';ctx.lineWidth=2;const r=R(u)+8;ctx.beginPath();ctx.ellipse(u.x,u.y*K,r,r*K,0,0,7);ctx.stroke()}});
bx.forEach(s=>{const q=Math.sin(frame*.3)*.2+.8;ctx.strokeStyle=s.k=='q'?'rgba(255,80,60,'+q+')':'rgba(124,245,192,'+q+')';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(s.x,s.y*K,s.k=='q'?105:60,(s.k=='q'?105:60)*K,0,0,7);ctx.stroke();ctx.beginPath();ctx.ellipse(s.x,s.y*K,(s.k=='q'?105:60)*(1-(s.t-frame)/110>0?1-(s.t-frame)/110:0),(s.k=='q'?105:60)*K*(1-(s.t-frame)/110>0?1-(s.t-frame)/110:0),0,0,7);ctx.stroke()});
bm2=bm2.filter(s=>frame-s.fl<26);bm2.forEach(s=>{const q=(frame-s.fl)/26,y=s.y*K,g=ctx.createLinearGradient(0,y-900,0,y);g.addColorStop(0,'rgba(255,200,120,0)');g.addColorStop(1,'rgba(255,255,255,'+(1-q)+')');ctx.fillStyle=g;ctx.fillRect(s.x-22*(1-q)-4,y-900,(22*(1-q)+4)*2,900)});
ctx.restore();ctx.save();const w=cv.width;if(wt>pw+5)wm=wt;pw=wt;wm=Math.max(1,wm);const bo=NT=='BOSS';
ctx.fillStyle='rgba(4,10,14,.72)';ctx.fillRect(12,8,290,42);ctx.strokeStyle=bo?'#ff5544':'#2f8a78';ctx.lineWidth=1;ctx.strokeRect(12.5,8.5,289,41);ctx.font='bold 12px Courier New';ctx.textAlign='left';ctx.fillStyle=bo?'#ff8a7a':'#7cf5c0';ctx.fillText('NEXT: WAVE '+wave+'  '+NT+'  '+mmss(wt),20,24);ctx.fillStyle=bo?'#ff5544':'#2f8a78';ctx.fillRect(20,29,274*Math.max(0,Math.min(1,1-wt/wm)),3);ctx.fillStyle='#9fb';ctx.font='11px Courier New';ctx.fillText('KILLS '+SX.k+'   VETERANS '+rcnt()+'   CRATES '+SX.c,20,45);
[['Q','ORBITAL STRIKE','q'],['E','DROP PODS','e']].forEach(([k,n,c],i)=>{const rd=CP[c]-frame,y=22+i*20,x=w-206;ctx.fillStyle='rgba(4,10,14,.72)';ctx.fillRect(x,y-12,198,17);ctx.fillStyle=rd<=0?'#7cf5c0':'#8a9aa0';ctx.font='bold 11px Courier New';ctx.fillText('['+k+'] '+n+'  '+(rd<=0?'READY':mmss(rd)),x+6,y)});
if(pm&&ms.in){const r=pm=='q'?105:60;ctx.strokeStyle=pm=='q'?'#ff5544':'#7cf5c0';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(ms.x,ms.y,r,r*K,0,0,7);ctx.stroke();ctx.beginPath();ctx.moveTo(ms.x-12,ms.y);ctx.lineTo(ms.x+12,ms.y);ctx.moveTo(ms.x,ms.y-8);ctx.lineTo(ms.x,ms.y+8);ctx.stroke()}
if(frame%40<28){const k=192/W;mc.fillStyle='#ffd24a';CR.forEach(c=>mc.fillRect(c.x*k-2,c.y*k-2,4,4))}
}catch(x){}ctx.restore()};
try{hpEl.querySelector('.g').insertAdjacentHTML('beforeend','<div><h4>OVERHAUL</h4><b>Q</b> Orbital Strike (click a target)<br><b>E</b> Drop Pods: marines, medics, a tank<br>Units gain veteran ranks from kills.<br>Collect supply crates for bonuses.<br>Every 5th wave is a boss wave.</div>')}catch(x){}
}catch(e){console.error(e)}})()

window.Korhal.modules.ai.loaded=true;
