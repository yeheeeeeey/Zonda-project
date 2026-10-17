/* SECTOR KORHAL v12 — split module: rendering */
window.Korhal=window.Korhal||{};
window.Korhal.modules=window.Korhal.modules||{};
window.Korhal.modules.rendering=window.Korhal.modules.rendering||{};
// ---------- rendering ----------
const el=(x,y,a,b,c,r=0)=>{ctx.fillStyle=SH||c;ctx.beginPath();ctx.ellipse(x,y,a,b,r,0,7);ctx.fill()},rc=(x,y,w,h,c)=>{ctx.fillStyle=SH||c;ctx.fillRect(x,y,w,h)},poly=(p,c)=>{ctx.fillStyle=SH||c;ctx.beginPath();ctx.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)ctx.lineTo(p[i],p[i+1]);ctx.closePath();ctx.fill()};
const DR={scv:()=>{rc(-7,-6,12,12,'#d9b13a');rc(5,-4,8,3,'#999');rc(5,1,8,3,'#999');el(-2,0,3,3,'#3cf')},
marine:()=>{el(0,0,8,7,'#3d6fd6');el(1,0,4,4,'#8ff');rc(3,1,13,3,'#222');rc(-8,-3,3,6,'#1a3b86')},
firebat:()=>{el(0,0,9,8,'#b5502a');rc(-11,-5,6,10,'#555');rc(4,1,14,3,'#333');el(17,2,2,2,'#fa3')},
medic:()=>{el(0,0,8,7,'#eee');rc(-1,-5,3,10,'#e33');rc(-5,-1,10,3,'#e33')},
vulture:()=>{el(0,0,14,6,'#7a8fa6');el(11,0,4,4,'#222');el(-10,0,4,5,'#222');rc(-4,-2,8,4,'#e63')},
tank:u=>{rc(-14,-12,28,6,'#222');rc(-14,6,28,6,'#222');rc(-12,-7,24,14,'#2b4fa0');if(u.siege){rc(-16,-14,5,5,'#888');rc(11,-14,5,5,'#888');rc(-16,9,5,5,'#888');rc(11,9,5,5,'#888')}el(0,0,8,8,'#4a76d8');rc(4,-2,u.siege?26:16,4,'#222')},
wraith:()=>{poly([-10,0,-14,-16,6,-5,14,0,6,5,-14,16],'#9fb3d9');el(0,0,11,4,'#dfe8ff');el(5,0,3,2,'#f66')},
zergling:()=>{el(0,0,9,6,'#a8452c');el(8,0,4,4,'#d77');rc(8,-7,6,2,'#ddd');rc(8,5,6,2,'#ddd');rc(-14,-1,6,2,'#a8452c')},
hydra:()=>{el(-4,0,12,8,'#6a3d8f');el(8,0,6,6,'#9a5fc9');poly([10,-4,22,-10,14,-2],'#ddd');poly([10,4,22,10,14,2],'#ddd');el(11,0,2,2,'#ff0')},
muta:()=>{const w=Math.sin(frame*.3)*7;poly([-2,0,-12,-16+w,6,-4],'#3d7a3a');poly([-2,0,-12,16-w,6,4],'#3d7a3a');el(0,0,11,5,'#4f9a4a');el(9,0,4,3,'#b6e36a');poly([-10,0,-20,-2,-20,2],'#3d7a3a')},
ultra:()=>{el(0,0,20,15,'#6e5a4b');el(15,0,9,8,'#8a7260');poly([10,-8,32,-12,18,-2],'#e8e0d0');poly([10,8,32,12,18,2],'#e8e0d0');poly([-10,-12,-22,-8,-12,-4],'#4a3b30');poly([-10,12,-22,8,-12,4],'#4a3b30')}};
const K=.62,LF=24,HH={cc:34,depot:16,barracks:26,factory:30,starport:30,academy:24,refinery:22,hatchery:30,sunken:26};let SH=0;
const hit=(e,x,y,p=6)=>e.b?Math.abs(e.x-x)<=e.size/2+p&&y>=e.y-e.size/2-HH[e.t]/K-p&&y<=e.y+e.size/2+p:D(e,{x,y:y+(e.air?LF/K:0)})<=e.rad+p;
function drawU(u){if(u.team==2&&!seen(u))return;const ln=u.air?3:({tank:7,ultra:10,vulture:5,hydra:6,zergling:4})[u.t]||5,lift=u.air?LF:0,sy=u.y*K,hue=u.team==1?220:290,r=R(u);
 ctx.fillStyle='rgba(0,0,0,.32)';ctx.beginPath();ctx.ellipse(u.x+(u.air?14:3),sy+(u.air?10:3),r*(u.air?.8:1.1),r*K*(u.air?.8:1.1),0,0,7);ctx.fill();
 if(sel.includes(u)){const pu=1+Math.sin(frame*.12)*.06;ctx.save();ctx.shadowColor='#3cff7a';ctx.shadowBlur=10;ctx.strokeStyle='#4dff88';ctx.lineWidth=1.8;ctx.beginPath();ctx.ellipse(u.x,sy+3,(r+5)*pu,(r+5)*K*pu,0,0,7);ctx.stroke();ctx.globalAlpha=.3;ctx.lineWidth=5;ctx.stroke();ctx.restore()}
 for(let i=0;i<=ln;i++){ctx.save();ctx.translate(u.x,sy-lift-i*1.7);ctx.scale(1,K+.18);ctx.rotate(u.ang);SH=i<ln?`hsl(${hue},38%,${12+i*3.5}%)`:0;DR[u.t](u);ctx.restore()}SH=0;
 if(u.cr)rc(u.x-3,sy-lift-ln*1.7-9,6,6,'#5ff');
 if(u.hp<u.maxHp||sel.includes(u))bar(u.x,sy-lift-ln*1.7-r*K-12,r*2,u.hp/u.maxHp)}
