// @techin20sec kit topic: Does the Control Center Wi-Fi button really turn Wi-Fi off? (techreel/topics/wifi-button.json). Gadget myths on the shared
// kit frame (techkit/base.html). Two toggle tiles (Wi-Fi, Bluetooth) drawn generically; the Wi-Fi tile is tapped and LOOKS off, but a green radio LED
// stays lit and four things keep running off the radio (AirDrop, AirPlay, Apple Watch, Location Services: Apple Support, read 21 Nov 2026); it
// stays paused until one of four things happens; Settings turns it fully off (the LED and every badge go dark); Bluetooth does the same trick;
// Apple itself says keep both on. The object opens up: the tile's state, the LED, the rail and the badges change on every beat. No rolling digits.
(function(){
const COLC='#8ef0ff',COLA='#ffb35c',GRN='#6ff0a4',GLD='#ffd36b',LIL='#b9b6ff',PNK='#ff8f9a',SLT='#5a6290';
const TW=310,TY=600,WX=175,BX=595;                  // the two tiles: left x, top y, size (world)
const WC=[WX+TW/2,TY+TW/2],BC=[BX+TW/2,TY+TW/2];    // their centres
const RAIL=1042,BY=1122,BXS=[255,435,615,795],ACC=['AIRDROP','AIRPLAY','WATCH','LOCATION'];
const RM=mulberry(11),MOTES=[...Array(30)].map(()=>({x:RM()*1040+20,y:RM(),r:3+RM()*5,v:.04+RM()*.05,ph:RM()*6}));
function txt(s,x,y,size,col,a=1,al='center',w=800){if(a<=0)return;g.globalAlpha=clamp(a);g.font=`${w} ${size}px "Inter Display",Inter`;g.textAlign=al;g.textBaseline='middle';g.fillStyle=col;g.fillText(s,x,y);g.globalAlpha=1}
// state curves (each a function of t from the spoken cues): link = connected to a network, radio = the chip's radio is on
function linkW(t){return Math.max(1-eio(prog(t,C.tap,C.tap+.35)),eio(prog(t,C.keep,C.keep+.4)))}
function radioW(t){return Math.min(1,Math.max(1-eio(prog(t,C.offw,C.offw+.4)),eio(prog(t,C.keep,C.keep+.4))))}
function linkB(t){return Math.max(1-eio(prog(t,C.bluet,C.bluet+.35)),eio(prog(t,C.keep,C.keep+.4)))}
function accLit(i,t){const c=[C.airdrop,C.airplay,C.watch,C.loc][i],on=eio(prog(t,c-.05,c+.3)),off=1-eio(prog(t,C.offw+.12*i,C.offw+.45+.12*i)),back=eio(prog(t,C.keep+.08*i,C.keep+.4+.08*i));return Math.max(on*off,back)}
function wifi(cx,cy,s,col,a,ph){g.save();g.globalAlpha=clamp(a);g.strokeStyle=col;g.fillStyle=col;g.lineWidth=s*.17;g.lineCap='round';const ax=cx,ay=cy+s*.5;
  for(let i=0;i<3;i++){const r=s*(.38+.31*i);g.globalAlpha=clamp(a)*(ph==null?1:.45+.55*Math.max(0,Math.sin(ph*5-i*1.1)));g.beginPath();g.arc(ax,ay,r,-Math.PI*.76,-Math.PI*.24);g.stroke()}g.beginPath();g.arc(ax,ay,s*.1,0,7);g.fill();g.restore()}
function btIcon(cx,cy,s,col,a){g.save();g.globalAlpha=clamp(a);g.strokeStyle=col;g.lineWidth=s*.14;g.lineCap='round';g.lineJoin='round';const k=s*.5,P=[[-.5,-.5],[.5,.5],[0,1],[0,-1],[.5,-.5],[-.5,.5]];
  g.beginPath();P.forEach((p,i)=>i?g.lineTo(cx+p[0]*k*1.0,cy+p[1]*k*1.0):g.moveTo(cx+p[0]*k,cy+p[1]*k));g.stroke();g.restore()}
function slash(cx,cy,s,col,a,k){if(a<=0||k<=0)return;g.save();g.globalAlpha=clamp(a);g.strokeStyle=col;g.lineWidth=s*.16;g.lineCap='round';const x0=cx-s*.62,y0=cy-s*.6,x1=cx+s*.62,y1=cy+s*.6;
  g.beginPath();g.moveTo(x0,y0);g.lineTo(lerp(x0,x1,k),lerp(y0,y1,k));g.stroke();g.restore()}
// one toggle tile: link (cyan, bright) -> disconnected (amber border, grey icon, slash, green LED still lit) -> off (dark, pink slash, dim LED)
function tile(x,y,kind,link,radio,t){const cx=x+TW/2,cy=y+TW/2,dim=1-link,bor=link>.5?COLC:(radio>.5?COLA:SLT);
  g.save();g.shadowColor=link>.5?'rgba(142,240,255,.45)':'rgba(0,0,0,.5)';g.shadowBlur=36;g.shadowOffsetY=10;rrect(g,x,y,TW,TW,58);g.fillStyle='#10163a';g.fill();g.restore();
  if(link>0){const gr=g.createRadialGradient(cx,cy-20,10,cx,cy,TW*.62);gr.addColorStop(0,`rgba(142,240,255,${.30*link})`);gr.addColorStop(1,'rgba(142,240,255,0)');rrect(g,x,y,TW,TW,58);g.fillStyle=gr;g.fill()}
  g.save();g.globalAlpha=.95;g.strokeStyle=bor;g.lineWidth=5;rrect(g,x,y,TW,TW,58);g.stroke();g.restore();
  const col=link>.5?COLC:(radio>.5?'#8a90b8':'#4a5078');
  if(kind==='w')wifi(cx,cy-6,96,col,1,link>.5?t:null);else btIcon(cx,cy,100,col,.7+.3*(link>.5?Math.sin(t*5):1));
  const off=radio<.5&&dim>.5;slash(cx,cy-4,96,off?PNK:COLA,1,eio(prog(dim,.15,.9)));
  // the radio LED (top right of the tile): green while the radio is on, dark when it is not
  glowDot(x+TW-46,y+46,9+3*Math.sin(t*4),GRN,radio*.95);g.save();g.globalAlpha=.9;g.strokeStyle=radio>.5?GRN:SLT;g.lineWidth=3;g.beginPath();g.arc(x+TW-46,y+46,15,0,7);g.stroke();g.restore()}
// the four badges on the radio: AirDrop, AirPlay, Apple Watch, Location (generic glyphs, no logos)
function badge(i,lit,t){const x=BXS[i],y=BY,col=[COLC,LIL,GLD,GRN][i];g.save();g.shadowColor=col;g.shadowBlur=26*lit;rrect(g,x-64,y-64,128,128,64);g.fillStyle=lit>.5?'#17204a':'#0e1432';g.fill();g.restore();
  g.save();g.strokeStyle=lit>.2?col:SLT;g.lineWidth=5;g.globalAlpha=.4+.6*lit;g.beginPath();g.arc(x,y,64,0,7);g.stroke();g.restore();
  g.save();g.globalAlpha=.4+.6*lit;g.strokeStyle=lit>.2?col:'#6a7298';g.fillStyle=lit>.2?col:'#6a7298';g.lineWidth=6;g.lineCap='round';g.lineJoin='round';
  if(i===0){for(let k=0;k<3;k++){g.beginPath();g.arc(x,y+4,14+k*13,Math.PI*.62,Math.PI*2.38);g.stroke()}g.beginPath();g.arc(x,y+4,5,0,7);g.fill()}
  else if(i===1){rrect(g,x-30,y-30,60,40,8);g.stroke();g.beginPath();g.moveTo(x-16,y+30);g.lineTo(x+16,y+30);g.lineTo(x,y+10);g.closePath();g.fill()}
  else if(i===2){rrect(g,x-18,y-20,36,44,10);g.stroke();g.beginPath();g.moveTo(x-10,y-20);g.lineTo(x-8,y-34);g.moveTo(x+10,y-20);g.lineTo(x+8,y-34);g.moveTo(x-10,y+24);g.lineTo(x-8,y+38);g.moveTo(x+10,y+24);g.lineTo(x+8,y+38);g.stroke()}
  else{g.beginPath();g.arc(x,y-8,18,0,7);g.stroke();g.beginPath();g.moveTo(x-14,y+4);g.lineTo(x,y+36);g.lineTo(x+14,y+4);g.stroke();g.beginPath();g.arc(x,y-8,6,0,7);g.fill()}
  g.restore();
  if(lit>.5){const q=(t*.7+i*.25)%1;ring(x,y,64+40*q,col,(1-q)*.55*lit,4)}
  txt(ACC[i],x,y+100,28,lit>.2?col:'#8089ad',.6+.4*lit,'center',800)}
// the rail from the Wi-Fi tile's status down to the badges, with pulses flowing while the radio feeds them
function rail(t,rw){const x0=WC[0],xs=BXS;g.save();g.lineCap='round';g.lineJoin='round';g.strokeStyle='rgba(142,150,200,.35)';g.lineWidth=6;
  g.beginPath();g.moveTo(x0,TY+TW+120);g.lineTo(x0,RAIL);g.moveTo(xs[0],RAIL);g.lineTo(xs[3],RAIL);xs.forEach(x=>{g.moveTo(x,RAIL);g.lineTo(x,BY-66)});g.stroke();g.restore();
  if(rw>.05){const pts=[];xs.forEach((x,i)=>{const lit=Math.max(accLit(i,t),.45*rw);if(lit<.1)return;for(let k=0;k<3;k++){const u=((t*.5+k/3+i*.13)%1);const px=u<.35?lerp(x0,x,eoc(u/.35)):x,py=u<.35?RAIL:lerp(RAIL,BY-66,(u-.35)/.65);glowDot(px,py,5,GRN,lit*rw*.9*(1-Math.abs(u-.5)))}})}}
function stamp(x,y,word,col,a,rot){if(a<=0)return;const sc=1+.35*(1-eob(clamp(a)));g.save();g.globalAlpha=clamp(a);g.translate(x,y);g.rotate(rot);g.scale(sc,sc);g.font='900 52px "Inter Display",Inter';
  const w=g.measureText(word).width+50;g.strokeStyle=col;g.lineWidth=7;rrect(g,-w/2,-44,w,88,14);g.stroke();g.fillStyle=col;g.textAlign='center';g.textBaseline='middle';g.fillText(word,0,4);g.restore();
  if(a>.3){const r=w/2+16;BOXES.push([word,x-r,x+r,y-60,y+60])}}

window.TOPIC={
  title:'Wi-Fi button <em>off?</em>',eyebrow:'PHONES · GADGET MYTHS',final:"Disconnect,<br>not <em>off.</em>",
  vars:{'--bg1':'#0f2a4a','--bg2':'#070c1e','--blob1':'#2a8cff','--blob2':'#22d3a0','--blob3':'#ffb35c','--tgrad':'linear-gradient(100deg,#8ef0ff,#6ff0a4 50%,#ffd36b)'},
  chips:[['THE MYTH','#8ef0ff'],['WHAT APPLE SAYS','#ffb35c'],['THE RADIO','#6ff0a4'],['THE RESET','#ffd36b'],['REALLY OFF','#b9b6ff'],['THE CATCH','#ff8f9a'],['RECAP','#8ef0ff']],
  keyw:/^(control|button|wifi|tap|assume|only|disconnects|radio|airdrop|airplay|watch|location|paused|turn|place|five|restart|fully|settings|bluetooth|same|catch|keep|best|off)$/i,
  jolts:[],
  cover:true,   // frame 0 is the reel's cover (rules-tech.md K3)
  holds:()=>[[+(C.final+.8).toFixed(2),TL.total]],
  css:'.step .s{font-size:30px;letter-spacing:0}.step .n{font-size:18px}',
  html:`
  <div class="panel" id="p0"><div style="position:absolute;left:36px;top:26px" class="lab">THE QUESTION</div>
    <div class="big" style="position:absolute;left:36px;top:54px;font-size:46px;color:#8ef0ff">WI-FI BUTTON: OFF?</div></div>
  <div class="panel" id="p1"><div style="position:absolute;left:36px;top:26px" class="lab">APPLE SUPPORT SAYS</div>
    <div class="big" style="position:absolute;left:36px;top:54px;font-size:46px;color:#ffb35c" id="p1a">IT ONLY DISCONNECTS</div></div>
  <div class="panel" id="p2" style="background:none;border:none;box-shadow:none;overflow:visible"><div class="steps" id="p2s">
    <div class="step"><div class="n">KEEPS WORKING</div><div class="s">AIRDROP</div></div><div class="arrow">·</div>
    <div class="step"><div class="n">KEEPS WORKING</div><div class="s">AIRPLAY</div></div><div class="arrow">·</div>
    <div class="step"><div class="n">KEEPS WORKING</div><div class="s">WATCH</div></div><div class="arrow">·</div>
    <div class="step"><div class="n">KEEPS WORKING</div><div class="s">LOCATION</div></div></div></div>
  <div class="panel" id="p3" style="background:none;border:none;box-shadow:none;overflow:visible"><div class="steps" id="p3s">
    <div class="step"><div class="n">YOU</div><div class="s">TURN ON</div></div><div class="arrow">/</div>
    <div class="step"><div class="n">YOU</div><div class="s">MOVE</div></div><div class="arrow">/</div>
    <div class="step"><div class="n">THE CLOCK</div><div class="s">5 A.M.</div></div><div class="arrow">/</div>
    <div class="step"><div class="n">YOU</div><div class="s">RESTART</div></div></div></div>
  <div class="panel" id="p4" style="background:none;border:none;box-shadow:none;overflow:visible"><div class="steps" id="p4s">
    <div class="step"><div class="n">OPEN</div><div class="s">SETTINGS</div></div><div class="arrow">›</div>
    <div class="step"><div class="n">TAP</div><div class="s">WI-FI</div></div><div class="arrow">›</div>
    <div class="step"><div class="n">TURN IT</div><div class="s">OFF</div></div></div></div>
  <div class="panel" id="p5"><div style="position:absolute;left:36px;top:26px" class="lab">APPLE SUPPORT</div>
    <div class="big" style="position:absolute;left:36px;top:54px;font-size:46px;color:#ff8f9a" id="p5a">KEEP BOTH ON</div></div>
  <div class="pill" id="pl1" style="top:1060px;border-color:rgba(255,179,92,.6)"><div class="ic" style="background:rgba(255,179,92,.18);color:#ffd9a8">C</div>Control Center: disconnects</div>
  <div class="pill" id="pl2" style="top:1170px;border-color:rgba(185,182,255,.6)"><div class="ic" style="background:rgba(185,182,255,.18);color:#d9d7ff">S</div>Settings: turns it off</div>`,
  cam(){const Z=[[1.0,-30,0],[1.08,26,-50],[1.01,-24,-90],[1.09,30,-30],[1.01,-30,0],[1.09,22,-40],[1.02,0,-14]],k=[[0,[1,0,0]]];
    for(let i=1;i<NS;i++)k.push([st(i)+.2,Z[i-1],i%2?'io':'expo']);k.push([st(NS-1)+.2,Z[NS-2]],[st(NS-1)+.9,[.88,0,-100],'expo']);return k},
  hero(t,{fin}){
    const lw=linkW(t),rw=radioW(t),lb=linkB(t);
    for(const m of MOTES){const y=1230-((m.y+t*m.v)%1)*780;glowDot(m.x+10*Math.sin(t*.4+m.ph),y,m.r,'#8ef0ff',.22)}
    subj(165,585,915,1195);
    // ---- the two tiles; the touch ring presses the Wi-Fi tile on "tap" and the Bluetooth tile on "bluetooth" ----
    tile(WX,TY,'w',lw,rw,t);tile(BX,TY,'b',lb,1,t);
    ping(WC[0],WC[1],t,C.tap-.1,COLA,150);ping(BC[0],BC[1],t,C.bluet-.1,COLA,150);
    const press=(c,t0)=>{const k=eio(prog(t,t0-.35,t0-.1))*(1-eio(prog(t,t0+.05,t0+.3)));if(k>0){g.save();g.globalAlpha=k*.9;g.strokeStyle='#ffffff';g.lineWidth=4;g.beginPath();g.arc(c[0],c[1]+110,34-8*k,0,7);g.stroke();g.globalAlpha=k*.25;g.fillStyle='#ffffff';g.fill();g.restore()}};
    press(WC,C.tap);press(BC,C.bluet);
    // ---- status text under each tile ----
    const stW=lw>.5?['CONNECTED',COLC,'HOME NETWORK',COLC]:(rw>.5?['DISCONNECTED',COLA,'RADIO STILL ON',GRN]:['OFF',PNK,'RADIO OFF',PNK]);
    txt(stW[0],WC[0],TY+TW+46,32,stW[1],1);txt(stW[2],WC[0],TY+TW+88,26,stW[3],.95,'center',700);
    const stB=lb>.5?['CONNECTED',COLC,'YOUR EARBUDS',COLC]:['DISCONNECTED',COLA,'RADIO STILL ON',GRN];
    txt(stB[0],BC[0],TY+TW+46,32,stB[1],1);txt(stB[2],BC[0],TY+TW+88,26,stB[3],.95,'center',700);
    // ---- the rail and the four badges ----
    rail(t,rw);for(let i=0;i<4;i++)badge(i,accLit(i,t),t);
    // an X over each badge the moment Settings really turns the radio off
    for(let i=0;i<4;i++){const k=prog(t,C.offw+.12*i,C.offw+.4+.12*i)*(1-prog(t,C.keep+.08*i,C.keep+.3+.08*i));if(k>0){g.save();g.globalAlpha=k*.9;g.strokeStyle=PNK;g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(BXS[i]-26,BY-26);g.lineTo(BXS[i]+26,BY+26);g.moveTo(BXS[i]+26,BY-26);g.lineTo(BXS[i]-26,BY+26);g.stroke();g.restore()}}
    // the keep-it-on check: both LEDs ring green on "keep"
    const kp=win(t,C.keep-.1,en(5)+.1,.3,.4);if(kp>0){g.save();g.globalAlpha=kp;g.strokeStyle=GRN;g.lineWidth=6;g.shadowColor=GRN;g.shadowBlur=26;rrect(g,WX-8,TY-8,TW+16,TW+16,64);g.stroke();rrect(g,BX-8,TY-8,TW+16,TW+16,64);g.stroke();g.restore()}
    if(fin>0){g.globalAlpha=fin*.78;g.fillStyle='#0b0820';g.fillRect(-400,0,1900,1900);g.globalAlpha=1}
    if(fin>0){for(let i=0;i<5;i++){const an=t*(.9+i*.17)+i*1.3,x=CX+Math.cos(an)*(300+40*i),y=820+Math.sin(an)*(170+20*i);glowDot(x,y,10+4*(i%2),['#8ef0ff','#6ff0a4','#ffd36b','#ff8f9a','#b9b6ff'][i],fin*.8)}}
  },
  labels(t){
    // the MYTH? stamp is the cover's first thing (frame 0), gone on the second line; it returns as MYTH on the verdict (rules-tech.md F5)
    const m0=win(t,0,st(1)-.1,.01,.35);if(m0>0)stamp(540,540,'MYTH?',GLD,m0,-.05);
    const c1=win(t,C.tap-.1,st(2)-.2,.4,.4);if(c1>0)label(WC[0],TY-26,'LOOKS OFF',COLA,c1*prog(t,C.tap,C.tap+.3),28,'rgba(44,24,8,.92)');
    const c4=win(t,C.setg-.15,C.offw+.7,.3,.3);if(c4>0)label(WC[0],TY-26,'SETTINGS',LIL,c4*prog(t,C.setg-.1,C.setg+.2),32,'rgba(24,22,56,.92)');
    const c5=win(t,C.bluet-.15,C.same-.05,.3,.3);if(c5>0)label(BC[0],TY-26,'BLUETOOTH',COLC,c5*prog(t,C.bluet-.1,C.bluet+.2),32,'rgba(8,32,44,.92)');
    const c2=win(t,C.same-.1,st(5)-.1,.3,.4);if(c2>0)label(BC[0],TY-26,'SAME TRICK',COLA,c2*prog(t,C.same-.05,C.same+.25),28,'rgba(44,24,8,.92)');
    const c3=win(t,C.catch-.1,st(6)-.1,.4,.4);if(c3>0)label(540,TY-26,'APPLE: KEEP BOTH ON',GRN,c3*prog(t,C.keep-.2,C.keep+.25),28,'rgba(8,36,26,.92)');
    const v=win(t,st(6)+.2,C.final-.3,.3,.3);if(v>0)stamp(540,540,'MYTH',PNK,v*prog(t,st(6)+.2,st(6)+.6),-.05);
  },
  panels(t){
    if(panel('#p0',0,st(1)-.15)>0){}
    if(panel('#p1',st(1)-.1,st(2)-.15)>0){$('#p1a').style.opacity=prog(t,C.only-.1,C.only+.25)}
    if(panel('#p2',st(2)-.1,st(3)-.1)>0){stepFlow('#p2s',[C.airdrop,C.airplay,C.watch,C.loc],[COLC,LIL,GLD,GRN])}
    if(panel('#p3',st(3)-.1,st(4)-.1)>0){stepFlow('#p3s',[C.turn,C.newp,C.five,C.restart],[COLC,LIL,GLD,PNK])}
    if(panel('#p4',st(4)-.1,st(5)-.1)>0){stepFlow('#p4s',[C.setg,C.tap4,C.offw],[COLC,LIL,PNK])}
    if(panel('#p5',st(5)+.1,en(5)+.45)>0){$('#p5a').style.opacity=prog(t,C.keep-.1,C.keep+.25)}
    pills(['ctrl2','set2']);
  }
};
})();
