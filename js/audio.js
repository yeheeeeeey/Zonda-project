/* SECTOR KORHAL v12 — split module: audio */
window.Korhal=window.Korhal||{};
window.Korhal.modules=window.Korhal.modules||{};
window.Korhal.modules.audio=window.Korhal.modules.audio||{};
// ---------- audio ----------
let AC,MG,mute=0,ls={};
function au(){if(AC)return;AC=new(window.AudioContext||window.webkitAudioContext)();const sr=AC.sampleRate,F=(ty,f,q)=>{const n=AC.createBiquadFilter();n.type=ty;n.frequency.value=f;n.Q.value=q||1;return n},G=v=>{const n=AC.createGain();n.gain.value=v;return n},cp=AC.createDynamicsCompressor();cp.threshold.value=-16;cp.knee.value=12;cp.ratio.value=3;cp.release.value=.2;cp.connect(AC.destination);
 MG=G(.5);MG.connect(cp);NB=AC.createBuffer(1,sr*2,sr);{const a=NB.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1}
 MUS=G(.6);MUS.connect(MG);
 const n=sr*2.4|0,ib=AC.createBuffer(2,n,sr),rv=AC.createConvolver();for(let c=0;c<2;c++){const a=ib.getChannelData(c);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n)**2.6}
 rv.buffer=ib;RVS=G(1);RVS.connect(rv);rv.connect(F('lowpass',3200)).connect(G(.5)).connect(MUS);
 DLS=G(1);const dl=AC.createDelay(1),fb=G(.32),df=F('lowpass',2200);dl.delayTime.value=.49;DLS.connect(dl);dl.connect(df);df.connect(fb);fb.connect(dl);df.connect(MUS);
 GD=F('highpass',90);const ws=AC.createWaveShaper(),dg=G(.5),cu=new Float32Array(1024);for(let i=0;i<1024;i++)cu[i]=Math.tanh((i/512-1)*6)*.8;ws.curve=cu;GD.connect(ws);ws.connect(F('lowpass',3000)).connect(dg);dg.connect(MUS);dg.connect(G(.18)).connect(RVS);dg.connect(G(.12)).connect(DLS);
 GC=G(1);const cf=F('lowpass',3200);GC.connect(cf);cf.connect(MUS);cf.connect(G(.4)).connect(RVS);cf.connect(G(.3)).connect(DLS);
 LD=G(1);LD.connect(MUS);LD.connect(G(.5)).connect(RVS);LD.connect(G(.45)).connect(DLS);setInterval(mus,100)}
