/* SECTOR KORHAL v12 — split module: map */
window.Korhal=window.Korhal||{};
window.Korhal.modules=window.Korhal.modules||{};
window.Korhal.modules.map=window.Korhal.modules.map||{};
// ---------- map ----------
let TC,tt;
function field(cx,cy,a0){const R=Math.random,n=7+(R()*2|0),sp=.32+R()*.04,a1=a0+(R()-.5)*.6,r0=140+R()*8;for(let i=0;i<n;i++){const a=a1+(i-(n-1)/2)*sp,r=r0+(R()-.5)*12+(i%2?5:0);P.push({x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r,a:1300+R()*400|0})}}
function mk(t,tm,x,y){const d=T[t];if(d.size&&tm==1&&t!='refinery'&&window.gsn){x=gsn(x,d.size);y=gsn(y,d.size)}const e={t,team:tm,x,y,hp:d.hp,maxHp:d.hp,st:'idle',tx:x,ty:y,cd:0,ang:Math.random()*6.28,id:Math.random()*1000|0};
 if(d.size){e.b=1;e.q=[];e.qt=0;e.pr=0;e.done=tm==2?1:0;e.size=d.size;if(!e.done)e.hp=d.hp*.1;B.push(e);fp(e,1)}else{e.lx=x;e.ly=y;if(tm==2)e.hp=e.maxHp=d.hp*DF.hp;e.rad=d.rad;e.air=d.air;e.mt=0;e.cr=0;U.push(e)}return e}
function freeSpot(x,y,seed=0,owner=null){
 const r0=owner?owner.size/2+28:64;
 for(let r=r0;r<r0+92;r+=14)for(let i=0;i<28;i++){
  const a=(i/28)*Math.PI*2+seed*.4,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;
  if(!bp(px,py)&&(!owner||elev(px,py)===elev(owner.x,owner.y))
   &&U.every(u=>Math.hypot(u.x-px,u.y-py)>18)
   &&P.every(p=>Math.hypot(p.x-px,p.y-py)>18))return{x:px,y:py}}
 return{x:Math.max(16,Math.min(W-16,x)),y:Math.max(16,Math.min(H-16,y))}}
function init(){const M=MAP;M.f.forEach(([x,y,a])=>field(x,y,a));M.g.forEach(([x,y])=>GY.push({x,y}));M.x.forEach(([x,y])=>EX.push({x,y}));
 terrain();const[cx,cy]=M.pc,c=mk('cc',1,cx,cy);c.done=1;c.hp=1200;
 for(let i=0;i<6;i++){const pos=freeSpot(c.x,c.y,i,c),u=mk('scv',1,pos.x,pos.y);u.st='mine';u.pt=P[i]}
 [M.ec,M.en].forEach(([x,y],k)=>{mk('hatchery',2,x,y);const sunken=mk('sunken',2,x-70,y-60);if(cfg.d===0){sunken.hp=200;sunken.maxHp=200;}else mk('sunken',2,x-20,y-90);for(let i=0,n=Math.ceil((4+k*2)*DF.m);i<n;i++)mk('zergling',2,x-60+i*22,y+70).guard=1;for(let i=0,n=Math.ceil(2*DF.m);i<n;i++)mk('hydra',2,x+60,y-50+i*40).guard=1});
 updHUD();updSel();card()}
// ---------- helpers ----------
function sup(){let u=0,x=0;U.forEach(e=>{if(e.team==1)u+=T[e.t].s});B.forEach(b=>{if(b.team==1){b.q.forEach(q=>u+=T[q].s);if(b.done)x+=T[b.t].sup||0}});return{u,x:Math.min(x,200)}}
function vis(x,y){for(const v of VS)if((v[0]-x)**2+(v[1]-y)**2<v[2]*v[2])return 1;return 0}
const seen=e=>e.team==1||(vis(e.x,e.y)&&(!e.cl||detd(e)));
// ---------- terrain, cliffs, pathfinding ----------
const CS=32,GW=75,GH=50,ST=new Uint8Array(GW*GH),BB=new Uint8Array(GW*GH),EL=new Uint8Array(GW*GH),RAM=new Uint8Array(GW*GH),TR=[];
const elev=(x,y)=>{const i=ci(x,y);return i<0?0:EL[i]};
// v17: strictly visual exclusion area. No collision, map topology, or resource changes.
// Includes the whole starting plateau, mining ring, base ramp and nearest expansion.
const playerDecorMemo=new WeakMap();
function playerDecorClear(x,y,extra=0){
 const m=MAP;if(!m||!m.pc)return true;
 let zones=playerDecorMemo.get(m);
 if(!zones){
  const pc=m.pc;zones=[{kind:'circle',x:pc[0],y:pc[1],r:530}];
  for(const mesa of m.p||[]){
   if(!inE(mesa,Math.floor(pc[0]/CS),Math.floor(pc[1]/CS)))continue;
   const mx=mesa.cx*CS,my=mesa.cy*CS;
   zones.push({kind:'rect',x:mx,y:my,rx:mesa.rx*CS+135,ry:mesa.ry*CS+135});
   const mouth=mesa.s==='e'?[mx+mesa.rx*CS,mesa.a*CS+CS/2]:mesa.s==='w'?[mx-mesa.rx*CS,mesa.a*CS+CS/2]:mesa.s==='s'?[mesa.a*CS+CS/2,my+mesa.ry*CS]:[mesa.a*CS+CS/2,my-mesa.ry*CS];
   zones.push({kind:'circle',x:mouth[0],y:mouth[1],r:235});
  }
  const natural=(m.x||[]).filter(p=>Math.hypot(p[0]-pc[0],p[1]-pc[1])<1050).sort((a,b)=>Math.hypot(a[0]-pc[0],a[1]-pc[1])-Math.hypot(b[0]-pc[0],b[1]-pc[1]))[0];
  if(natural)zones.push({kind:'circle',x:natural[0],y:natural[1],r:345});
  playerDecorMemo.set(m,zones);
 }
 for(const z of zones){
  if(z.kind==='rect'){if(Math.abs(x-z.x)<z.rx+extra&&Math.abs(y-z.y)<z.ry+extra)return false}
  else if((x-z.x)**2+(y-z.y)**2<(z.r+extra)**2)return false;
 }
 return true;
}
if(typeof CanvasRenderingContext2D!='undefined'&&!CanvasRenderingContext2D.prototype.roundRect)CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath()};
let DF,MAP,cfg={m:0,d:1},hotT=0;
const DFS=[{n:'Easy',d:'Longer grace period. Smaller, slower Zerg waves.',m:.55,hp:.9,w0:6000,iv:4200,res:400,t:-2},{n:'Medium',d:'Balanced attack timing and wave strength.',m:1,hp:1,w0:3600,iv:2700,res:200,t:0},{n:'Hard',d:'Earlier, larger waves with tougher Zerg.',m:1.3,hp:1.1,w0:2400,iv:2100,res:150,t:1.2}];
const MAPS=[
{n:'Verdant Ridge',d:'Lush grassland. Cliff-top bases with one ramp each, rock ridges mid-map.',sw:'linear-gradient(135deg,#2f6a24,#7aa84a)',base:'#4b7a2e',pal:['#3f6b2a','#5b8a3b','#35592a','#6c9a44','#2f4d24','#7d8c3c','#4f8230'],sp:['#8fc25a','#2a4a1e','#a5cf6a'],tint:'rgba(190,225,100,.2)',l:['#2d6a2a','#357a30','#2f7129','#4a9a3c','#7ac45a'],q:['#1f5a2e','#256b34','#2f8040'],bu:['#2f6b2a','#3d8a35','#4c9a3a'],fl:['#fff','#ffe14a','#ff8fc2','#c9a0ff'],
 pc:[320,320],ec:[2080,1290],en:[1500,1200],f:[[320,320,3.9],[900,430,4.7],[1200,800,0],[1500,1200,1.6],[2080,1290,.8]],g:[[470,235],[1930,1370],[1520,1330],[760,300]],x:[[900,430],[1200,800],[1500,1200]],
 p:[{cx:11,cy:10.5,rx:9.4,ry:7.7,s:'e',a:10},{cx:65.5,cy:40.5,rx:8.8,ry:7.7,s:'w',a:40}],w:[{cx:34.5,cy:13,rx:2.2,ry:7},{cx:40.5,cy:38,rx:2.2,ry:7},{cx:54,cy:16,rx:6.2,ry:1.6}]},
{n:'Scorched Highlands',d:'Autumn badlands. You hold the northeast, the Swarm the southwest.',sw:'linear-gradient(135deg,#8a4a1e,#c9a24a)',base:'#7d6a34',pal:['#8a7438','#6e5c2c','#9a8444','#5e5028','#a08a4a','#74642f','#867030'],sp:['#b8a25a','#4a3c1c','#d0bd74'],tint:'rgba(235,190,100,.2)',l:['#9a3c1a','#b5541d','#a8461a','#d98a2e','#f0b04a'],q:['#5a3a1e','#6e4a24','#85602c'],bu:['#7a4a1e','#9a5a22','#b06a28'],fl:['#fff','#ff9a3c','#d63c2a','#ffd24a'],
 pc:[2060,330],ec:[340,1280],en:[800,980],f:[[2060,330,5.6],[1600,640,3.9],[1200,800,0],[800,980,3.9],[340,1280,2.4]],g:[[1950,250],[1700,760],[900,1090],[480,1400]],x:[[1600,640],[1200,800],[800,980]],
 p:[{cx:64.5,cy:10.5,rx:8.6,ry:7.6,s:'s',a:58},{cx:10.7,cy:40.5,rx:8.6,ry:7.6,s:'n',a:14}],w:[{cx:29.5,cy:19,rx:3.2,ry:6.5},{cx:47,cy:30,rx:6.5,ry:2.6},{cx:18,cy:24,rx:4.2,ry:2.4}]}];
