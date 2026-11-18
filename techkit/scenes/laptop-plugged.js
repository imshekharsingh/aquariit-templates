// @techin20sec kit topic: Should your laptop stay plugged in all day? (techreel/topics/laptop-plugged.json). Gadget myths on the shared kit
// frame (techkit/base.html). One laptop, drawn generically (no brand, no logo), opens up on every beat (rules-tech.md K2): the deck turns to
// x-ray and shows the battery's cells and their charge, the power path from the charger, the cells holding at 80%, the screen's own settings,
// a pillow that blocks the vents and heats the cells, then the laptop back on a desk, cool. MYTH stamp in frame 0 and on the verdict (F5).
(function(){
const LX=540,LT=560,LB=850,LW=660;            // the lid: centre x, top, bottom (hinge), width
const DT=850,DB=1070,DHW0=330,DHW1=400;       // the deck: top (hinge) y, front y, half width at the back and at the front
const RM=mulberry(7),MOTES=[...Array(46)].map(()=>({x:RM()*1040+20,y:RM(),r:3+RM()*5,v:.05+RM()*.05,ph:RM()*6}));
const bump=(t,t0,d=.6)=>Math.sin(Math.PI*prog(t,t0,t0+d));
const DK=(u,v,s=0)=>[LX+(u-.5)*2*lerp(DHW0,DHW1,v),lerp(DT,DB,v)+s];   // a point on the deck (u across, v back to front), s = sink into the pillow
function quad(P,fill,stroke,lw){g.beginPath();g.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length;i++)g.lineTo(P[i][0],P[i][1]);g.closePath();if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||2;g.stroke()}}
const mixc=(a,b,u)=>`rgb(${a.map((v,i)=>Math.round(lerp(v,b[i],clamp(u)))).join(',')})`;
const GRN=[111,240,164],AMB=[255,179,92],RED=[255,93,108],ICE=[142,240,255];
const sCol=u=>u<.5?mixc(GRN,AMB,u*2):mixc(AMB,RED,(u-.5)*2);
// the battery's cells inside the deck: n cells in a row, level 0-1, colour by stress (0 calm green, 1 hot red)
function cells(lvl,stress,a,s,t,charging=0){if(a<=0)return;const n=4;g.save();g.globalAlpha=a;
  for(let i=0;i<n;i++){const u0=.16+i*.175,u1=u0+.15,v0=.22,v1=.86,P=[DK(u0,v0,s),DK(u1,v0,s),DK(u1,v1,s),DK(u0,v1,s)];
    quad(P,'rgba(8,14,28,.9)',sCol(stress),3);
    const fv=lerp(v1,v0,clamp(lvl)),F=[DK(u0+.012,fv,s),DK(u1-.012,fv,s),DK(u1-.012,v1-.02,s),DK(u0+.012,v1-.02,s)];
    const col=sCol(stress);g.shadowColor=col;g.shadowBlur=18+14*stress*(.5+.5*Math.sin(t*6+i));quad(F,col);g.shadowBlur=0;
    if(charging>0){const q=((t*.7+i*.23)%1),bv=lerp(v1-.02,fv,q),B=[DK(u0+.012,bv,s),DK(u1-.012,bv,s),DK(u1-.012,Math.min(v1-.02,bv+.07),s),DK(u0+.012,Math.min(v1-.02,bv+.07),s)];g.globalAlpha=a*charging*.85;quad(B,'#ffffff');g.globalAlpha=a}
    const [tx,ty]=DK((u0+u1)/2,v0-.08,s);g.fillStyle='rgba(220,230,255,.75)';g.fillRect(tx-10,ty+4,20,6)}   // the cell's terminal
  g.restore()}