function bar(x,y,w,f){f=Math.max(0,f);ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(x-w/2-1,y-1,w+2,6);const g=ctx.createLinearGradient(0,y,0,y+4),c=f>.6?['#8fffae','#1fa84a']:f>.3?['#ffe27a','#c8941a']:['#ff9a9a','#b32020'];g.addColorStop(0,c[0]);g.addColorStop(1,c[1]);ctx.fillStyle=g;ctx.fillRect(x-w/2,y,w*f,4);ctx.fillStyle='rgba(0,0,0,.4)';for(let i=1;i<w/6;i++)ctx.fillRect(x-w/2+i*6,y,1,4)}
// ===== structure renderer v3: lit 3D-style Terran structures, organic Zerg structures, vespene geyser =====
const cl=(c,k)=>{const n=parseInt(c.slice(1),16),r=n>>16,g=n>>8&255,b=n&255,f=k<0?0:255,a=Math.abs(k);return`rgb(${r+(f-r)*a|0},${g+(f-g)*a|0},${b+(f-b)*a|0})`};
const lg=(x0,y0,x1,y1,a,b)=>{const g=ctx.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,a);g.addColorStop(1,b);return g};
const qd=(p,f,st)=>{ctx.fillStyle=f;ctx.beginPath();ctx.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)ctx.lineTo(p[i],p[i+1]);ctx.closePath();ctx.fill();if(st){ctx.strokeStyle=st;ctx.lineWidth=1;ctx.stroke()}};
function glow(x,y,r,c,a=1){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=a;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.restore()}
function bx(x,y,w,h,c,dd){const d=dd||w*K,sx=-w*.1,X=x-w/2,Y=y+d/2;
 qd([x+w/2,Y,x+w/2,Y-d,x+w/2+sx,Y-d-h,x+w/2+sx,Y-h],cl(c,-.5),'rgba(0,0,0,.4)');
 qd([X,Y,X+w,Y,X+w+sx,Y-h,X+sx,Y-h],lg(0,Y-h,0,Y,cl(c,.12),cl(c,-.38)),'rgba(0,0,0,.4)');
 qd([X+sx,Y-h,X+w+sx,Y-h,X+w+sx,Y-h-d,X+sx,Y-h-d],lg(X,0,X+w,0,cl(c,.42),cl(c,.12)),'rgba(0,0,0,.4)');
 ctx.strokeStyle=cl(c,.7);ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(X+sx,Y-h);ctx.lineTo(X+w+sx,Y-h);ctx.stroke();
 return{X,Y,w,d,h,sx,
  F:(u0,v0,u1,v1,f)=>qd([X+u0*w+sx*v0,Y-v0*h,X+u1*w+sx*v0,Y-v0*h,X+u1*w+sx*v1,Y-v1*h,X+u0*w+sx*v1,Y-v1*h],f),
  S:(u0,v0,u1,v1,f)=>qd([X+w+sx*v0,Y-u0*d-v0*h,X+w+sx*v0,Y-u1*d-v0*h,X+w+sx*v1,Y-u1*d-v1*h,X+w+sx*v1,Y-u0*d-v1*h],f),
  R:fn=>{ctx.save();ctx.translate(x+sx,y-h);ctx.scale(1,K);fn();ctx.restore()}}}
function cyl(x,y,r,h,c,top){const ry=r*K,g=lg(x-r,0,x+r,0,cl(c,.38),cl(c,-.5));g.addColorStop(.4,c);ctx.fillStyle=g;ctx.fillRect(x-r,y-h,2*r,h);ctx.beginPath();ctx.ellipse(x,y,r,ry,0,0,Math.PI);ctx.fill();
 ctx.fillStyle=top||lg(x-r,y-h-ry,x+r,y-h+ry,cl(c,.6),cl(c,.1));ctx.beginPath();ctx.ellipse(x,y-h,r,ry,0,0,7);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.4)';ctx.lineWidth=1;ctx.stroke()}
function dom(x,y,r,h,c){const g=ctx.createRadialGradient(x-r*.35,y-h*.6,1,x,y-h*.2,r*1.2);g.addColorStop(0,cl(c,.8));g.addColorStop(.5,c);g.addColorStop(1,cl(c,-.65));ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,r,h,0,Math.PI,2*Math.PI);ctx.ellipse(x,y,r,r*K,0,0,Math.PI);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1;ctx.stroke();ctx.fillStyle='rgba(255,255,255,.38)';ctx.beginPath();ctx.ellipse(x-r*.35,y-h*.55,r*.22,h*.16,-.5,0,7);ctx.fill()}
function smk(x,y,n,sd,c){for(let i=0;i<n;i++){const p=((frame*.6+i*(90/n)+sd)%90)/90;ctx.fillStyle=c+(.4*(1-p))+')';ctx.beginPath();ctx.arc(x+p*14+Math.sin(p*6+sd)*3,y-p*44,3+p*9,0,7);ctx.fill()}}
function mnd(x,y,rx,hg,c,n,sw){n=n||9;sw=sw||0;for(let k=0;k<=n;k++){const f=k/n,r=rx*Math.sqrt(1-(f*.88)**2);ctx.fillStyle=cl(c,-.42+f*.8);ctx.beginPath();ctx.ellipse(x+sw*f,y-hg*f,r,r*K,0,0,7);ctx.fill()}}
function spk(x,y,hg,w,c,l){l=l||0;qd([x-w,y,x+l,y-hg,x+w,y],lg(x-w,0,x+w,0,cl(c,.25),cl(c,-.4)),'rgba(40,20,30,.35)')}
const skt=(x,y,r)=>{el(x,y+3,r,r*K,'rgba(46,14,50,.55)');el(x,y+2,r*.78,r*.78*K,'rgba(80,24,80,.4)')};
const pul=(a,b)=>a+b*Math.sin(frame*.07);
// ---------- Terran ----------
const TD={
cc:(b,s,x,y)=>{const h=s/2;
 [-1,1].forEach(a=>{cyl(x+a*h*.96,y+4,6,12,'#6a7686');glow(x+a*h*.96,y-10,9,'rgba(255,170,60,.5)',b.done?pul(.7,.3):.2)});
 cyl(x,y,h*.97,16,'#8794a8');
 ctx.save();ctx.lineWidth=3;ctx.setLineDash([7,7]);ctx.strokeStyle='#e7c53a';ctx.beginPath();ctx.ellipse(x,y-16,h*.9,h*.9*K,0,0,7);ctx.stroke();ctx.restore();
 ctx.strokeStyle='#3a8bff';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y-6,h*.97,h*.97*K,0,.2,Math.PI-.2);ctx.stroke();
 for(let i=0;i<9;i++){const a=.2+i*.33;el(x+Math.cos(a)*h*.93,y-10+Math.sin(a)*h*.93*K,3.2,2,'#bff4ff')}
 el(x,y+h*K*.78-4,14,6,'#0b1118');ctx.strokeStyle='#e7c53a';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(x,y+h*K*.78-4,14,6,0,0,Math.PI);ctx.stroke();
 cyl(x,y-16,h*.62,15,'#9ba8bb');
 for(let i=0;i<6;i++){const a=i*1.047;el(x+Math.cos(a)*h*.55,y-31+Math.sin(a)*h*.55*K,2.2,1.6,i%2?'#ff6a55':'#7fe8ff')}
 dom(x,y-31,h*.36,16,'#58b6ff');glow(x,y-40,16,'rgba(120,200,255,.55)',pul(.6,.4));
 rc(x-1,y-62,2,22,'#c9d4e2');rc(x-6,y-54,12,2,'#c9d4e2');rc(x-4,y-48,8,2,'#c9d4e2');el(x,y-63,2,2,frame%50<25?'#ff4b3a':'#5a1a14')},