const inE=(p,x,y)=>Math.abs((x+.5-p.cx)/p.rx)**2.6+Math.abs((y+.5-p.cy)/p.ry)**2.6<=1;
const ci=(x,y)=>x<0||y<0||x>=W||y>=H?-1:(x/CS|0)+(y/CS|0)*GW,bs=(x,y)=>{const i=ci(x,y);return i<0||ST[i]},bp=(x,y)=>{const i=ci(x,y);return i<0||ST[i]||BB[i]};
const canPass=(a,b)=>a>=0&&b>=0&&!ST[b]&&(EL[a]===EL[b]||(RAM[a]&&RAM[b]));
// Spatial broadphase used by targeting and collision checks. It is deliberately coarse
// (64px cells) so it reduces work without changing the exact distance tests.
const NSP=64,NSW=Math.ceil(W/NSP),NSH=Math.ceil(H/NSP),NAV=Array.from({length:NSW*NSH},()=>[]);
const nci=(x,y)=>{const cx=Math.max(0,Math.min(NSW-1,x/NSP|0)),cy=Math.max(0,Math.min(NSH-1,y/NSP|0));return cx+cy*NSW};
function rebuildSpatial(list=AL){for(const q of NAV)q.length=0;for(const e of list)if(e&&e.hp>0){NAV[nci(e.x,e.y)].push(e)}}
function nearEntities(x,y,r){
 const out=[],minx=Math.max(0,(x-r)/NSP|0),maxx=Math.min(NSW-1,(x+r)/NSP|0),miny=Math.max(0,(y-r)/NSP|0),maxy=Math.min(NSH-1,(y+r)/NSP|0);
 for(let cy=miny;cy<=maxy;cy++)for(let cx=minx;cx<=maxx;cx++)for(const e of NAV[cx+cy*NSW])out.push(e);
 return out;
}
// Allocation-free cell traversal in hot combat/collision paths. Legacy nearEntities remains
// available to extensions that intentionally request a returned array.
function visitNearby(x,y,r,fn){
 const a=Math.max(0,(x-r)/NSP|0),b=Math.min(NSW-1,(x+r)/NSP|0),c=Math.max(0,(y-r)/NSP|0),d=Math.min(NSH-1,(y+r)/NSP|0);
 for(let y0=c;y0<=d;y0++)for(let x0=a;x0<=b;x0++){
  const bucket=NAV[x0+y0*NSW];for(let i=0;i<bucket.length;i++)fn(bucket[i]);
 }
}
let MAPREV=0;
function fp(b,v){const h=b.size/2;for(let x=b.x-h;x<b.x+h;x+=16)for(let y=b.y-h;y<b.y+h;y+=16){const i=ci(x,y);if(i>=0)BB[i]=Math.max(0,BB[i]+v)}MAPREV++}
function rock(cx,cy,face){const x=cx*CS+CS/2,y=cy*CS+CS/2,j=()=>(Math.random()-.5)*7;ST[cx+cy*GW]=1;
 if(face){const g=tt.createLinearGradient(0,y,0,y+CS*.5+16);g.addColorStop(0,'#8c7c62');g.addColorStop(1,'#33271b');tt.fillStyle='rgba(0,0,0,.2)';tt.beginPath();tt.ellipse(x+4,y+CS*.5+16,CS*.8,10,0,0,7);tt.fill();tt.fillStyle=g;tt.beginPath();tt.ellipse(x,y+2,CS*.66,CS*.5+14,0,0,Math.PI);tt.fill()}
 tt.fillStyle='#7a6c54';tt.beginPath();tt.arc(x+j(),y+j(),CS*.66,0,7);tt.fill();tt.fillStyle='rgba(255,240,200,.24)';tt.beginPath();tt.arc(x-4+j(),y-6+j(),CS*.42,0,7);tt.fill();
 for(let i=0;i<4;i++){tt.fillStyle=Math.random()<.5?'rgba(0,0,0,.18)':'rgba(255,255,255,.12)';tt.beginPath();tt.arc(x+j()*3,y+j()*3,2+Math.random()*4,0,7);tt.fill()}}
