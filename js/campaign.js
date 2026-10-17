/* SECTOR KORHAL v12 — split module: campaign + holistic Zerg economy */
window.Korhal=window.Korhal||{};
window.Korhal.modules=window.Korhal.modules||{};
window.Korhal.modules.campaign=window.Korhal.modules.campaign||{};

/* Late soundtrack and swarm-render integration retain their original order before campaign initialization. */

(() => {
'use strict';
// All audio is synthesized locally in Web Audio. No network, audio files, or external dependencies.
const TRACK_NAMES=['Dust & Iron','Siege Protocol','Phantom Signal','Redline Convoy','No Man’s Orbit','Dead Stars'];
const SCORES=[
 {bpm:70,mode:0,root:[37,40,42,35,37,33,35,40],ch:[
 [49,56,61,64],[52,56,59,64],[54,57,61,66],[47,54,59,62],
 [49,56,61,64],[45,52,57,61],[47,54,59,62],[52,56,59,64]],
 mel:[[[0,68,6],[8,71,4],[12,73,4]],[[0,76,8],[8,73,4],[12,71,4]],[[0,69,4],[4,73,6],[12,68,4]],[[0,66,8],[8,71,8]],[[0,73,6],[8,76,4],[12,78,4]],[[0,76,8],[8,73,8]],[[0,71,6],[6,69,2],[8,66,8]],[[0,68,4],[4,71,4],[8,73,8]]]},
 {bpm:105,mode:1,root:[45,41,43,40,45,48,43,40],ch:[
 [57,60,64,69],[53,57,60,65],[55,59,62,67],[52,55,59,64],
 [57,60,64,69],[60,64,67,72],[55,59,62,67],[52,55,59,64]],
 mel:[[[0,69,2],[2,72,2],[4,76,4],[10,72,2],[12,69,4]],[[0,72,4],[6,69,2],[8,65,6]],[[0,67,2],[2,71,2],[4,74,4],[8,79,4],[12,76,4]],[[0,76,8],[8,71,4],[12,67,4]],[[0,81,4],[4,79,2],[6,76,2],[8,72,8]],[[0,76,6],[6,79,2],[8,84,8]],[[0,79,4],[4,76,4],[8,74,8]],[[0,76,4],[4,72,4],[8,69,8]]]},
 {bpm:94,mode:2,root:[43,39,46,41,43,39,36,41],ch:[
 [55,58,62,67],[51,55,58,63],[58,62,65,70],[53,57,60,65],
 [55,58,62,67],[51,55,58,63],[48,55,60,63],[53,57,60,65]],
 mel:[[[0,67,4],[4,70,2],[6,72,2],[8,74,8]],[[0,75,6],[6,74,2],[8,70,8]],[[0,77,4],[4,74,4],[8,70,8]],[[0,72,6],[6,70,2],[8,69,8]],[[0,79,6],[6,77,2],[8,74,8]],[[0,75,8],[8,79,8]],[[0,72,4],[4,75,4],[8,79,4],[12,75,4]],[[0,77,4],[4,74,4],[8,67,8]]]},
 {bpm:82,mode:3,root:[35,38,40,33,35,43,38,33],ch:[
 [47,50,54,59],[50,54,57,62],[52,55,59,64],[45,52,57,60],
 [47,50,54,59],[55,59,62,67],[50,54,57,62],[45,52,57,60]],
 mel:[[[0,74,8],[8,69,8]],[[0,71,4],[4,74,4],[8,78,8]],[[0,76,6],[6,71,2],[8,67,8]],[[0,72,8],[8,76,8]],[[0,78,4],[4,74,4],[8,71,8]],[[0,79,8],[8,83,8]],[[0,81,6],[6,78,2],[8,74,8]],[[0,72,4],[4,69,4],[8,66,8]]]},
];
const trackLabel=document.createElement('button');trackLabel.id='sound-track';trackLabel.type='button';trackLabel.title='Next original soundtrack track (J)';
trackLabel.setAttribute('aria-label','Play next soundtrack track');trackLabel.innerHTML='<span class="sound-icon">♫</span><span id="song-label"></span><span class="sound-skip"> ↻ J</span>';
const css=document.createElement('style');css.textContent=`
 #sound-track{display:flex;align-items:center;gap:7px;border:1px solid #30657c;border-radius:4px;background:linear-gradient(#142f40,#071421);padding:6px 10px;color:#9ee9f6;cursor:pointer;font:700 12px Rajdhani,Segoe UI,sans-serif;letter-spacing:.08em;white-space:nowrap;max-width:240px;min-height:34px}
 #sound-track:hover{border-color:#79d9f6;background:#204453;color:#fff}
 #sound-track .sound-icon{color:#79f2b8;font-size:17px}
 #sound-track .sound-skip{font-size:10px;color:#86acbf}
 #song-label{overflow:hidden;text-overflow:ellipsis}
 @media(max-width:990px){#sound-track{max-width:100px}#sound-track .sound-skip{display:none}}
 `;document.head.appendChild(css);
// The older tracks keep their arrangements and mix; four new full 8-bar arrangements extend the playlist.
let trackButtonParent=$('top').querySelector('.mn')||$('top');trackButtonParent.appendChild(trackLabel);
const trackTitle=()=>{$('song-label').textContent=TRACK_NAMES[theme]||TRACK_NAMES[0]};
let lastTitle=-1;
const chooseTrack=(n,notify=true)=>{theme=(n+TRACK_NAMES.length)%TRACK_NAMES.length;stp=0;nxt=AC?AC.currentTime+.07:0;lastTitle=theme;trackTitle();if(notify&&started)say('♫ NOW PLAYING · '+TRACK_NAMES[theme])};
trackLabel.onclick=()=>{try{au();if(AC.state==='suspended')AC.resume();chooseTrack(theme+1)}catch(err){console.warn('Audio start:',err)}};
addEventListener('keydown',e=>{if(e.repeat||e.ctrlKey||e.metaKey||e.altKey)return;if(e.key.toLowerCase()==='j'&&started&&!over){e.preventDefault();chooseTrack(theme+1)}},true);
addEventListener('korhal:reset',()=>{lastTitle=-1});
const melody=(cfg,bar,i,t,sp,I)=>{
 for(const [n,k,len] of cfg.mel[bar])if(n===i){
  const length=sp*len;
  if(cfg.mode===0){sld(k,length,t,I,-2,.055+I*.018);if(I>0&&len>=6)bel(k-12,t,.018)}
  else if(cfg.mode===1){lds(k,length*.85,t,I,-1);if(I===0&&len>=4)bel(k+12,t,.02)}
  else if(cfg.mode===2){sld(k,length*.95,t,I,-1,.08+I*.025);if(I>0)plk(k-12,t,.06,GD,1)}
  else{bel(k,t,.042+I*.01);if(I>0)sld(k,length*.68,t,I,-2,.06+I*.025)}
 }
};
function playExtra(){if(!AC)return;mix();if(mute||paused)return;const cfg=SCORES[theme-2],I=inten,sp=60/(cfg.bpm+I*6)/4,L=sp*16;
 while(nxt<AC.currentTime+.32){if(nxt<AC.currentTime)nxt=AC.currentTime+.045;
  const t=nxt,s=stp&127,bar=s>>4,i=s&15,root=cfg.root[bar],notes=cfg.ch[bar],m=cfg.mode;
  if(i===0){notes.forEach((a,j)=>pdl(a,L+.5,t,(m===0?.021:.022)*(j===0?1.4:.9),m===2?750:470+I*240));if(m===0||m===3)bsl(root,L*.8,t,m===0?.12:.17,200+I*65)}
  // Four separate rhythmic identities: ambient arpeggio, tense synth, rock convoy, orbital bells.
  if(m===0){if(i%2===0)plk(notes[[0,1,2,3,2,1,3,1][i>>1]]+12,t,.12+I*.02,GC,0);if(i===8)bel(notes[3]+12,t,.04);if(I&&i%4===0)bsl(root,sp*3,t,.11,270)}
  if(m===1){if(i%2===0)stb(root+(i%8===6?19:12),sp*1.5,t,.095+I*.03,400+I*190);if(i%4===0)bsl(root,sp*2.8,t,.18,450);if(I&&i%2===1)plk(notes[(i>>2)%4]+12,t,.11,GD,1)}
  if(m===2){if(i%2===0)bsl(root,sp*(I?2:3),t,.2,340);if([0,2,3,6,8,10,11,14].includes(i))plk(root+(i%8===6?19:12),t,I?.2:.12,GD,1);if(i%4===2)plk(notes[(i>>2)%4]+12,t,.1,GC,1)}
  if(m===3){if(i%4===0)bel(notes[(i>>2)%4]+12,t,.05+I*.01);if(i%2===0){stb(root+12,sp*.95,t,.07,380);plk(notes[(i>>1)%4]+24,t,.065,GC,1)}if(I&&i%4===2)bsl(root,sp*2.2,t,.1,280)}
  melody(cfg,bar,i,t,sp,I);
  const kick=m===0?I?[0,8]:[0]:m===1?[0,3,8,11]:m===2?[0,4,6,8,12,14]:I?[0,6,8,14]:[0,8];
  if(kick.includes(i))kck(t,m===2?.42:.35+I*.04);
  const snare=m===0?[8]:m===3?[4,12]:[4,12];if(snare.includes(i)&&(I||m!==0))snr(t,.11+I*.07);
  if(m===1||m===2||I>0){if(i%2===0||I===2)nzb(t,.05,m===2?.048:.036,'highpass',6800)}
  nxt+=sp;stp++;
 }
}
window.korhalMus=()=>{
 if(theme<0||theme>=TRACK_NAMES.length)theme=0;
 if(lastTitle!==theme){lastTitle=theme;trackTitle()}
 if(theme<2)(theme===0?musA:musB)();else playExtra();
 // Each procedural score gets eight complete 8-bar passes (roughly 3–4 minutes); J still skips immediately.
 if(stp>=1024){chooseTrack(theme+1,false)}
};
trackTitle();window.korhalTrackRefresh=()=>{lastTitle=theme;trackTitle()};
// Species/vehicle-specific death sounds. Each unit type has an individual timbral signature.
// Destruction is modestly throttled by the normal game audio gate to avoid clipping in large battles.
function cry(f,to,d=.33,v=.07){tn(f,d,'sawtooth',v,to-f);tn(f*.51,d*.85,'triangle',v*.6,(to-f)*.45);nxs(Math.min(.35,d),.07,900,'bandpass',.025,350)}
function metal(f,d=.28,v=.09){nxs(d,.11,2100,'bandpass',0,400);tn(f,d,'square',v,-f*.7);nxs(.11,.11,6300,'highpass',.04)}
function wet(f,to,d=.28){cry(f,to,d,.048);nxs(d*.75,.09,520,'lowpass',.02,210)}
Object.assign(S,{
 die_scv:()=>{metal(420,.21,.045);tn(780,.15,'triangle',.03,-580)},
 die_marine:()=>{cry(195,85,.27,.07);nxs(.12,.06,2700,'bandpass',.11)},
 die_firebat:()=>{cry(150,63,.39,.085);nxs(.38,.08,1600,'lowpass');tn(590,.3,'sawtooth',.025,-430)},
 die_medic:()=>{cry(330,125,.33,.06);tn(720,.13,'sine',.04,-360,.07)},
 die_vulture:()=>{metal(380,.28,.10);tn(85,.35,'sawtooth',.065,-50)},
 die_tank:()=>{metal(160,.52,.16);tn(65,.58,'sine',.16,-40)},
 die_wraith:()=>{metal(950,.42,.07);tn(600,.48,'sawtooth',.055,-540)},
 die_goliath:()=>{metal(280,.44,.12);tn(115,.34,'square',.08,-75)},
 die_bc:()=>{metal(115,.8,.13);tn(62,.9,'sine',.2,-42);nxs(.7,.09,330,'lowpass')},
 die_zergling:()=>wet(480,135,.24),
 die_hydra:()=>{wet(325,67,.4);tn(390,.16,'triangle',.03,-320)},
 die_muta:()=>{cry(740,160,.52,.055);nxs(.2,.06,3800,'bandpass',.1,900)},
 die_ultra:()=>{wet(145,37,.72);tn(57,.65,'sawtooth',.11,-30)},
 die_brood:()=>wet(620,210,.16),
 die_lurker:()=>{wet(255,45,.48);nxs(.22,.07,1000,'bandpass',.12,180)}
});
// Enemy creature renderer: hand-drawn layered chitin, shaded volumes, claws, glowing organs, distinct silhouettes.
const ZKINDS={zergling:1,hydra:1,muta:1,ultra:1,brood:1,lurker:1};
const pal={dark:'#241a27',line:'#160d20',flesh:'#713b60',shell:'#9a5577',bone:'#ebd4a4',green:'#8ebf49',coral:'#d87872'};
function pathShape(a,c,stroke='#201326'){
 ctx.beginPath();ctx.moveTo(a[0],a[1]);for(let i=2;i<a.length;i+=2)ctx.lineTo(a[i],a[i+1]);ctx.closePath();ctx.fillStyle=c;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.25;ctx.stroke()}}
function bulb(x,y,w,h,c,shine='#ce9aaf'){
 const g=ctx.createRadialGradient(x-w*.32,y-h*.42,1,x,y,w*1.4);g.addColorStop(0,shine);g.addColorStop(.36,c);g.addColorStop(1,'#241322');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,w,h,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#25151f';ctx.lineWidth=1.35;ctx.stroke()}
function curve(points,width,col,outline='#24141f'){
 ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(points[0],points[1]);for(let i=2;i<points.length;i+=2)ctx.lineTo(points[i],points[i+1]);ctx.strokeStyle=outline;ctx.lineWidth=width+2.2;ctx.stroke();ctx.strokeStyle=col;ctx.lineWidth=width;ctx.stroke();ctx.lineCap='butt'}
function bone(points){pathShape(points,'#e9dab4','#756052');pathShape([points[0],points[1],points[2],points[3],points[4],points[5]],'rgba(255,255,255,.18)',null)}
function eye(x,y,r=1.5,c='#dfff6e'){ctx.shadowColor=c;ctx.shadowBlur=5;ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0}
function segment(x,y,w,h,col,shine){bulb(x,y,w,h,col,shine);ctx.strokeStyle='rgba(23,12,30,.55)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+w*.12,y-h*.8);ctx.quadraticCurveTo(x+w*.4,y,x+w*.12,y+h*.8);ctx.stroke()}
function zergling(u,ph){
 // Eight moving hooks create a low, fast insectoid silhouette.
 for(let s of [-1,1])for(let i=0;i<3;i++){let x=-8+i*6,w=Math.sin(ph*1.5+i*1.7+(s>0?Math.PI:0))*3;
  curve([x,s*5,x-4+w,s*(10+i%2*2),x-9+w,s*14],2.9,'#7b4b48');bone([x-8+w,s*14,x-14+w,s*(15+i%2*3),x-10+w,s*10]);}
 curve([-8,0,-16,Math.sin(ph)*2,-22,Math.sin(ph)*3],3,'#794b6d');
 bulb(-5,0,10,7,'#6f3049','#b66d71');
 for(let i=0;i<3;i++){const x=-10+i*6;pathShape([x,-6,x+4,0,x,-1,x-3,-2],'#ac6270','#4b2437')}
 segment(5,0,6.5,6,'#87425d','#c2838f');
 for(let s of [-1,1]){bone([8,s*3,19,s*10,13,s*1]);curve([6,s*3,12,s*5,15,s*7],1.5,'#b57c78');eye(9,s*2.9,1.4,'#fcdd6e')}
 pathShape([8,-3,16,0,8,3],'#452b35');
}
function brood(u,ph){
 for(const s of [-1,1])for(let i=0;i<2;i++){const x=-4+i*5,q=Math.sin(ph*1.9+i+s)*2;
  curve([x,s*3,x-2+q,s*8,x-8+q,s*10],1.7,'#9c694a');}
 curve([-5,0,-12,Math.sin(ph)*2,-16,1],1.8,'#815442');
 bulb(-2,0,6,4,'#8c5541','#c6a369');bulb(4,0,4,3.4,'#ac7751','#e2b476');
 for(let s of [-1,1]){bone([6,s*1,12,s*5,9,s*2]);eye(6,s*2,1,'#e9fa83')}
}
function hydra(u,ph){
 const sway=Math.sin(ph*.7)*1.6;
 curve([-15,0,-24,-4+sway,-24,8+sway,-17,12],8,'#5b394d');
 for(let i=0;i<5;i++){const x=-17+i*5;segment(x,-1,4.3,6.5,'#6b3d68','#a9828c')}
 for(let s of [-1,1]){
  // Spinal spurs and oversized serrated forearms.
  for(let i=0;i<3;i++){const x=-11+i*7;bone([x,s*6,x-2,s*(13+i*2),x+4,s*8])}
  curve([3,s*6,8,s*(12+Math.sin(ph+s)*1.6),18,s*15],5,'#6e3d69');
  pathShape([15,s*12,28,s*24,23,s*12,19,s*8],'#e9d9b6','#695c65');
  pathShape([21,s*16,26,s*21,23,s*14],'#fff3cf',null)
 }
 bulb(0,0,10,9,'#5d2c61','#a96d9d');
 for(let x=-8;x<6;x+=5)pathShape([x,-8,x+5,0,x,-1,x-3,-2],'#a65f83','#4e2049');
 segment(10,0,7,6.5,'#834f88','#bd8ab6');
 for(const s of [-1,1]){eye(14,s*3.6,1.6,'#caff75');bone([15,s*5,24,s*8,17,s*1])}
}
function muta(u,ph){
 const f=Math.sin(ph*1.2)*4.5,fr=8+f;
 // Membrane wings visibly flap, with darker rib network and hooked wing tips.
 for(const s of [-1,1]){
  pathShape([-5,s*3,-19,s*(12+fr),-12,s*(28+fr),4,s*8,9,s*3],s>0?'#3b806c':'#397766','#173a3f');
  pathShape([-7,s*5,-13,s*(22+fr),2,s*7],'#619b7b',null);
  curve([2,s*3,-9,s*(15+fr),-12,s*(28+fr)],2.2,'#9bbb84','#23453e');
  curve([0,s*3,-16,s*(11+fr),-19,s*(12+fr)],1.4,'#7eb399','#23453e');
  bone([-12,s*(28+fr),-16,s*(36+fr),-11,s*(31+fr)]);
 }
 curve([-8,0,-17,1,-24,-4,-28,-8],4,'#517c6d','#233f44');bone([-28,-8,-33,-15,-28,-11]);
 bulb(0,0,11,7,'#386c5e','#9dccac');for(let i=0;i<3;i++)pathShape([-9+i*6,-5,-5+i*6,0,-10+i*6,4],'#6faca1','#2c5b59');
 bulb(12,0,6,5,'#5e8970','#bcdb91');for(let s of [-1,1]){eye(15,s*2.8,1.6,'#f3eb82');bone([15,s*5,24,s*9,19,s*1])}
}
function ultra(u,ph){
 for(const s of [-1,1])for(let i=0;i<2;i++){const x=-12+i*22,k=Math.sin(ph+i*2+s*2)*3;
  curve([x,s*10,x+3+k,s*19,x+1+k,s*25],8,'#6d484b','#241825');
  pathShape([x-4+k,s*23,x+7+k,s*27,x+7+k,s*20],'#8d6158','#2e2020');}
 curve([-17,0,-30,0,-36,Math.sin(ph)*3],7,'#78504d');
 bulb(-2,0,23,16,'#614156','#a6797c');
 for(let i=0;i<5;i++){const x=-20+i*8;segment(x,0,6,14,'#6b455d','#a36c81')}
 pathShape([-18,-10,-10,-16,-4,-7,-10,-7],'#b88a80','#543344');
 pathShape([-18,10,-10,16,-4,7,-10,7],'#b88a80','#543344');
 bulb(18,0,11,12,'#78495b','#c78e8a');
 for(const s of [-1,1]){
  // Long curved scythe tusks define the ultralisk silhouette.
  pathShape([16,s*7,25,s*13,39,s*26,37,s*13,29,s*4,22,s*3],'#e7d8b6','#71645d');
  pathShape([29,s*10,36,s*21,34,s*12],'#fff7d8',null);
  eye(23,s*7,2.1,'#fce488');}
 for(const x of [-17,-8,1,10])pathShape([x,-13,x+4,-19,x+8,-9],'#a27777','#533445');
}
function lurker(u,ph){
 if(u.bur){
  for(let i=0;i<5;i++){const x=-16+i*8;bone([x,-2,x+3,-11-(i%2)*4,x+7,3]);}
  pathShape([-23,3,20,3,11,9,-13,9],'#6e3759','#3b1e38');
  return;
 }
 curve([-16,0,-26,Math.sin(ph)*2,-31,0],6,'#5c365a');
 bulb(-4,0,18,10,'#52274e','#995476');
 for(let i=0;i<6;i++){const x=-18+i*7;bone([x,-7,x+2,-16-(i%2)*6,x+6,-6]);segment(x,3,4,6,'#815079','#b48d99')}
 for(const s of [-1,1]){
  curve([2,s*8,14,s*16,24,s*12],5,'#7b4665');
  pathShape([18,s*11,37,s*23,31,s*6,23,s*7],'#e9d7ad','#68575e');
  eye(16,s*4,1.4,'#ffb95b');}
 segment(17,0,8,6,'#804763','#c08a91');
}
const models={zergling,hydra,muta,ultra,brood,lurker};
function renderZerg(u){
 const sy=u.y*K,air=u.air?LF+5:0,r=R(u),phase=frame*.10+u.id*.79;let moving=Math.hypot(u.x-(u._zx??u.x),u.y-(u._zy??u.y))>.3;
 u._zx=u.x;u._zy=u.y;
 // Fixed shadow remains on terrain while flying Mutalisks glide above it.
 ctx.save();ctx.fillStyle='rgba(11,4,14,.38)';ctx.beginPath();ctx.ellipse(u.x+5+(u.air?7:0),sy+4,r*(u.t==='muta'?1.65:1.4),r*K*(u.t==='muta'?1.3:1.2),0,0,7);ctx.fill();ctx.restore();
 if(sel.includes(u)){
 ctx.save();ctx.strokeStyle='#7cff92';ctx.lineWidth=1.7;ctx.shadowColor='#6cff84';ctx.shadowBlur=10;ctx.beginPath();ctx.ellipse(u.x,sy+2,r+5,(r+5)*K,0,0,Math.PI*2);ctx.stroke();ctx.restore();}
 ctx.save();ctx.translate(u.x,sy-air-(u.t==='ultra'?13:u.t==='hydra'?12:u.t==='lurker'?10:u.t==='muta'?8:5));
 ctx.scale(1,K+.18);ctx.rotate(u.ang||0);
 if(u.t==='ultra')ctx.scale(1.05,1.05);if(u.t==='brood')ctx.scale(.85,.85);
 // Each creature moves with distinct frequencies and avoids the old flat rectangular shapes.
 models[u.t](u,phase+(moving?frame*.09:frame*.016));
 ctx.restore();
 if(u.hp<u.maxHp||sel.includes(u))bar(u.x,sy-air-(u.t==='ultra'?40:u.t==='muta'?39:30),r*2.25,u.hp/u.maxHp);
}
const priorDrawUnit=drawU;
drawU=function(u){
 if(!ZKINDS[u.t]||u.team!==2)return priorDrawUnit(u);
 if(u.hp<=0)return;
 if(u.cl){if(!vis(u.x,u.y))return;if(!detd(u)){
  ctx.save();ctx.strokeStyle='rgba(179,247,223,.28)';ctx.lineWidth=1.3;ctx.beginPath();ctx.ellipse(u.x,u.y*K-4,R(u)+3,(R(u)+3)*K,0,0,Math.PI*2);ctx.stroke();ctx.restore();return;
 }ctx.save();ctx.globalAlpha=.76;renderZerg(u);ctx.restore();return}
 if(!seen(u))return;renderZerg(u);
};
try{hpEl.querySelector('.g')?.insertAdjacentHTML('beforeend','<div><h4>SOUNDTRACK</h4>Six original procedural tracks rotate during the mission. Use <b>J</b> to skip to the next song, or press the music button in the top bar.<br><b>N</b> toggles music and sound. Camera shake is disabled, including siege-tank impacts.</div>')}catch(err){}
})();

;


/*
 * Geometry-rendered Swarm: actual XYZ vertices, polygon surfaces, lighting,
 * 3D yaw, articulated legs and flapping wings. No image sprites or CDN.
 * The existing 2D isometric battlefield is retained; polygonal 3D creatures
 * are projected into its camera for precise game-space hit testing.
 */
(()=>{
const MESH_TYPES={zergling:1,hydra:1,muta:1,ultra:1,brood:1,lurker:1};
const P={
  skin:'#703c57', skinHi:'#b87585', chitin:'#583650', plate:'#97647e', ridge:'#d6a6a8',
  shadow:'#241b2b', bone:'#e9dfbf', tip:'#fff2d4', eye:'#eaff5e',
  moss:'#477e69', jade:'#7ebe9d', membrane:'#366d65', vein:'#9ed0ac',
  ultra:'#65505e', ultraHi:'#aa8589', brood:'#97764f', broodHi:'#d5b07a',
  lurk:'#69435d', lurkHi:'#ac698d'
};
let meshLOD=0,swarmOnscreen=0;
const caches={},rgbCache=new Map(),shadeCache=new Map();
const PI=Math.PI;
const md=()=>[];
const v=(x,y,z)=>[x,y,z];
const put=(mesh,a,b,c,col)=>mesh.push([a,b,c,col]);
const q=(m,a,b,c,d,col)=>m.push([a,b,c,d,col]);
const ell=(m,cx,cy,cz,rx,ry,rz,col,segs=8,rings=3)=>{
  if(meshLOD){segs=Math.min(6,segs);rings=Math.min(2,rings)}
  for(let j=0;j<rings;j++){
    const a=-PI/2+j*PI/rings,b=-PI/2+(j+1)*PI/rings;
    for(let i=0;i<segs;i++){
      const u=i*PI*2/segs,w=(i+1)*PI*2/segs;
      const at=(az,el)=>v(cx+rx*Math.cos(el)*Math.cos(az),cy+ry*Math.cos(el)*Math.sin(az),cz+rz*Math.sin(el));
      q(m,at(u,a),at(w,a),at(w,b),at(u,b),col);
    }
  }
};
const seg=(m,a,b,r1,r2,col,sides=5)=>{
  if(meshLOD)sides=3;
  const d=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],ln=Math.hypot(...d)||1,
    vec=d.map(n=>n/ln),arb=Math.abs(vec[2])<.85?[0,0,1]:[0,1,0];
  let t=[vec[1]*arb[2]-vec[2]*arb[1],vec[2]*arb[0]-vec[0]*arb[2],vec[0]*arb[1]-vec[1]*arb[0]];
  const l=Math.hypot(...t)||1;t=t.map(n=>n/l);
  const n=[vec[1]*t[2]-vec[2]*t[1],vec[2]*t[0]-vec[0]*t[2],vec[0]*t[1]-vec[1]*t[0]];
  const at=(c,r,ang)=>v(c[0]+r*(t[0]*Math.cos(ang)+n[0]*Math.sin(ang)),c[1]+r*(t[1]*Math.cos(ang)+n[1]*Math.sin(ang)),c[2]+r*(t[2]*Math.cos(ang)+n[2]*Math.sin(ang)));
  for(let i=0;i<sides;i++){const a0=i*PI*2/sides,a1=(i+1)*PI*2/sides;
    q(m,at(a,r1,a0),at(a,r1,a1),at(b,r2,a1),at(b,r2,a0),col);
  }
};
const chain=(m,pts,r,col,endCol)=>{
  for(let i=0;i<pts.length-1;i++)seg(m,pts[i],pts[i+1],r*(1-i/(pts.length-1))+.28,r*(1-(i+1)/(pts.length-1))+.08,i>=pts.length-2&&endCol?endCol:col,5)
};
const plate=(m,x,y,z,rx,ry,rz,c)=>ell(m,x,y,z,rx,ry,rz,c,7,3);
const back=(m,positions,c)=>positions.forEach(([x,y,z,r])=>ell(m,x,y,z,r,r*.8,r*.68,c,7,3));
const eyes=(m,x,y,z,span=3)=>{
 for(let s of [-1,1]){ell(m,x,s*span,z,1.8,1.1,1.4,P.shadow,7,3);
 ell(m,x+.45,s*(span+.6),z+.3,1.2,.6,.9,P.eye,7,3)}
};
const build=(t)=>{
 const m=md();
 if(t==='zergling'){
  ell(m,-6,0,7,9,5.5,5.5,P.skin);
  ell(m,4,0,9,7,6,6,P.chitin);
  ell(m,10,0,10.5,5,4.9,4.3,P.skinHi);
  for(let i=0;i<4;i++)plate(m,-13+i*6,0,11.8+Math.sin(i)*.7,3.6,5,2.2,i%2?P.plate:P.chitin);
  for(let s of [-1,1]){
   chain(m,[[8,s*4,12],[13,s*6,13],[20,s*9,16],[24,s*9,21]],2.1,P.bone,P.tip);
   chain(m,[[-12,s*3,7],[-19,s*4,7],[-26,s*3,4]],1.6,P.chitin,P.ridge);
  }
  eyes(m,12,0,12.5,4.6);
 }else if(t==='hydra'){
  ell(m,-9,0,10,12,6,8,P.skin);
  chain(m,[[-16,0,11],[-26,0,8],[-35,0,4],[-39,0,3]],4,P.chitin,P.skinHi);
  ell(m,-1,0,16,9.7,7.7,11,P.chitin);
  ell(m,7,0,24,7,7,9,P.plate);
  ell(m,14,0,27,6,5.4,5,P.skinHi);
  back(m,[[-13,0,17,3.7],[-6,0,23,4.4],[1,0,29,4.3]],P.plate);
  for(let i=0;i<5;i++)chain(m,[[-15+i*6,0,19+i*2],[-14+i*6,0,26+i*2],[-12+i*6,0,29+i*2]],2.4,P.ridge,P.bone);
  for(let s of [-1,1]){
    chain(m,[[3,s*6,22],[8,s*11,16],[15,s*12,11],[25,s*15,18]],4,P.chitin,P.plate);
    chain(m,[[15,s*12,11],[25,s*15,19],[29,s*16,23]],3.2,P.bone,P.tip);
    chain(m,[[11,s*5,28],[20,s*7,29],[26,s*6,32]],2.3,P.bone,P.tip);
  }
  eyes(m,15,0,28.4,5);
 }else if(t==='muta'){
  ell(m,-3,0,10,13,5.2,4.8,P.moss);
  ell(m,9,0,10.5,7,4.2,3.9,P.jade);
  for(let x=-11;x<9;x+=6)plate(m,x,0,14,3.8,3.6,1.1,P.vein);
  chain(m,[[-13,0,10],[-20,0,7],[-28,0,7],[-36,0,10]],3.3,P.moss,P.jade);
  chain(m,[[-35,0,10],[-40,0,15],[-42,0,18]],2,P.bone,P.tip);
  eyes(m,12,0,12.5,3.1);
  for(let s of [-1,1])chain(m,[[12,s*3,10],[19,s*4,12],[24,s*5,16]],1.8,P.bone,P.tip);
 }else if(t==='ultra'){
  ell(m,-5,0,17,22,13.5,14,P.ultra);
  ell(m,12,0,20,15,12,13,P.chitin);
  ell(m,23,0,16,11,9,10,P.ultraHi);
  for(let i=0;i<5;i++)plate(m,-21+i*9,0,30+Math.sin(i*.8)*2,6,12,3,i%2?P.plate:P.ridge);
  for(let s of [-1,1]){
   chain(m,[[20,s*7,18],[30,s*12,23],[37,s*15,32],[41,s*17,44],[39,s*18,52]],5.2,P.bone,P.tip);
   chain(m,[[18,s*8,9],[25,s*10,6],[31,s*11,8]],3.8,P.chitin,P.ridge);
  }
  eyes(m,28,0,18.5,8.2);
 }else if(t==='brood'){
  ell(m,-3,0,5,7,4.6,4,P.brood);
  ell(m,4,0,5.5,4.3,4,3.2,P.broodHi);
  plate(m,-7,0,8.1,3.4,3.8,1.1,P.plate);
  chain(m,[[-9,0,5],[-14,0,4],[-18,0,6]],1.5,P.skin);
  for(let s of [-1,1])chain(m,[[4,s*3,6],[9,s*4,7],[14,s*4,11]],1.3,P.bone,P.tip);
  eyes(m,7,0,7,3);
 }else if(t==='lurker'){
  ell(m,-6,0,9,17,10,7,P.lurk);
  ell(m,10,0,10,9,8,6,P.chitin);
  for(let i=0;i<6;i++)plate(m,-18+i*7,0,15+Math.sin(i)*.9,4.5,8.2,2.4,i%2?P.lurkHi:P.plate);
  for(let i=0;i<5;i++)for(let s of [-1,1])chain(m,[[-19+i*8,s*7,15],[-18+i*8,s*10,22+i*.8],[-15+i*8,s*10,27+i*.5]],3,P.bone,P.tip);
  chain(m,[[-18,0,8],[-29,0,5],[-38,0,6]],4,P.lurk,P.lurkHi);
  for(let s of [-1,1])chain(m,[[11,s*6,12],[20,s*8,14],[28,s*8,19]],3,P.bone,P.tip);
  eyes(m,13,0,12,7);
 }
 return m;
};
const beastScale={zergling:.74,hydra:.81,muta:.82,ultra:.96,brood:.73,lurker:.84};
const moveLegs=(m,t,phase,active)=>{
 if(t==='muta'){
  for(let s of [-1,1]){
   const flap=Math.sin(phase*1.25+s*.15)*(active?8:6),r0=[-6,s*3,11],r1=[-14,s*14,16+flap*.4],r2=[-12,s*25,20+flap],tip=[-19,s*36,20+flap*1.35];
   // Triangular wing surfaces: proper vertices in XYZ and lighting on each face.
   put(m,r0,r1,r2,[P.membrane,P.moss][s>0?1:0]);put(m,r0,r2,tip,P.membrane);
   put(m,r0,tip,[-5,s*13,11+flap*.45],P.jade);
   chain(m,[r0,r1,r2,tip],1.4,P.vein,P.bone);
   chain(m,[r0,[-6,s*17,12+flap*.6],tip],.8,P.moss,P.bone);
  }
  return;
 }
 const legs=t==='ultra'?4:t==='brood'?4:t==='zergling'?6:t==='hydra'?4:6;
 for(let s of [-1,1])for(let i=0;i<legs/2;i++){
  const xi=t==='ultra'?-15+i*27:t==='hydra'?-14+i*10:t==='brood'?-7+i*9:-12+i*9;
  const ry=t==='ultra'?12:t==='hydra'?6:t==='brood'?4:5.4;
  const j=(active?1:.17)*Math.sin(phase*1.32+i*PI*.88+(s>0?PI:0));
  const fore=(t==='ultra'?5:2.7),rad=t==='ultra'?5:t==='hydra'?3:t==='brood'?1.5:2.1;
  const h=t==='ultra'?19:t==='hydra'?13:t==='brood'?5.5:8;
  const footZ=t==='ultra'?1.7:.9;
  const a=[xi,s*ry,h],b=[xi+fore+j*3,s*(ry+(t==='ultra'?8:5)),h*.52+(active?Math.abs(j):0)],c=[xi+fore+j*5,s*(ry+(t==='ultra'?17:10)),footZ+Math.max(0,j)*1.1];
  chain(m,[a,b,c],rad,t==='ultra'?P.ultra:P.chitin,P.skinHi);
  chain(m,[c,[c[0]+(t==='ultra'?8:4),c[1]+s*2,footZ]],rad*.68,P.bone,P.tip);
 }
};
function getColor(c,shade){const bin=Math.max(0,Math.min(15,Math.round(shade*10))),key=c+'|'+bin;
 let out=shadeCache.get(key);if(out)return out;
 let a=rgbCache.get(c);if(!a){const h=c.slice(1);a=[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];rgbCache.set(c,a)}
 const gain=bin/10;out=`rgb(${a.map(x=>Math.max(0,Math.min(255,Math.round(x*gain)))).join(',')})`;
 shadeCache.set(key,out);return out;
}
function project(m,u,phase,moving){
 const c=Math.cos(u.ang||0),s=Math.sin(u.ang||0),size=beastScale[u.t];
 const bob=(moving?1:.26)*Math.sin(phase*.95)*(u.t==='ultra'?1.1:.75);
 const lift=u.air?LF+8+Math.sin(phase*.6)*1.2:0;
 const originX=u.x,originY=u.y*K;
 const low=u.t==='lurker'&&u.bur;
 const p0=(a)=>{
  const x=a[0]*size,y=a[1]*size,z=a[2]*size;
  const yrot=x*s+y*c;
  return [originX+(x*c-y*s),originY+K*yrot-(low?z*.26:z)-bob-lift,yrot*.79+z*.62];
 };
 const rot=(a)=>[a[0]*c-a[1]*s,a[0]*s+a[1]*c,a[2]];
 const out=[];
 for(const tri of m){const a=tri[0],b=tri[1],d=tri[2];
  const A=p0(a),B=p0(b),C=p0(d),D=tri.length===5?p0(tri[3]):null;
  const w=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],z=[d[0]-a[0],d[1]-a[1],d[2]-a[2]],
   norm=rot([w[1]*z[2]-w[2]*z[1],w[2]*z[0]-w[0]*z[2],w[0]*z[1]-w[1]*z[0]]);
  const n=Math.hypot(...norm)||1;
  const light=Math.abs((norm[0]*-.38+norm[1]*-.48+norm[2]*.79)/n);
  const sh=.39+light*.73;
  out.push({a:A,b:B,c:C,d:D,depth:(A[2]+B[2]+C[2]+(D?D[2]:0))/(D?4:3),color:getColor(tri[tri.length-1],sh)});
 }
 out.sort((a,b)=>a.depth-b.depth);
 return out;
}
// v16: cached views of the same polygon-based Zerg models for Balanced/Low.
// High continues to use the original animated mesh and lighting path.
const spriteModels=new Map();
function meshSprite(t,dir,lod){
 const key=t+':'+dir+':'+lod;let sprite=spriteModels.get(key);if(sprite)return sprite;
 if(spriteModels.size>130)spriteModels.clear();
 const w=170,h=176,c=document.createElement('canvas');c.width=w;c.height=h;
 const g=c.getContext('2d');const v={t,x:w/2,y:(h-40)/K,air:T[t].air,ang:dir*Math.PI/4,id:0};
 if(!caches[t+':'+lod]){meshLOD=lod;caches[t+':'+lod]=build(t);meshLOD=0}
 const m=caches[t+':'+lod].slice();moveLegs(m,t,0,false);
 for(const f of project(m,v,0,false)){
  g.fillStyle=f.color;g.beginPath();g.moveTo(f.a[0],f.a[1]);g.lineTo(f.b[0],f.b[1]);g.lineTo(f.c[0],f.c[1]);if(f.d)g.lineTo(f.d[0],f.d[1]);g.closePath();g.fill();
 }
 spriteModels.set(key,c);return c;
}
let frameMs=0,meshCount=0;
const oldUnit=drawU;
drawU=function(u){
 if(!MESH_TYPES[u.t]||u.team!==2)return oldUnit(u);
 if(u.hp<=0)return;
 // Don't allocate hundreds of triangles for creatures far beyond the viewport.
 const cx=u.x-cam.x,cy=u.y*K-cam.y;
 if(cx<-95||cx>cv.width+95||cy<-105||cy>cv.height+95)return;
 if(u.cl&&(!vis(u.x,u.y)))return;
 if(u.cl&&!detd(u)){
  ctx.save();ctx.strokeStyle='rgba(175,246,228,.32)';ctx.lineWidth=1.4;
  ctx.beginPath();ctx.ellipse(u.x,u.y*K-3,R(u)+3,(R(u)+3)*K,0,0,2*PI);ctx.stroke();ctx.restore();return;
 }
 if(!seen(u))return;
 const lod=swarmOnscreen>18?1:0,cacheKey=u.t+':'+lod;
 if(!caches[cacheKey]){meshLOD=lod;caches[cacheKey]=build(u.t);meshLOD=0;}
 if(window.FXQ!==2){
  const dir=(Math.round((u.ang||0)*4/Math.PI)+8)%8;
  const im=meshSprite(u.t,dir,1),yy=u.y*K;
  ctx.save();if(u.cl)ctx.globalAlpha=.76;
  ctx.drawImage(im,u.x-85,yy-136);
  ctx.restore();
  if(u.hp<u.maxHp||sel.includes(u))bar(u.x,yy-39-(u.air?LF:0),R(u)*2.3,u.hp/u.maxHp);
  return;
 }
 const ph=frame*.09+u.id*.63,dist=Math.hypot(u.x-(u._meshX??u.x),u.y-(u._meshY??u.y));
 u._meshX=u.x;u._meshY=u.y;
 const moving=dist>.3,ground=u.y*K,r=R(u);
 ctx.save();ctx.fillStyle='rgba(7,4,14,.39)';ctx.beginPath();
 ctx.ellipse(u.x+4,ground+4,r*(u.air?1.6:1.4),r*K*1.18,0,0,2*PI);ctx.fill();
 if(sel.includes(u)){
  ctx.save();ctx.strokeStyle='#72ff9b';ctx.lineWidth=1.9;ctx.shadowColor='#5aff99';ctx.shadowBlur=window.FXQ===2?9:0;
  ctx.beginPath();ctx.ellipse(u.x,ground+2,r+5,(r+5)*K,0,0,2*PI);ctx.stroke();ctx.restore();
 }
 meshLOD=lod;const m=caches[cacheKey].slice();if(!(u.t==='lurker'&&u.bur))moveLegs(m,u.t,ph,moving);meshLOD=0;
 const tris=project(m,u,ph,moving);
 if(u.cl)ctx.globalAlpha=.76;
 for(const f of tris){ctx.fillStyle=f.color;ctx.beginPath();ctx.moveTo(f.a[0],f.a[1]);ctx.lineTo(f.b[0],f.b[1]);ctx.lineTo(f.c[0],f.c[1]);if(f.d)ctx.lineTo(f.d[0],f.d[1]);ctx.closePath();ctx.fill()}
 ctx.restore();
 if(u.hp<u.maxHp||sel.includes(u))bar(u.x,ground-(u.t==='ultra'?65:u.t==='hydra'?49:u.t==='muta'?51:36)*(beastScale[u.t]||1)-(u.air?LF+8:0),r*2.3,u.hp/u.maxHp);
};
const previousDraw3D=draw;draw=function(){swarmOnscreen=U.reduce((n,u)=>n+(u.team===2&&MESH_TYPES[u.t]&&u.x>cam.x-90&&u.x<cam.x+cv.width+90&&u.y*K>cam.y-90&&u.y*K<cam.y+cv.height+90?1:0),0);previousDraw3D()};
try{
 const brief=$('op');if(brief&&/Mine, build/.test(brief.textContent))brief.textContent+=' Mineral extraction now takes longer per load; expand your workforce carefully.';
 const target=typeof hpEl!=='undefined'?hpEl:document.getElementById('hp');
 target?.querySelector('.g')?.insertAdjacentHTML('beforeend','<div><h4>3D SWARM & ECONOMY</h4>Zerg creatures are rendered from rotating, lit 3D polygon meshes with animated limbs and wings (no flat sprite artwork).<br>SCV mineral extraction takes <b>113 frames</b> per 8-mineral cargo, rather than 71. Return travel is unchanged; actual income depends on congestion and travel distance.</div>');
}catch(err){console.warn('3D Swarm help:',err)}
window.korhalMeshStats=()=>({species:Object.keys(caches),triangles:Object.fromEntries(Object.entries(caches).map(([k,m])=>[k,m.length])),gatherFrames:113});
})();

