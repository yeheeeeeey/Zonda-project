/* SECTOR KORHAL v12 — split module: ui */
window.Korhal=window.Korhal||{};
window.Korhal.modules=window.Korhal.modules||{};
window.Korhal.modules.ui=window.Korhal.modules.ui||{};
// ---------- input ----------
function size(){const g=$('gc');cv.width=g.clientWidth;cv.height=g.clientHeight;clampCam()}
addEventListener('resize',size);
cv.addEventListener('mousedown',e=>{au();const r=cv.getBoundingClientRect(),x=e.clientX-r.left+cam.x,y=(e.clientY-r.top+cam.y)/K;
 if(e.button==0){if(mode&&mode!='am'){place(x,y);return}if(mode=='am'){issue(x,y,1);mode=null;snd('click');return}drag={x,y,x2:x,y2:y}}
 else if(e.button==2){mode=null;window.korhalBuildWorkers=[];rclick(x,y)}});
cv.addEventListener('mousemove',e=>{const r=cv.getBoundingClientRect();ms={x:e.clientX-r.left,y:e.clientY-r.top,in:1};if(drag){drag.x2=ms.x+cam.x;drag.y2=(ms.y+cam.y)/K}});
cv.addEventListener('mouseleave',()=>ms.in=0);
addEventListener('mouseup',e=>{if(e.button==0&&drag){const d=drag;drag=null;pick(d.x,d.y,d.x2,d.y2,e.shiftKey)}});
cv.addEventListener('contextmenu',e=>e.preventDefault());mm.addEventListener('contextmenu',e=>e.preventDefault());
function mmGo(e){
 const r=mm.getBoundingClientRect(),rw=Math.max(1,r.width),rh=Math.max(1,r.height);
 const x=Math.max(0,Math.min(W,(e.clientX-r.left)/rw*W)),y=Math.max(0,Math.min(H,(e.clientY-r.top)/rh*H));
 ms.in=0;
 if(e.buttons==2||e.button==2){issue(x,y,0);return}
 cam.x=x-cv.width/2;cam.y=y*K-cv.height/2;clampCam();
}
let mmPanning=false,mmPointerId=null;
mm.addEventListener('pointerdown',e=>{if(e.button!==0)return;au();ms.in=0;mmPanning=true;mmPointerId=e.pointerId;try{mm.setPointerCapture(e.pointerId)}catch(_){}mmGo(e);e.preventDefault()});
mm.addEventListener('pointermove',e=>{if(!mmPanning||e.pointerId!==mmPointerId)return;mmGo(e);e.preventDefault()});
mm.addEventListener('pointerup',e=>{if(e.pointerId===mmPointerId){mmPanning=false;mmPointerId=null;try{mm.releasePointerCapture(e.pointerId)}catch(_){}e.preventDefault()}});
mm.addEventListener('pointercancel',e=>{if(e.pointerId===mmPointerId){mmPanning=false;mmPointerId=null}});

addEventListener('keydown',e=>{const k=e.key;KS[k]=1;if(k.startsWith('Arrow'))e.preventDefault();const l=k.toLowerCase();
 if(/^[1-9]$/.test(k)){if(e.ctrlKey||e.metaKey){grp[k]=sel.slice();e.preventDefault()}else if(grp[k]){sel=grp[k].filter(u=>u.hp>0);sig='';updSel();card();if(sel[0]){selSnd();cam.x=sel[0].x-cv.width/2;cam.y=sel[0].y*K-cv.height/2;clampCam()}}return}
 if(k=='Escape'){mode=null;window.korhalBuildWorkers=[];}else if(l=='.'||l==','){if(started&&!over){e.preventDefault();selArmy()}}else if(l=='n'){mute=!mute;say(mute?'Sound off':'Sound on')}else if(l=='p'&&started&&!over){paused=!paused;say(paused?'Paused':'')}else if(CK[l])CK[l]()});
addEventListener('keyup',e=>KS[e.key]=0);

;

(()=>{try{
// Local-file build: use installed fonts and system fallbacks, never request CDN fonts.
$('top').innerHTML='<div class=mn><button id=zmenu>\u2630 MENU</button><span id=w></span></div><div class=res><span class="ri rm"><i></i><b id=m>200</b></span><span class="ri rg"><i></i><b id=g>0</b></span><span class="ri rs"><i></i><b id=s>4/10</b></span></div>';
$('zmenu').onclick=()=>dispatchEvent(new KeyboardEvent('keydown',{key:'p'}));
const mw=document.createElement('div');mw.id='mmw';mm.parentNode.insertBefore(mw,mm);mw.appendChild(mm);
const qb=document.createElement('div');qb.id='qb';qb.innerHTML='<button id=qi title="Idle SCV (.)"><i>\u2699</i><b id=qic>0</b></button><button id=qa title="Select army (.)"><i>\u2694</i><span>ARMY</span></button>';$('gc').appendChild(qb);$('qi').onclick=()=>selIdle();$('qa').onclick=()=>selArmy();
setInterval(()=>{if(!started)return;const n=U.filter(u=>u.team==1&&u.t=='scv'&&u.st=='idle').length;$('qic').textContent=n;$('qi').classList.toggle('on',n>0)},400);
bar=function(x,y,w,f){f=Math.max(0,Math.min(1,f));const h=5,x0=x-w/2;ctx.fillStyle='rgba(2,8,14,.85)';ctx.fillRect(x0-1.5,y-1.5,w+3,h+3);ctx.fillStyle=f>.6?'#46ff7e':f>.3?'#ffd23a':'#ff4a4a';ctx.fillRect(x0,y,w*f,h);ctx.fillStyle='rgba(255,255,255,.3)';ctx.fillRect(x0,y,w*f,1.5);ctx.fillStyle='rgba(2,8,14,.8)';for(let i=1;i<w/4;i++)ctx.fillRect(x0+i*4-.5,y,1,h)};
const IC=[['scv','\u2699'],['marine','\u2726'],['firebat','\u2668'],['medic','\u271A'],['vulture','\u27A4'],['siege','\u25CE'],['tank','\u25CE'],['wraith','\u2708'],['depot','\u25A3'],['barracks','\u25A4'],['factory','\u25A5'],['starport','\u2302'],['academy','\u270E'],['refinery','\u25CD'],['command','\u2B22'],['bunker','\u25A6'],['stim','\u26A1'],['attack','\u2694'],['move','\u279C'],['stop','\u25A0'],['hold','\u25A3'],['repair','\u2692'],['cancel','\u2716'],['upgrade','\u21E7'],['cloak','\u25CC'],['mine','\u2731'],['scan','\u25C9'],['yamato','\u2739'],['unload','\u21E7'],['load','\u21E9']],tp2=document.createElement('div');tp2.id='tip';document.body.appendChild(tp2);
new MutationObserver(()=>{tp2.style.display='none';$('card').querySelectorAll('.b:not([data-n])').forEach(b=>{const bs=b.querySelector('b'),k=bs?bs.textContent:'',sm=b.querySelector('small'),s=sm?sm.textContent:'',l=((b.childNodes[1]&&b.childNodes[1].textContent)||'').trim(),lc=l.toLowerCase(),ic=(IC.find(x=>lc.includes(x[0]))||[0,l[0]||'?'])[1];b.dataset.n=l;b.dataset.s=s;b.dataset.k=k;b.innerHTML='<i class=ic>'+ic+'</i><span class=lb>'+l+'</span><b class=hk>'+k.toUpperCase()+'</b>'})}).observe($('card'),{childList:true});
let tipBtn=null,tipRaf=0;
const hideCardTip=()=>{tipBtn=null;if(tipRaf){cancelAnimationFrame(tipRaf);tipRaf=0}tp2.style.display='none'};
const placeCardTip=()=>{
 tipRaf=0;if(!tipBtn||!document.body.contains(tipBtn)||!tipBtn.dataset.n){tp2.style.display='none';return}
 tp2.innerHTML='<span>'+tipBtn.dataset.k.toUpperCase()+'</span><b>'+tipBtn.dataset.n+'</b><div>'+(tipBtn.dataset.s||'')+'</div>';
 const r=tipBtn.getBoundingClientRect();
 tp2.style.left=Math.max(6,Math.min(innerWidth-270,r.left))+'px';
 tp2.style.top=Math.max(6,r.top-88)+'px';
 tp2.style.display='block';
};
$('card').addEventListener('pointerover',e=>{
 const b=e.target.closest('.b');if(!b||!b.dataset.n)return;
 if(e.relatedTarget&&b.contains(e.relatedTarget))return;
 tipBtn=b;if(!tipRaf)tipRaf=requestAnimationFrame(placeCardTip);
});
$('card').addEventListener('pointerout',e=>{
 const b=e.target.closest('.b');if(!b||!tipBtn||b!==tipBtn)return;
 if(e.relatedTarget&&b.contains(e.relatedTarget))return;
 hideCardTip();
});
$('card').addEventListener('pointerleave',hideCardTip);

const wf=c=>{const t=c.dataset.t,e=T[t],g=c.getContext('2d'),S=c.width/32,air=t=='wraith'||t=='muta',mech=t=='vulture'||t=='tank'||t=='ultra',col=c.dataset.z?'#ff5a5a':'#3ee0ff';g.setTransform(S,0,0,S,0,0);g.clearRect(0,0,32,32);const gr=g.createRadialGradient(16,16,2,16,16,22);gr.addColorStop(0,'rgba(30,110,170,.55)');gr.addColorStop(1,'rgba(2,10,18,.95)');g.fillStyle=gr;g.fillRect(0,0,32,32);g.shadowColor=col;g.shadowBlur=4;g.strokeStyle=col;g.fillStyle=col+'30';g.lineWidth=1.3;g.beginPath();
 if(e.size){g.rect(7,9,18,16);g.moveTo(7,9);g.lineTo(16,3);g.lineTo(25,9);g.moveTo(12,25);g.lineTo(12,17);g.lineTo(20,17);g.lineTo(20,25)}else if(air){g.moveTo(16,5);g.lineTo(28,25);g.lineTo(16,19);g.lineTo(4,25);g.closePath();g.moveTo(16,5);g.lineTo(16,19)}else if(mech){g.rect(4,18,24,8);g.rect(9,10,13,8);g.moveTo(22,14);g.lineTo(30,14);g.moveTo(8,22);g.lineTo(24,22)}else{g.arc(16,10,5,0,7);g.moveTo(7,28);g.quadraticCurveTo(16,12,25,28);g.moveTo(21,19);g.lineTo(30,17)}
 g.fill();g.stroke();g.shadowBlur=0;g.fillStyle='rgba(0,0,0,.25)';for(let y=0;y<32;y+=2)g.fillRect(0,y,32,1)};
updSel=function(){const p=$('sel');if(!sel.length){p.innerHTML='<div class=zn><b>NO SELECTION</b><small>Drag to select \u00b7 right-click to command</small></div>';return}
 const col=f=>f>.6?'#46ff7e,#1fa84a':f>.3?'#ffd23a,#c8941a':'#ff6a6a,#b32020',bar2=e=>{const f=Math.max(0,Math.min(1,e.hp/e.maxHp));return '<div class=hp><i style="width:'+f*100+'%;background:linear-gradient(180deg,'+col(f)+')"></i><span>'+Math.round(e.hp)+' / '+Math.round(e.maxHp)+'</span></div>'},cs=e=>'<canvas width=64 height=64 data-t='+e.t+(e.team==2?' data-z=1':'')+'></canvas>';
 if(sel.length>1){const c={};sel.forEach(e=>c[T[e.t].n]=(c[T[e.t].n]||0)+1);p.innerHTML='<div class=zg>'+sel.slice(0,24).map((e,i)=>{const f=e.hp/e.maxHp;return '<div class=ui data-i='+i+'>'+cs(e)+'<div class=mh><i style="width:'+f*100+'%;background:'+col(f).split(',')[0]+'"></i></div></div>'}).join('')+'</div><div class=zc><b>'+sel.length+'</b> units \u00b7 '+Object.entries(c).map(([k,v])=>v+' '+k).join(' \u00b7 ')+'</div>'}
 else{const e=sel[0],t=T[e.t];let h='<div class=pw><div class=pt>'+cs(e)+'</div></div><div class=zi><div class=nm>'+t.n+(e.b&&!e.done?' <small>BUILDING '+(e.pr/t.bt*100|0)+'%</small>':'')+'</div>'+bar2(e)+'<div class=st>';
  if(t.d)h+='<span><em>ATK</em>'+(e.siege?65:t.d)+'</span><span><em>ARM</em>'+(t.ar||0)+'</span>';if(t.rg)h+='<span><em>RNG</em>'+t.rg+'</span>';h+='</div>';
  [['stimT','STIMMED'],['siege','SIEGE MODE'],['cl','CLOAKED']].forEach(([k,n])=>{if(e[k]>0)h+='<span class=chip>'+n+'</span>'});
  if(e.b&&e.q&&e.q.length)h+='<div class=zq>'+e.q.map((q,i)=>'<span title="'+T[q].n+'">'+T[q].n.slice(0,3).toUpperCase()+(i?'':'<i style="width:'+(e.qt/T[q].bt*100|0)+'%"></i>')+'</span>').join('')+'</div>';p.innerHTML=h+'</div>'}
 p.querySelectorAll('canvas[data-t]').forEach(wf)};
size();updSel();card();
}catch(e){console.error(e)}})();
;

