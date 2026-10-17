/* SECTOR KORHAL v12 — split module: entities */
window.Korhal=window.Korhal||{};
window.Korhal.modules=window.Korhal.modules||{};
window.Korhal.modules.entities=window.Korhal.modules.entities||{};
// ---------- unit logic ----------
function upd(u){const t=T[u.t];if(u.cd>0)u.cd--;if(u.stimT>0)u.stimT--;if(u.sw>0){u.sw--;return}
 const sp=t.sp*(u.stimT>0?1.5:1),rg=u.siege?380:t.rg,dm=u.siege?65:t.d;
 if(u.t=='scv'){if(u.st=='mine')return mine(u,sp);if(u.st=='build')return bld(u,sp);if(u.st=='bldg')return bldg(u,sp)}
 if(u.t=='medic'&&(u.st=='idle'||u.st=='amove')){let h=null,m=260;U.forEach(e=>{if(e.team==1&&!e.air&&e.t!='tank'&&e.t!='vulture'&&e.hp<e.maxHp){const d=D(u,e);if(d<m&&e!==u){m=d;h=e}}});if(h){if(m>18)mv(u,h.x,h.y,sp);else{h.hp=Math.min(h.maxHp,h.hp+.3);if(frame%30==0)FX.push({k:'bm',x:h.x,y:h.y,r:10,l:14,m:14,c:'#7f9'})}return}}
 if(u.siege)u.st='idle';let tg=null;if(u.st=='atk'){if(!u.tg||u.tg.hp<=0){u.st='idle';u.tg=null}else tg=u.tg}
 if(!tg&&(u.st=='idle'||u.st=='amove'||u.team==2))tg=acq(u,u.st=='idle'?(u.team==2?230:rg+8):300);
 if(tg){const dd=D(u,tg)-R(u)-R(tg);if(dd<=rg){if(t.d>0)atk(u,tg,rg,dm);u.ang=Math.atan2(tg.y-u.y,tg.x-u.x);return}else if(!u.siege&&(u.st=='atk'||u.st=='amove'||u.team==2)){mv(u,tg.x,tg.y,sp);return}}
 if((u.st=='move'||u.st=='amove')&&!u.siege){if(Math.hypot(u.tx-u.x,u.ty-u.y)>4)mv(u,u.tx,u.ty,sp);else u.st='idle'}
 else if(u.team==2&&!u.guard&&u.st=='idle'&&frame%120==u.id%120){const c=B.find(b=>b.team==1);if(c){u.st='amove';u.tx=c.x;u.ty=c.y}}}
const mnCC=p=>{let b=null,m=1e9;B.forEach(c=>{if(c.team==1&&c.t=='cc'&&c.done){const d=D(c,p);if(d<m){m=d;b=c}}});return b};
const mnWK=(p,u)=>{let n=0;U.forEach(s=>{if(s!==u&&s.team==1&&s.t=='scv'&&s.st=='mine'&&s.pt===p)n++});return n};
const nearP=u=>{let b=null,m=1e9;P.forEach(p=>{if(p.a<=0)return;const c=mnCC(p);if(!c||D(c,p)>260)return;const sc=mnWK(p,u)*1000+D(u,p);if(sc<m){m=sc;b=p}});return b};
function mine(u,sp){let p=u.pt;if(!p||p.a<=0){p=u.pt=nearP(u);if(!p){u.st='idle';return}}
 const c=mnCC(p);if(!c){u.st='idle';return}
 const ex=c.x-p.x,ey=c.y-p.y,el_=Math.hypot(ex,ey)||1,ux=ex/el_,uy=ey/el_,rp=1/Math.hypot(ux/26,uy/16)+5,mx=p.x+ux*rp,my=p.y+uy*rp,h=c.size/2+u.rad*.6,bd=h/Math.max(Math.abs(ux),Math.abs(uy))+3+CS,dx=c.x-ux*bd,dy=c.y-uy*bd;
 const go=(x,y)=>{const d=Math.hypot(x-u.x,y-u.y);if(d<220&&clear(u.x,u.y,x,y)){u.ang=Math.atan2(y-u.y,x-u.x);if(d<=sp){u.x=x;u.y=y}else{u.x+=(x-u.x)/d*sp;u.y+=(y-u.y)/d*sp}}else mv(u,x,y,sp)},at=(x,y)=>Math.hypot(x-u.x,y-u.y)<=Math.max(3,sp);
 if(!u.cr){if(!at(mx,my))return go(mx,my);
  if(p.lk&&p.lk!==u&&p.lk.hp>0&&p.lk.st=='mine'&&p.lk.pt===p&&!p.lk.cr&&frame-p.lf<100){const q=nearP(u);if(q&&q!==p&&mnWK(q,u)<mnWK(p,u))u.pt=q;return}
  p.lk=u;p.lf=frame;if(++u.mt>205){u.cr=8;u.mt=0;p.a-=8;p.lk=null}}
 else{if(!at(dx,dy))return go(dx,dy);res.m+=u.cr;window.korhalRecordIncome?.('m',u.cr);u.cr=0;const q=nearP(u);if(q&&q!==p&&mnWK(q,u)<mnWK(p,u))u.pt=q}}
