// @techin20sec kit topic: Why does an iPhone shut down in the cold with charge left (techreel/topics/cold-shutdown.json). Specs decoded on the shared kit frame
// (techkit/base.html). One battery cell that stays at 30%; a thermometer drops (cold), the inner-resistance zigzag grows (impedance), the voltage bar sags under
// the MIN line (the phone shuts down on purpose), then warms back up and recovers. Facts: Apple Support "iPhone battery and performance" and apple.com/batteries
// (read 22 Nov 2026). The object changes on every beat (zigzag, voltage bar, fill, thermometer, current dots); no rolling digits; named words are 40 px+ pills.
(function(){
const COLC='#8ef0ff',COLA='#ffb35c',GRN='#6ff0a4',GLD='#ffd36b',LIL='#b9b6ff',PNK='#ff8f9a',SLT='#5a6290',ICE='#bfe9ff';
const BX=340,BY=630,BW=520,BH=160,ZY=935,ZX0=340,ZX1=860,GY=1075,GH=52,MINV=.40,TX=235,TT=650,TB=1130;
const RM=mulberry(5),SNOW=[...Array(36)].map(()=>({x:RM()*1000+40,y:RM(),r:2+RM()*3.5,v:.05+RM()*.06,ph:RM()*6}));
function txt(s,x,y,size,col,a=1,al='center',w=800){if(a<=0)return;g.globalAlpha=clamp(a);g.font=`${w} ${size}px "Inter Display",Inter`;g.textAlign=al;g.textBaseline='middle';g.fillStyle=col;g.fillText(s,x,y);g.globalAlpha=1}
// state curves from the spoken cues
const rec=t=>eio(prog(t,C.warms,C.warms+1.2));
const coldK=t=>eio(prog(t,C.cold0,C.cold0+1.1))*(1-rec(t));            // 0 warm room ... 1 cold
const impK=t=>eio(prog(t,C.imped-.25,C.imped+.55))*(1-rec(t));         // inner resistance grown
const sagK=t=>eio(prog(t,C.sags-.1,C.sags+.55))*(1-eio(prog(t,C.warms,C.warms+.9)));
const offK=t=>eio(prog(t,C.shuts-.1,C.shuts+.35))*(1-eio(prog(t,C.warms,C.warms+.5)));
function volt(t){const cf=coldK(t),vb=.82-.18*cf;return vb-(vb-.2)*sagK(t)+.012*Math.sin(t*9)}
function therm(t){const L=.64-.46*coldK(t);return L}
function zig(t,amp){const N=14,pts=[];for(let i=0;i<=N;i++){const x=lerp(ZX0,ZX1,i/N),y=ZY+(i===0||i===N?0:(i%2?-1:1)*amp);pts.push([x,y])}return pts}
function onPath(pts,u){const n=pts.length-1,f=u*n,i=Math.min(n-1,Math.floor(f)),k=f-i;return[lerp(pts[i][0],pts[i+1][0],k),lerp(pts[i][1],pts[i+1][1],k)]}
function thermometer(t){const L=therm(t),cf=coldK(t),ly=TB-L*(TB-TT-30);
  g.save();rrect(g,TX-32,TT,64,TB-TT,32);g.fillStyle='#10163a';g.fill();g.strokeStyle='rgba(185,182,255,.5)';g.lineWidth=5;g.stroke();g.restore();
  g.save();rrect(g,TX-32,TT,64,TB-TT,32);g.clip();const col=cf>.5?ICE:COLA;const gr=g.createLinearGradient(0,ly,0,TB);gr.addColorStop(0,col);gr.addColorStop(1,cf>.5?'#4aa8ff':'#ff8f5c');g.fillStyle=gr;g.fillRect(TX-32,ly,64,TB-ly+40);g.restore();
  g.save();g.beginPath();g.arc(TX,TB+22,40,0,7);g.fillStyle=cf>.5?'#4aa8ff':'#ff8f5c';g.shadowColor=cf>.5?ICE:COLA;g.shadowBlur=24;g.fill();g.restore();
  // comfort band (Apple: 0 to 35 degrees Celsius), drawn when it is said
  const cb=eio(prog(t,C.zero-.1,C.zero+.4)),y35=TB-.9*(TB-TT-30),y0=TB-.2*(TB-TT-30);
  if(cb>0){g.save();g.globalAlpha=cb;g.strokeStyle=GRN;g.lineWidth=8;g.lineCap='round';g.beginPath();g.moveTo(TX+54,lerp(y0,y35,0));g.lineTo(TX+54,lerp(y0,y35,eio(cb)));g.stroke();
   g.lineWidth=4;g.beginPath();g.moveTo(TX+40,y0);g.lineTo(TX+68,y0);g.moveTo(TX+40,y35);g.lineTo(TX+68,y35);g.stroke();g.restore();
   txt('0°',TX-96,y0,40,GRN,cb);txt('35°',TX-98,y35,40,GRN,cb*prog(t,C.celsius-.3,C.celsius))}
  const hh=eio(prog(t,C.heat-.1,C.heat+.4))*(1-eio(prog(t,C.cold2-.2,C.cold2+.2)));if(hh>0){g.save();g.globalAlpha=hh;g.fillStyle=PNK;g.shadowColor=PNK;g.shadowBlur=24;rrect(g,TX-32,TT,64,y35-TT,32);g.fill();g.restore()}}
function battery(t){const off=offK(t),cf=coldK(t),ps=1;
  g.save();g.shadowColor=off>.5?'rgba(0,0,0,.6)':'rgba(255,179,92,.35)';g.shadowBlur=34;rrect(g,BX,BY,BW,BH,36);g.fillStyle='#0d1332';g.fill();g.restore();
  const fw=(BW-26)*.30;g.save();rrect(g,BX+13,BY+13,fw,BH-26,24);g.fillStyle=off>.5?'#6a7298':COLA;g.shadowColor=COLA;g.shadowBlur=off>.5?0:28;g.fill();g.restore();
  g.save();g.strokeStyle=off>.5?PNK:(cf>.5?ICE:'#d9d7ff');g.lineWidth=7;rrect(g,BX,BY,BW,BH,36);g.stroke();rrect(g,BX+BW+4,BY+BH/2-34,26,68,10);g.fillStyle=g.strokeStyle;g.fill();g.restore();
  txt('30%',BX+BW*.52,BY+BH/2+4,112,'#ffffff',ps);
  // frost crystals along the cell while cold
  if(cf>.05){for(let i=0;i<10;i++){const x=BX+30+i*(BW-60)/9,h=14+10*Math.sin(i*2.1+1)*cf;g.save();g.globalAlpha=cf*.8;g.strokeStyle=ICE;g.lineWidth=3;g.lineCap='round';g.beginPath();g.moveTo(x,BY);g.lineTo(x,BY-h);g.moveTo(x-7,BY-h*.5);g.lineTo(x+7,BY-h*.5-6);g.stroke();g.restore()}}
  if(off>0){g.save();g.globalAlpha=off*.55;rrect(g,BX,BY,BW,BH,36);g.fillStyle='#05071a';g.fill();g.restore();
   // power icon on the dark cell
   g.save();g.globalAlpha=off;g.strokeStyle=PNK;g.lineWidth=9;g.lineCap='round';const px=BX+BW-62,py=BY+BH/2;g.beginPath();g.arc(px,py,30,-Math.PI*.35,Math.PI*1.35+Math.PI*.0,false);g.stroke();g.beginPath();g.moveTo(px,py-42);g.lineTo(px,py-8);g.stroke();g.restore()}}
function resistor(t){const imp=impK(t),cf=coldK(t),amp=12+34*Math.max(imp,.18*cf),pts=zig(t,amp),col=imp>.4?PNK:(cf>.4?ICE:COLC);
  g.save();g.strokeStyle=col;g.lineWidth=9;g.lineCap='round';g.lineJoin='round';g.shadowColor=col;g.shadowBlur=18*(.3+imp);g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke();g.restore();
  // the leads and current dots: they crowd and slow while the resistance is high
  g.save();g.strokeStyle='rgba(185,182,255,.45)';g.lineWidth=5;g.beginPath();g.moveTo(BX-40,ZY);g.lineTo(ZX0,ZY);g.moveTo(ZX1,ZY);g.lineTo(ZX1+40,ZY);g.stroke();g.restore();
  const sp=.22-.12*imp;for(let k=0;k<7;k++){const u=((t*sp+k/7)%1),p=onPath(pts,u);glowDot(p[0],p[1],5,imp>.4?PNK:COLC,.85)}}
function gauge(t){const v=volt(t),low=v<MINV,col=low?PNK:GRN,mx=BX+BW*MINV,ge=eio(prog(t,C.volt-.3,C.volt+.3)),gs=Math.max(ge,.55);
  g.save();g.globalAlpha=gs;rrect(g,BX,GY,BW,GH,26);g.fillStyle='#10163a';g.fill();g.strokeStyle='rgba(185,182,255,.4)';g.lineWidth=4;g.stroke();
  g.save();rrect(g,BX,GY,BW,GH,26);g.clip();const gr=g.createLinearGradient(BX,0,BX+BW,0);gr.addColorStop(0,col);gr.addColorStop(1,low?'#ff5c78':'#b6ffd6');g.fillStyle=gr;g.shadowColor=col;g.shadowBlur=22;g.fillRect(BX,GY,BW*v,GH);g.restore();
  g.setLineDash([9,8]);g.strokeStyle=GLD;g.lineWidth=5;g.beginPath();g.moveTo(mx,GY-22);g.lineTo(mx,GY+GH+22);g.stroke();g.setLineDash([]);g.restore();
  txt('MIN',mx,GY+GH+42,32,GLD,gs,'center',800);txt('VOLTAGE',BX+8,GY-34,30,'#aab0d8',gs*(1-win(t,C.volt-.1,TL.scenes[3].start-.15,.2,.2)),'left',700)}
function stampT(x,y,word,col,a,rot){if(a<=0)return;const sc=1+.3*(1-eob(clamp(a)));g.save();g.globalAlpha=clamp(a);g.translate(x,y);g.rotate(rot);g.scale(sc,sc);g.font='900 52px "Inter Display",Inter';
  const w=g.measureText(word).width+50;g.strokeStyle=col;g.lineWidth=7;rrect(g,-w/2,-44,w,88,14);g.stroke();g.fillStyle=col;g.textAlign='center';g.textBaseline='middle';g.fillText(word,0,4);g.restore();
  if(a>.3){const r=w/2+16;BOXES.push([word,x-r,x+r,y-60,y+60])}}

window.TOPIC={
  title:'Phone dies in the <em>cold?</em>',eyebrow:'PHONES · SPECS DECODED',final:"Cold pauses<br>it. <em>Warm</em> it.",
  vars:{'--bg1':'#0f2a4a','--bg2':'#070c1e','--blob1':'#2a8cff','--blob2':'#8ef0ff','--blob3':'#ffb35c','--tgrad':'linear-gradient(100deg,#8ef0ff,#bfe9ff 50%,#ffd36b)'},
  chips:[['THE QUESTION','#8ef0ff'],['THE CAUSE','#ffb35c'],['THE SAG','#ff8f9a'],['THE SHUTDOWN','#ff8f9a'],['THE RECOVERY','#6ff0a4'],['WHAT APPLE SAYS','#ffd36b'],['RECAP','#8ef0ff']],
  keyw:/^(thirty|cold|impedance|resistance|voltage|sags|power|minimum|shuts|purpose|temporary|warms|normal|zero|celsius|heat|good|warm|low|old)$/i,
  jolts:[],
  cover:true,
  holds:()=>[[+(C.final+.8).toFixed(2),TL.total]],
  css:'.step .s{font-size:30px;letter-spacing:0}.step .n{font-size:18px}',
  html:`
  <div class="panel" id="p0"><div style="position:absolute;left:36px;top:26px" class="lab">THE QUESTION</div>
    <div class="big" style="position:absolute;left:36px;top:54px;font-size:46px;color:#8ef0ff">30% LEFT. PHONE OFF?</div></div>
  <div class="panel" id="p1" style="background:none;border:none;box-shadow:none;overflow:visible"><div class="steps" id="p1s">
    <div class="step"><div class="n">RAISES IT</div><div class="s">LOW CHARGE</div></div><div class="arrow">+</div>
    <div class="step"><div class="n">RAISES IT</div><div class="s">COLD</div></div><div class="arrow">+</div>
    <div class="step"><div class="n">RAISES IT</div><div class="s">OLD CELL</div></div></div></div>
  <div class="panel" id="p2" style="background:none;border:none;box-shadow:none;overflow:visible"><div class="steps" id="p2s">
    <div class="step"><div class="n">POWER DEMAND</div><div class="s">VOLTAGE SAGS</div></div><div class="arrow">›</div>
    <div class="step"><div class="n">CHIPS NEED</div><div class="s">A MINIMUM</div></div></div></div>
  <div class="panel" id="p3" style="background:none;border:none;box-shadow:none;overflow:visible"><div class="steps" id="p3s">
    <div class="step"><div class="n">THE PHONE</div><div class="s">SHUTS OFF</div></div><div class="arrow">›</div>
    <div class="step"><div class="n">TO PROTECT</div><div class="s">ITS PARTS</div></div><div class="arrow">›</div>
    <div class="step"><div class="n">CHARGE</div><div class="s">STILL LEFT</div></div></div></div>
  <div class="panel" id="p4" style="background:none;border:none;box-shadow:none;overflow:visible"><div class="steps" id="p4s">
    <div class="step"><div class="n">THE COLD IS</div><div class="s">TEMPORARY</div></div><div class="arrow">›</div>
    <div class="step"><div class="n">BATTERY</div><div class="s">WARMS UP</div></div><div class="arrow">›</div>
    <div class="step"><div class="n">PERFORMANCE</div><div class="s">NORMAL</div></div></div></div>
  <div class="panel" id="p5"><div style="position:absolute;left:36px;top:26px" class="lab">APPLE SAYS BEST AT</div>
    <div class="big" style="position:absolute;left:36px;top:54px;font-size:46px;color:#6ff0a4" id="p5a">0 TO 35 °C</div>
    <div class="big" style="position:absolute;right:36px;top:54px;font-size:46px;color:#ff8f9a" id="p5b">HEAT: FOR GOOD</div></div>
  <div class="pill" id="pl1" style="top:1060px;border-color:rgba(191,233,255,.6)"><div class="ic" style="background:rgba(191,233,255,.18);color:#bfe9ff">C</div>Cold: pauses it</div>
  <div class="pill" id="pl2" style="top:1170px;border-color:rgba(255,179,92,.6)"><div class="ic" style="background:rgba(255,179,92,.18);color:#ffd9a8">W</div>Warm it back up</div>`,
  cam(){const Z=[[1.0,-30,0],[1.07,20,-40],[1.05,10,-110],[1.08,0,-20],[1.02,-20,-10],[1.07,40,10],[1.02,0,-14]],k=[[0,[1,0,0]]];
    for(let i=1;i<NS;i++)k.push([st(i)+.2,Z[i-1],i%2?'io':'expo']);k.push([st(NS-1)+.2,Z[NS-2]],[st(NS-1)+.9,[.88,0,-100],'expo']);return k},
  hero(t,{fin}){
    const cf=coldK(t);
    for(const m of SNOW){const y=620+((m.y+t*m.v)%1)*560;glowDot(m.x+14*Math.sin(t*.7+m.ph),y,m.r,'#cfeaff',.12+.5*cf)}
    subj(150,620,900,1195);
    thermometer(t);battery(t);resistor(t);gauge(t);
    if(fin>0){g.globalAlpha=fin*.78;g.fillStyle='#0b0820';g.fillRect(-400,0,1900,1900);g.globalAlpha=1}
    if(fin>0){for(let i=0;i<5;i++){const an=t*(.9+i*.17)+i*1.3,x=CX+Math.cos(an)*(300+40*i),y=820+Math.sin(an)*(170+20*i);glowDot(x,y,10+4*(i%2),['#8ef0ff','#6ff0a4','#ffd36b','#ff8f9a','#b9b6ff'][i],fin*.8)}}
  },
  labels(t){
    const q=(a,b,fi=.3,fo=.3)=>win(t,a,b,fi,fo);
    const c0=q(C.cold0-.1,C.cold0+1.5);if(c0>0)label(TX,TT-18,'COLD',ICE,c0*prog(t,C.cold0-.05,C.cold0+.25),44,'rgba(8,32,44,.94)');
    const im=q(C.imped-.15,C.resist+.9);if(im>0)label(600,842,'IMPEDANCE',PNK,im*prog(t,C.imped-.1,C.imped+.25),44,'rgba(44,12,22,.94)');
    const vo=q(C.volt-.1,C.minimum-.1);if(vo>0)label(600,1020,'VOLTAGE SAGS',COLA,vo*prog(t,C.volt-.05,C.volt+.25),40,'rgba(44,24,8,.94)');
    const mn=q(C.minimum-.1,st(3)-.15);if(mn>0)label(600,1020,'BELOW MINIMUM',PNK,mn*prog(t,C.minimum-.05,C.minimum+.25),40,'rgba(44,12,22,.94)');
    const sh=q(C.shuts-.15,C.left+.9);if(sh>0)label(600,842,'SHUTS DOWN',PNK,sh*prog(t,C.shuts-.1,C.shuts+.25),44,'rgba(44,12,22,.94)');
    const wm=q(C.warms-.15,C.normal+.8);if(wm>0)label(600,842,'WARMS UP',GRN,wm*prog(t,C.warms-.1,C.warms+.25),44,'rgba(8,36,26,.94)');
    const ce=q(C.celsius-.2,C.heat-.1);if(ce>0)label(600,842,'0 – 35 °C BEST',GRN,ce*prog(t,C.celsius-.15,C.celsius+.2),44,'rgba(8,36,26,.94)');
    const he=q(C.heat-.15,st(6)-.1);if(he>0)label(600,842,'HEAT HARMS FOR GOOD',PNK,he*prog(t,C.heat-.1,C.heat+.25),38,'rgba(44,12,22,.94)');
  },
  panels(t){
    if(panel('#p0',0,st(1)-.15)>0){}
    if(panel('#p1',st(1)-.1,st(2)-.1)>0){stepFlow('#p1s',[C.low,C.cold1,C.old],[COLC,ICE,LIL])}
    if(panel('#p2',st(2)-.1,st(3)-.1)>0){stepFlow('#p2s',[C.sags,C.minimum],[COLA,PNK])}
    if(panel('#p3',st(3)-.1,st(4)-.1)>0){stepFlow('#p3s',[C.shuts,C.parts,C.left],[PNK,LIL,COLA])}
    if(panel('#p4',st(4)-.1,st(5)-.1)>0){stepFlow('#p4s',[C.temp,C.warms,C.normal],[ICE,COLA,GRN])}
    if(panel('#p5',st(5)+.1,en(5)+.45)>0){$('#p5a').style.opacity=prog(t,C.zero-.1,C.zero+.25);$('#p5b').style.opacity=prog(t,C.heat-.1,C.heat+.25)}
    pills(['cold2','warm2']);
  }
};
})();