depot:(b,s,x,y)=>{
 if(b.lowered){
  // Recessed, ground-flush hatch: no tall silhouette while the tile is walkable.
  const hw=s*.5,hh=s*K*.5;
  el(x+2,y+3,hw*.98,hh*.76,'rgba(0,0,0,.28)');
  qd([x-hw,y,x,y-hh,x+hw,y,x,y+hh],'#2a3540','rgba(0,0,0,.75)');
  qd([x-hw+3,y,x,y-hh+3,x+hw-3,y,x,y+hh-3],'#596879','rgba(0,0,0,.65)');
  qd([x-s*.28,y,x,y-hh*.29,x+s*.28,y,x,y+hh*.29],'#202a34','#9aa8b9');
  ctx.strokeStyle='#e7c53a';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x-s*.36,y+hh*.28);ctx.lineTo(x-s*.19,y+hh*.39);ctx.moveTo(x-s*.2,y+hh*.38);ctx.lineTo(x-s*.03,y+hh*.48);ctx.moveTo(x+s*.03,y+hh*.48);ctx.lineTo(x+s*.2,y+hh*.38);ctx.moveTo(x+s*.19,y+hh*.39);ctx.lineTo(x+s*.36,y+hh*.28);ctx.stroke();
  for(let i=-2;i<=2;i++){el(x+i*7,y+Math.abs(i)*1.2,1.3,1,'#b5c2d0')}
  el(x,y-1,2.2,1.5,'#ffd24a');return;
 }
 const o=bx(x,y,s*.98,11,'#7e8ca2');
 o.R(()=>{ctx.fillStyle='#1d2530';ctx.beginPath();ctx.roundRect(-14,-14,28,28,7);ctx.fill();for(let i=0;i<4;i++){ctx.save();ctx.rotate(i*Math.PI/2);ctx.fillStyle=lg(0,-12,0,0,'#7a889b','#4d596b');ctx.beginPath();ctx.moveTo(-9,-1);ctx.lineTo(9,-1);ctx.lineTo(5,-11);ctx.lineTo(-5,-11);ctx.closePath();ctx.fill();ctx.restore()}ctx.fillStyle='#ffd24a';ctx.beginPath();ctx.arc(0,0,3.5,0,7);ctx.fill();[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,c])=>{ctx.fillStyle='#e7c53a';ctx.fillRect(a*16-3,c*16-3,6,6)})});
 glow(x+o.sx,y-11,12,'rgba(255,210,80,.5)',b.done?pul(.6,.3):.2);o.F(.06,.2,.94,.34,'#e7c53a');for(let i=0;i<8;i+=2)o.F(.06+i*.11,.2,.115+i*.11,.34,'#1a1a1a');
 bx(x-s*.32,y+s*K*.24,9,7,'#9a8a5a');bx(x+s*.3,y+s*K*.22,9,7,'#8a7a50')},
barracks:(b,s,x,y)=>{const o=bx(x,y,s,20,'#8996ab'),{X,Y,w,d,h,sx}=o,ry=Y-h-d/2-9,tf=Y-h,tb=Y-h-d;
 qd([X+sx,tb,X+w+sx,tb,X+w+sx,ry,X+sx,ry],lg(0,tb,0,ry,'#4a78c8','#6e9be0'));
 qd([X+sx,ry,X+w+sx,ry,X+w+sx,tf,X+sx,tf],lg(0,ry,0,tf,'#3a62ad','#2a4a8a'),'rgba(0,0,0,.4)');
 ctx.strokeStyle='#cfe0ff';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(X+sx,ry);ctx.lineTo(X+w+sx,ry);ctx.stroke();
 o.F(.28,0,.72,.62,'#0b1018');o.F(.3,0,.7,.08,'#e7c53a');glow(x,Y-6,18,'rgba(255,200,120,.35)',.7);
 [.08,.8].forEach(u=>o.F(u,.35,u+.12,.7,'#9fe7ff'));o.S(.2,.35,.45,.7,'#9fe7ff');o.S(.55,.35,.8,.7,'#9fe7ff');
 const px=X+w*.88+sx,py=tf-d*.3,wv=Math.sin(frame*.15)*2;ctx.strokeStyle='#ddd';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px,py-30);ctx.stroke();qd([px,py-30,px+14,py-27+wv,px,py-22],'#d63b3b');
 for(let i=0;i<7;i++)el(X+6+i*(w-12)/6,Y+3,4.5,2.6,'#a8935f')},
factory:(b,s,x,y)=>{const o=bx(x,y,s,24,'#8b95a4'),{X,Y,w,d,h,sx}=o,by=Y-h-d*.7;
 [[-.3,'#4b5360',24],[0,'#59626f',32]].forEach(([a,c,hg])=>{cyl(x+w*a+sx,by,5.5,hg,c);if(b.done)smk(x+w*a+sx,by-hg,4,a*40,'rgba(70,70,76,')});
 o.F(.1,0,.64,.62,'#10151c');for(let i=0;i<6;i++)o.F(.1,i*.1,.64,i*.1+.04,'#2c3440');o.F(.1,0,.64,.07,'#ff9a30');glow(x-w*.14,Y-3,20,'rgba(255,150,50,.4)',.6);
 o.F(0,.84,1,.94,'#e08a1e');for(let i=0;i<10;i+=2)o.F(i*.1,.84,i*.1+.05,.94,'#1a1a1a');o.F(.72,.15,.94,.55,'#262d38');o.S(.2,.3,.8,.7,'#3a424e');
 o.R(()=>{ctx.strokeStyle='#e7a022';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-w*.45,w*.16);ctx.lineTo(w*.45,w*.16);ctx.moveTo(-w*.45,w*.3);ctx.lineTo(w*.45,w*.3);ctx.stroke();const q=Math.sin(frame*.02)*w*.3;ctx.fillStyle='#f0b020';ctx.fillRect(q-5,w*.12,10,w*.22);ctx.strokeStyle='#222';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(q,w*.23);ctx.lineTo(q,w*.23+6);ctx.stroke()})},
starport:(b,s,x,y)=>{const o=bx(x,y,s,16,'#9aa6b8'),{X,Y,w,d,h,sx}=o;
 o.F(.3,0,.7,.7,'#0c121a');o.F(.3,.7,.7,.8,'#e7c53a');o.F(0,.86,1,.94,'#3a8bff');
 o.R(()=>{const r=w*.3,cx=-w*.1;ctx.fillStyle='#2b3442';ctx.beginPath();ctx.arc(cx,2,r,0,7);ctx.fill();ctx.strokeStyle='#dfe8f6';ctx.lineWidth=3;ctx.stroke();ctx.strokeStyle='#e7c53a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,2,r*.7,0,7);ctx.stroke();ctx.fillStyle='#dfe8f6';ctx.fillRect(cx-6,-7,3,14);ctx.fillRect(cx+3,-7,3,14);ctx.fillRect(cx-6,-1,12,3);
  for(let i=0;i<12;i++){const a=i*Math.PI/6;ctx.fillStyle=(i+(frame>>3))%4==0?'#6dff8a':'#2a5a3a';ctx.beginPath();ctx.arc(cx+Math.cos(a)*r,2+Math.sin(a)*r,2,0,7);ctx.fill()}});
 const tx=x+w*.34+sx,ty=Y-h-d*.55;cyl(tx,ty,6,28,'#b3bfd0');dom(tx,ty-28,7,7,'#6fd6ff');ctx.save();ctx.translate(tx,ty-37);ctx.rotate(Math.sin(frame*.03)*.6);rc(-8,-1,16,2,'#dfe8f6');rc(-1,-5,2,5,'#dfe8f6');ctx.restore();glow(tx,ty-33,10,'rgba(120,230,255,.5)',.6)},
academy:(b,s,x,y)=>{const o=bx(x,y,s*.96,15,'#8f9cae'),{X,Y,w,d,h,sx}=o;
 o.F(.38,0,.62,.55,'#0e1820');o.F(.34,0,.66,.1,'#d9e6f2');[.1,.22,.68,.8].forEach(u=>o.F(u,.3,u+.07,.8,'#3fe0c8'));o.F(0,.88,1,.96,'#2fb89e');
 [[-.34,-.28],[.34,-.28],[-.34,.3],[.34,.3]].forEach(([a,c])=>cyl(x+w*a+sx,Y-h-d*.5+c*d*.6,3.5,12,'#c9d4e2'));
 dom(x+sx,y-h,w*.3,18,'#4fe0c4');glow(x+sx,y-h-9,22,'rgba(80,255,220,.5)',pul(.5,.3));ctx.strokeStyle='#e8fbff';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(x+sx,y-h,w*.3,w*.3*K,0,0,7);ctx.stroke()},
