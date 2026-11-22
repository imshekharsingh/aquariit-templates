// @techin20sec kit topic: Why does your watch flash green? (techreel/topics/heart-green.json). Format xray (rules-tech.md X), the first reel
// on the reset bar of 22 Nov 2026 (Detail bar D1-D8, audience pull P1-P4). One world: a wrist cut open in layers under a watch (skin, capillary
// loops, fat, an artery), green light fanning into it from the watch's back. The case goes clear and the sensor disc lifts out to face the camera;
// the camera dives onto a red blood cell (red bounces, green is soaked up); capillaries and the artery swell on every beat while light particles
// are absorbed or bounce back to the photodiodes; the samples stream into a live pulse trace; night falls and the LEDs go infrared; the last
// frame returns to the opening picture. Facts: Apple Support "Monitor your heart rate with Apple Watch" (support.apple.com/en-us/120277, read
// 22 Nov 2026). No digits on screen (Output QA NUMBERS); the four named words are 92 px type high in the hero zone (Output QA SYNC).
(function(){
const GRN='#5dffa0',GRN2='#2bd477',RED='#ff4d5e',RED2='#ff8f9a',CYN='#8ef0ff',GLD='#ffd36b',LIL='#b9b6ff',IR='#c2185b',SKIN='#c98a8a';
const SY=772,EPI=806,DER=985,FAT=1085,ART=1122,WX0=36,WX1=1044;           // world layers (y): skin top, dermis, fat, artery centre
const LEDX=[468,496,584,612],PDX=[526,554],LY=764;                         // the sensor's LEDs and photodiodes on the watch's back
const BEAT=.86,beat=t=>{const u=((t+.3)%BEAT)/BEAT;return Math.exp(-Math.pow((u-.08)/.06,2))+.45*Math.exp(-Math.pow((u-.3)/.08,2))};   // the pulse shape
const LOOPS=[150,270,390,690,810,930];
const R=mulberry(11);
const CELLS=[...Array(70)].map((_,i)=>({loop:i%6,u:R(),v:.10+R()*.05,s:.8+R()*.4}));
const ACELLS=[...Array(46)].map(()=>({u:R(),dy:(R()-.5)*30,s:.7+R()*.5,v:.16+R()*.06}));
const FIB=[...Array(26)].map(()=>({x:WX0+R()*(WX1-WX0),y:EPI+20+R()*(DER-EPI-40),l:60+R()*90,ph:R()*6}));
const FATG=[...Array(34)].map(()=>({x:WX0+20+R()*(WX1-WX0-40),y:DER+18+R()*(FAT-DER-30),r:14+R()*20}));
const PH=[...Array(64)].map((_,i)=>({led:i%4,ph:R(),dx:(R()-.5)*300,dy:60+R()*170,k:R(),rate:.9+R()*.5}));
const SPECK=[...Array(40)].map(()=>({x:R()*1080,y:480+R()*780,z:.3+R()*.9,ph:R()*6}));
// chapter states from the spoken cues
const xr=t=>eio(prog(t,C.glass-.3,C.glass+.6))*(1-eio(prog(t,st(2)-.5,st(2)+.3)));           // the case goes clear, the skin fades back
const lift=t=>eio(prog(t,C.lights-.4,C.lights+.6))*(1-eio(prog(t,st(2)-.6,st(2)+.2)));       // the sensor disc lifts out and faces us
const dive=t=>eio(prog(t,C.blood2-.3,C.blood2+.6))*(1-eio(prog(t,st(3)-.5,st(3)+.4)));              // the blood-cell close-up
const pulseK=t=>eio(prog(t,C.heartbeat-.3,C.heartbeat+.4));                                     // the beat shown strong from "heartbeat"
const night=t=>eio(prog(t,C.sleep-.3,C.sleep+.7))*(1-eio(prog(t,st(7)-.3,st(7)+.5)));
const irK=t=>eio(prog(t,C.infrared-.4,C.infrared+.3))*(1-eio(prog(t,st(7)-.3,st(7)+.5)));
const trace=t=>win(t,C.heartbeat-.2,st(6)+.6,.5,.6);                                             // the pulse-trace strip
const amp=t=>.35+.65*pulseK(t),bt=t=>beat(t)*amp(t);
function txt(s,x,y,size,col,a=1,al='center',w=800){if(a<=0)return;g.globalAlpha=clamp(a);g.font=`${w} ${size}px "Inter Display",Inter`;g.textAlign=al;g.textBaseline='middle';g.fillStyle=col;g.fillText(s,x,y);g.globalAlpha=1}
function ledCol(t){const n=night(t);return n>.5?IR:GRN}
function ledOn(t,i){const fl=prog(t,C.flash5-.2,C.flash5+.2)*(1-prog(t,st(6)-.2,st(6)+.2));const base=.75+.25*Math.sin(t*9+i);return fl>0?lerp(base,(Math.floor(t*60+i)%2)?1:.25,fl):base}
// ---- the wrist, layer by layer (world space) ----
function skinTop(x){return SY+5*Math.sin(x*.011+.6)+(Math.abs(x-540)<170?-3:0)}
function wrist(t,a){
  g.save();g.beginPath();g.moveTo(WX0,skinTop(WX0));for(let x=WX0;x<=WX1;x+=12)g.lineTo(x,skinTop(x));g.lineTo(WX1,1210);g.lineTo(WX0,1210);g.closePath();g.clip();
  // depth: deeper layers darker; a soft warm light from the top
  let gr=g.createLinearGradient(0,SY,0,1210);gr.addColorStop(0,'#5a2c40');gr.addColorStop(.12,'#4a2138');gr.addColorStop(.5,'#2e1530');gr.addColorStop(.75,'#3a2a24');gr.addColorStop(1,'#1a1020');
  g.globalAlpha=a;g.fillStyle=gr;g.fillRect(WX0,SY-10,WX1-WX0,460);
  // epidermis band and its cell texture (micro detail)
  g.fillStyle='rgba(255,190,190,.10)';g.fillRect(WX0,SY,WX1-WX0,EPI-SY);
  g.strokeStyle='rgba(255,200,200,.16)';g.lineWidth=1.5;for(let x=WX0;x<WX1;x+=26){g.beginPath();g.moveTo(x,skinTop(x)+8);g.lineTo(x+13,EPI-4);g.stroke()}
  // collagen fibres drifting slowly (secondary motion, D4)
  for(const f of FIB){g.strokeStyle='rgba(255,170,190,.13)';g.lineWidth=3;g.beginPath();for(let k=0;k<=8;k++){const x=f.x+k*f.l/8,y=f.y+6*Math.sin(k*.9+f.ph+t*.6);k?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()}
  // fat globules
  for(const q of FATG){const r=q.r*(1+.03*Math.sin(t*1.3+q.x));g.fillStyle='rgba(255,214,140,.10)';g.strokeStyle='rgba(255,214,140,.22)';g.lineWidth=2;g.beginPath();g.arc(q.x,q.y,r,0,7);g.fill();g.stroke()}
  // the artery: walls swell on every beat, cells stream through (faster on the beat)
  const b=bt(t),rA=22+9*b;
  g.fillStyle='rgba(120,10,30,.75)';g.fillRect(WX0,ART-rA,WX1-WX0,rA*2);
  g.strokeStyle=RED;g.lineWidth=5;g.shadowColor=RED;g.shadowBlur=14*(.4+b);g.beginPath();g.moveTo(WX0,ART-rA);g.lineTo(WX1,ART-rA);g.moveTo(WX0,ART+rA);g.lineTo(WX1,ART+rA);g.stroke();g.shadowBlur=0;
  const flow=t*.17+.05*Math.floor(t/BEAT)+.05*clamp(((t+.3)%BEAT)/BEAT*4);
  for(const c of ACELLS){const x=WX0+(((c.u+flow*c.v*5)%1)*(WX1-WX0)),y=ART+c.dy*(rA/26);cell(x,y,7*c.s,c.u*9+t*2,1)}
  // capillary loops rising from the bed to under the skin: they widen on the beat
  for(let li=0;li<LOOPS.length;li++){const x=LOOPS[li],w=26+10*b,top=EPI+22,bot=DER-12;
    g.strokeStyle='rgba(255,77,94,.55)';g.lineWidth=11+6*b;g.lineCap='round';g.beginPath();g.moveTo(x-w,bot);g.lineTo(x-w,top+w);g.arc(x,top+w,w,Math.PI,0);g.lineTo(x+w,bot);g.stroke();
    g.strokeStyle='rgba(255,150,160,.35)';g.lineWidth=2;g.stroke()}
  for(const c of CELLS){const x0=LOOPS[c.loop],w=26+10*b,top=EPI+22,bot=DER-12,L1=bot-top-w,Lc=Math.PI*w,u=((c.u+t*c.v)%1)*(2*L1+Lc);let x,y;
    if(u<L1){x=x0-w;y=bot-u}else if(u<L1+Lc){const an=Math.PI+(u-L1)/w;x=x0+Math.cos(an)*w;y=top+w+Math.sin(an)*w}else{x=x0+w;y=top+w+(u-L1-Lc)}cell(x,y,5.5*c.s,c.u*7,.95)}
  // the capillary bed joining the loops
  g.strokeStyle='rgba(255,77,94,.35)';g.lineWidth=7+3*b;g.beginPath();g.moveTo(WX0,DER-12);for(let x=WX0;x<=WX1;x+=20)g.lineTo(x,DER-12+4*Math.sin(x*.03));g.stroke();
  g.restore();g.globalAlpha=1;
  // the skin's lit edge
  g.save();g.globalAlpha=a;g.strokeStyle=SKIN;g.lineWidth=4;g.shadowColor=SKIN;g.shadowBlur=12;g.beginPath();for(let x=WX0;x<=WX1;x+=12)x===WX0?g.moveTo(x,skinTop(x)):g.lineTo(x,skinTop(x));g.stroke();g.restore()}
// a red blood cell: a disc with a paler dimple, tumbling (its width breathes)
function cell(x,y,r,ph,a){const sx=.55+.45*Math.abs(Math.cos(ph));g.save();g.globalAlpha*=a;g.translate(x,y);g.scale(sx,1);g.fillStyle='#e8344a';g.beginPath();g.arc(0,0,r,0,7);g.fill();g.fillStyle='rgba(120,0,20,.55)';g.beginPath();g.arc(0,0,r*.45,0,7);g.fill();g.restore()}
// ---- the green light: a soft fan into the skin under each LED, and the light particles ----
function fan(t,a){if(a<=0)return;const col=ledCol(t),ir=irK(t);g.save();g.globalCompositeOperation='lighter';
  for(let i=0;i<4;i++){const on=ledOn(t,i)*(1-.35*bt(t));const gr=g.createRadialGradient(LEDX[i],LY,4,LEDX[i],LY+120,260);gr.addColorStop(0,col);gr.addColorStop(1,'rgba(0,0,0,0)');
    g.globalAlpha=a*on*(.36-.24*ir);g.fillStyle=gr;g.beginPath();g.moveTo(LEDX[i]-14,LY);g.lineTo(LEDX[i]-210,LY+300);g.lineTo(LEDX[i]+210,LY+300);g.lineTo(LEDX[i]+14,LY);g.closePath();g.fill()}
  g.restore();g.globalAlpha=1}
// each particle: LED -> a turn point in the dermis -> back to a photodiode, unless the blood soaks it up there (more likely on the beat)
function photons(t,a,strong){if(a<=0)return;const ir=irK(t);
  for(let i=0;i<PH.length;i++){const p=PH[i],per=1.1/p.rate,u=((t/per+p.ph)%1),n=Math.floor(t/per+p.ph),tb=(n-p.ph)*per;
    const h=mulberry(i*977+n*31)(),abs=h<(.25+.55*bt(tb+per*.45)*(.5+.5*strong));
    const x0=LEDX[p.led],y0=LY+6,x1=x0+p.dx,y1=LY+p.dy,x2=PDX[i%2],y2=LY+6;
    let x,y,al=1,col=ir>.5?IR:GRN;
    if(u<.45){const q=u/.45;x=lerp(x0,x1,q);y=lerp(y0,y1,q)}
    else if(abs){const q=(u-.45)/.2;if(q>1)continue;x=x1;y=y1;al=1-q;if(q<.6)ring(x,y,4+14*q,RED2,a*(1-q)*.8,2)}
    else{const q=(u-.45)/.55;x=lerp(x1,x2,eic(q));y=lerp(y1,y2,q)}
    if(ir>.5){g.globalAlpha=a*al*.6;g.strokeStyle=IR;g.lineWidth=2;g.setLineDash([3,3]);g.beginPath();g.arc(x,y,5,0,7);g.stroke();g.setLineDash([]);g.globalAlpha=1}
    else glowDot(x,y,3.2,col,a*al*.9)}}
// how much light reaches the photodiodes now (the pulse trace's sample): less on the beat
const sample=t=>1-.75*bt(t)-.05*Math.sin(t*1.7);
// ---- the watch, side view (world space) ----
function watch(t,a,x){if(a<=0)return;const X0=330,X1=750,Y0=590,Y1=748,on=night(t);
  g.save();g.globalAlpha=a;
  // the band: two straps running off both sides, with holes
  for(const [s,e] of [[WX0-40,X0+10],[X1-10,WX1+40]]){const gr=g.createLinearGradient(0,700,0,752);gr.addColorStop(0,'#2a2f4a');gr.addColorStop(1,'#151827');g.fillStyle=gr;rrect(g,s,702,e-s,48,14);g.fill();
    g.strokeStyle='rgba(185,182,255,.25)';g.lineWidth=2;g.stroke();for(let hx=s+40;hx<e-30;hx+=46){g.fillStyle='#0a0c18';g.beginPath();g.ellipse(hx,726,6,9,0,0,7);g.fill()}}
  // the case: metal, a lit edge, a soft contact shadow on the skin
  g.fillStyle='rgba(0,0,0,.45)';g.beginPath();g.ellipse(540,SY+8,250,14,0,0,7);g.fill();
  let gr=g.createLinearGradient(0,Y0,0,Y1);gr.addColorStop(0,'#5b6286');gr.addColorStop(.5,'#2b3050');gr.addColorStop(1,'#1a1d33');
  g.globalAlpha=a*(1-.75*x);g.fillStyle=gr;rrect(g,X0,Y0,X1-X0,Y1-Y0,46);g.fill();g.globalAlpha=a;
  g.strokeStyle=x>.3?'rgba(142,240,255,.9)':'rgba(220,226,255,.55)';g.lineWidth=x>.3?3:4;rrect(g,X0,Y0,X1-X0,Y1-Y0,46);g.stroke();
  // the glass dome and the display's glow (green when the heart app is on)
  g.fillStyle='rgba(160,200,255,.16)';g.beginPath();g.ellipse(540,Y0+4,200,18,0,Math.PI,0);g.fill();
  g.strokeStyle='rgba(255,255,255,.45)';g.lineWidth=2;g.beginPath();g.ellipse(540,Y0+4,200,18,0,Math.PI*1.1,Math.PI*1.5);g.stroke();
  // the crown and side button
  g.fillStyle='#3a4066';rrect(g,X1-4,628,30,52,8);g.fill();g.strokeStyle='rgba(255,255,255,.3)';g.lineWidth=1.5;for(let k=0;k<6;k++){g.beginPath();g.moveTo(X1+4+k*4,632);g.lineTo(X1+4+k*4,676);g.stroke()}
  g.fillStyle='#30355a';rrect(g,X1-4,694,18,30,6);g.fill();
  // x-ray: the insides (battery, board with chips and traces, haptic engine, screws)
  if(x>0){g.globalAlpha=a*x;g.strokeStyle=CYN;g.lineWidth=2.5;
    rrect(g,372,614,190,64,10);g.stroke();txt('BATTERY',467,646,22,CYN,a*x,'center',700);
    g.strokeStyle=LIL;rrect(g,580,612,140,70,8);g.stroke();for(let k=0;k<3;k++){g.fillStyle='rgba(185,182,255,.5)';g.fillRect(596+k*42,628,28,22)}
    g.strokeStyle='rgba(185,182,255,.6)';g.lineWidth=1.5;for(let k=0;k<5;k++){g.beginPath();g.moveTo(588,660+k*4);g.lineTo(712,660+k*4);g.stroke()}
    g.strokeStyle=GLD;g.lineWidth=2.5;rrect(g,372,690,130,40,8);g.stroke();g.beginPath();for(let k=0;k<=12;k++){const xx=380+k*9.5,yy=710+8*Math.sin(k*1.6+t*18);k?g.lineTo(xx,yy):g.moveTo(xx,yy)}g.stroke();
    for(const [sx,sy] of [[352,612],[728,612],[352,726],[728,726]]){g.strokeStyle='rgba(220,226,255,.8)';g.lineWidth=2;g.beginPath();g.arc(sx,sy,7,0,7);g.stroke();g.beginPath();g.moveTo(sx-5,sy);g.lineTo(sx+5,sy);g.stroke()}
    g.strokeStyle=CYN;g.setLineDash([6,6]);g.lineWidth=2;g.beginPath();g.moveTo(540,684);g.lineTo(540,748);g.stroke();g.setLineDash([]);g.globalAlpha=a}
  // the sensor bump on the back with its LEDs and photodiodes (side view)
  g.fillStyle='#0d1022';g.beginPath();g.ellipse(540,Y1+6,150,16,0,0,Math.PI);g.fill();g.strokeStyle='rgba(142,240,255,.4)';g.lineWidth=2;g.stroke();
  const col=ledCol(t);for(let i=0;i<4;i++){const o=ledOn(t,i);g.fillStyle=col;g.shadowColor=col;g.shadowBlur=18*o;g.globalAlpha=a*(.4+.6*o)*(1-.6*irK(t));g.fillRect(LEDX[i]-9,LY-4,18,8)}
  g.shadowBlur=0;g.globalAlpha=a;for(const px of PDX){g.fillStyle='#1b2a5a';g.fillRect(px-9,LY-4,18,8);g.strokeStyle=CYN;g.lineWidth=1.5;g.strokeRect(px-9,LY-4,18,8)}
  g.restore()}
// the sensor disc, lifted out of the back and turned to face the camera (an x-ray exploded view)
function disc(t,L){if(L<=0)return;const cx=540,cy=lerp(LY,985,eio(L)),R0=150,sy=lerp(.12,1,eio(prog(L,.25,1))),col=GRN;
  g.save();g.globalAlpha=clamp(L*2);g.strokeStyle='rgba(142,240,255,.5)';g.setLineDash([8,8]);g.lineWidth=2;g.beginPath();g.moveTo(cx-R0,LY+4);g.lineTo(cx-R0,cy);g.moveTo(cx+R0,LY+4);g.lineTo(cx+R0,cy);g.stroke();g.setLineDash([]);
  g.translate(cx,cy);g.scale(1,sy);
  g.fillStyle='rgba(0,0,0,.5)';g.beginPath();g.arc(8,14,R0+6,0,7);g.fill();
  const gr=g.createRadialGradient(-40,-50,10,0,0,R0);gr.addColorStop(0,'#2c3566');gr.addColorStop(1,'#0b0e22');g.fillStyle=gr;g.beginPath();g.arc(0,0,R0,0,7);g.fill();
  g.strokeStyle='rgba(220,226,255,.6)';g.lineWidth=4;g.stroke();
  for(let k=1;k<4;k++){g.strokeStyle=`rgba(142,240,255,${.10+.04*k})`;g.lineWidth=1.5;g.beginPath();g.arc(0,0,R0*k/4,0,7);g.stroke()}   // fresnel rings
  // four green LEDs and the photodiodes in the middle (fine grid)
  for(let i=0;i<4;i++){const an=i*Math.PI/2+Math.PI/4,x=Math.cos(an)*96,y=Math.sin(an)*96,o=ledOn(t,i);g.save();g.translate(x,y);g.rotate(an);g.fillStyle=col;g.shadowColor=col;g.shadowBlur=30*o;g.globalAlpha=clamp(L*2)*(.45+.55*o);rrect(g,-16,-10,32,20,5);g.fill();g.restore()}
  g.globalAlpha=clamp(L*2);for(const dx of [-30,30]){g.fillStyle='#16245a';rrect(g,dx-24,-24,48,48,6);g.fill();g.strokeStyle=CYN;g.lineWidth=2;g.stroke();
    g.strokeStyle='rgba(142,240,255,.35)';g.lineWidth=1;for(let k=-18;k<=18;k+=9){g.beginPath();g.moveTo(dx+k,-22);g.lineTo(dx+k,22);g.moveTo(dx-22,k);g.lineTo(dx+22,k);g.stroke()}
    const hit=sample(t)*prog(t,C.photo-.3,C.photo+.3);g.fillStyle=CYN;g.globalAlpha=clamp(L*2)*hit*.35;rrect(g,dx-24,-24,48,48,6);g.fill();g.globalAlpha=clamp(L*2)}
  g.restore()}
// the blood-cell close-up: white light splits on one big tumbling cell: red bounces off toward us, green is soaked up
function closeUp(t,d){if(d<=0)return;const cx=690,cy=905,r=34;
  g.save();g.globalAlpha=d;g.fillStyle='rgba(20,6,16,.55)';g.fillRect(380,700,640,420);
  cell(cx,cy,r,t*1.4,1);g.strokeStyle='rgba(255,150,160,.6)';g.lineWidth=2;g.beginPath();g.arc(cx,cy,r+4+2*Math.sin(t*3),0,7);g.stroke();
  for(let k=0;k<5;k++){const per=1.3,u=((t/per+k/5)%1);const sx=420,sy=760+k*8;
    if(u<.4){const q=u/.4,x=lerp(sx,cx-r,q),y=lerp(sy,cy,q);glowDot(x,y,5,'#ffffff',d*.9);glowDot(x-10,y-3,3,'#ffffff',d*.4)}
    else{const q=(u-.4)/.6;const rx=lerp(cx-r+4,cx+250,eoc(q)),ry=lerp(cy-4,cy-200-20*k,eoc(q));glowDot(rx,ry,4+5*q,RED,d*(1-q*.6)*prog(t,C.reflects-.4,C.reflects));
      const gq=clamp(q*3);if(gq<1){glowDot(lerp(cx-r,cx-6,gq),cy+3,4,GRN,d*(1-gq)*prog(t,C.soaks-.4,C.soaks));ring(cx-6,cy,6+20*gq,GRN,d*(1-gq)*.6*prog(t,C.soaks-.4,C.soaks),2)}}}
  g.restore()}
// the pulse trace: the light samples stream into a strip and draw the beat as dips (screen space, under the hero)
function strip(t,a){if(a<=0)return;const X0=84,X1=996,Y0=1246,Y1=1392,span=4.2;
  g.save();g.globalAlpha=a;rrect(g,X0,Y0,X1-X0,Y1-Y0,26);const gr=g.createLinearGradient(0,Y0,0,Y1);gr.addColorStop(0,'rgba(24,40,70,.92)');gr.addColorStop(1,'rgba(10,14,32,.92)');g.fillStyle=gr;g.fill();
  g.strokeStyle='rgba(142,240,255,.3)';g.lineWidth=1.5;g.stroke();g.save();rrect(g,X0,Y0,X1-X0,Y1-Y0,26);g.clip();
  g.strokeStyle='rgba(142,240,255,.08)';g.lineWidth=1;for(let x=X0+30;x<X1;x+=38){g.beginPath();g.moveTo(x,Y0);g.lineTo(x,Y1);g.stroke()}
  const yv=s=>lerp(Y1-26,Y0+30,s),col=irK(t)>.5?RED2:GRN,dense=prog(t,C.flash5-.2,C.flash5+.6);
  g.strokeStyle=col;g.lineWidth=5;g.shadowColor=col;g.shadowBlur=14;g.beginPath();let first=true;
  for(let k=0;k<=220;k++){const ts=t-span+span*k/220;if(ts<C.heartbeat-.2)continue;const x=lerp(X0+20,X1-60,k/220),y=yv(sample(ts));first?g.moveTo(x,y):g.lineTo(x,y);first=false}g.stroke();g.shadowBlur=0;
  // sample dots: sparse at first, dense from "flash" (hundreds a second)
  const n=Math.round(lerp(24,110,dense));for(let k=0;k<n;k++){const ts=t-span+span*k/n;if(ts<C.heartbeat-.2)continue;const x=lerp(X0+20,X1-60,k/n);g.fillStyle='#ffffff';g.globalAlpha=a*.7;g.fillRect(x-1.5,yv(sample(ts))-1.5,3,3)}
  g.globalAlpha=a;
  // each dip becomes a beat: a small heart under it (from "dips")
  const hk=prog(t,C.dips-.3,C.dips+.3);if(hk>0){const n0=Math.ceil((t-span+.3)/BEAT);for(let m=n0;m*BEAT-.3<t;m++){const tb=m*BEAT-.3+.08*BEAT,x=lerp(X0+20,X1-60,(tb-(t-span))/span);if(x<X0+30)continue;heart(x,Y1-12,9,RED2,a*hk)}}
  // the live head
  glowDot(X1-60,yv(sample(t)),6,col,a);g.restore();
  txt('LIGHT BACK',X0+28,Y0+28,26,'#aab0d8',a*.9,'left',700);g.restore()}
function heart(x,y,s,col,a){g.save();g.globalAlpha=a;g.fillStyle=col;g.translate(x,y);g.beginPath();g.moveTo(0,s*.9);g.bezierCurveTo(-s*1.6,-s*.2,-s*.6,-s*1.3,0,-s*.4);g.bezierCurveTo(s*.6,-s*1.3,s*1.6,-s*.2,0,s*.9);g.fill();g.restore()}
// the night: a cool wash, a moon, more stars
function nightSky(t,n){if(n<=0)return;g.save();g.globalAlpha=n*.5;g.fillStyle='#061033';g.fillRect(-400,-200,1900,2400);g.globalAlpha=n;
  g.fillStyle='#e8ecff';g.shadowColor='#c8d2ff';g.shadowBlur=30;g.beginPath();g.arc(860,560,34,0,7);g.fill();g.shadowBlur=0;g.fillStyle='#061033';g.beginPath();g.arc(876,550,30,0,7);g.fill();
  const r=mulberry(9);for(let i=0;i<30;i++){const x=r()*1080,y=470+r()*260,s=r();g.globalAlpha=n*(.3+.5*Math.abs(Math.sin(t*1.5*s+i)));g.fillStyle='#ffffff';g.fillRect(x,y,2,2)}g.restore()}

window.TOPIC={
  title:'Watch flashing <em>green?</em>',eyebrow:'WEARABLES · X-RAY',final:'Green flash =<br>your <em>pulse</em>.',
  vars:{'--bg1':'#0d2a2a','--bg2':'#060b18','--blob1':'#1f9e6a','--blob2':'#8a1f3c','--blob3':'#2a8cff','--tgrad':'linear-gradient(100deg,#5dffa0,#bfffd9 55%,#8ef0ff)'},
  chips:[['THE QUESTION','#5dffa0'],['X-RAY','#8ef0ff'],['THE TRICK','#ff8f9a'],['HEARTBEAT','#ff4d5e'],['BETWEEN BEATS','#8ef0ff'],['THE COUNT','#5dffa0'],['AT NIGHT','#b9b6ff'],['THE ANSWER','#5dffa0']],
  keyw:/^(green|glass|lights|photodiodes|blood|red|reflects|soaks|heartbeat|absorbed|beats|bounces|sensor|hundreds|dips|heart|rate|sleep|infrared|counting|flash)$/i,
  jolts:[],
  cover:true,
  holds:()=>[[+(C.final+.8).toFixed(2),TL.total]],
  css:'#final{top:470px}#final .t1{display:inline-block;font-size:96px;padding:26px 54px 34px;border-radius:44px;background:rgba(6,10,26,.9);border:1.5px solid rgba(93,255,160,.35);box-shadow:0 30px 80px rgba(0,0,0,.6)}#final .t2{margin-top:22px}',
  html:'',
  cam(){const W=[1.1,0,30],k=[[0,W],[st(1)-.2,W],
      [C.glass+.3,[1.15,0,30],'expo'],[C.blood2-.2,[1.15,0,20]],
      [C.blood2+.6,[2.0,-300,-110],'expo'],[st(3)-.4,[2.05,-310,-115]],
      [st(3)+.5,[1.22,0,36],'expo'],[st(4)-.2,[1.25,-10,40]],
      [st(4)+.6,[1.4,40,70],'io'],[st(5)-.2,[1.42,44,72]],
      [st(5)+.6,[1.1,0,10],'expo'],[st(6)-.2,[1.08,0,10]],
      [st(6)+.7,[1.12,-60,10],'io'],[st(7)-.2,[1.12,-64,10]],
      [st(7)+.7,W,'expo']];return k},
  hero(t,{fin}){
    const x=xr(t),L=lift(t),d=dive(t),n=night(t);
    // the world lives under the header: clipped to screen y 450-1300 so a close-up never runs into the title
    {const m=g.getTransform();g.save();g.setTransform(1,0,0,1,0,0);g.beginPath();g.rect(0,450,1080,850);g.clip();g.setTransform(m)}
    // far plane: floating specks of light at their own depths (parallax with the camera)
    for(const s of SPECK){const px=s.x+(CAM[1]*(s.z-1))*.3+12*Math.sin(t*.4*s.z+s.ph),py=s.y+8*Math.cos(t*.3+s.ph);glowDot(px,py,1.6+2*s.z,n>.5?'#b9c4ff':'#9fffd0',.08+.12*s.z)}
    nightSky(t,n);
    subj(WX0+40,575,WX1-40,1180);
    {const m=g.getTransform(),s=SUBJ;if(s)SUBJ=[Math.max(0,s[0]),Math.max(0,s[1]),Math.min(1080,s[2]),Math.min(1920,s[3])]}
    wrist(t,1-.72*x);
    fan(t,1-.6*x);
    photons(t,(1-.8*x)*(1-.85*d),pulseK(t));
    watch(t,1,x);
    disc(t,L);
    closeUp(t,d);
    // the beat: a soft red glow over the artery on every beat (from "heartbeat")
    {const b=bt(t)*pulseK(t);if(b>.05){g.save();g.globalCompositeOperation='lighter';const gr=g.createRadialGradient(540,ART,10,540,ART,520);gr.addColorStop(0,'rgba(255,77,94,.35)');gr.addColorStop(1,'rgba(0,0,0,0)');g.globalAlpha=b*.6*(1-d);g.fillStyle=gr;g.fillRect(WX0,ART-140,WX1-WX0,280);g.restore()}}
    // the photodiodes catch the light that comes back (from "bounces"): they flash cyan
    {const k=prog(t,C.bounces-.3,C.bounces+.2)*(1-prog(t,st(6)-.2,st(6)));if(k>0)for(const px of PDX){glowDot(px,LY,6,CYN,k*sample(t))}}
    // the end: the opening picture again, lit green (the loop, rules-tech.md P3)
    if(fin>0){g.globalAlpha=fin*.35;g.fillStyle='#04060c';g.fillRect(-400,0,1900,1900);g.globalAlpha=1}
    g.restore();
  },
  labels(t){
    const q=(a,b,fi=.3,fo=.3)=>win(t,a,b,fi,fo);
    // the four words Output QA SYNC reads: one word of 92 px type high in the hero zone, in 0.1 s before the voice, held 1.5 s
    for(const [w,c0,col] of [['PHOTODIODES',C.photo,CYN],['ABSORBED',C.absorbed,RED2],['HUNDREDS',C.hundreds,GRN],['INFRARED',C.infrared,LIL]]){const a=win(t,c0-.1,c0+1.5,.12,.2);if(a>0)bigText(CX,512,w,92,col,a,col)}
    const gl=q(C.green0-.1,st(1)-.1);if(gl>0)label(540,690,'GREEN LIGHT',GRN,gl*prog(t,C.green0-.05,C.green0+.2),40,'rgba(6,30,20,.94)');
    const le=q(C.lights-.1,C.photo-.2);if(le>0)label(800,900,'GREEN LEDs',GRN,le*prog(t,C.lights-.05,C.lights+.25),40,'rgba(6,30,20,.94)');
    const pd=q(C.photo-.2,st(2)-.3);if(pd>0)label(300,1100,'LIGHT SENSORS',CYN,pd*prog(t,C.sensors-.05,C.sensors+.25),38,'rgba(6,24,34,.94)');
    const rf=q(C.reflects-.1,C.soaks+1.6);if(rf>0)label(780,770,'REFLECTS RED',RED,rf,40,'rgba(40,6,14,.94)');
    const sk=q(C.soaks-.1,st(3)-.2);if(sk>0)label(600,1010,'SOAKS UP GREEN',GRN,sk,40,'rgba(6,30,20,.94)');
    const mb=q(C.pushes-.1,st(4)-.2);if(mb>0)label(540,1040,'MORE BLOOD',RED,mb,40,'rgba(40,6,14,.94)');
    const bb=q(C.bounces-.15,st(5)-.2);if(bb>0)label(540,1040,'BOUNCES BACK',CYN,bb,40,'rgba(6,24,34,.94)');
    const hr=q(C.rate-.15,st(6)-.1);if(hr>0)label(540,1000,'BEATS PER MINUTE',GRN,hr,40,'rgba(6,30,20,.94)');
    const sl=q(C.sleep-.1,C.infrared-.2);if(sl>0)label(540,1040,'WHILE YOU SLEEP',LIL,sl,40,'rgba(14,14,44,.94)');
    const iv=q(C.see-.2,st(7)-.1);if(iv>0)label(540,1000,'INVISIBLE LIGHT',RED2,iv,40,'rgba(40,6,14,.94)');
    strip(t,trace(t));
  },
  panels(t){}
};
})();