(()=>{try{
const TL=22,gsn=(v,s)=>Math.round((v-s/2)/TL)*TL+s/2;window.TILE=TL;window.gsn=gsn;
Object.entries({cc:4,depot:2,barracks:3,factory:3,starport:3,academy:2,bunker:2,turret:2,comsat:2,ebay:3,armory:3}).forEach(([k,n])=>{if(T[k])T[k].size=n*TL});
const _sn=snap;snap=function(t,x,y){if(t=='refinery')return _sn(t,x,y);const d=T[t];if(t=='cc'){const e=EX.find(e=>Math.hypot(e.x-x,e.y-y)<140&&!B.some(b=>b.t=='cc'&&Math.hypot(b.x-e.x,b.y-e.y)<60));if(e)return{x:gsn(e.x,d.size),y:gsn(e.y,d.size),ok:1}}const gx=gsn(x,d.size),gy=gsn(y,d.size);return{x:gx,y:gy,ok:ok(t,gx,gy)}};
const _d=draw;draw=function(){_d();try{if(!mode||mode=='am'||!T[mode]||!T[mode].size||mode=='refinery'||!ms.in)return;const z=T[mode].size,n=Math.round(z/TL),s=snap(mode,ms.x+cam.x,(ms.y+cam.y)/K),l=s.x-z/2,t0=s.y-z/2;ctx.save();ctx.translate(-cam.x,-cam.y);
ctx.strokeStyle='rgba(180,255,230,.09)';ctx.lineWidth=1;ctx.beginPath();for(let i=-4;i<=n+4;i++){ctx.moveTo(l+i*TL,(t0-4*TL)*K);ctx.lineTo(l+i*TL,(t0+(n+4)*TL)*K);ctx.moveTo(l-4*TL,(t0+i*TL)*K);ctx.lineTo(l+(n+4)*TL,(t0+i*TL)*K)}ctx.stroke();
for(let i=0;i<n;i++)for(let j=0;j<n;j++){const cx=l+i*TL+TL/2,cy=t0+j*TL+TL/2,bad=bs(cx,cy)||B.some(b=>Math.abs(b.x-cx)<TL/2+b.size/2-1&&Math.abs(b.y-cy)<TL/2+b.size/2-1);ctx.fillStyle=bad?'rgba(255,70,60,.42)':s.ok?'rgba(80,255,150,.3)':'rgba(255,190,60,.38)';ctx.fillRect(l+i*TL,(t0+j*TL)*K,TL,TL*K);ctx.strokeStyle=bad?'rgba(255,120,100,.7)':'rgba(190,255,220,.55)';ctx.strokeRect(l+i*TL+.5,(t0+j*TL)*K+.5,TL-1,TL*K-1)}
ctx.restore()}catch(x){}};
try{hpEl.querySelector('.g').insertAdjacentHTML('beforeend','<div><h4>BUILDING GRID</h4>Buildings snap to a grid and can sit side by side.<br>Command Center 4x4 &middot; Barracks, Factory, Starport, Engineering Bay, Armory 3x3<br>Depot, Bunker, Academy, Turret, Comsat 2x2<br>Green cells are free, red cells are blocked.</div>')}catch(x){}
}catch(e){console.error(e)}})()
;