;


/* SECTOR KORHAL — Operations / Campaign update. Runs after all existing systems. */
(()=>{
'use strict';
const $id=id=>document.getElementById(id);
const LORE='Expand your Terran base, secure the high ground and destroy every Zerg hatchery. The original skirmish experience is unchanged.';
const MISSIONS=[
 {id:0,num:'01',title:'ASHES OF DAWN',sub:'Hold the Line',map:'Verdant Ridge',mapIndex:0,mark:'DEFENSE',time:180,
  brief:'Outpost K-7 is surrounded. Reinforce the garrison, establish a mineral economy and hold your Command Center for three minutes.',
  task:'Keep your Command Center alive for 03:00',hint:'Start with a small marine garrison. Build defenses at the cliff ramp before the Zerg waves intensify.',m:350,g:75,wave:2700,interval:2550},
 {id:1,num:'02',title:'GHOST FREQUENCY',sub:'Sever the Signal',map:'Scorched Highlands',mapIndex:1,mark:'STRIKE',
  brief:'Two alien signal relays coordinate the invasion. Scout the desert highlands and destroy both relays to break their command network.',
  task:'Destroy both Brood Relay spires',hint:'The relay locations are marked on your tactical map. Defend the base while assembling a strike force.',m:450,g:100,wave:3150,interval:2700},
 {id:2,num:'03',title:'THE LAST HIVE',sub:'Purge the Brood',map:'Frozen Reach',mapIndex:3,mark:'ASSAULT',
  brief:'The invasion traces back to the ice-world hive complex. Lead a mechanized assault and eradicate every enemy hatchery.',
  task:'Destroy all Zerg Hatcheries',hint:'You begin with a mechanized task force. Disable the alien spire to delay reinforcements.',m:650,g:250,wave:2400,interval:2200}
];
const CSS=`
#ov{gap:11px;padding:24px 22px 36px;scrollbar-color:#2c678b #07111c;z-index:5}
#lg{margin-top:10px}
#ov #ot{font-size:clamp(15px,2vw,20px);margin-top:3px}
#ov #op{max-width:780px;line-height:1.45}
#ov #lg .lt{font-size:clamp(27px,5vw,57px)}
#mainHub{display:none;width:min(900px,100%);gap:14px;grid-template-columns:repeat(2,minmax(0,1fr));margin-top:6px;text-align:left}
#ov .hubTile{display:flex;flex-direction:column;gap:10px;min-height:184px;padding:24px;letter-spacing:.02em;text-align:left;cursor:pointer;color:#d8f1ff;background:linear-gradient(125deg,rgba(22,65,105,.88),rgba(4,15,30,.94));border:1px solid #366b92;border-left:4px solid #4ee9ff;clip-path:polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,0 100%);font-family:inherit;transition:border-color .17s,transform .17s,box-shadow .17s}
#ov .hubTile:hover{border-color:#a4f4ff;transform:translateY(-4px);box-shadow:0 10px 35px rgba(20,140,220,.2)}
#ov .hubTile small{font:700 12px Rajdhani,Arial,sans-serif;letter-spacing:.22em;color:#50d9ff}
#ov .hubTile strong{font:800 clamp(20px,3vw,27px) Orbitron,sans-serif;letter-spacing:.04em;color:#fff}
#ov .hubTile span{font:500 16px Rajdhani,Arial,sans-serif;letter-spacing:.02em;color:#a3c4d9;line-height:1.35}
#ov .hubTile em{font:700 13px Rajdhani,sans-serif;color:#75eaff;font-style:normal;margin-top:auto;letter-spacing:2px}
#navModes{display:none;justify-content:center;gap:8px;flex-wrap:wrap;width:min(900px,100%);margin:4px auto 8px}
#ov .navBtn,#ov .miniAction,#ov .resultAction{border:1px solid #397194;border-radius:3px;background:#0d2339;color:#a5e2ff;font:700 13px Rajdhani,Arial,sans-serif;letter-spacing:1px;padding:9px 18px;box-shadow:none;animation:none;text-transform:uppercase;cursor:pointer;margin:0}
#ov .navBtn.on,#ov .navBtn:hover,#ov .miniAction:hover,#ov .resultAction:hover{background:#246697;color:#fff}
#campList{display:none;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;width:min(900px,100%);text-align:left}
#ov #campList .missionTile{border:1px solid #2a5979;border-top:3px solid #3689bb;background:linear-gradient(155deg,rgba(18,46,77,.92),rgba(5,17,30,.92));padding:15px 14px;display:flex;gap:7px;flex-direction:column;min-height:172px;text-align:left;color:#c9ecff;cursor:pointer;transition:background .12s,border-color .12s}
#ov #campList .missionTile.on{border-color:#5ce5ff;border-top-color:#a2f4ff;background:linear-gradient(155deg,rgba(25,85,130,.94),rgba(7,28,50,.94));box-shadow:inset 0 0 16px rgba(75,201,255,.2)}
#ov #campList .missionTile.locked{opacity:.48;filter:grayscale(.6);cursor:not-allowed}
#ov #campList .missionTile .seq{color:#51cafa;font:700 11px Orbitron,sans-serif;letter-spacing:2px}
#ov #campList .missionTile strong{font:700 15px Orbitron,Arial,sans-serif;color:#fff;line-height:1.3}
#ov #campList .missionTile .descriptor{font:500 14px Rajdhani,Arial,sans-serif;letter-spacing:.02em;color:#a3bdd1;line-height:1.3}
#ov #campList .missionTile .reward{font:700 12px Rajdhani,sans-serif;color:#e9c86d;margin-top:auto}
#campInfo{display:none;max-width:890px;width:100%;border:1px solid #245573;border-left:3px solid #54bce2;background:rgba(5,19,30,.68);padding:10px 16px;line-height:1.5;text-align:left;font:500 15px Rajdhani,sans-serif;color:#bdd9ea}
#campInfo b{color:#fff}
#resultsBlock{display:none;width:min(750px,100%);background:rgba(4,20,32,.72);border-top:1px solid #3e85a5;border-bottom:1px solid #3e85a5;padding:16px 20px;color:#c1e4f5;font:600 15px Rajdhani,sans-serif;line-height:1.65}
#resultButtons{display:none;gap:10px;justify-content:center;flex-wrap:wrap;margin:0 auto}
#ov #ob{margin:10px 0 22px;font-size:15px;padding:13px 42px}
#pm .pb{border-color:#3686b7;background:linear-gradient(150deg,#0d2e49,#05111f);box-shadow:0 14px 48px rgba(0,0,0,.85),inset 0 0 24px rgba(41,150,210,.08)}
#pm h2{color:#8feaff!important;font:800 15px Orbitron,sans-serif;letter-spacing:3px}
#pm button{border-color:#2a6388!important;background:#122b45!important;font:700 14px Rajdhani,Arial,sans-serif!important;letter-spacing:1px;color:#d0efff!important}
#pm button:hover{border-color:#77dcff!important;background:#245c83!important}
#missionHud{position:absolute;right:16px;top:68px;z-index:3;min-width:226px;max-width:min(330px,42vw);padding:12px 15px;color:#d2edff;background:linear-gradient(130deg,rgba(8,24,42,.94),rgba(5,12,23,.9));border:1px solid #3474a0;border-left:3px solid #59d5fa;box-shadow:0 9px 24px #0009;pointer-events:none;font:500 14px Rajdhani,Arial,sans-serif}
#missionHud .missionKicker{font:700 10px Orbitron,Arial,sans-serif;letter-spacing:2px;color:#58d8fc}
#missionHud .missionTitle{font:700 13px Orbitron,sans-serif;letter-spacing:.5px;color:#fff;margin:6px 0}
#missionHud .missionGoal{color:#bddbef;line-height:1.3}
#missionHud .missionProgress{font:700 20px Orbitron,sans-serif;color:#ffe09a;margin:8px 0 5px}
#missionHud .missionMeter{height:4px;background:#1a3c53;overflow:hidden}
#missionHud .missionMeter i{height:100%;display:block;background:linear-gradient(90deg,#318ecf,#7ce9ff);transition:width .2s}
#missionHud .missionHint{font-size:12px;color:#8bb6cb;margin-top:7px}
#missionHud[hidden]{display:none}
#top .campaignTop{display:none;color:#92dcff;font-weight:bold;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px}
#top #mb{flex-shrink:0}
@media(max-width:760px){#mainHub{grid-template-columns:1fr}#campList{grid-template-columns:1fr}#campList .missionTile{min-height:105px}#mainHub .hubTile{min-height:135px}#missionHud{top:9px;right:7px;max-width:220px;font-size:12px;padding:9px}}
`;
const st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
const ov=$id('ov');const nav=document.createElement('div');nav.id='navModes';nav.innerHTML='<button class="navBtn" data-view="home">◀ HOME</button><button class="navBtn" data-view="skirmish">SKIRMISH</button><button class="navBtn" data-view="campaign">CAMPAIGN</button>';
$id('lg').insertAdjacentElement('afterend',nav);
const hub=document.createElement('div');hub.id='mainHub';hub.innerHTML='<button class="hubTile" data-view="skirmish"><small>CLASSIC RTS</small><strong>SKIRMISH</strong><span>The original open-ended base-building match. Pick a battlefield, scale the difficulty and eliminate every hive.</span><em>DEPLOY  →</em></button><button class="hubTile" data-view="campaign"><small>6 MISSION STORY ARC</small><strong>CAMPAIGN</strong><span>Six connected operations across six distinct battlefields, with varied objectives, tailored starting forces and unlockable missions.</span><em>VIEW OPERATIONS  →</em></button>';
nav.insertAdjacentElement('afterend',hub);
const homeCredits=document.createElement('div');homeCredits.id='korhalCredits';homeCredits.textContent='Made by Zonda, tested by Derky';ov.appendChild(homeCredits);
const camp=document.createElement('div');camp.id='campList';$id('mp').insertAdjacentElement('afterend',camp);
const campInfo=document.createElement('div');campInfo.id='campInfo';camp.insertAdjacentElement('afterend',campInfo);
const results=document.createElement('div');results.id='resultsBlock';$id('df').insertAdjacentElement('afterend',results);
const resultButtons=document.createElement('div');resultButtons.id='resultButtons';results.insertAdjacentElement('afterend',resultButtons);
const missionHud=document.createElement('div');missionHud.id='missionHud';missionHud.hidden=true;$id('gc').appendChild(missionHud);
const topMode=document.createElement('span');topMode.className='campaignTop';$id('top').insertBefore(topMode,$id('top').querySelector('.w'));
const mTitle=$id('mp').previousElementSibling,dTitle=$id('df').previousElementSibling;
const startLabel=$id('ob');
let view='home', gameKind='skirmish', missionId=0, chosen=0, savedMap=cfg.m, state='home', nextAction='start', lastResult=null, campaignCC=null, relays=[], flagship=null, bonusWon=false, menuCount=0;
let unlocked=0,ratings={};
try{const d=JSON.parse(localStorage.getItem('sector-korhal-campaign-v1')||'{}');unlocked=Math.max(0,Math.min(2,Number(d.unlocked)||0));ratings=d.ratings||{}}catch(e){}
function persist(){try{localStorage.setItem('sector-korhal-campaign-v1',JSON.stringify({unlocked,ratings}))}catch(e){}}
const clock=n=>{const seconds=Math.ceil(Math.max(0,n)/60);return String(seconds/60|0).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0')};
function missionCards(){camp.innerHTML=MISSIONS.map((m,i)=>{const locked=i>unlocked,stars=ratings[i]||0;return `<button class="missionTile${chosen===i?' on':''}${locked?' locked':''}" data-mission="${i}" aria-disabled="${locked}" type="button"><span class="seq">OPERATION ${m.num} · ${m.mark}</span><strong>${m.title}</strong><span class="descriptor">${m.sub}<br>${m.map}</span><span class="reward">${locked?'🔒 COMPLETE PRIOR MISSION':stars?'★'.repeat(stars)+'☆'.repeat(3-stars)+'  COMPLETED':'AVAILABLE · NOT COMPLETED'}</span></button>`}).join('')}
function showView(v){if(!['home','skirmish','campaign'].includes(v))v='home';view=v;state='setup';
 hub.style.display=v==='home'?'grid':'none';nav.style.display=v==='home'?'none':'flex';homeCredits.hidden=v!=='home';
 [...nav.querySelectorAll('.navBtn')].forEach(b=>b.classList.toggle('on',b.dataset.view===v));
 mTitle.style.display=v==='skirmish'?'flex':'none';$id('mp').style.display=v==='skirmish'?'flex':'none';camp.style.display=v==='campaign'?'grid':'none';campInfo.style.display=v==='campaign'?'block':'none';
 dTitle.style.display=v==='home'?'none':'flex';$id('df').style.display=v==='home'?'none':'flex';
 results.style.display='none';resultButtons.style.display='none';
 $id('df').querySelectorAll('.c').forEach((n,i)=>{
  if(v==='campaign')n.innerHTML='<b>'+DFS[i].n+'</b><span>'+[
    'Smaller and slower Zerg attacks.',
    'Balanced campaign opposition.',
    'Larger, faster waves and more dangerous enemies.'
  ][i]+'</span>';
  else n.innerHTML='<b>'+DFS[i].n+'</b><span>'+DFS[i].d+'</span>';
 });
 if(v==='home'){ $id('ot').textContent='TACTICAL COMMAND';$id('ot').style.color='#9fe6ff';$id('op').textContent='Choose a classic skirmish or a story operation. Your campaign progress is saved automatically in this browser.';startLabel.style.display='none';}
 if(v==='skirmish'){$id('ot').textContent='SKIRMISH BRIEFING';$id('op').textContent=LORE;startLabel.style.display='';startLabel.textContent='LAUNCH SKIRMISH';}
 if(v==='campaign'){chosen=Math.min(chosen,unlocked);missionCards();const m=MISSIONS[chosen];$id('ot').textContent=`MISSION ${m.num} — ${m.sub.toUpperCase()}`;$id('op').textContent=m.brief;campInfo.innerHTML=`<b>PRIMARY OBJECTIVE:</b> ${m.task}<br><b>FIELD INTEL:</b> ${m.hint}`;startLabel.style.display='';startLabel.disabled=false;startLabel.textContent='DEPLOY OPERATION '+m.num;}
}
const originalStart=startGame;
const originalEnd=end;
const originalStep=step;
const originalSpawn=spawnWave;
const originalMenu=menu;
menu=function(){originalMenu(); if(state==='setup')showView(view)};
function readyMission(){const m=MISSIONS[missionId],cc=B.find(b=>b.t==='cc'&&b.team===1);campaignCC=cc;relays=[];flagship=null;bonusWon=false;res.m=m.m;res.g=m.g;wt=m.wave;
 const spawn=(t,x,y)=>{const e=mk(t,1,x,y);const pos=typeof freeSpot==='function'?freeSpot(x,y,e.id||0,cc):{x,y};e.x=pos.x;e.y=pos.y;e.lx=e.x;e.ly=e.y;return e};
 const [cx,cy]=MAP.pc;
 // Complete starter Supply Depots before adding the premade garrison, avoiding
 // supply overcap and preventing the campaign from feeling soft-locked at start.
 const depots=missionId===2?2:1;
 for(let i=0;i<depots;i++){
  const candidate=[];
  for(let ring=110;ring<=240;ring+=22)for(let a=0;a<Math.PI*2;a+=.35)
   candidate.push({x:cx+Math.cos(a+1.37*i)*ring,y:cy+Math.sin(a+1.37*i)*ring});
  const p=candidate.find(q=>ok('depot',q.x,q.y)&&elev(q.x,q.y)===elev(cx,cy));
  if(p){const b=mk('depot',1,p.x,p.y);b.done=1;b.pr=T.depot.bt;b.hp=b.maxHp;}
 }
 const makeArmy=(order)=>{let idx=0;for(const [t,n] of order)for(let j=0;j<n;j++){const a=idx++*2.39996,x=cx+110+Math.cos(a)*(100+(idx%3)*17),y=cy+Math.sin(a)*(70+(idx%4)*15);spawn(t,Math.min(W-60,Math.max(60,x)),Math.min(H-60,Math.max(60,y)))}};
 if(missionId===0)makeArmy([['marine',4],['medic',1]]);
 if(missionId===1){makeArmy([['marine',5],['medic',1],['vulture',1]]);
  const hs=B.filter(b=>b.team===2&&b.t==='hatchery');for(let i=0;i<Math.min(2,hs.length);i++){
   const h=hs[i],offs=[[-135,10],[135,10],[-90,-115],[90,-115],[-95,120],[95,120],[0,150],[0,-145]];
   const p=offs.map(([ox,oy])=>({x:h.x+ox,y:h.y+oy})).find(q=>ok('spire',q.x,q.y)&&elev(q.x,q.y)===elev(h.x,h.y))||{x:h.x+(i?135:-135),y:h.y+20};
   const r=mk('spire',2,p.x,p.y);r.done=1;r.hp=r.maxHp=1000;r.missionRelay=true;r.sn=1;relays.push(r);
  }
 }
 if(missionId===2){makeArmy([['marine',6],['medic',2],['goliath',2],['tank',1]]);
  B.filter(b=>b.team===2&&b.t==='hatchery').forEach(h=>{h.hp=h.maxHp=Math.round(h.maxHp*1.1)});
  const h=B.find(b=>b.team===2&&b.t==='hatchery');if(h){const pos=[[-150,40],[150,40],[0,-170]].map(([dx,dy])=>({x:h.x+dx,y:h.y+dy})).find(p=>ok('spire',p.x,p.y))||{x:h.x-150,y:h.y};flagship=mk('spire',2,pos.x,pos.y);flagship.done=1;flagship.hp=flagship.maxHp=1000;flagship.campaignOptional=1;flagship.sn=1}
 }
 // Campaign deploys with no unit selected. Force the visible selection/card
 // clean even if the portrait renderer's change-cache still holds an old SCV.
 sel=[];sig='';CK={};
 $id('sel').innerHTML='<div class="zn"><b>NO SELECTION</b><small>Drag to select · right-click to command</small></div>';
 $id('card').replaceChildren();
 updHUD();updSel();card();missionHud.hidden=false;topMode.textContent='OP '+m.num+'  '+m.sub.toUpperCase();
 if(missionId===1)say('INTEL: Destroy both signal relays. Locations marked on the tactical map.');
 else if(missionId===2)say('ASSAULT: Destroy the alien hive complex.');
 else say('DEFENSE: Hold your Command Center for three minutes.');
 hudUpdate();
}
startGame=function(){
 const launchKind=gameKind;
 if(launchKind==='campaign'){
  if(chosen>unlocked){say('Operation locked');return}
  missionId=chosen;cfg.m=MAPS.findIndex(b=>b.n===MISSIONS[missionId].map);if(cfg.m<0)cfg.m=0;
 }else cfg.m=savedMap;
 originalStart();state='playing';lastResult=null;
 if(launchKind==='campaign')readyMission();else{missionHud.hidden=true;topMode.textContent='SKIRMISH';campaignCC=null;relays=[];flagship=null}
 $id('ob').style.display='';
};
function progress(){if(gameKind!=='campaign'||state!=='playing')return;
 const m=MISSIONS[missionId];
 if(!campaignCC||campaignCC.hp<=0){end('MISSION FAILED — COMMAND CENTER LOST','#ff7777');return}
 if(missionId===0&&frame>=m.time*60){end('MISSION COMPLETE — OUTPOST HELD','#7cf5c0');return}
 if(missionId===1&&relays.length&&relays.every(r=>r.hp<=0)){end('MISSION COMPLETE — SIGNAL SILENCED','#7cf5c0');return}
 if(missionId===2&&flagship&&!bonusWon&&flagship.hp<=0){bonusWon=true;wt+=1800;say('Enemy spire destroyed! Reinforcements delayed by 30 seconds.');snd('done')}
}
function hudUpdate(){if(state!=='playing'||gameKind!=='campaign')return;
 const m=MISSIONS[missionId];let numerator=0,denominator=1,value='';
 if(missionId===0){numerator=Math.min(frame,m.time*60);denominator=m.time*60;value=clock(m.time*60-frame)+' REMAINING'}
 if(missionId===1){numerator=relays.filter(r=>r.hp<=0).length;denominator=relays.length||2;value=numerator+' / '+denominator+' RELAYS DISABLED'}
 if(missionId===2){const hs=B.filter(b=>b.team===2&&b.t==='hatchery').length;numerator=2-hs;denominator=2;value=Math.max(0,numerator)+' / 2 HATCHERIES DESTROYED'}
 missionHud.innerHTML=`<div class="missionKicker">CAMPAIGN · OPERATION ${m.num}</div><div class="missionTitle">${m.title}</div><div class="missionGoal">${m.task}</div><div class="missionProgress">${value}</div><div class="missionMeter"><i style="width:${Math.min(100,Math.max(0,numerator/denominator*100))}%"></i></div><div class="missionHint">${missionId===0?'Wave '+wave+' · Next attack '+clock(wt):missionId===1?'Brood relays located in enemy territory':bonusWon?'Spire neutralized · Wave delayed':'Secondary: destroy the Spire to delay waves'}</div>`;
}
step=function(){originalStep();if(state==='playing'&&gameKind==='campaign'&&!over){progress();if(!over&&frame%15===0)hudUpdate()}};
spawnWave=function(){originalSpawn();if(state==='playing'&&gameKind==='campaign'&&!over)wt=MISSIONS[missionId].interval};
function finalReport(success){const m=MISSIONS[missionId];const s=clock(frame);
 const lost=typeof STAT!=='undefined'?STAT.l:0;const stars=success?(lost<=3?3:lost<=12?2:1):0;
 if(success){ratings[missionId]=Math.max(stars,ratings[missionId]||0);unlocked=Math.max(unlocked,Math.min(2,missionId+1));persist()}
 results.innerHTML=`<div style="font:700 12px Orbitron,sans-serif;color:${success?'#7cf5c0':'#ff8585'};letter-spacing:2px">${success?'OPERATION SUCCESS':'OPERATION FAILED'} · ${m.title}</div><div>${success?['The outpost stands. Long-range scanners detect the source of the Swarm signal.','The alien network goes dark. Coordinates for the frozen hive complex are secured.','Korhal command confirms the last hive has fallen. The sector is yours.'][missionId]:'Your forces were overwhelmed. Adjust your defenses and try again.'}</div><div>Duration ${s} · Units lost ${lost} · Waves survived ${wave-1} · Zerg eliminated ${typeof STAT!=='undefined'?STAT.k:0}</div><div style="font-size:18px;color:#f4cc7a;letter-spacing:5px">${success?'★'.repeat(stars)+'☆'.repeat(3-stars):'REASSESS AND REDEPLOY'}</div>`;
 resultButtons.innerHTML=success&&missionId<2?`<button class="resultAction" data-result="next">NEXT OPERATION →</button>`:'';
 resultButtons.innerHTML+='<button class="resultAction" data-result="home">MAIN MENU</button>';
 resultButtons.style.display='flex';
}
end=function(t,c){if(over)return;
 const thisKind=gameKind;
 originalEnd(t,c);
 state='result';lastResult={success:/VICTORY|COMPLETE/.test(t),missionId};missionHud.hidden=true;
 hub.style.display='none';nav.style.display='none';mTitle.style.display='none';$id('mp').style.display='none';camp.style.display='none';campInfo.style.display='none';dTitle.style.display='none';$id('df').style.display='none';results.style.display='block';resultButtons.style.display='flex';
 if(thisKind==='campaign'){finalReport(lastResult.success);$id('op').textContent='';startLabel.textContent=(lastResult.success?'REPLAY OPERATION ':'RETRY OPERATION ')+MISSIONS[missionId].num;}
 else {results.innerHTML='<div style="font:700 13px Orbitron,sans-serif;color:#5feaff">SKIRMISH REPORT</div><div>'+$id('op').textContent+'</div>';resultButtons.innerHTML='<button class="resultAction" data-result="home">MAIN MENU</button>';startLabel.textContent='PLAY AGAIN';}
 startLabel.style.display='';
};
function toHome(){
 if(typeof stopResultCinematic==='function')stopResultCinematic();
 document.body.classList.remove('result-victory','result-defeat');document.body.classList.add('outside-match');
 started=0;over=0;paused=0;drag=null;mode=null;sel=[];KS.ArrowLeft=KS.ArrowRight=KS.ArrowUp=KS.ArrowDown=0;cv.style.cursor='';
 // Never retain the previous match's framebuffer or cinematic scaling beneath
 // the home and campaign-selection overlays.
 cv.style.transform='';cv.style.transformOrigin='';ctx.clearRect(0,0,cv.width,cv.height);
 const pm=$id('pm');if(pm)pm.style.display='none';const h=$id('hp');if(h)h.hidden=true;
 state='setup';gameKind='skirmish';missionHud.hidden=true;topMode.textContent='';
 $id('ov').style.display='flex';showView('home');window.korhalSyncHUD?.();
 menuCount++;
}
window.korhalReturnToHub=toHome;
// The most recent HUD replaced the top-bar DOM, leaving the older #mb
// button outside its pointer-enabled area. Rewire the VISIBLE HUD button.
const visibleMenu=$id('zmenu');
if(visibleMenu)visibleMenu.onclick=()=>{if(started&&!over&&$id('pm')?.style.display!=='flex')$id('mb')?.click()};
if($id('mb'))$id('mb').style.display='none';
function startSelection(){if(view==='home')return;
 gameKind=view;
 if(view==='skirmish')savedMap=cfg.m;else missionId=chosen;
 startGame();}
let launchPending=false;
startLabel.onclick=()=>{
  if(launchPending)return;
  if(state!=='result'&&state!=='setup')return;
  launchPending=true;startLabel.disabled=true;startLabel.textContent='DEPLOYING…';
  const launchFn=state==='result'?startGame:startSelection;
  setTimeout(()=>{
    try{if(state==='result'||state==='setup')launchFn()}
    finally{launchPending=false;startLabel.disabled=false}
  },0);
};
ov.addEventListener('click',e=>{
 const btn=e.target.closest('button[data-view],button[data-mission],button[data-result]');if(!btn)return;
 if(btn.dataset.view){e.preventDefault();showView(btn.dataset.view);return}
 if(btn.dataset.mission!=null){const i=+btn.dataset.mission;if(i<=unlocked){chosen=i;showView('campaign')}return}
 if(btn.dataset.result==='home'){toHome();return}
 if(btn.dataset.result==='next'){chosen=Math.min(2,missionId+1);gameKind='campaign';showView('campaign');return}
});
const oldMaps=menu;
// The original click handler updates the selected map/difficulty. Preserve its behavior and render the active view afterwards.
ov.addEventListener('click',e=>{const node=e.target.closest('.c');if(node&&state==='setup'&&view==='skirmish'&&node.dataset.m!=null)savedMap=+node.dataset.m});
const prevDraw=draw;draw=function(){prevDraw();if(state==='playing'&&gameKind==='campaign'&&missionId===1){
  const k=192/W;mc.save();relays.forEach(r=>{if(r.hp<=0)return;const px=r.x*k,py=r.y*k,a=.65+.35*Math.sin(frame*.08);mc.strokeStyle='rgba(255,220,95,'+a+')';mc.lineWidth=2;mc.beginPath();mc.arc(px,py,4.4+2*Math.sin(frame*.06),0,Math.PI*2);mc.stroke()});mc.restore()
 }else if(state==='playing'&&gameKind==='campaign'&&missionId===2&&flagship&&flagship.hp>0){const k=192/W;mc.save();mc.strokeStyle='#ffb54c';mc.lineWidth=2;mc.strokeRect(flagship.x*k-4,flagship.y*k-4,8,8);mc.restore()}
};
addEventListener('keydown',e=>{if(!started||over||state!=='playing')return;if(e.key==='F10'){e.preventDefault();$id('zmenu')?.click()}},true);
const manual=$id('hp');manual?.querySelector('.g')?.insertAdjacentHTML('beforeend','<div><h4>CAMPAIGN OPERATIONS</h4>Choose <b>Campaign</b> from the main menu to play six operations with varied objectives; missions unlock on victory. Earn up to 3 stars based on casualties; next missions unlock on victory. The <b>MENU</b> button or <b>Esc</b> opens settings, restart and return to main menu.</div>');

(()=>{
'use strict';
try{
  // ============================================================
  // SECTOR KORHAL — Holistic Command / Zerg Economy / Campaign V2
  // ============================================================

  // ---------- Additional units / structures ----------
  Object.assign(T,{
    drone:{n:'Drone',hp:40,sp:2.35,rg:12,d:4,cd:28,c:50,s:1,rad:7,bt:300,fc:['#b6ff4a',1]},
    larva:{n:'Larva',hp:25,sp:0,rg:0,d:0,cd:1,c:0,s:0,rad:5,bt:0,fc:['#9dff75',1]},
    extractor:{n:'Extractor',hp:500,size:48,bt:300},
    convoy:{n:'Convoy APC',hp:1000,sp:.45,rg:0,d:0,cd:1,c:0,s:0,rad:15,bt:0,ar:2}
  });
  Object.assign(HH,{extractor:23,convoy:16});
  DR.drone=()=>{el(0,0,8,6,'#5b3b54');el(7,0,4,3,'#8c587e');poly([5,-4,16,-8,11,-1],'#c7a3bd');poly([5,4,16,8,11,1],'#c7a3bd');el(9,0,1.8,1.8,'#b6ff4a');rc(-10,-2,5,4,'#493247')};
  DR.larva=()=>{el(0,1,7,5,'#a6546e');el(5,-1,4,3,'#d17b91');poly([-4,-4,-8,-8,-2,-5],'#e6b0ba');poly([-4,4,-8,8,-2,5],'#e6b0ba');el(7,-1,1.4,1.4,'#e8ff9f')};
  DR.convoy=()=>{rc(-15,-8,30,16,'#5b6673');rc(-10,-6,20,5,'#2c55a0');rc(-8,1,16,5,'#39434e');el(9,0,3,3,'#6fe0ff');rc(-14,-4,4,8,'#e0b53f');rc(10,-4,4,8,'#e0b53f')};
  ZR.extractor=(b,s,x,y)=>{
    glow(x,y,35,'rgba(80,255,110,.28)',b.done?.9:.35);
    cyl(x,y,22,6,'#3e4651');
    cyl(x,y-3,14,22,'#4f665a');
    dom(x,y-24,11,10,'#5fe05f');
    ctx.strokeStyle='#d6e2d8';ctx.lineWidth=2;ctx.beginPath();
    ctx.moveTo(x-18,y+3);ctx.lineTo(x-10,y-30);ctx.moveTo(x+18,y+3);ctx.lineTo(x+10,y-30);ctx.stroke();
    for(let i=0;i<4;i++){const a=(frame*.015+i*.25)%1;el(x+Math.sin(i*2.1+a*5)*5,y-29-a*28,1.6,2,'rgba(190,255,160,'+(1-a)+')')}
  };

  // ---------- State ----------
  const KH={
    z:{m:360,g:70,lastBuild:0,lastProd:0,lastLarva:0,lastWave:0,started:false,disabled:false},
    mission:{convoy:[],extract:null,caps:[],capHold:0,rescue:[],rescued:0,route:[],ambushes:[],startedAt:0},
    stats:{built:0,lost:0,gatherM:0,gatherG:0,structuresBuilt:0,kills:0,startM:0,startG:0},
    income:{m:0,g:0,wm:0,wg:0,lastM:0,lastG:0,lastF:0,rateM:0,rateG:0,mEvents:[],gEvents:[]},
    groups:grp,
    campaignMeta:{}
  };
  try{KH.campaignMeta=JSON.parse(localStorage.getItem('sector-korhal-campaign-v2')||'{}')||{}}catch(e){KH.campaignMeta={}}
  window.korhalHolistic=KH;

  // Preserve existing campaign progress while allowing all six missions to unlock.
  try{const saved=JSON.parse(localStorage.getItem('sector-korhal-campaign-v1')||'{}');unlocked=Math.max(unlocked,Math.min(5,Number(saved.unlocked)||0))}catch(e){}
  unlocked=Math.max(0,Math.min(5,Number(unlocked)||0));
  const saveCampaign=()=>{
    try{localStorage.setItem('sector-korhal-campaign-v2',JSON.stringify(KH.campaignMeta))}catch(e){}
    try{localStorage.setItem('sector-korhal-campaign-v1',JSON.stringify({unlocked:Math.max(0,Math.min(5,unlocked)),ratings}))}catch(e){}
  };
  addEventListener('korhal:reset',()=>{
    KH.z={m:360,g:70,lastBuild:0,lastProd:0,lastLarva:0,lastWave:0,started:false,disabled:false};
    KH.mission={convoy:[],extract:null,caps:[],capHold:0,rescue:[],rescued:0,route:[],startedAt:0};
    KH.stats={built:0,lost:0,gatherM:0,gatherG:0,structuresBuilt:0,kills:0,startM:0,startG:0};
    KH.income={m:0,g:0,wm:0,wg:0,lastM:res.m,lastG:res.g,lastF:0,rateM:0,rateG:0,mEvents:[],gEvents:[]};
  });

  // ---------- Mission maps ----------
  MAPS.push(
    {n:'Redline Convoy',d:'Dust road battlefield. You hold the southwest and must escort a convoy to the northern extraction zone.',
      sw:'linear-gradient(135deg,#6b351d,#c38a48)',base:'#806039',
      pal:['#8f6b42','#a27a4a','#6e5030','#b28b56','#72512f','#c09861','#7d5d38'],
      sp:['#c59b5e','#4b3925','#d8b77e'],tint:'rgba(240,180,95,.18)',
      l:['#9b4a1d','#b85d21','#8f3f18','#d58b2d','#e4a548'],q:['#5d3b22','#744a27','#8b5d31'],
      bu:['#7a4a22','#9a5a25','#b66d2d'],fl:['#fff','#ffad4d','#d64a2e','#ffd24a'],
      pc:[300,1220],ec:[2110,380],en:[1840,540],
      f:[[300,1220,3.8],[760,1080,2.4],[1220,800,0],[1640,560,3.8],[2110,380,.7]],
      g:[[440,1120],[440,1330],[1970,270],[1970,500],[930,620],[1470,980]],x:[[760,1080],[1220,800],[1640,560]],
      p:[{cx:9.5,cy:38,rx:8.2,ry:7.3,s:'e',a:38},{cx:65.7,cy:12,rx:8.4,ry:7.2,s:'w',a:12}],
      w:[{cx:27,cy:16,rx:2.2,ry:6.5},{cx:40,cy:30,rx:5.2,ry:1.8},{cx:52,cy:19,rx:2.1,ry:6.5}]},
    {n:'Iron Bastion',d:'Three strategic uplinks divide the center. Capture all three and hold them against the Swarm.',
      sw:'linear-gradient(135deg,#314b52,#8b7652)',base:'#59645e',
      pal:['#4d5c58','#64716a','#3e4b49','#748075','#505c55','#7f8978','#59665e'],
      sp:['#8c9a8a','#293633','#a6ad9a'],tint:'rgba(150,190,180,.15)',
      l:['#2f5f46','#387052','#2d6045','#4c8a5d','#78aa70'],q:['#28483a','#315844','#3f6d50'],
      bu:['#3c6250','#4d765c','#5e8a67'],fl:['#fff','#8ff','#ff6f55','#ffd24a'],
      pc:[2050,800],ec:[350,800],en:[560,700],
      f:[[2050,800,3.14],[1620,480,4.7],[1200,800,0],[1620,1120,1.57],[350,800,0]],
      g:[[1910,620],[1910,980],[490,620],[490,980],[1000,560],[1000,1040]],x:[[1620,480],[1200,800],[1620,1120]],
      p:[{cx:64,cy:25,rx:8.8,ry:7.5,s:'w',a:25},{cx:11,cy:25,rx:8.8,ry:7.5,s:'e',a:25}],
      w:[{cx:32,cy:9,rx:2.0,ry:6.4},{cx:32,cy:41,rx:2.0,ry:6.4},{cx:50,cy:15,rx:5.2,ry:1.8},{cx:50,cy:35,rx:5.2,ry:1.8}]},
    {n:'Broken Landing',d:'A shattered colony world. Stranded marines are surrounded; rescue them before the Swarm overruns the crash sites.',
      sw:'linear-gradient(135deg,#263e56,#8b6d58)',base:'#59616a',
      pal:['#53616e','#697583','#45515d','#77818c','#4b5864','#8a9298','#5f6a73'],
      sp:['#87939b','#2b3540','#a1a9ad'],tint:'rgba(150,190,215,.14)',
      l:['#3b604d','#477158','#365a49','#5d8b66','#79a879'],q:['#2e4c3e','#395e4a','#4a7055'],
      bu:['#485c63','#5b7078','#71848a'],fl:['#fff','#8fd8ff','#ff7865','#ffd24a'],
      pc:[1200,280],ec:[1200,1320],en:[1880,1200],
      f:[[1200,280,1.57],[600,600,3.9],[1200,800,0],[1800,600,2.35],[1200,1320,4.71]],
      g:[[1060,400],[1340,400],[1060,1200],[1340,1200],[1850,520],[550,1080]],x:[[600,600],[1200,800],[1800,600]],
      p:[{cx:37.5,cy:9,rx:8.8,ry:7,s:'s',a:37.5},{cx:37.5,cy:41,rx:8.8,ry:7,s:'n',a:37.5}],
      w:[{cx:18,cy:21,rx:2.2,ry:5.5},{cx:57,cy:21,rx:2.2,ry:5.5},{cx:30,cy:34,rx:6,ry:1.8},{cx:45,cy:34,rx:6,ry:1.8}]}
  );
  menu();

  // ---------- Mission definitions ----------
  MISSIONS.push(
    {id:3,num:'04',title:'REDLINE CONVOY',sub:'Escort the Column',map:'Redline Convoy',mapIndex:4,mark:'ESCORT',
      brief:'A civilian convoy is trapped behind the front. Clear the route, keep the vehicles alive and get at least two of the three APCs to the northern extraction zone.',
      task:'Escort at least 2 of 3 convoy vehicles to extraction',hint:'The convoy moves on its own at a deliberate pace. Keep Marines ahead of the column, clear ambushes and protect at least two vehicles to extraction.',m:500,g:125,wave:3000,interval:2400},
    {id:4,num:'05',title:'IRON BASTION',sub:'Hold the Uplinks',map:'Iron Bastion',mapIndex:5,mark:'CONTROL',
      brief:'Three strategic uplinks control the only stable approach. Capture all three, then hold the network long enough for orbital artillery to come online.',
      task:'Capture all 3 uplinks and hold them for 60 seconds',hint:'Units near an uplink capture it. Zerg presence reverses progress, so split your force and rotate reinforcements.',m:600,g:175,wave:2550,interval:2200},
    {id:5,num:'06',title:'BROKEN LANDING',sub:'Rescue the Lost',map:'Broken Landing',mapIndex:6,mark:'RESCUE',
      brief:'Four Marines from the Kestrel wing survived the crash but are stranded in Zerg territory. Reach their beacons and extract at least three survivors.',
      task:'Rescue at least 3 of 4 stranded Marines',hint:'Move a combat unit close to a stranded Marine to bring them under your command. The survivors cannot move until rescued.',m:450,g:100,wave:2700,interval:2250}
  );

  // ---------- Mission selection / persistence ----------
  missionCards=function(){
    camp.innerHTML=MISSIONS.map((m,i)=>{
      const locked=i>unlocked,stars=ratings[i]||0,meta=KH.campaignMeta[i]||{};
      const best=meta.bestTime?(' · BEST '+Math.floor(meta.bestTime/60)+':'+String(meta.bestTime%60).padStart(2,'0')):'';
      const progress=stars?('★'.repeat(stars)+'☆'.repeat(3-stars)+best+'  COMPLETED'):(locked?'🔒 COMPLETE PRIOR MISSION':'AVAILABLE · NOT COMPLETED');
      return `<button class="missionTile${chosen===i?' on':''}${locked?' locked':''}" data-mission="${i}" aria-disabled="${locked}" type="button"><span class="seq">OPERATION ${m.num} · ${m.mark}</span><strong>${m.title}</strong><span class="descriptor">${m.sub}<br>${m.map}</span><span class="reward">${progress}</span></button>`;
    }).join('');
  };
  showView=(()=>{
    const old=showView;
    return function(v){
      if(typeof stopResultCinematic==='function')stopResultCinematic();
      document.body.classList.remove('result-victory','result-defeat');
      old(v);
      if(v==='campaign'){
        chosen=Math.min(chosen,unlocked);
        missionCards();
        const m=MISSIONS[chosen];
        if(m){$id('ot').textContent=`MISSION ${m.num} — ${m.sub.toUpperCase()}`;$id('op').textContent=m.brief;campInfo.innerHTML=`<b>PRIMARY OBJECTIVE:</b> ${m.task}<br><b>FIELD INTEL:</b> ${m.hint}`;}
      }
    }
  })();

  // ---------- Zerg economy helpers ----------
  const zHatches=()=>B.filter(b=>b.team===2&&b.t==='hatchery'&&b.done&&b.hp>0);
  const zExtractors=()=>B.filter(b=>b.team===2&&b.t==='extractor'&&b.done&&b.hp>0);
  const zDrones=()=>U.filter(u=>u.team===2&&u.t==='drone'&&u.hp>0);
  const zCombat=()=>U.filter(u=>u.team===2&&u.hp>0&&!u.b&&!['drone','larva'].includes(u.t));
  const zNearH=(u)=>zHatches().sort((a,b)=>D(u,a)-D(u,b))[0]||null;
  const zFreeGeyser=(h)=>{
    return GY.map(g=>({g,d:D(g,h)})).filter(v=>v.d<320&&(!v.g.r||v.g.r.hp<=0)).sort((a,b)=>a.d-b.d)[0]?.g||null;
  };
  const zBuildSpot=(t,h)=>{
    const size=T[t].size||40;
    for(let ring=80;ring<=260;ring+=16){
      for(let i=0;i<24;i++){
        const a=(i/20)*Math.PI*2+(h.x*.013);
        const x=h.x+Math.cos(a)*ring,y=h.y+Math.sin(a)*ring;
        if(ok(t,x,y)&&elev(x,y)===elev(h.x,h.y))return{x,y};
      }
    }
    return null;
  };
  const zStartMorph=(t,x,y,h)=>{
    const drone=zDrones().filter(d=>d.zjob?.kind!=='build').sort((a,b)=>D(a,{x,y})-D(b,{x,y}))[0];
    if(!drone)return null;
    if(drone.zjob?.kind==='gas'&&drone.zjob.target)drone.zjob.target.zWorkers=Math.max(0,(drone.zjob.target.zWorkers||0)-1);
    const b=mk(t,2,x,y);
    b.done=0;b.pr=0;b.hp=b.maxHp*.1;b.zMorph=true;b.zMorphStarted=false;b.zDrone=drone;b.zHome=h;
    if(t==='extractor'){const g=GY.slice().sort((a,b)=>D(a,{x,y})-D(b,{x,y}))[0];if(g)g.r=b;b.zGeyser=g}
    drone.zjob={kind:'build',building:b};
    KH.z.lastBuild=frame;
    return b;
  };
  const zStartExpansion=()=>{
    const h=zHatches()[0];if(!h)return null;
    const ex=EX.filter(e=>ok('hatchery',e.x,e.y)&&!B.some(b=>b.team===2&&b.t==='hatchery'&&D(b,e)<85)&&!B.some(b=>b.team===1&&D(b,e)<220)).sort((a,b)=>D(a,h)-D(b,h))[0];
    if(!ex)return null;
    return zStartMorph('hatchery',ex.x,ex.y,h);
  };
  const zAssignDrone=(u)=>{
    if(!u||u.zjob&&u.zjob.kind==='build')return;
    const gas=zExtractors().filter(e=>(e.zWorkers||0)<2).sort((a,b)=>D(u,a)-D(u,b))[0];
    if(gas){
      gas.zWorkers=(gas.zWorkers||0)+1;
      u.zjob={kind:'gas',target:gas,home:zNearH(u),phase:'to',timer:0};
      return;
    }
    const h=zNearH(u),ps=P.filter(p=>p.a>0);
    const p=ps.sort((a,b)=>D(a,h)-D(b,h))[0];
    u.zjob={kind:'mineral',target:p,home:h,phase:'to',timer:0};
  };
  const zDroneStep=(u)=>{
    const j=u.zjob;
    if(!j||j.kind==='build'){if(!j)zAssignDrone(u);return}
    if(!j.target||j.target.hp<=0&&j.kind==='gas'){u.zjob=null;zAssignDrone(u);return}
    const home=j.home||zNearH(u);if(!home){u.st='idle';return}
    if(j.phase==='to'){
      const tx=j.target.x,ty=j.target.y,reach=j.kind==='gas'?40:22;
      if(D(u,{x:tx,y:ty})>reach){mv(u,tx,ty,T.drone.sp);return}
      j.phase='gather';j.timer=0;return;
    }
    if(j.phase==='gather'){
      j.timer++;
      if(j.timer%20===0)FX.push({k:'sp',x:u.x,y:u.y,z:4,vx:Math.random()-.5,vy:Math.random()-.5,vz:.5,l:10,c:j.kind==='gas'?'#9f9':'#ffe27a'});
      if(j.timer>= (j.kind==='gas'?145:112)){j.phase='return';j.timer=0;return}
    }
    if(j.phase==='return'){
      if(D(u,home)>62){mv(u,home.x,home.y,T.drone.sp);return}
      if(j.kind==='gas')KH.z.g+=4;else KH.z.m+=5;
      j.phase='to';j.timer=0;
    }
  };

  const zLarvaStep=(u)=>{
    const h=u.larvaHome;if(!h||h.hp<=0){u.hp=0;u.zConsumed=1;return}
    const i=u.larvaSlot||0,a=i*2.094+frame*.002;
    u.x=h.x+Math.cos(a)*26;u.y=h.y+Math.sin(a)*20;
  };
  const zSpawnLarva=(h)=>{
    const n=U.filter(u=>u.team===2&&u.t==='larva'&&u.larvaHome===h&&u.hp>0).length;
    if(n>=3)return false;
    const u=mk('larva',2,h.x+Math.random()*26-13,h.y+Math.random()*20-10);
    u.larvaHome=h;u.larvaSlot=n;u.st='larva';u.guard=true;return true;
  };
  const zChooseUnit=(h)=>{
    const localWorkers=zDrones().filter(d=>zNearH(d)===h).length;
    if(localWorkers<8&&KH.z.m>=50)return{t:'drone',m:50,g:0,bt:300};
    const den=B.some(b=>b.team===2&&b.t==='den'&&b.done),spire=B.some(b=>b.team===2&&b.t==='spire'&&b.done),cav=B.some(b=>b.team===2&&b.t==='cav'&&b.done);
    const choices=[];
    if(cav&&KH.z.m>=200&&KH.z.g>=200)choices.push(['ultra',200,200,620]);
    if(spire&&KH.z.m>=100&&KH.z.g>=100)choices.push(['muta',100,100,420]);
    if(den&&KH.z.m>=75&&KH.z.g>=25)choices.push(['hydra',75,25,360]);
    if(B.some(b=>b.team===2&&b.t==='pool'&&b.done)&&KH.z.m>=50)choices.push(['zergling',50,0,300]);
    if(!choices.length)return null;
    // Favor cheap ground pressure until the tech base is established.
    const pick=choices[Math.min(choices.length-1,Math.random()<.65?choices.length-1:Math.floor(Math.random()*choices.length))];
    return{t:pick[0],m:pick[1],g:pick[2],bt:pick[3]};
  };
  const zProductionTick=()=>{
    const hs=zHatches();if(!hs.length)return;
    for(const h of hs){
      h.zq=h.zq||[];
      if(!h.zq.length){
        const larva=U.find(u=>u.team===2&&u.t==='larva'&&u.larvaHome===h&&u.hp>0&&!u.zConsumed);
        const c=zChooseUnit(h);
        if(larva&&c){
          KH.z.m-=c.m;KH.z.g-=c.g;larva.hp=0;larva.zConsumed=1;
          h.zq.push({t:c.t,qt:0,bt:c.bt,usesLarva:true});
        }
      }
      if(h.zq.length){
        const q=h.zq[0];q.qt+=cfg.d===0&&q.t!=='drone'?40:60;
        if(q.qt>=q.bt){
          h.zq.shift();
          const pos=freeSpot(h.x,h.y,Math.random()*8,h);
          const u=mk(q.t,2,pos.x,pos.y);u.guard=true;u.st='idle';u.zProduced=true;
          if(q.t==='drone')zAssignDrone(u);
          FX.push({k:'bm',x:u.x,y:u.y,r:18,l:16,m:16,c:'#b6ff4a'});
          if(h.zq.length===0)h.zq=[];
        }
      }
    }
  };
  const zEconomyTick=()=>{
    if(!KH.z.started||over)return;
    const hs=zHatches();if(!hs.length)return;
    // Keep worker saturation sensible: 6 mineral + 2 gas per hatchery.
    for(const h of hs){
      const local=zDrones().filter(d=>zNearH(d)===h);
      while(local.filter(d=>d.zjob?.kind==='mineral').length<6){
        const d=local.find(d=>!d.zjob)||zDrones().find(d=>!d.zjob);
        if(!d)break;zAssignDrone(d);
        if(zNearH(d)!==h)continue;
      }
      for(const d of local)if(!d.zjob)zAssignDrone(d);
    }
    // Sensible tech order. Each new structure is built by a Drone that morphs.
    if(frame-KH.z.lastBuild<420)return;
    const hasB=t=>B.some(b=>b.team===2&&b.t===t&&b.hp>0);
    const gasH=hs.find(h=>!zExtractors().some(e=>D(e,h)<300));
    if(gasH&&KH.z.m>=75){
      const g=zFreeGeyser(gasH);if(g&&zStartMorph('extractor',g.x,g.y,gasH)){KH.z.m-=75;return;}
    }
    if(!hasB('pool')&&KH.z.m>=150){
      const p=zBuildSpot('pool',hs[0]);if(p&&zStartMorph('pool',p.x,p.y,hs[0])){KH.z.m-=150;return}
    }
    if(hs.length<2&&KH.z.m>=300&&frame>2400){
      const b=zStartExpansion();if(b){KH.z.m-=300;return}
    }
    if(!hasB('den')&&hasB('pool')&&KH.z.m>=140&&KH.z.g>=100){
      const p=zBuildSpot('den',hs[0]);if(p&&zStartMorph('den',p.x,p.y,hs[0])){KH.z.m-=140;KH.z.g-=100;return}
    }
    if(!hasB('evo')&&hasB('pool')&&KH.z.m>=220){
      const p=zBuildSpot('evo',hs[0]);if(p&&zStartMorph('evo',p.x,p.y,hs[0])){KH.z.m-=220;return}
    }
    if(!hasB('sunken')&&frame>3600&&KH.z.m>=90){
      const p=zBuildSpot('sunken',hs[0]);if(p&&zStartMorph('sunken',p.x,p.y,hs[0])){KH.z.m-=90;return}
    }
    if(!hasB('spore')&&(U.some(u=>u.team===1&&u.air)||frame>18000)&&KH.z.m>=170&&KH.z.g>=75){
      const p=zBuildSpot('spore',hs[0]);if(p&&zStartMorph('spore',p.x,p.y,hs[0])){KH.z.m-=170;KH.z.g-=75;return}
    }
    if(!hasB('spire')&&hasB('den')&&KH.z.m>=330&&KH.z.g>=300){
      const p=zBuildSpot('spire',hs[0]);if(p&&zStartMorph('spire',p.x,p.y,hs[0])){KH.z.m-=330;KH.z.g-=300;return}
    }
    if(!hasB('cav')&&hasB('spire')&&frame>30000&&KH.z.m>=450&&KH.z.g>=300){
      const p=zBuildSpot('cav',hs[0]);if(p&&zStartMorph('cav',p.x,p.y,hs[0])){KH.z.m-=450;KH.z.g-=300;return}
    }
  };
  const zLaunchWave=()=>{
    const target=(gameKind==='campaign'&&missionId===3&&KH.mission.convoy.find(u=>u.hp>0&&!u.reached))||B.find(b=>b.team===1&&b.t==='cc'&&b.hp>0);
    if(!target)return;
    const pool=zCombat().filter(u=>u.guard&&u.hp>0&&(!u.st||u.st==='idle'));
    // Difficulty now affects both the grace period and the actual wave count.
    // Do not force five units into the first Easy wave; that old minimum was the
    // main reason Easy could still overwhelm an unprepared base.
    const baseCount=gameKind==='campaign'&&missionId===3?(2+wave*1.15):(2+wave*1.45);
    const minCount=DF.m<.8?2:3;
    const n=Math.min(pool.length,Math.max(minCount,Math.round(baseCount*DF.m)));
    const selected=pool.sort((a,b)=>D(a,target)-D(b,target)).slice(0,n);
    selected.forEach(u=>{u.guard=false;u.st='amove';u.tx=target.x;u.ty=target.y;u.tg=null});
    // Keep pressure alive if the economy has not yet produced enough attackers,
    // but scale the emergency force with the same difficulty curve.
    if(selected.length<minCount){
      const h=zHatches()[0];if(h){
        const emergency=Math.max(1,Math.round((1+wave*.8)*DF.m));
        for(let i=0;i<emergency;i++){
          const u=mk(i%3?'zergling':'hydra',2,h.x+Math.random()*80-40,h.y+Math.random()*80-40);
          u.st='amove';u.tx=target.x;u.ty=target.y;u.guard=false;
        }
      }
    }
    say('Zerg attack wave '+wave+' inbound');snd('warn');window.korhalWaveNotice?.(wave,zHatches()[0]||target);wave++;
    wt=gameKind==='campaign'&&MISSIONS[missionId]?MISSIONS[missionId].interval:Math.max(1200,DF.iv-Math.min(900,wave*45));
    hotT=frame+900;KH.z.lastWave=frame;
  };

  // ---------- Disable the older resource-only Zerg AI ----------
  const freezeOldAI=()=>{try{AI.last=1e9;AI.m=0}catch(e){}};
  freezeOldAI();

  // ---------- Unit behavior extensions ----------
  const oldUpdFinal=upd;
  upd=function(u){
    if(u.t==='drone'&&u.team===2){zDroneStep(u);return}
    if(u.t==='larva'&&u.team===2){zLarvaStep(u);return}
    if(u.team===0&&u.rescue){u.st='rescue';return}
    if(u.t==='convoy'&&u.team===1){
      if(u.reached)return;
      if(u.routeWait>0){u.routeWait--;u.st='idle';return}
      const r=u.route||KH.mission.route;
      const i=u.routeIndex||0,target=r[Math.min(i,r.length-1)];
      if(!target)return;
      // APCs only advance at escort pace when friendly combat troops are close.
      // If the player falls behind, the column crawls rather than outrunning its escort.
      const escort=U.some(v=>v.team===1&&v.hp>0&&!v.b&&v.t!=='scv'&&T[v.t]?.d>0&&D(v,u)<250);
      const pace=escort?.24:.055;
      if(D(u,target)<26){
        if(i>=r.length-1){
          u.reached=true;u.st='idle';u.tx=u.x;u.ty=u.y;
          say('Convoy vehicle reached extraction.');
        }else{
          u.routeIndex=i+1;
          u.routeWait=escort?420:900;
          u.st='idle';
        }
      }else{
        u.st='move';u.tx=target.x;u.ty=target.y;
        mv(u,target.x,target.y,pace);
      }
      return;
    }
    oldUpdFinal(u);
  };

  // Prevent player units from auto-targeting rescue NPCs.
  const oldAcqFinal=acq;
  acq=function(u,r){
    if(u.team===1){
      const t=T[u.t];if(!t.d)return null;
      let best=null,m=r;
      for(const e of nearEntities(u.x,u.y,r+70)){
        if(e.team===u.team||e.hp<=0||(e.team===0&&e.rescue)||(e.air&&!t.aa)||(u.team===1&&!seen(e))||(u.team===2&&e.cl&&!detd(e)))continue;
        const d=D(u,e)-R(e)+(e.b?60:0);
        if(d<m){m=d;best=e}
      }
      return best;
    }
    return oldAcqFinal(u,r);
  };

  // Slightly smarter local steering: if a unit repeatedly fails to advance, invalidate
  // its waypoint and take a short perpendicular sidestep before asking A* for a fresh path.
  const oldMvFinal=mv;
  mv=function(u,x,y,s){
    const ox=u.x,oy=u.y;
    oldMvFinal(u,x,y,s);
    if(u.air)return;
    const moved=Math.hypot(u.x-ox,u.y-oy);
    const dist=Math.hypot(x-u.x,y-u.y);
    if(dist>24&&moved<.08){
      u._stuck=(u._stuck||0)+1;
      if(u._stuck>6){
        const a=Math.atan2(y-u.y,x-u.x)+(u.id%2?-Math.PI/2:Math.PI/2);
        const sx=u.x+Math.cos(a)*28,sy=u.y+Math.sin(a)*28;
        if(clear(u.x,u.y,sx,sy)){u.x=sx;u.y=sy}
        u.pa=null;u.pk=null;u.pe=0;u._stuck=0;
      }
    }else u._stuck=0;
  };

  // Building morph gate for Zerg structures: they do not progress until the Drone arrives.
  const oldUpdBFinal=updB;
  updB=function(b){
    if(b.team===2&&b.zMorph&&!b.zMorphStarted&&!b.done)return;
    const was=b.done;
    oldUpdBFinal(b);
    if(b.team===2&&b.zMorph&&b.done&&!was){
      if(b.t==='hatchery')for(let i=0;i<3;i++)zSpawnLarva(b);
      if(vis(b.x,b.y))say('Zerg '+T[b.t].n+' complete');
    }
  };

  // Consume/morph Drone cleanup, extractor release, and unit/build stats.
  const oldBoomFinal=window.boomFX;
  window.boomFX=function(e){
    if(e.zConsumed)return;
    if(e.team===2&&e.t==='drone'&&e.zjob?.kind==='gas'&&e.zjob.target){
      e.zjob.target.zWorkers=Math.max(0,(e.zjob.target.zWorkers||0)-1);
    }
    if(e.team===2&&e.t==='drone'&&e.zjob?.kind==='build'&&e.zjob.building){
      e.zjob.building.cancelled=1;e.zjob.building.hp=0;
    }
    if(e.b&&e.team===2&&e.t==='extractor'){
      const g=GY.find(q=>q.r===e);if(g)g.r=null;
    }
    if(e.team===1&&!e.b&&!e.to)KH.stats.lost++;
    if(e.team===2&&!e.b&&!e.zConsumed)KH.stats.kills++;
    if(oldBoomFinal)oldBoomFinal(e);
  };

  // Count produced player units and structures.
  const oldSpawnFinal=window.onSpawn;
  window.onSpawn=function(b,u,k){
    if(oldSpawnFinal)oldSpawnFinal(b,u,k);
    if(b&&b.team===1){
      KH.stats.built++;
      u.kills=u.kills||0;
    }
  };
  const oldAtkFinal=atk;
  atk=function(u,tg,rg,dm){
    const hp=tg.hp;
    oldAtkFinal(u,tg,rg,dm);
    if(hp>0&&tg.hp<=0&&u.team===1){u.kills=(u.kills||0)+1}
  };

  // ---------- Start / reset Zerg economy ----------
  const addZergBaseEconomy=()=>{
    KH.z.started=true;
    KH.z.m=360;KH.z.g=70;
    const hs=zHatches();
    hs.forEach((h,hi)=>{
      h.zq=[];h.zWorkers=0;
      // Start with a completed gas extractor at the main and expansion.
      const g=zFreeGeyser(h);
      if(g){
        const ex=mk('extractor',2,g.x,g.y);ex.done=1;ex.pr=T.extractor.bt;ex.hp=ex.maxHp;ex.zWorkers=0;g.r=ex;ex.zGeyser=g;
      }
      for(let i=0;i<3;i++)zSpawnLarva(h);
      for(let i=0;i<8;i++){
        const a=i*2.39996+hi*.7,r=85+(i%3)*18;
        const u=mk('drone',2,h.x+Math.cos(a)*r,h.y+Math.sin(a)*r*.7);
        u.st='idle';u.guard=true;
        if(i<6){
          const ps=P.slice().sort((a,b)=>D(a,h)-D(b,h));
          u.zjob={kind:'mineral',target:ps[i%Math.max(1,ps.length)],home:h,phase:'to',timer:0};
        }else{
          const ex=zExtractors().filter(e=>e.zGeyser&&D(e,h)<260)[0];
          if(ex){ex.zWorkers=(ex.zWorkers||0)+1;u.zjob={kind:'gas',target:ex,home:h,phase:'to',timer:0}}
        }
      }
    });
    freezeOldAI();
    KH.stats.startM=res.m;KH.stats.startG=res.g;
  };

  const oldStartHolistic=startGame;
  startGame=function(){
    if(gameKind==='campaign'&&MISSIONS[missionId]){
      const mi=MAPS.findIndex(mm=>mm.n===MISSIONS[missionId].map);
      if(mi>=0)cfg.m=mi;
    }
    oldStartHolistic();
    if(started){
      if(gameKind==='campaign'){
        const missionTracks=[0,1,2,3,4,5];
        theme=missionTracks[missionId]??0;stp=0;nxt=AC?AC.currentTime+.07:0;window.korhalTrackRefresh?.();
      }
      addZergBaseEconomy();
      if(gameKind==='campaign'&&missionId>=3)setupHolisticMission(missionId);
      updHUD();updSel();card();
    }
  };

  // ---------- New campaign mission setup ----------
  const spawnPlayerUnit=(t,x,y)=>{
    const u=mk(t,1,x,y);u.lx=u.x;u.ly=u.y;return u;
  };
  function setupHolisticMission(id){
    const m=MISSIONS[id],cx=MAP.pc[0],cy=MAP.pc[1];
    KH.mission={convoy:[],extract:null,caps:[],capHold:0,rescue:[],rescued:0,route:[],ambushes:[],startedAt:frame};
    const addArmy=(arr)=>{
      let n=0;
      for(const [t,k] of arr)for(let i=0;i<k;i++){
        const a=n++*2.39996,r=80+(n%3)*20;
        spawnPlayerUnit(t,Math.max(60,Math.min(W-60,cx+Math.cos(a)*r)),Math.max(60,Math.min(H-60,cy+Math.sin(a)*r)));
      }
    };
    if(id===3){
      addArmy([['marine',5],['medic',1],['vulture',1]]);
      // Give the escort commander a ready Barracks so the column can be reinforced.
      for(let ring=95;ring<=180&&!B.some(b=>b.team===1&&b.t==='barracks');ring+=18){
        for(let a=0;a<Math.PI*2&&!B.some(b=>b.team===1&&b.t==='barracks');a+=.4){
          const x=Math.max(80,Math.min(W-80,cx+Math.cos(a)*ring)),y=Math.max(80,Math.min(H-80,cy+Math.sin(a)*ring));
          if(ok('barracks',x,y)&&elev(x,y)===elev(cx,cy)){const b=mk('barracks',1,x,y);b.done=1;b.pr=T.barracks.bt;b.hp=b.maxHp;}
        }
      }
      // Deliberate route: the convoy crosses several exposed checkpoints before
      // reaching the extraction zone. Earlier checkpoints never complete the mission.
      const pts=[
        {x:520,y:1220},{x:760,y:1080},{x:940,y:940},{x:1220,y:800},
        {x:1450,y:650},{x:1712,y:304},{x:1840,y:368},{x:1980,y:380}
      ];
      KH.mission.route=pts;
      KH.mission.extract={x:1980,y:380,r:120};
      KH.mission.ambushes=[
        {x:700,y:1110,r:105,triggered:false},
        {x:1060,y:875,r:105,triggered:false},
        {x:1435,y:650,r:105,triggered:false},
        {x:1740,y:500,r:115,triggered:false}
      ];
      for(let i=0;i<3;i++){
        const u=spawnPlayerUnit('convoy',cx+40+i*30,cy+120+i*20);
        u.route=pts;u.routeIndex=0;u.reached=false;u.routeWait=0;u.convoyId=i;u.sp=.45;u.hp=u.maxHp=T.convoy.hp*DF.hp;
        KH.mission.convoy.push(u);
      }
      say('ESCORT: Protect the convoy along the marked route. Expect Zerg ambushes at the checkpoints.');
    }else if(id===4){
      addArmy([['marine',6],['medic',2],['tank',1]]);
      const pts=[{x:1400,y:560},{x:1200,y:800},{x:1400,y:1040}];
      KH.mission.caps=pts.map((p,i)=>({x:p.x,y:p.y,r:90,owner:0,prog:0,id:i}));
      say('CONTROL: Capture all three uplinks and hold the network.');
    }else if(id===5){
      addArmy([['marine',4],['medic',1],['scv',2]]);
      const pts=[{x:cx-560,y:cy+300},{x:cx+560,y:cy+300},{x:cx-620,y:cy-120},{x:cx+620,y:cy-120}];
      pts.forEach((p,i)=>{
        const u=mk('marine',0,p.x,p.y);u.team=0;u.rescue=true;u.st='rescue';u.hp=u.maxHp=40;u.rk=0;KH.mission.rescue.push(u);
      });
      say('RESCUE: Reach the stranded Marines and bring them under command.');
    }
    missionHud.hidden=false;topMode.textContent='OP '+m.num+'  '+m.sub.toUpperCase();
    hudUpdate();
  }

  // ---------- Campaign objective logic ----------
  const oldProgressFinal=progress;
  progress=function(){
    if(gameKind!=='campaign'||state!=='playing')return;
    if(missionId<=2){oldProgressFinal();return}
    const m=MISSIONS[missionId];
    if(!campaignCC||campaignCC.hp<=0){end('MISSION FAILED — COMMAND CENTER LOST','#ff7777');return}
    if(missionId===3){
      const all=KH.mission.convoy,reached=all.filter(u=>u.reached).length,alive=all.filter(u=>u.hp>0&&!u.reached).length;
      if(reached>=2){end('MISSION COMPLETE — CONVOY EXTRACTED','#7cf5c0');return}
      // If fewer than two total survivors can still possibly extract, fail immediately.
      if(reached+alive<2){end('MISSION FAILED — TWO EXTRACTIONS NO LONGER POSSIBLE','#ff7777');return}
    }else if(missionId===4){
      const allHeld=KH.mission.caps.length===3&&KH.mission.caps.every(c=>c.owner===1);
      if(allHeld)KH.mission.capHold+=30;
      else KH.mission.capHold=0;
      if(KH.mission.capHold>=3600){end('MISSION COMPLETE — BASTION SECURED','#7cf5c0');return}
    }else if(missionId===5){
      const alive=KH.mission.rescue.filter(u=>u.hp>0),rescued=KH.mission.rescued;
      if(rescued>=3){end('MISSION COMPLETE — SURVIVORS RESCUED','#7cf5c0');return}
      if(alive.length-rescued<3){end('MISSION FAILED — TOO MANY SURVIVORS LOST','#ff7777');return}
    }
  };

  // Rescue conversion and capture point simulation.
  const holisticObjectiveTick=()=>{
    if(gameKind!=='campaign'||state!=='playing'||missionId<3)return;
    if(missionId===3){
      const convoyTarget=KH.mission.convoy.find(u=>u.hp>0&&!u.reached);
      if(convoyTarget&&KH.mission.ambushes){
        KH.mission.ambushes.forEach((a,idx)=>{
          if(a.triggered||D(convoyTarget,a)>a.r)return;
          a.triggered=true;
          const ln=Math.max(2,Math.round((4+idx)*DF.m));
          const hy=Math.max(1,Math.round((1+idx*.35)*DF.m));
          for(let i=0;i<ln;i++){
            const u=mk('zergling',2,a.x+Math.random()*70-35,a.y+Math.random()*50-25);
            u.st='amove';u.tx=convoyTarget.x;u.ty=convoyTarget.y;u.guard=false;
          }
          if(idx>=1)for(let i=0;i<hy;i++){
            const u=mk('hydra',2,a.x+Math.random()*70-35,a.y+Math.random()*50-25);
            u.st='amove';u.tx=convoyTarget.x;u.ty=convoyTarget.y;u.guard=false;
          }
          if(idx===3){
            const u=mk('muta',2,a.x+20,a.y-20);u.st='amove';u.tx=convoyTarget.x;u.ty=convoyTarget.y;u.guard=false;
          }
          say('AMBUSH! Zerg are hitting the convoy at checkpoint '+(idx+1)+'!');snd('warn');
          FX.push({k:'bm',x:a.x,y:a.y,r:55,l:28,m:28,c:'#ff6255'});
        });
      }
    }
    if(missionId===4){
      for(const c of KH.mission.caps){
        const p=U.some(u=>u.team===1&&u.hp>0&&D(u,c)<c.r);
        const z=U.some(u=>u.team===2&&u.hp>0&&D(u,c)<c.r);
        if(p&&!z)c.prog=Math.min(100,c.prog+1.2);
        else if(z&&!p)c.prog=Math.max(-100,c.prog-1.5);
        else if(p&&z)c.prog=Math.max(-100,c.prog-.15);
        if(c.prog>=100)c.owner=1;
        else if(c.prog<=-100)c.owner=2;
        if(c.owner===2&&p&&!z)c.prog=Math.min(0,c.prog+1);
      }
    }
    if(missionId===5){
      for(const u of KH.mission.rescue){
        if(u.hp<=0||u.rescued)continue;
        const rescuer=U.find(v=>v.team===1&&v.hp>0&&!v.b&&D(v,u)<78);
        if(rescuer){
          u.team=1;u.rescue=false;u.rescued=true;u.st='idle';u.rk=0;u.lx=u.x;u.ly=u.y;
          KH.mission.rescued++;say('Stranded Marine recovered. '+KH.mission.rescued+'/4 rescued.');snd('done');FX.push({k:'bm',x:u.x,y:u.y,r:28,l:22,m:22,c:'#7cf5c0'});
        }
      }
    }
  };

  // ---------- Replace old wave spawner with produced-unit waves ----------
  spawnWave=function(){zLaunchWave()};

  // Actual returns are reported at the source: SCV cargo drop-off or refinery cycle.
  // This deliberately excludes production costs, repairs, crates, and scripted grants.
  window.korhalRecordIncome=function(type,amount){
    if(!started||over||!Number.isFinite(amount)||amount<=0)return;
    const events=KH.income[type+'Events'];
    if(!events)return;
    events.push({frame,amount});
    if(type==='m')KH.stats.gatherM+=amount;
    else KH.stats.gatherG+=amount;
  };
  // ---------- Main simulation wrapper ----------
  const oldStepHolistic=step;
  step=function(){
    // Stop the older pseudo-economy AI before it gets a chance to build directly.
    freezeOldAI();
    oldStepHolistic();
    if(!started||over)return;
    freezeOldAI();

    // Income is based only on harvested cargo (not resource-balance deltas).
    // A rolling 15-second window dampens the natural eight-mineral delivery bursts.
    if(frame%30===0){
      const floorFrame=frame-900;
      for(const type of ['m','g']){
        const stream=KH.income[type+'Events'];
        while(stream.length&&stream[0].frame<=floorFrame)stream.shift();
        const total=stream.reduce((n,e)=>n+e.amount,0);
        KH.income[type==='m'?'rateM':'rateG']=total*4;
      }
    }

    // Zerg economy runs once per second for strategic decisions, while workers and
    // larva update every simulation step.
    if(frame%30===0){
      zEconomyTick();
      if(frame%60===0)zProductionTick();
      for(const h of zHatches()){
        if(frame-(h.zLarvaFrame||0)>=900){h.zLarvaFrame=frame;zSpawnLarva(h)}
      }
      holisticObjectiveTick();
    }
  };

  // ---------- Zerg morph arrival ----------
  // zDroneStep marks the building ready; this wrapper converts the Drone into biomass.
  const oldZDroneStep=zDroneStep;
  // (Use a second updater because the function above is a const closure and is called
  // from upd; patch the common build case through the current upd wrapper.)
  const oldUpdWithZ=upd;
  upd=function(u){
    if(u.t==='drone'&&u.team===2){
      if(u.zjob?.kind==='build'){
        const b=u.zjob.building;
        if(!b||b.hp<=0){u.zjob=null;zAssignDrone(u);return}
        if(D(u,b)>b.size/2+8){mv(u,b.x,b.y,T.drone.sp);return}
        u.hp=0;u.zConsumed=1;u.to=1;
        b.zMorphStarted=true;b.zDrone=null;
        FX.push({k:'bm',x:b.x,y:b.y,r:b.size*.7,l:30,m:30,c:'#b6ff4a'});
        return;
      }
      zDroneStep(u);return;
    }
    if(u.t==='larva'&&u.team===2){zLarvaStep(u);return}
    oldUpdWithZ(u);
  };

  // ---------- Mission HUD ----------
  hudUpdate=function(){
    if(state!=='playing'||gameKind!=='campaign')return;
    const m=MISSIONS[missionId];let value='',pct=0,hint='';
    if(missionId<=2){
      const hs=B.filter(b=>b.team===2&&b.t==='hatchery').length;
      if(missionId===0){const remain=Math.max(0,m.time*60-frame);value=clock(remain)+' REMAINING';pct=Math.min(100,frame/(m.time*60)*100);hint='Wave '+wave+' · Next attack '+clock(wt)}
      else if(missionId===1){const n=relays.filter(r=>r.hp<=0).length;value=n+' / '+(relays.length||2)+' RELAYS DISABLED';pct=n/(relays.length||2)*100;hint='Destroy the marked relays'}
      else{const n=2-hs;value=Math.max(0,n)+' / 2 HATCHERIES DESTROYED';pct=n/2*100;hint=bonusWon?'Spire neutralized · Wave delayed':'Secondary: destroy the Spire to delay waves'}
    }else if(missionId===3){
      const reached=KH.mission.convoy.filter(u=>u.reached).length,alive=KH.mission.convoy.filter(u=>u.hp>0).length;
      value=reached+' / 2 CONVOYS EXTRACTED';pct=Math.min(100,reached/2*100);hint='Vehicles alive: '+alive+' · Protect the column';
    }else if(missionId===4){
      const held=KH.mission.caps.filter(c=>c.owner===1).length;value=held+' / 3 UPLINKS HELD';pct=held/3*100;hint=held===3?'Network hold: '+clock(3600-KH.mission.capHold):'Capture every uplink';
    }else{
      value=KH.mission.rescued+' / 3 SURVIVORS RESCUED';pct=Math.min(100,KH.mission.rescued/3*100);hint='Survivors remaining: '+KH.mission.rescue.filter(u=>u.hp>0&&!u.rescued).length;
    }
    missionHud.innerHTML=`<div class="missionKicker">CAMPAIGN · OPERATION ${m.num}</div><div class="missionTitle">${m.title}</div><div class="missionGoal">${m.task}</div><div class="missionProgress">${value}</div><div class="missionMeter"><i style="width:${Math.max(0,Math.min(100,pct))}%"></i></div><div class="missionHint">${hint}</div>`;
  };

  // ---------- Mission visual markers ----------
  const oldDrawHolistic=draw;
  draw=function(){
    oldDrawHolistic();
    if(state!=='playing'||gameKind!=='campaign'||missionId<3)return;
    ctx.save();ctx.translate(-cam.x,-cam.y);
    if(missionId===3&&KH.mission.extract){
      const e=KH.mission.extract,route=KH.mission.route||[];
      if(route.length){
        ctx.globalAlpha=.32;ctx.strokeStyle='#6fe8ff';ctx.lineWidth=3;ctx.setLineDash([12,10]);ctx.beginPath();
        route.forEach((p,i)=>{if(i===0)ctx.moveTo(p.x,p.y*K);else ctx.lineTo(p.x,p.y*K)});ctx.stroke();ctx.setLineDash([]);
        route.forEach((p,i)=>{ctx.globalAlpha=.6;ctx.fillStyle='#ffe06a';ctx.beginPath();ctx.arc(p.x,p.y*K,4,0,7);ctx.fill();ctx.font='bold 10px Courier New';ctx.textAlign='center';ctx.fillText(String(i+1),p.x,p.y*K-9)});
      }
      ctx.globalAlpha=.75;ctx.strokeStyle='#ffe06a';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(e.x,e.y*K,e.r,e.r*K,0,0,7);ctx.stroke();ctx.fillStyle='#ffe06a';ctx.font='bold 13px Courier New';ctx.textAlign='center';ctx.fillText('EXTRACTION',e.x,e.y*K-8);
      (KH.mission.ambushes||[]).forEach(a=>{if(a.triggered)return;ctx.globalAlpha=.45;ctx.strokeStyle='#ff6255';ctx.setLineDash([5,5]);ctx.beginPath();ctx.arc(a.x,a.y*K,22,0,7);ctx.stroke();ctx.setLineDash([])});
      KH.mission.convoy.forEach(u=>{if(u.hp>0&&!u.reached){ctx.strokeStyle='#6fe8ff';ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(u.x,u.y*K,22,12,0,0,7);ctx.stroke()}});
    }
    if(missionId===4){
      KH.mission.caps.forEach((c,i)=>{
        const col=c.owner===1?'#59e8ff':c.owner===2?'#ff6255':'#ffe06a';
        ctx.globalAlpha=.85;ctx.strokeStyle=col;ctx.lineWidth=3;ctx.beginPath();ctx.arc(c.x,c.y*K,c.r,0,7);ctx.stroke();ctx.fillStyle=col;ctx.font='900 18px Orbitron,sans-serif';ctx.textAlign='center';ctx.fillText(String.fromCharCode(65+i),c.x,c.y*K+6);
        ctx.globalAlpha=.35;ctx.beginPath();ctx.arc(c.x,c.y*K,c.r*(Math.max(0,Math.abs(c.prog))/100),0,7);ctx.stroke();
      });
    }
    if(missionId===5){
      KH.mission.rescue.forEach((u,i)=>{
        if(u.rescued||u.hp<=0)return;
        const q=.55+.45*Math.sin(frame*.12+i);ctx.globalAlpha=q;ctx.strokeStyle='#ffe06a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(u.x,u.y*K,18+4*Math.sin(frame*.06),0,7);ctx.stroke();ctx.fillStyle='#ffe06a';ctx.font='bold 11px Courier New';ctx.textAlign='center';ctx.fillText('RESCUE '+(i+1),u.x,u.y*K-24);
      });
    }
    ctx.restore();
  };

  // ---------- Mission result / stats ----------

  // ---------- Cinematic mission results ----------
  let resultRAF=0,resultActive=false,resultFxCanvas=null,resultFxCtx=null,resultParticles=[],resultStart=0,resultBaseFrame=0,resultBaseCam=null,resultResize=null;
  const resultStyle=document.createElement('style');
  resultStyle.textContent=`
    body.result-victory #ov,body.result-defeat #ov{justify-content:center;gap:7px;background:radial-gradient(circle at 50% 28%,rgba(21,82,128,.72),rgba(2,7,14,.98) 72%);overflow:hidden}
    body.result-victory #ov #lg,body.result-defeat #ov #lg{opacity:.12;transform:scale(.62);margin:0;pointer-events:none}
    body.result-victory #ov #ot{font:900 clamp(48px,9vw,112px)/.9 Orbitron,sans-serif;letter-spacing:.13em;color:#e9fbff;text-shadow:0 0 12px #5ee9ff,0 0 42px rgba(60,180,255,.75),0 5px 0 #06243a;animation:victoryReveal 1.05s cubic-bezier(.12,.8,.2,1) both;margin:0;position:relative;z-index:2}
    body.result-defeat #ov #ot{font:900 clamp(42px,7vw,86px)/.9 Orbitron,sans-serif;letter-spacing:.12em;color:#ffd5d0;text-shadow:0 0 18px rgba(255,80,65,.5),0 4px 0 #310d0b;margin:0;position:relative;z-index:2}
    body.result-victory #ov #op,body.result-defeat #ov #op{display:none}
    #resultsBlock.resultCinePanel{display:block!important;width:min(760px,94%);max-height:52vh;overflow:auto;background:linear-gradient(180deg,rgba(5,24,40,.88),rgba(3,11,20,.9));border:1px solid #397da5;border-top:2px solid #65eaff;border-bottom:2px solid #2c5f7c;padding:14px 18px;box-shadow:0 16px 60px rgba(0,0,0,.7),inset 0 0 35px rgba(50,180,240,.08);position:relative;z-index:2}
    body.result-defeat #resultsBlock.resultCinePanel{border-top-color:#a34b43;border-bottom-color:#65312e;background:linear-gradient(180deg,rgba(35,12,14,.9),rgba(12,6,10,.94));}
    .resultKicker{font:700 10px Orbitron,sans-serif;letter-spacing:3px;color:#66dfff}.resultMission{font:800 18px Orbitron,sans-serif;letter-spacing:1px;color:#fff;margin:3px 0}.resultCommend{font:700 14px Rajdhani,sans-serif;letter-spacing:2px;color:#ffe29a;text-transform:uppercase;margin:3px 0 10px}
    .resultStars{display:flex;justify-content:center;gap:12px;height:55px;margin:2px 0 4px}.resultStars span{font-size:44px;line-height:50px;color:#ffd86a;text-shadow:0 0 16px rgba(255,206,90,.8),0 0 35px rgba(255,180,50,.35);opacity:0;transform:translateY(-35px) scale(2.2) rotate(-18deg)}.resultStars span.stamp{animation:starStamp .52s cubic-bezier(.16,1.5,.3,1) both}
    .resultStats{display:grid;grid-template-columns:1fr auto;gap:4px 20px;text-align:left;border-top:1px solid #285a76;border-bottom:1px solid #285a76;padding:10px 0;margin:5px 0 9px}.resultStats span{font:700 10px Orbitron,sans-serif;letter-spacing:1.5px;color:#71a7be}.resultStats b{font:800 14px Orbitron,sans-serif;color:#e9f8ff;text-align:right;min-width:90px}
    .resultQuote{font:600 14px Rajdhani,sans-serif;color:#a9ccdc;text-align:center;letter-spacing:.5px}.resultRank{font:900 13px Orbitron,sans-serif;color:#7cf5c0;letter-spacing:2px;text-align:center;margin-top:7px}
    body.result-defeat .resultRank{color:#ff8c82}.resultButtonsCine{position:relative;z-index:3}
    #resultFx{position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none}
    @keyframes victoryReveal{0%{opacity:0;transform:scale(2.5) translateY(-25px);filter:blur(12px)}55%{opacity:1;transform:scale(.96) translateY(0);filter:blur(0)}100%{opacity:1;transform:scale(1)}}
    @keyframes starStamp{0%{opacity:0;transform:translateY(-35px) scale(2.2) rotate(-18deg)}65%{opacity:1;transform:translateY(4px) scale(.9) rotate(2deg)}100%{opacity:1;transform:none}}
    @media(max-width:700px){#resultsBlock.resultCinePanel{max-height:56vh;padding:10px}.resultStars span{font-size:35px}.resultStats b{font-size:12px}}
  `;
  document.head.appendChild(resultStyle);
  function stopResultCinematic(){
    resultActive=false;
    if(resultRAF)cancelAnimationFrame(resultRAF);resultRAF=0;
    if(resultResize)removeEventListener('resize',resultResize);
    resultResize=null;resultParticles=[];
    if(resultFxCanvas&&resultFxCanvas.parentNode)resultFxCanvas.parentNode.removeChild(resultFxCanvas);
    resultFxCanvas=null;resultFxCtx=null;
    cv.style.transform='';cv.style.transformOrigin='';
  }
  function resultTone(i,success){
    try{
      if(mute)return;
      const notes=success?[523,659,784,1047]:[220,196,165],f=notes[Math.max(0,Math.min(notes.length-1,i-1))];
      tn(f,.22,'triangle',success?.11:.07,success?80:-35);
      tn(f*1.5,.18,'sine',success?.045:.025,0,.07);
      if(success&&i===3)tn(1047,.5,'sine',.08,0,.12);
    }catch(e){}
  }
  function resultSting(success){
    try{
      au();if(!AC||mute)return;
      if(success){
        [523,659,784,1047].forEach((f,i)=>tn(f,.45,'triangle',.07,40,.08+i*.075));
        bel(79,AC.currentTime+.42,.055);bel(84,AC.currentTime+.72,.065);
      }else{
        tn(220,.8,'sine',.09,-55,.05);tn(165,.95,'triangle',.06,-35,.22);nxs(.55,.055,650,'lowpass',.08,260);
      }
    }catch(e){}
  }
  function resultBurst(x,y){
    const hues=['#fff4ba','#ffda67','#91edff','#a7ffe1','#ff8fc3'];
    for(let i=0;i<85;i++){
      const a=Math.random()*Math.PI*2,s=2.3+Math.random()*8.2,life=75+Math.random()*55;
      resultParticles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life,max:life,r:2+Math.random()*4.5,c:hues[i%hues.length]});
    }
  }
  function startResultCinematic(success){
    stopResultCinematic();resultActive=true;resultStart=performance.now();resultBaseFrame=frame;resultBaseCam={x:cam.x,y:cam.y};
    document.body.classList.toggle('result-victory',!!success);document.body.classList.toggle('result-defeat',!success);
    document.body.classList.add('outside-match');window.korhalSyncHUD?.();
    resultFxCanvas=document.createElement('canvas');resultFxCanvas.id='resultFx';$id('ov').appendChild(resultFxCanvas);resultFxCtx=resultFxCanvas.getContext('2d');
    resultResize=()=>{resultFxCanvas.width=$id('ov').clientWidth||innerWidth;resultFxCanvas.height=$id('ov').clientHeight||innerHeight};resultResize();addEventListener('resize',resultResize);
    resultSting(success);
    const statEls=results.querySelectorAll('[data-count]'),targets={time:Math.floor(resultBaseFrame/60),built:KH.stats.built||0,lost:KH.stats.lost||0,gatherM:Math.floor(KH.stats.gatherM||0),gatherG:Math.floor(KH.stats.gatherG||0),kills:typeof STAT!=='undefined'?STAT.k:0};
    let lastBurst=-2,stamped=0;
    function tick(now){
      if(!resultActive)return;
      const t=(now-resultStart)/1000;
      frame=resultBaseFrame+Math.floor(t*60);
      const cc=campaignCC||B.find(b=>b.team===1&&b.t==='cc'),enemy=B.find(b=>b.team===2&&b.t==='hatchery')||B.find(b=>b.team===2);
      const fx=Math.min(1,t/5),target=success?(t<2.2?cc:enemy||cc):cc;
      if(target){
        const sway=success?Math.sin(t*.55)*90:Math.sin(t*.32)*38;
        cam.x=target.x-cv.width/2+sway;
        cam.y=target.y*K-cv.height/2+Math.cos(t*.42)*(success?45:24);
        clampCam();
      }
      const zoom=success?1+Math.min(.1,t*.018):1+Math.min(.035,t*.008);
      fog();draw();cv.style.transformOrigin='50% 50%';cv.style.transform=`scale(${zoom})`;
      const ew=resultFxCanvas.width,eh=resultFxCanvas.height;resultFxCtx.clearRect(0,0,ew,eh);
      if(success&&t-lastBurst>.46){lastBurst=t;resultBurst(ew*(.12+Math.random()*.76),eh*(.14+Math.random()*.55))}
      for(let i=resultParticles.length-1;i>=0;i--){const p=resultParticles[i];p.life--;p.x+=p.vx;p.y+=p.vy;p.vy+=.055;const q=Math.max(0,p.life/p.max);resultFxCtx.globalAlpha=Math.min(1,q*1.7);
       resultFxCtx.strokeStyle=p.c||'#ffdf89';resultFxCtx.lineWidth=Math.max(1,p.r*q*1.1);resultFxCtx.lineCap='round';
       resultFxCtx.shadowColor=p.c||'#ffe8a1';resultFxCtx.shadowBlur=18*q;
       resultFxCtx.beginPath();resultFxCtx.moveTo(p.x-p.vx*3.8,p.y-p.vy*3.8);resultFxCtx.lineTo(p.x,p.y);resultFxCtx.stroke();
       resultFxCtx.fillStyle='#fff9e1';resultFxCtx.beginPath();resultFxCtx.arc(p.x,p.y,p.r*q+1.3,0,Math.PI*2);resultFxCtx.fill();resultFxCtx.shadowBlur=0;if(p.life<=0)resultParticles.splice(i,1)}
      resultFxCtx.globalAlpha=1;
      const countP=Math.min(1,Math.max(0,(t-.35)/2.5));const ease=1-Math.pow(1-countP,3);
      statEls.forEach(el=>{const k=el.dataset.count,v=Math.round((targets[k]||0)*ease);el.textContent=k==='time'?String(Math.floor(v/60)).padStart(2,'0')+':'+String(v%60).padStart(2,'0'):v.toLocaleString()});
      if(success){
        const wanted=success?Math.min(3,ratings[missionId]||3):0;
        while(stamped<wanted&&t>.65+stamped*.48){stamped++;const sEl=results.querySelector('[data-star="'+stamped+'"]');if(sEl)sEl.classList.add('stamp');resultTone(stamped,true)}
      }
      resultRAF=requestAnimationFrame(tick);
    }
    resultRAF=requestAnimationFrame(tick);
  }
  const oldEndHolistic=end;
  end=function(t,c){
    if(gameKind==='campaign'&&missionId===4&&/VICTORY|COMPLETE|SECURED/i.test(t)){
      if(KH.mission.caps.length!==3||!KH.mission.caps.every(p=>p.owner===1)||KH.mission.capHold<3600)return;
    }
    if(over)return;
    const success=/VICTORY|COMPLETE/.test(t);
    oldEndHolistic(t,c);
    if(success&&gameKind==='campaign'){
      unlocked=Math.max(unlocked,Math.min(5,missionId+1));
      const secs=Math.floor(frame/60),old=KH.campaignMeta[missionId]||{};
      KH.campaignMeta[missionId]={bestTime:old.bestTime?Math.min(old.bestTime,secs):secs,stars:Math.max(old.stars||0,ratings[missionId]||1)};
      saveCampaign();
    }
    const secs=Math.floor(frame/60),stats=KH.stats,unitBuilt=stats.built,unitLost=stats.lost,buildLost=Math.max(0,STAT.l-unitLost);
    const stars=gameKind==='campaign'?(ratings[missionId]||0):(success?3:0);
    const rank=success?(stars>=3?'DISTINGUISHED COMMAND':'TACTICAL COMMANDER'):(gameKind==='campaign'?'FIELD COMMAND — REASSESS':'FIELD COMMAND — REGROUP');
    const quote=success?(gameKind==='campaign'?'Sector Korhal command recognizes the operation. The line holds.':'The Swarm is broken. Hold the line and prepare for the next deployment.'):(gameKind==='campaign'?'The objective was lost. Pull back, rebuild, and redeploy.':'Your perimeter collapsed. Regroup and try again.');
    results.classList.add('resultCinePanel');
    results.innerHTML=`<div class="resultKicker">${success?'AFTER-ACTION COMMENDATION':'AFTER-ACTION REPORT'} · ${gameKind==='campaign'?'OPERATION '+MISSIONS[missionId].num:'SKIRMISH'}</div><div class="resultMission">${gameKind==='campaign'?MISSIONS[missionId].title:'SECTOR KORHAL'}</div><div class="resultCommend">${rank}</div><div class="resultStars">${[1,2,3].map(i=>`<span data-star="${i}">${i<=stars?'★':'☆'}</span>`).join('')}</div><div class="resultStats"><span>MISSION TIME</span><b data-count="time">00:00</b><span>UNITS BUILT</span><b data-count="built">0</b><span>UNITS LOST</span><b data-count="lost">0</b><span>RESOURCES GATHERED</span><b data-count="gatherM">0</b><span>VESPENE GATHERED</span><b data-count="gatherG">0</b><span>ZERG ELIMINATED</span><b data-count="kills">0</b><span>BUILDINGS LOST</span><b>${buildLost}</b></div><div class="resultQuote">${quote}</div><div class="resultRank">${success?'★ '+rank+' ★':'STATUS: '+rank}</div>`;
    resultButtons.innerHTML='';
    if(gameKind==='campaign'&&success&&missionId<MISSIONS.length-1)resultButtons.innerHTML+='<button class="resultAction" data-result="next">NEXT OPERATION →</button>';
    resultButtons.innerHTML+='<button class="resultAction" data-result="home">MAIN MENU</button>';
    resultButtons.classList.add('resultButtonsCine');
    resultButtons.style.display='flex';
    document.body.classList.add('outside-match');
    window.korhalSyncHUD?.();
    startResultCinematic(success);
  };

  // Existing next-op handler is clamped to 2; replace it.
  ov.addEventListener('click',e=>{
    const b=e.target.closest('button[data-result="next"]');if(!b)return;
    e.preventDefault();e.stopImmediatePropagation();chosen=Math.min(5,missionId+1);gameKind='campaign';showView('campaign');
  },true);

  // ---------- Top bar: army count + income ----------
  const topRes=$id('top')?.querySelector('.res');
  if(topRes&&!$id('armyTop')){
    const ar=document.createElement('span');ar.id='armyTop';ar.className='ri ra';ar.innerHTML='<i></i><b id=armyTopV>ARMY 0</b>';topRes.appendChild(ar);
    const inc=document.createElement('span');inc.id='incomeTop';inc.className='incomeTop';inc.textContent='+0 M/m · +0 G/m';topRes.appendChild(inc);
  }
  const topStyle=document.createElement('style');
  topStyle.textContent=`
    #armyTop{margin-left:4px;color:#dff}
    body.outside-match #productionPanel,body.outside-match #techToggle,body.outside-match #techTree{display:none!important}
    #armyTop i{display:inline-block;width:8px;height:8px;border:1px solid #7cf5c0;margin-right:5px;box-shadow:0 0 6px #7cf5c0}
    #incomeTop{font:700 10px Rajdhani,Arial,sans-serif;color:#78c9df;letter-spacing:1px;white-space:nowrap}
    #productionPanel{position:absolute;left:205px;right:8px;bottom:178px;z-index:2;display:flex;gap:5px;align-items:center;pointer-events:none;overflow:hidden}
    .pqItem{min-width:116px;max-width:150px;padding:4px 6px;background:rgba(5,16,25,.9);border:1px solid #28546b;color:#bde5f5;font:700 9px Rajdhani,Arial,sans-serif}
    .pqItem b{display:block;color:#fff;font:700 9px Orbitron,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .pqBar{height:3px;background:#17303e;margin-top:3px}.pqBar i{display:block;height:100%;background:#55d9ff}
    .pqItem small{color:#7da6b7}
    #techToggle{position:absolute;right:10px;bottom:176px;z-index:3;pointer-events:auto;border:1px solid #397194;background:#0d2339;color:#9fe7ff;font:700 10px Rajdhani,sans-serif;padding:5px 9px;cursor:pointer}
    #techTree{position:absolute;right:10px;bottom:214px;width:330px;max-height:310px;overflow:auto;z-index:6;display:none;padding:12px;background:rgba(4,15,26,.96);border:1px solid #397194;box-shadow:0 10px 35px #000c;color:#b9dbea;font:500 12px Rajdhani,sans-serif}
    #techTree h3{font:800 12px Orbitron,sans-serif;color:#8feaff;letter-spacing:2px;margin-bottom:8px}
    .techRow{display:grid;grid-template-columns:1fr 18px 1fr;gap:5px;align-items:center;margin:4px 0}
    .techNode{padding:4px 6px;border:1px solid #2a5a78;background:#0b1d2c;color:#d8f3ff}.techArrow{text-align:center;color:#ffe06a}
    .reportGrid{display:grid;grid-template-columns:1fr auto;gap:4px 20px;margin:12px auto;max-width:430px;text-align:left;border-top:1px solid #29556e;border-bottom:1px solid #29556e;padding:9px 0}
    .reportGrid span{color:#6fa1b7;font:700 10px Orbitron,sans-serif;letter-spacing:1px}.reportGrid b{color:#e9f8ff;text-align:right}
    @media(max-width:900px){#incomeTop{display:none}#productionPanel{left:8px}.pqItem{min-width:92px}.pqItem:nth-child(n+5){display:none}}
  `;
  document.head.appendChild(topStyle);

  const prod=document.createElement('div');prod.id='productionPanel';$id('gc').appendChild(prod);
  const techBtn=document.createElement('button');techBtn.id='techToggle';techBtn.textContent='TECH TREE';$id('gc').appendChild(techBtn);
  const tech=document.createElement('div');tech.id='techTree';tech.innerHTML='<h3>TERRAN TECH TREE</h3><div class=techRow><span class=techNode>COMMAND CENTER</span><span class=techArrow>→</span><span class=techNode>BARRACKS</span></div><div class=techRow><span class=techNode>BARRACKS</span><span class=techArrow>→</span><span class=techNode>FACTORY</span></div><div class=techRow><span class=techNode>FACTORY</span><span class=techArrow>→</span><span class=techNode>STARPORT / ARMORY</span></div><div class=techRow><span class=techNode>BARRACKS</span><span class=techArrow>→</span><span class=techNode>ACADEMY</span></div><div class=techRow><span class=techNode>ENGINEERING BAY</span><span class=techArrow>→</span><span class=techNode>INFANTRY WPN / ARMOR</span></div><div class=techRow><span class=techNode>ACADEMY</span><span class=techArrow>→</span><span class=techNode>MEDIC / FIREBAT / STIM</span></div><div class=techRow><span class=techNode>ARMORY</span><span class=techArrow>→</span><span class=techNode>GOLIATH / VEHICLE UPGRADES</span></div><p style="margin-top:9px;color:#789">Hover a locked command to see its prerequisite and resource cost.</p>'; $id('gc').appendChild(tech);
  techBtn.onclick=()=>{tech.style.display=tech.style.display==='block'?'none':'block'};
  addEventListener('keydown',e=>{if(e.key==='Escape')tech.style.display='none'},true);

  let lastProductionSignature='';
  const renderProduction=()=>{
    if(!started||over){if(prod.childElementCount)prod.replaceChildren();lastProductionSignature='';return}
    const bs=B.filter(b=>b.team===1&&b.done&&b.q&&b.q.length);
    const key=bs.map(b=>b.id+':'+b.t+':'+b.q.join(',')+':'+(100*b.qt/T[b.q[0]].bt|0)).join('|');
    if(key===lastProductionSignature)return;
    lastProductionSignature=key;
    // Build a new panel only when an actual production label/progress percentage changes.
    prod.innerHTML=bs.map(b=>{
      const q=b.q[0],pct=Math.max(0,Math.min(1,b.qt/T[q].bt)),tail=b.q.length>1?' +'+(b.q.length-1):'';
      return `<div class=pqItem><b>${T[b.t].n}</b><span>${T[q].n}${tail}</span><div class=pqBar><i style="width:${pct*100}%"></i></div><small>${Math.floor(pct*100)}%</small></div>`;
    }).join('');
  };
  addEventListener('korhal:reset',()=>{lastProductionSignature='';});

  // Resource income / army HUD and production queue.
  const oldUpdHUDHolistic=updHUD;
  let lastHudSignature='';
  updHUD=function(){
    const supply=sup(),army=U.filter(u=>u.team===1&&u.hp>0&&u.t!=='scv'&&u.t!=='convoy').length;
    const production=B.filter(b=>b.team===1&&b.done&&b.q?.length).map(b=>b.id+':'+b.q.join(',')+':'+(100*b.qt/T[b.q[0]].bt|0)).join(';');
    const key=[started,over,res.m|0,res.g|0,supply.u,supply.x,wave,Math.ceil(wt/60),army,
      Math.round(KH.income.rateM),Math.round(KH.income.rateG),production,SPD].join('|');
    if(key===lastHudSignature)return;
    lastHudSignature=key;
    oldUpdHUDHolistic();
    if(!started||over){renderProduction();return}
    const armyEl=$id('armyTopV'),incomeEl=$id('incomeTop');
    if(armyEl)armyEl.textContent='ARMY '+army+' · '+supply.u+'/'+supply.x;
    if(incomeEl)incomeEl.textContent='+'+Math.round(KH.income.rateM)+' M/m · +'+Math.round(KH.income.rateG)+' G/m';
    renderProduction();
  };
  addEventListener('korhal:reset',()=>{lastHudSignature='';});

  // Idle SCV count remains on the existing button, but make the shortcut explicit.
  if($id('qi'))$id('qi').title='Idle SCV — click or press ,';

  // ---------- Better tech tooltips for locked buttons ----------
  const oldCardHolistic=card;
  card=function(){
    oldCardHolistic();
    setTimeout(()=>{
      document.querySelectorAll('#card .b.x').forEach(b=>{
        const txt=(b.textContent||'').toLowerCase();
        let req='';
        if(txt.includes('factory'))req='Requires Barracks and enough minerals/gas.';
        else if(txt.includes('starport'))req='Requires Factory and enough minerals/gas.';
        else if(txt.includes('armory'))req='Requires Factory and 100 gas.';
        else if(txt.includes('academy'))req='Requires Barracks.';
        else if(txt.includes('medic')||txt.includes('firebat'))req='Requires Academy.';
        else if(txt.includes('goliath'))req='Requires Armory.';
        else if(txt.includes('wraith'))req='Requires Starport.';
        else if(txt.includes('stim'))req='Requires Academy and 100 minerals + 100 gas.';
        else req='Unavailable: missing resources, supply, or prerequisite tech.';
        b.title=req;
      });
    },0);
  };

  // ---------- Save control groups with current units only ----------
  addEventListener('korhal:reset',()=>{for(const k in grp)delete grp[k]});
  const oldDrawGroup=draw;
  draw=function(){
    oldDrawGroup();
    if(!started||over)return;
    // Draw a tiny group-number badge next to the first selected unit.
    ctx.save();ctx.font='bold 10px Courier New';ctx.textAlign='center';
    Object.keys(grp).forEach(k=>{
      const g=grp[k].filter(u=>u.hp>0);if(!g.length)return;
      const u=g[0];const x=u.x-cam.x+12,y=u.y*K-cam.y-16;
      ctx.fillStyle='rgba(3,12,18,.9)';ctx.fillRect(x-7,y-7,14,14);ctx.strokeStyle='#7cf5c0';ctx.strokeRect(x-7,y-7,14,14);ctx.fillStyle='#fff';ctx.fillText(k,x,y+3);
    });ctx.restore();
  };

  // ---------- Campaign / result UI styling ----------
  const campStyle=document.createElement('style');
  campStyle.textContent='#ov #campList{grid-template-columns:repeat(3,minmax(0,1fr))}@media(max-width:900px){#ov #campList{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:620px){#ov #campList{grid-template-columns:1fr}}';
  document.head.appendChild(campStyle);

  // Make current mission progress persist visibly after a result.
  addEventListener('korhal:reset',()=>{missionHud.hidden=true;tech.style.display='none'});

  // Expose small deterministic test hooks, harmless during normal play.
  window.korhalTest={
    zergEconomy:()=>({drones:zDrones().length,hatches:zHatches().length,extractors:zExtractors().length,larvae:U.filter(u=>u.team===2&&u.t==='larva'&&u.hp>0).length,minerals:KH.z.m,gas:KH.z.g}),
    missionCount:()=>MISSIONS.length,
    stats:()=>({...KH.stats}),
    forceZergBuild:(t)=>{const h=zHatches()[0];const p=t==='extractor'?zFreeGeyser(h):zBuildSpot(t,h);return p?zStartMorph(t,p.x,p.y,h):null}
  };

}catch(e){console.error('Korhal holistic patch initialization error',e)}
})();

showView('home');
})();