// the keyboard deck, solid (x-ray 0) or see-through (x-ray 1)
function deck(xr,s,heat,t){const P=[DK(0,0,s),DK(1,0,s),DK(1,1,s),DK(0,1,s)];
  const gr=g.createLinearGradient(0,DT+s,0,DB+s);gr.addColorStop(0,'#3a4466');gr.addColorStop(1,'#232a44');g.globalAlpha=1;quad(P,gr,'rgba(200,215,255,.45)',2.5);
  g.globalAlpha=1-xr;for(let r=0;r<4;r++)for(let c=0;c<12;c++){const u0=.08+c*.07,v0=.12+r*.15,Q=[DK(u0,v0,s),DK(u0+.058,v0,s),DK(u0+.058,v0+.11,s),DK(u0,v0+.11,s)];quad(Q,'#161b2e')}
  const pad=[DK(.38,.75,s),DK(.62,.75,s),DK(.63,.97,s),DK(.37,.97,s)];quad(pad,'#1d2338','rgba(200,215,255,.2)',1.5);
  g.globalAlpha=xr*.85;quad(P,'rgba(6,10,24,.82)','rgba(142,240,255,.6)',2.5);
  // the front edge (thickness)
  g.globalAlpha=1;const E=[DK(0,1,s),DK(1,1,s),[DK(1,1,s)[0]-8,DB+s+22],[DK(0,1,s)[0]+8,DB+s+22]];quad(E,'#1a2038','rgba(200,215,255,.3)',2);
  if(heat>0){const [hx,hy]=DK(.5,1,s);const hg=g.createRadialGradient(hx,hy,10,hx,hy,420);hg.addColorStop(0,`rgba(255,74,42,${.55*heat})`);hg.addColorStop(1,'rgba(255,74,42,0)');g.fillStyle=hg;g.globalAlpha=1;g.fillRect(hx-440,hy-260,880,420)}
  g.globalAlpha=1}
// the lid: a dark screen; draw(x0, y0, w, h) paints its content in world space
let WT=0,WH=[60,170,255];
// the screen's own wallpaper: two soft lights that drift slowly (the screen is on; its hue follows the chapter: blue, amber when hot)
function wall(x,y,w,h){const t=WT;for(let k=0;k<2;k++){const cx=x+w*(.3+.4*k+.22*Math.sin(t*.9+k*2.1)),cy=y+h*(.5+.35*Math.cos(t*.75+k*1.3)),gr=g.createRadialGradient(cx,cy,0,cx,cy,w*.55);
  gr.addColorStop(0,`rgba(${WH.join(',')},.5)`);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x,y,w,h)}}
function lid(s,draw){const x0=LX-LW/2,w=LW,h=LB-LT;g.save();g.translate(0,s*.6);
  rrect(g,x0,LT,w,h,24);g.fillStyle='#1b2038';g.fill();g.strokeStyle='rgba(200,215,255,.45)';g.lineWidth=2.5;g.stroke();
  rrect(g,x0+18,LT+18,w-36,h-40,14);g.fillStyle='#070a18';g.fill();g.save();rrect(g,x0+18,LT+18,w-36,h-40,14);g.clip();wall(x0+18,LT+18,w-36,h-40);draw(x0+18,LT+18,w-36,h-40);g.restore();g.restore()}
function txt(s,x,y,size,col,a=1,al='center',w=800){if(a<=0)return;g.globalAlpha=clamp(a);g.font=`${w} ${size}px "Inter Display",Inter`;g.textAlign=al;g.textBaseline='middle';g.fillStyle=col;g.fillText(s,x,y);g.globalAlpha=1}
function batt(x,y,lvl,col,a,sweep=-1){if(a<=0)return;g.globalAlpha=a;g.strokeStyle='rgba(230,236,255,.85)';g.lineWidth=5;rrect(g,x-70,y-32,132,64,12);g.stroke();g.fillStyle='rgba(230,236,255,.85)';rrect(g,x+66,y-12,10,24,4);g.fill();
  g.fillStyle=col;g.shadowColor=col;g.shadowBlur=14;rrect(g,x-62,y-24,116*clamp(lvl),48,7);g.fill();g.shadowBlur=0;
  if(sweep>=0){g.save();rrect(g,x-62,y-24,116*clamp(lvl),48,7);g.clip();g.fillStyle='rgba(255,255,255,.85)';g.fillRect(x-62-30+(116+30)*sweep,y-24,26,48);g.restore()}g.globalAlpha=1}