function bld(u,sp){
 // Compatibility for any existing queued work orders: reserve the structure immediately.
 const j=u.job;if(!j){u.st='idle';return}
 if(j.building&&j.building.hp>0){u.tb=j.building;u.job=null;u.st='bldg';return}
 u.job=null;u.st='idle';say('Construction order expired — place again');snd('err');
}
function updB(b){const t=T[b.t];
 if(!b.done){if(b.team==1&&!(b.act>=frame-1))return;b.pr++;b.hp=Math.min(b.maxHp,b.hp+b.maxHp*.9/t.bt);if(b.pr>=t.bt){b.done=1;window.doneFX&&doneFX(b);if(b.team==1){snd('done');say(t.n+' complete')}}return}
 if(b.t=='refinery'&&frame%12==0){res.g++;window.korhalRecordIncome?.('g',1)}
 if(b.cd>0)b.cd--;
 if(t.d&&b.team==2){const e=acq(b,t.rg+R(b));if(e&&D(b,e)-R(e)<=t.rg+R(b)){atk(b,e,t.rg,t.d)}}
 if(b.q.length){
   const k=b.q[0],d=T[k];
   if(d&&++b.qt>=d.bt){
    // Supply is reserved when the item is queued. Never silently drop or
    // pause later entries due to resource/supply checks made mid-production.
    const pos=freeSpot(b.x,b.y,Math.random()*8,b);
    const u=mk(k,1,pos.x,pos.y);
    if(u){b.q.shift();b.qt=0;snd('done');if(k==='scv'){u.st='mine';u.pt=nearP(u)}window.onSpawn&&onSpawn(b,u,k)}
    else b.qt=d.bt-1;
   }
  }
 if(b.rs&&++b.rt>=1200){stim=1;b.rs=0;say('Stim Pack researched');snd('done')}}
function spawnWave(){const h=B.find(b=>b.team==2&&b.t=='hatchery'),c=B.find(b=>b.team==1);if(!h||!c)return;const n=wave+DF.t,add=(t,k)=>{k=Math.round(k*DF.m);for(let i=0;i<k;i++){const u=mk(t,2,h.x+(Math.random()-.5)*130,h.y+(Math.random()-.5)*130);u.st='amove';u.tx=c.x;u.ty=c.y}};
 add('zergling',Math.max(3,2+n*2));add('hydra',n>>1);if(n>=3)add('muta',(n-1)>>1);if(n>=6)add('ultra',(n-4)/3|0);say('Zerg wave '+wave+' incoming!');snd('warn');wave++;wt=Math.max(900,DF.iv-Math.min(900,wave*60));hotT=frame+900}