// Sculpted biome terrain: continuous mesa tops, stratified cliff faces and traversable ramps.
// ST blocks cliff edges and ridges; EL is true playable high ground; RAM is the only transition.
function terrain(){
 const M=MAP, rand=Math.random, randN=(a,b)=>a+rand()*(b-a),water=M.base=='#9db8c9'||M.base=='#b9cddd';
 TC=document.createElement('canvas');TC.width=W;TC.height=H;tt=TC.getContext('2d');
 ST.fill(0);EL.fill(0);RAM.fill(0);TR.length=0;
 tt.fillStyle=M.base;tt.fillRect(0,0,W,H);
 // Broad mottled soil and deliberately subtle micro-texture.
 for(let i=0;i<3500;i++){
  let x=rand()*W,y=rand()*H,r=18+rand()*92;
  tt.globalAlpha=.035+rand()*.075;tt.fillStyle=M.pal[i%M.pal.length];
  tt.beginPath();tt.ellipse(x,y,r,r*(.3+rand()*.7),rand()*6.28,0,7);tt.fill()}
 tt.globalAlpha=.22;
 for(let i=0;i<12000;i++){
  let x=rand()*W,y=rand()*H;tt.fillStyle=M.sp[i%M.sp.length];
  tt.fillRect(x,y,rand()*2+1,rand()*2+1)}tt.globalAlpha=1;
 // Worn connecting tracks: map landmarks are easier to read from a distance.
 const trail=(a,b)=>{const x=(a[0]+b[0])*.5,y=(a[1]+b[1])*.5;
  tt.save();tt.lineCap='round';tt.lineJoin='round';
  tt.strokeStyle='rgba(22,19,13,.16)';tt.lineWidth=35;tt.beginPath();tt.moveTo(...a);tt.quadraticCurveTo(x+45,y-55,...b);tt.stroke();
  tt.strokeStyle='rgba(208,183,129,.105)';tt.lineWidth=23;tt.stroke();tt.restore()};
 (M.x||[]).forEach((p,i)=>{if(i&&Math.hypot(p[0]-M.x[i-1][0],p[1]-M.x[i-1][1])<800)trail(M.x[i-1],p)});
 // A quiet landing area around each starting and expansion site.
 [M.pc,M.ec,M.en,...(M.x||[])].forEach(([x,y])=>{
  const g=tt.createRadialGradient(x,y,16,x,y,125);g.addColorStop(0,'rgba(89,67,42,.25)');g.addColorStop(1,'rgba(89,67,42,0)');
  tt.fillStyle=g;tt.fillRect(x-125,y-125,250,250)});
 const rect=(x,y,w,h,color)=>{tt.fillStyle=color;tt.fillRect(x,y,w,h)},line=(x,y,X,Y,c,w)=>{tt.strokeStyle=c;tt.lineWidth=w;tt.beginPath();tt.moveTo(x,y);tt.lineTo(X,Y);tt.stroke()};
 const outline=(p,expand=0)=>{tt.beginPath();for(let i=0;i<=160;i++){
  const a=i/160*Math.PI*2,co=Math.cos(a),si=Math.sin(a),rx=p.rx*CS+expand,ry=p.ry*CS+expand;
  const x=p.cx*CS+Math.sign(co)*Math.abs(co)**(2/2.6)*rx,y=p.cy*CS+Math.sign(si)*Math.abs(si)**(2/2.6)*ry;
  i?tt.lineTo(x,y):tt.moveTo(x,y)}tt.closePath()};
 const mouths=[];
 for(const p of M.p){
  // Record elevation before generating the wall: the platforms are really traversable interiors.
  for(let y=0;y<GH;y++)for(let x=0;x<GW;x++)if(inE(p,x,y))EL[x+y*GW]=1;
  const cx=p.cx*CS,cy=p.cy*CS,isV=p.s=='n'||p.s=='s';
  const rx=p.rx*CS,ry=p.ry*CS;
  // Main cast shadow and the solid mesa cap.
  tt.save();tt.translate(12,19);outline(p,2);tt.shadowColor='rgba(0,0,0,.65)';tt.shadowBlur=25;
  tt.fillStyle='#191914';tt.fill();tt.restore();
  outline(p,1);const g=tt.createLinearGradient(cx-rx,cy-ry,cx+rx,cy+ry);
  g.addColorStop(0,M.pal[1]);g.addColorStop(.48,M.base);g.addColorStop(1,M.pal[3]);
  tt.fillStyle=g;tt.fill();tt.save();outline(p);tt.clip();
  tt.globalAlpha=.09;for(let i=0;i<480;i++){
   tt.fillStyle=M.sp[i%M.sp.length];tt.beginPath();tt.ellipse(cx+randN(-rx,rx),cy+randN(-ry,ry),randN(2,24),randN(1,9),rand()*7,0,7);tt.fill()}
  tt.globalAlpha=1;
  for(let i=0;i<4;i++){outline(p,-13-i*18);tt.lineWidth=1.7;tt.strokeStyle='rgba(255,248,203,'+(.12-i*.022)+')';tt.stroke()}
  tt.restore();
  outline(p,-7);tt.lineWidth=12;tt.strokeStyle='rgba(237,222,163,.17)';tt.stroke();
  outline(p,1);tt.lineWidth=5;tt.strokeStyle='rgba(22,18,14,.5)';tt.stroke();
  // Tile sides are carved shear rock, not isolated circular stones.
  for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){
   if(!inE(p,x,y))continue;
   const sides=[[1,0,'e'],[0,1,'s'],[-1,0,'w'],[0,-1,'n']].filter(([dx,dy])=>!inE(p,x+dx,y+dy));
   if(!sides.length)continue;
   const ramp=sides.some(([dx,dy])=>{
    const o=p.s;return (o=='e'&&dx==1&&Math.abs(y-p.a)<=1.4)||(o=='w'&&dx==-1&&Math.abs(y-p.a)<=1.4)||(o=='s'&&dy==1&&Math.abs(x-p.a)<=1.4)||(o=='n'&&dy==-1&&Math.abs(x-p.a)<=1.4)});
   const idx=x+y*GW;
   if(ramp){RAM[idx]=1;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
    const xx=x+dx,yy=y+dy;if(xx>=0&&xx<GW&&yy>=0&&yy<GH)RAM[xx+yy*GW]=1}
    continue}
   ST[idx]=1;
   const X=x*CS,Y=y*CS,seed=(x*19+y*47)%7;
   for(const [dx,dy,dir] of sides){
    // Stone escarpment: visible south/east faces hang over the low ground.
    if(dir=='s'){
     let depth=20+(seed%4)*3,gg=tt.createLinearGradient(0,Y+CS-5,0,Y+CS+depth);
     gg.addColorStop(0,'#a99a7e');gg.addColorStop(.21,'#746953');gg.addColorStop(.62,'#494436');gg.addColorStop(1,'#272920');
     tt.fillStyle=gg;tt.beginPath();tt.moveTo(X,Y+CS-5);tt.lineTo(X+CS,Y+CS-5);tt.lineTo(X+CS+5,Y+CS+depth);tt.lineTo(X+5,Y+CS+depth+2);tt.fill();
     line(X+3,Y+CS+8,X+CS+1,Y+CS+7,'rgba(224,204,163,.27)',2);
     line(X+seed*3,Y+CS+12,X+seed*3+4,Y+CS+depth-2,'rgba(12,13,11,.38)',1.7);
     line(X+4,Y+CS+depth-8,X+29,Y+CS+depth-7,'rgba(0,0,0,.23)',2);
    }else if(dir=='e'){
     const depth=15+(seed%3)*3;
     tt.fillStyle='#4c4938';tt.beginPath();tt.moveTo(X+CS-4,Y);tt.lineTo(X+CS+depth,Y+7);tt.lineTo(X+CS+depth,Y+CS+14);tt.lineTo(X+CS-4,Y+CS);tt.fill();
     line(X+CS,Y+5,X+CS+depth-2,Y+9,'rgba(245,217,164,.22)',2);
     line(X+CS+depth-3,Y+10,X+CS+depth-3,Y+CS+11,'rgba(8,8,7,.36)',2);
    }else if(dir=='n'){
     line(X+2,Y+2,X+CS-2,Y+1,'rgba(247,222,172,.47)',3);
     line(X+3,Y+5,X+CS-3,Y+7,'rgba(28,28,21,.43)',3);
    }else{
     line(X+1,Y,X+2,Y+CS,'rgba(255,239,201,.43)',4);
     line(X+7,Y,X+9,Y+CS,'rgba(30,30,23,.44)',4)}
   }
   // Broken rim facets merge with the rock wall.
   tt.fillStyle=seed%3==0?'#a89d7b':'#77745c';
   tt.beginPath();tt.moveTo(X+1,Y+CS-3);tt.lineTo(X+6,Y+CS-13-seed);
   tt.lineTo(X+19,Y+CS-8);tt.lineTo(X+CS,Y+CS-3);tt.fill();
  }
  // Ramp is a true gap through the rock, with eroded terrain and readable edges.
  const a=p.a*CS+CS/2,sg=(p.s=='e'||p.s=='s')?1:-1;
  let mx=isV?cx+(a-cx):cx+sg*rx,my=isV?cy+sg*ry:a;
  if(isV)mx=a;else my=a;
  const depth=105,width=88;
  tt.save();tt.translate(mx,my);if(isV)tt.rotate(p.s=='n'?Math.PI:0);else tt.rotate(p.s=='e'?-Math.PI/2:Math.PI/2);
  const rg=tt.createLinearGradient(0,-55,0,depth);rg.addColorStop(0,'#978e6c');rg.addColorStop(.45,'#b2a075');rg.addColorStop(1,'rgba(104,85,57,0)');
  tt.fillStyle=rg;tt.beginPath();tt.moveTo(-width*.42,-65);tt.lineTo(width*.42,-65);tt.lineTo(width*.62,depth);tt.lineTo(-width*.62,depth);tt.closePath();tt.fill();
  for(let j=0;j<10;j++){let v=-48+j*15;line(-width*.36-j*.7,v,width*.36+j*.7,v+5,'rgba(39,31,21,.16)',1+((j+1)%3))}
  [-1,1].forEach(side=>{line(side*width*.44,-48,side*width*.62,depth-8,'rgba(30,24,17,.54)',3);
   for(let k=0;k<4;k++){let v=-45+k*39;rect(side*(width*.46+k*2)-3,v,6,8,'#8f8770')}});
  tt.restore();mouths.push([mx,my]);
 }
 // Boulder ridges become larger continuous occluders with broken stony silhouettes.
 for(const p of M.w){
  for(let y=0;y<GH;y++)for(let x=0;x<GW;x++)if(inE(p,x,y))ST[x+y*GW]=1;
  tt.save();tt.translate(5,12);outline(p,1);tt.shadowColor='rgba(0,0,0,.5)';tt.shadowBlur=14;tt.fillStyle='#252722';tt.fill();tt.restore();
  const rg=tt.createLinearGradient(p.cx*CS-p.rx*CS,p.cy*CS-p.ry*CS,p.cx*CS+p.rx*CS,p.cy*CS+p.ry*CS);
  rg.addColorStop(0,'#b4a98c');rg.addColorStop(.33,'#807760');rg.addColorStop(.7,'#615e4d');rg.addColorStop(1,'#363a33');
  outline(p);tt.fillStyle=rg;tt.fill();tt.strokeStyle='rgba(230,215,186,.4)';tt.lineWidth=3;tt.stroke();
  tt.save();outline(p);tt.clip();for(let i=0;i<160;i++){
   const x=p.cx*CS+randN(-p.rx*CS,p.rx*CS),y=p.cy*CS+randN(-p.ry*CS,p.ry*CS);
   line(x,y,x+randN(-25,25),y+randN(-18,18),i%3?'rgba(30,28,26,.17)':'rgba(255,255,232,.2)',randN(.5,2.5))}tt.restore()
 }
 // Low ground flora; distribute small forests but never close all ramps.
 const key=[M.pc,M.ec,M.en,...M.x,...P.map(p=>[p.x,p.y]),...GY.map(g=>[g.x,g.y]),...mouths];
 const suitable=(x,y,r)=>x>55&&y>55&&x<W-55&&y<H-55&&playerDecorClear(x,y,150)&&!key.some(k=>Math.hypot(k[0]-x,k[1]-y)<r)
   &&!TR.some(t=>Math.hypot(t.x-x,t.y-y)<27)
   &&[[0,0],[16,0],[-16,0],[0,16],[0,-16]].every(([dx,dy])=>!bs(x+dx,y+dy));
 let trees=0;
 for(let c=0;c<95&&trees<80;c++){
  const cx=rand()*W,cy=rand()*H;
  for(let i=0,n=2+(rand()*6|0);i<n;i++){
   const x=cx+randN(-85,85),y=cy+randN(-75,75);
   if(suitable(x,y,235)){TR.push({tr:1,x,y,k:rand()<.22?2:0,s:randN(.74,1.25)});trees++}}}
 for(let i=0;i<22;i++){
  const x=rand()*W,y=rand()*H;
  if(suitable(x,y,210))TR.push({tr:1,x,y,k:1,s:randN(.9,1.4)})}
 // Passable terrain is validated when starting a mission; trees act as blockers.
 // v16: vegetation is purely cosmetic and cannot occupy building/pathfinding cells.
 for(let i=0;i<1500;i++){
  const x=rand()*W,y=rand()*H;if(bs(x,y)||!playerDecorClear(x,y))continue;
  const r=randN(1.4,4.8);tt.fillStyle=M.bu[i%M.bu.length];
  tt.beginPath();tt.ellipse(x,y,r*1.3,r*.72,rand()*Math.PI,0,7);tt.fill();
  if(i%3==0){tt.fillStyle='rgba(255,255,200,.23)';tt.fillRect(x-1,y-1,2,1)}}
 for(let i=0;i<550;i++){
  const x=rand()*W,y=rand()*H;if(ST[ci(x,y)]||!playerDecorClear(x,y))continue;
  tt.fillStyle=M.fl[i%M.fl.length];tt.globalAlpha=.35;tt.fillRect(x,y,1.6,1.7)}tt.globalAlpha=1;
}
// ---------- random map generator ----------
const BIO=[{nm:'Verdant',...MAPS[0]},{nm:'Autumn',...MAPS[1]},
{nm:'Frozen',base:'#b9cddd',pal:['#b8c8d8','#e0eaf2','#9fb4c8','#c6d6e4','#aebfd0','#dbe5ee','#b0c2d4'],sp:['#ffffff','#8fa6bd','#e8f1f8'],tint:'rgba(210,235,255,.25)',l:['#2f5a4a','#3b6b58','#2a4f40','#4d8068','#8fc4ac'],q:['#1f4a3c','#25594a','#2f6a58'],bu:['#6c8a82','#7f9c94','#93b0a8'],fl:['#fff','#bfe6ff','#9fd0ff','#e8f6ff']},
{nm:'Dune',base:'#c9a566',pal:['#d2b073','#b8935a','#e0c183','#a98450','#cfa96a','#bf9a5f','#dcbc7e'],sp:['#f0d9a0','#8a6a3a','#e8cf94'],tint:'rgba(255,225,150,.22)',l:['#5a7a2a','#6b8a32','#587024','#7fa040','#b0cc60'],q:['#4a5a28','#55682e','#667a38'],bu:['#7a8a3a','#8f9f48','#a3b058'],fl:['#fff','#ff9a8a','#ffd24a','#d6a0ff']},
{nm:'Ashen',base:'#4a4440',pal:['#554e49','#3c3733','#625a54','#2f2b28','#6a615a','#48413c','#574f4a'],sp:['#8a7f76','#1f1c1a','#a39688'],tint:'rgba(255,140,90,.15)',l:['#3a2a28','#4a3532','#32231f','#6a4a40','#a0705a'],q:['#2a1e1c','#35261f','#43302a'],bu:['#5a3a2a','#6e4630','#825438'],fl:['#ff7a3a','#ffb14a','#ff5a2a','#ffd08a']}];
function genMap(){const R=Math.random,rr=(a,b)=>a+R()*(b-a),pk=a=>a[R()*a.length|0],bi=pk(BIO),Z=32,dd=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
 for(let at=0;at<60;at++){
  const mp=(rt,bt)=>{const rx=rr(9.6,10.6),ry=rr(8.2,9);return{cx:rt?75-rx-.8-rr(0,2.5):rx+.8+rr(0,2.5),cy:bt?50-ry-.8-rr(0,1.6):ry+.8+rr(0,1.6),rx,ry}};
  const ca=R()*4|0,cb=R()<.65?3-ca:pk([0,1,2,3].filter(i=>i!=ca&&i!=3-ca));
  const info=q=>{const px=q.cx*Z,py=q.cy*Z,hor=R()<.5,s=hor?(px<1200?'e':'w'):(py<800?'s':'n'),a=Math.round(hor?q.cy+rr(-.4,.4)*q.ry:q.cx+rr(-.4,.4)*q.rx);let nx,ny;
   if(hor){nx=px+(s=='e'?1:-1)*(q.rx*Z+rr(290,360));ny=a*Z+(py<800?1:-1)*rr(0,80)}else{ny=py+(s=='s'?1:-1)*(q.ry*Z+rr(290,340));nx=a*Z+(px<1200?1:-1)*rr(0,80)}
   nx=Math.max(240,Math.min(2160,nx));ny=Math.max(240,Math.min(1360,ny));return{p:{...q,s,a},b:[px,py],n:[nx,ny],ab:Math.atan2(py-800,px-1200),an:Math.atan2(ny-py,nx-px)}};
  const A=info(mp(ca&1,ca>>1)),C=info(mp(cb&1,cb>>1)),keys=[A.b,C.b,A.n,C.n];
  if(keys.some((q,i)=>keys.some((r,j)=>j>i&&dd(q,r)<520)))continue;
  const mids=[];for(let k=0;k<40&&mids.length<2;k++){const m=[rr(700,1700),rr(430,1170),rr(0,6.28)];if([...keys,...mids].every(q=>dd(q,m)>470))mids.push(m)}
  const all=[...keys,...mids],w=[],N=3+(R()*3|0);
  for(let k=0;k<80&&w.length<N;k++){const o={cx:rr(12,63),cy:rr(8,42),rx:rr(2,6.5),ry:rr(1.6,5)};if(R()<.5)[o.rx,o.ry]=[o.ry,o.rx];const r=Math.max(o.rx,o.ry)*Z,c=[o.cx*Z,o.cy*Z];
   if(all.every(q=>dd(q,c)>r+190)&&[A.b,C.b].every(q=>dd(q,c)>r+400)&&w.every(q=>dd([q.cx*Z,q.cy*Z],c)>(r+Math.max(q.rx,q.ry)*Z)*.8+120))w.push(o)}
  const gy=(x,y,an)=>{const a=an+(R()<.5?-1:1)*rr(2,2.4),r=rr(182,200);return[Math.max(60,Math.min(2340,x+Math.cos(a)*r)),Math.max(60,Math.min(1540,y+Math.sin(a)*r))]};
  return{n:bi.nm+' '+pk(['Basin','Reach','Crossing','Ridge','Expanse','Hollow','Heights','Flats'])+' #'+(R()*900+100|0),d:'',sw:'',base:bi.base,pal:bi.pal,sp:bi.sp,tint:bi.tint,l:bi.l,q:bi.q,bu:bi.bu,fl:bi.fl,
   pc:A.b,ec:C.b,en:C.n,f:[[...A.b,A.ab],[...A.n,A.an],...mids,[...C.n,C.an],[...C.b,C.ab]],g:[gy(...A.b,A.ab),gy(...A.n,A.an),...mids.map(m=>gy(m[0],m[1],m[2])),gy(...C.n,C.an),gy(...C.b,C.ab)],x:[A.n,...mids.map(m=>[m[0],m[1]]),C.n],p:[A.p,C.p],w}}
 return MAPS[0]}