window.Korhal.modules.campaign.loaded=true;

// v22: StarCraft-style Supply Depot lowering/raising. The depot remains a normal
// attack target; only its ground-pathing footprint and visible model change.
(()=>{
 try{
  const isDepot=e=>!!(e&&e.b&&e.team===1&&e.t==='depot'&&e.done&&e.hp>0);
  function depotOccupants(b){
   const h=b.size/2;
   return U.filter(u=>u&&u.hp>0&&!u.air&&Math.abs(u.x-b.x)<h&&Math.abs(u.y-b.y)<h);
  }
  function nudgeDepotOccupants(b,units){
   if(!units.length)return;
   const h=b.size/2,affected=new Set(units),placed=[];
   units.sort((u,v)=>Math.hypot(u.x-b.x,u.y-b.y)-Math.hypot(v.x-b.x,v.y-b.y));
   for(const u of units){
    let best=null,bestD=Infinity;
    for(let layer=0;layer<4&&!best;layer++){
     const d=h+u.rad+5+layer*13;
     for(let i=0;i<32;i++){
      const a=i*Math.PI/16,px=b.x+Math.cos(a)*d,py=b.y+Math.sin(a)*d;
      if(px<12||py<12||px>W-12||py>H-12||bs(px,py))continue;
      if(Math.abs(px-b.x)<h+u.rad*.5&&Math.abs(py-b.y)<h+u.rad*.5)continue;
      if(B.some(o=>o!==b&&o.hp>0&&!(o.t==='depot'&&o.lowered)&&Math.abs(px-o.x)<o.size/2+u.rad*.45&&Math.abs(py-o.y)<o.size/2+u.rad*.45))continue;
      if(elev(px,py)!==elev(b.x,b.y))continue;
      let crowded=false;
      for(const v of U){if(v===u||v.hp<=0||v.air||affected.has(v))continue;if(Math.hypot(v.x-px,v.y-py)<u.rad+v.rad+3){crowded=true;break}}
      if(crowded)continue;
      for(const q of placed){if(Math.hypot(q.x-px,q.y-py)<u.rad+q.rad+3){crowded=true;break}}
      if(crowded)continue;
      const dd=(px-u.x)**2+(py-u.y)**2;if(dd<bestD){bestD=dd;best={x:px,y:py}}
     }
    }
    if(!best){
     const f=freeSpot(b.x,b.y,(u.id||0)%7,b);
     if(f&&!bs(f.x,f.y)&&!(B.some(o=>o!==b&&o.hp>0&&!(o.t==='depot'&&o.lowered)&&Math.abs(f.x-o.x)<o.size/2+u.rad*.45&&Math.abs(f.y-o.y)<o.size/2+u.rad*.45)))best=f;
    }
    if(best){u.x=best.x;u.y=best.y;u.lx=u.x;u.ly=u.y;u.pk=null;u.pa=null;u.pe=0;u._direct=false;placed.push(u)}
   }
  }
  function setDepotsLowered(depots,lowered){
   const changed=depots.filter(b=>isDepot(b)&&!!b.lowered!==lowered);
   if(!changed.length){say(lowered?'Selected depots are already lowered':'Selected depots are already raised');return}
   let moved=0;
   for(const b of changed){
    if(lowered){
     // fp uses the same sampled footprint as map/pathfinding collision. MAPREV
     // changes with it, invalidating cached routes for both teams.
     fp(b,-1);b.lowered=true;b._pathingRemoved=true;
    }else{
     const occupants=depotOccupants(b);
     b.lowered=false;b._pathingRemoved=false;fp(b,1);
     nudgeDepotOccupants(b,occupants);moved+=occupants.length;
    }
    b._depotToggleFrame=frame;
   }
   navCache?.clear?.();sig='';
   FX.push({k:'bm',x:changed[0].x,y:changed[0].y,r:changed[0].size*1.15,l:20,m:20,c:lowered?'#7cf5c0':'#ffd36b'});
   snd('click');say(lowered?'Supply Depot lowered':'Supply Depot raised'+(moved?' — units cleared':' '));
   updSel();card();
  }
  const priorCardV22=card;
  card=function(){
   priorCardV22();
   const selected=sel.slice();
   if(!selected.length||selected.some(e=>!isDepot(e)))return;
   const canRaise=selected.some(b=>b.lowered),canLower=selected.some(b=>!b.lowered);
   mkBtn(selected.length>1?'Raise Selected Depots':'Raise Depot','r',canRaise?'restore pathing and height':'already raised',()=>setDepotsLowered(selected,false),!canRaise);
   mkBtn(selected.length>1?'Lower Selected Depots':'Lower Depot','l',canLower?'sink flat and open the path':'already lowered',()=>setDepotsLowered(selected,true),!canLower);
  };
  window.Korhal.setDepotsLowered=(lowered)=>setDepotsLowered(sel.filter(isDepot),!!lowered);
 }catch(e){console.error('Supply Depot raise/lower initialization',e)}
})();