function step(){
 frame++;AL=all();rebuildSpatial(AL);
 VS.length=0;for(const e of AL)if(e.team===1&&(!e.b||e.done))VS.push([e.x,e.y,sightRadius(e)]);
 for(const s of SCN)VS.push([s.x,s.y,s.r]);
 U.forEach(upd);B.forEach(updB);
 AL=all();rebuildSpatial(AL);for(let i=0;i<U.length;i++)U[i]._ci=i;
 for(let i=0;i<U.length;i++){const a=U[i];visitNearby(a.x,a.y,a.rad+20,b=>{if(!b||b.b||b._ci==null||b._ci<=i||!!a.air!=!!b.air)return;if(a.t==='scv'&&b.t==='scv'&&a.st==='mine'&&b.st==='mine')return;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),m=a.rad+b.rad;if(d>0&&d<m){const p=(m-d)*.25;a.x-=dx/d*p;a.y-=dy/d*p;b.x+=dx/d*p;b.y+=dy/d*p}})}
 U.forEach(u=>{if(u.air)return;visitNearby(u.x,u.y,125,b=>{if(!b.b||(b.t==='depot'&&b.lowered))return;const h=b.size/2+u.rad*.6,dx=u.x-b.x,dy=u.y-b.y;if(Math.abs(dx)<h&&Math.abs(dy)<h){if(h-Math.abs(dx)<h-Math.abs(dy))u.x=b.x+Math.sign(dx||1)*h;else u.y=b.y+Math.sign(dy||1)*h}});if(bs(u.x,u.y)){u.x=u.lx;u.y=u.ly}else{u.lx=u.x;u.ly=u.y}});
 AL.filter(e=>e.hp<=0).forEach(e=>{if(e.b&&!e._pathingRemoved)fp(e,-1);window.boomFX&&boomFX(e);const big=e.b,c=e.team==2?'#9d4':'#fa4';FX.push({k:'bm',x:e.x,y:e.y,r:big?e.size:R(e)*2.2,l:big?40:18,m:big?40:18,c});for(let i=0;i<(big?14:5);i++)FX.push({k:'sp',x:e.x,y:e.y,vx:Math.random()*6-3,vy:Math.random()*6-3,l:25,c});
  if(!e.air){tt.globalAlpha=.5;tt.fillStyle=e.team==2?'#4b8f2a':'#2a2118';tt.beginPath();tt.ellipse(e.x,e.y,R(e)*.9,R(e)*.6,Math.random()*3,0,7);tt.fill();tt.globalAlpha=1}snd(big?'boom':'die_'+e.t,e.x,e.y)});
 U=U.filter(e=>e.hp>0);B=B.filter(e=>e.hp>0);sel=sel.filter(e=>e.hp>0);
 B.forEach(b=>{if(b.team==2&&vis(b.x,b.y))b.sn=1});
 if(!over&&--wt<=0)spawnWave();
 if(!B.some(b=>b.team==2&&b.t=='hatchery'))end('VICTORY — SWARM ELIMINATED','#7cf5c0');else if(!B.some(b=>b.team==1))end('DEFEAT — BASE DESTROYED','#f55');
 const sp=14;if(ms.in&&window.ES!==0){if(ms.x<14)cam.x-=sp;if(ms.x>cv.width-14)cam.x+=sp;if(ms.y<14)cam.y-=sp;if(ms.y>cv.height-14)cam.y+=sp}
 if(KS.ArrowLeft)cam.x-=sp;if(KS.ArrowRight)cam.x+=sp;if(KS.ArrowUp)cam.y-=sp;if(KS.ArrowDown)cam.y+=sp;clampCam();
 if(frame%30==0)inten=frame<hotT?2:U.some(u=>u.team==2&&seen(u))?1:0;if(frame%6==0){updHUD();updSel();const s=sel.map(e=>e.t+(e.done|0)+(e.siege|0)).join('')+stim+AL.filter(b=>b.team==1&&b.b&&b.done).map(b=>b.t[0]).join('')+(sel[0]&&sel[0].rs|0);if(s!=sig){sig=s;card()}}}

const KS={};function clampCam(){cam.x=Math.max(0,Math.min(W-cv.width,cam.x));cam.y=Math.max(0,Math.min(H*K-cv.height,cam.y))}
function end(t,c){if(over)return;over=1;$('ot').textContent=t;$('ot').style.color=c;$('op').textContent='';$('ob').textContent='New game';$('ov').style.display='flex'}

window.Korhal.modules.entities.loaded=true;