MAPS.push({n:'Random Map',d:'A brand-new battlefield every game: random biome, base corners, ramps, cliffs, minerals, gas and trees.',sw:'linear-gradient(135deg,#2f6a24,#c9a24a 40%,#9fd0ff 70%,#4a4440)',rand:1});
function startGame(){au();DF=DFS[cfg.d];MAP=MAPS[cfg.m]?.rand?genMap():(MAPS[cfg.m]||MAPS[0]);typeof resetV2=='function'&&resetV2();res={m:DF.res,g:0};U=[];B=[];P=[];GY=[];EX=[];FX=[];AL=[];VS=[];sel=[];grp={};CK={};mode=null;frame=0;wave=1;wt=DF.w0;stim=0;msgT=0;alertT=0;hotT=0;over=0;paused=0;sig='';ST.fill(0);BB.fill(0);EL.fill(0);RAM.fill(0);TR.length=0;ex.clearRect(0,0,300,200);dispatchEvent(new Event('korhal:reset'));
 init();for(let k=0;k<8&&!path(MAP.pc[0]+10,MAP.pc[1]+65,MAP.ec[0]-30,MAP.ec[1]+80);k++){if(!MAPS[cfg.m]?.rand)break;MAP=genMap();U=[];B=[];P=[];GY=[];EX=[];ST.fill(0);BB.fill(0);EL.fill(0);RAM.fill(0);TR.length=0;init()}theme=(Math.random()*6|0);stp=0;nxt=0;lk=1;say(MAP.n+'   \u266A '+['Dust & Iron','Siege Protocol','Phantom Signal','Redline Convoy','No Man’s Orbit','Dead Stars'][theme]);const c=B[0];cam={x:c.x-cv.width/2,y:c.y*K-cv.height/2};clampCam();VS=all().filter(e=>e.team==1&&(!e.b||e.done)).map(e=>[e.x,e.y,sightRadius(e)]);fog();started=1;window.korhalTrackRefresh?.();$('ov').style.display='none'}
