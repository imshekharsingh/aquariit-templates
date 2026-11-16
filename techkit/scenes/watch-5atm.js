// @techin20sec kit topic: What does 5 ATM on your watch mean? (techreel/topics/watch-5atm.json). Drawn on the shared kit frame
// (techkit/base.html): hero(t) in world space under the camera, labels(t) in screen space, panels(t) for the DOM. Every beat on a cue word.
// Rebuilt 16 Nov 2026 (owner, after render 5: "still doesn't do much in terms of animation around the main elements ... this one doesn't
// do much, why?"): an object topic opens up (rules-tech.md K2). The watch itself transforms on every beat and the camera moves with it:
// it drops into a pool with a splash and the camera follows it down (the depth on its screen counts to the 10 m the voice says); the case
// flexes inward on each Squeeze; an x-ray iris opens the case to show its rubber seals (gaskets), which lift out and press back into their
// gaps and light one by one as they are named; in the still lab tank they compress evenly while a 10 min ring runs on the screen; on a
// swimmer's arm a pressure line spikes past the test line on dive, jet and stroke while the case flexes and the gaskets flash; in the heat a
// crown gasket softens and warps, one drop slips past it and the glass fogs from inside; the recap is an exploded view that snaps together.
// Calm (rules-tech.md K1): no glass sheen, no loops or wobble, nothing moves without a cue; no dashed rings or tick ladders (Output QA
// NUMBERS read them as digits). The subject's own box goes to subj() for Output QA HERO (only change inside the case counts).
(function(){
const R=mulberry(11);
const WL=24,WT=455,WR=1056,WB=1228;   // the world window (screen px): nearly the full width, under the chip, over the panel
const WX=540,WY=850,WS=1.6,WY4=940;   // WY4: lower on the swimmer's arm, under the pressure line            // the watch: centre and scale (case 280 x 330 local = 448 px, 41% of the width)
const SNOW=[...Array(70)].map(()=>({x:R()*1200-60,y:R(),r:1.2+R()*2.2,a:.15+R()*.3}));
const STEAM=[...Array(26)].map(()=>({x:R(),ph:R(),r:46+R()*60,v:.05+R()*.05}));
const BUB=[...Array(22)].map(()=>({x:R()*2-1,d:R(),r:3+R()*7,v:.7+R()*.6}));
const SPL=[...Array(26)].map(()=>({an:-Math.PI/2+(R()-.5)*2.4,v:300+R()*420,r:5+R()*8,x:(R()-.5)*300}));
const C3=x=>`rgb(${x[0]|0},${x[1]|0},${x[2]|0})`,mix=(a,b,u)=>a.map((v,i)=>lerp(v,b[i],u));
const bump=(t,t0,d=.7)=>Math.sin(Math.PI*prog(t,t0,t0+d));
// world window: clip in screen space, then draw under the camera
function inWorld(f){g.save();g.setTransform(1,0,0,1,0,0);rrect(g,WL,WT,WR-WL,WB-WT,34);g.clip();camOn();f();g.restore()}
// open water: top and bottom colours (low saturation: Output QA COLOUR), a surface at y sy (world) when in view
function water(x0,x1,top,bot,sy,a){if(a<=0)return;g.save();g.globalAlpha=a;const y0=Math.max(sy,-400);
  const gr=g.createLinearGradient(0,y0,0,1700);gr.addColorStop(0,C3(top));gr.addColorStop(1,C3(bot));g.fillStyle=gr;g.fillRect(x0,y0,x1-x0,1700-y0);
  if(sy>WT-60&&sy<WB+40){const sg=g.createLinearGradient(0,sy-4,0,sy+36);sg.addColorStop(0,'rgba(230,248,255,.7)');sg.addColorStop(.18,'rgba(200,236,255,.22)');sg.addColorStop(1,'rgba(200,236,255,0)');
    g.fillStyle=sg;g.fillRect(x0,sy-4,x1-x0,40)}
  g.restore()}
// pool tiles under the surface sy: soft grout lines and a lane stripe
function poolTiles(x0,x1,sy,a){if(a<=0)return;g.save();g.globalAlpha=a;g.beginPath();g.rect(x0,sy+8,x1-x0,1600);g.clip();g.strokeStyle='rgba(220,245,255,.12)';g.lineWidth=2;
  for(let y=sy+70;y<sy+1600;y+=70){g.beginPath();g.moveTo(x0,y);g.lineTo(x1,y);g.stroke()}for(let x=-200;x<x1;x+=70){g.beginPath();g.moveTo(x,sy+8);g.lineTo(x,sy+1600);g.stroke()}
  g.fillStyle='rgba(16,40,70,.5)';g.fillRect(x0,sy+420,x1-x0,26);g.restore()}
// marine snow: still particles that only move while the watch goes down (depth d), never a loop
function snow(d,a){if(a<=0)return;SNOW.forEach(s=>{const y=WT-40+(((s.y*900-d*55)%900)+900)%900;g.globalAlpha=a*s.a;g.fillStyle='#cfe8f5';g.beginPath();g.arc(s.x,y,s.r,0,7);g.fill()});g.globalAlpha=1}
function steamPuffs(t,x0,x1,k,a){STEAM.forEach(s=>{const q=(t*s.v+s.ph)%1,x=lerp(x0+40,x1-20,s.x),y=lerp(WB+60,WT-60,q);const al=.26*k*a*Math.sin(Math.PI*q);if(al<=.003)return;
  const gr=g.createRadialGradient(x,y,0,x,y,s.r);gr.addColorStop(0,`rgba(255,240,228,${al})`);gr.addColorStop(1,'rgba(255,240,228,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,s.r,0,7);g.fill()})}
// the sauna half (recap): warm wood slats, a coal box, steam
function sauna(x0,t,a){if(a<=0)return;g.save();g.globalAlpha=a;g.beginPath();g.rect(x0,WT-300,1300,1300);g.clip();
  for(let i=0;i<12;i++){const y=WT-20+i*68;g.fillStyle=i%2?'#6a4428':'#5c3a22';g.fillRect(x0,y,1300,64);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x0,y+60,1300,4)}
  const lg=g.createRadialGradient(840,1100,20,840,1000,520);lg.addColorStop(0,'rgba(255,140,70,.45)');lg.addColorStop(1,'rgba(255,120,60,0)');g.fillStyle=lg;g.fillRect(x0,WT-300,1300,1300);
  g.fillStyle='#2b2320';rrect(g,740,1080,220,140,14);g.fill();for(let i=0;i<6;i++){glowDot(770+i*34,1082,9,'#ff8a4a',.55)}
  steamPuffs(t,x0,1080,1,1);g.restore()}
// pressure arrows round the case (world): p 0..1 sets length, weight and colour
function pressure(x,y,s,p,a,col){if(a<=0)return;for(let k=0;k<12;k++){const an=k/12*Math.PI*2+.26,ex=Math.cos(an),ey=Math.sin(an);
  const rx=170*s+22,ry=205*s+22,len=40+150*p;const tx=x+ex*rx,ty=y+ey*ry;
  arrow(tx+ex*len,ty+ey*len,tx,ty,col||`rgb(${lerp(150,255,p)|0},${lerp(225,96,p)|0},${lerp(255,110,p)|0})`,a*.95,5+7*p)}}
// an even halo of pressure (still water): no lines, nothing an OCR can read as a digit
function halo(x,y,s,a,col){if(a<=0)return;g.save();g.globalAlpha=a;g.translate(x,y);g.scale(1,1.2);const r=200*s;const gr=g.createRadialGradient(0,0,r*.72,0,0,r*1.25);
  gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(.35,col);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.arc(0,0,r*1.3,0,7);g.fill();g.restore()}
// a rounded rect whose four sides bow inward by f (the case flexing under pressure)
function frect(c,x,y,w,h,r,f){c.beginPath();c.moveTo(x+r,y);c.quadraticCurveTo(x+w/2,y+f,x+w-r,y);c.arcTo(x+w,y,x+w,y+r,r);c.quadraticCurveTo(x+w-f,y+h/2,x+w,y+h-r);
  c.arcTo(x+w,y+h,x+w-r,y+h,r);c.quadraticCurveTo(x+w/2,y+h-f,x+r,y+h);c.arcTo(x,y+h,x,y+h-r,r);c.quadraticCurveTo(x+f,y+h/2,x,y+r);c.arcTo(x,y,x+r,y,r);c.closePath()}
// the gaskets (local units): two O-rings seen side-on where the crown and button stems pass the case wall, the glass ring, the case-back ring
const GK={crown:{o:1,x:126,y:-38,rx:10,ry:30,out:[150,0]},button:{o:1,x:126,y:46,rx:9,ry:24,out:[150,30]},
  glass:{o:0,x:-110,y:-134,w:220,h:268,r:44,out:[0,-90]},back:{o:0,x:-131,y:-156,w:262,h:312,r:60,out:[0,90]}};
const RUB=[255,154,61],LIT=[255,214,140],RED=[255,93,108],HOT=[255,74,42],OLD=[128,114,104],GRN=[111,240,164];
// one gasket: st {sq squash 0..1, lit 0..1, pop 0..1 (grows as it is named), out 0..1 (lifted out of its seat), col [r,g,b], warp 0..1, crack 0..1}
function gasket(k,st,a){if(a<=0)return;const G=GK[k],e=eoc(st.out||0),pop=st.pop||0,sq=st.sq||0,lit=st.lit||0;g.save();g.globalAlpha=a;
  g.translate(G.out[0]*e,G.out[1]*e);const col=st.col||mix(RUB,LIT,lit);g.strokeStyle=C3(col);g.shadowColor=C3(col);g.shadowBlur=6+26*Math.max(lit,pop);
  if(G.o){g.translate(G.x,G.y);g.scale(1+.45*pop+.5*e,1+.45*pop+.5*e);const rx=G.rx*(1-.5*sq),ry=G.ry*(1+.12*sq),w=st.warp||0,ck=st.crack||0;g.lineWidth=9+6*sq;
    g.beginPath();let pen=false;for(let i=0;i<=64;i++){const th=i/64*Math.PI*2,gap=ck>0&&((th>.5&&th<.5+.5*ck)||(th>3.4&&th<3.4+.4*ck));
      const m=1+w*(.28*Math.sin(3*th+1)+.14*Math.sin(5*th));const x=Math.cos(th)*rx*m*(1+.5*w),y=Math.sin(th)*ry*m;if(gap){pen=false;continue}if(!pen){g.moveTo(x,y);pen=true}else g.lineTo(x,y)}g.stroke()}
  else{const s=1+.06*pop+.25*e,ins=sq*4;g.scale(s,s);g.lineWidth=7+5*sq+3*pop;rrect(g,G.x+ins,G.y+ins,G.w-2*ins,G.h-2*ins,G.r);g.stroke()}
  g.restore()}
// the watch, local units (case 280 x 330). o: s, rot, flex 0..1, xr 0..1 (x-ray), iris [cx, cy, r] (where the x-ray opens; default all),
// gk {crown, button, glass, back} gasket states, ga (gasket alpha, default xr), screen(g), scrA, fog 0..1, drop 0..1, arrows [[k, len, blocked]]
function watch(x,y,o){const s=o.s||WS,f=16*(o.flex||0),xr=o.xr||0;g.save();g.translate(x,y);if(o.rot)g.rotate(o.rot);g.scale(s,s);subj(-140,-165,140,165);
  // strap
  g.save();g.shadowColor='rgba(0,0,0,.55)';g.shadowBlur=50;g.shadowOffsetY=24;const sg=g.createLinearGradient(-92,0,92,0);sg.addColorStop(0,'#1a2030');sg.addColorStop(.5,'#2e3854');sg.addColorStop(1,'#1a2030');
  g.fillStyle=sg;rrect(g,-92,-330,184,200,30);g.fill();rrect(g,-92,130,184,200,30);g.fill();g.restore();
  g.fillStyle='rgba(255,255,255,.07)';for(let k=0;k<4;k++){rrect(g,-60,-310+k*40,120,8,4);g.fill();rrect(g,-60,170+k*40,120,8,4);g.fill()}
  // crown and button (outside the case wall)
  g.fillStyle='#a7b2c6';rrect(g,136,-72,30,68,10);g.fill();g.fillStyle='rgba(0,0,0,.25)';for(let k=0;k<5;k++)g.fillRect(150,-66+k*12,14,4);
  g.fillStyle='#8a95ab';rrect(g,138,20,20,52,8);g.fill();
  // the case: steel, flexing inward
  const cg=g.createLinearGradient(-140,-160,140,160);cg.addColorStop(0,'#dfe6f2');cg.addColorStop(.45,'#7a869e');cg.addColorStop(1,'#2b3245');g.fillStyle=cg;frect(g,-140,-165,280,330,66,f);g.fill();
  g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=2;g.stroke();
  g.fillStyle='#04060e';frect(g,-118,-142,236,284,50,f*.8);g.fill();
  g.save();frect(g,-118,-142,236,284,50,f*.8);g.clip();const sc=g.createRadialGradient(-40,-80,10,0,0,220);sc.addColorStop(0,'rgba(80,200,255,.16)');sc.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=sc;g.fillRect(-118,-142,236,284);
    // the glass pressed in: a darker dent in the middle and a reflection that bends with it
    const fl=o.flex||0;if(fl>.01){const dg=g.createRadialGradient(0,0,10,0,0,150);dg.addColorStop(0,`rgba(0,0,0,${.5*fl})`);dg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=dg;g.fillRect(-118,-142,236,284);
      g.strokeStyle=`rgba(220,240,255,${.18+.3*fl})`;g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(-96,-60);g.quadraticCurveTo(0,-60+110*fl,96,-60);g.stroke();g.beginPath();g.moveTo(-80,70);g.quadraticCurveTo(0,70-80*fl,80,70);g.stroke()}
    g.restore();
  // x-ray: inside the iris the case turns see-through and shows the module, the stems and the gaskets
  if(xr>0){const ir=o.iris||[0,0,400];g.save();g.beginPath();g.arc(ir[0],ir[1],Math.max(.1,ir[2]),0,7);g.clip();g.globalAlpha=xr;
    g.fillStyle='rgba(8,22,44,.94)';frect(g,-140,-165,280,330,66,f);g.fill();g.strokeStyle='rgba(142,240,255,.9)';g.lineWidth=3;g.stroke();
    g.strokeStyle='rgba(142,240,255,.45)';g.lineWidth=2;frect(g,-118,-142,236,284,50,f*.8);g.stroke();
    g.fillStyle='#132642';g.strokeStyle='rgba(140,210,255,.8)';g.lineWidth=3;rrect(g,-86,-100,172,100,18);g.fill();g.stroke();
    g.fillStyle='rgba(140,210,255,.35)';rrect(g,-70,-84,40,68,8);g.fill();
    g.fillStyle='#0f3029';g.strokeStyle='rgba(120,230,190,.75)';rrect(g,-96,16,192,92,14);g.fill();g.stroke();
    g.fillStyle='rgba(120,230,190,.4)';[[-76,34,46,30],[-18,34,30,30],[26,34,52,22],[-76,76,90,16]].forEach(r=>{rrect(g,r[0],r[1],r[2],r[3],5);g.fill()});
    g.fillStyle='#a7b2c6';g.globalAlpha=xr*.9;g.fillRect(96,-45,46,14);g.fillRect(100,40,42,12);g.globalAlpha=xr;
    // water pushing at a gap: an arrow from outside that stops at its gasket
    (o.arrows||[]).forEach(([k,len,blk])=>{const G=GK[k];if(len<=0)return;arrow(G.x+14+150*len,G.y,G.x+14,G.y,'#8ed8ff',clamp(len*3),7);
      if(blk>0&&blk<1)ring(G.x+14,G.y,8+26*blk,'#cfefff',1-blk,3)});
    const ga=o.ga==null?1:o.ga;['back','glass','button','crown'].forEach(k=>gasket(k,(o.gk||{})[k]||{},ga));
    g.restore()}
  // the screen
  SCRA=o.scrA==null?1:o.scrA;if(o.screen&&SCRA>.01){g.save();frect(g,-118,-142,236,284,50,f*.8);g.clip();g.globalAlpha*=SCRA;o.screen(g);g.restore()}SCRA=1;
  // a drop gets in past the crown gasket, then fog inside the glass
  if(o.drop>0){const q=o.drop,P=[[200,-38],[150,-38],[118,-38],[70,-24],[20,10]],u=eio(q)*(P.length-1),i=Math.min(P.length-2,Math.floor(u)),v=u-i,x=lerp(P[i][0],P[i+1][0],v),yy=lerp(P[i][1],P[i+1][1],v),r=lerp(13,9,q);
    g.save();g.globalAlpha=clamp((1-q)*5);g.fillStyle='rgba(170,225,255,.95)';g.shadowColor='#bfe9ff';g.shadowBlur=14;g.beginPath();g.moveTo(x+r*1.8,yy);g.quadraticCurveTo(x+r*.3,yy-r*1.1,x-r*.2,yy-r);g.arc(x,yy,r,-Math.PI/2,Math.PI/2,true);g.quadraticCurveTo(x+r*.3,yy+r*1.1,x+r*1.8,yy);g.fill();g.restore()}
  if(o.fog>0){g.save();frect(g,-118,-142,236,284,50,f*.8);g.clip();const fg=g.createRadialGradient(50,-10,10,30,0,260*o.fog+40);fg.addColorStop(0,`rgba(225,232,240,${.8*o.fog})`);fg.addColorStop(1,'rgba(225,232,240,0)');g.fillStyle=fg;g.fillRect(-118,-142,236,284);
    g.fillStyle=`rgba(225,240,255,${.5*o.fog})`;[[40,-60,7],[70,-20,5],[-10,-40,6],[20,30,8],[90,40,4],[-40,10,5]].forEach(([a,b,r])=>{g.beginPath();g.arc(a,b,r*o.fog,0,7);g.fill()});g.restore()}
  g.restore()}
// the recap's exploded view: the same watch as six layers on an isometric stack; e 0..1 (apart), gl (the gaskets' glow)
function exploded(x,y,s,e,gl,a){if(a<=0)return;g.save();g.globalAlpha=a;g.translate(x,y);
  const L=[['back',0],['gback',1],['module',2],['case',3],['gglass',4],['glass',5]],gap=78*e+10;
  L.forEach(([k,i])=>{const dy=(2.5-i)*gap;g.save();g.translate(0,dy);g.transform(.62*s,.36*s,-.62*s,.36*s,0,0);if(k==='case')subj(-140,-165,140,165);
    const plate=(fill,str,lw,thick)=>{if(thick){g.save();g.translate(7,7);g.fillStyle='rgba(0,0,0,.45)';rrect(g,-140,-165,280,330,66);g.fill();g.restore()}g.fillStyle=fill;rrect(g,-140,-165,280,330,66);g.fill();if(str){g.strokeStyle=str;g.lineWidth=lw;g.stroke()}};
    if(k==='back'){plate('#5a6478','rgba(255,255,255,.4)',2,1);g.fillStyle='#10141f';g.beginPath();g.arc(0,0,70,0,7);g.fill()}
    else if(k==='gback'||k==='gglass'){g.save();g.strokeStyle=C3(mix(RUB,LIT,gl));g.shadowColor='#ffb35c';g.shadowBlur=10+20*gl;g.lineWidth=12;rrect(g,-128,-152,256,304,60);g.stroke();g.restore()}
    else if(k==='module'){g.fillStyle='#132642';g.strokeStyle='rgba(140,210,255,.8)';g.lineWidth=3;rrect(g,-96,-110,192,220,22);g.fill();g.stroke();g.fillStyle='rgba(120,230,190,.45)';rrect(g,-70,10,140,70,10);g.fill()}
    else if(k==='case'){g.save();g.translate(7,7);g.fillStyle='rgba(0,0,0,.45)';rrect(g,-140,-165,280,330,66);g.fill();g.restore();const cg=g.createLinearGradient(-140,-160,140,160);cg.addColorStop(0,'#dfe6f2');cg.addColorStop(.5,'#7a869e');cg.addColorStop(1,'#2b3245');
      const fr=new Path2D();rp(fr,-140,-165,280,330,66);rp(fr,-112,-136,224,272,46);g.fillStyle=cg;g.fill(fr,'evenodd');g.fillStyle='#a7b2c6';rrect(g,136,-72,30,68,10);g.fill();rrect(g,138,20,20,52,8);g.fill()}
    else{g.fillStyle='rgba(60,170,230,.28)';g.strokeStyle='rgba(190,240,255,.85)';g.lineWidth=3;rrect(g,-118,-142,236,284,50);g.fill();g.stroke()}
    g.restore()});
  g.restore()}
function rp(p,x,y,w,h,r){p.moveTo(x+r,y);p.arcTo(x+w,y,x+w,y+h,r);p.arcTo(x+w,y+h,x,y+h,r);p.arcTo(x,y+h,x,y,r);p.arcTo(x,y,x+w,y,r);p.closePath()}
// the swimmer's forearm (ch4): from the elbow below up to the hand; the watch sits on the wrist
function forearm(ex,ey,wx,wy,a){if(a<=0)return;const an=Math.atan2(wy-ey,wx-ex),L=Math.hypot(wx-ex,wy-ey);g.save();g.globalAlpha=a;g.translate(ex,ey);g.rotate(an);
  const gr=g.createLinearGradient(0,-90,0,90);gr.addColorStop(0,'#33516a');gr.addColorStop(.5,'#22384c');gr.addColorStop(1,'#152434');g.fillStyle=gr;
  g.beginPath();g.moveTo(-40,-100);g.lineTo(L,-78);g.quadraticCurveTo(L+300,-100,L+330,0);g.quadraticCurveTo(L+300,100,L,78);g.lineTo(-40,100);g.closePath();g.fill();
  g.strokeStyle='rgba(180,220,255,.25)';g.lineWidth=3;g.stroke();g.restore()}
let SCRA=1;   // the screen's own fade (set by watch() while it draws the screen)
const wordAt=(t,txt,col,y,size,a)=>{if(a<=0||SCRA<=0)return;g.save();g.globalAlpha=clamp(a)*SCRA;g.fillStyle=col;g.textAlign='center';g.textBaseline='middle';g.font=`800 ${size}px "Inter Display",Inter`;g.shadowColor=col;g.shadowBlur=16;g.fillText(txt,0,y);g.restore()};
// a point of the watch (local) in world space
// a screen point back in world space under the current camera (labels that sit at a fixed place on screen)
const W=(sx,sy)=>[CX+(sx-CX-CAM[1])/CAM[0],CY+(sy-CY-CAM[2])/CAM[0]];
const at=(lx,ly)=>[WX+lx*WS,WY+ly*WS];
// a camera key that puts the watch's local point (lx, ly) at screen (sx, sy) at zoom z
const focus=(z,lx,ly,sx,sy)=>{const [x,y]=at(lx,ly);return [z,sx-(CX+(x-CX)*z),sy-(CY+(y-CY)*z)]};

window.TOPIC={
  title:'What <em>5 ATM</em> really means',eyebrow:'WATCHES · EXPLAINED',final:"That's<br><em>5 ATM.</em>",
  vars:{'--bg1':'#0b2448','--bg2':'#06101f','--blob1':'#0a6cff','--blob2':'#00c2b8','--blob3':'#ff7a3d','--tgrad':'linear-gradient(100deg,#8ef0ff,#3de0ff 45%,#ffb35c)'},
  chips:[['THE QUESTION','#8ef0ff'],['THE PROBLEM','#ff5d6c'],['THE FIX · SEALS','#ffb35c'],['THE TEST','#6ff0a4'],['REAL LIFE','#ff8f6c'],['THE SNEAKY ONE','#ff7ad9'],['RECAP','#b9b6ff']],
  keyw:/^(atm|five|ten|fifty|minutes|pressure|seals?|rubber|crown|buttons?|back|still|test|dive|jet|stroke|spikes|heat|steam|age|pool|sauna|hot|shower|squeeze|deeper|atmosphere)$/i,
  jolts:[],
  cover:true,   // frame 0 is the reel's cover: the header at full strength from frame 0 (rules-tech.md K3)
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
  // the camera: one eased move with the watch or to the part being named, then it holds (no drift)
  cam(){const Z=[1,0,0];
    return [[0,Z],[.6,Z],[1.6,[1.05,0,0],'expo'],[C.hot-.15,[1.05,0,0]],[C.hot+.45,focus(1.45,126,-38,600,800)],[st(1)-.45,focus(1.45,126,-38,600,800)],[st(1)+.35,Z],
      [C.sq0-.1,Z],[C.sq2+.45,[1.07,0,0]],[st(2)-.3,[1.07,0,0]],[st(2)+.3,Z],
      [C.crown-.35,Z],[C.crown+.3,focus(1.7,126,-38,560,820)],[C.buttons-.25,focus(1.7,126,-38,560,820)],[C.buttons+.3,focus(1.7,126,46,560,860)],[C.back-.2,focus(1.7,126,46,560,860)],[C.back+.45,Z],
      [st(3)-.3,Z],[st(3)+.4,Z],[C.ten3-.3,Z],[C.ten3+.4,[1.16,0,40]],[st(4)-.3,[1.16,0,40]],[st(4)+.4,[.9,0,-10]],
      [C.heat-.1,[.9,0,-10]],[C.heat+.6,[1.04,0,0]],[C.soften-.45,[1.04,0,0]],[C.soften+.2,focus(1.6,110,-34,620,820)],[C.age-.35,focus(1.6,110,-34,620,820)],[C.age+.35,[1.08,0,10]],
      [st(6)-.3,[1.08,0,10]],[st(6)+.4,[.97,0,0]]]},
  hero(t,{fin}){
    const c0=1-prog(t,st(1)-.35,st(1)+.35),c1=win(t,st(1)-.35,st(2)+.35,.7,.7),c2=win(t,st(2)-.35,st(3)+.35,.7,.7),c3=win(t,st(3)-.35,st(4)+.35,.7,.7),c4=win(t,st(4)-.35,st(5)+.35,.7,.7),c5=win(t,st(5)-.35,st(6)+.35,.7,.7),c6=prog(t,st(6)-.35,st(6)+.35);
    const POOL=[[96,150,176],[22,58,80]],DEEP=[[22,58,82],[6,18,30]],WARM=[[132,70,44],[44,18,12]];
    // ch0: the drop. The watch falls in, the camera follows it down (the surface rises out of the top)
    // frame 0 is the cover (rules-tech.md K3): the whole watch over the pool, held still for 0.6 s, inside the centre 3:4
    const fall=prog(t,.6,1.0),wyDrop=t<1.0?lerp(730,810,fall*fall):lerp(810,WY,eoc(prog(t,1.0,1.9)));
    const surf=t<.95?1000:lerp(1000,-300,eio(prog(t,.95,2.8))),spl=prog(t,.95,2.05);
    // ch1: depth (0 to 10 m on "ten"), then one step down on each Squeeze; the case flexes a little more each time
    const dsq=['sq0','sq1','sq2'].reduce((s,k)=>s+eio(prog(t,C[k]-.05,C[k]+.3)),0),dep=10*eio(prog(t,C.pushes-.1,C.ten+.05)),depth=dep+4*dsq;
    // ch4: the swimmer's arm. dive (down and back up), jet (pushed sideways), stroke (one swing on an arc)
    const sp={dive:bump(t,C.dive-.15,.9),jet:bump(t,C.jet-.15,.8),stroke:bump(t,C.stroke-.15,.8),spike:bump(t,C.spikes-.1,1.4)};
    const sw=(t>C.stroke-.25&&t<C.stroke+.85)?-.55*Math.sin(Math.PI*2*prog(t,C.stroke-.25,C.stroke+.85))*(1-prog(t,C.stroke+.5,C.stroke+.85)*.3):0;
    const EL=[WX,WY4+620],ARM=620;   // the elbow below the frame and the arm's length to the wrist (at rest the watch sits at WX, WY4)
    const ang=sw,wx4=EL[0]+Math.sin(ang)*ARM-40*sp.jet,wy4=EL[1]-Math.cos(ang)*ARM+80*sp.dive;
    inWorld(()=>{
      // ---- backgrounds
      if(c0>0){g.save();g.globalAlpha=c0;const wall=g.createLinearGradient(0,surf-700,0,surf);wall.addColorStop(0,'#1d3442');wall.addColorStop(1,'#3d6878');g.fillStyle=wall;g.fillRect(-200,surf-1400,1500,1400);
        g.strokeStyle='rgba(255,255,255,.08)';g.lineWidth=2;for(let y=surf-60;y>surf-1400;y-=80){g.beginPath();g.moveTo(-200,y);g.lineTo(1300,y);g.stroke()}g.restore();
        water(-200,1300,mix(POOL[0],DEEP[0],prog(t,1,4)*.4),POOL[1],surf,c0);poolTiles(-200,1300,surf,c0*.9);
        // warm light from the right on "hot shower": the danger the question asks about
        const hq=prog(t,C.hot-.2,C.hot+.6);if(hq>0){g.save();g.globalAlpha=c0*hq;const lg=g.createRadialGradient(1100,700,20,1000,800,700);lg.addColorStop(0,'rgba(255,150,80,.5)');lg.addColorStop(1,'rgba(255,120,60,0)');g.fillStyle=lg;g.fillRect(-200,0,1500,2000);steamPuffs(t,560,1080,hq,1);g.restore()}}
      if(c1>0){const dd=clamp(depth/25);water(-200,1300,mix(DEEP[0],DEEP[0],0),mix(DEEP[1],[3,10,18],dd),-500,c1);snow(depth,c1)}
      if(c2>0){water(-200,1300,DEEP[0],[3,10,18],-500,c2);snow(depth,c2*.7)}
      // ch3: the lab tank: still water, a flat surface, glass walls
      if(c3>0){g.save();g.globalAlpha=c3;g.fillStyle='#0b1622';g.fillRect(-200,WT-300,1500,1400);g.restore();
        const sy=545;g.save();g.beginPath();g.rect(110,470,860,740);g.clip();water(-200,1300,[44,96,124],[8,24,40],sy,c3);
        const rip=1-prog(t,C.still-.4,C.still+.4);if(rip>0){g.globalAlpha=c3*rip;g.strokeStyle='rgba(220,248,255,.6)';g.lineWidth=3;g.beginPath();for(let x=110;x<=970;x+=10)g.lineTo(x,sy+6*rip*Math.sin(x*.03));g.stroke()}g.restore();
        g.save();g.globalAlpha=c3;g.strokeStyle='rgba(200,235,255,.55)';g.lineWidth=5;g.beginPath();g.moveTo(110,470);g.lineTo(110,1210);g.lineTo(970,1210);g.lineTo(970,470);g.stroke();
        g.strokeStyle=`rgba(160,255,200,${.35+.5*prog(t,C.still-.1,C.still+.3)})`;g.lineWidth=4;g.beginPath();g.moveTo(114,sy);g.lineTo(966,sy);g.stroke();
        g.strokeStyle='rgba(200,235,255,.5)';g.lineWidth=3;g.beginPath();g.moveTo(WX,470);g.lineTo(WX,WY-165*WS-10);g.stroke();g.restore()}
      // ch4: open water; the pressure line runs along the top
      if(c4>0){water(-200,1300,[30,74,100],[8,22,36],-500,c4);
        if(sp.jet>0){g.save();g.globalAlpha=c4*sp.jet;for(let k=0;k<9;k++){const y=wy4-90+k*22,x1=wx4-150*WS;const gj=g.createLinearGradient(-100,0,x1,0);gj.addColorStop(0,'rgba(220,245,255,0)');gj.addColorStop(1,'rgba(220,245,255,.8)');g.strokeStyle=gj;g.lineWidth=6;g.beginPath();g.moveTo(-100,y);g.lineTo(x1-10,y+(k-4)*3);g.stroke()}g.restore()}
        const dq=prog(t,C.dive-.15,C.dive+1.1);if(dq>0&&dq<1){for(let i=0;i<16;i++){const yy=wy4-140-dq*420-i*24,xx=wx4+lerp(-130,130,(i*37%16)/16);glowDot(xx,yy,3+(i%3),'#dff6ff',c4*(1-dq)*.7)}}
        const kq=prog(t,C.stroke-.25,C.stroke+.9);if(kq>0&&kq<1){g.save();g.globalAlpha=c4*Math.sin(Math.PI*kq)*.5;g.strokeStyle='#cfefff';g.lineWidth=10;g.lineCap='round';g.beginPath();g.arc(EL[0],EL[1],ARM,-Math.PI/2-.6,-Math.PI/2+.6);g.stroke();g.restore()}}
      if(c5>0){const h=prog(t,C.heat-.3,C.steam+.4);water(-200,1300,mix(DEEP[0],WARM[0],h),mix(DEEP[1],WARM[1],h),-500,c5);g.save();g.globalAlpha=c5;steamPuffs(t,-200,1300,h,1);g.restore()}
      if(c6>0){g.save();g.globalAlpha=c6*(1-fin*.6);g.save();g.beginPath();g.rect(-200,0,CX+200,2000);g.clip();const deck=g.createLinearGradient(0,WT,0,640);deck.addColorStop(0,'#2c4c5c');deck.addColorStop(1,'#4e7f92');g.fillStyle=deck;g.fillRect(-200,WT-300,CX+200,940-WT);
        water(-200,CX,POOL[0],POOL[1],640,1);poolTiles(-200,CX,640,1);g.restore();sauna(CX,t,1);g.fillStyle='#fff';g.shadowColor='#fff';g.shadowBlur=24;g.fillRect(CX-3,WT-200,6,1200);g.restore()}
      // ---- around the watch: the splash, bubbles, pressure
      if(c0>0&&spl>0&&spl<1){SPL.forEach(d=>{const q=spl,x=WX+d.x+Math.cos(d.an)*d.v*q,y=surf+Math.sin(d.an)*d.v*q+620*q*q;glowDot(x,y,d.r*.6,'#e8f8ff',c0*(1-q)*.9)});
        g.save();g.globalAlpha=c0*(1-spl);g.strokeStyle='#eaf8ff';g.lineWidth=6;g.beginPath();g.ellipse(WX,surf,170+300*eoc(spl),26+30*eoc(spl),0,0,7);g.stroke();g.restore()}
      if(c1>0){pressure(WX,WY,WS,clamp(.12+.5*prog(t,C.pushes-.2,C.ten+.4)+.13*dsq),c1)}
      if(c3>0)halo(WX,WY,WS,c3*prog(t,C.fifty-.2,C.fifty+.5),'rgba(120,230,190,.32)');
      if(c4>0){const s4=Math.max(sp.dive,sp.jet,sp.stroke,sp.spike);pressure(wx4,wy4,WS,.25+.75*s4,c4*(.3+.7*s4),s4>.2?'rgba(255,110,120,.95)':'rgba(150,215,255,.9)')}
      // ---- the subject
      if(c4>0)forearm(EL[0],EL[1],wx4,wy4,c4);
      const named=k=>bump(t,C[k]-.05,.9),inC2=c2>.01;
      // the gaskets: what each beat does to them
      const sqP=c1*clamp(.2*prog(t,C.pushes,C.ten+.3)+.27*dsq);   // squashed with depth
      const out=c2*win(t,C.seals+.05,C.rubber+1.1,.45,.6);        // lifted out on "seals", pressed back into the gaps on "rubber"
      const heatCol=k=>{const h=c5*prog(t,C.heat-.1,C.steam+.3),ag=c5*prog(t,C.age-.1,C.age+.5);return mix(mix(RUB,HOT,h),OLD,ag)};
      const sp4=Math.max(sp.dive,sp.jet,sp.stroke,sp.spike)*c4,tst=c3*prog(t,C.fifty-.2,C.fifty+.6);
      const gk={};['crown','button','glass','back'].forEach(k=>{const nk={crown:'crown',button:'buttons',glass:'seals',back:'back'}[k];
        gk[k]={sq:Math.max(sqP,.45*tst,sp4,c2*.3*prog(t,C.rubber+.6,C.rubber+1.1)),out,lit:c2*Math.max(prog(t,C[nk]+.1,C[nk]+.4)*(k==='glass'?1-prog(t,C.crown-.4,C.crown):1),0)+.3*c4,pop:inC2?named(nk)*c2:0,
          col:c5>.01?heatCol(k):c4>.01?mix(RUB,RED,clamp(sp4*1.4)):c3>.01?mix(RUB,GRN,tst):c0>.01&&k==='crown'?mix(RUB,HOT,prog(t,C.hot-.1,C.hot+.3)):null,
          warp:k==='crown'?c5*prog(t,C.soften-.1,C.soften+.7):0,crack:c5*prog(t,C.age-.1,C.age+.5)}});
      // the x-ray: a peek at the crown on "hot", half open on the first Squeeze, all open on "seals"; half in the lab and in real life; open in the heat
      const x5=c5*prog(t,C.steam-.35,C.steam+.25),peek=c0*win(t,C.hot-.15,st(1)-.2,.5,.5),xr=Math.max(peek,c1*.6*prog(t,C.sq0-.25,C.sq0+.2),c2,c3*.55,c4*.55,x5);
      const ir=c5>.5?[126,-38,440*eoc(prog(t,C.steam-.35,C.steam+.45))]:peek>0&&c0>.5?[126,-38,180*eoc(prog(t,C.hot-.15,C.hot+.4))]:c1>.5&&c1>c2?[0,0,420*eoc(prog(t,C.sq0-.25,C.sq0+.35))]:[0,0,420];
      const blk=k=>prog(t,C[k]+.05,C[k]+.5),arr=c2>.5?[['crown',prog(t,C.crown-.35,C.crown),blk('crown')],['button',prog(t,C.buttons-.35,C.buttons),blk('buttons')]]:[];
      const scr=gg=>{
        if(c0>.5){wordAt(t,'5 ATM','#8ef0ff',-14,64,1-peek);gg.font='700 22px Inter';gg.fillStyle='#a3a9cc';gg.globalAlpha*=(1-peek);gg.textAlign='center';gg.fillText('WATER RESIST',0,50)}
        else if(c1>.5){const n=Math.round(dep);wordAt(t,'DEPTH','#8ef0ff',-62,26,prog(t,C.pushes-.3,C.pushes));wordAt(t,n+' m','#8ef0ff',-12,72,prog(t,C.pushes-.3,C.pushes));
          wordAt(t,'+1 ATM','#ff8f9a',62,40,prog(t,C.atmosphere-.1,C.atmosphere+.2))}
        else if(c3>.5){const lv=eio(prog(t,st(3)-.1,C.fifty)),rp=1-prog(t,C.still-.3,C.still+.3),yl=140-262*lv;   // the screen fills like the tank: 50 m on "fifty", flat on "still"
          gg.save();gg.globalAlpha*=1-prog(t,C.ten3-.4,C.ten3);gg.fillStyle='rgba(40,140,170,.55)';gg.beginPath();gg.moveTo(-120,150);for(let x=-120;x<=120;x+=8)gg.lineTo(x,yl+7*rp*Math.sin(x*.05+lv*9));gg.lineTo(120,150);gg.closePath();gg.fill();gg.restore();
          wordAt(t,'50 m','#d8fff0',-104,28,prog(t,C.fifty-.1,C.fifty+.2)*(1-prog(t,C.ten3-.4,C.ten3)));
          const tq=prog(t,C.ten3-.1,en(3)+.1);wordAt(t,'5 ATM','#6ff0a4',-24,64,prog(t,C.five-.1,C.five+.2)*(1-prog(t,C.ten3-.3,C.ten3)));
          if(tq>0){gg.save();gg.strokeStyle='#6ff0a4';gg.lineWidth=16;gg.lineCap='round';gg.shadowColor='#4ee28a';gg.shadowBlur=14;gg.beginPath();gg.arc(0,-8,92,-Math.PI/2,-Math.PI/2+eio(tq)*Math.PI*2);gg.stroke();gg.restore();wordAt(t,'10 min','#d8fff0',-8,44,clamp(tq*8))}
          const ok=prog(t,C.samsung-.1,C.samsung+.3);if(ok>0)wordAt(t,'TESTED ✓','#6ff0a4',112,22,ok)}
        else if(c5>.5){const hq=eio(prog(t,C.heat-.1,C.steam));gg.save();gg.fillStyle='rgba(255,255,255,.1)';rrect(gg,-22,-110,44,190,22);gg.fill();const hg=gg.createLinearGradient(0,80,0,-110);hg.addColorStop(0,'#ffb35c');hg.addColorStop(1,'#ff4a2a');
          gg.fillStyle=hg;rrect(gg,-22,80-190*hq,44,190*hq,22);gg.fill();gg.beginPath();gg.arc(0,92,34,0,7);gg.fill();gg.restore();wordAt(t,'HEAT ▲','#ff8f6c',-128,24,prog(t,C.heat-.1,C.heat+.2))}
        else if(c4>.5){const over=sp4>.45;wordAt(t,over?'PAST TEST':'TEST OK',over?'#ff8f9a':'#6ff0a4',96,26,1)}};
      if(c6<1){const wa=1-c6;g.save();g.globalAlpha=wa;
        const wx=c4>.01?wx4:WX,wy=c0>.01?wyDrop:c4>.01?lerp(WY,wy4,clamp(c4*1.5)):WY,rot=c4>.01?ang:0;
        const flex=Math.max(c1*clamp(.25*prog(t,C.pushes,C.atmosphere+.4)+.25*dsq),c4*.8*Math.max(sp.dive,sp.jet,sp.stroke),c3*.2*tst);
        watch(wx,wy,{s:WS,rot,flex,xr,iris:ir,gk,arrows:arr,screen:scr,scrA:1-Math.max(.85*c2,x5),
          drop:c5*prog(t,C.soften+.25,C.soften+1.9),fog:c5*prog(t,C.soften+1.2,C.age+.2)});
        g.restore()}
      // ch0: bubbles rise off the watch, in front of it, after the splash
      if(c0>0){const bq=prog(t,1.0,3.7);if(bq>0&&bq<1)BUB.forEach(b=>{const q=bq*b.v*1.1-b.d*.5;if(q<0||q>1)return;const x=WX+b.x*95*WS,y=wyDrop+170*WS-q*720;ring(x,y,b.r*1.6,'#e8f8ff',c0*Math.sin(Math.PI*q)*.9,4);glowDot(x-b.r*.5,y-b.r*.5,b.r*.3,'#ffffff',c0*Math.sin(Math.PI*q)*.6)})}
      // ch6: the exploded view snaps together on "Pool"
      if(c6>0){const e=1-eob(prog(t,C.pool-.15,C.pool+.35)),gl=bump(t,C.pool+.1,.8);exploded(WX,WY+30,WS*.92,e,gl,c6)}
      if(fin>0){g.save();g.setTransform(1,0,0,1,0,0);g.fillStyle=`rgba(3,7,16,${.82*fin})`;g.fillRect(0,0,1080,1920);g.restore()}
      // ch4: the pressure line (in screen space over the world): the test line and the trace, spiking past it on dive, jet and stroke
      if(c4>0){g.save();g.setTransform(1,0,0,1,0,0);const x0=150,x1=930,y0=600,yl=540,run=prog(t,st(4)-.1,en(4));g.globalAlpha=c4;
        g.fillStyle='rgba(6,14,26,.72)';rrect(g,x0-40,474,x1-x0+80,146,24);g.fill();
        g.strokeStyle='#6ff0a4';g.lineWidth=4;g.beginPath();g.moveTo(x0,yl);g.lineTo(x1,yl);g.stroke();
        const T0=st(4)-.1,T1=en(4),val=tt=>.45+1.6*Math.max(bump(tt,C.dive-.15,.9),bump(tt,C.jet-.15,.8),bump(tt,C.stroke-.15,.8));
        const N=120;g.lineWidth=6;g.lineJoin='round';for(let i=1;i<=N*run;i++){const ta=lerp(T0,T1,(i-1)/N),tb=lerp(T0,T1,i/N),va=val(ta),vb=val(tb);
          g.strokeStyle=vb>1?'#ff5d6c':'#8ed8ff';g.beginPath();g.moveTo(lerp(x0,x1,(i-1)/N),y0-(va/1.6)*(y0-494));g.lineTo(lerp(x0,x1,i/N),y0-(vb/1.6)*(y0-494));g.stroke()}
        if(run>0&&run<1){const tn=lerp(T0,T1,run);glowDot(lerp(x0,x1,run),y0-(val(tn)/1.6)*(y0-494),7,val(tn)>1?'#ff5d6c':'#8ed8ff',1)}
        g.restore()}
    });
  },
  labels(t){
    const c0=1-prog(t,st(1)-.3,st(1)+.3),c1=win(t,st(1)-.35,st(2)+.3,.5,.5),c2=win(t,st(2)-.3,st(3)+.3,.5,.5),c3=win(t,st(3)-.3,st(4)+.3,.5,.5),c4=win(t,st(4)-.3,st(5)+.3,.5,.5),c5=win(t,st(5)-.3,st(6)+.3,.5,.5),c6=prog(t,st(6)-.2,st(6)+.3)*(1-prog(t,C.final-.3,C.final));
    if(c0>0){label(200,1150,'✓ POOL','#6ff0a4',c0*prog(t,1.5,1.8),28,'rgba(10,40,24,.92)');label(860,1150,'✕ HOT SHOWER','#ff8f9a',c0*prog(t,C.hot-.1,C.hot+.2),28,'rgba(44,10,18,.92)')}
    if(c1>0){label(190,1150,'10 m DOWN','#8ef0ff',c1*prog(t,C.ten-.1,C.ten+.2),26);label(890,1150,'+1 ATM','#ff8f9a',c1*prog(t,C.atmosphere-.1,C.atmosphere+.2),28,'rgba(44,10,18,.92)');
      label(540,540,'THE CASE FLEXES','#ff8f9a',c1*prog(t,C.sq0-.1,C.sq0+.2),24,'rgba(44,10,18,.92)')}
    if(c2>0){label(250,560,'RUBBER RINGS','#ffd29a',c2*prog(t,C.rubber-.1,C.rubber+.2)*(1-prog(t,C.crown-.45,C.crown-.15)),26,'rgba(44,26,8,.92)');
      label(860,600,'CROWN SEAL','#ffb35c',c2*prog(t,C.crown-.1,C.crown+.2)*(1-prog(t,C.buttons-.2,C.buttons)),26,'rgba(44,26,8,.92)');label(860,1120,'BUTTON SEAL','#ffb35c',c2*prog(t,C.buttons-.1,C.buttons+.2)*(1-prog(t,C.back-.2,C.back)),26,'rgba(44,26,8,.92)');
      label(540,1160,'CASE BACK SEAL','#ffb35c',c2*prog(t,C.back+.1,C.back+.4),26,'rgba(44,26,8,.92)')}
    if(c3>0){label(...W(240,1180),'STILL WATER','#8ef0ff',c3*prog(t,C.still-.1,C.still+.2),24);label(...W(860,1180),'50 m','#6ff0a4',c3*prog(t,C.fifty-.1,C.fifty+.2),28,'rgba(10,40,24,.92)');
      label(...W(545,1180),"SAMSUNG'S TEST",'#6ff0a4',c3*prog(t,C.samsung-.1,C.samsung+.2),24,'rgba(10,40,24,.92)')}
    if(c4>0){[['dive','✕ DIVE',740],['jet','✕ JET',840],['stroke','✕ STROKE',940]].forEach(([k,txt,y])=>label(...W(175,y),txt,'#ff8f9a',c4*prog(t,C[k]-.05,C[k]+.2),26,'rgba(44,10,18,.92)'));
      label(...W(790,520),'PAST THE TEST','#ff8f9a',c4*prog(t,C.spikes-.1,C.spikes+.2),24,'rgba(44,10,18,.92)')}
    if(c5>0){label(220,1150,'HOT WATER','#ff8f6c',c5*prog(t,C.heat-.1,C.heat+.2)*(1-prog(t,C.soften-.3,C.soften)),26,'rgba(44,18,8,.92)');label(860,1150,'STEAM','#ffd29a',c5*prog(t,C.steam-.1,C.steam+.2)*(1-prog(t,C.soften-.3,C.soften)),26,'rgba(44,26,8,.92)');
      label(330,560,'SEAL SOFTENS','#ff8f6c',c5*prog(t,C.soften+.1,C.soften+.4)*(1-prog(t,C.age-.3,C.age)),26,'rgba(44,18,8,.92)');label(330,1150,'A DROP GETS IN','#8ef0ff',c5*prog(t,C.soften+.8,C.soften+1.1)*(1-prog(t,C.age-.3,C.age)),26);
      label(540,1150,'SEALS AGE','#ff8f9a',c5*prog(t,C.age-.1,C.age+.2),26,'rgba(44,10,18,.92)')}
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
