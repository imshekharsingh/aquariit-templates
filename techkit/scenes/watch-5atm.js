// @techin20sec kit topic: What does 5 ATM on your watch mean? (techreel/topics/watch-5atm.json). Drawn on the shared kit frame
// (techkit/base.html): hero(t) in world space under the camera, labels(t) in screen space, panels(t) for the DOM. Every beat on a cue word.
(function(){
const R=mulberry(11);
const BUB=[...Array(60)].map(()=>({x:PX+30+R()*(PW-60),s:2+R()*5,v:40+R()*90,ph:R()*10}));
const DROPS=[...Array(70)].map(()=>({x:CX+R()*360,ph:R(),v:.6+R()*.8}));
const STEAM=[...Array(26)].map(()=>({x:PX+R()*PW,ph:R(),r:40+R()*70}));
const HITS=[...Array(40)].map(()=>({an:R()*Math.PI*2,ph:R(),d:.5+R()*.4}));
// water inside the hero box: level y (world), warm 0..1, calm 0..1
function water(t,level,warm,calm,a=1){if(a<=0)return;g.save();rrect(g,PX,PY,PW,PH,26);g.clip();g.globalAlpha=a;
  const gr=g.createLinearGradient(0,level,0,PY+PH);gr.addColorStop(0,warm>0?`rgb(${lerp(20,160,warm)|0},${lerp(120,84,warm)|0},${lerp(200,70,warm)|0})`:'#1478c8');gr.addColorStop(1,warm>0?`rgb(${lerp(6,70,warm)|0},${lerp(30,20,warm)|0},${lerp(80,30,warm)|0})`:'#05204a');
  if(!(warm>0))gr.addColorStop(.45,'#082c5c');g.fillStyle=gr;g.fillRect(PX,level,PW,PY+PH-level);
  // caustic light lines
  g.strokeStyle=`rgba(180,240,255,${.10+.06*(1-calm)})`;g.lineWidth=2;for(let k=0;k<6;k++){g.beginPath();for(let x=PX;x<=PX+PW;x+=20){const y=level+40+k*90+12*Math.sin(x*.02+t*(1.4-calm)+k);x===PX?g.moveTo(x,y):g.lineTo(x,y)}g.stroke()}
  // surface
  if(level>PY-10){g.strokeStyle='rgba(220,250,255,.8)';g.lineWidth=3;g.beginPath();for(let x=PX;x<=PX+PW;x+=10){const y=level+6*(1-calm)*Math.sin(x*.03+t*3);x===PX?g.moveTo(x,y):g.lineTo(x,y)}g.stroke()}
  // bubbles rising (fewer when calm)
  BUB.forEach((b,i)=>{if(calm>.5&&i%3)return;const y=PY+PH-((t*b.v+b.ph*200)%(PH+40));if(y<level)return;g.globalAlpha=a*.5;g.strokeStyle='#cfefff';g.lineWidth=1.5;g.beginPath();g.arc(b.x+6*Math.sin(t*2+b.ph),y,b.s,0,7);g.stroke()});
  g.restore();g.globalAlpha=1}
function steam(t,a){if(a<=0)return;STEAM.forEach(s=>{const q=(t*.25+s.ph)%1,y=PY+PH-q*PH;const gr=g.createRadialGradient(s.x,y,0,s.x,y,s.r);gr.addColorStop(0,`rgba(255,220,200,${.18*a*(1-q)})`);gr.addColorStop(1,'rgba(255,220,200,0)');g.fillStyle=gr;g.beginPath();g.arc(s.x+20*Math.sin(t+s.ph*9),y,s.r,0,7);g.fill()})}
// the watch: centre (x, y), scale s; o.lit = {crown, button, back, glass} glow 0..1, o.screen text, o.squeeze 0..1, o.gap 0..1
function watch(x,y,s,o){g.save();g.translate(x+5*Math.sin(RT*1.3),y+9*Math.sin(RT*2.1));g.rotate(.025*Math.sin(RT*1.1));g.scale(s*(1-.05*(o.squeeze||0)),s*(1+.02*(o.squeeze||0)));
  // strap
  const sg=g.createLinearGradient(-90,0,90,0);sg.addColorStop(0,'#1d2236');sg.addColorStop(.5,'#2c3452');sg.addColorStop(1,'#1d2236');g.fillStyle=sg;rrect(g,-92,-300,184,170,30);g.fill();rrect(g,-92,130,184,170,30);g.fill();
  g.strokeStyle='rgba(255,255,255,.06)';g.lineWidth=2;for(let k=0;k<4;k++){g.beginPath();g.moveTo(-70,-280+k*36);g.lineTo(70,-280+k*36);g.stroke();g.beginPath();g.moveTo(-70,170+k*36);g.lineTo(70,170+k*36);g.stroke()}
  // case
  const cg=g.createLinearGradient(-140,-160,140,160);cg.addColorStop(0,'#c9d3e6');cg.addColorStop(.45,'#6b778f');cg.addColorStop(1,'#2b3245');g.fillStyle=cg;rrect(g,-140,-165,280,330,66);g.fill();
  g.strokeStyle='rgba(255,255,255,.5)';g.lineWidth=2;g.stroke();
  // crown + button
  g.fillStyle='#9aa6bd';rrect(g,136,-70,26,64,10);g.fill();g.fillStyle='#7d889f';rrect(g,138,20,18,50,8);g.fill();
  // glass + screen
  g.fillStyle='#04060e';rrect(g,-118,-142,236,284,50);g.fill();
  const sc=g.createRadialGradient(-40,-80,10,0,0,200);sc.addColorStop(0,'rgba(80,200,255,.18)');sc.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=sc;rrect(g,-118,-142,236,284,50);g.fill();
  if(o.screen){g.fillStyle=o.scol||'#8ef0ff';g.textAlign='center';g.textBaseline='middle';g.font='800 64px "Inter Display",Inter';g.shadowColor=g.fillStyle;g.shadowBlur=18;g.fillText(o.screen,0,-16);g.shadowBlur=0;
    if(o.sub){g.font='700 22px Inter';g.fillStyle='#a3a9cc';g.fillText(o.sub,0,48)}}
  // seals (gaskets): glass ring, crown O-ring, button O-ring, case-back ring
  const L=o.lit||{};const gk=(v,f)=>{if(!(v>0))return;g.save();g.globalAlpha=clamp(v);g.strokeStyle='#ff9a3d';g.shadowColor='#ffb35c';g.shadowBlur=22*v;f();g.restore()};
  gk(L.glass,()=>{g.lineWidth=7;rrect(g,-124,-148,248,296,54);g.stroke()});
  gk(L.crown,()=>{g.lineWidth=7;g.beginPath();g.ellipse(141,-38,9,38,0,0,7);g.stroke()});
  gk(L.button,()=>{g.lineWidth=6;g.beginPath();g.ellipse(141,45,7,30,0,0,7);g.stroke()});
  gk(L.back,()=>{g.lineWidth=8;g.setLineDash(o.crack?[26,10+30*o.crack]:[]);rrect(g,-130,-155+8,260,312,60);g.stroke();g.setLineDash([])});
  g.restore()}
function gauge(t,depth,a){if(a<=0)return;const x=PX+44,y0=PY+40,y1=PY+PH-40;g.globalAlpha=a;g.strokeStyle='rgba(200,235,255,.5)';g.lineWidth=3;g.beginPath();g.moveTo(x,y0);g.lineTo(x,y1);g.stroke();
  for(let k=0;k<=10;k++){const y=lerp(y0,y1,k/10);g.beginPath();g.moveTo(x-(k%5?8:16),y);g.lineTo(x,y);g.stroke()}
  const y=lerp(y0,y1,clamp(depth/50));glowDot(x,y,8,'#8ef0ff',a);g.globalAlpha=1}
const arrowsIn=(cx,cy,r,len,col,a)=>{for(let k=0;k<10;k++){const an=k/10*Math.PI*2+.3;arrow(cx+Math.cos(an)*(r+len),cy+Math.sin(an)*(r+len),cx+Math.cos(an)*r,cy+Math.sin(an)*r,col,a,5+len/18)}};

window.TOPIC={
  title:'What <em>5 ATM</em> really means',eyebrow:'WATCHES · EXPLAINED',final:"That's<br><em>5 ATM.</em>",
  vars:{'--bg1':'#0b2448','--bg2':'#06101f','--blob1':'#0a6cff','--blob2':'#00c2b8','--blob3':'#ff7a3d','--tgrad':'linear-gradient(100deg,#8ef0ff,#3de0ff 45%,#ffb35c)'},
  chips:[['THE QUESTION','#8ef0ff'],['THE PROBLEM','#ff5d6c'],['THE FIX · SEALS','#ffb35c'],['THE TEST','#6ff0a4'],['REAL LIFE','#ff8f6c'],['THE SNEAKY ONE','#ff7ad9'],['RECAP','#b9b6ff']],
  keyw:/^(atm|five|ten|fifty|minutes|pressure|seals?|rubber|crown|buttons?|back|still|test|dive|jet|stroke|spikes|heat|steam|age|pool|sauna|hot|shower|squeeze|deeper|atmosphere)$/i,
  jolts:['sq0','sq1','sq2'],
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
    <div class="step"><div class="n">01</div><div class="s">STILL</div></div><div class="arrow">›</div>
    <div class="step"><div class="n">02</div><div class="s">DIVE</div></div><div class="arrow">›</div>
    <div class="step"><div class="n">03</div><div class="s">JET</div></div><div class="arrow">›</div>
    <div class="step"><div class="n">04</div><div class="s">STROKE</div></div></div></div>
  <div class="panel" id="p5"><div style="position:absolute;left:36px;top:26px" class="lab">SEAL GRIP</div>
    <div style="position:absolute;left:36px;right:300px;top:76px"><div class="bar"><b id="p5bar" style="background:linear-gradient(90deg,#ff9a3d,#ffd36b);box-shadow:0 0 12px #ff9a3d"></b></div></div>
    <div style="position:absolute;right:36px;top:26px;text-align:right"><div class="lab">HEAT</div><div class="big" style="font-size:36px;color:#ff8f6c;margin-top:10px" id="p5h">RISING ▲</div></div></div>
  <div class="pill" id="pl1" style="top:1060px;border-color:rgba(78,226,138,.6)"><div class="ic" style="background:rgba(78,226,138,.18);color:#8ff0b8">✓</div>Pool and sea swims</div>
  <div class="pill" id="pl2" style="top:1170px;border-color:rgba(255,93,108,.6)"><div class="ic" style="background:rgba(255,93,108,.18);color:#ff8f9a">✕</div>Sauna and hot showers</div>`,
  cam(){return [[0,[1.03,0,0]],[st(1)-.3,[1.0,0,0]],[st(1)+.6,[1.03,0,10],'expo'],[en(1),[1.05,0,16]],[st(2)+.6,[1.08,-20,10],'expo'],[en(2),[1.11,-26,10]],
    [st(3)+.6,[1.0,0,0],'expo'],[en(3),[1.03,0,-6]],[st(4)+.6,[.98,0,0],'expo'],[en(4),[1.02,10,0]],[st(5)+.6,[1.08,0,10],'expo'],[en(5),[1.12,0,16]],[st(6)+.6,[.9,0,-70],'expo'],[TL.total,[.86,0,-80]]]},
  hero(t,{sh,fin}){
    const pulse=.5+.5*Math.sin(t*1.7);g.save();g.shadowColor='rgba(61,224,255,.5)';g.shadowBlur=60+20*pulse;rrect(g,PX,PY,PW,PH,26);g.fillStyle='rgba(6,14,30,.92)';g.fill();g.restore();
    const c0=1-prog(t,st(1)-.3,st(1)+.3),c1=win(t,st(1)-.35,st(2)+.3,.5,.5),c2=win(t,st(2)-.3,st(3)+.3,.5,.5),c3=win(t,st(3)-.3,st(4)+.3,.5,.5),c4=win(t,st(4)-.3,st(5)+.3,.5,.5),c5=win(t,st(5)-.3,st(6)+.3,.5,.5),c6=prog(t,st(6)-.3,st(6)+.5);
    // ch0: the split: pool | hot shower
    if(c0>0){const dv=CX+60*Math.sin(t*1.1);
      g.save();g.beginPath();g.rect(PX,PY,dv-PX,PH);g.clip();water(t,PY+90,0,.2,c0);g.restore();
      g.save();g.beginPath();g.rect(dv,PY,PX+PW-dv,PH);g.clip();g.globalAlpha=c0;g.fillStyle='rgba(120,40,20,.5)';g.fillRect(dv,PY,PX+PW-dv,PH);
        DROPS.forEach(d=>{const q=(t*d.v+d.ph)%1;g.strokeStyle='rgba(255,200,170,.7)';g.lineWidth=3;g.beginPath();g.moveTo(d.x,PY+q*PH);g.lineTo(d.x-4,PY+q*PH+26);g.stroke()});steam(t,c0*1.4);g.restore();g.globalAlpha=1;
      g.globalAlpha=c0;g.fillStyle='#fff';g.shadowColor='#fff';g.shadowBlur=20;g.fillRect(dv-2,PY,4,PH);g.shadowBlur=0;g.globalAlpha=1;
      watch(CX,CY+10,.95,{screen:'5 ATM',sub:'WATER RESIST'})}
    // ch1: going down: every 10 m adds 1 atmosphere; three squeezes
    if(c1>0){const dive=eio(prog(t,st(1)+.2,C.ten+.4));water(t,lerp(PY+90,PY-40,dive),0,0,c1);gauge(t,10*dive,c1);
      const sq=Math.max(...['sq0','sq1','sq2'].map(k=>{const q=prog(t,C[k],C[k]+.4);return q>0&&q<1?Math.sin(Math.PI*q):0}));
      const pr=clamp(.25+.5*prog(t,C.pushes-.2,C.ten+.6)+.25*sq);
      g.save();g.globalAlpha=c1;watch(CX+20,CY,.82,{screen:'5 ATM',squeeze:sq});g.restore();
      arrowsIn(CX+20,CY,190,30+90*pr,`rgba(255,${lerp(220,90,pr)|0},${lerp(255,110,pr)|0},.95)`,c1);
      ['sq0','sq1','sq2'].forEach(k=>ping(CX+20,CY,t,C[k],'#ff8f9a',220))}
    // ch2: the seals light up on their words, water bounces off them
    if(c2>0){water(t,PY-40,0,.3,c2*.85);const l={glass:prog(t,C.seals-.1,C.seals+.3),crown:prog(t,C.crown-.1,C.crown+.3),button:prog(t,C.buttons-.1,C.buttons+.3),back:prog(t,C.back-.1,C.back+.3)};
      g.save();g.globalAlpha=c2;watch(CX,CY,.95,{screen:'SEALS',scol:'#ffb35c',lit:l});g.restore();
      HITS.forEach(h=>{const q=((t-st(2))*1.1+h.ph)%1;if(t<st(2))return;const r=lerp(330,175,Math.min(1,q*2))+(q>.5?(q-.5)*160:0),x=CX+Math.cos(h.an)*r,y=CY+Math.sin(h.an)*r*1.15;glowDot(x,y,4,'#bfefff',c2*(q<.5?1:1-(q-.5)*2))});
      [['crown',CX+134,CY-36],['buttons',CX+134,CY+42],['back',CX,CY+150]].forEach(([k,x,y])=>ping(x,y,t,C[k],'#ffb35c',60))}
    // ch3: the lab test: still water, 50 m, 10 minutes
    if(c3>0){water(t,PY+60,0,.55,c3);gauge(t,50*prog(t,C.fifty-.1,C.fifty+.2),c3);
      g.save();g.globalAlpha=c3;g.strokeStyle='rgba(200,235,255,.45)';g.lineWidth=4;rrect(g,PX+120,PY+40,PW-200,PH-80,20);g.stroke();g.restore();
      g.save();g.globalAlpha=c3;watch(CX+40,CY+10,.8,{screen:t>C.five-.1?'5 ATM':'',scol:'#6ff0a4'});g.restore();
      const tq=prog(t,C.ten3-.2,C.ten3+.9);if(tq>0){g.globalAlpha=c3;g.strokeStyle='#6ff0a4';g.lineWidth=8;g.shadowColor='#4ee28a';g.shadowBlur=18;g.beginPath();g.arc(CX+40,CY+10,250,-Math.PI/2,-Math.PI/2+eoc(tq)*Math.PI*2);g.stroke();g.shadowBlur=0;g.globalAlpha=1}
      ping(CX+40,CY+10,t,C.five,'#6ff0a4',200)}
    // ch4: real life spikes past the test line
    if(c4>0){water(t,PY-40,0,0,c4*.55);const gx0=PX+60,gx1=PX+PW-50,gy=CY+40,lim=gy-90;
      g.save();g.globalAlpha=c4;g.fillStyle='rgba(6,14,30,.65)';rrect(g,PX+30,CY-220,PW-60,420,22);g.fill();
      g.strokeStyle='rgba(140,220,255,.12)';g.lineWidth=1.5;for(let k=0;k<14;k++){const x=gx0+((k*52-t*110)%(gx1-gx0)+(gx1-gx0))%(gx1-gx0);g.beginPath();g.moveTo(x,CY-200);g.lineTo(x,gy+120);g.stroke()}
      g.strokeStyle='rgba(255,255,255,.18)';g.lineWidth=2;g.beginPath();g.moveTo(gx0,gy+120);g.lineTo(gx1,gy+120);g.moveTo(gx0,gy+120);g.lineTo(gx0,CY-200);g.stroke();
      g.setLineDash([14,10]);g.strokeStyle='#6ff0a4';g.lineWidth=3;g.beginPath();g.moveTo(gx0,lim);g.lineTo(gx1,lim);g.stroke();g.setLineDash([]);
      const ks=[['dive',.32],['jet',.56],['stroke',.8]],head=prog(t,st(4)+.1,en(4)+.2);
      g.strokeStyle='#8ef0ff';g.lineWidth=5;g.shadowColor='#3de0ff';g.shadowBlur=12;g.beginPath();
      for(let i=0;i<=200;i++){const u=i/200;if(u>head)break;let y=gy+6*Math.sin(u*60);ks.forEach(([k,c])=>{const s=prog(t,C[k]-.3,C[k]);y-=s*230*Math.exp(-Math.pow((u-c)/.025,2))});const x=lerp(gx0,gx1,u);i?g.lineTo(x,y):g.moveTo(x,y)}
      g.stroke();g.shadowBlur=0;
      {const u=clamp(head);let y=gy+6*Math.sin(u*60);ks.forEach(([k,c])=>{const s=prog(t,C[k]-.3,C[k]);y-=s*230*Math.exp(-Math.pow((u-c)/.025,2))});glowDot(lerp(gx0,gx1,u),y,8,'#ffffff',c4);ring(lerp(gx0,gx1,u),y,16+6*Math.sin(t*8),'#8ef0ff',c4*.6,2)}
      ks.forEach(([k,c])=>{const s=prog(t,C[k]-.1,C[k]+.2);if(s>0){const x=lerp(gx0,gx1,c);glowDot(x,gy-224,9,'#ff5d6c',s);ping(x,gy-224,t,C[k],'#ff5d6c',70)}});
      g.restore()}
    // ch5: heat: warm water, steam, the back seal thins and cracks with age
    if(c5>0){const h=prog(t,C.heat-.2,C.steam+.6),so=prog(t,C.soften-.1,C.soften+.8),ag=prog(t,C.age-.1,C.age+.6);water(t,PY+120,h,.4,c5);steam(t,c5*h*1.6);
      g.save();g.globalAlpha=c5;watch(CX,CY,.9,{screen:'HEAT',scol:'#ff8f6c',lit:{back:1-.45*so,crown:.5*(1-so)},crack:ag});g.restore();
      for(let i=0;i<10;i++){const q=((t-C.soften)*.8+i/10)%1;if(t<C.soften)break;const x=CX-110+i*24,y=lerp(CY+260,CY+150,q);glowDot(x,y,4,'#ffd36b',c5*so*(1-q))}}
    // ch6: the recap: the watch, calm, dimmed for the title
    if(c6>0){water(t,PY+90,0,.6,c6*(1-fin*.6));g.save();g.globalAlpha=c6*(1-fin*.7);watch(CX,CY-20,.8,{screen:'5 ATM'});g.restore();
      if(fin>0){for(let i=0;i<5;i++){const an=t*(.9+i*.17)+i*1.3,x=CX+Math.cos(an)*(300+40*i),y=820+Math.sin(an)*(170+20*i);glowDot(x,y,10+4*(i%2),['#3de0ff','#6ff0a4','#ffb35c','#7a7cff','#ff7ad9'][i],fin*.8)}}}
    {g.save();rrect(g,PX,PY,PW,PH,26);g.clip();const u=(t*.6)%1.6-.3,x=PX+u*PW;const gr=g.createLinearGradient(x-160,0,x+160,0);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.5,'rgba(200,240,255,.2)');gr.addColorStop(1,'rgba(255,255,255,0)');
      g.fillStyle=gr;g.translate(x,CY);g.rotate(.35);g.fillRect(-160,-900,320,1800);g.restore()}
    g.strokeStyle='rgba(255,255,255,.16)';g.lineWidth=2;rrect(g,PX,PY,PW,PH,26);g.stroke();
  },
  labels(t){
    const c0=1-prog(t,st(1)-.3,st(1)+.3),c1=win(t,st(1)-.35,st(2)+.3,.5,.5),c2=win(t,st(2)-.3,st(3)+.3,.5,.5),c3=win(t,st(3)-.3,st(4)+.3,.5,.5),c4=win(t,st(4)-.3,st(5)+.3,.5,.5),c5=win(t,st(5)-.3,st(6)+.3,.5,.5);
    if(c0>0){label(PX+150,PY+50,'✓ POOL','#6ff0a4',c0,24,'rgba(10,40,24,.92)');label(PX+PW-150,PY+50,'✕ HOT SHOWER','#ff8f9a',c0*prog(t,C.hot-.1,C.hot+.2),24,'rgba(44,10,18,.92)')}
    if(c1>0){label(PX+150,PY+PH-60,'10 m DOWN','#8ef0ff',c1*prog(t,C.ten-.1,C.ten+.2),24);label(PX+PW-170,PY+PH-60,'+1 ATM','#ff8f9a',c1*prog(t,C.atmosphere-.1,C.atmosphere+.2),26,'rgba(44,10,18,.92)')}
    if(c2>0){label(PX+PW-150,PY+70,'CROWN SEAL','#ffb35c',c2*prog(t,C.crown-.1,C.crown+.2),22,'rgba(44,26,8,.92)');label(PX+PW-150,PY+PH-110,'BUTTON SEALS','#ffb35c',c2*prog(t,C.buttons-.1,C.buttons+.2),22,'rgba(44,26,8,.92)');
      label(PX+150,PY+PH-60,'CASE BACK','#ffb35c',c2*prog(t,C.back-.1,C.back+.2),22,'rgba(44,26,8,.92)');label(PX+150,PY+70,'RUBBER RINGS','#ffd29a',c2*prog(t,C.rubber-.1,C.rubber+.2)*(1-prog(t,C.crown-.2,C.crown+.1)),22,'rgba(44,26,8,.92)')}
    if(c3>0){label(PX+170,PY+70,'STILL WATER','#8ef0ff',c3*prog(t,C.still-.1,C.still+.2),22);label(PX+PW-170,PY+70,"SAMSUNG'S TEST",'#6ff0a4',c3*prog(t,C.samsung-.1,C.samsung+.2),22,'rgba(10,40,24,.92)')}
    if(c4>0){const gy=CY+40;label(PX+170,gy-120,'TEST LIMIT','#6ff0a4',c4*prog(t,st(4)+.1,st(4)+.4),20,'rgba(10,40,24,.92)');
      [['dive','DIVE',.32],['jet','JET',.56],['stroke','STROKE',.8]].forEach(([k,txt,c])=>label(lerp(PX+60,PX+PW-50,c),gy-290,'✕ '+txt,'#ff8f9a',c4*prog(t,C[k]-.05,C[k]+.2),20,'rgba(44,10,18,.92)'));
      label(CX,gy+170,'PAST THE TEST','#ff8f9a',c4*prog(t,C.spikes-.1,C.spikes+.2),24,'rgba(44,10,18,.92)')}
    if(c5>0){label(PX+150,PY+70,'HOT WATER','#ff8f6c',c5*prog(t,C.heat-.1,C.heat+.2),22,'rgba(44,18,8,.92)');label(PX+PW-150,PY+70,'STEAM','#ffd29a',c5*prog(t,C.steam-.1,C.steam+.2),22,'rgba(44,26,8,.92)');
      label(CX,PY+PH-60,'SEALS AGE','#ff8f9a',c5*prog(t,C.age-.1,C.age+.2),22,'rgba(44,10,18,.92)')}
  },
  panels(t,{sh}){
    if(panel('#p0',0,st(1)-.15)>0){$('#p0b').style.opacity=prog(t,C.hot-.1,C.hot+.2);$('#p0a').style.transform=`scale(${1+.03*Math.sin(t*3)})`}
    if(panel('#p1',st(1)-.1,st(2)-.15)>0){const pr=clamp(.25+.5*prog(t,C.pushes-.2,C.ten+.6));$('#p1bar').style.width=(pr*100+4*sh)+'%';$('#p1n').style.opacity=prog(t,C.atmosphere-.1,C.atmosphere+.2);$('#p1r').style.opacity=prog(t,C.ten-.1,C.ten+.2);$('#p1n').style.transform=`translateX(${sh*8*Math.sin(t*70)}px)`}
    if(panel('#p2',st(2)-.1,st(3)-.15)>0){const ts=[C.seals,C.crown,C.buttons,C.back];$$('#p2d i').forEach((d,i)=>{const on=prog(t,ts[i]-.1,ts[i]+.2);d.style.color=on>0?'#ffd29a':'#6a7298';d.style.borderColor=on>0?'#ffb35c':'rgba(255,255,255,.14)';d.style.background=on>0?'rgba(255,154,61,.18)':'rgba(255,255,255,.05)';d.style.boxShadow=on>0?`0 0 ${22*on}px rgba(255,154,61,.5)`:'none';d.style.transform=`scale(${1+.08*Math.sin(Math.PI*on)})`})}
    if(panel('#p3',st(3)-.1,st(4)-.1)>0){const ts=[C.five,C.fifty,C.ten3];$$('#p3s .cell').forEach((d,i)=>{const on=prog(t,ts[i]-.1,ts[i]+.2);d.querySelector('b').style.color=on>0?'#6ff0a4':'rgba(0,0,0,0)';d.style.borderColor=on>0?'#6ff0a4':'rgba(255,255,255,.12)';d.style.boxShadow=on>0?`0 0 ${24*on}px rgba(78,226,138,.45)`:'none';d.style.transform=`scale(${1+.08*Math.sin(Math.PI*on)})`})}
    if(panel('#p4',st(4)+.15,en(4)+.45)>0)stepFlow('#p4s',[st(4)+.15,C.dive,C.jet,C.stroke],['#6ff0a4','#ff8f6c','#ff5d6c','#ff7ad9']);
    if(panel('#p5',st(5)+.1,en(5)+.45)>0){const so=prog(t,C.soften-.1,C.soften+.8),ag=prog(t,C.age-.1,C.age+.6);$('#p5bar').style.width=(100-40*so-25*ag+2*Math.sin(t*8))+'%';$('#p5h').style.opacity=prog(t,C.heat-.1,C.heat+.3)*(.7+.3*Math.sin(t*6))}
    pills(['pool','sauna']);
  }
};
})();