function tn(f,d,ty='square',v=.08,sl=0,dl=0){if(!AC||mute)return;const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime+dl;o.type=ty;o.frequency.setValueAtTime(f,t);if(sl)o.frequency.exponentialRampToValueAtTime(Math.max(20,f+sl),t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(MG);o.start(t);o.stop(t+d)}
function nz(d,v,f){if(!AC||mute)return;const n=AC.sampleRate*d|0,b=AC.createBuffer(1,n,AC.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=Math.random()*2-1;const s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain();s.buffer=b;fl.type='lowpass';fl.frequency.value=f;g.gain.setValueAtTime(v,AC.currentTime);g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);s.connect(fl);fl.connect(g);g.connect(MG);s.start()}
const S={marine:()=>{nz(.07,.15,5000);tn(900,.05,'square',.04,-600)},firebat:()=>nz(.25,.12,1800),vulture:()=>{nz(.06,.12,6000);tn(500,.08,'sawtooth',.04,-300)},tank:()=>{nz(.2,.2,900);tn(120,.25,'sine',.2,-80)},tank2:()=>{nz(.5,.35,500);tn(70,.5,'sine',.3,-40)},wraith:()=>tn(1400,.12,'sawtooth',.05,-1000),zergling:()=>nz(.05,.1,3000),hydra:()=>tn(300,.1,'sawtooth',.05,300),muta:()=>tn(700,.12,'triangle',.05,-400),ultra:()=>{nz(.15,.2,700);tn(90,.2,'sawtooth',.1)},scv:()=>nz(.04,.05,3000),sunken:()=>nz(.2,.2,600),boom:()=>{nz(.5,.3,700);tn(60,.5,'sine',.3,-30)},done:()=>{tn(660,.12,'triangle',.1);tn(990,.2,'triangle',.1,0,.12)},err:()=>tn(110,.25,'sawtooth',.12),warn:()=>{tn(440,.15,'square',.07);tn(330,.2,'square',.07,0,.18)},click:()=>tn(800,.04,'square',.04),dead:()=>tn(200,.3,'sawtooth',.08,-150)};
function snd(k,x,y){if(!AC||mute)return;if(x!=null&&(x<cam.x-80||x>cam.x+cv.width+80||y*K<cam.y-80||y*K>cam.y+cv.height+80))return;if(ls[k]>frame-3)return;ls[k]=frame;(S[k]||S.click)()}
// Terran-style score: E minor, slide-guitar lead, plucked/palm-muted guitar, synth pad, rock kit. Intensity 0 = base, 1 = enemy seen, 2 = combat.
let MUS,NB,RVS,DLS,GD,GC,LD,nxt=0,stp=0,inten=0,lsel=0,lk=1,theme=Math.random()<.5?1:0;const PL={},mf=m=>440*2**((m-69)/12),
cE=[40,28,[52,59,64,67]],cC=[48,36,[48,55,60,64]],cD=[50,38,[50,57,62,66]],cA=[45,33,[57,60,64,69]],cB=[47,35,[59,63,66,69]],CH=[cE,cE,cC,cD,cE,cC,cA,cB],
MEL=[[[0,71,6,-2],[8,67,4,0],[12,69,4,-1]],[[0,71,8,0],[8,76,8,-2]],[[0,76,4,0],[4,74,4,0],[8,72,8,-1]],[[0,69,4,0],[4,71,2,0],[6,69,2,0],[8,66,8,-2]],[[0,76,6,0],[6,74,2,0],[8,71,4,0],[12,69,4,0]],[[0,67,4,0],[4,69,4,0],[8,76,8,-4]],[[0,72,4,0],[4,71,2,0],[6,69,6,0],[12,64,4,-2]],[[0,75,6,-1],[6,73,2,0],[8,71,8,-2]]];
function plb(m,mt){const k=m+(mt?'m':''),sr=AC.sampleRate;if(PL[k])return PL[k];const N=Math.max(2,Math.round(sr/mf(m)-.5)),n=sr*(mt?.35:1.5)|0,b=AC.createBuffer(1,n,sr),a=b.getChannelData(0),dc=mt?.94:.9988;let p=0,mx=0;for(let i=0;i<N;i++)a[i]=p=p*.45+(Math.random()*2-1)*.55;for(let i=N;i<n;i++)a[i]=dc*.5*(a[i-N]+(a[i-N-1]||0));for(let i=0;i<n;i++)mx=Math.max(mx,Math.abs(a[i]));for(let i=0;i<n;i++)a[i]/=mx;return PL[k]=b}
function plk(m,t,v,dst,mt){const s=AC.createBufferSource(),g=AC.createGain();s.buffer=plb(m,mt);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+(mt?.3:1.1));s.connect(g);g.connect(dst);s.start(t)}
function pdl(n,d,t,v,fc){const fl=AC.createBiquadFilter(),g=AC.createGain();fl.frequency.value=fc;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.9);g.gain.setValueAtTime(v,t+d-1.1);g.gain.exponentialRampToValueAtTime(.0001,t+d);[-8,8].forEach(c=>{const o=AC.createOscillator();o.type='sawtooth';o.frequency.value=mf(n);o.detune.value=c;o.connect(fl);o.start(t);o.stop(t+d+.05)});fl.connect(g);g.connect(MUS);g.connect(RVS)}
function bsl(m,d,t,v,fc){const o=AC.createOscillator(),o2=AC.createOscillator(),fl=AC.createBiquadFilter(),g=AC.createGain(),s=AC.createGain();o.type='sawtooth';o.frequency.value=o2.frequency.value=mf(m);fl.frequency.setValueAtTime(fc*2,t);fl.frequency.exponentialRampToValueAtTime(fc,t+.12);s.gain.value=.8;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.012);g.gain.setValueAtTime(v,t+d*.5);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(fl);fl.connect(g);o2.connect(s);s.connect(g);g.connect(MUS);o.start(t);o2.start(t);o.stop(t+d+.05);o2.stop(t+d+.05)}
function lds(m,len,t,I,gl){const o=AC.createOscillator(),o2=AC.createOscillator(),fl=AC.createBiquadFilter(),g=AC.createGain(),q=AC.createGain(),vb=AC.createOscillator(),vg=AC.createGain(),sl=Math.min(.16,len*.35),v=[.09,.12,.17][I],e=t+len+.25;o.type='sawtooth';o2.type='square';o2.detune.value=7;q.gain.value=.4;[o,o2].forEach(x=>{x.frequency.setValueAtTime(mf(m+gl),t);x.frequency.exponentialRampToValueAtTime(mf(m),t+sl);vg.connect(x.detune);x.start(t);x.stop(e+.05)});vb.frequency.value=5.2;vg.gain.setValueAtTime(0,t);vg.gain.linearRampToValueAtTime(14,t+len*.8);vb.connect(vg);vb.start(t);vb.stop(e+.05);fl.Q.value=2.5;fl.frequency.setValueAtTime(900,t);fl.frequency.linearRampToValueAtTime(1800+I*900,t+.25);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.04);g.gain.linearRampToValueAtTime(v*.75,t+.2);g.gain.setValueAtTime(v*.75,t+Math.max(.21,len*.85));g.gain.exponentialRampToValueAtTime(.0001,e);o.connect(fl);o2.connect(q);q.connect(fl);fl.connect(g);g.connect(I>1?GD:LD)}
function nzb(t,d,v,ty,f,q,rv){const s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NB;fl.type=ty;fl.frequency.value=f;fl.Q.value=q||1;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(fl);fl.connect(g);g.connect(MUS);if(rv)g.connect(RVS);s.start(t,Math.random()*1.5,d+.03)}
function kck(t,v){const o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(155,t);o.frequency.exponentialRampToValueAtTime(40,t+.2);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+.42);o.connect(g);g.connect(MUS);o.start(t);o.stop(t+.45);nzb(t,.015,v*.35,'highpass',2800)}
function snr(t,v){const o=AC.createOscillator(),g=AC.createGain();o.type='triangle';o.frequency.setValueAtTime(210,t);o.frequency.exponentialRampToValueAtTime(130,t+.1);g.gain.setValueAtTime(v*.6,t);g.gain.exponentialRampToValueAtTime(.0001,t+.14);o.connect(g);g.connect(MUS);o.start(t);o.stop(t+.16);nzb(t,.24,v,'bandpass',2000,.7,1)}
function tom(t,f,v){const o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*.55,t+.25);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+.32);o.connect(g);g.connect(MUS);g.connect(RVS);o.start(t);o.stop(t+.35)}
// ---------- music v2: two themes, 3 intensity layers (0 calm, 1 enemy sighted, 2 combat) ----------
function sld(m,len,t,I,gl,v){const o=AC.createOscillator(),o2=AC.createOscillator(),o2g=AC.createGain(),fl=AC.createBiquadFilter(),g=AC.createGain(),vb=AC.createOscillator(),vg=AC.createGain(),sl=Math.min(.18,len*.4),e=t+len+.3;
 o.type='triangle';o2.type='sawtooth';o2g.gain.value=.26;[o,o2].forEach(x=>{x.frequency.setValueAtTime(mf(m+gl),t);x.frequency.exponentialRampToValueAtTime(mf(m),t+sl);vg.connect(x.detune);x.start(t);x.stop(e+.05)});
 vb.frequency.value=5;vg.gain.setValueAtTime(0,t);vg.gain.linearRampToValueAtTime(12,t+len*.9);vb.connect(vg);vb.start(t);vb.stop(e+.05);
 fl.type='lowpass';fl.Q.value=.8;fl.frequency.setValueAtTime(1100,t);fl.frequency.linearRampToValueAtTime(1700+I*800,t+.3);
 g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.07);g.gain.setValueAtTime(v*.8,t+Math.max(.1,len*.8));g.gain.exponentialRampToValueAtTime(.0001,e);o.connect(fl);o2.connect(o2g);o2g.connect(fl);fl.connect(g);g.connect(LD)}