function menu(){MAPS.sort((a,b)=>!!a.rand-!!b.rand);if(cfg.m<0||cfg.m>=MAPS.length)cfg.m=0;$('mp').innerHTML=MAPS.map((m,i)=>`<div class="c${cfg.m==i?' on':''}" data-m="${i}" style="background:${m.sw}"><b>${m.n}</b><br>${m.d}</div>`).join('');$('df').innerHTML=DFS.map((d,i)=>`<div class="c${cfg.d==i?' on':''}" data-d="${i}"><b>${d.n}</b><br>${d.d}</div>`).join('')}
$('ov').addEventListener('click',e=>{const c=e.target.closest&&e.target.closest('.c');if(!c)return;au();if(c.dataset.m!=null)cfg.m=+c.dataset.m;if(c.dataset.d!=null)cfg.d=+c.dataset.d;menu();snd('click')});
addEventListener('pointerdown',au,{once:true});
// v15 environment sprites: detailed offscreen foliage/rocks drawn once per biome and variant.
const ENV_SPRITES=new Map();
function envSprite(kind,variant){
 const key=MAP.n+':'+kind+':'+variant;
 if(ENV_SPRITES.has(key))return ENV_SPRITES.get(key);
 if(ENV_SPRITES.size>90)ENV_SPRITES.clear();
 const can=document.createElement('canvas');can.width=160;can.height=174;
 const g=can.getContext('2d');g.translate(80,143);
 const seed=(variant+1)*19,bright=MAP.n.includes('Frozen'),ashen=/Ash|Scorch|Lava/i.test(MAP.n);
 const leaf=(i)=>MAP.l[(i+variant)%MAP.l.length],pine=(i)=>MAP.q[(i+variant)%MAP.q.length];
 const oval=(x,y,rx,ry,color)=>{g.fillStyle=color;g.beginPath();g.ellipse(x,y,rx,ry,0,0,7);g.fill()};
 const polyF=(pts,c)=>{g.fillStyle=c;g.beginPath();g.moveTo(pts[0],pts[1]);for(let j=2;j<pts.length;j+=2)g.lineTo(pts[j],pts[j+1]);g.closePath();g.fill()};
 const grad=(x,y,r,light,base)=>{const a=g.createRadialGradient(x-r*.3,y-r*.42,1,x,y,r*1.2);a.addColorStop(0,light);a.addColorStop(.55,base);a.addColorStop(1,ashen?'#252923':'#1d3c28');return a};
 oval(11,0,35,10,'rgba(9,19,15,.35)');
 if(kind===1){ // broken boulder with fractured facets and cracks
  polyF([-28,0,-35,-17,-24,-29,3,-39,28,-20,31,-3,10,4],'#41474a');
  polyF([-35,-17,-24,-29,3,-39,-7,-22,-26,-12],'#88938c');
  polyF([-7,-22,3,-39,28,-20,14,-12],bright?'#d7e8ea':'#9aa69f');
  polyF([-26,-12,-7,-22,14,-12,31,-3,10,4,-28,0],'#606d69');
  g.strokeStyle='rgba(25,30,34,.64)';g.lineWidth=1.8;
  g.beginPath();g.moveTo(-4,-24);g.lineTo(0,-17);g.lineTo(-9,-8);g.moveTo(13,-12);g.lineTo(8,-5);g.stroke();
  for(let i=0;i<6;i++)oval(-18+i*7,-10+(i%3)*4,2,1.1,'rgba(229,245,229,.25)');
 }else{
  g.save();g.shadowColor='rgba(0,0,0,.38)';g.shadowBlur=8;
  polyF([-7,-4,-4,-50,-6,-78,2,-87,5,-45,8,-4],'#392e22');
  g.restore();
  g.strokeStyle='#836543';g.lineWidth=3;g.beginPath();g.moveTo(1,-15);g.lineTo(2,-70);g.stroke();
  g.strokeStyle='#5f4c32';g.lineWidth=4;
  [[-33,-66],[-26,-92],[27,-71],[33,-90]].forEach(([x,y])=>{g.beginPath();g.moveTo(1,-50);g.quadraticCurveTo(x*.5,-69,x,y);g.stroke()});
  if(kind===2){
   for(let i=0;i<5;i++){
    const yy=-105+i*18,w=12+i*6;
    polyF([0,yy-18,-w-3,yy+16,0,yy+8,w+3,yy+16],pine(i));
    polyF([0,yy-18,-w-1,yy+14,0,yy+7],i%2?'rgba(8,35,25,.25)':'rgba(204,240,191,.22)');
    g.strokeStyle='rgba(195,224,177,.5)';g.lineWidth=1.1;g.beginPath();g.moveTo(-w*.6,yy+3);g.lineTo(0,yy-14);g.stroke();
   }
  }else{
   const clusters=[[-25,-76,21,18],[-7,-100,24,22],[20,-84,25,21],[-3,-68,27,19],[-28,-99,18,17],[18,-111,19,16],[31,-66,16,14]];
   clusters.forEach(([x,y,rx,ry],i)=>{
     oval(x+2,y+7,rx+2,ry+2,'rgba(17,42,24,.4)');
     oval(x,y,rx,ry,grad(x,y,rx,MAP.l[(i+3+variant)%MAP.l.length],leaf(i)));
     oval(x-rx*.3,y-ry*.4,rx*.46,ry*.25,'rgba(220,251,173,.14)');
     for(let k=0;k<3;k++)oval(x+(k-1)*rx*.47,y-ry*.18-(k%2)*6,1.2,1.4,ashen?'#a6ad74':'rgba(228,255,199,.55)');
   });
  }
 }
 ENV_SPRITES.set(key,can);return can;
}
function drawTree(t){
 const variant=((Math.floor(t.x*.13+t.y*.21)%3)+3)%3;
 const im=envSprite(t.k,variant),s=t.s*(t.k===2?.96:1.02);
 // Only the upper portion gently sways; sprite caching keeps this inexpensive.
 const wind=t.k===1?0:Math.sin(frame*.018+t.x*.017)*.015;
 ctx.save();ctx.translate(t.x,t.y*K);ctx.rotate(wind);ctx.drawImage(im,-80*s,-143*s,160*s,174*s);ctx.restore();
}

