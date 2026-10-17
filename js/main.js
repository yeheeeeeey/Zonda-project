/* SECTOR KORHAL v12 — split module: main / late integration */
window.Korhal=window.Korhal||{};
window.Korhal.modules=window.Korhal.modules||{};
window.Korhal.modules.main=window.Korhal.modules.main||{};

;

(()=>{
 const tip=document.getElementById('tip');
 const clearHover=()=>{if(tip)tip.style.display='none'};
 document.getElementById('card').addEventListener('pointerdown',()=>{drag=null},true);
 document.getElementById('card').addEventListener('click',()=>{drag=null;clearHover();ms.in=0},true);
 addEventListener('keydown',e=>{if(e.key==='Escape'){clearHover();ms.in=0}},true);
 cv.addEventListener('contextmenu',()=>{clearHover();ms.in=0});
 cv.addEventListener('pointerenter',e=>{const r=cv.getBoundingClientRect();ms={x:e.clientX-r.left,y:e.clientY-r.top,in:1}});
 // The small normal selection footprint is fixed above, without affecting combat targeting.
})();
;

(()=>{
 'use strict';
 // The 3D renderers above now execute in the same lexical scope as dk3, pj, slab, etc.
 const cardPanel=document.getElementById('card');
 cardPanel.addEventListener('mousedown',()=>{drag=null},true);
 // The old drag starts on the canvas but its mouseup was global. Never allow a UI click to commit that drag.
 const blockDrag=e=>{drag=null;};
 cardPanel.addEventListener('pointerdown',blockDrag,true);
 // Visible gameplay HUD only. The mission canvas and bottom controls are hidden on home/briefings/results.
 const uiStyle=document.createElement('style');
 uiStyle.textContent=`body.outside-match #top,body.outside-match #bot,body.outside-match #qb,body.outside-match #tut,body.outside-match #hi{display:none!important}
 body.outside-match #gc{flex:1}`;
 document.head.appendChild(uiStyle);
 function syncGameplayHUD(){
  const playing=!!started&&!over&&document.getElementById('ov').style.display==='none';
  const wasHidden=document.body.classList.contains('outside-match');
  document.body.classList.toggle('outside-match',!playing);
  // The battlefield changes height when HUD returns; keep canvas backing size synchronized.
  if(wasHidden!==!playing){size();}
 }
 new MutationObserver(syncGameplayHUD).observe(document.getElementById('ov'),{attributes:true,attributeFilter:['style']});
 addEventListener('korhal:reset',()=>{attackLoc=null;});
 syncGameplayHUD();
 // Resource changes update button state in place; the card DOM is rebuilt only when
 // selection/technology changes. This prevents pointer hover from churning the panel.
 window.korhalSyncHUD=syncGameplayHUD;
 const olderB=updB;
 updB=function(b){
  const done=!!b.done,ql=b.q?.length||0;
  olderB(b);
  if(!done&&b.done&&b.team===1){sig='';card();updHUD();}
  if(b.team===1&&ql>(b.q?.length||0)&&b.done){sig='';card();}
 };
 // Keep auto-response tactical: idle troops guard friendly buildings, but explicit moves aren't hijacked.
 const oldHurt=hurtTeam;
 let attackLoc=null,attackMarkFrame=-10000,alertSequence=0;
 hurtTeam=function(target){
  const foe=target.kb;
  if(target.team===1&&foe&&foe.hp>0&&foe.team!==1){
   for(const soldier of U){
    if(soldier.team!==1||soldier.hp<=0||!T[soldier.t].d||soldier.t==='scv'||soldier.siege||soldier.st!=='idle')continue;
    const vicinity=target.b?245:155;
    if(D(soldier,target)<=vicinity){soldier.st='atk';soldier.tg=foe;}
   }
   if(frame-attackMarkFrame>=100){
    attackLoc={x:target.x,y:target.y,until:frame+480};attackMarkFrame=frame;alertSequence++;
    FX.push({k:'bm',x:target.x,y:target.y,r:22,l:18,m:18,c:'#ff6c4b'});
    say('Under attack! Press Space to jump to the alert.');
    snd('warn');
   }
  }
  oldHurt(target);
 };
 // The base game has a functional attack-move action, but it lacked on-map feedback.
 const oldIssue=issue;
 issue=function(x,y,am){
  oldIssue(x,y,am);
  if(am){
   FX.push({k:'bm',x,y,r:26,l:20,m:20,c:'#ff8c5d'});
   say('Attack-moving to destination');snd('click');
  }
 };
 // Rally unit spawn and notify. This also guarantees aircraft exit the production pad.
 const spawnBefore=window.onSpawn;
 window.onSpawn=function(b,u,k){
  if(spawnBefore)spawnBefore(b,u,k);
  if(b.team===1){
   if(b.rl){
    const r=b.rl;
    u.tx=r.x;u.ty=r.y;
    if(k==='scv'&&r.p&&r.p.a>0){u.st='mine';u.pt=r.p;}
    else {u.st=k==='scv'?'move':'amove';u.tg=null;}
    u.pa=null;u.pk=null;
   }
   say(T[k].n+' ready');snd('done',b.x,b.y);
  }
 };
 // Under-attack minimap locator and optional camera navigation.
 const oldDraw=draw;
 draw=function(){
  oldDraw();
  if(attackLoc&&attackLoc.until>frame){
   const x=attackLoc.x*192/W,y=attackLoc.y*128/H;
   const p=(frame%56)/56;
   mc.save();mc.strokeStyle='rgba(255,90,65,'+(1-p)+')';mc.lineWidth=2.5;
   mc.beginPath();mc.arc(x,y,4+p*16,0,Math.PI*2);mc.stroke();mc.fillStyle='#ff6450';mc.fillRect(x-2,y-2,4,4);mc.restore();
  }
 };
 addEventListener('keydown',e=>{
  if(e.code!=='Space'||e.repeat||!started||over)return;
  if(attackLoc&&frame<attackLoc.until){
   e.preventDefault();cam.x=attackLoc.x-cv.width/2;cam.y=attackLoc.y*K-cv.height/2;clampCam();
   say('Camera: last attack location');snd('click');
  }
 },true);
 // Refresh the army button's direct selection path. Do not depend on the old click/drag state.
 const armyButton=document.getElementById('qa');
 if(armyButton)armyButton.addEventListener('click',e=>{
  if(!started||over)return;
  e.stopImmediatePropagation();e.preventDefault();drag=null;
  const troops=U.filter(u=>u.team===1&&u.hp>0&&u.t!=='scv'&&u.t!=='convoy'&&!u.b);
  if(!troops.length){say('No army units');snd('err');return;}
  sel=troops;sig='';updSel();card();selSnd();say(troops.length+' army units selected');
 },true);
 // Move cursor feedback away from disabled actions while keeping all selection state.
 cardPanel.addEventListener('click',()=>{drag=null},true);
})();
;