refinery:(b,s,x,y)=>{glow(x,y,40,'rgba(70,255,120,.35)',.8);cyl(x,y,s*.48,6,'#566272');
 cyl(x-9,y-3,12,30,'#4f9a68');ctx.fillStyle='rgba(190,255,210,.4)';ctx.fillRect(x-17,y-30,3,24);cyl(x+13,y+1,7,20,'#6d7a8c');
 ctx.strokeStyle='#8794a6';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x-8,y-6);ctx.lineTo(x+13,y-10);ctx.stroke();ctx.strokeStyle='#e7c53a';ctx.lineWidth=1.5;ctx.setLineDash([5,5]);ctx.stroke();ctx.setLineDash([]);
 ctx.strokeStyle='#cbd4e0';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x-22,y+4);ctx.lineTo(x-16,y-44);ctx.moveTo(x-10,y+4);ctx.lineTo(x-12,y-44);for(let i=0;i<4;i++){ctx.moveTo(x-21+i*.5,y-i*11);ctx.lineTo(x-11,y-i*11-9)}ctx.stroke();
 const f=1+Math.sin(frame*.4)*.25;el(x+13,y-24,3*f,6*f,'#ff8a2a');el(x+13,y-24,1.6,3.5*f,'#fff2a0');glow(x+13,y-26,16,'rgba(255,150,60,.6)',.6+.3*f);if(b.done)smk(x+13,y-28,3,x,'rgba(200,235,210,')},
bunker:(b,s,x,y)=>{const o=bx(x,y,s*.98,14,'#8b8f76'),{X,Y,w,d,h,sx}=o,n=b.ld?b.ld.length:0;
 o.R(()=>{ctx.fillStyle='#5f6350';ctx.beginPath();ctx.roundRect(-w*.42,-w*.42,w*.84,w*.84,8);ctx.fill();ctx.strokeStyle='#3a3d30';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#a9ad92';for(let i=-1;i<=1;i+=2)for(let j=-1;j<=1;j+=2){ctx.beginPath();ctx.arc(i*w*.32,j*w*.32,1.6,0,7);ctx.fill()}ctx.beginPath();ctx.moveTo(-w*.42,0);ctx.lineTo(w*.42,0);ctx.stroke()});
 o.F(.1,.42,.9,.72,'#06080b');for(let i=0;i<4;i++){const u=.16+i*.2;o.F(u,.5,u+.12,.64,i<n?'#ffb347':'#1a2028');if(i<n)glow(X+u*w+8,Y-h*.57,8,'rgba(255,170,60,.6)',.7)}
 for(let i=0;i<7;i++)el(X+4+i*(w-8)/6,Y+3,4.5,2.6,'#b19b66');ctx.fillStyle='#7cf5c0';ctx.font='bold 9px Courier New';ctx.textAlign='center';ctx.fillText(n+'/4',x,Y-h-d-4)},
turret:(b,s,x,y)=>{cyl(x,y,13,7,'#76808f');cyl(x,y-7,9,7,'#98a3b3');
 let tg=null,m=210;if(b.done)for(const e of nearEntities(b.x,b.y,m+20))if(e.team==2&&e.air&&e.hp>0){const d=Math.hypot(e.x-b.x,e.y-b.y);if(d<m){m=d;tg=e}}
 const a0=b.ta||0,da=tg?Math.atan2(tg.y-b.y,tg.x-b.x):a0+.02;b.ta=a0+Math.atan2(Math.sin(da-a0),Math.cos(da-a0))*.2;
 ctx.save();ctx.translate(x,y-18);ctx.scale(1,K+.3);ctx.rotate(b.ta);rc(-5,-3,9,6,'#aab4c3');[-8,5].forEach(o=>{rc(-4,o,18,4,'#4a525e');rc(14,o,3,4,b.cd>0?'#ff7a3a':'#d6a82e')});ctx.restore();glow(x,y-20,10,'rgba(255,210,100,.45)',b.cd>0?1:.4)},
ebay:(b,s,x,y)=>{const o=bx(x,y,s,22,'#8c99ac'),{X,Y,w,d,h,sx}=o;
 o.F(.08,.3,.92,.64,'#1a2a3a');o.F(.1,.34,.9,.6,'#3ddcff');glow(x,Y-h*.5,24,'rgba(61,220,255,.35)',pul(.5,.2));o.F(0,0,1,.1,'#2a76d8');
 o.R(()=>{ctx.fillStyle='#2a76d8';ctx.fillRect(-w*.4,-w*.4,w*.34,w*.34);ctx.strokeStyle='#cfe8ff';ctx.lineWidth=1;ctx.strokeRect(-w*.4,-w*.4,w*.34,w*.34);ctx.beginPath();ctx.moveTo(-w*.4,-w*.23);ctx.lineTo(-w*.06,-w*.23);ctx.moveTo(-w*.23,-w*.4);ctx.lineTo(-w*.23,-w*.06);ctx.stroke()});
 const bx0=x+sx+w*.2,by0=Y-h-d*.5,a1=-1.2+Math.sin(frame*(b.up?.08:.02))*.5,a2=a1+1.4+Math.sin(frame*.05)*.4;cyl(bx0,by0,5,5,'#c9d4e2');
 const j1x=bx0+Math.cos(a1)*18,j1y=by0-5+Math.sin(a1)*18,tx=j1x+Math.cos(a2)*16,ty=j1y+Math.sin(a2)*16;ctx.lineCap='round';ctx.strokeStyle='#f0b020';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(bx0,by0-5);ctx.lineTo(j1x,j1y);ctx.stroke();ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(j1x,j1y);ctx.lineTo(tx,ty);ctx.stroke();ctx.lineCap='butt';el(j1x,j1y,3.5,3.5,'#444');if(b.up)glow(tx,ty,12,'rgba(255,230,120,.8)',.8)},
armory:(b,s,x,y)=>{const o=bx(x,y,s,26,'#6e7886'),{X,Y,w,d,h,sx}=o;
 o.F(.05,.12,.95,.58,'#59626f');for(let i=0;i<8;i++)o.F(.08+i*.115,.5,.1+i*.115,.54,'#aab3c0');o.F(.36,0,.64,.42,'#1a0e08');o.F(.38,0,.62,.34,lg(0,Y,0,Y-10,'#ffb040','#c0400a'));glow(x,Y-8,22,'rgba(255,130,40,.55)',pul(.6,.3));o.F(0,.78,1,.88,'#e0821a');
 const cx=x+sx+w*.22,c0=Y-h-d*.55;cyl(cx,c0,9,22,'#4c545f');el(cx,c0-22,6,3.5,'#ff8a2a');glow(cx,c0-24,18,'rgba(255,140,50,.6)',pul(.6,.4));if(b.done)smk(cx,c0-24,3,x,'rgba(80,70,66,');
 o.R(()=>{[-w*.3,-w*.1].forEach(q=>{ctx.fillStyle='#3a424e';ctx.fillRect(q-3,-w*.1,6,w*.42);ctx.fillStyle='#0c0f14';ctx.fillRect(q-2,w*.3,4,3)})})},
comsat:(b,s,x,y)=>{cyl(x,y,15,6,'#8995a7');cyl(x,y-6,9,8,'#a3afc0');
 ctx.strokeStyle='#c9d4e2';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-4,y-14);ctx.lineTo(x,y-36);ctx.lineTo(x+4,y-14);ctx.stroke();ctx.lineWidth=1;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(x-3.5+i*.8,y-17-i*7);ctx.lineTo(x+3.5-i*.8,y-21-i*7);ctx.stroke()}
 const sc=typeof SCN!='undefined'&&SCN.length&&b.done,a=frame*(sc?.12:.03),wv=Math.abs(Math.cos(a));
 ctx.save();ctx.translate(x,y-40);ctx.rotate(-.35);ctx.fillStyle=lg(-14,0,14,0,'#eef3fa','#8a96a8');ctx.beginPath();ctx.ellipse(0,0,4+13*wv,11,0,0,7);ctx.fill();ctx.strokeStyle='#4a5463';ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle='#707c8e';ctx.beginPath();ctx.ellipse(1,0,2+7*wv,6,0,0,7);ctx.fill();ctx.restore();el(x+3*wv,y-40,1.8,1.8,'#e7c53a');
 if(sc)for(let i=0;i<2;i++){const p=((frame*.03+i*.5)%1);ctx.strokeStyle='rgba(120,255,255,'+.6*(1-p)+')';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y-40,14+p*34,(14+p*34)*K,0,0,7);ctx.stroke()}
 el(x,y-44,2,2,frame%60<30?'#ff4b3a':'#5a1a14')}};