function bel(m,t,v){[1,2.76,5.4].forEach((r,i)=>{const o=AC.createOscillator(),g=AC.createGain();o.frequency.value=mf(m)*r;g.gain.setValueAtTime(v/(i+1),t);g.gain.exponentialRampToValueAtTime(.0001,t+1.6/(i+1));o.connect(g);g.connect(MUS);g.connect(RVS);g.connect(DLS);o.start(t);o.stop(t+1.7)})}
function stb(m,d,t,v,fc){const o=AC.createOscillator(),fl=AC.createBiquadFilter(),g=AC.createGain(),s=AC.createGain();o.type='sawtooth';o.frequency.value=mf(m);fl.Q.value=3;fl.frequency.setValueAtTime(fc*3,t);fl.frequency.exponentialRampToValueAtTime(fc,t+.09);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.gain.value=.25;o.connect(fl);fl.connect(g);g.connect(MUS);g.connect(s);s.connect(DLS);o.start(t);o.stop(t+d+.05)}
// Theme A "Dust & Iron": D minor, slide-guitar lead over arpeggios, 76 BPM. Theme B "Siege Protocol": C minor, brass pads, pulsing synth ostinato and war drums, 88 BPM.
const TA={bpm:76,ch:[[38,[50,57,62,65]],[34,[46,53,58,62]],[41,[48,53,57,60]],[36,[48,55,60,64]],[38,[50,57,62,65]],[34,[46,53,58,62]],[31,[50,55,58,62]],[33,[52,57,61,64]]],
 mel:[[[0,74,6,0],[6,72,2,0],[8,69,8,-2]],[[0,70,6,0],[6,74,2,0],[8,77,8,-2]],[[0,77,6,0],[6,76,2,0],[8,72,8,0]],[[0,76,8,0],[8,74,4,0],[12,72,4,0]],[[0,74,6,0],[6,72,2,0],[8,69,8,-2]],[[0,70,6,0],[6,74,2,0],[8,77,8,-2]],[[0,79,6,0],[6,77,2,0],[8,74,4,0],[12,70,4,0]],[[0,73,4,0],[4,76,4,0],[8,81,8,-2]]]},