// v16: all landscape detail, trees and shadows are baked once into TC for each map.
// No foliage, sway, shadows, texture brushes, or vegetation decals are drawn each frame.
function korhalBakeTerrain(){
 if(!tt||!MAP)return;
 const g=tt;g.save();
 let seed=([...MAP.n].reduce((n,c)=>Math.imul(n,33)^c.charCodeAt(0),37139)>>>0);
 const rand=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 // A restrained blend of earthy and grassy patches. All marks are static.
 for(let i=0;i<720;i++){
  const x=rand()*W,y=rand()*H,j=ci(x,y);if(j<0||ST[j]||!playerDecorClear(x,y))continue;
  const r=4+rand()*16;g.fillStyle=i%3===0?'rgba(28,39,22,.09)':i%3===1?'rgba(230,211,137,.065)':'rgba(78,57,33,.06)';
  g.beginPath();g.ellipse(x,y,r,r*(.26+rand()*.35),rand()*6.283,0,7);g.fill();
 }
 // Baked grass, rock flecks and low bushes; keep base/building footprints clean.
 const clearDecor=(x,y)=>{
  if(!playerDecorClear(x,y)||ST[ci(x,y)]||B.some(b=>Math.abs(x-b.x)<b.size/2+55&&Math.abs(y-b.y)<b.size/2+55))return false;
  for(const v of [MAP.pc,MAP.ec,MAP.en,...(MAP.x||[])])if(Math.hypot(v[0]-x,v[1]-y)<150)return false;
  return true;
 };
 for(let i=0;i<1300;i++){
  const x=rand()*W,y=rand()*H;if(!clearDecor(x,y))continue;
  g.strokeStyle=i%5?'rgba(45,84,36,.28)':'rgba(171,166,108,.28)';g.lineWidth=.9;
  const r=2+rand()*3;
  g.beginPath();g.moveTo(x,y);g.lineTo(x-r,y-r*1.7);g.moveTo(x,y);g.lineTo(x+r*.4,y-r*1.9);g.stroke();
  if(i%16===0){g.fillStyle=MAP.fl[i%MAP.fl.length];g.fillRect(x,y-3,1.3,1.3)}
 }
 // Cliff-face seams and highlights, baked.
 for(let y=1;y<GH-1;y++)for(let x=1;x<GW-1;x++){
  const j=x+y*GW;if(!ST[j]||![j-1,j+1,j-GW,j+GW].some(k=>EL[k]))continue;
  const px=(x+.5)*CS,py=(y+.5)*CS;
  g.fillStyle='rgba(18,16,14,.15)';g.fillRect(px-13,py+6,26,7);
  g.strokeStyle='rgba(242,220,163,.22)';g.lineWidth=1.3;
  g.beginPath();g.moveTo(px-11,py-7);g.lineTo(px+10,py-7+rand()*3);g.stroke();
 }
 const envBase=[MAP.pc,MAP.ec,MAP.en,...(MAP.x||[]),...P.map(p=>[p.x,p.y]),...GY.map(p=>[p.x,p.y])];
 let rendered=0;
 for(const t of TR){
  if(rendered>=76)break;
  if(!playerDecorClear(t.x,t.y,130)||EL[ci(t.x,t.y)]||envBase.some(([x,y])=>Math.hypot(x-t.x,y-t.y)<260))continue;
  // Woods remain a non-blocking environmental layer; no on-frame sway or hitbox.
  const variant=(Math.floor(t.x*.13+t.y*.21)%3+3)%3;
  const im=envSprite(t.k,variant),scale=t.s*(t.k===2?.84:.90);
  const px=t.x-80*scale,py=t.y*K-143*scale;
  g.drawImage(im,px,py,160*scale,174*scale);rendered++;
 }
 g.restore();
 window.Korhal.environment={baked:true,trees:rendered,map:MAP.n};
}
window.korhalBakeTerrain=korhalBakeTerrain;