// ---------- Zerg ----------
const ZR={
hatchery:(b,s,x,y)=>{const h=s/2,p=Math.sin(frame*.05)*1.6;skt(x,y,h*1.34);
 mnd(x,y,h,20,'#5a2a55',10);mnd(x,y-16,h*.76+p,20,'#6d3266',10);[[-.5,.08],[.5,.08],[0,-.22]].forEach(([a,c])=>mnd(x+a*h,y-30+c*h*K*2,h*.3+p*.4,16,'#8a4478',7));
 ctx.strokeStyle='rgba(255,120,200,.4)';ctx.lineWidth=1.5;for(let i=0;i<6;i++){const a=i*1.05+.4;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*h*.28,y-32+Math.sin(a)*h*.2);ctx.quadraticCurveTo(x+Math.cos(a)*h*.55,y-20+Math.sin(a)*h*.3,x+Math.cos(a)*h*.8,y-6+Math.sin(a)*h*.55*K);ctx.stroke()}
 const my=y+h*K*.5-6;el(x,my,17,8,'#12040f');glow(x,my,18,'rgba(255,140,60,.6)',pul(.6,.4));for(let i=0;i<7;i++){const a=Math.PI*(i/6);qd([x+Math.cos(a)*15-1.5,my+Math.sin(a)*7-2,x+Math.cos(a)*15,my+Math.sin(a)*7+4,x+Math.cos(a)*15+1.5,my+Math.sin(a)*7-2],'#f2e8cf')}
 for(let i=0;i<6;i++){const a=Math.PI+i*Math.PI/5;spk(x+Math.cos(a)*h*.82,y-20+Math.sin(a)*h*.55*K-4,22,4,'#e4cfa8',Math.cos(a)*5)}[[-.64,.34],[.64,.34]].forEach(([a,c])=>el(x+a*h,y-8+c*h*K,5+p*.5,4,'#e8d8b0'))},
sunken:(b,s,x,y)=>{const a=b.cd>0?10:0,sw=Math.sin(frame*.06+x)*3;skt(x,y,s*.95);
 for(let i=0;i<6;i++){const q=i*1.05+.3;ctx.strokeStyle='#4a1f4a';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+Math.cos(q)*12,y+Math.sin(q)*6*K-2,x+Math.cos(q)*19,y+Math.sin(q)*19*K);ctx.stroke()}
 for(let k=0;k<=12;k++){const f=k/12,r=9*(1-f*.5);ctx.fillStyle=cl('#6a2f62',-.3+f*.5);ctx.beginPath();ctx.ellipse(x+sw*f*f,y-4-f*(26+a),r,r*K,0,0,7);ctx.fill()}
 spk(x+sw,y-30-a,16+a,3.5,'#efe3c4',0);glow(x+sw,y-32-a,10,'rgba(220,120,255,.5)',b.cd>0?1:.3)},
spore:(b,s,x,y)=>{const p=Math.sin(frame*.09+x)*1.2,sw=Math.sin(frame*.05+x)*2;skt(x,y,s*1.1);
 for(let i=0;i<4;i++){const q=i*1.6+.5;ctx.strokeStyle='#4a1f4a';ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+Math.cos(q)*9,y-2,x+Math.cos(q)*15,y+Math.sin(q)*15*K);ctx.stroke()}
 for(let k=0;k<=10;k++){const f=k/10;ctx.fillStyle=cl('#6a2f62',-.3+f*.4);ctx.beginPath();ctx.ellipse(x+sw*f*f,y-3-f*17,6-f*2,(6-f*2)*K,0,0,7);ctx.fill()}
 [-1,0,1].forEach(i=>spk(x+sw+i*5,y-19,8,2.5,'#efe3c4',i*3));const g=ctx.createRadialGradient(x+sw-3,y-29,1,x+sw,y-27,12);g.addColorStop(0,'rgba(220,255,255,.95)');g.addColorStop(.6,'rgba(90,220,230,.85)');g.addColorStop(1,'rgba(30,110,140,.9)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x+sw,y-27,9+p,11+p*.5,0,0,7);ctx.fill();
 glow(x+sw,y-27,18,'rgba(130,255,255,.6)',pul(.6,.4));for(let i=0;i<3;i++){const q=(frame*.02+i/3)%1;el(x+sw+Math.sin(i*2+q*4)*8,y-38-q*22,1.6,1.6,'rgba(190,255,255,'+(1-q)+')')}},
pool:(b,s,x,y)=>{const h=s/2;skt(x,y,h*1.25);mnd(x,y,h*.98,7,'#6a2f62',5);el(x,y-6,h*.72,h*.72*K,'#17301a');
 const g=ctx.createRadialGradient(x,y-6,2,x,y-6,h*.7);g.addColorStop(0,'#e4ff9a');g.addColorStop(.5,'#6fe03a');g.addColorStop(1,'#1c5a24');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y-6,h*.64,h*.64*K,0,0,7);ctx.fill();glow(x,y-8,h*.9,'rgba(130,255,70,.5)',pul(.7,.3));
 for(let i=0;i<5;i++){const q=(frame*.015+i*.2)%1,X=x+Math.cos(i*2.4)*h*.35,Y=y-6+Math.sin(i*2.4)*h*.2;ctx.strokeStyle='rgba(235,255,190,'+(1-q)+')';ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(X,Y-q*6,2+q*4,(2+q*4)*.6,0,0,7);ctx.stroke()}
 for(let i=0;i<8;i++){const a=i*.785;el(x+Math.cos(a)*h*.92,y-4+Math.sin(a)*h*.92*K,4,3,'#a0496a')}},