TB={bpm:88,ch:[[36,[51,55,58,63]],[32,[51,56,60,63]],[39,[51,55,58,63]],[34,[50,53,58,62]],[36,[51,55,58,63]],[32,[51,56,60,63]],[41,[48,53,56,60]],[43,[50,55,59,62]]],
 mel:[[[0,72,4,0],[4,75,4,0],[8,77,8,-2]],[[0,75,6,0],[6,72,2,0],[8,68,8,-2]],[[0,70,4,0],[4,75,4,0],[8,79,8,-2]],[[0,77,6,0],[6,75,2,0],[8,74,8,0]],[[0,72,4,0],[4,75,4,0],[8,77,8,-2]],[[0,75,8,0],[8,80,8,-3]],[[0,77,4,0],[4,75,4,0],[8,72,4,0],[12,68,4,0]],[[0,74,4,0],[4,71,4,0],[8,67,8,-3]]]};
function mix(){MG.gain.setTargetAtTime(mute?0:.5,AC.currentTime,.05);MUS.gain.setTargetAtTime([.6,.78,1.05][inten]||.6,AC.currentTime,.5)}
function musA(){if(!AC)return;mix();if(mute||paused)return;const I=inten,sp=60/(TA.bpm+I*9)/4,L=sp*16;
 while(nxt<AC.currentTime+.3){if(nxt<AC.currentTime)nxt=AC.currentTime+.05;
  const t=nxt,s=stp&127,bar=s>>4,i=s&15,rt=TA.ch[bar][0],pd=TA.ch[bar][1],fill=bar==7&&i>=12&&I;
  if(i==0)pd.forEach((n,j)=>pdl(n,L+.5,t,j?.028:.04,550+I*300));
  if(!I){if(i==0)bsl(rt,L*.92,t,.16,230);if(i==8&&bar%2)bsl(rt+7,sp*6,t,.09,230);if(i%2==0)plk(pd[[0,1,2,3,2,1,2,3][i>>1]]+12,t,.2,GC,0);if((i==6||i==14)&&bar%2)bel(pd[3]+12,t,.05);if(i%4==2)nzb(t,.06,.025,'highpass',6500)}
  else{if(i%2==0)bsl(rt+(i%8==6?12:0),sp*(I>1?1.5:2),t,.15,360+I*110);if((I>1?[0,2,3,6,8,10,11,14]:[0,3,6,8,11,14]).includes(i))[rt+12,rt+19,rt+24].forEach(n=>plk(n,t,I>1?.26:.2,I>1?GD:GC,i%8));if(i%2==0||I>1)nzb(t,.04,I>1?.06:.05,'highpass',7500)}
  TA.mel[bar].forEach(([st,m,ln,gl])=>{if(st==i)sld(m,sp*ln,t,I,gl,[.07,.1,.13][I])});
  if((I>1?[0,3,6,10,11,14]:I?[0,6,10]:bar%2?[]:[0]).includes(i))kck(t,i?.5:.58);
  if((I?i==4||i==12:i==8&&bar%2)&&!fill)snr(t,[.07,.22,.28][I]);if(fill)tom(t,[200,160,125,95][i-12],.34);
  nxt+=sp;stp++}}