(()=>{try{
const rn=(a,b)=>a+Math.random()*(b-a),OT0=$('ot').textContent,OP0=$('op').textContent,OB0=$('ob').textContent;
const css=document.createElement('style');css.textContent='#pm{position:absolute;inset:0;z-index:7;display:none;align-items:center;justify-content:center;background:rgba(2,6,8,.72)}#pm .pb{background:linear-gradient(#0d2230,#061018);border:1px solid #2f8a78;border-radius:6px;padding:18px 22px;min-width:290px;display:flex;flex-direction:column;gap:9px;box-shadow:0 0 40px #000}#pm h2{color:#7cf5c0;letter-spacing:.3em;font-size:15px;text-align:center;margin:0 0 4px}#pm button{background:#13303a;border:1px solid #2f8a78;color:#cfe;font:bold 13px Courier New,monospace;padding:9px 12px;cursor:pointer;border-radius:3px;letter-spacing:.06em}#pm button:hover{background:#7cf5c0;color:#06100f}#pm .r{display:flex;gap:10px;align-items:center;justify-content:space-between;color:#cfe;font-size:13px}#pm .r button{padding:5px 10px;min-width:64px}#mb{cursor:pointer;border:1px solid #2f8a78;padding:0 9px;border-radius:3px;color:#7cf5c0;margin-left:12px;letter-spacing:.1em}#mb:hover{background:#7cf5c0;color:#06100f}';document.head.appendChild(css);
const pm=document.createElement('div');pm.id='pm';pm.innerHTML='<div class="pb" id="p1"><h2>MENU</h2><button data-a="res">Resume</button><button data-a="set">Settings</button><button data-a="man">Field Manual</button><button data-a="rst">Restart Mission</button><button data-a="mnu">Main Menu</button></div><div class="pb" id="p2" style="display:none"><h2>SETTINGS</h2><div class="r">Sound <button data-a="snd"></button></div><div class="r">Game speed <span><button data-a="sm">-</button> <b id="spv"></b> <button data-a="sp">+</button></span></div><div class="r">Edge scrolling <button data-a="es"></button></div><div class="r">Graphics quality <button data-a="fx"></button></div><div class="r">Show FPS (Shift+F) <button data-a="fps"></button></div><button data-a="back">Back</button></div>';$('gc').appendChild(pm);
let wasP=0,cf=null;const q=a=>pm.querySelector('[data-a='+a+']'),show=n=>{$('p1').style.display=n==1?'flex':'none';$('p2').style.display=n==2?'flex':'none'},
upd=()=>{q('snd').textContent=mute?'OFF':'ON';$('spv').textContent=SPD+'x';q('es').textContent=window.ES===0?'OFF':'ON';q('fx').textContent=['LOW','BALANCED','HIGH'][window.FXQ]||'BALANCED';q('fps').textContent=window.korhalShowFPS?'ON':'OFF';q('rst').textContent=cf=='rst'?'Click again to confirm':'Restart Mission';q('mnu').textContent=cf=='mnu'?'Click again to confirm':'Main Menu'},
open_=()=>{wasP=paused;paused=1;pm.style.display='flex';show(1);cf=null;upd()},close_=()=>{pm.style.display='none';paused=wasP;cf=null};
pm.addEventListener('click',e=>{const a=e.target.dataset&&e.target.dataset.a;if(!a)return;if(a!='rst'&&a!='mnu')cf=null;
if(a=='res')close_();else if(a=='set')show(2);else if(a=='back')show(1);else if(a=='man'){close_();toggleHelp()}else if(a=='snd')mute=!mute;else if(a=='sm')setSpd(-1);else if(a=='sp')setSpd(1);else if(a=='es')window.ES=window.ES===0?1:0;else if(a=='fx'){window.FXQ=(window.FXQ+1)%3;window.KORHAL_QUALITY=['low','balanced','high'][window.FXQ]}else if(a=='fps')window.korhalShowFPS=!window.korhalShowFPS;
else if(a=='rst'||a=='mnu'){if(cf!=a)cf=a;else{cf=null;pm.style.display='none';paused=0;if(a=='rst')startGame();else{window.korhalReturnToHub?.()}}}upd()});
addEventListener('keydown',e=>{if(!started)return;if(pm.style.display=='flex'){if(e.key=='Escape'){if($('p2').style.display!='none')show(1);else close_()}e.stopImmediatePropagation();e.preventDefault();return}if(e.key=='Escape'&&!over){const s=window.__esc||{};if(!s.c&&!s.m&&!s.h)open_()}},true);
const mb=document.createElement('span');mb.id='mb';mb.textContent='MENU';mb.onclick=()=>{if(started&&!over&&pm.style.display!='flex')open_()};$('top').insertBefore(mb,$('top').querySelector('.h'));
// Construction navigation: buildings are collision solids from the placement click.
// Workers must approach the outer service edge; targeting the blocked center could
// leave an assigned SCV walking in place indefinitely (v15 Barracks failure).
// Construction service distance is measured against the visible *rectangle*,
// not the building center or a single preferred waypoint.  A worker parked at
// a corner or near a ramp must be able to begin work from that position.
function korhalAtBuildSite(u,b){
 if(!u||!b||!Number.isFinite(u.x)||!Number.isFinite(u.y))return false;
 const half=b.size/2,dx=Math.abs(u.x-b.x),dy=Math.abs(u.y-b.y);
 const outsideX=Math.max(0,dx-half),outsideY=Math.max(0,dy-half);
 return Math.hypot(outsideX,outsideY)<=u.rad+17&&
        dx<=half+u.rad+20&&dy<=half+u.rad+20;
}
function korhalAssignBuilder(u,b){
 u.st='bldg';u.tb=b;u.job=null;u.tg=null;u.cr=0;
 u.pk=null;u.pa=null;u.tx=u.x;u.ty=u.y;
 u._buildTargetRef=null;u._buildAnchors=null;u._buildAnchor=null;
 b.awaiting=0;
}
window.bldg=(u,sp)=>{
 const b=u.tb;
 if(!b||b.hp<=0||b.cancelled){u.st='idle';u.tb=null;u._buildTargetRef=null;return}
 if(b.done){u.tb=null;u._buildTargetRef=null;u.pt=nearP(u);u.st=u.pt?'mine':'idle';return}
 const work=()=>{
  b.act=frame;b.lastBuilderFrame=frame;b.awaiting=0;
  u.st='bldg';u.ang=Math.atan2(b.y-u.y,b.x-u.x);
  if(frame%12===0&&FX.length<110){const a=u.ang+(Math.random()-.5)*.8;FX.push({k:'sp',x:u.x+Math.cos(u.ang)*8,y:u.y+Math.sin(u.ang)*5,vx:Math.cos(a)*1.4-.5,vy:-.8,l:10,c:'#ffd27a'})}
 };
 // Evaluate the actual position before moving toward a cached anchor.  This
 // also resolves the depot case where collision pushes the SCV beside the wall.
 if(korhalAtBuildSite(u,b)){work();return}
 if(u._buildTargetRef!==b){
  u._buildTargetRef=b;u._buildAttempts=0;u._buildCheckFrame=frame;
  u._buildLastX=u.x;u._buildLastY=u.y;
  const half=b.size/2,dist=half+u.rad+9,pts=[];
  for(let side=0;side<4;side++)for(let st=-2;st<=2;st++){
   const along=st*half*.37;
   const x=side===0?b.x-dist:side===1?b.x+dist:b.x+along;
   const y=side===2?b.y-dist:side===3?b.y+dist:b.y+along;
   if(!bp(x,y)&&elev(x,y)===elev(b.x,b.y))pts.push({x,y});
  }
  pts.sort((a,c)=>Math.hypot(a.x-u.x,a.y-u.y)-Math.hypot(c.x-u.x,c.y-u.y));
  u._buildAnchors=pts;
  u._buildAnchor=pts[0]||{x:b.x+(u.x<b.x?-dist:dist),y:b.y};
  u.pk=null;u.pa=null;
 }
 // Only change the path if progress really stops. The fallback tries other
 // reachable sides, without changing move/attack orders of unrelated units.
 if(frame-u._buildCheckFrame>=54){
  const moved=Math.hypot(u.x-u._buildLastX,u.y-u._buildLastY);
  u._buildLastX=u.x;u._buildLastY=u.y;u._buildCheckFrame=frame;
  if(moved<4&&u._buildAnchors?.length>1){
   u._buildAttempts=(u._buildAttempts+1)%u._buildAnchors.length;
   u._buildAnchor=u._buildAnchors[u._buildAttempts];u.pk=null;u.pa=null;
  }
 }
 const a=u._buildAnchor,dd=Math.hypot(u.x-a.x,u.y-a.y);
 if(dd>Math.max(10,sp*3)){mv(u,a.x,a.y,sp);if(korhalAtBuildSite(u,b))work();return}
 // A waypoint can be 10px away when a wall/pushout is just 7px away.  Do not
 // loop on that waypoint: pick a new service side if the hull is not reached.
 if(korhalAtBuildSite(u,b)){work();return}
 u._buildTargetRef=null;
};
const _r5=rclick;rclick=function(x,y){
 const sc=sel.filter(u=>u.t==='scv'&&u.team===1&&u.hp>0);
 if(sc.length){
  // The upper part of a 3D structure renders above its ground footprint. A
  // right-click anywhere on the visible unfinished structure should work.
  const tb=B.filter(b=>b.team===1&&!b.done&&b.hp>0&&!b.cancelled&&
    Math.abs(x-b.x)<=b.size/2+12&&
    y>=b.y-b.size/2-(HH[b.t]||24)/K-18&&y<=b.y+b.size/2+12)
   .sort((a,b)=>D(a,{x,y})-D(b,{x,y}))[0];
  if(tb){
   sc.forEach(u=>{korhalAssignBuilder(u,tb);if(korhalAtBuildSite(u,tb))bldg(u,T.scv.sp)});
   snd('click');say('Constructing '+T[tb.t].n);return;
  }
 }
 _r5(x,y);
};
// Every abandoned foundation can recover a builder.  Also explicitly restart
// an SCV parked next to its foundation, even if its stale movement/path state
// was left behind by a collision. Never steal a worker from active work.
const _constructionStep=step;
step=function(){
 _constructionStep();
 if(!started||over||frame%15!==0)return;
 for(const b of B){
  if(b.team!==1||b.done||b.hp<=0||b.cancelled||b.act>=frame-2)continue;
  const assigned=U.filter(u=>u.team===1&&u.t==='scv'&&u.hp>0&&u.tb===b);
  const parked=assigned.find(u=>korhalAtBuildSite(u,b));
  if(parked){
   if(parked.st!=='bldg')korhalAssignBuilder(parked,b);
   bldg(parked,T.scv.sp);
   continue;
  }
  // Changing anchor waypoints does not prove the SCV is actually working.
  // If construction has made no progress for three seconds, retry with an
  // alternate worker (or replan the existing worker when nobody is free).
  if(assigned.some(u=>u.st==='bldg')&&frame-(b.lastBuilderFrame??0)<180)continue;
  if(frame<(b._nextRescueFrame||0))continue;
  b._nextRescueFrame=frame+180;
  const choices=U.filter(u=>u.team===1&&u.t==='scv'&&u.hp>0&&!u.tb&&['idle','mine','move','amove'].includes(u.st));
  choices.sort((a,c)=>D(a,b)-D(c,b));
  const worker=choices[0]||assigned[0];
  if(worker){korhalAssignBuilder(worker,b);if(korhalAtBuildSite(worker,b))bldg(worker,T.scv.sp)}
 }
};
const _d6=draw;draw=function(){_d6();ctx.save();try{ctx.translate(-cam.x,-cam.y);B.forEach(b=>{if(b.team!=1||b.done||b.hp<=0||b.act>=frame-1)return;ctx.globalAlpha=.6+.4*Math.sin(frame*.15);ctx.fillStyle='#ffb347';ctx.font='bold 11px Courier New';ctx.textAlign='center';ctx.fillText(U.some(u=>u.hp>0&&u.tb===b&&u.st==='bldg')?'SCV EN ROUTE':'! NEEDS SCV',b.x,b.y*K-(HH[b.t]||20)-b.size*K/2-22)})}catch(e){}ctx.restore()};
let ox=0,oy=0,ca=1,sa=0,zo=0,zs=1,ob=0,us=1;
const pj=(x,y,z)=>[ox+(x*ca-y*sa-ob*z*zs)*us,oy+((x*sa+y*ca)*K-z*zs)*us-zo],dk=(x,y,z)=>x*sa+y*ca+z*.015,
face=(pt,f)=>{ctx.fillStyle=f;ctx.beginPath();ctx.moveTo(pt[0][0],pt[0][1]);for(let i=1;i<pt.length;i++)ctx.lineTo(pt[i][0],pt[i][1]);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(0,0,0,.38)';ctx.lineWidth=.7;ctx.stroke()},
box=(cx,cy,z,w,d,h,c)=>{const hx=w/2,hy=d/2,V=[[cx-hx,cy-hy],[cx+hx,cy-hy],[cx+hx,cy+hy],[cx-hx,cy+hy]],Bp=V.map(v=>pj(v[0],v[1],z)),Tp=V.map(v=>pj(v[0],v[1],z+h)),N=[[0,-1],[1,0],[0,1],[-1,0]];for(let i=0;i<4;i++){const j=(i+1)&3,nx=N[i][0]*ca-N[i][1]*sa,ny=N[i][0]*sa+N[i][1]*ca;if(ny>.02)face([Bp[i],Bp[j],Tp[j],Tp[i]],cl(c,-.16-.12*nx))}face(Tp,cl(c,.2))},
ball=(x,y,z,r,c)=>{const p=pj(x,y,z),g=ctx.createRadialGradient(p[0]-r*.35,p[1]-r*.4,r*.15,p[0],p[1],r);g.addColorStop(0,cl(c,.55));g.addColorStop(.6,c);g.addColorStop(1,cl(c,-.45));ctx.fillStyle=g;ctx.beginPath();ctx.arc(p[0],p[1],r,0,7);ctx.fill()},
run=Q=>Q.sort((a,b)=>a[0]-b[0]).forEach(p=>p[1]());
const marine=u=>{const sw=Math.sin(u._ph||0)*1.8,Q=[],A=(x,y,z,f)=>Q.push([dk(x,y,z),f]);
if(u.stimT>0)glow(ox,oy-8,18,'rgba(255,70,50,.55)',.7+.3*Math.sin(frame*.3));
A(-.5+sw,-2.3,0,()=>box(-.5+sw,-2.3,0,3.6,3.2,5.4,'#2a3f7a'));A(-.5-sw,2.3,0,()=>box(-.5-sw,2.3,0,3.6,3.2,5.4,'#2a3f7a'));
A(-5,0,5.8,()=>box(-5,0,5.8,3,6.4,5.6,'#27417f'));A(-.8,0,5.4,()=>box(-.8,0,5.4,6.4,8.6,6,'#3d6fd6'));
A(-.8,-5.4,8.6,()=>box(-.8,-5.4,8.4,4.2,3.2,3,'#5b8cf0'));A(-.8,5.4,8.6,()=>box(-.8,5.4,8.4,4.2,3.2,3,'#5b8cf0'));
A(.4,0,13,()=>{ball(.4,0,12.6,4.4,'#4a7de0');box(3.4,0,11.4,1.8,5,2.8,'#9ff0ff')});
A(4.6,3.6,8.2,()=>{box(4.6,3.6,8,9.5,1.8,2.2,'#22262e');if(u.cd>11){const p=pj(9.6,3.6,9);glow(p[0],p[1],9,'rgba(255,225,130,.95)',1)}});run(Q)};
const dk2=(x,y,z)=>x*sa+y*ca+z*.9,BF=[[0,1,2,3],[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]];
const solid=(V,F,c)=>{const m=[0,1,2].map(i=>V.reduce((a,v)=>a+v[i],0)/V.length),Pp=V.map(v=>pj(v[0],v[1],v[2]));
F.forEach(f=>{const a=V[f[0]],b=V[f[1]],d=V[f[2]],u1=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],u2=[d[0]-a[0],d[1]-a[1],d[2]-a[2]];let n=[u1[1]*u2[2]-u1[2]*u2[1],u1[2]*u2[0]-u1[0]*u2[2],u1[0]*u2[1]-u1[1]*u2[0]];const l=Math.hypot(n[0],n[1],n[2])||1;n=[n[0]/l,n[1]/l,n[2]/l];const fc=[0,1,2].map(i=>f.reduce((t,k)=>t+V[k][i],0)/f.length);if(n[0]*(fc[0]-m[0])+n[1]*(fc[1]-m[1])+n[2]*(fc[2]-m[2])<0)n=[-n[0],-n[1],-n[2]];
const nx=n[0]*ca-n[1]*sa,ny=n[0]*sa+n[1]*ca;if(ny+K*n[2]+K*ob*nx<=.02)return;const li=-.5*nx+.25*ny+.8*n[2];face(f.map(k=>Pp[k]),cl(c,Math.max(-.42,Math.min(.38,-.2+.38*li))))})};
const slab=(x0,x1,y0,y1,z,a,b,c2,d,c)=>solid([[x0,y0,z],[x1,y0,z],[x1,y1,z],[x0,y1,z],[x0,y0,z+a],[x1,y0,z+b],[x1,y1,z+c2],[x0,y1,z+d]],BF,c),bx3=(cx,cy,z,w,d,h,c)=>slab(cx-w/2,cx+w/2,cy-d/2,cy+d/2,z,h,h,h,h,c);
const pbox=(cx,cy,cz,l,w,h,p,c)=>{const cp=Math.cos(p),sp=Math.sin(p),V=[];for(const z of [-h/2,h/2])for(const [x,y] of [[0,-w/2],[l,-w/2],[l,w/2],[0,w/2]])V.push([cx+x*cp-z*sp,cy+y,cz+x*sp+z*cp]);solid(V,BF,c)};
const wheel=(x,y,z,r,c,ph,out)=>{if(out*ca<=.02)return;const pts=[];for(let i=0;i<10;i++){const t=i*.628;pts.push(pj(x+Math.cos(t)*r,y,z+Math.sin(t)*r))}face(pts,c);const h=pj(x,y,z),sp=pj(x+Math.cos(ph)*r*.8,y,z+Math.sin(ph)*r*.8);ctx.strokeStyle='rgba(200,210,225,.5)';ctx.beginPath();ctx.moveTo(h[0],h[1]);ctx.lineTo(sp[0],sp[1]);ctx.stroke()};
const tank=u=>{const Q=[],A=(x,y,z,f)=>Q.push([dk2(x,y,z),f]),sg=u.siege,ph=u._ph||0,zr=sg?2.5:0,rcl=sg?Math.max(0,u.cd-62)*.7:(u.cd>50?(u.cd-50)*.4:0);us=.82;
[-1,1].forEach(sd=>{const y=sd*12.5;A(0,y,0,()=>{slab(-16,16,y-5,y+5,0,9,9,9,9,'#2b2e34');slab(16,21,y-5,y+5,0,9,4,4,9,'#2b2e34');slab(-21,-16,y-5,y+5,0,4,9,9,4,'#2b2e34');
if(sd*ca>.02){const xo=(ph*2)%3.2;ctx.strokeStyle='rgba(0,0,0,.55)';ctx.lineWidth=1;ctx.beginPath();for(let x=-19;x<=19;x+=3.2){const X=x+xo;if(X>19.5)continue;const a=pj(X,y+sd*5.05,1.4),b=pj(X,y+sd*5.05,7.4);ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1])}ctx.stroke()}
slab(-15,15,y-5.4,y+5.4,8.6,3,3,3,3,'#8d97a6');slab(15,20,y-5.4,y+5.4,8.6,3,1.2,1.2,3,'#8d97a6');slab(-20,-15,y-5.4,y+5.4,8.6,1.2,3,3,1.2,'#8d97a6');slab(-9,7,y-3.4,y+3.4,11.5,.8,.8,.8,.8,'#2f55c0')})});
A(0,0,3,()=>{slab(-15,12,-8.8,8.8,3,7,7,7,7,'#6f7a8a');slab(12,19,-8.8,8.8,3,7,3,3,7,'#6f7a8a');slab(-12,8,-7,7,10,1.2,1.2,1.2,1.2,'#8d97a6');bx3(-17,0,3,5,11,9,'#4a515c')});
A(-4,0,9,()=>{if(sg){bx3(-4,-6.5,9,3,3,3.6+zr,'#3a3f48');bx3(-4,6.5,9,3,3,3.6+zr,'#3a3f48')}const p=pj(-4,0,9+zr);cyl(p[0],p[1],10*us,2.6*us,'#5c6676');slab(-14,5,-9,9,11.6+zr,9,9,7.5,7.5,'#8d97a6');slab(-12,2,-6.5,6.5,20.7+zr,.9,.9,.9,.9,'#2f55c0');slab(-13,-8,8.9,9.5,13.6+zr,5,5,5,5,'#e6b72a');slab(-13,-8,-9.5,-8.9,13.6+zr,5,5,5,5,'#e6b72a');bx3(-9,0,21.6+zr,5,5,1.4,'#6c7a8f')});
if(sg){const pc=.5,cx0=11,cz0=15+zr,L1=9,L2=10,e1=cx0+L1*Math.cos(pc)-rcl,z1=cz0+L1*Math.sin(pc);A(9,0,13,()=>{bx3(8,0,12.5+zr,11,12,7,'#7d8999');bx3(8.5,-6.4,13+zr,7,2.4,5,'#2f55c0');bx3(8.5,6.4,13+zr,7,2.4,5,'#2f55c0');pbox(cx0-rcl,0,cz0,L1,7.6,7.4,pc,'#4a5360');pbox(e1,0,z1,L2,5.8,5.8,pc,'#3a4049');pbox(e1+L2*Math.cos(pc),0,z1+L2*Math.sin(pc),3.5,8.4,8.2,pc,'#22262d')});
[[-8,-1],[-8,1],[10,-1],[10,1]].forEach(([x,sd])=>A(x,sd*18,0,()=>{bx3(x,sd*15,2,4,8,5,'#454c56');bx3(x,sd*19.5,0,5,4,6,'#2a2f36');const p=pj(x,sd*22,0);cyl(p[0],p[1],6*us,1.8*us,'#1e2228');bx3(x,sd*19.5,6,2,2,1.4,'#c98a2a')}))}
else A(9,0,13,()=>{bx3(8,0,12.5,11,12,7,'#7d8999');bx3(8.5,-6.4,13,7,2.4,5,'#2f55c0');bx3(8.5,6.4,13,7,2.4,5,'#2f55c0');pbox(11-rcl,0,16,11,6,5.8,.02,'#363b44');bx3(24-rcl,0,13,3.6,8,6.2,'#22262d')});
run(Q);if(!sg&&u.cd>52){const p=pj(26,0,16);glow(p[0],p[1],12,'rgba(255,200,110,.9)',1)}us=1};
const vulture=u=>{const Q=[],A=(x,y,z,f)=>Q.push([dk2(x,y,z),f]);zo=3.5+Math.sin(frame*.14+(u.id||0))*.8;glow(ox,oy+3,18,'rgba(110,190,255,.35)',.8);
A(-11,-3.6,2,()=>bx3(-11,-3.6,2,7,3,3.6,'#3b4252'));A(-11,3.6,2,()=>bx3(-11,3.6,2,7,3,3.6,'#3b4252'));
A(0,0,3,()=>{slab(-9,10,-3.8,3.8,3,6,3.6,3.6,6,'#8795ad');slab(10,18,-2.4,2.4,3,3.6,1.6,1.6,3.6,'#5b6a82')});
A(-8,-4.8,6,()=>bx3(-8,-4.8,6,5,1,5,'#5b6a82'));A(-8,4.8,6,()=>bx3(-8,4.8,6,5,1,5,'#5b6a82'));
A(18,-1.8,4,()=>bx3(18,-1.8,4.4,8,1.2,1.4,'#262a31'));A(18,1.8,4,()=>bx3(18,1.8,4.4,8,1.2,1.4,'#262a31'));
A(-2,0,9,()=>{bx3(-2,0,6,6,5,2,'#2a3f7a');bx3(-2.6,0,8,3.6,5.2,4.4,'#3d6fd6');ball(-1.2,0,13.6,3.1,'#4a7de0');bx3(.6,0,12.8,1.4,3.6,1.6,'#9ff0ff')});
A(4,0,8,()=>bx3(4,0,8.6,1.2,7,1.2,'#22262e'));run(Q);
if(u._mv){[-3.6,3.6].forEach(y=>{const p=pj(-15,y,5);glow(p[0],p[1],8,'rgba(255,150,60,.8)',.9)})}if(u.cd>20){const p=pj(22,0,5);glow(p[0],p[1],8,'rgba(150,255,255,.9)',1)}};
const scv=u=>{const Q=[],A=(x,y,z,f)=>Q.push([dk2(x,y,z),f]),sw=Math.sin(u._ph||0)*1.6,wk=u.st=='bldg'||u.mt>0,ar=wk?Math.sin(frame*.5)*1.4:0;
A(-1,-3.6,0,()=>bx3(-1+sw,-3.6,0,7,3.4,4.2,'#3a3f48'));A(-1,3.6,0,()=>bx3(-1-sw,3.6,0,7,3.4,4.2,'#3a3f48'));
A(-1,0,4,()=>{bx3(-1,0,4,10,9,6,'#d9b13a');bx3(2.8,0,5.5,3.4,7.4,3,'#f0cc5c')});A(-6.6,0,5,()=>bx3(-6.6,0,4.6,3.2,7.2,6.4,'#8b6f1f'));
A(2,0,10,()=>{ball(1.6,0,11.2,4.1,'#27323f');ball(2.8,0,11.8,2.5,'#7fd8ff')});
A(2.5,5.6,7,()=>bx3(3.5+ar,5.8,7,7,2.2,2.2,'#9aa2ad'));A(2.5,-5.6,7,()=>{bx3(3.5-ar,-5.8,7,7,2.2,2.2,'#9aa2ad');bx3(8.2-ar,-5.8,7.2,2.4,1.8,1.8,'#555b66')});
if(u.cr)A(-6.6,0,11,()=>bx3(-6.6,0,10.6,3.4,3.4,3.4,'#6fd8ff'));run(Q);
if(wk&&frame%6<3){const p=pj(9.5-ar,-5.8,8);glow(p[0],p[1],9,'rgba(255,190,90,.9)',1)}};
const m3=u=>{const sy=u.y*K,r=R(u),M={tank,vulture,scv,marine},bo={tank:u.siege?29:25,vulture:25,scv:24,marine:27}[u.t];ctx.fillStyle='rgba(0,0,0,.34)';ctx.beginPath();ctx.ellipse(u.x+2,sy+2,r*(u.t=='tank'?1.15:1.05),r*K*(u.t=='tank'?1.15:1.05),0,0,7);ctx.fill();
if(sel.includes(u)){const pu=1+Math.sin(frame*.12)*.06;ctx.save();ctx.shadowColor='#3cff7a';ctx.shadowBlur=10;ctx.strokeStyle='#4dff88';ctx.lineWidth=1.8;ctx.beginPath();ctx.ellipse(u.x,sy+3,(r+5)*pu,(r+5)*K*pu,0,0,7);ctx.stroke();ctx.globalAlpha=.3;ctx.lineWidth=5;ctx.stroke();ctx.restore()}
ox=u.x;oy=sy;zo=0;us=1;ca=Math.cos(u.ang||0);sa=Math.sin(u.ang||0);const dd=Math.hypot(u.x-(u._px==null?u.x:u._px),u.y-(u._py==null?u.y:u._py));u._px=u.x;u._py=u.y;u._ph=(u._ph||0)+dd*.28;u._mv=dd>.15;
if(u.t==='scv')us=1.22;M[u.t](u);zo=0;us=1;if(u.hp<u.maxHp||sel.includes(u))bar(u.x,sy-bo,r*2,u.hp/u.maxHp)};
const _du4=drawU;drawU=function(u){if(({marine:1,tank:1,vulture:1,scv:1})[u.t]&&u.hp>0&&!u.cl&&(u.team==1||seen(u))){try{m3(u);return}catch(e){}}_du4(u)};
const dk3=(x,y,z)=>y+ob*x+z*.3,SF=[];let shk=0;addEventListener('korhal:reset',()=>{SF.length=0;shk=0});const rm=matchMedia('(prefers-reduced-motion:reduce)').matches,sp_=o=>{if(SF.length<420)SF.push(o)};
$('gc').style.overflow='hidden';
const bar3=(b,H,gr)=>{const s=b.size,h=s/2,cx=b.x,cy=b.y*K;if(b.hp<b.maxHp||sel.includes(b)||!b.done)bar(cx,cy-h*K-H*gr-8,s,b.hp/b.maxHp);if(sel.includes(b)){ctx.strokeStyle='#7cf5c0';ctx.lineWidth=2;ctx.beginPath();if(b.t=='cc')ctx.ellipse(cx,cy,h+4,h*K+4,0,0,7);else ctx.rect(cx-h-4,cy-h*K-4,s+8,s*K+8);ctx.stroke()}if(b.q&&b.q.length){rc(cx-h,cy+h*K+6,s,3,'#222');rc(cx-h,cy+h*K+6,s*b.qt/T[b.q[0]].bt,3,'#5cf')}};
const star=(x,y,r,c)=>{ctx.fillStyle=c;ctx.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4-Math.PI/2,q=i%2?r*.38:r;ctx.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q*.8)}ctx.closePath();ctx.fill()};
const cy2=(p,r,h,c)=>{cyl(p[0],p[1],r,h,c);el(p[0],p[1]-h,r,r*K,cl(c,.22))};
const ccM=b=>{const pr=b.done&&b.q&&b.q.length,pods=[];for(let i=0;i<8;i++){const a=i*Math.PI/4+Math.PI/8,big=i%2==0;pods.push({x:Math.cos(a)*35,y:Math.sin(a)*35,r:big?7.5:5.5,h:big?14:10})}
const dpod=q=>{cy2(pj(q.x,q.y,0),q.r,q.h*zs,'#3b4049');const t=pj(q.x,q.y,q.h*zs);el(t[0],t[1],q.r*.62,q.r*.62*K,'#6b7686');const l=pj(q.x,q.y+q.r*.9,q.h*.5*zs);rc(l[0]-q.r*.5,l[1]-1,q.r,2,'#ffd34a')};
cy2(pj(0,0,0),40,6*zs,'#434a55');pods.filter(q=>q.y<0).forEach(dpod);
cy2(pj(0,0,6*zs),32,9*zs,'#6b7686');
ctx.strokeStyle='rgba(15,18,24,.5)';ctx.lineWidth=1;ctx.beginPath();for(let a=.1;a<Math.PI;a+=.2){const x=Math.cos(a)*32,y=Math.sin(a)*32,p=pj(x,y,6*zs),q=pj(x,y,15*zs);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1])}ctx.stroke();
ctx.strokeStyle='#ffd34a';ctx.lineWidth=1.6;ctx.beginPath();for(let a=.3;a<=Math.PI-.3;a+=.1){const p=pj(Math.cos(a)*32.3,Math.sin(a)*32.3,12*zs);a<.31?ctx.moveTo(p[0],p[1]):ctx.lineTo(p[0],p[1])}ctx.stroke();
const d=pj(0,32,6*zs);ctx.fillStyle='#15181d';ctx.beginPath();ctx.roundRect(d[0]-8,d[1]-12*zs,16,12*zs,[8,8,1,1]);ctx.fill();rc(d[0]-10.5,d[1]-9*zs,2.4,9*zs,'#e6b72a');rc(d[0]+8.1,d[1]-9*zs,2.4,9*zs,'#e6b72a');
cy2(pj(0,0,15*zs),25,8*zs,'#8591a3');cy2(pj(0,0,23*zs),19,6*zs,'#2d56c9');
const dm=pj(0,0,29*zs);dom(dm[0],dm[1],14,11*zs,'#3a64d6');const t=pj(0,0,(29+11)*zs);el(t[0],t[1],5.5,5.5*K,'#9fb4f0');star(t[0],t[1],3.4,'#e8eef5');
const an=pj(-9,-4,(33)*zs),an2=pj(-9,-4,(44)*zs);ctx.strokeStyle='#aab4c4';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(an[0],an[1]);ctx.lineTo(an2[0],an2[1]);ctx.stroke();el(an2[0],an2[1],1.6,1.6,'#ff6a5a');
pods.filter(q=>q.y>=0).forEach(dpod)};
const barM=b=>{const Q=[],A=(x,y,z,f)=>Q.push([dk3(x,y,z),f]),pr=b.done&&b.q&&b.q.length,pl=.5+.5*Math.sin(frame*.14);
[[-27,28],[27,28],[-27,-22],[27,-22]].forEach(([x,y])=>A(x,y,0,()=>{bx3(x,y,0,8,8,6,'#3a3f48');const p=pj(x,y,0);cyl(p[0],p[1],7,1.6*zs,'#22262d')}));
[-1,1].forEach(sd=>A(sd*19,-2,6,()=>{const c=sd*19;slab(c-10,c+10,-30,26,6,22,22,17,17,'#2d56c9');slab(c-10.4,c+10.4,-31,-22,6,26,26,22,22,'#262a31');for(let k=0;k<4;k++)slab(c-8,c+8,-29+k*2,-28+k*2,32,.8,.8,.8,.8,'#4a515c');bx3(c,26.4,11,16,1,2.2,'#ffd34a');bx3(c,26.4,19,18,1,4,'#1d3f9a')}));
A(0,2,4,()=>{slab(-9,9,-20,28,4,20,20,16,16,'#8a95a6');slab(-7,7,-14,8,24,3,3,2,2,'#aab4c4');bx3(0,28.4,4,10,1,10,'#15181d');bx3(-5.5,28.6,4,1.6,1,10,'#e6b72a');bx3(5.5,28.6,4,1.6,1,10,'#e6b72a');bx3(0,28.2,15,12,.8,1.4,'#ffd34a');const t=pj(0,-4,27);star(t[0],t[1],4.2,'#e8eef5')});
run(Q);[-19,0,19].forEach(x=>{const p=pj(x,28,13);glow(p[0],p[1],14,'rgba(255,211,74,.55)',pr?.5+.5*pl:.4)});if(pr&&frame%5==0){const p=pj(-19,-30,32);glow(p[0]+rn(-3,3),p[1]-rn(0,8),6,'rgba(180,190,200,.5)',.8)}};
const bld3=b=>{const t0=T[b.t],s=t0.size,h=s/2,cx=b.x,cy=b.y*K,gr=b.done?1:.3+.7*b.pr/t0.bt,H=b.t=='cc'?40:34,x0=cx-h,x1=cx+h,yt=cy-h*K,yb=cy+h*K,sh=H*gr*.45,sv=H*gr*.2;
ctx.save();ctx.globalAlpha=b.done?1:.4+.6*b.pr/t0.bt;if(b.t=='cc')el(cx+sh*.7,cy+sv*.9+3,h*1.02,h*K*1.02,'rgba(0,0,0,.32)');else poly([x0,yt,x1,yt,x1+sh,yt+sv,x1+sh,yb+sv,x0+sh,yb+sv,x0,yb],'rgba(0,0,0,.32)');ox=cx;oy=cy;ca=1;sa=0;zo=0;zs=gr;ob=.3;try{(b.t=='cc'?ccM:barM)(b)}finally{ob=0;zs=1;ctx.restore()}bar3(b,H,gr)};
const _db9=drawB;drawB=function(b){if(b.team==1&&(b.t=='cc'||b.t=='barracks')){try{bld3(b);return}catch(e){}}_db9(b)};
const _atk=atk;atk=function(u,tg,rg,dm){if(u.t!='tank'||!u.siege)return _atk(u,tg,rg,dm);if(u.cd>0)return;u.cd=T.tank.cd*1.25*(u.stimT>0?.5:1);snd('tank2',u.x,u.y);const a=Math.atan2(tg.y-u.y,tg.x-u.x),sx=u.x+Math.cos(a)*25,sy=u.y+Math.sin(a)*25,d=Math.hypot(tg.x-sx,tg.y-sy);u.ang=a;
SF.push({k:'S',x0:sx,y0:sy,x1:tg.x+rn(-8,8),y1:tg.y+rn(-6,6),t:frame,du:Math.max(14,d/13|0),u,dm,arc:50+d*.22});SF.push({k:'m',x:sx,y:sy,t:frame});
for(let i=0;i<8;i++)sp_({k:'s',x:sx+rn(-4,4),y:sy+rn(-3,3),z:30+rn(0,8),vx:Math.cos(a)*rn(.2,1),vz:rn(.1,.5),t:frame,l:rn(40,80),r:rn(5,11)});/* steady siege camera */};
const boom=(o)=>{const RS=64,x=o.x1,y=o.y1,u=o.u;nearEntities(x,y,RS+24).forEach(e=>{if(e.team==u.team||e.hp<=0||e.air)return;const d=Math.hypot(e.x-x,e.y-y)-R(e);if(d>RS)return;const f=1-Math.max(0,d)/RS*.6;e.hp-=Math.max(.5,dmgU(u,e,o.dm)*f-(T[e.t].ar||0)-armU(e));e.kb=u;hurtTeam(e);if(!e.b){const a=Math.atan2(e.y-y,e.x-x);e.x+=Math.cos(a)*5*f;e.y+=Math.sin(a)*5*f}});
if(!vis(x,y)&&u.team!=1)return;snd('boom',x,y);SF.push({k:'i',x,y,t:frame,RS});
for(let i=0;i<30;i++){const a=rn(0,6.28),v=rn(1.5,6.5);sp_({k:'p',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.6,vz:rn(2,7),t:frame,l:rn(22,46),c:i%3?'#ffb347':'#fff3c0'})}
for(let i=0;i<9;i++){const a=rn(0,6.28),v=rn(1,3.5);sp_({k:'d',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.6,vz:rn(3,6),t:frame,l:rn(30,55)})}
for(let i=0;i<8;i++)sp_({k:'s',x:x+rn(-RS*.5,RS*.5),y:y+rn(-RS*.3,RS*.3),z:rn(0,10),vz:rn(.3,.9),t:frame,l:rn(70,120),r:rn(10,22)});
tt.save();const g=tt.createRadialGradient(x,y,2,x,y,RS*.7);g.addColorStop(0,'rgba(10,8,6,.75)');g.addColorStop(.6,'rgba(25,18,12,.45)');g.addColorStop(1,'rgba(25,18,12,0)');tt.fillStyle=g;tt.beginPath();tt.arc(x,y,RS*.7,0,7);tt.fill();tt.restore();
/* steady siege camera */};
const _s9=step;step=function(){_s9();try{for(let i=SF.length-1;i>=0;i--){const o=SF[i];if(o.k=='S'&&frame>=o.t+o.du){boom(o);SF.splice(i,1)}}SF.forEach(o=>{});}catch(e){}};
const _d9=draw;draw=function(){_d9();ctx.save();try{ctx.translate(-cam.x,-cam.y);
sel.forEach(u=>{if(u.t=='tank'&&u.siege&&u.hp>0){ctx.save();ctx.setLineDash([10,8]);ctx.lineDashOffset=-frame*.5;ctx.strokeStyle='rgba(120,220,255,.4)';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(u.x,u.y*K,380,380*K,0,0,7);ctx.stroke();ctx.restore()}});
for(let i=SF.length-1;i>=0;i--){const o=SF[i],a=frame-o.t;
if(o.k=='S'){const t=Math.min(1,a/o.du),P=q=>[o.x0+(o.x1-o.x0)*q,(o.y0+(o.y1-o.y0)*q)*K-(23*(1-q)+o.arc*4*q*(1-q))];ctx.save();ctx.globalCompositeOperation='lighter';for(let j=10;j>=1;j--){const q=Math.max(0,t-j*.028),p=P(q);ctx.fillStyle='rgba(140,210,255,'+(.5*(1-j/10))+')';ctx.beginPath();ctx.arc(p[0],p[1],4*(1-j/12),0,7);ctx.fill()}const p=P(t);glow(p[0],p[1],14,'rgba(170,225,255,.9)',1);ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(p[0],p[1],3,0,7);ctx.fill();ctx.restore();ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(o.x0+(o.x1-o.x0)*t,(o.y0+(o.y1-o.y0)*t)*K,5,2.5,0,0,7);ctx.fill();continue}
if(o.k=='m'){if(a>12){SF.splice(i,1);continue}const q=a/12,x=o.x,y=o.y*K-23;glow(x,y,26*(1-q*.4),'rgba(200,235,255,'+(1-q)+')',1);glow(x,y,12,'rgba(255,255,255,'+(1-q)+')',1);ctx.strokeStyle='rgba(190,230,255,'+(.7*(1-q))+')';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(o.x,o.y*K,10+q*38,(10+q*38)*K,0,0,7);ctx.stroke();continue}
if(o.k=='i'){if(a>75){SF.splice(i,1);continue}const x=o.x,y=o.y*K,RS=o.RS;
if(a<8)glow(x,y-8,RS*(1.3+a*.08),'rgba(255,240,200,'+(1-a/8)+')',1);
if(a<32){const q=a/32,r=RS*(.35+.55*q),yy=y-10-a*.8,g=ctx.createRadialGradient(x,yy,2,x,yy,r);g.addColorStop(0,'rgba(255,245,200,'+(1-q)+')');g.addColorStop(.35,'rgba(255,160,60,'+.9*(1-q)+')');g.addColorStop(1,'rgba(120,30,10,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,yy,r,0,7);ctx.fill()}
if(a<26){const q=a/26,r=RS*1.35*q;ctx.strokeStyle='rgba(200,235,255,'+.85*(1-q)+')';ctx.lineWidth=5*(1-q)+1;ctx.beginPath();ctx.ellipse(x,y,r,r*K,0,0,7);ctx.stroke()}
if(a<48){const q=a/48,r=RS*1.1*q;ctx.strokeStyle='rgba(170,140,100,'+.5*(1-q)+')';ctx.lineWidth=7*(1-q)+1;ctx.beginPath();ctx.ellipse(x,y,r,r*K,0,0,7);ctx.stroke()}continue}
const l=o.l||0;if(a>l){SF.splice(i,1);continue}const q=a/l;
if(o.k=='s'){const z=(o.z||0)+o.vz*a;ctx.fillStyle='rgba(55,50,46,'+.4*(1-q)+')';ctx.beginPath();ctx.arc(o.x+(o.vx||0)*a,o.y*K-z,o.r+a*.22,0,7);ctx.fill()}
else{let z=2+o.vz*a-.22*a*a;if(z<0)z=0;const x=o.x+o.vx*a,y=o.y+o.vy*a;if(o.k=='p'){ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle=o.c;ctx.globalAlpha=1-q;ctx.fillRect(x,y*K-z,2.4,2.4);ctx.restore()}else{ctx.fillStyle='rgba(30,26,22,'+(1-q)+')';ctx.fillRect(x,y*K-z,3,3)}}}
}catch(e){}ctx.restore();
if(shk){shk=0}if(cv.style.transform)cv.style.transform=''};

(()=>{
try{
  // --- Terran-style original comms: less synthetic feel for alerts/buildings ---
  const commCool={},commSeq={};
  function radioClick(d=0){try{rdo(d);nxs(.05,.06,2400,'bandpass',d+.02,3800);tn(980,.025,'square',.018,-140,d+.06)}catch(e){}}
  function terranPulse(base=120,delay=0,warm=0){try{tn(base,.22,'triangle',.045,20,delay);tn(base*1.5,.14,'sine',.03,0,delay+.09);nxs(.18,.045,1200+warm,'bandpass',delay+.03,2200+warm);nxs(.12,.022,4200,'highpass',delay+.12)}catch(e){}}
  function terranPhrase(base,sylls,delay=0,vol=1.15){try{radioClick(delay);vxs(base,sylls,.082,vol,delay+.05);nxs(.18,.035,1650,'bandpass',delay+.04,2500);tn(base*4.6,.04,'triangle',.015,-250,delay+.16)}catch(e){}}
  let commVoiceCache=null,commQueue=[],commSpeaking=false,commLastAt=0,commTimer=0;
  function bestCommVoice(){
    try{
      const voices=(window.speechSynthesis&&speechSynthesis.getVoices?speechSynthesis.getVoices():[])||[];
      if(!voices.length)return null;
      if(commVoiceCache&&voices.includes(commVoiceCache))return commVoiceCache;
      const score=v=>{
        const n=(v.name||'').toLowerCase(),lang=(v.lang||'').toLowerCase();let s=0;
        if(!/^en(?:-|$)/.test(lang))return -1000;
        if(n.includes('natural'))s+=120;
        if(n.includes('neural'))s+=115;
        if(n.includes('online'))s+=105;
        if(n.includes('google'))s+=100;
        if(n.includes('microsoft'))s+=100;
        if(n.includes('aria')||n.includes('jenny')||n.includes('david')||n.includes('guy')||n.includes('andrew'))s+=45;
        if(n.includes('desktop'))s-=20;
        if(n.includes('compact'))s-=25;
        if(lang.includes('en-us'))s+=20;
        return s;
      };
      commVoiceCache=voices.slice().sort((a,b)=>score(b)-score(a))[0]||null;
      return commVoiceCache;
    }catch(e){return null}
  }
  function drainCommQueue(){
    if(commTimer||commSpeaking||!commQueue.length||mute||!window.speechSynthesis)return;
    const wait=Math.max(0,850-(Date.now()-commLastAt));
    commTimer=setTimeout(()=>{
      commTimer=0;
      if(!commQueue.length||mute)return;
      const item=commQueue.shift();commSpeaking=true;commLastAt=Date.now();radioClick(0);
      const u=new SpeechSynthesisUtterance(item.text);u.voice=bestCommVoice();
      u.rate=.93+Math.random()*.07;u.pitch=.84+Math.random()*.09;u.volume=.92;
      u.onend=u.onerror=()=>{commSpeaking=false;drainCommQueue()};
      try{speechSynthesis.speak(u)}catch(e){commSpeaking=false;drainCommQueue()}
    },wait);
  }
  function commSpeak(text,urgent=false,gap=4000){
    try{
      if(mute||!window.speechSynthesis||!text)return;
      const n=Date.now();
      if(commCool[text]&&n-commCool[text]<gap)return;
      commCool[text]=n;
      if(urgent){
        if(commTimer){clearTimeout(commTimer);commTimer=0}
        speechSynthesis.cancel();commQueue.length=0;commSpeaking=false;commLastAt=0;
        commQueue.push({text,urgent:true});
      }else{
        if(commQueue.some(q=>q.text===text)||commSpeaking&&speechSynthesis.speaking)return;
        if(commQueue.length>=2)commQueue.shift();
        commQueue.push({text,urgent:false});
      }
      drainCommQueue();
    }catch(e){}
  }
  try{if(window.speechSynthesis)speechSynthesis.getVoices();speechSynthesis.addEventListener('voiceschanged',()=>{commVoiceCache=null})}catch(e){}
  // building select/ack sounds: short original Terran-comms inspired phrases, not copied lines
  SEL.cc=[
    ()=>{terranPulse(76); terranPhrase(124,'oua',.08,1.05);},
    ()=>{terranPulse(70); terranPhrase(118,'eoa',.06,1.05);}
  ];
  SEL.barracks=[
    ()=>{terranPulse(110); terranPhrase(134,'ao',.05,1.18);},
    ()=>{radioClick(); terranPhrase(128,'eo',.05,1.12); tn(210,.14,'square',.03,-80,.16)}
  ];
  SEL.factory=[
    ()=>{terranPulse(92,0,200); terranPhrase(120,'ou',.07,1.08); tn(180,.18,'triangle',.028,160,.16);},
    ()=>{radioClick(); tn(90,.14,'square',.03,-30,.02); tn(120,.1,'square',.025,0,.14); terranPhrase(112,'oa',.07,1.02);}
  ];
  SEL.starport=[
    ()=>{nxs(.3,.05,900,'lowpass',0,2600); terranPhrase(146,'ei',.05,1.06); tn(450,.15,'sawtooth',.02,220,.18);},
    ()=>{radioClick(); terranPhrase(138,'ia',.05,1.02); nxs(.16,.028,4300,'highpass',.18)}
  ];
  SEL.academy=[
    ()=>{radioClick(); [740,930,1170].forEach((f,i)=>tn(f,.04,'square',.02,0,.04+i*.05)); terranPhrase(150,'ea',.09,1.0);},
    ()=>{terranPulse(140); terranPhrase(156,'ia',.08,1.0);}
  ];
  SEL.depot=[
    ()=>{tn(155,.08,'square',.045,-40); terranPhrase(132,'oa',.06,.9);},
    ()=>{radioClick(); terranPhrase(126,'ou',.06,.9);}
  ];
  SEL.refinery=[
    ()=>{[0,.1,.2].forEach(d=>tn(72,.09,'sine',.12,-15,d)); terranPhrase(108,'ua',.07,.92);},
    ()=>{radioClick(); terranPhrase(102,'uo',.07,.9);}
  ];
  // More natural alert/announcer delivery
  const commPick=(key,lines)=>{const n=commSeq[key]||0;commSeq[key]=n+1;return lines[n%lines.length]};
  zmsg=function(s){
    if(/researched/i.test(s)) commSpeak(commPick('research',['Upgrade complete. Field capability improved.','Research is finished. That gives us an edge.']));
    else if(/complete/i.test(s)) commSpeak(commPick('complete',['Structure operational. Production is online.','Build complete. The facility is ready.']));
    else if(/under attack/i.test(s)){
      commSpeak(commPick('attack',['Command, we are taking fire at the base. Move to defend.','Contact on the line. Our perimeter is under attack.']),true,9000);
      S.warn(); zflash('alr','zalr 1.3s');
    } else if(/minerals|resources/i.test(s)) { commSpeak(commPick('minerals',['We are short on minerals. Adjust the economy.','Mineral reserves are low. Keep the workers moving.'])); zflash('m','zbad .7s'); }
    else if(/gas/i.test(s)) { commSpeak(commPick('gas',['Vespene reserves are running low.','We need more gas for the next tech step.'])); zflash('g','zbad .7s'); }
    else if(/^Build more/i.test(s)) { commSpeak(commPick('supply',['Supply is capped. Get another depot up.','We are supply blocked. Build a depot.'])); zflash('s','zbad .7s'); }
    else if(/incoming/i.test(s)) commSpeak(commPick('incoming',['Zerg contact inbound. Get ready.','Incoming Swarm contact. Weapons free.']),false,4000);
    else if(/Cannot build/i.test(s)) commSpeak(commPick('build',['We cannot deploy there. Find another site.','That position is blocked. Move the construction order.']));
  };

  // --- Better Medic model: 3D support trooper with medpack / visor / heal wand ---
  function medic3(u){
    const sy=u.y*K,r=R(u),Q=[],A=(x,y,z,f)=>Q.push([dk2(x,y,z),f]);
    ctx.fillStyle='rgba(0,0,0,.34)'; ctx.beginPath(); ctx.ellipse(u.x+2,sy+2,r*1.03,r*K*1.03,0,0,7); ctx.fill();
    if(sel.includes(u)){
      const pu=1+Math.sin(frame*.12)*.06;ctx.save();ctx.shadowColor='#3cff7a';ctx.shadowBlur=10;ctx.strokeStyle='#4dff88';ctx.lineWidth=1.8;ctx.beginPath();ctx.ellipse(u.x,sy+3,(r+5)*pu,(r+5)*K*pu,0,0,7);ctx.stroke();ctx.globalAlpha=.3;ctx.lineWidth=5;ctx.stroke();ctx.restore();
    }
    ox=u.x; oy=sy; zo=0; us=1; ca=Math.cos(u.ang||0); sa=Math.sin(u.ang||0);
    const dd=Math.hypot(u.x-(u._px==null?u.x:u._px),u.y-(u._py==null?u.y:u._py)); u._px=u.x; u._py=u.y; u._ph=(u._ph||0)+dd*.28; u._mv=dd>.15;
    const sw=Math.sin(u._ph||0)*1.6, hl=u.healCd>0||u.cd>0;
    if(hl) glow(ox,oy-6,16,'rgba(120,255,190,.45)',.65+.25*Math.sin(frame*.35));
    A(-1+sw,-2.8,0,()=>box(-1+sw,-2.8,0,3.2,2.8,5,'#d4d7de'));
    A(-1-sw,2.8,0,()=>box(-1-sw,2.8,0,3.2,2.8,5,'#d4d7de'));
    A(-6.4,0,5.6,()=>box(-6.4,0,5.6,3.2,6.1,5.2,'#f3f5f8')); // backpack / medkit
    A(-6.4,0,10.1,()=>{bx3(-6.4,0,10.1,2.8,5.4,1.8,'#d33f3f'); bx3(-6.4,0,11.5,1,4.9,.7,'#f6f7fb'); bx3(-7.4,0,10.8,3,.8,2.8,'#f6f7fb'); bx3(-5.4,0,10.8,.8,3,2.8,'#f6f7fb');});
    A(-.4,0,5.2,()=>{box(-.4,0,5.2,6.3,7.9,6.3,'#eceff3'); bx3(.8,0,6.2,2.6,6.3,2.1,'#d63f3f');});
    A(2.2,-4.8,7.8,()=>box(2.2,-4.8,7.8,4.2,2.2,2.4,'#cfd5df')); A(2.2,4.8,7.8,()=>box(2.2,4.8,7.8,4.2,2.2,2.4,'#cfd5df'));
    A(3.2,0,12.5,()=>{ball(3.2,0,12.2,3.8,'#f0f4fa'); bx3(4.9,0,12.5,1.5,3.6,1.3,'#67e0ff');}); // head & visor
    A(6.8,4.5,8.5,()=>{box(6.8,4.5,8.3,6.6,1.2,1.5,'#97a5ba'); const p=pj(10.3,4.5,9.2); el(p[0],p[1],1.8,1.8*K,hl?'#7affb2':'#6fe0ff'); if(hl) glow(p[0],p[1],7,'rgba(140,255,190,.9)',1);}); // heal wand
    A(4.5,-4.3,8.5,()=>box(4.5,-4.3,8.2,4.1,1.2,1.5,'#cfd5df')); // side arm/kit
    run(Q);
    if(hl){ const p=pj(10.7,4.5,9.2); glow(p[0],p[1],10,'rgba(110,255,190,.95)',1); }
    if(u.hp<u.maxHp||sel.includes(u)) bar(u.x,sy-29,r*2,u.hp/u.maxHp);
  }
  const _drawUMedicPatch=drawU; drawU=function(u){
    if(u.t=='medic'&&u.hp>0&&!u.cl&&(u.team==1||seen(u))){try{medic3(u);return}catch(e){console.warn(e)}}
    _drawUMedicPatch(u);
  };

  // --- Improved round SC2-inspired Command Center ---
  function commandCenterSC2(b){
    const t0=T[b.t], s=t0.size, h=s/2, cx=b.x, cy=b.y*K, gr=b.done?1:.3+.7*b.pr/t0.bt, H=49;
    ctx.save();
    ctx.globalAlpha=b.done?1:.42+.58*b.pr/t0.bt;
    el(cx+14,cy+12,h*1.28,h*K*1.18,'rgba(0,0,0,.34)');
    ox=cx; oy=cy; ca=1; sa=0; zo=0; zs=gr; ob=.33; us=1;
    const Q=[],A=(x,y,z,f)=>Q.push([dk3(x,y,z),f]), pulse=.55+.45*Math.sin(frame*.13), working=b.done&&b.q&&b.q.length;
    const pad=(x,y,w,d,z,c)=>{slab(x-w/2,x+w/2,y-d/2,y+d/2,z,3.4,3.4,3.4,3.4,c); bx3(x,y,z+2.8,w*.65,d*.2,1.2,'#e4bc38');};
    // lower main deck and outer service ring
    A(0,0,0,()=>cy2(pj(0,0,0),48,6*zs,'#454b56'));
    [-30,30].forEach(x=>A(x,0,1,()=>{cy2(pj(x,0,1),8,11*zs,'#56606c'); const p=pj(x,7,6); bx3(x,7,6,9,2,1.6,'#e3b73d');}));
    [[-26,18],[-26,-18],[26,18],[26,-18]].forEach(([x,y],i)=>A(x,y,2,()=>{cy2(pj(x,y,2),7,9*zs,i%2?'#5d6774':'#505864'); const p=pj(x,y+6,7); el(p[0],p[1],2.2,1.4,'#9fe9ff');}));
    A(0,0,5,()=>cy2(pj(0,0,5),40,7*zs,'#6d7887'));
    A(0,0,12,()=>cy2(pj(0,0,12),31,8*zs,'#8996a7'));
    A(0,0,20,()=>cy2(pj(0,0,20),22,8*zs,'#5f6e84'));
    A(0,0,27,()=>cy2(pj(0,0,27),16,7*zs,'#2f5cce'));
    A(0,0,34,()=>{const d=pj(0,0,34); dom(d[0],d[1],16,12*zs,'#61baf7'); glow(d[0],d[1]-7,20,'rgba(120,205,255,.55)',.55+.35*pulse);});
    // front command aperture / door
    A(0,35,10,()=>{const p=pj(0,35,10); ctx.fillStyle='#12171d'; ctx.beginPath(); ctx.roundRect(p[0]-11,p[1]-12,22,13,[8,8,1,1]); ctx.fill(); rc(p[0]-13,p[1]-9,2.5,9,'#e4bc38'); rc(p[0]+10.5,p[1]-9,2.5,9,'#e4bc38');});
    // side landing pads / service decks
    A(-34,0,8,()=>pad(-34,0,14,26,8,'#2a313b')); A(34,0,8,()=>pad(34,0,14,26,8,'#2a313b'));
    A(0,-34,8,()=>pad(0,-34,24,12,8,'#313842')); A(0,34,8,()=>pad(0,34,24,12,8,'#313842'));
    // top ring lights and hazard stripe arc
    A(0,0,21,()=>{ctx.strokeStyle='#f0c449'; ctx.lineWidth=1.8; ctx.beginPath(); for(let a=.22;a<Math.PI-.22;a+=.08){const p=pj(Math.cos(a)*31,Math.sin(a)*31,21); a<.3?ctx.moveTo(p[0],p[1]):ctx.lineTo(p[0],p[1]);} ctx.stroke();});
    for(let i=0;i<10;i++){ const a=.22+i*.3; A(Math.cos(a)*33,Math.sin(a)*33,13,()=>{const p=pj(Math.cos(a)*33,Math.sin(a)*33,13); el(p[0],p[1],2.2,1.3,i%3?'#7ee8ff':'#ff7d58');}); }
    // antenna / comms tower
    A(-8,-7,37,()=>{const a=pj(-8,-7,37),t=pj(-8,-7,51); ctx.strokeStyle='#c7d3df'; ctx.lineWidth=1.3; ctx.beginPath(); ctx.moveTo(a[0],a[1]); ctx.lineTo(t[0],t[1]); ctx.stroke(); el(t[0],t[1],1.8,1.8,'#ff685c');});
    // small animated smoke / construction glow when producing
    run(Q);
    if(working){ [-20,0,20].forEach(x=>{const p=pj(x,32,18); glow(p[0],p[1],13,'rgba(255,210,90,.56)',.55+.45*pulse);}); const p=pj(-26,-18,16); glow(p[0],p[1],8,'rgba(130,220,255,.6)',.6); if(frame%5==0){ const s=pj(-34,-2,20); glow(s[0]+Math.random()*4-2,s[1]-Math.random()*6,5,'rgba(200,205,215,.45)',.8);} }
    if(b.done){ const p=pj(0,0,45); el(p[0],p[1],4.8,4.8*K,'#dceafe'); }
    ctx.restore(); zs=1; ob=0; bar3(b,H,gr);
  }
  const _drawBCommandPatch=drawB; drawB=function(b){
    if(b.team==1&&b.t=='cc'){
      try{ commandCenterSC2(b); return; }catch(e){ console.warn(e); }
    }
    _drawBCommandPatch(b);
  };
}catch(e){console.error(e)}
})();
(()=>{
try{
  // ===== Voice overhaul: real spoken Terran-style comms for buildings + alerts =====
  let terranVoiceCache=null;
  const voiceCooldown={};
  const BUILDING_LINES={
    cc:['Command center online.','Command center standing by.','Primary command awaiting orders.'],
    barracks:['Barracks standing by.','Infantry command ready.','Barracks online.'],
    factory:['Factory awaiting orders.','Vehicle assembly ready.','Factory systems online.'],
    starport:['Starport control online.','Flight deck standing by.','Aerospace systems ready.'],
    academy:['Academy division ready.','Research command standing by.'],
    depot:['Supply depot secure.','Logistics node standing by.'],
    refinery:['Refinery online.','Vespene processing stable.','Gas intake standing by.'],
    bld:['Construction in progress.','Work crews are on it.']
  };
  function terranVoice(){
    try{
      const vs=(speechSynthesis&&speechSynthesis.getVoices?speechSynthesis.getVoices():[])||[];
      if(!vs.length) return null;
      if(terranVoiceCache && vs.includes(terranVoiceCache)) return terranVoiceCache;
      const pref=[
        'microsoft david','microsoft guy','microsoft andrew','google us english','daniel','alex','david','guy','james'
      ];
      terranVoiceCache=vs.find(v=>/^en/i.test(v.lang||'') && pref.some(p=>(v.name||'').toLowerCase().includes(p)))
        || vs.find(v=>/^en/i.test(v.lang||''))
        || vs[0] || null;
      return terranVoiceCache;
    }catch(e){return null}
  }
  function radioPre(delay=0){
    try{
      if(typeof rdo==='function') rdo(delay);
      if(typeof nxs==='function') nxs(.05,.035,2100,'bandpass',(delay||0)+.01,3300);
      if(typeof tn==='function') tn(880,.02,'square',.012,-100,(delay||0)+.055);
    }catch(e){}
  }
  function speakTerran(text,urgent=false,gap=1200){
    try{
      if(mute || !window.speechSynthesis || !text) return false;
      const now=Date.now();
      if(voiceCooldown[text] && now-voiceCooldown[text]<gap) return true;
      voiceCooldown[text]=now;
      if(urgent) speechSynthesis.cancel();
      radioPre(0);
      const u=new SpeechSynthesisUtterance(text);
      u.voice=terranVoice();
      u.rate=.94;
      u.pitch=.78;
      u.volume=.98;
      setTimeout(()=>{ try{ speechSynthesis.speak(u); }catch(e){} },70);
      return true;
    }catch(e){ return false; }
  }
  try{ if(window.speechSynthesis) speechSynthesis.getVoices(); }catch(e){}
  addEventListener('click',()=>{ try{ if(window.speechSynthesis) speechSynthesis.getVoices(); }catch(e){} },{once:true,capture:true});

  const _oldSelSnd=selSnd;
  selSnd=function(){
    try{
      if(mute || !sel.length) return;
      const n=Date.now();
      if(n-lsel<190) return;
      lsel=n;
      const e=sel[Math.random()*sel.length|0];
      if(!e) return;
      const isBuilding=!!e.b || !!(T[e.t]&&T[e.t].size);
      if(isBuilding){
        const key=e.done===0?'bld':e.t;
        const lines=BUILDING_LINES[key]||BUILDING_LINES.cc;
        const line=lines[Math.random()*lines.length|0];
        if(speakTerran(line,false,900)) return;
      }
      _oldSelSnd();
    }catch(err){ try{ _oldSelSnd(); }catch(e){} }
  };

  // Replace the alert/status speaker too so the overall voice feel changes.
  zspeak=function(t,urgent,gap){ return speakTerran(t,!!urgent,gap||3500); };
  zmsg=function(s){
    try{
      if(/researched/i.test(s)) speakTerran('Upgrade complete.',false,2500);
      else if(/complete/i.test(s)) speakTerran('Structure operational.',false,2500);
      else if(/under attack/i.test(s)){
        speakTerran(/base/i.test(s)?'Command, our base is under attack.':'Field units are under fire.',true,5000);
        S.warn&&S.warn(); zflash&&zflash('alr','zalr 1.3s');
      }
      else if(/minerals|resources/i.test(s)) { speakTerran('Insufficient minerals.',false,1200); zflash&&zflash('m','zbad .7s'); }
      else if(/gas/i.test(s)) { speakTerran('Insufficient vespene gas.',false,1200); zflash&&zflash('g','zbad .7s'); }
      else if(/^Build more/i.test(s)) { speakTerran('Supply capacity reached.',false,1800); zflash&&zflash('s','zbad .7s'); }
      else if(/incoming/i.test(s)) speakTerran('Alert. Zerg contact inbound.',false,4000);
      else if(/Cannot build/i.test(s)) speakTerran('Unable to deploy there.',false,1400);
    }catch(e){}
  };

  // ===== Visual overhaul: Command Center, Medic, and SC2-style Refinery =====
  function medicModelV2(u){
    const sy=u.y*K,r=R(u),Q=[],A=(x,y,z,f)=>Q.push([dk2(x,y,z),f]);
    ctx.fillStyle='rgba(0,0,0,.34)'; ctx.beginPath(); ctx.ellipse(u.x+2,sy+2,r*1.03,r*K*1.03,0,0,7); ctx.fill();
    if(sel.includes(u)){const pu=1+Math.sin(frame*.12)*.06;ctx.save();ctx.shadowColor='#3cff7a';ctx.shadowBlur=10;ctx.strokeStyle='#4dff88';ctx.lineWidth=1.8;ctx.beginPath();ctx.ellipse(u.x,sy+3,(r+5)*pu,(r+5)*K*pu,0,0,7);ctx.stroke();ctx.globalAlpha=.3;ctx.lineWidth=5;ctx.stroke();ctx.restore()}
    ox=u.x; oy=sy; zo=0; us=1; ca=Math.cos(u.ang||0); sa=Math.sin(u.ang||0);
    const dd=Math.hypot(u.x-(u._px==null?u.x:u._px),u.y-(u._py==null?u.y:u._py)); u._px=u.x; u._py=u.y; u._ph=(u._ph||0)+dd*.28; u._mv=dd>.15;
    const sw=Math.sin(u._ph||0)*1.6, hl=(u.st==='heal'||u.cd>0||u.healCd>0);
    if(hl) glow(ox,oy-6,16,'rgba(120,255,190,.42)',.65+.25*Math.sin(frame*.35));
    A(-1+sw,-2.9,0,()=>box(-1+sw,-2.9,0,3.1,2.7,4.9,'#d7dbe2')); A(-1-sw,2.9,0,()=>box(-1-sw,2.9,0,3.1,2.7,4.9,'#d7dbe2'));
    A(-6.1,0,5.4,()=>{box(-6.1,0,5.4,3.4,6.4,5.6,'#f2f5f8'); bx3(-6.1,0,10,2.8,5.1,1.8,'#d93d3d'); bx3(-6.1,0,11.3,1,4.6,.6,'#fafcff'); bx3(-7.05,0,10.7,2.8,.8,2.5,'#fafcff'); bx3(-5.15,0,10.7,.8,2.8,2.5,'#fafcff');});
    A(-.3,0,5.4,()=>{box(-.3,0,5.4,6.3,7.7,6.5,'#eef2f5'); bx3(.9,0,6.1,2.8,6.1,2,'#c74343');});
    A(2.4,-4.7,7.7,()=>box(2.4,-4.7,7.7,4.3,2,2.2,'#d3d9e1')); A(2.4,4.7,7.7,()=>box(2.4,4.7,7.7,4.3,2,2.2,'#d3d9e1'));
    A(3.2,0,12.5,()=>{ball(3.2,0,12.2,3.9,'#f3f6fb'); bx3(4.95,0,12.4,1.5,3.8,1.3,'#55ddff');});
    A(6.9,4.5,8.4,()=>{box(6.9,4.5,8.2,7.1,1.15,1.45,'#9baac0'); const p=pj(10.7,4.5,9.1); el(p[0],p[1],1.9,1.25,hl?'#7effb7':'#8bf0ff'); if(hl) glow(p[0],p[1],7,'rgba(140,255,190,.95)',1);});
    A(4.2,-4.1,8.1,()=>box(4.2,-4.1,8.1,3.6,1.2,1.4,'#d7dbe2'));
    run(Q);
    if(u.hp<u.maxHp||sel.includes(u)) bar(u.x,sy-29,r*2,u.hp/u.maxHp);
  }
  const _drawUPatchFinal=drawU;
  drawU=function(u){
    if(u.t==='medic'&&u.hp>0&&!u.cl&&(u.team==1||seen(u))){try{medicModelV2(u);return}catch(e){console.warn(e)}}
    _drawUPatchFinal(u);
  };

  function commandCenterV3(b){
    const t0=T[b.t], s=t0.size, h=s/2, cx=b.x, cy=b.y*K, gr=b.done?1:.3+.7*b.pr/t0.bt, H=52;
    ctx.save(); ctx.globalAlpha=b.done?1:.45+.55*b.pr/t0.bt;
    el(cx+16,cy+12,h*1.36,h*K*1.2,'rgba(0,0,0,.34)');
    ox=cx; oy=cy; ca=1; sa=0; zo=0; zs=gr; ob=.33; us=1;
    const Q=[],A=(x,y,z,f)=>Q.push([dk3(x,y,z),f]), working=b.done&&b.q&&b.q.length, pulse=.55+.45*Math.sin(frame*.14);
    const light=(x,y,z,c='#8defff',r=2.3)=>A(x,y,z,()=>{const p=pj(x,y,z); el(p[0],p[1],r,r*.62,c)});
    const pad=(x,y,w,d,z,c)=>A(x,y,z,()=>{slab(x-w/2,x+w/2,y-d/2,y+d/2,z,3.6,3.6,3.6,3.6,c); bx3(x,y,z+2.8,w*.62,d*.16,1.2,'#efc23b');});
    A(0,0,0,()=>cy2(pj(0,0,0),50,7*zs,'#434b56')); // base
    A(0,0,6,()=>cy2(pj(0,0,6),41,8*zs,'#697484')); // outer ring
    A(0,0,15,()=>cy2(pj(0,0,15),31,9*zs,'#8e9aa9')); // inner ring
    A(0,0,24,()=>cy2(pj(0,0,24),22,8*zs,'#627187')); // core
    A(0,0,31,()=>cy2(pj(0,0,31),16,7*zs,'#2956c8')); // blue crown
    A(0,0,37,()=>{const d=pj(0,0,37); dom(d[0],d[1],17,13*zs,'#6cbaf7'); glow(d[0],d[1]-7,24,'rgba(120,205,255,.58)',.55+.35*pulse);});
    // side attachments / SC2-ish silhouette
    [[-34,0,8,16,28,'#2f3741'],[34,0,8,16,28,'#2f3741'],[0,-35,9,26,12,'#333b46'],[0,35,9,26,12,'#333b46']].forEach(v=>pad(...v));
    [[-24,-20],[24,-20],[-24,20],[24,20]].forEach(([x,y],i)=>A(x,y,3,()=>{cy2(pj(x,y,3),7,10*zs,i%2?'#55606d':'#4b5561'); const p=pj(x,y+6,7); bx3(x,y+6,7,7.5,1.6,1.2,'#e6bc38'); }));
    // front door
    A(0,36,12,()=>{const p=pj(0,36,12); ctx.fillStyle='#13191f'; ctx.beginPath(); ctx.roundRect(p[0]-12,p[1]-13,24,15,[10,10,1,1]); ctx.fill(); rc(p[0]-14,p[1]-9,2.5,9,'#efc23b'); rc(p[0]+11.5,p[1]-9,2.5,9,'#efc23b'); });
    // ring arc / hazard stripe
    A(0,0,17,()=>{ctx.strokeStyle='#efc23b'; ctx.lineWidth=1.8; ctx.beginPath(); for(let a=.28;a<Math.PI-.28;a+=.075){ const p=pj(Math.cos(a)*32,Math.sin(a)*32,17); a<.3?ctx.moveTo(p[0],p[1]):ctx.lineTo(p[0],p[1]); } ctx.stroke();});
    for(let i=0;i<12;i++){const a=.15+i*.28; light(Math.cos(a)*34,Math.sin(a)*34,13,i%3?'#93ecff':'#ff795d',2.25)}
    // antenna / tower
    A(-9,-8,39,()=>{const a=pj(-9,-8,39),t=pj(-9,-8,55); ctx.strokeStyle='#d1d9e4'; ctx.lineWidth=1.3; ctx.beginPath(); ctx.moveTo(a[0],a[1]); ctx.lineTo(t[0],t[1]); ctx.stroke(); el(t[0],t[1],1.8,1.8,'#ff6658');});
    run(Q);
    if(working){[-20,0,20].forEach(x=>{const p=pj(x,32,18); glow(p[0],p[1],14,'rgba(255,210,90,.6)',.55+.45*pulse)});}    
    ctx.restore(); zs=1; ob=0; bar3(b,H,gr);
  }

  function refineryV2(b){
    const t0=T[b.t], s=t0.size||52, cx=b.x, cy=b.y*K, gr=b.done?1:.3+.7*b.pr/t0.bt, H=34;
    ctx.save(); ctx.globalAlpha=b.done?1:.45+.55*b.pr/t0.bt;
    el(cx+10,cy+8,s*.48,s*K*.38,'rgba(0,0,0,.3)');
    ox=cx; oy=cy; ca=1; sa=0; zo=0; zs=gr; ob=.31; us=1;
    const Q=[],A=(x,y,z,f)=>Q.push([dk3(x,y,z),f]), pulse=.55+.45*Math.sin(frame*.18), prod=b.done;
    A(0,0,0,()=>cy2(pj(0,0,0),23,4*zs,'#495261')); // base ring
    A(0,0,4,()=>cy2(pj(0,0,4),18,5*zs,'#6f7b8d')); // deck
    // central green chamber
    A(0,0,8,()=>{const p=pj(0,0,8); cyl(p[0],p[1],11,12*zs,'#39444f'); dom(p[0],p[1]-12*zs,10,8*zs,'#5fe05f'); glow(p[0],p[1]-14*zs,18,'rgba(100,255,120,.5)',.55+.35*pulse);});
    // side intakes / SC2 refinery style housings
    [[-18,0,4,'#3f4856'],[18,0,4,'#3f4856'],[0,-16,4,'#46505e']].forEach(([x,y,z,c])=>A(x,y,z,()=>{const p=pj(x,y,z); cyl(p[0],p[1],6,9*zs,c);}));
    // support braces
    [[-10,-8,5],[-10,8,5],[10,-8,5],[10,8,5]].forEach(v=>A(v[0],v[1],v[2],()=>bx3(v[0],v[1],v[2],3,3,7,'#7f8da0')));
    // pipe arms reaching the geyser
    A(-16,-2,9,()=>{const a=pj(-16,-2,9), b2=pj(-28,-10,16), c=pj(-32,-6,22); ctx.strokeStyle='#a8b4c5'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(a[0],a[1]); ctx.lineTo(b2[0],b2[1]); ctx.lineTo(c[0],c[1]); ctx.stroke(); ctx.strokeStyle='#e8c33f'; ctx.lineWidth=1.4; ctx.setLineDash([5,5]); ctx.stroke(); ctx.setLineDash([]);});
    A(16,-1,9,()=>{const a=pj(16,-1,9), b2=pj(28,-8,15), c=pj(33,-3,21); ctx.strokeStyle='#9eaabb'; ctx.lineWidth=3.5; ctx.beginPath(); ctx.moveTo(a[0],a[1]); ctx.lineTo(b2[0],b2[1]); ctx.lineTo(c[0],c[1]); ctx.stroke();});
    // front console and exhaust stack
    A(0,18,6,()=>{bx3(0,18,6,14,6,4,'#2b333d'); bx3(0,18,10,9,1.2,1.2,'#efc23b');});
    A(9,-16,5,()=>{const p=pj(9,-16,5); cyl(p[0],p[1],4,18*zs,'#596575'); if(prod) smk(p[0],p[1]-18*zs,3,cx,'rgba(190,220,200,');});
    // green status lamps
    [[-8,14,8],[8,14,8],[0,10,14]].forEach(v=>A(v[0],v[1],v[2],()=>{const p=pj(v[0],v[1],v[2]); el(p[0],p[1],2.4,1.5,'#99ff9f'); glow(p[0],p[1],8,'rgba(120,255,150,.55)',.55+.3*pulse);}));
    run(Q);
    ctx.restore(); zs=1; ob=0; bar3(b,H,gr);
  }

  const _drawBPatchFinal=drawB;
  drawB=function(b){
    try{
      if(b.team==1 && b.t==='cc'){ commandCenterV3(b); return; }
      if(b.team==1 && b.t==='refinery'){ refineryV2(b); return; }
    }catch(e){ console.warn(e); }
    _drawBPatchFinal(b);
  };

}catch(e){console.error(e)}
})();
(()=>{
try{
  function barracksSC2(b){
    const t0=T[b.t], s=t0.size||64, h=s/2, cx=b.x, cy=b.y*K, gr=b.done?1:.3+.7*b.pr/t0.bt, H=38;
    ctx.save(); ctx.globalAlpha=b.done?1:.45+.55*b.pr/t0.bt;
    poly([cx-h,cy-h*K,cx+h,cy-h*K,cx+h+10,cy-h*K+7,cx+h+10,cy+h*K+7,cx-h+10,cy+h*K+7,cx-h,cy+h*K],'rgba(0,0,0,.32)');
    ox=cx; oy=cy; ca=1; sa=0; zo=0; zs=gr; ob=.31; us=1;
    const Q=[],A=(x,y,z,f)=>Q.push([dk3(x,y,z),f]), pulse=.5+.5*Math.sin(frame*.12), working=b.done&&b.q&&b.q.length;
    // Main armored hall
    A(0,2,0,()=>{slab(-28,28,-18,22,0,15,15,15,15,'#6b7483'); slab(-26,26,-16,20,15,5,5,5,5,'#8e99a7');});
    // Side buttresses / wing blocks
    A(-24,0,5,()=>bx3(-24,0,5,8,28,13,'#4b5563')); A(24,0,5,()=>bx3(24,0,5,8,28,13,'#4b5563'));
    // Roof panels and command strips
    A(0,-6,21,()=>{slab(-20,20,-10,12,21,2,2,2,2,'#2b56c8'); bx3(0,12,22.6,42,2,1.3,'#efc23b');});
    A(0,-10,18,()=>{bx3(0,-10,18,16,6,2.2,'#a5afbd'); bx3(0,-10,20,10,2,1,'#dce5ef');});
    // Big front infantry door
    A(0,22,2,()=>{const p=pj(0,22,2); ctx.fillStyle='#11161d'; ctx.beginPath(); ctx.roundRect(p[0]-13,p[1]-18,26,18,[8,8,2,2]); ctx.fill(); ctx.strokeStyle='#39424d'; ctx.lineWidth=1.2; ctx.stroke(); rc(p[0]-15,p[1]-14,2.5,12,'#efc23b'); rc(p[0]+12.5,p[1]-14,2.5,12,'#efc23b'); bx3(0,22,18.5,18,2.1,1.2,'#efc23b');});
    // Side windows / lights
    [[-18,-10,16],[18,-10,16],[-18,6,16],[18,6,16]].forEach(([x,y,z],i)=>A(x,y,z,()=>{const p=pj(x,y,z); el(p[0],p[1],2.7,1.5,i<2?'#96edff':'#ff7f63'); glow(p[0],p[1],8,(i<2?'rgba(140,235,255,.45)':'rgba(255,130,95,.35)'),.45+.22*pulse);}));
    // Rooftop antenna tower
    A(16,-15,23,()=>{const a=pj(16,-15,23), t=pj(16,-15,40); ctx.strokeStyle='#d0d7e3'; ctx.lineWidth=1.35; ctx.beginPath(); ctx.moveTo(a[0],a[1]); ctx.lineTo(t[0],t[1]); ctx.stroke(); rc(t[0]-1.2,t[1]-6,2.4,6,'#d0d7e3'); el(t[0],t[1]-7,2,2,'#ff6658');});
    // Rooftop comm dish / antenna brace
    A(10,-17,28,()=>{const p=pj(10,-17,28); ctx.strokeStyle='#d8e2ec'; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(p[0],p[1],5,Math.PI*.1,Math.PI*1.2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(p[0],p[1]); ctx.lineTo(p[0]+4,p[1]-4); ctx.stroke();});
    // Hazard stripe front edge
    A(0,17,18,()=>bx3(0,17,18.2,38,1.8,1.2,'#efc23b'));
    run(Q);
    if(working){[-12,0,12].forEach(x=>{const p=pj(x,19,19); glow(p[0],p[1],10,'rgba(255,205,80,.6)',.45+.45*pulse);});}
    ctx.restore(); zs=1; ob=0; bar3(b,H,gr);
  }

  function factorySC2(b){
    const t0=T[b.t], s=t0.size||64, h=s/2, cx=b.x, cy=b.y*K, gr=b.done?1:.3+.7*b.pr/t0.bt, H=40;
    ctx.save(); ctx.globalAlpha=b.done?1:.45+.55*b.pr/t0.bt;
    poly([cx-h-2,cy-h*K,cx+h+4,cy-h*K,cx+h+15,cy-h*K+7,cx+h+15,cy+h*K+9,cx-h+8,cy+h*K+9,cx-h-2,cy+h*K],'rgba(0,0,0,.33)');
    ox=cx; oy=cy; ca=1; sa=0; zo=0; zs=gr; ob=.31; us=1;
    const Q=[],A=(x,y,z,f)=>Q.push([dk3(x,y,z),f]), pulse=.5+.5*Math.sin(frame*.13), working=b.done&&b.q&&b.q.length;
    // Broad industrial base
    A(0,4,0,()=>{slab(-30,30,-18,24,0,15,15,15,15,'#68717f'); slab(-28,28,-16,22,15,4.5,4.5,4.5,4.5,'#8793a2');});
    // Rear machinery housings / smokestacks
    A(-18,-13,18,()=>{const p=pj(-18,-13,18); cyl(p[0],p[1],5,20*zs,'#56616d'); if(b.done) smk(p[0],p[1]-20*zs,3,cx+3,'rgba(170,180,190,');});
    A(-8,-15,19,()=>{const p=pj(-8,-15,19); cyl(p[0],p[1],4.2,17*zs,'#4b5663'); if(b.done) smk(p[0],p[1]-17*zs,2,cx+16,'rgba(160,170,180,');});
    // Vehicle bay housing front-center
    A(8,10,2,()=>{bx3(8,10,2,28,22,17,'#4f5968'); bx3(8,10,19.5,22,4,1.1,'#efc23b');});
    A(8,18,1,()=>{const p=pj(8,18,1); ctx.fillStyle='#11161c'; ctx.beginPath(); ctx.roundRect(p[0]-12,p[1]-14,24,14,[4,4,1,1]); ctx.fill(); ctx.strokeStyle='#39424d'; ctx.lineWidth=1.2; ctx.stroke(); for(let i=0;i<4;i++) rc(p[0]-10+i*6,p[1]-12,3,10,i%2?'#242b33':'#1a2028');});
    // Side vehicle assembly module
    A(-18,6,4,()=>{bx3(-18,6,4,10,24,13,'#4c5663'); bx3(-18,6,15.5,8,20,1.3,'#2a55c8');});
    // Roof crane/arm detail
    A(20,-7,18,()=>{bx3(20,-7,18,6,6,6,'#98a2af'); const a=pj(20,-7,24),j=pj(28,-10,27),e=pj(32,-5,27); ctx.strokeStyle='#e6bf43'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(a[0],a[1]); ctx.lineTo(j[0],j[1]); ctx.lineTo(e[0],e[1]); ctx.stroke();});
    // Front deck lights and grates
    [[-20,18,16],[-8,18,16],[4,18,16],[16,18,16]].forEach(([x,y,z],i)=>A(x,y,z,()=>{const p=pj(x,y,z); el(p[0],p[1],2.3,1.35,i<2?'#95ecff':'#ff8a62'); glow(p[0],p[1],7,i<2?'rgba(140,235,255,.45)':'rgba(255,130,95,.35)',.45+.22*pulse);}));
    A(0,14,18,()=>{for(let i=0;i<5;i++) bx3(-12+i*6,14,18.2,3.2,1,1,'#efc23b');});
    // Rear roof strip
    A(0,-4,20,()=>bx3(0,-4,20.5,34,2,1.2,'#2a55c8'));
    run(Q);
    if(working){[-2,8,18].forEach(x=>{const p=pj(x,17,18); glow(p[0],p[1],9,'rgba(255,205,80,.55)',.45+.45*pulse);});}
    ctx.restore(); zs=1; ob=0; bar3(b,H,gr);
  }

  function starportSC2(b){
    const t0=T[b.t], s=t0.size||64, h=s/2, cx=b.x, cy=b.y*K, gr=b.done?1:.3+.7*b.pr/t0.bt, H=42;
    ctx.save(); ctx.globalAlpha=b.done?1:.45+.55*b.pr/t0.bt;
    poly([cx-h-4,cy-h*K,cx+h+8,cy-h*K,cx+h+18,cy-h*K+8,cx+h+16,cy+h*K+9,cx-h+10,cy+h*K+9,cx-h-4,cy+h*K],'rgba(0,0,0,.33)');
    ox=cx; oy=cy; ca=1; sa=0; zo=0; zs=gr; ob=.31; us=1;
    const Q=[],A=(x,y,z,f)=>Q.push([dk3(x,y,z),f]), pulse=.5+.5*Math.sin(frame*.14), working=b.done&&b.q&&b.q.length;
    // Central raised landing platform
    A(0,0,0,()=>{slab(-20,20,-18,18,0,8,8,8,8,'#576171');});
    A(0,0,8,()=>{slab(-18,18,-16,16,8,3,3,3,3,'#8e99a8');});
    A(0,0,11.5,()=>{const p=pj(0,0,11.5); ctx.fillStyle='#283241'; ctx.beginPath(); ctx.arc(p[0],p[1],17,0,7); ctx.fill(); ctx.strokeStyle='#dce5ef'; ctx.lineWidth=2.2; ctx.stroke(); ctx.strokeStyle='#efc23b'; ctx.lineWidth=1.6; ctx.beginPath(); ctx.arc(p[0],p[1],12,0,7); ctx.stroke(); for(let i=0;i<12;i++){ const a=i*Math.PI/6, q=pj(Math.cos(a)*17,Math.sin(a)*17,12.2); el(q[0],q[1],2.1,1.25,(i+(frame>>3))%4==0?'#6dff8a':'#315f40'); }});
    // Support pylons under pad
    [[-12,-10],[-12,10],[12,-10],[12,10]].forEach(([x,y])=>A(x,y,0,()=>bx3(x,y,0,4,4,9,'#515c69')));
    // Side wings
    A(-28,0,5,()=>{slab(-40,-18,-10,10,5,5,5,5,5,'#4b5563'); bx3(-29,0,10.5,18,3,1.3,'#2b56c8');});
    A(28,0,5,()=>{slab(18,40,-10,10,5,5,5,5,5,'#4b5563'); bx3(29,0,10.5,18,3,1.3,'#2b56c8');});
    // Front runway / launch bridge
    A(0,22,4,()=>{slab(-10,10,14,30,4,2.6,2.6,2.6,2.6,'#303844'); bx3(0,14,6.8,20,2,1,'#efc23b'); bx3(0,22,6.8,20,2,1,'#efc23b');});
    // Rear tower / control mast
    A(22,-12,8,()=>{bx3(22,-12,8,8,8,14,'#99a4b2'); const p=pj(22,-12,22); dom(p[0],p[1],6,6*zs,'#6fd6ff'); glow(p[0],p[1]-2,10,'rgba(110,230,255,.45)',.45+.25*pulse);});
    // Wingtip lights / launch markers
    [[-36,0,11],[-22,0,11],[22,0,11],[36,0,11],[0,28,8]].forEach(([x,y,z],i)=>A(x,y,z,()=>{const p=pj(x,y,z); el(p[0],p[1],2.4,1.4,i===4?'#ff8a62':'#9bf0ff'); glow(p[0],p[1],7,i===4?'rgba(255,130,95,.35)':'rgba(140,235,255,.45)',.45+.22*pulse);}));
    // small spinning radar on side tower
    A(25,-14,24,()=>{const p=pj(25,-14,24); ctx.save(); ctx.translate(p[0],p[1]); ctx.rotate(Math.sin(frame*.04)*.5); rc(-7,-1,14,2,'#dce5ef'); rc(-1,-5,2,5,'#dce5ef'); ctx.restore();});
    run(Q);
    if(working){const p=pj(0,0,13); glow(p[0],p[1],16,'rgba(255,210,90,.55)',.4+.45*pulse);}    
    ctx.restore(); zs=1; ob=0; bar3(b,H,gr);
  }

  const _drawB_sc2set = drawB;
  drawB = function(b){
    try{
      if(b.team==1){
        if(b.t==='barracks'){ barracksSC2(b); return; }
        if(b.t==='factory'){ factorySC2(b); return; }
        if(b.t==='starport'){ starportSC2(b); return; }
      }
    }catch(e){ console.warn(e); }
    _drawB_sc2set(b);
  };
}catch(e){console.error(e)}
})();
}catch(e){console.error(e)}})()
;