evo:(b,s,x,y)=>{const h=s/2;skt(x,y,h*1.3);mnd(x,y,h*.9,10,'#5a2a55',5);mnd(x,y-8,h*.7,32,'#7c4a72',14);
 ctx.strokeStyle='rgba(30,8,32,.5)';ctx.lineWidth=1.5;for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse(x,y-12-i*5.5,h*.62*(1-i*.1),h*.62*(1-i*.1)*K,0,.1,Math.PI-.1);ctx.stroke()}
 [[-.26,-16],[.26,-22],[0,-28]].forEach(([a,c],i)=>{const X=x+a*h*1.4,Y=y+c+4;el(X,Y,5,6,'rgba(255,120,190,.9)');glow(X,Y,16,'rgba(255,100,160,.6)',pul(.6,.4)+i*.05)});
 spk(x-h*.74,y-6,20,3.5,'#e4cfa8',-6);spk(x+h*.74,y-6,20,3.5,'#e4cfa8',6);if(b.done)smk(x+h*.2,y-36,3,x,'rgba(255,170,205,')},
den:(b,s,x,y)=>{const h=s/2;skt(x,y,h*1.25);mnd(x,y,h*.95,12,'#4f2a4a',7);mnd(x,y-9,h*.7,12,'#63396a',7);
 const cy0=y+h*K*.35-6;el(x,cy0,15,9,'#0a0309');glow(x,cy0,14,'rgba(120,255,90,.4)',.5);for(let i=0;i<6;i++){const a=Math.PI+i*Math.PI/5;qd([x+Math.cos(a)*14-2,cy0+Math.sin(a)*8,x+Math.cos(a)*14,cy0+Math.sin(a)*8+6,x+Math.cos(a)*14+2,cy0+Math.sin(a)*8],'#f2e8cf')}
 [-.6,-.22,.22,.6].forEach(a=>spk(x+a*h*.95,y-16+Math.abs(a)*8,28-Math.abs(a)*14,4,'#e4d2aa',-a*22));el(x-8,cy0+8,2.5,3.5,'#7fe03a');el(x+9,cy0+7,2,3,'#7fe03a')},
spire:(b,s,x,y)=>{const h=s/2;skt(x,y,h*1.2);mnd(x,y,h*.78,10,'#4a2a5c',6);let tx=x;
 for(let k=0;k<=18;k++){const f=k/18,r=h*.5*(1-f*.8);tx=x+Math.sin(f*5+frame*.01)*3*f;ctx.fillStyle=cl('#6b4a96',-.35+f*.65);ctx.beginPath();ctx.ellipse(tx,y-8-f*44,r,r*K,0,0,7);ctx.fill();if(k%3==0){ctx.strokeStyle='rgba(20,8,40,.4)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(tx,y-8-f*44,r,r*K,0,0,Math.PI);ctx.stroke()}}
 spk(x-h*.45,y-18,22,3.5,'#d9c8f0',-8);spk(x+h*.45,y-18,22,3.5,'#d9c8f0',8);glow(tx,y-54,18,'rgba(90,255,230,.75)',pul(.6,.4));el(tx,y-53,2.5,2.5,'#e8fffa')},
cav:(b,s,x,y)=>{const h=s/2;skt(x,y,h*1.3);mnd(x,y,h*.98,16,'#4a2548',8);mnd(x,y-12,h*.82,18,'#5e3260',9);mnd(x,y-26,h*.5,12,'#74407a',6);
 ctx.strokeStyle='rgba(25,6,28,.5)';ctx.lineWidth=1.5;for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse(x,y-12-i*6,h*.8*(1-i*.14),h*.8*(1-i*.14)*K,0,.15,Math.PI-.15);ctx.stroke()}
 const my=y+h*K*.5-5;el(x,my,20,10,'#0a0208');glow(x,my,20,'rgba(255,60,50,.55)',pul(.6,.4));spk(x-h*.8,y-6,36,5,'#f2e8cf',16);spk(x+h*.8,y-6,36,5,'#f2e8cf',-16)}};
function scaf(x,y,s,hh,p){const h=s/2,d=h*K,H=(hh+10)*Math.min(1,.4+p);ctx.save();ctx.strokeStyle='#d6a82e';ctx.globalAlpha=.85;[[-1,1],[1,1],[1,-1],[-1,-1]].forEach(([a,c],i)=>{const X=x+a*h,Y=y+c*d;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(X,Y);ctx.lineTo(X,Y-H);ctx.stroke();if(i<2){ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(X,Y);ctx.lineTo(x-a*h,Y-H*.5);ctx.stroke()}});if(frame%5<2)glow(x+Math.sin(frame)*h*.7,y-H*.4,14,'rgba(255,210,120,.8)');ctx.restore()}
function drawB(b){const t=T[b.t],s=t.size,h=s/2,dp=h*K,hh=(b.t==='depot'&&b.lowered)?3:HH[b.t],cx=b.x,cy=b.y*K,x0=cx-h,yb=cy+dp,yt=cy-dp,p=b.done?1:Math.min(1,b.pr/t.bt);
 ctx.save();ctx.globalAlpha=b.done?1:.55+.45*p;
 el(cx+hh*.45,cy+hh*.2,h*1.05,dp*1.05,'rgba(0,0,0,.28)');el(cx,cy,h*1.04,dp*1.1,'rgba(0,0,0,.2)');
 if(!b.done){ctx.translate(cx,yb);ctx.scale(1,.4+.6*p);ctx.translate(-cx,-yb)}
 const f=(b.team==1?TD:ZR)[b.t];if(f)f(b,s,cx,cy);
 ctx.restore();if(!b.done&&b.team==1)scaf(cx,cy,s,hh,p);
 if(b.hp<b.maxHp||sel.includes(b)||!b.done)bar(cx,yt-hh-9,s,b.hp/b.maxHp);
 if(sel.includes(b)){ctx.save();ctx.shadowColor='#3cff7a';ctx.shadowBlur=10;ctx.strokeStyle='#4dff88';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(cx,cy,h+6,dp+5,0,0,7);ctx.stroke();ctx.restore()}
 if(b.q&&b.q.length&&b.team==1){rc(x0,yb+6,s,3,'#222');rc(x0,yb+6,s*b.qt/T[b.q[0]].bt,3,'#5cf')}}

function drawMin(p){const x=p.x,y=p.y*K,sd=(p.x*.37+p.y*.91)%6.28,f=Math.min(1,p.a/1500),n=Math.max(3,Math.ceil(f*6));ctx.save();
 el(x+5,y+4,24,8,'rgba(0,0,0,.34)');el(x,y+2,20,7.5,'#352e25');el(x,y,18,6.5,'#5b5043');el(x-4,y-1.5,10,3,'#77695a');
 for(let i=0;i<6;i++){const a=sd+i*1.05;el(x+Math.cos(a)*17,y+1+Math.sin(a)*5,1.8+i%2,1.3,i%2?'#6e6350':'#463c30')}
 // Mineral crystals remain matte and static; no animated glow.
 const C=[[-2,-3,9,26,-1],[-13,1,7.5,15,-2.5],[11,2,7.5,14,2.5],[8,-3,6,19,2],[-8,-4,6,17,-2],[2,6,6,10,.5]];
 C.slice(0,n).sort((a,b)=>a[1]-b[1]).forEach(([dx,dy,w,h,l],i)=>{const X=x+dx,Y=y+dy,H=h*(.55+.45*f),ax=X+l,ay=Y-H;
  qd([X-w,Y,X-w*.7+l*.4,Y-H*.62,ax-w*.28,ay+H*.06,ax,ay,X,Y],lg(X-w,Y,ax,ay,'#2a74d8','#a9e6ff'),'rgba(0,30,90,.6)');
  qd([X,Y,ax,ay,ax+w*.3,ay+H*.08,X+w*.75+l*.5,Y-H*.55,X+w,Y],lg(X,Y,X+w,ay,'#082f86','#2f78d6'),'rgba(0,25,80,.6)');
  qd([ax-w*.28,ay+H*.06,ax,ay,ax+w*.3,ay+H*.08,ax+w*.05,ay+H*.28],'rgba(255,255,255,.55)');
  ctx.strokeStyle='rgba(235,250,255,.7)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(X,Y);ctx.lineTo(ax,ay);ctx.stroke();
});
 ctx.restore()}