function musB(){if(!AC)return;mix();if(mute||paused)return;const I=inten,sp=60/(TB.bpm+I*8)/4,L=sp*16;
 while(nxt<AC.currentTime+.3){if(nxt<AC.currentTime)nxt=AC.currentTime+.05;
  const t=nxt,s=stp&127,bar=s>>4,i=s&15,rt=TB.ch[bar][0],pd=TB.ch[bar][1],fill=bar==7&&i>=12&&I;
  if(i==0){pd.forEach((n,j)=>pdl(n,L+.5,t,j?.03:.045,500+I*450));bsl(rt,L*.95,t,.15,200);if(bar%4==0)nzb(t,I?1.4:.9,I?.08:.04,'highpass',5000,.6,1)}
  if(!I){if(i==0&&bar%2==0)tom(t,70,.28);if(i==8&&bar%2==0)tom(t,60,.18);if((i==4||i==12)&&bar%2)bel(pd[[1,2,3,2][i>>2&3]]+12,t,.05)}
  else{if(I>1||i%2==0){const ac=[0,6,8,14].includes(i);stb(ac?rt+19:rt+12,sp*.8,t,ac?.14:.09,500+I*250)}if(i%4==0)bsl(rt,sp*3.5,t,.14,300);
   if(I>1?[0,6,8,10,14].includes(i):i==0||i==8)tom(t,i%8?72:90,.3);if((I>1?[0,3,8,11]:[0,8]).includes(i))kck(t,.5);if((I>1?i==4||i==12:i==12)&&!fill)snr(t,I>1?.28:.2);if(fill)tom(t,[200,160,125,95][i-12],.34);if(i%2==0)nzb(t,.04,I>1?.06:.04,'highpass',7500)}
  TB.mel[bar].forEach(([st,m,ln,gl])=>{if(st==i)sld(m,sp*ln,t,I,gl,[.075,.105,.14][I])});
  nxt+=sp;stp++}}
function mus(){if(!AC)return;if(window.korhalMus)return window.korhalMus();(theme?musB:musA)()}
// ---------- unit / building selection sounds ----------
function nxs(d,v,f,ty,dl,f2){if(!AC||mute)return;const t=AC.currentTime+(dl||0),s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NB;fl.type=ty||'lowpass';fl.Q.value=ty=='bandpass'?3:1;fl.frequency.setValueAtTime(f,t);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(fl);fl.connect(g);g.connect(MG);s.start(t,Math.random()*1.5,d+.03)}
const VW={a:[800,1250],e:[500,1900],i:[320,2300],o:[480,850],u:[330,800]};
function vxs(f0,sy,sd,v,dl){if(!AC||mute)return;const t0=AC.currentTime+(dl||0),rc=AC.createBiquadFilter();rc.type='bandpass';rc.frequency.value=1600;rc.Q.value=.6;rc.connect(MG);
 [...sy].forEach((ch,k)=>{const t=t0+k*sd,o=AC.createOscillator(),g=AC.createGain();o.type='sawtooth';o.frequency.setValueAtTime(f0*(k%2?.93:1.07),t);o.frequency.linearRampToValueAtTime(f0*(k%2?1.05:.9),t+sd);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.02);g.gain.setValueAtTime(v,t+sd*.65);g.gain.exponentialRampToValueAtTime(.0001,t+sd);VW[ch].forEach(f=>{const b=AC.createBiquadFilter();b.type='bandpass';b.frequency.value=f;b.Q.value=7;o.connect(b);b.connect(g)});g.connect(rc);o.start(t);o.stop(t+sd+.02)})}
