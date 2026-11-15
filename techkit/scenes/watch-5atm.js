// @techin20sec kit topic: What does 5 ATM on your watch mean? (techreel/topics/watch-5atm.json). Drawn on the shared kit frame
// (techkit/base.html): hero(t) in world space under the camera, labels(t) in screen space, panels(t) for the DOM. Every beat on a cue word.
// Rebuilt 15 Nov 2026 (owner: "What's this in tech reels frame where actual object is?", "I don't see much happening animation wise around
// watch", "too wiggly"): no glass sheen, no box around the hero; one big watch through the whole reel (one continuous track, no bob or wobble)
// in a near full-width world; the idea happens ON the watch (pressure arrows squeeze it, O-rings seat at the crown and buttons, it turns to show
// its back, a still-water timer runs on its screen, its pressure meter spikes past the test line, a drop gets in past a hot seal and fogs the
// glass); the camera pushes in on the part being named and holds. No tick ladders, dashed rings or ring-and-dot clusters (Output QA NUMBERS
// read them as digits: "6" on render 3, "7" on render 4).
(function(){
const R=mulberry(11);
const WL=24,WT=455,WR=1056,WB=1228;   // the world window (screen px): nearly the full width, under the chip, over the panel
const SNOW=[...Array(70)].map(()=>({x:R()*1200-60,y:R(),r:1.2+R()*2.2,a:.15+R()*.3}));
const DROPS=[...Array(46)].map(()=>({u:R(),ph:R(),v:.9+R()*.5,len:30+R()*30}));
const STEAM=[...Array(26)].map(()=>({x:R(),ph:R(),r:46+R()*60,v:.05+R()*.05}));
const RING_SEATS={crown:[150,-38,10,40],button:[148,45,8,30]};
const C3=x=>`rgb(${x[0]|0},${x[1]|0},${x[2]|0})`,mix=(a,b,u)=>a.map((v,i)=>lerp(v,b[i],u));
// world window: clip in screen space, then draw under the camera
function inWorld(f){g.save();g.setTransform(1,0,0,1,0,0);rrect(g,WL,WT,WR-WL,WB-WT,34);g.clip();camOn();f();g.restore()}
// open water: top and bottom colours (low saturation: Output QA COLOUR), a surface at y sy (world) when in view, x range
function water(x0,x1,top,bot,sy,a,t,calm=1){if(a<=0)return;g.save();g.globalAlpha=a;const y0=Math.max(sy,-400);
  const gr=g.createLinearGradient(0,y0,0,1700);gr.addColorStop(0,C3(top));gr.addColorStop(1,C3(bot));g.fillStyle=gr;g.fillRect(x0,y0,x1-x0,1700-y0);
  if(sy>WT-40&&sy<WB){const sg=g.createLinearGradient(0,sy-6,0,sy+40);sg.addColorStop(0,'rgba(230,248,255,.75)');sg.addColorStop(.15,'rgba(200,236,255,.25)');sg.addColorStop(1,'rgba(200,236,255,0)');
    g.fillStyle=sg;g.beginPath();g.moveTo(x0,sy+40);for(let x=x0;x<=x1;x+=12)g.lineTo(x,sy+3*calm*Math.sin(x*.025+t*1.2));g.lineTo(x1,sy+40);g.closePath();g.fill()}
  g.restore()}
// pool tiles under the water: a soft lane line and grout, so the left half reads as a pool at a glance
function poolTiles(x0,x1,sy,a){g.save();g.globalAlpha=a;g.beginPath();g.rect(x0,sy+8,x1-x0,1400);g.clip();g.strokeStyle='rgba(220,245,255,.13)';g.lineWidth=2;
  for(let y=sy+70;y<WB+40;y+=70){g.beginPath();g.moveTo(x0,y);g.lineTo(x1,y);g.stroke()}for(let x=0;x<x1;x+=70){g.beginPath();g.moveTo(x,sy+8);g.lineTo(x,WB+40);g.stroke()}
  g.fillStyle='rgba(16,40,70,.55)';g.fillRect(x0,980,x1-x0,26);g.restore()}
// marine snow: still particles that only move while the watch goes down (depth d in metres), never a loop
function snow(d,a){if(a<=0)return;SNOW.forEach(s=>{const y=WT-40+(((s.y*900-d*55)%900)+900)%900;g.globalAlpha=a*s.a;g.fillStyle='#cfe8f5';g.beginPath();g.arc(s.x,y,s.r,0,7);g.fill()});g.globalAlpha=1}
// the warm shower half: tiles, a chrome head top right, water falling in a cone, steam, warm light; heat 0..1
function shower(x0,t,heat,a){if(a<=0)return;g.save();g.globalAlpha=a;g.beginPath();g.rect(x0,WT-300,1300,1300);g.clip();
  const wg=g.createLinearGradient(0,WT,0,WB);wg.addColorStop(0,'#5e3a2a');wg.addColorStop(1,'#25150f');g.fillStyle=wg;g.fillRect(x0,WT-300,1300,1300);
  g.strokeStyle='rgba(255,214,180,.10)';g.lineWidth=2;for(let y=WT+20;y<WB;y+=96){g.beginPath();g.moveTo(x0,y);g.lineTo(1300,y);g.stroke()}for(let x=x0+40;x<1300;x+=96){g.beginPath();g.moveTo(x,WT);g.lineTo(x,WB);g.stroke()}
  const hx=880,hy=560;const lg=g.createRadialGradient(hx,hy+80,10,hx,hy+200,560);lg.addColorStop(0,`rgba(255,176,96,${.28+.32*heat})`);lg.addColorStop(1,'rgba(255,150,80,0)');g.fillStyle=lg;g.fillRect(x0,WT-300,1300,1300);
  // water: streaks along the cone from the head's face down past the watch
  g.lineCap='round';DROPS.forEach(d=>{const xs=lerp(hx-70,hx+70,d.u),xe=lerp(hx-330,hx+230,d.u);for(let k=0;k<2;k++){const q=(t*d.v*.9+d.ph+k*.5)%1;const x=lerp(xs,xe,q),y=lerp(hy+30,WB+40,q);
    g.strokeStyle=`rgba(255,236,214,${.55*(1-q*.4)})`;g.lineWidth=3;g.beginPath();g.moveTo(x,y);g.lineTo(x+(xe-xs)*.05,y+d.len);g.stroke()}});
  // the head: an arm from the right wall and a wide chrome disc facing down
  g.strokeStyle='#b9c2d0';g.lineWidth=16;g.beginPath();g.moveTo(1080,hy-60);g.lineTo(hx+60,hy-60);g.quadraticCurveTo(hx,hy-60,hx,hy-12);g.stroke();
  const cg=g.createLinearGradient(hx-90,0,hx+90,0);cg.addColorStop(0,'#7d8796');cg.addColorStop(.5,'#eef2f8');cg.addColorStop(1,'#6b7584');g.fillStyle=cg;g.beginPath();g.ellipse(hx,hy+8,92,24,0,0,7);g.fill();
  g.fillStyle='#3a404c';g.beginPath();g.ellipse(hx,hy+16,80,12,0,0,7);g.fill();
  steamPuffs(t,x0,heat,a);g.restore()}
function steamPuffs(t,x0,k,a){STEAM.forEach(s=>{const q=(t*s.v+s.ph)%1,x=lerp(x0+40,1060,s.x),y=lerp(WB+60,WT-60,q);const al=.26*k*Math.sin(Math.PI*q);if(al<=.003)return;
  const gr=g.createRadialGradient(x,y,0,x,y,s.r);gr.addColorStop(0,`rgba(255,240,228,${al})`);gr.addColorStop(1,'rgba(255,240,228,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,s.r,0,7);g.fill()})}
// the sauna half (recap): warm wood slats, a coal box, steam
function sauna(x0,t,a){if(a<=0)return;g.save();g.globalAlpha=a;g.beginPath();g.rect(x0,WT-300,1300,1300);g.clip();
  for(let i=0;i<12;i++){const y=WT-20+i*68;g.fillStyle=i%2?'#6a4428':'#5c3a22';g.fillRect(x0,y,1300,64);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x0,y+60,1300,4)}
  const lg=g.createRadialGradient(840,1100,20,840,1000,520);lg.addColorStop(0,'rgba(255,140,70,.45)');lg.addColorStop(1,'rgba(255,120,60,0)');g.fillStyle=lg;g.fillRect(x0,WT-300,1300,1300);
  g.fillStyle='#2b2320';rrect(g,740,1080,220,140,14);g.fill();for(let i=0;i<6;i++){glowDot(770+i*34,1082,9,'#ff8a4a',.55)}
  steamPuffs(t,x0,1,1);g.restore()}
// pressure arrows round the case: p 0..1 (length, weight, colour), push 0..1 (tips in), stop = gap kept outside the seal
function pressure(x,y,s,p,a,push=0,col){if(a<=0)return;for(let k=0;k<12;k++){const an=k/12*Math.PI*2+.26,ex=Math.cos(an),ey=Math.sin(an);
  const rx=170*s+26-push*14,ry=205*s+26-push*14,len=46+120*p;const tx=x+ex*rx,ty=y+ey*ry;
  arrow(tx+ex*len,ty+ey*len,tx,ty,col||`rgb(${lerp(150,255,p)|0},${lerp(225,96,p)|0},${lerp(255,110,p)|0})`,a*.95,6+6*p)}}
// an even halo of pressure (still water): no lines, nothing an OCR can read as a digit
function halo(x,y,s,a,col){if(a<=0)return;g.save();g.globalAlpha=a;g.translate(x,y);g.scale(1,1.2);const r=200*s;const gr=g.createRadialGradient(0,0,r*.72,0,0,r*1.25);
  gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(.35,col);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.arc(0,0,r*1.3,0,7);g.fill();g.restore()}
// the watch, local units (case 280 x 330). o: s, flip (cos of the turn: below 0 shows the back), rot, squeeze 0..1, lit {glass, crown, button, back},
// rings {crown, button} 0..1 (an O-ring flying in to its seat), hot 0..1 (the crown seal), crack 0..1, fog 0..1, drop 0..1 (a drop gets in), screen(g)
function watch(x,y,o){const s=o.s,fx=o.flip==null?1:o.flip,sq=o.squeeze||0;g.save();g.translate(x,y);if(o.rot)g.rotate(o.rot);
  g.scale(s*Math.max(.03,Math.abs(fx))*(1-.07*sq),s*(1+.02*sq));subj(-140,-165,140,165);
  g.save();g.shadowColor='rgba(0,0,0,.55)';g.shadowBlur=50;g.shadowOffsetY=24;
  const sg=g.createLinearGradient(-92,0,92,0);sg.addColorStop(0,'#1a2030');sg.addColorStop(.5,'#2e3854');sg.addColorStop(1,'#1a2030');g.fillStyle=sg;rrect(g,-92,-330,184,200,30);g.fill();rrect(g,-92,130,184,200,30);g.fill();g.restore();
  g.fillStyle='rgba(255,255,255,.07)';for(let k=0;k<4;k++){rrect(g,-60,-310+k*40,120,8,4);g.fill();rrect(g,-60,170+k*40,120,8,4);g.fill()}
  const cg=g.createLinearGradient(-140,-160,140,160);cg.addColorStop(0,'#dfe6f2');cg.addColorStop(.45,'#7a869e');cg.addColorStop(1,'#2b3245');g.fillStyle=cg;rrect(g,-140,-165,280,330,66);g.fill();
  g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=2;g.stroke();
  const L=o.lit||{},glow=(v,col,f)=>{if(!(v>0))return;g.save();g.globalAlpha=clamp(v);g.strokeStyle=col;g.shadowColor=col;g.shadowBlur=26*v;f();g.restore()};
  if(fx>=0){
    g.fillStyle='#a7b2c6';rrect(g,136,-72,30,68,10);g.fill();g.fillStyle='rgba(0,0,0,.25)';for(let k=0;k<5;k++)g.fillRect(150,-66+k*12,14,4);
    g.fillStyle='#8a95ab';rrect(g,138,20,20,52,8);g.fill();
    g.fillStyle='#04060e';rrect(g,-118,-142,236,284,50);g.fill();
    g.save();rrect(g,-118,-142,236,284,50);g.clip();const sc=g.createRadialGradient(-40,-80,10,0,0,220);sc.addColorStop(0,'rgba(80,200,255,.16)');sc.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=sc;g.fillRect(-118,-142,236,284);
      if(o.screen)o.screen(g);
      if(o.fog>0){const fg=g.createRadialGradient(60,-40,10,40,-20,260*o.fog+40);fg.addColorStop(0,`rgba(225,232,240,${.75*o.fog})`);fg.addColorStop(1,'rgba(225,232,240,0)');g.fillStyle=fg;g.fillRect(-118,-142,236,284)}
    g.restore();
    glow(L.glass,'#ffa04a',()=>{g.lineWidth=8;rrect(g,-124,-148,248,296,54);g.stroke()});
    // O-rings: fly in from the right, seat at the crown / button, then glow
    [['crown',o.rings&&o.rings.crown,L.crown],['button',o.rings&&o.rings.button,L.button]].forEach(([k,q,lv])=>{const [sx,sy,rx,ry]=RING_SEATS[k];
      if(q>0){const e=eoc(q),x=lerp(sx+260,sx,e),sc=lerp(2.2,1,e);g.save();g.globalAlpha=clamp(q*3);g.strokeStyle='#ff9a3d';g.shadowColor='#ffb35c';g.shadowBlur=16;g.lineWidth=9;g.beginPath();g.ellipse(x,sy,rx*sc,ry*sc,0,0,7);g.stroke();g.restore()}
      glow(lv,'#ffb35c',()=>{g.lineWidth=9;g.beginPath();g.ellipse(sx,sy,rx,ry,0,0,7);g.stroke()})});
    if(o.hot>0){const h=o.hot,[sx,sy,rx,ry]=RING_SEATS.crown;g.save();g.strokeStyle=`rgb(255,${lerp(154,70,h)|0},${lerp(61,40,h)|0})`;g.shadowColor='#ff5a2a';g.shadowBlur=30*h;g.lineWidth=lerp(9,4,o.thin||0);
      if(o.crack>0)g.setLineDash([16,6+22*o.crack]);g.beginPath();g.ellipse(sx,sy,rx,ry,0,0,7);g.stroke();g.restore()}
    if(o.drop>0){const q=o.drop,x=q<.5?lerp(225,150,eio(q*2)):lerp(150,70,eio((q-.5)*2)),yy=q<.5?-38:lerp(-38,-10,eio((q-.5)*2)),r=lerp(16,10,q);
      g.save();g.globalAlpha=clamp((1-q)*4);g.fillStyle='rgba(170,225,255,.95)';g.shadowColor='#bfe9ff';g.shadowBlur=14;g.beginPath();g.moveTo(x-r*1.7,yy);g.quadraticCurveTo(x-r*.2,yy-r*1.1,x+r,yy);g.arc(x,yy,r,0,Math.PI,false);g.fill();g.restore()}
  }else{
    // the back: a steel plate, the sensor window, four screws, the case-back gasket
    const bg=g.createRadialGradient(-30,-40,10,0,0,200);bg.addColorStop(0,'#c9d1df');bg.addColorStop(1,'#56607a');g.fillStyle=bg;rrect(g,-122,-146,244,292,52);g.fill();
    g.fillStyle='#10141f';g.beginPath();g.ellipse(0,0,70,70,0,0,7);g.fill();g.fillStyle='rgba(120,220,255,.5)';g.beginPath();g.ellipse(-18,-10,10,10,0,0,7);g.fill();g.beginPath();g.ellipse(18,10,10,10,0,0,7);g.fill();
    g.fillStyle='#39414f';[[-96,-118],[96,-118],[-96,118],[96,118]].forEach(([a,b])=>{g.beginPath();g.ellipse(a,b,9,9,0,0,7);g.fill()});
    glow(L.back,'#ffb35c',()=>{g.lineWidth=11;rrect(g,-130,-154,260,308,58);g.stroke()});
  }
  g.restore()}
// the watch's track: one continuous subject (no bob, no wobble), moves only on purpose
const WTRK=()=>[[0,[540,850,1.42,1,0]],[st(1)-.3,[540,850,1.42,1,0]],[st(1)+.4,[540,835,1.52,1,0]],
  [C.back-.15,[540,835,1.52,1,0]],[C.back+.45,[540,835,1.52,-1,0]],[st(3)-.3,[540,835,1.52,-1,0]],[st(3)+.4,[540,880,1.36,1,0]],
  [st(4)-.3,[540,880,1.36,1,0]],[st(4)+.4,[540,850,1.42,1,0]],[st(5)-.3,[540,850,1.42,1,0]],[st(5)+.4,[540,840,1.52,1,0]],
  [st(6)-.3,[540,840,1.52,1,0]],[st(6)+.4,[540,860,1.36,1,0]]];
const bump=(t,t0,d=.7)=>{const q=prog(t,t0,t0+d);return Math.sin(Math.PI*q)*(q<.5?1:1)};
// the pressure meter on the screen (chapter 4): level 0..1.6, the test line at 1
function meter(gg,lv,a){if(a<=0)return;gg.save();gg.globalAlpha=a;const x=-30,y0=110,h=200,w=60;gg.fillStyle='rgba(255,255,255,.08)';rrect(gg,x,y0-h,w,h,12);gg.fill();
  const lim=y0-h*.6,v=clamp(lv/1.6),yv=y0-h*v,over=lv>1;const fg=gg.createLinearGradient(0,y0,0,y0-h);fg.addColorStop(0,'#3de0ff');fg.addColorStop(.6,over?'#ff8f6c':'#6ff0a4');fg.addColorStop(1,'#ff5d6c');
  gg.fillStyle=fg;rrect(gg,x,yv,w,y0-yv,12);gg.fill();gg.fillStyle='#6ff0a4';gg.fillRect(x-22,lim-3,w+44,6);gg.restore()}
const wordAt=(t,txt,col,y,size,a)=>{if(a<=0)return;g.save();g.globalAlpha=clamp(a);g.fillStyle=col;g.textAlign='center';g.textBaseline='middle';g.font=`800 ${size}px "Inter Display",Inter`;g.shadowColor=col;g.shadowBlur=16;g.fillText(txt,0,y);g.restore()};

window.TOPIC={
  title:'What <em>5 ATM</em> really means',eyebrow:'WATCHES · EXPLAINED',final:"That's<br><em>5 ATM.</em>",
  vars:{'--bg1':'#0b2448','--bg2':'#06101f','--blob1':'#0a6cff','--blob2':'#00c2b8','--blob3':'#ff7a3d','--tgrad':'linear-gradient(100deg,#8ef0ff,#3de0ff 45%,#ffb35c)'},
  chips:[['THE QUESTION','#8ef0ff'],['THE PROBLEM','#ff5d6c'],['THE FIX · SEALS','#ffb35c'],['THE TEST','#6ff0a4'],['REAL LIFE','#ff8f6c'],['THE SNEAKY ONE','#ff7ad9'],['RECAP','#b9b6ff']],
  keyw:/^(atm|five|ten|fifty|minutes|pressure|seals?|rubber|crown|buttons?|back|still|test|dive|jet|stroke|spikes|heat|steam|age|pool|sauna|hot|shower|squeeze|deeper|atmosphere)$/i,
  jolts:[],
  holds:()=>[[+(C.final+.8).toFixed(2),TL.total]],   // the title slam is read standing still
  css:'.cell{flex:1;height:84px;border-radius:18px;border:1.5px solid rgba(255,255,255,.12);display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(255,255,255,.04)}.cell b{font:800 34px "Inter Display",Inter;color:#6a7298}.cell small{font:700 13px Inter;letter-spacing:.14em;color:#7d84a8;margin-top:4px}',
  html:`
  <div class="panel" id="p0"><div style="position:absolute;left:36px;top:26px" class="lab">WATER RESISTANCE · 5 ATM</div>
    <div class="big" style="position:absolute;left:36px;top:54px;font-size:52px;color:#6ff0a4" id="p0a">POOL ✓</div>
    <div class="big" style="position:absolute;right:36px;top:54px;font-size:52px;color:#ff8f6c" id="p0b">HOT SHOWER ✕</div></div>
  <div class="panel" id="p1"><div style="position:absolute;left:36px;top:26px" class="lab">WATER PRESSURE ON THE CASE</div>
    <div class="big" style="position:absolute;left:36px;top:54px;font-size:50px;color:#8ef0ff" id="p1n">+1 ATM</div>
    <div style="position:absolute;left:300px;right:36px;top:80px"><div class="bar"><b id="p1bar" style="background:linear-gradient(90deg,#3de0ff,#ff5d6c);box-shadow:0 0 12px #3de0ff"></b></div></div>
    <div style="position:absolute;right:36px;top:26px" class="lab" id="p1r">EVERY 10 m</div></div>
  <div class="panel" id="p2" style="background:none;border:none;box-shadow:none;overflow:visible"><div class="dots" id="p2d" style="height:100%;align-items:center">
    <i>GLASS</i><i>CROWN</i><i>BUTTONS</i><i>CASE BACK</i></div></div>
  <div class="panel" id="p3" style="background:none;border:none;box-shadow:none;overflow:visible"><div class="steps" id="p3s">
    <div class="cell"><b>5 ATM</b><small>RATING</small></div><div class="arrow">=</div>
    <div class="cell"><b>50 m</b><small>STILL WATER</small></div><div class="arrow">·</div>
    <div class="cell"><b>10 min</b><small>LAB TEST</small></div></div></div>
  <div class="panel" id="p4" style="background:none;border:none;box-shadow:none;overflow:visible"><div class="steps" id="p4s">
    <div class="step"><div class="n">TEST</div><div class="s">STILL</div></div><div class="arrow">›</div>
    <div class="step"><div class="n">SPIKE</div><div class="s">DIVE</div></div><div class="arrow">›</div>
    <div class="step"><div class="n">SPIKE</div><div class="s">JET</div></div><div class="arrow">›</div>
    <div class="step"><div class="n">SPIKE</div><div class="s">STROKE</div></div></div></div>
  <div class="panel" id="p5"><div style="position:absolute;left:36px;top:26px" class="lab">SEAL GRIP</div>
    <div style="position:absolute;left:36px;right:300px;top:76px"><div class="bar"><b id="p5bar" style="background:linear-gradient(90deg,#ff9a3d,#ffd36b);box-shadow:0 0 12px #ff9a3d"></b></div></div>
    <div style="position:absolute;right:36px;top:26px;text-align:right"><div class="lab">HEAT</div><div class="big" style="font-size:36px;color:#ff8f6c;margin-top:10px" id="p5h">RISING ▲</div></div></div>
  <div class="pill" id="pl1" style="top:1060px;border-color:rgba(78,226,138,.6)"><div class="ic" style="background:rgba(78,226,138,.18);color:#8ff0b8">✓</div>Pool and sea swims</div>
  <div class="pill" id="pl2" style="top:1170px;border-color:rgba(255,93,108,.6)"><div class="ic" style="background:rgba(255,93,108,.18);color:#ff8f9a">✕</div>Sauna and hot showers</div>`,
  // the camera: one eased move to the part being named, then it holds (no drift)
  cam(){const cr=(z,y=0)=>[z,80-228*z,-20+72*z+y],bt=z=>[z,80-225*z,30-53*z];
    return [[0,[1,0,0]],[C.pushes-.1,[1,0,0]],[C.ten+.2,[1.08,0,0]],[st(2)-.3,[1.08,0,0]],[st(2)+.3,[1,0,0]],
      [C.crown-.35,[1,0,0]],[C.crown+.3,cr(1.7)],[C.buttons-.25,cr(1.7)],[C.buttons+.3,bt(1.7)],[C.back-.2,bt(1.7)],[C.back+.4,[1.04,0,0]],
      [st(3)-.3,[1.04,0,0]],[st(3)+.4,[1,0,0]],[C.ten3-.3,[1,0,0]],[C.ten3+.4,[1.18,0,50]],[st(4)-.3,[1.18,0,50]],[st(4)+.4,[1,0,0]],
      [C.heat-.1,[1,0,0]],[C.steam-.2,cr(1.6)],[C.age-.3,cr(1.6)],[C.age+.4,[1.1,0,10]],[st(6)-.3,[1.1,0,10]],[st(6)+.4,[.97,0,0]]]},
  hero(t,{fin}){
    const c0=1-prog(t,st(1)-.35,st(1)+.35),c1=win(t,st(1)-.35,st(2)+.35,.7,.7),c2=win(t,st(2)-.35,st(3)+.35,.7,.7),c3=win(t,st(3)-.35,st(4)+.35,.7,.7),c4=win(t,st(4)-.35,st(5)+.35,.7,.7),c5=win(t,st(5)-.35,st(6)+.35,.7,.7),c6=prog(t,st(6)-.35,st(6)+.35);
    const [wx,wy0,ws,wf]=track(t,WTRK());
    const POOL=[[96,150,176],[22,58,80]],DEEP=[[22,58,82],[6,18,30]],WARM=[[132,70,44],[44,18,12]];
    // depth: 0 to 10 m on "ten", then a step down on each Squeeze (no number past 10 is shown)
    const dsq=['sq0','sq1','sq2'].reduce((s,k)=>s+eio(prog(t,C[k]-.05,C[k]+.35)),0),depth=10*eio(prog(t,C.pushes-.1,C.ten+.2))+5*dsq;
    // chapter 4: the three real-life spikes, each one eased move of the watch
    const sp={dive:bump(t,C.dive-.15,.9),jet:bump(t,C.jet-.15,.8),stroke:bump(t,C.stroke-.15,.8),spike:Math.pow(bump(t,C.spikes-.15,1.9),.6)};   // up past the test line on "spike", then it settles (one move)
    const wx2=wx-40*sp.jet*c4,wy=wy0+70*sp.dive*c4,wrot=.22*sp.stroke*c4;
    inWorld(()=>{
      // ch0: the split, pool | hot shower; the divider holds still at the centre and wipes away into chapter 1
      if(c0>0){const dv=lerp(CX,1160,eio(prog(t,st(1)-.35,st(1)+.45)));
        g.save();g.globalAlpha=c0;const deck=g.createLinearGradient(0,WT,0,600);deck.addColorStop(0,'#2c4c5c');deck.addColorStop(1,'#4e7f92');g.fillStyle=deck;g.fillRect(-200,WT-300,dv+200,900-WT);
        g.strokeStyle='rgba(255,255,255,.10)';g.lineWidth=2;for(let x=40;x<dv;x+=80){g.beginPath();g.moveTo(x,WT);g.lineTo(x,596);g.stroke()}g.restore();
        water(-200,dv,POOL[0],POOL[1],600,1,t);
        poolTiles(-200,dv,600,1);
        g.save();g.beginPath();g.rect(-200,0,dv+200,2000);g.clip();for(let x=40;x<dv;x+=34){g.fillStyle=(Math.floor(x/34)%4<2)?'#f2f6fa':'#e2524a';g.beginPath();g.ellipse(x,600,14,9,0,0,7);g.fill()}g.restore();
        shower(dv,t,.35+.65*prog(t,C.hot-.2,C.hot+.5),1);
        g.save();g.fillStyle='#fff';g.shadowColor='#fff';g.shadowBlur=24;g.fillRect(dv-3,WT-200,6,1200);g.restore()}
      // ch1: going down: the water darkens, the surface leaves the top, the particles stream up while it sinks; arrows press harder on each Squeeze
      if(c1>0){const dd=clamp(depth/25);water(-200,1300,mix(POOL[0],DEEP[0],dd),mix(POOL[1],DEEP[1],dd),600-depth*60,c1,t);snow(depth,c1)}
      if(c2>0){water(-200,1300,DEEP[0],DEEP[1],-500,c2,t);snow(25,c2*.8)}
      // ch3: the lab tank: still water, a flat surface, glass walls
      if(c3>0){g.save();g.globalAlpha=c3;g.fillStyle='#0b1622';g.fillRect(-200,WT-300,1500,1400);g.restore();
        const sy=lerp(560,590,0);g.save();g.beginPath();g.rect(120,500,840,700);g.clip();water(-200,1300,[44,96,124],[8,24,40],sy,c3,t,0);g.restore();
        g.save();g.globalAlpha=c3;g.strokeStyle='rgba(200,235,255,.55)';g.lineWidth=5;g.beginPath();g.moveTo(120,470);g.lineTo(120,1200);g.lineTo(960,1200);g.lineTo(960,470);g.stroke();
        g.strokeStyle=`rgba(160,255,200,${.5+.4*prog(t,C.still-.1,C.still+.3)})`;g.lineWidth=4;g.beginPath();g.moveTo(124,sy);g.lineTo(956,sy);g.stroke();g.restore()}
      // ch4: open water, a jet from the left on "jet", bubbles trailing up on "dive", a splash on "stroke"
      if(c4>0){water(-200,1300,[30,74,100],[8,22,36],-500,c4,t);
        if(sp.jet>0){g.save();g.globalAlpha=c4*sp.jet;for(let k=0;k<9;k++){const y=wy-90+k*22,x1=wx2-150*1.2;const gj=g.createLinearGradient(-100,0,x1,0);gj.addColorStop(0,'rgba(220,245,255,0)');gj.addColorStop(1,'rgba(220,245,255,.8)');g.strokeStyle=gj;g.lineWidth=6;g.beginPath();g.moveTo(-100,y);g.lineTo(x1-10,y+(k-4)*3);g.stroke()}g.restore()}
        const dq=prog(t,C.dive-.15,C.dive+1.1);if(dq>0&&dq<1){for(let i=0;i<14;i++){const yy=wy-120-dq*380-i*26,xx=wx2+lerp(-120,120,(i*37%14)/14);glowDot(xx,yy,3+(i%3),'#dff6ff',c4*(1-dq)*.7)}}
        const kq=prog(t,C.stroke-.1,C.stroke+.9);if(kq>0&&kq<1){g.save();g.globalAlpha=c4*(1-kq);g.strokeStyle='#e8f8ff';g.lineWidth=5;for(let i=0;i<7;i++){const an=-Math.PI*.9+i*.3;g.beginPath();g.moveTo(wx2+Math.cos(an)*(250+kq*40),wy+Math.sin(an)*(300+kq*40));g.lineTo(wx2+Math.cos(an)*(300+kq*150),wy+Math.sin(an)*(350+kq*150));g.stroke()}g.restore()}}
      // ch5: warm water, steam rising
      if(c5>0){const h=prog(t,C.heat-.3,C.steam+.4);water(-200,1300,mix(DEEP[0],WARM[0],h),mix(DEEP[1],WARM[1],h),-500,c5,t);g.save();g.globalAlpha=c5;steamPuffs(t,-200,h,1);g.restore()}
      // ch6: the recap split: pool | sauna, a still divider
      if(c6>0){g.save();g.globalAlpha=c6*(1-fin*.6);water(-200,CX,POOL[0],POOL[1],640,1,t);g.save();g.beginPath();g.rect(-200,0,CX+200,2000);g.clip();const deck=g.createLinearGradient(0,WT,0,640);deck.addColorStop(0,'#2c4c5c');deck.addColorStop(1,'#4e7f92');g.fillStyle=deck;g.fillRect(-200,WT-300,CX+200,940-WT);water(-200,CX,POOL[0],POOL[1],640,1,t);poolTiles(-200,CX,640,1);g.restore();
        sauna(CX,t,1);g.fillStyle='#fff';g.shadowColor='#fff';g.shadowBlur=24;g.fillRect(CX-3,WT-200,6,1200);g.restore()}
      // around the watch, under it: pressure
      if(c1>0){const p=clamp(.15+.45*prog(t,C.pushes-.2,C.ten+.4)+.13*dsq),push=Math.max(...['sq0','sq1','sq2'].map(k=>bump(t,C[k]-.05,.4)));pressure(wx,wy,ws,p,c1,push)}
      if(c2>0){const back=prog(t,C.seals-.2,C.seals+.4);pressure(wx,wy,ws,.55,c2*(1-.6*prog(t,C.crown-.4,C.crown)),-back*1.6,'rgba(150,215,255,.9)')}
      if(c3>0)halo(wx,wy,ws,c3*prog(t,C.fifty-.2,C.fifty+.5),'rgba(120,230,190,.32)');
      if(c4>0){const s4=Math.max(sp.dive,sp.jet,sp.stroke,sp.spike);pressure(wx2,wy,ws,.3+.7*s4,c4*(.35+.65*s4),0,s4>.2?'rgba(255,110,120,.95)':'rgba(150,215,255,.9)')}
      // the watch: one subject all through, with what each chapter does to it
      const hot=c5*prog(t,C.heat-.1,C.steam+.3),lit={
        glass:c2*prog(t,C.seals-.1,C.seals+.3)*(1-.5*prog(t,C.crown-.3,C.crown)),
        crown:c2*prog(t,C.crown+.2,C.crown+.5),button:c2*prog(t,C.buttons+.2,C.buttons+.5),back:c2*prog(t,C.back+.2,C.back+.6)};
      const scr=gg=>{
        if(c0>.5||c6>.5){wordAt(t,'5 ATM','#8ef0ff',-14,64,1);g.font='700 22px Inter';g.fillStyle='#a3a9cc';g.textAlign='center';g.fillText(c6>.5?'POOL ✓':'WATER RESIST',0,50)}
        else if(c1>.5){wordAt(t,'DEPTH ▼','#8ef0ff',-30,40,1-prog(t,C.ten-.25,C.ten-.05));wordAt(t,'10 m','#8ef0ff',-30,72,prog(t,C.ten-.1,C.ten+.2));wordAt(t,'+1 ATM','#ff8f9a',46,40,prog(t,C.atmosphere-.1,C.atmosphere+.2));
          ['sq0','sq1','sq2'].forEach((k,i)=>{const q=prog(t,C[k]-.05,C[k]+.2);if(q>0){g.fillStyle=`rgba(255,${lerp(170,90,i/2)|0},110,${q})`;rrect(g,-78+i*56,98,44,16,6);g.fill()}})}
        else if(c2>.5){wordAt(t,'SEALS','#ffb35c',-10,58,prog(t,C.seals-.1,C.seals+.2)*(1-prog(t,C.crown-.45,C.crown-.15)))}
        else if(c3>.5){const tq=prog(t,C.ten3-.1,C.ten3+1.2),tf=prog(t,C.ten3-.3,C.ten3);wordAt(t,'5 ATM','#6ff0a4',-24,64,prog(t,C.five-.1,C.five+.2)*(1-tf));
          if(tq>0){g.save();g.strokeStyle='#6ff0a4';g.lineWidth=10;g.shadowColor='#4ee28a';g.shadowBlur=14;g.beginPath();g.arc(0,-8,92,-Math.PI/2,-Math.PI/2+eoc(tq)*Math.PI*2);g.stroke();g.restore();wordAt(t,'10 min','#d8fff0',-8,44,tq*3)}
          const ok=prog(t,C.samsung-.1,C.samsung+.3);if(ok>0)wordAt(t,'TESTED ✓','#6ff0a4',110,22,ok)}
        else if(c4>.5){const lv=.55+1.05*Math.max(sp.dive,sp.jet,sp.stroke,sp.spike);meter(gg,lv,1);wordAt(t,lv>1?'PAST TEST':'TEST OK',lv>1?'#ff8f9a':'#6ff0a4',-112,24,1)}
        else if(c5>.5){wordAt(t,'HEAT','#ff8f6c',-20,58,prog(t,C.heat-.1,C.heat+.2)*(1-prog(t,C.steam-.45,C.steam-.15)))}};
      watch(wx2,wy,{s:ws,flip:wf,rot:wrot,squeeze:c1*clamp(.2*eio(prog(t,C.pushes,C.ten+.3))+.27*dsq),lit,
        rings:{crown:c2*prog(t,C.crown-.3,C.crown+.25),button:c2*prog(t,C.buttons-.3,C.buttons+.25)},
        hot,thin:prog(t,C.soften-.1,C.soften+.6),crack:c5*prog(t,C.age-.1,C.age+.5),drop:c5*prog(t,C.soften,C.soften+1.6),fog:c5*prog(t,C.soften+1.2,C.soften+2.4),screen:scr});
      if(fin>0){g.save();g.setTransform(1,0,0,1,0,0);g.fillStyle=`rgba(3,7,16,${.82*fin})`;g.fillRect(0,0,1080,1920);g.restore()}
    });
  },
  labels(t){
    const c0=1-prog(t,st(1)-.3,st(1)+.3),c1=win(t,st(1)-.35,st(2)+.3,.5,.5),c2=win(t,st(2)-.3,st(3)+.3,.5,.5),c3=win(t,st(3)-.3,st(4)+.3,.5,.5),c4=win(t,st(4)-.3,st(5)+.3,.5,.5),c5=win(t,st(5)-.3,st(6)+.3,.5,.5),c6=prog(t,st(6)-.2,st(6)+.3)*(1-prog(t,C.final-.3,C.final));
    if(c0>0){label(200,520,'✓ POOL','#6ff0a4',c0,28,'rgba(10,40,24,.92)');label(690,520,'✕ HOT SHOWER','#ff8f9a',c0*prog(t,C.hot-.1,C.hot+.2),28,'rgba(44,10,18,.92)')}
    if(c1>0){label(190,1150,'10 m DOWN','#8ef0ff',c1*prog(t,C.ten-.1,C.ten+.2),26);label(890,1150,'+1 ATM','#ff8f9a',c1*prog(t,C.atmosphere-.1,C.atmosphere+.2),28,'rgba(44,10,18,.92)')}
    if(c2>0){label(830,680,'CROWN SEAL','#ffb35c',c2*prog(t,C.crown-.1,C.crown+.2)*(1-prog(t,C.buttons-.2,C.buttons)),26,'rgba(44,26,8,.92)');label(830,1010,'BUTTON SEAL','#ffb35c',c2*prog(t,C.buttons-.1,C.buttons+.2)*(1-prog(t,C.back-.2,C.back)),26,'rgba(44,26,8,.92)');
      label(540,1160,'CASE BACK SEAL','#ffb35c',c2*prog(t,C.back+.1,C.back+.4),26,'rgba(44,26,8,.92)');label(250,560,'RUBBER RINGS','#ffd29a',c2*prog(t,C.rubber-.1,C.rubber+.2)*(1-prog(t,C.crown-.4,C.crown-.1)),26,'rgba(44,26,8,.92)')}
    if(c3>0){label(260,540,'STILL WATER','#8ef0ff',c3*prog(t,C.still-.1,C.still+.2),26);label(820,540,'50 m','#6ff0a4',c3*prog(t,C.fifty-.1,C.fifty+.2),30,'rgba(10,40,24,.92)');
      label(540,1150,"SAMSUNG'S TEST",'#6ff0a4',c3*prog(t,C.samsung-.1,C.samsung+.2),26,'rgba(10,40,24,.92)')}
    if(c4>0){[['dive','✕ DIVE',220],['jet','✕ JET',540],['stroke','✕ STROKE',860]].forEach(([k,txt,x])=>label(x,1150,txt,'#ff8f9a',c4*prog(t,C[k]-.05,C[k]+.2),26,'rgba(44,10,18,.92)'));
      label(540,540,'PAST THE TEST','#ff8f9a',c4*prog(t,C.spikes-.1,C.spikes+.2),28,'rgba(44,10,18,.92)')}
    if(c5>0){label(220,540,'HOT WATER','#ff8f6c',c5*prog(t,C.heat-.1,C.heat+.2)*(1-prog(t,C.soften-.3,C.soften)),26,'rgba(44,18,8,.92)');label(860,540,'STEAM','#ffd29a',c5*prog(t,C.steam-.1,C.steam+.2)*(1-prog(t,C.soften-.3,C.soften)),26,'rgba(44,26,8,.92)');
      label(540,540,'A DROP GETS IN','#8ef0ff',c5*prog(t,C.soften+.3,C.soften+.6)*(1-prog(t,C.age-.3,C.age)),26);label(540,1150,'SEALS AGE','#ff8f9a',c5*prog(t,C.age-.1,C.age+.2),26,'rgba(44,10,18,.92)')}
    if(c6>0){label(260,540,'✓ POOL','#6ff0a4',c6*prog(t,C.pool-.1,C.pool+.2),28,'rgba(10,40,24,.92)');label(820,540,'✕ SAUNA','#ff8f9a',c6*prog(t,C.sauna-.1,C.sauna+.2),28,'rgba(44,10,18,.92)')}
  },
  panels(t){
    if(panel('#p0',0,st(1)-.15)>0){$('#p0b').style.opacity=prog(t,C.hot-.1,C.hot+.2)}
    if(panel('#p1',st(1)-.1,st(2)-.15)>0){const pr=clamp(.25+.5*prog(t,C.pushes-.2,C.ten+.6)+.08*['sq0','sq1','sq2'].reduce((s,k)=>s+eio(prog(t,C[k]-.05,C[k]+.35)),0));$('#p1bar').style.width=(pr*100)+'%';$('#p1n').style.opacity=prog(t,C.atmosphere-.1,C.atmosphere+.2);$('#p1r').style.opacity=prog(t,C.ten-.1,C.ten+.2)}
    if(panel('#p2',st(2)-.1,st(3)-.15)>0){const ts=[C.seals,C.crown,C.buttons,C.back];$$('#p2d i').forEach((d,i)=>{const on=prog(t,ts[i]-.1,ts[i]+.2);d.style.color=on>0?'#ffd29a':'#6a7298';d.style.borderColor=on>0?'#ffb35c':'rgba(255,255,255,.14)';d.style.background=on>0?'rgba(255,154,61,.18)':'rgba(255,255,255,.05)';d.style.boxShadow=on>0?`0 0 ${22*on}px rgba(255,154,61,.5)`:'none';d.style.transform=`scale(${1+.06*Math.sin(Math.PI*on)})`})}
    if(panel('#p3',st(3)-.1,st(4)-.1)>0){const ts=[C.five,C.fifty,C.ten3];$$('#p3s .cell').forEach((d,i)=>{const on=prog(t,ts[i]-.1,ts[i]+.2);d.querySelector('b').style.color=on>0?'#6ff0a4':'rgba(0,0,0,0)';d.style.borderColor=on>0?'#6ff0a4':'rgba(255,255,255,.12)';d.style.boxShadow=on>0?`0 0 ${24*on}px rgba(78,226,138,.45)`:'none';d.style.transform=`scale(${1+.06*Math.sin(Math.PI*on)})`})}
    if(panel('#p4',st(4)+.15,en(4)+.45)>0)stepFlow('#p4s',[st(4)+.15,C.dive,C.jet,C.stroke],['#6ff0a4','#ff8f6c','#ff5d6c','#ff7ad9']);
    if(panel('#p5',st(5)+.1,en(5)+.45)>0){const so=prog(t,C.soften-.1,C.soften+.8),ag=prog(t,C.age-.1,C.age+.6);$('#p5bar').style.width=(100-40*so-25*ag)+'%';$('#p5h').style.opacity=prog(t,C.heat-.1,C.heat+.3)}
    pills(['pool','sauna']);
  }
};
})();