(()=>{
try{
 const root=document.createElement('style');root.textContent=` 
 #top{min-height:45px;height:45px;gap:12px;padding:3px 16px;background:linear-gradient(180deg,#122d46,#091522)!important;border-bottom:1px solid #35769a!important}
 #top .mn{min-width:215px;display:flex;align-items:center;gap:10px}
 #top .res{margin-left:auto}
 #gc{background:#050b12}
 #bot{height:204px!important;min-height:204px!important;max-height:204px!important}
 #ov .row{max-width:1280px}
 #ov .c{min-height:118px;display:flex;flex-direction:column;justify-content:center}
 #ov .c b{font-size:15px;letter-spacing:.04em;margin-bottom:5px}
 #bot,#top{font-family:Rajdhani,Segoe UI,sans-serif}
 #hi{display:none;position:absolute;right:18px;top:72px;z-index:2;pointer-events:none;color:#ffe5a3;background:linear-gradient(100deg,rgba(48,34,16,.92),rgba(8,15,20,.87));padding:7px 13px;border:1px solid #a78843;box-shadow:0 0 14px rgba(224,167,54,.1);font:700 13px Rajdhani, sans-serif;letter-spacing:1.2px}
 #hi b{color:#fff;margin-right:8px}
 #tut{position:absolute;left:14px;bottom:73px;pointer-events:none;z-index:2;background:rgba(3,13,23,.81);color:#8dcbe3;border-left:3px solid #3e9ad1;padding:8px 12px;font:600 12px Rajdhani,Segoe UI,sans-serif;max-width:min(390px,60vw);line-height:1.6;letter-spacing:.4px}
 #tut strong{color:#fff}
 @media(max-width:800px){#top{height:46px!important;padding:4px 8px!important}#top .mn{min-width:100px!important}#top #zmenu{font-size:10px!important}#bot{height:150px!important}#sel{width:200px!important}#mmw{max-width:130px!important}#tut{display:none}#ov .c{min-height:96px}}
 `;document.head.appendChild(root);
 const hi=document.createElement('div');hi.id='hi';hi.innerHTML='<b>▲</b> HIGH GROUND &nbsp;·&nbsp; DEFENSIVE ADVANTAGE';$('gc').appendChild(hi);
 const tip=document.createElement('div');tip.id='tut';tip.innerHTML='<strong>COMMAND TIP</strong> &nbsp; Fortify the ramp. High-ground defenders take reduced damage from below.<br>Drag-select units · Right-click to command · <strong>?</strong> for controls';$('gc').appendChild(tip);
 const baseline=dmgU;
 dmgU=function(u,t,dm){dm=baseline(u,t,dm);
  if(!u.air&&!t.air){const a=elev(u.x,u.y),b=elev(t.x,t.y);
   if(a<b)dm*=.78;else if(a>b)dm*=1.08}
  return dm};
 const oldUpdSel=updSel;
 updSel=function(){oldUpdSel();const x=sel[0];
  if(x&&sel.every(e=>elev(e.x,e.y))){const p=$('sel');if(sel.length===1){const d=document.createElement('span');d.className='chip';d.textContent='▲ HIGH GROUND';p.querySelector('.zi')?.appendChild(d)}}};
 const oldStep=step;
 step=function(){oldStep();if(!started||over)return;
  if(frame%20===0){const raised=sel.length>0&&sel.every(e=>!e.air&&elev(e.x,e.y));hi.style.display=raised?'block':'none';if(frame>900)tip.style.display='none';}
 };
 const oldCard=card;
 card=function(){oldCard();if(!sel.length||sel.some(u=>u.b)||sel[0].team!=1)return;
  // H tells selected troops to guard a position without chasing enemies across ramps.
  const troops=sel.filter(u=>u.t!='scv');
  if(troops.length)mkBtn('Hold Position','h','defend this spot',()=>{
   troops.forEach(u=>{u.st='hold';u.tg=null;u.tx=u.x;u.ty=u.y});say('Holding the line')});
 };
 const oldUpd=upd;
 upd=function(u){if(u.st==='hold'&&!u.siege&&u.t!=='medic'){
  if(u.cd>0)u.cd--;if(u.stimT>0)u.stimT--;
  const r=T[u.t].rg||0;if(!r)return;const tgt=acq(u,r+R(u)+12);
  if(tgt&&D(u,tgt)-R(u)-R(tgt)<=r){atk(u,tgt,r,T[u.t].d);u.ang=Math.atan2(tgt.y-u.y,tgt.x-u.x)}
  return}
  oldUpd(u)};
 const oldRclick=rclick;rclick=function(x,y){hi.style.display='none';oldRclick(x,y)};
 addEventListener('keydown',e=>{if(!started||over||e.repeat)return;
  if(e.code==='Space'&&!e.ctrlKey&&!e.altKey&&document.activeElement?.tagName!=='INPUT'){
   e.preventDefault();const c=B.find(b=>b.team==1&&b.t==='cc'&&b.done);
   if(c){cam.x=c.x-cv.width/2;cam.y=c.y*K-cv.height/2;clampCam();say('Command Center')}
  }
 },true);
 // Suppress browser gestures that conflict with the command panel.
 cv.addEventListener('dragstart',e=>e.preventDefault());
 if(hpEl){hpEl.querySelector('.g')?.insertAdjacentHTML('beforeend','<div><h4>TACTICAL TERRAIN</h4>Rock faces are impassable. Use the marked ramps to move between high and low ground.<br>Ground units defending the high ground take <b>22% less damage</b> from enemies below and enjoy longer vision.<br><b>H</b> hold position · <b>Space</b> return to Command Center.</div>')}
}catch(err){console.error('Refinement initialization',err)}
})();