const rdo=d=>{nxs(.05,.14,2600,'bandpass',d);tn(1900,.03,'square',.03,0,(d||0)+.05)},
SEL={
scv:[()=>{rdo();vxs(150,'uo',.1,1.4,.09);tn(1300,.05,'square',.04,-700,.34)},()=>{rdo();vxs(165,'ia',.09,1.4,.09);nxs(.18,.07,5000,'highpass',.3)}],
marine:[()=>{rdo();vxs(105,'ao',.11,1.4,.09)},()=>{nxs(.03,.2,3000,'bandpass');nxs(.03,.2,3000,'bandpass',.08);rdo(.16);vxs(112,'eo',.1,1.4,.24)}],
firebat:[()=>{nxs(.04,.2,4000,'highpass');nxs(.35,.14,500,'bandpass',.04,2200);vxs(80,'ou',.14,1.6,.12)}],
medic:[()=>{[880,1109,1319].forEach((f,i)=>tn(f,.22,'sine',.07,0,i*.07));rdo(.2);vxs(240,'ea',.1,1.2,.28)},()=>{[1319,988,1175].forEach((f,i)=>tn(f,.22,'sine',.07,0,i*.07));rdo(.2);vxs(230,'ia',.1,1.2,.28)}],
vulture:[()=>{tn(80,.4,'sawtooth',.06,300);nxs(.4,.1,1200,'bandpass',0,3500);vxs(130,'ai',.08,1.3,.28)}],
tank:[()=>{tn(55,.55,'sine',.22,-10);nxs(.5,.2,300);tn(420,.09,'square',.05,-250,.18);nxs(.3,.06,4000,'highpass',.12)},()=>{tn(160,.5,'triangle',.06,160);nxs(.4,.15,400);tn(60,.2,'sine',.2,-20,.3)}],
wraith:[()=>{tn(500,.5,'sawtooth',.04,900);[2000,2600,3300].forEach((f,i)=>tn(f,.1,'sine',.03,0,i*.06));rdo(.3);vxs(170,'ei',.09,1.2,.4)}],
cc:[()=>{tn(70,.7,'sawtooth',.07,60);tn(660,.09,'sine',.07,0,.3);tn(880,.14,'sine',.07,0,.4);tn(50,.25,'sine',.25,-20)}],
barracks:[()=>{nxs(.12,.25,900,'bandpass');tn(220,.2,'square',.07,-120);nxs(.35,.07,3500,'highpass',.12)}],
factory:[()=>{tn(90,.15,'square',.08,-40);tn(90,.15,'square',.08,-40,.18);nxs(.3,.08,3500,'highpass',.12);tn(200,.4,'triangle',.04,200,.3)}],
starport:[()=>{nxs(.55,.14,700,'lowpass',0,2500);tn(300,.5,'sawtooth',.04,-200);[0,.08].forEach(d=>tn(1500,.04,'square',.03,0,.4+d))}],
academy:[()=>{[0,1,2,3,4].forEach(i=>tn(900+i*180,.05,'square',.04,0,i*.07))}],
depot:[()=>{nxs(.4,.1,3000,'highpass');tn(150,.08,'square',.06,-60,.32)}],
refinery:[()=>{[0,.13,.26].forEach(d=>tn(70,.11,'sine',.18,-20,d));nxs(.5,.06,3500,'highpass',.1)}],
bld:[()=>{nxs(.1,.2,2000,'bandpass');tn(900,.04,'square',.04,-500,.14);nxs(.2,.1,5000,'highpass',.3)}]};
function selSnd(){if(!AC||mute||!sel.length)return;const n=Date.now();if(n-lsel<140)return;lsel=n;const e=sel[Math.random()*sel.length|0],v=SEL[e.b&&!e.done?'bld':e.t];if(v)v[Math.random()*v.length|0]();else snd('click')}


window.Korhal.modules.audio.loaded=true;