function pointer(x,y,a,press){if(a<=0)return;g.save();g.globalAlpha=a;g.translate(x,y);g.scale(1-.12*press,1-.12*press);g.beginPath();g.moveTo(0,0);g.lineTo(0,34);g.lineTo(9,26);g.lineTo(16,41);g.lineTo(22,38);g.lineTo(15,24);g.lineTo(26,24);g.closePath();g.fillStyle='#ffffff';g.fill();g.strokeStyle='#070a18';g.lineWidth=2.5;g.stroke();g.restore()}
function toggle(x,y,on,a){g.globalAlpha=a;rrect(g,x,y-20,72,40,20);g.fillStyle=mixc([60,66,96],GRN,on);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(x+20+32*eio(clamp(on)),y,15,0,7);g.fill();g.globalAlpha=1}
// the charger cable from the right edge into the deck's side; flow 0-1 = how much current is moving; into = 0 the battery, 1 the board
function cable(s,a,flow,t,into){if(a<=0)return;const [ex,ey]=DK(1,.55,s),pts=[[1060,ey+40],[980,ey+40],[ex+40,ey+10],[ex,ey]];g.save();g.globalAlpha=a;g.strokeStyle='#d8def5';g.lineWidth=10;g.lineCap='round';g.lineJoin='round';
  g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(const p of pts.slice(1))g.lineTo(p[0],p[1]);g.stroke();g.fillStyle='#d8def5';rrect(g,ex-6,ey-12,26,24,5);g.fill();g.restore();
  if(flow<=0)return;const tgt=into>.5?DK(.12,.3,s):DK(.5,.55,s),path=[...pts,tgt];
  for(let k=0;k<9;k++){const q=((t*.8+k/9)%1),seg=q*(path.length-1),i=Math.floor(seg),f=seg-i,[x1,y1]=path[i],[x2,y2]=path[Math.min(i+1,path.length-1)];glowDot(lerp(x1,x2,f),lerp(y1,y2,f),6,'#ffd36b',a*flow*.9)}}
function chip(s,a,glow){if(a<=0)return;const P=[DK(.05,.08,s),DK(.2,.08,s),DK(.2,.5,s),DK(.05,.5,s)];g.globalAlpha=a;g.shadowColor='#ffd36b';g.shadowBlur=24*glow;quad(P,'#2a2f4c',mixc([200,215,255],[255,211,107],glow),3);g.shadowBlur=0;g.globalAlpha=1}
function pillow(a,t){if(a<=0)return;g.save();g.globalAlpha=a;const y=DB+6,gr=g.createLinearGradient(0,y-40,0,y+150);gr.addColorStop(0,'#c9b6ff');gr.addColorStop(1,'#6b58b8');g.fillStyle=gr;
  g.beginPath();g.moveTo(90,y+40);g.bezierCurveTo(140,y-60,940,y-60,990,y+40);g.bezierCurveTo(1010,y+100,980,y+126,900,y+130);g.lineTo(180,y+130);g.bezierCurveTo(100,y+126,70,y+100,90,y+40);g.fill();
  g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=3;g.setLineDash([10,12]);g.beginPath();g.moveTo(150,y+40);g.bezierCurveTo(200,y-20,880,y-20,930,y+40);g.stroke();g.setLineDash([]);g.restore()}
function desk(a){if(a<=0)return;g.globalAlpha=a;const gr=g.createLinearGradient(0,DB+20,0,DB+200);gr.addColorStop(0,'#2a3f66');gr.addColorStop(1,'rgba(20,30,60,0)');g.fillStyle=gr;g.fillRect(40,DB+22,1000,180);
  g.strokeStyle='rgba(142,240,255,.5)';g.lineWidth=2;g.beginPath();g.moveTo(40,DB+22);g.lineTo(1040,DB+22);g.stroke();g.globalAlpha=1}
function stamp(x,y,word,col,a,rot){if(a<=0)return;const sc=1+.35*(1-eob(clamp(a)));g.save();g.globalAlpha=clamp(a);g.translate(x,y);g.rotate(rot);g.scale(sc,sc);g.font='900 56px "Inter Display",Inter';
  const w=g.measureText(word).width+50;g.strokeStyle=col;g.lineWidth=7;rrect(g,-w/2,-50,w,100,14);g.stroke();g.fillStyle=col;g.textAlign='center';g.textBaseline='middle';g.fillText(word,0,4);g.restore();
  if(a>.3){const r=w/2+16;BOXES.push([word,x-r,x+r,y-66,y+66])}}