window.Korhal.modules.ui.loaded=true;

// v15: use the physical press for production. The card's icon/tooltip observer may
// rebuild a child between mouse-down and click; handling pointerdown at the stable
// panel fixes dropped rapid clicks without changing training costs or queue rules.
(()=>{
 const c=document.getElementById('card');let suppress=0;
 c.addEventListener('pointerdown',e=>{
  if(e.button!==0||!started||over||paused)return;
  const button=e.target.closest('button.b');if(!button||button.disabled)return;
  const producer=sel.length===1&&sel[0].b&&sel[0].done&&sel[0].team===1?sel[0]:null;
  if(!producer)return;
  const key=button.dataset.ak;
  const produced={cc:{scv:1},barracks:{marine:1,firebat:1,medic:1},factory:{vulture:1,tank:1,goliath:1},starport:{wraith:1,bc:1}};
  const allowed=produced[producer.t];if(!allowed||!allowed[key])return;
  suppress=performance.now();e.preventDefault();e.stopImmediatePropagation();
  au();train(producer,key);refreshCardAffordability();updHUD();
  const atCap=producer.q.length>=5;
  if(atCap){button.disabled=true;button.classList.add('x');button.setAttribute('aria-disabled','true')}
 },true);
 c.addEventListener('click',e=>{
  if(performance.now()-suppress<650){const b=e.target.closest('button.b');if(b&&b.dataset.ak&&T[b.dataset.ak]&&!T[b.dataset.ak].size){
   e.stopImmediatePropagation();e.preventDefault();suppress=0;
  }}
 },true);
})();

// v17: keep existing portraits/stats, but don't replace their canvas DOM on no-op HUD polls.
// A selected item's visible HP/queue/build/position indicators invalidate the snapshot.
(()=>{
 const original=updSel,ids=new WeakMap();let nextId=1,last='';
 const entityId=e=>{if(!ids.has(e))ids.set(e,nextId++);return ids.get(e)};
 const snapshot=()=>sel.map(e=>{
  const build=e.b&&!e.done?Math.floor(e.pr/T[e.t].bt*100):0;
  const queue=e.q?.length?e.q.join(',')+':'+Math.floor(e.qt/T[e.q[0]].bt*100):'';
  return [entityId(e),e.t,Math.round(e.hp),Math.round(e.maxHp),build,queue,e.stimT>0?1:0,
   e.siege?1:0,e.cl?1:0,e.rs||0,e.rt?Math.floor(e.rt/1200*100):0,elev(e.x,e.y),e.rk||0].join(':');
 }).join('|');
 updSel=function(){const now=snapshot();if(now===last)return;last=now;original()};
 addEventListener('korhal:reset',()=>{last='';});
})();