function drawGY(g){if(g.r&&g.r.hp>0)return;const x=g.x,y=g.y*K;
 const rk=i=>{const a=i*.9+g.x,r=22+(i*37%5),z=4+(i*13%3);return{X:x+Math.cos(a)*r,Y:y+Math.sin(a)*r*K,z,front:Math.sin(a)>0}};
 const rock=r=>{el(r.X+2,r.Y+2,r.z+2,(r.z+2)*K,'rgba(0,0,0,.35)');qd([r.X-r.z,r.Y,r.X-r.z*.6,r.Y-r.z*1.4,r.X+r.z*.3,r.Y-r.z*1.6,r.X+r.z,r.Y-r.z*.6,r.X+r.z*.9,r.Y],lg(r.X-r.z,0,r.X+r.z,0,'#7d7666','#3f3b32'),'rgba(0,0,0,.4)')};
 el(x,y+2,32,32*K,'rgba(12,18,8,.55)');glow(x,y,34,'rgba(60,255,120,.26)',pul(.7,.25));
 for(let i=0;i<8;i++){const r=rk(i);if(!r.front)rock(r)}
 el(x,y,24,24*K,'#1b1712');el(x,y-.5,21,21*K,'#2c271e');
 const gr=ctx.createRadialGradient(x,y-1,1,x,y-1,17);gr.addColorStop(0,'#eaffc4');gr.addColorStop(.45,'#6bef6a');gr.addColorStop(1,'#14693a');ctx.fillStyle=gr;ctx.beginPath();ctx.ellipse(x,y-1,16,16*K,0,0,7);ctx.fill();
 for(let i=0;i<3;i++){const q=(frame*.02+i*.33+g.x)%1;ctx.strokeStyle='rgba(235,255,200,'+(.8*(1-q))+')';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x+Math.cos(i*2.1)*6,y-1+Math.sin(i*2.1)*3,2+q*5,(2+q*5)*.6,0,0,7);ctx.stroke()}
 for(let i=0;i<8;i++){const r=rk(i);if(r.front)rock(r)}
 const pf2=i=>{const q=(frame*.012+i/7+g.x*.01)%1,a=q<.12?q/.12:1-(q-.12)/.88;return{a,X:x+Math.sin(q*5+i*2)*5*q,Y:y-6-q*54,r:3+q*11}};
 for(let i=0;i<7;i++){const q=pf2(i);ctx.fillStyle='rgba(50,150,90,'+.32*q.a+')';ctx.beginPath();ctx.arc(q.X,q.Y,q.r,0,7);ctx.fill()}
 ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<7;i++){const q=pf2(i),gg=ctx.createRadialGradient(q.X,q.Y,0,q.X,q.Y,q.r);gg.addColorStop(0,'rgba(200,255,175,'+.45*q.a+')');gg.addColorStop(1,'rgba(60,200,100,0)');ctx.fillStyle=gg;ctx.fillRect(q.X-q.r,q.Y-q.r,2*q.r,2*q.r)}ctx.restore();
 glow(x,y-4,10,'rgba(200,255,170,.6)',pul(.6,.3))}