window.TOPIC={
  title:'Plugged in <em>all day?</em>',eyebrow:'LAPTOPS · GADGET MYTHS',final:"That's the<br>plugged-in<br><em>myth.</em>",
  vars:{'--bg1':'#10284a','--bg2':'#070f22','--blob1':'#1f7aff','--blob2':'#ffb35c','--blob3':'#6ff0a4','--tgrad':'linear-gradient(100deg,#8ef0ff,#6ff0a4 45%,#ffd36b)'},
  chips:[['THE MYTH','#ff8f9a'],['WHAT AGES IT','#ffb35c'],['THE TRUTH · IT STOPS','#6ff0a4'],['THE 80% TRICK','#8ef0ff'],['THE SETTING','#b9b6ff'],['THE REAL ENEMY','#ff5d6c'],['RECAP','#ffd36b']],
  keyw:/^(plugged|kills|battery|wear|full|hundred|percent|hot|stop|charger|rests|eighty|optimized|limit|dell's|setting|heat|bed|pillow|vents|blocked|cool|myth)$/i,
  jolts:[],
  cover:true,   // frame 0 is the reel's cover (rules-tech.md K3)
  holds:()=>[[+(C.final+.8).toFixed(2),TL.total]],   // the title slam is read standing still
  css:'.cell{flex:1;height:84px;border-radius:18px;border:1.5px solid rgba(255,255,255,.12);display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(255,255,255,.04)}.cell b{font:800 34px "Inter Display",Inter;color:#e8ecff}.cell small{font:700 13px Inter;letter-spacing:.14em;color:#9aa3c8;margin-top:6px}',
  html:`
  <div class="panel" id="p0"><div style="position:absolute;left:36px;top:26px" class="lab">THE BELIEF</div>
    <div class="big" style="position:absolute;left:36px;top:54px;font-size:46px;color:#ff8f9a">PLUGGED IN = DEAD BATTERY?</div></div>
  <div class="panel" id="p1"><div style="position:absolute;left:36px;top:26px" class="lab">WHAT AGES A BATTERY</div>
    <div class="big" style="position:absolute;left:36px;top:54px;font-size:50px;color:#ffb35c" id="p1a">SITTING FULL</div>
    <div class="big" style="position:absolute;right:36px;top:54px;font-size:50px;color:#ff5d6c" id="p1b">+ HEAT</div></div>
  <div class="panel" id="p2" style="background:none;border:none;box-shadow:none;overflow:visible"><div class="steps" id="p2s">
    <div class="step"><div class="n">FULL</div><div class="s">STOPS CHARGING</div></div><div class="arrow">›</div>
    <div class="step"><div class="n">CHARGER</div><div class="s">RUNS THE LAPTOP</div></div><div class="arrow">›</div>
    <div class="step"><div class="n">BATTERY</div><div class="s">RESTS</div></div></div></div>
  <div class="panel" id="p3"><div style="position:absolute;left:36px;top:26px" class="lab">HOLDS THE CHARGE NEAR</div>
    <div class="big" style="position:absolute;left:36px;top:54px;font-size:56px;color:#8ef0ff" id="p3n">80%</div>
    <div style="position:absolute;left:250px;right:36px;top:84px"><div class="bar"><b id="p3bar" style="background:linear-gradient(90deg,#2fd57a,#8ef0ff);box-shadow:0 0 12px #8ef0ff"></b></div></div></div>
  <div class="panel" id="p4" style="background:none;border:none;box-shadow:none;overflow:visible"><div class="steps" id="p4s">
    <div class="step"><div class="n">MAC</div><div class="s">OPTIMIZED</div></div><div class="arrow">·</div>
    <div class="step"><div class="n">MAC</div><div class="s">CHARGE LIMIT</div></div><div class="arrow">·</div>
    <div class="step"><div class="n">DELL</div><div class="s">POWER MANAGER</div></div></div></div>
  <div class="panel" id="p5"><div style="position:absolute;left:36px;top:26px" class="lab">VENTS BLOCKED · HEAT TRAPPED</div>
    <div style="position:absolute;left:36px;right:300px;top:84px"><div class="bar"><b id="p5bar" style="background:linear-gradient(90deg,#ffb35c,#ff4a2a);box-shadow:0 0 12px #ff4a2a"></b></div></div>
    <div style="position:absolute;right:36px;top:26px;text-align:right"><div class="lab">BATTERY</div><div class="big" style="font-size:36px;color:#ff5d6c;margin-top:10px" id="p5h">AGES FASTER</div></div></div>
  <div class="pill" id="pl1" style="top:1060px;border-color:rgba(78,226,138,.6)"><div class="ic" style="background:rgba(78,226,138,.18);color:#8ff0b8">✓</div>Plugged in all day: fine</div>
  <div class="pill" id="pl2" style="top:1170px;border-color:rgba(142,240,255,.6)"><div class="ic" style="background:rgba(142,240,255,.18);color:#8ef0ff">✓</div>Limit on, kept cool</div>`,
  // the camera: one eased move to the part named, then it holds (no drift; K1)
  cam(){const Z=[1,0,0],DECK=[1.06,0,-30],SCR=[1.08,0,40];
    return [[0,Z],[.8,Z],[C.wear-.3,Z],[C.wear+.5,DECK,'expo'],[st(3)-.3,DECK],[st(3)+.4,[1.08,0,-40]],[st(4)-.3,[1.08,0,-40]],[st(4)+.5,SCR,'expo'],
      [st(5)-.3,SCR],[st(5)+.5,[.95,0,-30],'expo'],[C.blocked-.2,[.95,0,-30]],[C.blocked+.5,[1.04,0,-50]],[st(6)-.3,[1.04,0,-50]],[st(6)+.6,[.8,0,-120],'expo']]},
  hero(t,{fin}){
    // chapter weights
    const c5=win(t,st(5)-.3,st(6)+.2,.5,.5),c6=prog(t,st(6)-.2,st(6)+.6);
    const sink=c5*24*eio(prog(t,C.bed-.2,C.pillow+.4));
    const xr=Math.max(prog(t,C.wear-.3,C.wear+.4)*(1-prog(t,st(4)-.3,st(4)+.3)),prog(t,C.heat-.2,C.heat+.4)*(1-prog(t,st(6)-.3,st(6)+.3)),.55*c6*(1-fin));
    // the charge: 100% from the start; held at 80% from "eighty" on; the chapter-6 laptop keeps 80
    const lvl=t<C.eighty-.2?1:lerp(1,.8,eio(prog(t,C.eighty-.2,C.eighty+.8)));
    const full=t<st(2)?prog(t,C.full1-.2,C.full1+.3):1-prog(t,C.eighty-.2,C.eighty+.6);
    const hot1=win(t,C.hot-.2,st(2)+.2,.4,.6),hot5=c5*prog(t,C.heat-.2,C.blocked+1.2),heat=Math.max(hot1*.8,hot5);
    const stress=clamp(Math.max(full*.45+hot1*.55,hot5));
    const into=t<C.stop?0:1;   // charging: into the battery; from "stop" (full) the charger feeds the board and the battery rests
    const flow=(t<C.stop?1:prog(t,C.charger-.6,C.charger)*(t<st(5)?1:1-prog(t,st(5),st(5)+.4)))+c6*.8;
    const charging=t<C.stop?1-prog(t,C.stop-.3,C.stop):0;
    WT=t;const hw=Math.max(hot1,hot5);WH=[Math.round(lerp(60,255,hw)),Math.round(lerp(170,110,hw)),Math.round(lerp(255,60,hw))];
    for(const m of MOTES){const y=1230-((m.y+t*m.v)%1)*780;glowDot(m.x+10*Math.sin(t*.4+m.ph),y,m.r,hw>.4?'#ff9a5c':'#8ef0ff',.3)}
    desk((1-c5)*(t<st(5)?1:0)+c6);pillow(c5*(1-c6),t);
    subj(LX-DHW1-20,LT,LX+DHW1+20,DB+24);   // the subject: the whole laptop (Output QA HERO)
    lid(sink,(x,y,w,h)=>{const cx=x+w/2,cy=y+h/2;
      // ch0-ch3: the battery screen; ch4: the settings; ch5: the heat; ch6: cool
      const sA=1-prog(t,st(4)-.3,st(4)+.1),sB=win(t,st(4)-.1,st(5)+.1,.4,.4),sC=win(t,st(5)-.1,st(6)+.1,.4,.4),sD=prog(t,st(6),st(6)+.4);
      // ch0: the day goes by on the screen (a sun crossing it), plugged in all along
      const sun=win(t,.8,st(1)+.4,.4,.4);if(sun>0){const u=prog(t,.8,st(1)+.4),sx=x+50+u*(w-100),sy=y+58-Math.sin(Math.PI*u)*26;glowDot(sx,sy,12,'#ffd36b',sun*.9);g.globalAlpha=sun;g.fillStyle='#fff3c4';g.beginPath();g.arc(sx,sy,20,0,7);g.fill();g.strokeStyle='#ffd36b';g.lineWidth=4;for(let k=0;k<8;k++){const an=k*Math.PI/4+t*1.2;g.beginPath();g.moveTo(sx+Math.cos(an)*28,sy+Math.sin(an)*28);g.lineTo(sx+Math.cos(an)*40,sy+Math.sin(an)*40);g.stroke()}g.globalAlpha=1}
      // ch2: the power path on the screen: plug -> marching arrows -> the board (the battery paused)
      const fl=win(t,C.charger-.3,st(3)+.1,.4,.4);if(fl>0){const fy=y+h-34;g.globalAlpha=fl;g.strokeStyle='#ffd36b';g.lineWidth=12;g.lineCap='butt';g.setLineDash([26,18]);g.lineDashOffset=-t*110;g.beginPath();g.moveTo(x+120,fy);g.lineTo(x+w-120,fy);g.stroke();g.setLineDash([]);
        txt('CHARGER',x+60,fy,20,'#ffd36b',fl,'center',800);txt('BOARD',x+w-60,fy,20,'#ffd36b',fl,'center',800)}
      // ch3: the charge through the day: up to full, back down to 80 and flat, drawn as the cursor moves
      const ch3=win(t,C.eighty-.2,st(4)+.1,.4,.4);if(ch3>0){const gx=x+70,gw=w-140,gy=y+h-14,gh=34,u=prog(t,C.eighty-.2,st(4)-.2),F=k=>k<.2?lerp(.6,1,k/.2):k<.35?lerp(1,.8,(k-.2)/.15):.8;
        g.globalAlpha=ch3*.4;g.strokeStyle='#8ef0ff';g.lineWidth=2;g.beginPath();g.moveTo(gx,gy);g.lineTo(gx+gw,gy);g.stroke();g.globalAlpha=ch3;g.strokeStyle='#6ff0a4';g.lineWidth=5;g.beginPath();
        for(let k=0;k<=40;k++){const q=k/40*u;const px=gx+gw*q,py=gy-gh*F(q);k?g.lineTo(px,py):g.moveTo(px,py)}g.stroke();glowDot(gx+gw*u,gy-gh*F(u),7,'#6ff0a4',ch3);g.globalAlpha=1}
      if(sA>0){const pc=t<C.eighty?100:80,col=mixc(GRN,AMB,full*(1-hot1)),col2=hot1>.3?mixc(AMB,RED,hot1):col;
        batt(cx-90,cy-18,pc/100,col2,sA,t<C.stop?(t*1.1)%1:-1);txt(pc+'%',cx+110,cy-18,76,'#ffffff',sA*(1-bump(t,C.eighty-.12,.24)));
        const hold=prog(t,C.stop-.1,C.stop+.3)*(1-prog(t,C.eighty-.3,C.eighty));
        txt(t<C.stop?'CHARGING':'CHARGING ON HOLD',cx,cy+48,26,t<C.stop?'#ffd36b':'#6ff0a4',sA*(t<C.stop?prog(t,.6,1.2):hold),'center',700);
        txt('HELD NEAR 80%',cx,cy+48,26,'#8ef0ff',sA*prog(t,C.eighty+.2,C.eighty+.6),'center',700)}
      if(sB>0){g.globalAlpha=sB;txt('Battery',x+40,y+40,34,'#ffffff',sB,'left');
        const r1=y+96,r2=y+148;txt('Optimized Battery Charging',x+44,r1,26,'#d8def5',sB,'left',600);toggle(x+w-120,r1,prog(t,C.optimized-.1,C.optimized+.3),sB);
        txt('Charge limit',x+44,r2,26,'#d8def5',sB,'left',600);const sl=prog(t,C.limit-.1,C.limit+.6),s0=x+230,s1=x+w-160,kx=lerp(s1,lerp(s0,s1,.8),eio(sl));g.globalAlpha=sB;g.fillStyle='rgba(255,255,255,.18)';rrect(g,s0,r2-5,s1-s0,10,5);g.fill();g.fillStyle='#6ff0a4';rrect(g,s0,r2-5,kx-s0,10,5);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(kx,r2,16,0,7);g.fill();
        txt((sl<.5?100:80)+'%',x+w-44,r2,26,'#6ff0a4',sB,'right',800);
        { const P1=[x+w-84,r1+6],P2=[kx+4,r2+6],P3=[x+w-94,y+h-37],P0=[x+w*.5,y+h*.6];
          const a1=eio(prog(t,C.optimized-.6,C.optimized-.1)),a2=eio(prog(t,C.optimized+.4,C.limit-.1)),a3=eio(prog(t,C.limit+.7,C.setting-.1));
          let px=lerp(P0[0],P1[0],a1),py=lerp(P0[1],P1[1],a1);px=lerp(px,P2[0],a2);py=lerp(py,P2[1],a2);px=lerp(px,P3[0],a3);py=lerp(py,P3[1],a3);
          const pr=Math.max(bump(t,C.optimized-.1,.3),t>C.limit-.1&&t<C.limit+.6?1:0,bump(t,C.setting-.1,.3));pointer(px,py,sB,pr) }
        const dA=sB*prog(t,C.dell-.15,C.dell+.3);if(dA>0){g.globalAlpha=dA;rrect(g,x+30,y+h-72,w-60,58,14);g.fillStyle='#1d2440';g.fill();g.strokeStyle='rgba(185,182,255,.6)';g.lineWidth=2;g.stroke();
          txt('Power Manager · Primarily AC Use',x+52,y+h-43,22,'#d8def5',dA,'left',600);toggle(x+w-130,y+h-43,prog(t,C.setting-.1,C.setting+.3),dA)}g.globalAlpha=1}
      if(sC>0){const tq=hot5,th=lerp(.25,.95,tq);g.globalAlpha=sC;g.strokeStyle='#e8ecff';g.lineWidth=5;rrect(g,cx-22,y+26,44,150,22);g.stroke();g.beginPath();g.arc(cx,y+196,30,0,7);g.stroke();
        g.fillStyle=mixc(AMB,RED,tq);g.shadowColor='#ff4a2a';g.shadowBlur=20*tq;g.beginPath();g.arc(cx,y+196,21,0,7);g.fill();rrect(g,cx-12,y+176-140*th,24,140*th+10,12);g.fill();g.shadowBlur=0;g.globalAlpha=1;
        txt('HOT',cx+140,y+120,56,'#ff5d6c',sC*prog(t,C.blocked,C.blocked+.4))}
      if(sD>0){batt(cx-90,cy-30,.8,'#6ff0a4',sD);txt('80%',cx+110,cy-30,76,'#ffffff',sD);txt('COOL · PLUGGED IN',cx,cy+80,28,'#8ef0ff',sD,'center',700)}
    });
    chip(sink,xr,flow*into*(t<st(5)?1:.6));
    deck(xr,sink,heat,t);
    cells(lvl,stress,xr,sink,t,charging);
    // the hinge
    g.fillStyle='#2a3150';rrect(g,LX-DHW0,DT-6+sink*.6,2*DHW0,12,6);g.fill();
    cable(sink,1,flow,t,into);
    // ch1 "wear": the cells lose a sliver of capacity (a grey band eats the top), once, on the word
    const w1=win(t,C.wear-.1,st(2)+.1,.4,.5);if(w1>0&&xr>0){for(let i=0;i<4;i++){const u0=.16+i*.175,u1=u0+.15,v=lerp(.22,.34,eio(prog(t,C.wear,C.wear+.8))),P=[DK(u0+.01,.22,sink),DK(u1-.01,.22,sink),DK(u1-.01,v,sink),DK(u0+.01,v,sink)];g.globalAlpha=w1*xr*.9;quad(P,'#4a5070')}g.globalAlpha=1}
    // ch3: the 80% line across the cells
    const l8=win(t,C.eighty-.1,st(4)+.1,.4,.4)+.8*c6*(1-fin);if(l8>0){const [ax,ay]=DK(.13,lerp(.86,.22,.8),sink),[bx,by]=DK(.87,lerp(.86,.22,.8),sink);g.globalAlpha=clamp(l8)*xr;g.strokeStyle='#8ef0ff';g.lineWidth=4;g.setLineDash([12,10]);g.beginPath();g.moveTo(ax,ay);g.lineTo(bx,by);g.stroke();g.setLineDash([]);g.globalAlpha=1}
    // ch5: heat rising off the blocked vents, ch6: it is gone
    if(hot5>0){g.strokeStyle='rgba(255,122,61,.85)';g.lineWidth=5;for(let k=0;k<3;k++){const q=((t*.45+k/3)%1),yy=DB+sink-20-q*200;g.globalAlpha=hot5*Math.sin(Math.PI*q);g.beginPath();for(let xx=LX-260;xx<=LX+260;xx+=12){const yv=yy+10*Math.sin(xx*.03+t*3+k);xx===LX-260?g.moveTo(xx,yv):g.lineTo(xx,yv)}g.stroke()}g.globalAlpha=1}
    if(hot5>0){for(let i=0;i<10;i++){const q=((t*.5+i/10)%1),x=lerp(LX-300,LX+300,(i+.5)/10)+18*Math.sin(t*2+i),y=DB+sink-10-q*240;glowDot(x,y,7,'#ff7a3d',hot5*(1-q)*.7)}}
    
    if(fin>0){g.globalAlpha=fin*.78;g.fillStyle='#070f22';g.fillRect(-400,0,1900,1900);g.globalAlpha=1}
    if(fin>0){for(let i=0;i<5;i++){const an=t*(.9+i*.17)+i*1.3,x=CX+Math.cos(an)*(300+40*i),y=820+Math.sin(an)*(170+20*i);glowDot(x,y,10+4*(i%2),['#8ef0ff','#6ff0a4','#ffd36b','#ff8f9a','#b9b6ff'][i],fin*.8)}}
  },
  labels(t){
    const c0=1-prog(t,st(1)-.3,st(1)+.2),c6=win(t,st(6)-.1,C.final-.1,.4,.4);
    // the MYTH stamp: frame 0 (the cover) and back on the verdict (F5)
    stamp(800,515,'MYTH?','#ff5d6c',c0,-.1);
    stamp(800,515,'MYTH','#6ff0a4',c6*prog(t,C.plug-.1,C.plug+.3),-.12);
    const c1=win(t,st(1)-.2,st(2)+.1,.4,.4),c2=win(t,st(2)-.2,st(3)+.1,.4,.4),c3=win(t,st(3)-.2,st(4)+.1,.4,.4),c5=win(t,st(5)-.2,st(6)+.1,.4,.4);
    if(c1>0){label(LX-200,DT-40,'100% · FULL','#ffb35c',c1*prog(t,C.full1-.1,C.full1+.2),22,'rgba(44,24,8,.92)');label(LX+220,DT-40,'HOT','#ff5d6c',c1*prog(t,C.hot-.1,C.hot+.2),22,'rgba(44,10,18,.92)')}
    if(c2>0){label(LX,DB+46,'BATTERY RESTS','#6ff0a4',c2*prog(t,C.rests-.1,C.rests+.2),22,'rgba(10,40,24,.92)')}
    if(c3>0)label(LX,DB+46,'HELD AT 80%','#8ef0ff',c3*prog(t,C.eighty-.1,C.eighty+.2),22,'rgba(8,30,44,.92)');
    if(c5>0){label(LX-230,DB+60,'PILLOW','#c9b6ff',c5*prog(t,C.pillow-.1,C.pillow+.2),22,'rgba(30,20,60,.92)');label(LX+220,DB+60,'VENTS BLOCKED','#ff5d6c',c5*prog(t,C.blocked-.1,C.blocked+.2),22,'rgba(44,10,18,.92)')}
  },
  panels(t){
    if(panel('#p0',0,st(1)-.15)>0){}
    if(panel('#p1',st(1)-.1,st(2)-.15)>0){$('#p1a').style.opacity=prog(t,C.full1-.1,C.full1+.2);$('#p1b').style.opacity=prog(t,C.hot-.1,C.hot+.2)}
    if(panel('#p2',st(2)-.1,st(3)-.1)>0)stepFlow('#p2s',[C.stop,C.charger,C.rests],['#6ff0a4','#ffd36b','#6ff0a4']);
    if(panel('#p3',st(3)-.1,st(4)-.1)>0){$('#p3bar').style.width=(lerp(100,80,eio(prog(t,C.eighty-.2,C.eighty+.8))))+'%';$('#p3n').style.opacity=prog(t,C.eighty-.1,C.eighty+.2)}
    if(panel('#p4',st(4)-.1,st(5)-.1)>0)stepFlow('#p4s',[C.optimized,C.limit,C.dell],['#b9b6ff','#8ef0ff','#b9b6ff']);
    if(panel('#p5',st(5)+.1,en(5)+.45)>0){$('#p5bar').style.width=(20+78*prog(t,C.blocked-.4,C.blocked+1.4))+'%';$('#p5h').style.opacity=prog(t,C.blocked,C.blocked+.4)}
    pills(['plug','lim2']);
  }
};
})();
