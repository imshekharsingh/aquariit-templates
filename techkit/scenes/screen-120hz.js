// @techin20sec kit topic: Is a 120 Hz screen worth paying extra for? (techreel/topics/screen-120hz.json). Drawn on the shared kit frame
// (techkit/base.html). A screen shows still pictures, many times a second: the hero shows them as frames, ticks, trails, a battery and a gearbox.
(function(){
const LANE=[CY-150,CY+150];
// a phone (x, y) with a list scrolling at offset off; ghost = how many stale copies (stutter)
function phone(x,y,s,off,hz,a,tint){if(a<=0)return;g.save();g.globalAlpha=a;g.translate(x,y);g.scale(s,s);
  g.fillStyle='#0d1022';rrect(g,-130,-260,260,520,40);g.fill();g.strokeStyle='rgba(200,210,255,.5)';g.lineWidth=3;g.stroke();
  g.save();rrect(g,-116,-244,232,488,30);g.clip();g.fillStyle='#070912';g.fillRect(-116,-244,232,488);
  const step=hz===60?Math.floor(off/22)*22:off;   // the 60 Hz list moves in coarser jumps
  for(let i=-2;i<10;i++){const yy=-230+i*70-(step%70);g.fillStyle=tint;g.globalAlpha=a*.85;rrect(g,-100,yy,200,56,14);g.fill();g.globalAlpha=a;
    g.fillStyle='rgba(255,255,255,.75)';g.fillRect(-84,yy+14,110,9);g.fillStyle='rgba(255,255,255,.35)';g.fillRect(-84,yy+31,70,7)}
  if(hz===60){g.globalAlpha=a*.25;for(let k=1;k<3;k++){for(let i=-2;i<10;i++){const yy=-230+i*70-((step-k*22)%70);g.strokeStyle='#ff8f9a';g.lineWidth=2;rrect(g,-100,yy,200,56,14);g.stroke()}}}
  g.restore();g.restore();g.globalAlpha=1}
// a ball crossing a lane, drawn as the pictures the screen shows: hz pictures a second, a lighter trail for the last few
function lane(y,hz,t,a,col,label){if(a<=0)return;const x0=PX+70,x1=PX+PW-70,per=2.4,u=((t%per)/per),fps=hz/60*12;   // slowed so the steps can be seen
  g.globalAlpha=a*.35;g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=2;g.beginPath();g.moveTo(x0,y);g.lineTo(x1,y);g.stroke();g.globalAlpha=1;
  const q=Math.floor(u*fps*per)/(fps*per);
  for(let k=6;k>=1;k--){const qq=q-k/(fps*per);if(qq<0)continue;glowDot(lerp(x0,x1,eio(qq)),y,11,col,a*(.35-k*.05))}
  glowDot(lerp(x0,x1,eio(q)),y,15,col,a);
  for(let k=0;k<=fps*per;k++){const x=lerp(x0,x1,eio(k/(fps*per)));g.globalAlpha=a*.5;g.fillStyle=col;g.fillRect(x-1.5,y+34,3,12)}g.globalAlpha=1}
function battery(x,y,lvl,col,a){if(a<=0)return;g.save();g.globalAlpha=a;g.strokeStyle='rgba(220,230,255,.8)';g.lineWidth=5;rrect(g,x-70,y-150,140,300,22);g.stroke();g.fillStyle='rgba(220,230,255,.8)';rrect(g,x-26,y-170,52,16,6);g.fill();
  const h=280*clamp(lvl);const gr=g.createLinearGradient(0,y+140-h,0,y+140);gr.addColorStop(0,col);gr.addColorStop(1,'rgba(0,0,0,.3)');g.fillStyle=gr;rrect(g,x-60,y+140-h,120,h,14);g.fill();g.restore()}
function dial(x,y,v,a){if(a<=0)return;g.save();g.globalAlpha=a;g.lineWidth=22;g.lineCap='round';
  [['#6ff0a4',.0,.33],['#ffd36b',.33,.66],['#ff7ad9',.66,1]].forEach(([c,s0,s1])=>{g.strokeStyle=c;g.globalAlpha=a*.35;g.beginPath();g.arc(x,y,220,Math.PI*(1+s0)+.02,Math.PI*(1+s1)-.02);g.stroke()});
  g.globalAlpha=a;const an=Math.PI*(1+clamp(v));g.strokeStyle='#ffffff';g.lineWidth=8;g.shadowColor='#ffffff';g.shadowBlur=16;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(an)*190,y+Math.sin(an)*190);g.stroke();g.shadowBlur=0;
  g.fillStyle='#fff';g.beginPath();g.arc(x,y,16,0,7);g.fill();g.restore()}

window.TOPIC={
  title:'Is <em>120 Hz</em> worth it?',eyebrow:'PHONE SCREENS · WORTH IT OR NOT',final:"That's<br><em>120 Hz.</em>",
  vars:{'--bg1':'#1a1240','--bg2':'#0a0820','--blob1':'#5a3cff','--blob2':'#ff4fa8','--blob3':'#22d3ee','--tgrad':'linear-gradient(100deg,#8ef0ff,#7a7cff 45%,#ff7ad9)'},
  chips:[['THE QUESTION','#8ef0ff'],['THE PROBLEM','#ff5d6c'],['THE FIX · 120 Hz','#7a7cff'],['WHAT YOU SEE','#6ff0a4'],['THE CATCH','#ffb35c'],['THE SMART PART','#ff7ad9'],['RECAP','#b9b6ff']],
  keyw:/^(hertz|hundred|twenty|sixty|still|pictures|stutter|jumpy|doubles|eight|seventeen|milliseconds|smoother|gaps|battery|power|drains|adaptive|gears|fast|slow|slowest|scroll|read|worth)$/i,
  jolts:['jumpy'],
  html:`
  <div class="panel" id="p0"><div style="position:absolute;left:36px;top:26px" class="lab">SAME SWIPE · TWO SCREENS</div>
    <div class="big" style="position:absolute;left:36px;top:54px;font-size:52px;color:#ff8f9a">60 Hz</div>
    <div class="big" style="position:absolute;right:36px;top:54px;font-size:52px;color:#6ff0a4">120 Hz</div>
    <div class="big" style="position:absolute;left:0;right:0;top:66px;text-align:center;font-size:30px;color:#a3a9cc">vs</div></div>
  <div class="panel" id="p1"><div style="position:absolute;left:36px;top:26px" class="lab">PICTURES EACH SECOND · BASIC SCREEN</div>
    <div class="big" style="position:absolute;left:36px;top:54px;font-size:52px;color:#ff8f9a" id="p1n">60</div>
    <div style="position:absolute;left:200px;right:36px;top:64px" class="dots" id="p1d"></div></div>
  <div class="panel" id="p2" style="height:156px;top:1226px">
    <div style="position:absolute;left:36px;right:36px;top:30px;display:flex;align-items:center;gap:18px"><div class="lab" style="width:150px;color:#ff8f9a">60 Hz</div><div class="bar" style="flex:1"><b id="p2a" style="background:linear-gradient(90deg,#ff8a3d,#ff4d5e)"></b></div><div class="big" style="width:140px;text-align:right;font-size:32px;color:#ff5d6c" id="p2am">17 ms</div></div>
    <div style="position:absolute;left:36px;right:36px;top:94px;display:flex;align-items:center;gap:18px"><div class="lab" style="width:150px;color:#8ff0b8">120 Hz</div><div class="bar" style="flex:1"><b id="p2b" style="background:linear-gradient(90deg,#2fd57a,#8ff0b8);box-shadow:0 0 12px #4ee28a"></b></div><div class="big" style="width:140px;text-align:right;font-size:32px;color:#6ff0a4" id="p2bm">8 ms</div></div></div>
  <div class="panel" id="p3"><div style="position:absolute;left:36px;top:26px" class="lab">MOTION</div>
    <div class="big" style="position:absolute;left:36px;top:54px;font-size:46px;color:#6ff0a4" id="p3a">SMOOTHER</div>
    <div style="position:absolute;right:36px;top:26px;text-align:right"><div class="lab">GAPS BETWEEN PICTURES</div><div class="big" style="font-size:36px;color:#8ef0ff;margin-top:10px" id="p3b">HALVED ✓</div></div></div>
  <div class="panel" id="p4"><div style="position:absolute;left:36px;top:26px" class="lab">BATTERY · ALWAYS AT TOP SPEED</div>
    <div class="big" style="position:absolute;left:36px;top:54px;font-size:46px;color:#ffb35c" id="p4a">DRAINS FASTER</div>
    <div style="position:absolute;left:470px;right:36px;top:76px"><div class="bar"><b id="p4bar" style="background:linear-gradient(90deg,#ff5d6c,#ffb35c);box-shadow:0 0 12px #ffb35c"></b></div></div></div>
  <div class="panel" id="p5" style="background:none;border:none;box-shadow:none;overflow:visible"><div class="steps" id="p5s">
    <div class="step"><div class="n">01</div><div class="s">SCROLL · FAST</div></div><div class="arrow">›</div>
    <div class="step"><div class="n">02</div><div class="s">READ · SLOW</div></div><div class="arrow">›</div>
    <div class="step"><div class="n">03</div><div class="s">STILL · SLOWEST</div></div></div></div>
  <div class="pill" id="pl1" style="top:1060px;border-color:rgba(78,226,138,.6)"><div class="ic" style="background:rgba(78,226,138,.18);color:#8ff0b8">✓</div>Fast scrolling and games</div>
  <div class="pill" id="pl2" style="top:1170px;border-color:rgba(255,211,107,.6)"><div class="ic" style="background:rgba(255,211,107,.18);color:#ffe7a8">~</div>Mostly reading: a nice extra</div>`,
  init(){for(let i=0;i<12;i++)$('#p1d').insertAdjacentHTML('beforeend','<i></i>')},
  cam(){return [[0,[1.03,0,0]],[st(1)-.3,[1.0,0,0]],[st(1)+.6,[1.05,0,0],'expo'],[en(1),[1.07,10,0]],[st(2)+.6,[1.0,0,0],'expo'],[en(2),[1.02,-10,0]],
    [st(3)+.6,[1.05,0,0],'expo'],[en(3),[1.06,10,0]],[st(4)+.6,[1.0,0,0],'expo'],[en(4),[1.03,0,-6]],[st(5)+.6,[1.04,0,10],'expo'],[en(5),[1.06,0,10]],[st(6)+.6,[.9,0,-70],'expo'],[TL.total,[.86,0,-80]]]},
  hero(t,{fin}){
    subj(PX,PY,PX+PW,PY+PH);   // the subject is the whole screen box: every chapter draws its motion inside it (Output QA HERO, 16 Nov 2026)
    const pulse=.5+.5*Math.sin(t*1.7);g.save();g.shadowColor='rgba(122,124,255,.55)';g.shadowBlur=60+20*pulse;rrect(g,PX,PY,PW,PH,26);g.fillStyle='rgba(10,8,30,.92)';g.fill();g.restore();
    {g.save();rrect(g,PX,PY,PW,PH,26);g.clip();g.strokeStyle='rgba(150,140,255,.13)';g.lineWidth=1.5;for(let k=0;k<12;k++){const x=PX+((k*70+t*90)%PW);g.beginPath();g.moveTo(x,PY);g.lineTo(x,PY+PH);g.stroke()}for(let k=0;k<11;k++){const y=PY+((k*70+t*45)%PH);g.beginPath();g.moveTo(PX,y);g.lineTo(PX+PW,y);g.stroke()}g.restore()}
    const c0=1-prog(t,st(1)-.3,st(1)+.3),c1=win(t,st(1)-.35,st(2)+.3,.5,.5),c2=win(t,st(2)-.3,st(3)+.3,.5,.5),c3=win(t,st(3)-.3,st(4)+.3,.5,.5),c4=win(t,st(4)-.3,st(5)+.3,.5,.5),c5=win(t,st(5)-.3,st(6)+.3,.5,.5),c6=prog(t,st(6)-.3,st(6)+.5);
    const off=t*260;
    // ch0: the same swipe on two phones
    if(c0>0){phone(CX-180,CY+10,.95,off,60,c0,'#3a2a6a');phone(CX+180,CY+10,.95,off,120,c0,'#1f4a6a')}
    // ch1: the screen is a flip book: still pictures flashing, a ball that hops
    if(c1>0){const n=12,fw=PW/n;for(let i=0;i<n;i++){const x=PX+i*fw,on=((Math.floor(t*6)%n)===i);g.globalAlpha=c1*(on?.9:.25);g.strokeStyle=on?'#ffffff':'rgba(200,210,255,.5)';g.lineWidth=on?4:2;rrect(g,x+6,PY+80,fw-12,150,10);g.stroke();
        g.fillStyle='#ff8f9a';g.beginPath();g.arc(x+fw/2-20+40*(i/n),PY+155+30*Math.sin(i*.7),12,0,7);g.fill()}g.globalAlpha=1;
      lane(CY+120,60,t,c1,'#ff8f9a');const j=prog(t,C.jumpy-.1,C.jumpy+.5);if(j>0&&j<1)ring(CX,CY+120,40+120*eoc(j),'#ff5d6c',1-j,4)}
    // ch2: ticks: a picture every 17 ms vs every 8 ms
    if(c2>0){const y1=CY-110,y2=CY+110,x0=PX+60,x1=PX+PW-60,w=x1-x0,run=prog(t,st(2)+.2,en(2));
      [[y1,17,'#ff8f9a'],[y2,8.33,'#6ff0a4']].forEach(([y,ms,col],li)=>{const n=Math.floor(100/ms);g.globalAlpha=c2*.3;g.strokeStyle='#ffffff';g.lineWidth=2;g.beginPath();g.moveTo(x0,y);g.lineTo(x1,y);g.stroke();
        for(let k=0;k<=n;k++){const x=x0+w*k*ms/100,lit=run*100>=k*ms;g.globalAlpha=c2*(lit?1:.25);g.fillStyle=col;g.shadowColor=col;g.shadowBlur=lit?14:0;rrect(g,x-5,y-40,10,80,5);g.fill()}
        g.shadowBlur=0;g.globalAlpha=1;const hx=x0+w*run;glowDot(hx,y,8,'#ffffff',c2)});
      const d=prog(t,C.doubles-.1,C.doubles+.6);if(d>0){g.globalAlpha=c2*d;g.strokeStyle='#7a7cff';g.lineWidth=3;g.setLineDash([8,8]);g.beginPath();g.moveTo(CX,y1+50);g.lineTo(CX,y2-50);g.stroke();g.setLineDash([]);g.globalAlpha=1}}
    // ch3: the same motion: few pictures vs twice as many
    if(c3>0){lane(LANE[0],60,t,c3,'#ff8f9a');lane(LANE[1],120,t,c3,'#6ff0a4');
      const gp=prog(t,C.gaps-.1,C.gaps+.6);if(gp>0){ring(CX,LANE[1],30+60*gp,'#6ff0a4',c3*(1-gp),3)}}
    // ch4: the catch: every picture costs a spark of power; the always-120 battery drains faster
    if(c4>0){const dr=prog(t,C.drains-1.2,C.drains+1.2),pw=prog(t,C.power-.2,en(4));battery(CX-170,CY,1-.25*dr-.1*pw,'#6ff0a4',c4);battery(CX+170,CY,1-.55*dr-.25*pw,'#ff8f6c',c4);
      for(let i=0;i<14;i++){const q=((t-C.power)*2+i/14)%1;if(t<C.power)break;const x=lerp(CX+170,CX+170+(i%2?60:-60),q),y=lerp(CY-170,PY+40,q);glowDot(x,y,5,'#ffd36b',c4*(1-q))}
      for(let i=0;i<7;i++){const q=((t-C.power)*1+i/7)%1;if(t<C.power)break;const x=lerp(CX-170,CX-170+(i%2?50:-50),q),y=lerp(CY-170,PY+40,q);glowDot(x,y,5,'#8ff0b8',c4*(1-q))}}
    // ch5: adaptive: a gearbox needle: fast when you scroll, slow when you read, slowest when it's still
    if(c5>0){const v=t<C.fast-.1?.5:t<C.slow-.1?lerp(.5,.92,eob(prog(t,C.fast-.1,C.fast+.4))):t<C.slowest-.1?lerp(.92,.5,eio(prog(t,C.slow-.1,C.slow+.5))):lerp(.5,.1,eio(prog(t,C.slowest-.1,C.slowest+.6)));
      dial(CX,CY+120,v+.015*Math.sin(t*9),c5);phone(CX,CY-180,.42,t<C.slow?off:t<C.slowest?off*.2:0,120,c5,'#3a2a6a')}
    if(c6>0){phone(CX,CY,.9,off*.6,120,c6*(1-fin*.7),'#1f4a6a');
      if(fin>0){for(let i=0;i<5;i++){const an=t*(.9+i*.17)+i*1.3,x=CX+Math.cos(an)*(300+40*i),y=820+Math.sin(an)*(170+20*i);glowDot(x,y,10+4*(i%2),['#8ef0ff','#7a7cff','#ff7ad9','#6ff0a4','#ffd36b'][i],fin*.8)}}}
    // (no glass sheen: 15 Nov 2026, owner: a bright band sweeping across the hero every ~2.7 s; Output QA SHEEN)
    g.strokeStyle='rgba(255,255,255,.16)';g.lineWidth=2;rrect(g,PX,PY,PW,PH,26);g.stroke();
  },
  labels(t){
    const c0=1-prog(t,st(1)-.3,st(1)+.3),c1=win(t,st(1)-.35,st(2)+.3,.5,.5),c2=win(t,st(2)-.3,st(3)+.3,.5,.5),c3=win(t,st(3)-.3,st(4)+.3,.5,.5),c4=win(t,st(4)-.3,st(5)+.3,.5,.5),c5=win(t,st(5)-.3,st(6)+.3,.5,.5);
    if(c0>0){label(CX-180,PY+40,'60 Hz · JUMPY','#ff8f9a',c0,22,'rgba(44,10,18,.92)');label(CX+180,PY+40,'120 Hz · SMOOTH','#6ff0a4',c0,22,'rgba(10,40,24,.92)')}
    if(c1>0){label(CX,PY+40,'STILL PICTURES','#ffffff',c1*prog(t,C.pictures-.1,C.pictures+.2),22);label(CX,PY+PH-60,'✕ JUMPY','#ff8f9a',c1*prog(t,C.jumpy-.1,C.jumpy+.2),24,'rgba(44,10,18,.92)')}
    if(c2>0){label(PX+150,CY-200,'EVERY 17 ms','#ff8f9a',c2*prog(t,C.seventeen-.1,C.seventeen+.2),22,'rgba(44,10,18,.92)');label(PX+150,CY+200,'EVERY 8 ms','#6ff0a4',c2*prog(t,C.eight-.1,C.eight+.2),22,'rgba(10,40,24,.92)');
      label(CX+160,CY,'2× THE PICTURES','#b9b6ff',c2*prog(t,C.doubles-.1,C.doubles+.2),22)}
    if(c3>0){label(PX+PW-120,LANE[0]-70,'60 Hz','#ff8f9a',c3,22,'rgba(44,10,18,.92)');label(PX+PW-120,LANE[1]-70,'120 Hz','#6ff0a4',c3,22,'rgba(10,40,24,.92)');label(CX+150,CY,'GAPS FILLED IN','#8ef0ff',c3*prog(t,C.gaps-.1,C.gaps+.2),22)}
    if(c4>0){label(CX-170,CY+220,'ADAPTIVE','#6ff0a4',c4*prog(t,st(4)+.4,st(4)+.7),22,'rgba(10,40,24,.92)');label(CX+170,CY+220,'120 Hz ALWAYS','#ff8f6c',c4*prog(t,st(4)+.4,st(4)+.7),22,'rgba(44,18,8,.92)')}
    if(c5>0){label(CX-230,CY+170,'SLOW','#6ff0a4',c5*.9,20,'rgba(10,40,24,.92)');label(CX,CY-30+40,'READ','#ffd36b',c5*.9,20,'rgba(44,36,8,.92)');label(CX+230,CY+170,'FAST','#ff7ad9',c5*.9,20,'rgba(44,10,40,.92)')}
  },
  panels(t,{sh}){
    if(panel('#p0',0,st(1)-.15)>0){}
    if(panel('#p1',st(1)-.1,st(2)-.15)>0){$$('#p1d i').forEach((d,i)=>{const on=(Math.floor(t*6)%12)===i;d.style.background=on?'rgba(255,143,154,.6)':'rgba(255,255,255,.05)';d.style.borderColor=on?'#ff8f9a':'rgba(255,255,255,.14)'});$('#p1n').style.opacity=prog(t,C.sixty-.1,C.sixty+.2);$('#p1n').style.transform=`translateX(${sh*8*Math.sin(t*70)}px)`}
    if(panel('#p2',st(2)-.1,st(3)-.1)>0){$('#p2a').style.width=(eoc(prog(t,C.seventeen-.2,C.seventeen+.4))*100)+'%';$('#p2am').style.opacity=prog(t,C.seventeen-.1,C.seventeen+.2);$('#p2b').style.width=(eoc(prog(t,C.eight-.2,C.eight+.4))*49)+'%';$('#p2bm').style.opacity=prog(t,C.eight-.1,C.eight+.2)}
    if(panel('#p3',st(3)-.1,st(4)-.1)>0){$('#p3a').style.transform=`scale(${1+.04*Math.sin(t*4)})`;$('#p3b').style.opacity=prog(t,C.gaps-.1,C.gaps+.25)}
    if(panel('#p4',st(4)+.1,en(4)+.45)>0){$('#p4bar').style.width=(100-60*prog(t,C.drains-1.2,C.drains+1.2)+2*Math.sin(t*9))+'%';$('#p4a').style.opacity=prog(t,C.drains-.1,C.drains+.25)}
    if(panel('#p5',st(5)+.15,en(5)+.45)>0)stepFlow('#p5s',[C.fast,C.slow,C.slowest],['#ff7ad9','#ffd36b','#6ff0a4']);
    pills(['love','worth']);
  }
};
})();