(function(){
  const K=window.Korhal;
  K.version='v20-construction-production-stability';
  const defs={T:()=>T,res:()=>res,U:()=>U,B:()=>B,P:()=>P,GY:()=>GY,EX:()=>EX,FX:()=>FX,AL:()=>AL,VS:()=>VS,sel:()=>sel,grp:()=>grp,cam:()=>cam,frame:()=>frame,wave:()=>wave,started:()=>started,over:()=>over,paused:()=>paused,mode:()=>mode};
  Object.keys(defs).forEach(k=>Object.defineProperty(K,k,{enumerable:true,configurable:true,get:defs[k]}));
  K.startGame=()=>startGame();
  K.menu=()=>menu();
  K.getState=()=>({started,over,paused,mode,frame,wave,map:typeof MAP!=='undefined'?MAP.n:null});
  K.modules.main.loaded=true;
})();

// v16: no catch-up bursts, present a frame only within the quality budget.
// The 60Hz simulation never attempts more than two updates in one browser callback.
const SIM_MS=1000/60;
let simPrevious=performance.now(),simBank=0,lastPaint=0,lastCost=0;
addEventListener('korhal:reset',()=>{window.korhalBuildWorkers=[];});
let korhalWaveMarker=null;
const waveBanner=document.createElement('div');waveBanner.id='korhalWaveBanner';
waveBanner.style.cssText='position:absolute;z-index:3;top:76px;left:50%;transform:translateX(-50%);pointer-events:none;background:rgba(35,5,5,.86);border:1px solid #e65d49;border-radius:3px;padding:10px 24px;color:#ffd4ba;font:800 15px sans-serif;letter-spacing:2px;text-shadow:0 1px 6px #000;display:none';
document.getElementById('gc').appendChild(waveBanner);
window.korhalWaveNotice=function(number,source){
 korhalWaveMarker={x:source.x,y:source.y,until:frame+510};
 waveBanner.textContent='⚠ ZERG WAVE '+number+' INBOUND';waveBanner.style.display='block';
};
const previousDrawForWave=draw;
draw=function(){
 previousDrawForWave();
 if(korhalWaveMarker&&korhalWaveMarker.until>frame){
  const a=1-(frame%55)/55,x=korhalWaveMarker.x*192/W,y=korhalWaveMarker.y*128/H;
  mc.save();mc.strokeStyle='rgba(255,85,65,'+a+')';mc.lineWidth=2.5;
  mc.beginPath();mc.arc(x,y,4+20*(1-a),0,Math.PI*2);mc.stroke();mc.restore();
 }
};
const fpsElement=document.createElement('div');fpsElement.id='korhalFPS';
fpsElement.style.cssText='position:absolute;z-index:10;top:47px;right:15px;padding:4px 8px;background:rgba(2,11,17,.75);border:1px solid #34708a;border-radius:3px;color:#8ff4e9;font:bold 11px monospace;pointer-events:none;display:none';
document.getElementById('gc').appendChild(fpsElement);
let fpsSamples=0,fpsWindow=performance.now(),fpsLive=0,simSlow=0,lastAffordabilityTick=-1;
addEventListener('korhal:reset',()=>{lastAffordabilityTick=-1});
let fpsWasVisible=null,fpsDisplayDirty=true;
const performanceState=window.Korhal.performance={fps:0,lastRenderMs:0,simulationBackpressure:0,quality:'balanced'};
addEventListener('keydown',e=>{if(e.key.toLowerCase()==='f'&&e.shiftKey&&!e.repeat&&!e.ctrlKey&&!e.metaKey){window.korhalShowFPS=!window.korhalShowFPS;e.preventDefault();e.stopImmediatePropagation()}},true);
addEventListener('visibilitychange',()=>{simPrevious=performance.now();simBank=0});
(function loop(now){
 const delta=Math.max(0,Math.min(now-simPrevious,48));simPrevious=now;
 if(started&&!paused&&!over){
  // No frame debt after a dropped frame: bound catchup to at most two 16.67ms steps.
  simBank=Math.min(2*SIM_MS,simBank+delta*(typeof SPD==='number'?SPD:1));
  let steps=0;const updateStart=performance.now();
  while(simBank>=SIM_MS&&steps<2&&started&&!over&&!paused){
   if(steps>0&&performance.now()-updateStart>7)break;
   step();simBank-=SIM_MS;steps++;
  }
  if(simBank>=SIM_MS){simBank=0;simSlow++}
  // Run command affordability checks regardless of HUD change-detection.
  // One check every 8 simulation ticks (~133 ms at 1x) is enough to re-enable
  // Barracks and other actions promptly when a cargo load arrives.
  if(waveBanner.style.display!=='none'&&(!korhalWaveMarker||frame>=korhalWaveMarker.until-390))waveBanner.style.display='none';
  if(sel.length&&frame-lastAffordabilityTick>=8){
   lastAffordabilityTick=frame;
   refreshCardAffordability();
  }
  // Balanced/High: paint on EVERY display RAF. Never apply an additional
  // 60 Hz comparison to slightly early frames (which caused 37–51 FPS).
  // Low alone uses a 30-FPS deadline. Simulation stays fixed at 60Hz.
  const shouldPaint=window.FXQ!==0||now-lastPaint>=1000/30-0.7;
  if(shouldPaint){
   const t=performance.now();
   if(steps>0||frame===0)fog();draw();lastPaint=now;lastCost=performance.now()-t;
   fpsSamples++;
  }
 }else{simBank=0;lastPaint=0}
 if(now-fpsWindow>=650){fpsLive=Math.round(fpsSamples*1000/(now-fpsWindow));fpsSamples=0;fpsWindow=now;fpsDisplayDirty=true}
 const fpsVisible=!!(window.korhalShowFPS&&started&&!over);
 if(fpsWasVisible!==fpsVisible){fpsElement.style.display=fpsVisible?'block':'none';fpsWasVisible=fpsVisible;fpsDisplayDirty=true}
 if(fpsVisible&&fpsDisplayDirty){fpsElement.textContent=fpsLive+' FPS · '+lastCost.toFixed(1)+' ms · '+['LOW','BAL','HIGH'][window.FXQ];fpsDisplayDirty=false}
 performanceState.fps=fpsLive;performanceState.lastRenderMs=lastCost;performanceState.simulationBackpressure=simSlow;performanceState.quality=window.KORHAL_QUALITY;
 requestAnimationFrame(loop);
})(performance.now());