function clear(x1,y1,x2,y2){
 const d=Math.hypot(x2-x1,y2-y1),n=Math.max(1,Math.ceil(d/9));let last=ci(x1,y1);
 for(let i=1;i<=n;i++){
  const x=x1+(x2-x1)*i/n,y=y1+(y2-y1)*i/n,c=ci(x,y);
  if(c<0||ST[c]||(BB[c]&&i>2&&i<n-1))return 0;
  if(c!==last&&last>=0&&!canPass(last,c))return 0;
  last=c}
 return 1}
// v16 navigation: shared mineral-avoidance grid and bounded A* rather than an
// allocation-heavy full-map BFS and repeated per-node searches of mineral fields.
const KORHAL_NODES=GW*GH,KORHAL_MINERALS=new Uint8Array(KORHAL_NODES);
// Shared scratch for synchronous A*: no per-request 3,750-node typed-array allocation.
const ROUTE_PARENT=new Int32Array(KORHAL_NODES),ROUTE_G=new Float32Array(KORHAL_NODES),ROUTE_F=new Float32Array(KORHAL_NODES),ROUTE_CLOSED=new Uint8Array(KORHAL_NODES),ROUTE_HEAP=[];
let mineralGridFrame=-1000,navCacheRev=-1;
const navCache=new Map();
function refreshMineralGrid(){
 if(frame>=mineralGridFrame&&frame-mineralGridFrame<120)return;
 mineralGridFrame=frame;KORHAL_MINERALS.fill(0);
 for(const p of P)if(p.a>0){
  const minx=Math.max(0,Math.floor((p.x-40)/CS)),maxx=Math.min(GW-1,Math.ceil((p.x+40)/CS));
  const miny=Math.max(0,Math.floor((p.y-40)/CS)),maxy=Math.min(GH-1,Math.ceil((p.y+40)/CS));
  for(let y=miny;y<=maxy;y++)for(let x=minx;x<=maxx;x++)if(Math.hypot((x+.5)*CS-p.x,(y+.5)*CS-p.y)<34)KORHAL_MINERALS[x+y*GW]=1;
 }
 navCache.clear();navCacheRev=MAPREV;
}
addEventListener('korhal:reset',()=>{mineralGridFrame=-1000;navCache.clear()});
function mineralLaneClear(x1,y1,x2,y2){
 refreshMineralGrid();
 const length=Math.hypot(x2-x1,y2-y1),n=Math.max(1,Math.ceil(length/20));
 for(let i=1;i<n;i++){const f=i/n,j=ci(x1+(x2-x1)*f,y1+(y2-y1)*f);if(j>=0&&KORHAL_MINERALS[j])return false}
 return true;
}
function path(x1,y1,x2,y2,avoidResources=false){
 const s=ci(x1,y1),g=ci(x2,y2);if(s<0||g<0)return null;
 if(avoidResources)refreshMineralGrid();
 if(navCacheRev!==MAPREV){navCache.clear();navCacheRev=MAPREV}
 const key=s+'|'+g+'|'+(+avoidResources);
 const cached=navCache.get(key);
 if(cached&&cached.until>=frame)return cached.pts?cached.pts.slice():null;
 const gx=g%GW,gy=g/GW|0,gr=bp(x2,y2)?2:0;
 const parent=ROUTE_PARENT,gScore=ROUTE_G,fScore=ROUTE_F,closed=ROUTE_CLOSED,heap=ROUTE_HEAP;
 parent.fill(-2);gScore.fill(1e9);fScore.fill(1e9);closed.fill(0);heap.length=0;
 const heuristic=n=>{const dx=Math.abs(n%GW-gx),dy=Math.abs((n/GW|0)-gy);return Math.max(dx,dy)*10+Math.min(dx,dy)*4};
 const blocked=n=>ST[n]||BB[n]||(avoidResources&&KORHAL_MINERALS[n]);
 const push=n=>{let i=heap.length;heap.push(n);while(i>0){const par=(i-1)>>1;if(fScore[heap[par]]<=fScore[n])break;heap[i]=heap[par];i=par}heap[i]=n};
 const pop=()=>{const top=heap[0],last=heap.pop();if(heap.length){let i=0;while(true){let c=i*2+1;if(c>=heap.length)break;if(c+1<heap.length&&fScore[heap[c+1]]<fScore[heap[c]])c++;if(fScore[last]<=fScore[heap[c]])break;heap[i]=heap[c];i=c}heap[i]=last}return top};
 gScore[s]=0;fScore[s]=heuristic(s);parent[s]=-1;push(s);
 let found=-1,expanded=0;
 while(heap.length&&expanded++<KORHAL_NODES){
  const c=pop();if(closed[c])continue;closed[c]=1;
  const cx=c%GW,cy=c/GW|0;
  if(Math.max(Math.abs(cx-gx),Math.abs(cy-gy))<=gr){found=c;break}
  for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++){
   if(!dx&&!dy)continue;
   const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=GW||ny>=GH)continue;
   const n=nx+ny*GW;if(closed[n]||blocked(n)||!canPass(c,n))continue;
   if(dx&&dy){const px=c+dx,py=c+dy*GW;if(blocked(px)||blocked(py)||!canPass(c,px)||!canPass(c,py))continue}
   const score=gScore[c]+(dx&&dy?14:10);
   if(score>=gScore[n])continue;
   parent[n]=c;gScore[n]=score;fScore[n]=score+heuristic(n);push(n);
  }
 }
 let out=null;
 if(found>=0){
  const pts=[];for(let c=found;c>=0;c=parent[c])pts.push({x:c%GW*CS+CS/2,y:(c/GW|0)*CS+CS/2});pts.reverse();
  if(!bp(x2,y2)&&(!pts.length||Math.abs(pts[pts.length-1].x-x2)+Math.abs(pts[pts.length-1].y-y2)>5))pts.push({x:x2,y:y2});
  out=[];let p={x:x1,y:y1},i=0;
  while(i<pts.length){let j=Math.min(i+14,pts.length-1);while(j>i&&(!clear(p.x,p.y,pts[j].x,pts[j].y)||(avoidResources&&!mineralLaneClear(p.x,p.y,pts[j].x,pts[j].y))))j--;out.push(pts[j]);p=pts[j];i=j+1}
 }
 if(navCache.size>480)navCache.clear();
 navCache.set(key,{pts:out,until:frame+(out?75:15)});
 return out?out.slice():null;
}
function mv(u,x,y,s){let tx=x,ty=y;
 if(!u.air){
  const k=(x/CS|0)+','+(y/CS|0),changed=u.pk!==k||u._mvRev!==MAPREV;
  if(changed){
   u.pk=k;u._mvRev=MAPREV;u._direct=!!clear(u.x,u.y,x,y)&&(u.t==='scv'||mineralLaneClear(u.x,u.y,x,y));
   if(!u._direct){u.pa=path(u.x,u.y,x,y,u.t!=='scv');u.pe=frame+90+u.id%40}else{u.pa=null;u.pe=0}
  }else if(!u._direct&&(!u.pa||!u.pa.length||frame>=u.pe)){
   u.pa=path(u.x,u.y,x,y,u.t!=='scv');u.pe=frame+90+u.id%40
  }
  if(!u._direct&&u.pa){while(u.pa.length&&Math.hypot(u.pa[0].x-u.x,u.pa[0].y-u.y)<14)u.pa.shift();if(u.pa.length){tx=u.pa[0].x;ty=u.pa[0].y}}
 }
 const a=Math.atan2(ty-u.y,tx-u.x);u.ang=a;let nx=u.x+Math.cos(a)*s,ny=u.y+Math.sin(a)*s;
 if(!u.air&&(bs(nx,ny)||!canPass(ci(u.x,u.y),ci(nx,ny)))){if(!bs(nx,u.y)&&canPass(ci(u.x,u.y),ci(nx,u.y)))ny=u.y;else if(!bs(u.x,ny)&&canPass(ci(u.x,u.y),ci(u.x,ny)))nx=u.x;else return}
 u.x=Math.max(10,Math.min(W-10,nx));u.y=Math.max(10,Math.min(H-10,ny))}