// fog (1/8 scale, soft edges from upscaling)
const FC=document.createElement('canvas'),EC=document.createElement('canvas');FC.width=EC.width=300;FC.height=EC.height=200;const fg=FC.getContext('2d'),ex=EC.getContext('2d');
function fog(){
 if(frame!==0 && fogLast>=0 && frame-fogLast<(window.FXQ===2?3:6))return;
 fogLast=frame;
 let signature=VS.length+'|';for(const v of VS)signature+=(v[0]/6|0)+','+(v[1]/6|0)+','+(v[2]/4|0)+';';
 if(frame>0&&signature===fogVisionSignature)return;
 fogVisionSignature=signature;
 ex.globalCompositeOperation='source-over';ex.fillStyle='#fff';
 for(const v of VS){ex.beginPath();ex.arc(v[0]/8,v[1]/8,v[2]/8,0,7);ex.fill()}
 fg.globalCompositeOperation='source-over';fg.fillStyle='rgba(1,5,11,.50)';fg.fillRect(0,0,300,200);
 fg.globalCompositeOperation='destination-out';fg.globalAlpha=.53;fg.drawImage(EC,0,0);fg.globalAlpha=1;
 const brush=getFogBrush();
 for(const v of VS){const R=v[2]/8*1.06,x=v[0]/8,y=v[1]/8;fg.drawImage(brush,x-R,y-R,R*2,R*2)}
 fg.globalCompositeOperation='source-over';
}
let renderListCache=[],renderListKey='',minimapCache=null,minimapSource=null;
function getRenderList(w,h){
 const key=B.length+'|'+U.length+'|'+Math.floor(cam.x/64)+'|'+Math.floor(cam.y/64);
 if((frame%3)===0||key!==renderListKey){
  renderListCache.length=0;
  const left=cam.x-95,right=cam.x+w+95,top=(cam.y-125)/K,bottom=(cam.y+h+125)/K;
  for(const b of B)if(b.x+b.size>left&&b.x-b.size<right&&b.y+b.size>top&&b.y-b.size<bottom)renderListCache.push(b);
  for(const u of U)if(!u.air&&u.x>left&&u.x<right&&u.y>top&&u.y<bottom)renderListCache.push(u);
  renderListCache.sort((a,b)=>a.y+(a.b?a.size/2:0)-b.y-(b.b?b.size/2:0));
  renderListKey=key;
 }
 return renderListCache;
}
// Cached vignette and hatchery haze: never rebuild gradients while drawing a frame.
let vignette=null,vignetteW=0,vignetteH=0;
function bakedVignette(w,h){
 if(vignette&&vignetteW===w&&vignetteH===h)return vignette;
 vignetteW=w;vignetteH=h;vignette=document.createElement('canvas');vignette.width=w;vignette.height=h;
 const v=vignette.getContext('2d'),g=v.createRadialGradient(w/2,h/2,Math.min(w,h)*.54,w/2,h/2,Math.max(w,h)*.78);
 g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.26)');v.fillStyle=g;v.fillRect(0,0,w,h);return vignette;
}
let fogBrush=null,fogLast=-1,fogVisionSignature='';
addEventListener('korhal:reset',()=>{fogLast=-1;fogVisionSignature='';renderListKey='';minimapSource=null});
function getFogBrush(){if(fogBrush)return fogBrush;
 fogBrush=document.createElement('canvas');fogBrush.width=fogBrush.height=144;
 const c=fogBrush.getContext('2d'),g=c.createRadialGradient(72,72,15,72,72,72);
 g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(.80,'rgba(0,0,0,.98)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,144,144);return fogBrush;
}
function draw(){const w=cv.width,h=cv.height;ctx.clearRect(0,0,w,h);ctx.drawImage(TC,cam.x,cam.y/K,w,h/K,0,0,w,h);ctx.save();ctx.translate(-cam.x,-cam.y);
 // Large animated hatchery fog is disabled; its base remains fully rendered.
 EX.forEach(e=>{if(!B.some(b=>b.t=='cc'&&D(b,e)<60)){ctx.strokeStyle='rgba(124,245,192,.3)';ctx.setLineDash([6,6]);ctx.beginPath();ctx.ellipse(e.x,e.y*K,46,46*K,0,0,7);ctx.stroke();ctx.setLineDash([])}});
 P.forEach(p=>{if(p.a>0&&p.x>cam.x-65&&p.x<cam.x+w+65&&p.y*K>cam.y-85&&p.y*K<cam.y+h+85)drawMin(p)});GY.forEach(g=>{if(g.x>cam.x-90&&g.x<cam.x+w+90&&g.y*K>cam.y-150&&g.y*K<cam.y+h+130)drawGY(g)});
 getRenderList(w,h).forEach(e=>e.b?drawB(e):drawU(e));for(const u of U)if(u.air&&u.x>cam.x-105&&u.x<cam.x+w+105&&u.y*K>cam.y-130&&u.y*K<cam.y+h+130)drawU(u);
 if(FX.length>(window.FXQ===0?55:window.FXQ===1?125:220))FX.splice(0,FX.length-(window.FXQ===0?55:window.FXQ===1?125:220));FX.forEach(f=>{f.l--;ctx.globalCompositeOperation=window.FXQ===0?'source-over':'lighter';if(f.k=='ln'){ctx.globalAlpha=f.l/f.m;ctx.strokeStyle=f.c;ctx.lineWidth=f.w;ctx.beginPath();ctx.moveTo(f.x1,f.y1*K-10);ctx.lineTo(f.x2,f.y2*K-10);ctx.stroke()}
  else if(f.k=='bm'){const q=f.l/f.m,r=f.r*(1.3-q*.5);ctx.globalAlpha=q;el(f.x,f.y*K-6,r,r*.8,f.c);el(f.x,f.y*K-6,f.r*.5*q,f.r*.4*q,'#fff')}
  else{f.x+=f.vx;f.y+=f.vy;ctx.globalAlpha=f.l/25;rc(f.x,f.y*K-6,3,3,f.c)}ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'});for(let i=FX.length-1;i>=0;i--)if(FX[i].l<=0)FX.splice(i,1);
 ctx.restore();ctx.drawImage(FC,cam.x/W*300,cam.y/K/H*200,w/W*300,h/K/H*200,0,0,w,h);
 if(window.FXQ!==0)ctx.drawImage(bakedVignette(w,h),0,0);
 if(mode&&T[mode]&&ms.in){const s=snap(mode,ms.x+cam.x,(ms.y+cam.y)/K),z=T[mode].size,gx=s.x-cam.x-z/2,gy=s.y*K-cam.y-z*K/2;ctx.strokeStyle=s.ok?'#7cf5c0':'#f55';ctx.fillStyle=s.ok?'rgba(124,245,192,.2)':'rgba(255,80,80,.25)';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(gx,gy,z,z*K,z*.28*K);ctx.fill();ctx.stroke()}
 if(mode=='am'){ctx.strokeStyle='#f55';ctx.beginPath();ctx.arc(ms.x,ms.y,10,0,7);ctx.stroke()}
 if(drag){ctx.strokeStyle='#7cf5c0';ctx.lineWidth=1;ctx.strokeRect(drag.x-cam.x,drag.y*K-cam.y,drag.x2-drag.x,(drag.y2-drag.y)*K)}
 if(msgT>0){msgT--;ctx.globalAlpha=Math.min(1,msgT/40);ctx.save();ctx.shadowBlur=0;ctx.fillStyle='#c4f3ff';ctx.font='600 20px Rajdhani,Segoe UI,sans-serif';ctx.textAlign='center';ctx.fillText(msgS,w/2,84);ctx.restore();ctx.globalAlpha=1}
 // minimap
 if(frame%(window.FXQ===2?2:window.FXQ===1?4:6)!==0)return;
 mc.fillStyle='#000';mc.fillRect(0,0,192,128);if(minimapSource!==TC){minimapCache=document.createElement('canvas');minimapCache.width=192;minimapCache.height=128;minimapCache.getContext('2d').drawImage(TC,0,0,192,128);minimapSource=TC}mc.drawImage(minimapCache,0,0);const k=192/W;
 P.forEach(p=>{if(p.a>0){mc.fillStyle='#5ff';mc.fillRect(p.x*k-1,p.y*k-1,2,2)}});
 B.forEach(b=>{if(b.team==1||b.sn){mc.fillStyle=b.team==1?'#4af':'#c3c';mc.fillRect(b.x*k-3,b.y*k-3,6,6)}});
 U.forEach(u=>{if(u.team==1||seen(u)){mc.fillStyle=u.team==1?'#7f7':'#f44';mc.fillRect(u.x*k-1,u.y*k-1,3,3)}});
 mc.drawImage(FC,0,0,192,128);mc.strokeStyle='#fff';mc.lineWidth=1;mc.strokeRect(cam.x*k,cam.y/K*k,cv.width*k,cv.height/K*k)}
$('intro').onclick=()=>{$('intro').style.display='none'};$('intro').addEventListener('animationend',e=>{if(e.animationName=='inf')$('intro').style.display='none'});
const sfc=$('sf'),sg=sfc.getContext('2d'),STR=Array.from({length:150},()=>({x:Math.random(),y:Math.random(),z:Math.random()*.8+.2,p:Math.random()*6}));
(function sfl(t){const o=$('ov');if(o.style.display!='none'){const w=o.clientWidth,h=o.clientHeight;if(sfc.width!=w||sfc.height!=h){sfc.width=w;sfc.height=h}sg.clearRect(0,0,w,h);const cx=w/2,cy=h*.42,r=Math.min(w,h)*.62,a=t*.0006;[.3,.6,1].forEach(f=>{sg.strokeStyle='rgba(124,245,192,.08)';sg.beginPath();sg.arc(cx,cy,r*f,0,7);sg.stroke()});for(let k=0;k<16;k++){sg.fillStyle='rgba(124,245,192,'+.09*(1-k/16)+')';sg.beginPath();sg.moveTo(cx,cy);sg.arc(cx,cy,r,a-k*.04-.04,a-k*.04);sg.fill()}STR.forEach(s=>{s.x=(s.x+s.z*.00007)%1;sg.fillStyle='rgba(190,230,255,'+s.z*(.4+.6*Math.abs(Math.sin(t*.0012*s.z+s.p)))+')';sg.fillRect(s.x*w,s.y*h,s.z*2.2,s.z*2.2)})}requestAnimationFrame(sfl)})(0);

/* Zerg overlay/render wrapper remains in ai.js to preserve original wrapper order. */

window.Korhal.modules.rendering.loaded=true;