function acq(u,r){const t=T[u.t];if(!t.d)return null;let b=null,m=r;visitNearby(u.x,u.y,r+70,e=>{if(e.team==u.team||e.hp<=0||(e.air&&!t.aa)||(u.team==1&&!seen(e))||(u.team==2&&e.cl&&!detd(e)))return;const d=D(u,e)-R(e)+(e.b?60:0);if(d<m){m=d;b=e}});return b}
function hurtTeam(e){if(e.team==1&&frame>alertT){alertT=frame+900;hotT=frame+1200;say('Your forces are under attack!');snd('warn')}}
function atk(u,tg,rg,dm){if(u.cd>0)return;dm=dmgU(u,tg,dm);const t=T[u.t],f=t.fc||['#fff',1];u.cd=t.cd*(u.stimT>0?.5:1)*(u.siege?1.2:1);snd(u.siege?'tank2':u.t,u.x,u.y);
 const hit=e=>{e.hp-=Math.max(.5,dm-(T[e.t].ar||0)-armU(e));e.kb=u;hurtTeam(e)};hit(tg);
 if(t.spl||u.siege){const r=u.siege?48:t.spl;nearEntities(tg.x,tg.y,r+30).forEach(e=>{if(e!==tg&&e.team!==u.team&&e.hp>0&&D(e,tg)<r&&(!e.air||t.aa))hit(e)})}
 window.hitFX&&hitFX(u,tg);FX.push({k:'ln',x1:u.x,y1:u.y,x2:tg.x,y2:tg.y,l:u.t=='firebat'?9:6,m:9,c:f[0],w:f[1]});
 if(u.t=='tank'||u.t=='ultra')FX.push({k:'bm',x:tg.x,y:tg.y,r:u.siege?40:20,l:12,m:12,c:'#fb5'});if(u.siege){FX.push({k:'bm',x:u.x,y:u.y,r:22,l:8,m:8,c:'#fff'});for(let i=0;i<8;i++)FX.push({k:'sp',x:tg.x,y:tg.y,vx:Math.random()*8-4,vy:Math.random()*8-4,l:25,c:'#fb5'})}}

window.Korhal.modules.map.loaded=true;
