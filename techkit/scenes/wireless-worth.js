// @techin20sec kit topic: Is wireless charging worth it? (techreel/topics/wireless-worth.json). Worth it or not on the shared kit frame
// (techkit/base.html). Two lanes, one race: a phone on a cable with a 20 W adapter (amber) and a phone on a charging pad with a 30 W adapter
// (cyan) charge side by side, and both reach 50% in the same 30 minutes (Apple's iPhone 16 India spec page, read 20 Nov 2026), so speed is a
// tie; the kit and the convenience decide. The object opens up: the pad's coil rings reach the phone, the phone lifts and drops onto the pad,
// the cable plug is pulled out and pushed in. No rolling digits (a percent never counts through other numbers): the bars fill, the figures pop on
// the word that says them. Drawn generically (no logo, no trade dress).
(function(){
const LA=705,LB=1045;                          // the two lane centres (world y)
const PX0=320,PW0=420,PH0=200;                 // the phone: left, width, height (top-down, lying flat)
const PADX=280,PADW=500,PADH=290;              // the pad under the phone
const COLA='#ffb35c',COLB='#8ef0ff',GRN='#6ff0a4',GLD='#ffd36b';
const RM=mulberry(7),MOTES=[...Array(36)].map(()=>({x:RM()*1040+20,y:RM(),r:3+RM()*5,v:.05+RM()*.05,ph:RM()*6}));
function txt(s,x,y,size,col,a=1,al='center',w=800){if(a<=0)return;g.globalAlpha=clamp(a);g.font=`${w} ${size}px "Inter Display",Inter`;g.textAlign=al;g.textBaseline='middle';g.fillStyle=col;g.fillText(s,x,y);g.globalAlpha=1}
// the charge level of a lane at t: both drift up from a little, the wireless lane lags while "people assume" it is slower, then catches up on
// "otherwise"; on the fix both reset and race to the same 50% (Apple's own figure), landing together
function pre(L,t){let a=.08+.14*prog(t,0,st(2)-.3);if(L===1)a=.08+(a-.08)*(1-.5*eio(prog(t,C.assume,C.slow+.5))*(1-eio(prog(t,C.other-.1,C.other+.6))));return a}
function lvl(L,t){const t0=st(2)+.05,t1=C.thm+.35;if(t<st(2)-.3)return pre(L,t);
  if(t<t0)return pre(L,st(2)-.3)*(1-eio(prog(t,st(2)-.3,t0)));return .5*eoc(prog(t,t0,t1))}
function flowDots(pts,t,col,a,n=4){if(a<=0)return;for(let k=0;k<n;k++){const u=((t*.55+k/n)%1)*(pts.length-1),i=Math.min(pts.length-2,Math.floor(u)),f=u-i;glowDot(lerp(pts[i][0],pts[i+1][0],f),lerp(pts[i][1],pts[i+1][1],f),7,col,a*.9)}}
// the phone lying flat, seen from above: its screen is one big battery that fills to the charge level (fuzz blurs the fill's end: "up to")
function phone(x,y,lv,col,a,sc=1,on=1,t=0,fuzz=0){g.save();g.globalAlpha=a;g.translate(x+PW0/2,y+PH0/2);g.scale(sc,sc);g.translate(-PW0/2,-PH0/2);
  g.shadowColor='rgba(0,0,0,.55)';g.shadowBlur=34*sc;g.shadowOffsetY=12*sc;rrect(g,0,0,PW0,PH0,42);g.fillStyle='#12172e';g.fill();g.shadowBlur=0;g.shadowOffsetY=0;g.strokeStyle='rgba(200,210,255,.6)';g.lineWidth=4;g.stroke();
  rrect(g,10,10,PW0-20,PH0-20,34);g.fillStyle='#070a18';g.fill();g.save();rrect(g,10,10,PW0-20,PH0-20,34);g.clip();
  const gr=g.createRadialGradient(PW0*.5,PH0*.5,0,PW0*.5,PH0*.5,PW0*.6);gr.addColorStop(0,col+'55');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,PW0,PH0);
  const bx=PW0/2-140,by=PH0/2-48,bw=264,bh=96;g.strokeStyle='rgba(230,236,255,.9)';g.lineWidth=6;rrect(g,bx,by,bw,bh,22);g.stroke();g.fillStyle='rgba(230,236,255,.9)';rrect(g,bx+bw+5,by+30,12,36,5);g.fill();
  const fw=Math.max(0,(bw-20)*clamp(lv));
  if(fw>2){g.fillStyle=col;g.shadowColor=col;g.shadowBlur=18;rrect(g,bx+10,by+10,fw,bh-20,12);g.fill();g.shadowBlur=0;
    g.save();rrect(g,bx+10,by+10,fw,bh-20,12);g.clip();g.globalAlpha=a*.25;g.fillStyle='#ffffff';for(let k=-1;k<bw/34+2;k++){const xx=bx+10+((k*34+t*190)%(bw+68))-34;g.beginPath();g.moveTo(xx,by+bh-10);g.lineTo(xx+17,by+10);g.lineTo(xx+32,by+10);g.lineTo(xx+15,by+bh-10);g.closePath();g.fill()}g.restore();
    if(fuzz>0){const f=Math.min(fw,70),wob=4*Math.sin(t*2.2)*fuzz;g.save();rrect(g,bx+10,by+10,fw,bh-20,12);g.clip();const gf=g.createLinearGradient(bx+10+fw-f,0,bx+10+fw,0);gf.addColorStop(0,'rgba(7,10,24,0)');gf.addColorStop(1,`rgba(7,10,24,${.85*fuzz})`);g.fillStyle=gf;g.fillRect(bx+10+fw-f+wob,by+8,f,bh-16);g.restore()}}
  if(on>0){const bo=.6+.4*Math.sin(t*5);g.globalAlpha=a*on*bo;g.fillStyle='#fff';const cx=bx+bw/2,cy=by+bh/2;g.beginPath();g.moveTo(cx+4,cy-34);g.lineTo(cx-22,cy+6);g.lineTo(cx-3,cy+6);g.lineTo(cx-10,cy+36);g.lineTo(cx+22,cy-8);g.lineTo(cx+2,cy-8);g.closePath();g.fill()}
  g.restore();g.restore()}
function brick(x,y,s,col,a,word,wa){if(a<=0)return;g.save();g.globalAlpha=a;g.translate(x,y);g.scale(s,s);g.shadowColor='rgba(0,0,0,.5)';g.shadowBlur=20;rrect(g,-44,-58,88,116,18);g.fillStyle='#1a2048';g.fill();g.shadowBlur=0;g.strokeStyle=col;g.lineWidth=4;g.stroke();
  g.fillStyle=col;g.fillRect(-16,-76,8,20);g.fillRect(8,-76,8,20);g.restore();if(word){txt(word,x,y-4,34*s,'#ffffff',a*wa,'center',900);txt('ADAPTER',x,y+30*s,15*s,col,a*wa,'center',800)}}
// the cable: a curve from the brick to the plug, a plug that can be pulled out by off px
function cable(L,t,off,flow){const x0=262,y0=L,x1=PX0-12-off,y1=L;const P4=(u)=>{const m=1-u;return[m*m*m*x0+3*m*m*u*(x0+26)+3*m*u*u*(x1-26)+u*u*u*x1,m*m*m*y0+3*m*m*u*(y0-34)+3*m*u*u*(y1+30)+u*u*u*y1]};
  g.save();g.lineCap='round';g.strokeStyle='#cfd6ff';g.lineWidth=11;g.beginPath();g.moveTo(x0,y0);g.bezierCurveTo(x0+26,y0-34,x1-26,y1+30,x1,y1);g.stroke();
  g.strokeStyle='#1a2048';g.lineWidth=5;g.stroke();rrect(g,x1,y1-20,28,40,7);g.fillStyle='#cfd6ff';g.fill();g.restore();
  if(flow>0){const pts=[];for(let k=0;k<=12;k++)pts.push(P4(k/12));flowDots(pts,t,COLA,flow,3)}}
function stamp(x,y,word,col,a,rot){if(a<=0)return;const sc=1+.35*(1-eob(clamp(a)));g.save();g.globalAlpha=clamp(a);g.translate(x,y);g.rotate(rot);g.scale(sc,sc);g.font='900 52px "Inter Display",Inter';
  const w=g.measureText(word).width+50;g.strokeStyle=col;g.lineWidth=7;rrect(g,-w/2,-44,w,88,14);g.stroke();g.fillStyle=col;g.textAlign='center';g.textBaseline='middle';g.fillText(word,0,4);g.restore();
  if(a>.3){const r=w/2+16;BOXES.push([word,x-r,x+r,y-60,y+60])}}

window.TOPIC={
  title:'Wireless <em>worth it?</em>',eyebrow:'CHARGERS · WORTH IT OR NOT',final:"Convenience,<br>not <em>speed.</em>",
  vars:{'--bg1':'#10284a','--bg2':'#070c1e','--blob1':'#2a8cff','--blob2':'#ffb35c','--blob3':'#22d3ee','--tgrad':'linear-gradient(100deg,#8ef0ff,#6ff0a4 50%,#ffd36b)'},
  chips:[['THE QUESTION','#8ef0ff'],['THE ASSUMPTION','#ffb35c'],['THE RACE','#6ff0a4'],['THE KIT','#b9b6ff'],['THE CONVENIENCE','#ff8f9a'],['THE SMALL PRINT','#ffd36b'],['RECAP','#8ef0ff']],
  keyw:/^(wireless|cable|slower|assume|otherwise|twenty|fifty|thirty|minutes|magsafe|tie|kit|adapter|separately|convenience|drop|plug|catch|drained|tests|speed|check|worth)$/i,
  jolts:[],
  cover:true,   // frame 0 is the reel's cover (rules-tech.md K3)
  holds:()=>[[+(C.final+.8).toFixed(2),TL.total]],
  css:'.step .s{font-size:30px;letter-spacing:0}.step .n{font-size:18px}',
  html:`
  <div class="panel" id="p0"><div style="position:absolute;left:36px;top:26px" class="lab">THE QUESTION</div>
    <div class="big" style="position:absolute;left:36px;top:54px;font-size:46px;color:#8ef0ff">WIRELESS: WORTH IT?</div></div>
  <div class="panel" id="p1"><div style="position:absolute;left:36px;top:26px" class="lab">WHAT PEOPLE ASSUME</div>
    <div class="big" style="position:absolute;left:36px;top:54px;font-size:46px;color:#ffb35c" id="p1a">WIRELESS IS SLOWER</div></div>
  <div class="panel" id="p2" style="background:none;border:none;box-shadow:none;overflow:visible"><div class="steps" id="p2s">
    <div class="step"><div class="n">CABLE + 20 W</div><div class="s">UP TO 50%</div></div><div class="arrow">=</div>
    <div class="step"><div class="n">MAGSAFE + 30 W</div><div class="s">UP TO 50%</div></div></div></div>
  <div class="panel" id="p3"><div style="position:absolute;left:36px;top:26px" class="lab">THE KIT FOR THAT SPEED</div>
    <div class="big" style="position:absolute;left:36px;top:54px;font-size:50px;color:#b9b6ff" id="p3a">30 W ADAPTER + PAD</div></div>
  <div class="panel" id="p4"><div style="position:absolute;left:36px;top:26px" class="lab">WHAT YOU PAY FOR</div>
    <div class="big" style="position:absolute;left:36px;top:54px;font-size:56px;color:#ff8f9a" id="p4a">CONVENIENCE</div></div>
  <div class="panel" id="p5"><div style="position:absolute;left:36px;top:26px" class="lab">APPLE'S OWN TEST</div>
    <div class="big" style="position:absolute;left:36px;top:54px;font-size:38px;color:#ffd36b" id="p5a">DRAINED PHONE · RIGHT ADAPTER</div></div>
  <div class="pill" id="pl1" style="top:1060px;border-color:rgba(255,143,154,.6)"><div class="ic" style="background:rgba(255,143,154,.18);color:#ffc2c9">✓</div>Wireless buys convenience</div>
  <div class="pill" id="pl2" style="top:1170px;border-color:rgba(255,211,107,.6)"><div class="ic" style="background:rgba(255,211,107,.18);color:#ffe7a8">W</div>Check the adapter watts</div>`,
  cam(){const F=[1.16,0,-150];
    return [[0,[1,0,0]],[st(1),[1.04,0,-8]],[st(2),[1,0,0]],[st(3),[1.05,0,-14]],[st(4)-.3,[1.02,0,-6]],[st(4)+.6,F,'expo'],[st(5)-.3,[1.18,0,-150]],[st(5)+.6,[1.04,0,0],'expo'],[st(6)-.3,[1.06,0,-6]],[st(6)+.6,[.85,0,-110],'expo']]},
  hero(t,{fin}){
    const WT=t,eRace=prog(t,st(2)+.05,C.thm+.35),lA=lvl(0,t),lB=lvl(1,t),MID=(LA+LB)/2+4;
    for(const m of MOTES){const y=1230-((m.y+t*m.v)%1)*780;glowDot(m.x+10*Math.sin(t*.4+m.ph),y,m.r,'#8ef0ff',.28)}
    subj(170,555,910,1195);
    // ---- lane names ----
    txt('CABLE',175,LA-128,40,COLA,1,'left',800);txt('WIRELESS PAD',175,LB-168,40,COLB,1,'left',800);
    const fz=eio(prog(t,C.upto-.2,C.upto+.7)),glow=win(t,C.same-.1,C.same+1.1,.2,.5);
    // ---- lane A: the adapter, the cable (the plug is pulled out and pushed in on "plug"), the phone ----
    const out=54*eoc(prog(t,C.plug-.4,C.plug+.1))*(1-eoc(prog(t,C.plug+.5,C.plug+1.0))),plugged=1-clamp(out/24);
    brick(215,LA,1,COLA,1,'20 W',prog(t,C.tw-.1,C.tw+.25));
    cable(LA,t,out,plugged*.9);
    phone(PX0,LA-PH0/2,lA,COLA,1,1,plugged,t,fz);
    // ---- lane B: the adapter, its cable to the pad, the pad with its coil rings, the phone (lifted, then dropped on "drop") ----
    const bs=1+.25*eoc(prog(t,C.a30-.2,C.a30+.5));
    brick(215,LB+44,bs,COLB,1,'30 W',prog(t,C.t30-.1,C.t30+.25));
    g.save();g.lineCap='round';g.strokeStyle='#cfd6ff';g.lineWidth=11;g.beginPath();g.moveTo(262,LB+44);g.bezierCurveTo(270,LB+80,262,LB+6,PADX,LB);g.stroke();g.strokeStyle='#1a2048';g.lineWidth=5;g.stroke();g.restore();
    g.save();g.shadowColor='rgba(142,240,255,.35)';g.shadowBlur=34;rrect(g,PADX,LB-PADH/2,PADW,PADH,60);g.fillStyle='#161d46';g.fill();g.shadowBlur=0;g.strokeStyle='rgba(142,240,255,.6)';g.lineWidth=4;g.stroke();g.restore();
    const sep=win(t,C.sep-.3,en(3)+.2,.3,.4);
    if(sep>0){g.save();g.globalAlpha=sep;g.strokeStyle=GLD;g.lineWidth=7;rrect(g,PADX-9,LB-PADH/2-9,PADW+18,PADH+18,68);g.stroke();g.restore()}
    const lift=-90*eoc(prog(t,st(4)+.1,st(4)+.6))*(1-eob(prog(t,C.drop-.2,C.drop+.4))),held=lift<-6?0:1;
    for(let k=0;k<3;k++){const r=62+k*34+5*Math.sin(WT*2+k);ring(PADX+PADW/2,LB,r,COLB,.5-k*.1,5)}
    // the field: rings reach out of the pad toward the phone while it charges (not while the phone is lifted); sparks rise with them
    for(let k=0;k<3;k++){const q=((WT*.7+k/3)%1);ring(PADX+PADW/2,LB,40+q*150,COLB,(1-q)*.45*held,4)}
    if(held)for(let k=0;k<6;k++){const q=((WT*.6+k/6)%1),ang=k*1.05+WT*.3;glowDot(PADX+PADW/2+Math.cos(ang)*(50+q*90),LB+Math.sin(ang)*(30+q*50),5,COLB,(1-q)*.8)}
    const land=prog(t,C.drop+.1,C.drop+.7);if(land>0&&land<1)ring(PADX+PADW/2,LB,90+110*eoc(land),COLB,(1-land)*.9,8);
    for(const [cy,col,on] of [[LA,COLA,plugged],[LB+lift,COLB,held]])if(on>0)for(let k=0;k<4;k++){const an=WT*1.6+k*Math.PI/2,x=PX0+PW0/2+Math.cos(an)*(PW0/2+26),y=cy+Math.sin(an)*(PH0/2+26);glowDot(x,y,8,col,.85*on)}
    phone(PX0,LB-PH0/2+lift,lB,COLB,1,1+.1*(-lift/90),held,t,fz);
    // ---- 50% pops beside both phones when "fifty" is said (static figures, nothing rolls); both phones glow green together on "matches" ----
    const pf=prog(t,C.ff-.1,C.ff+.25);txt('50%',855,LA,64,'#ffffff',pf,'center',900);txt('50%',855,LB,64,'#ffffff',pf,'center',900);
    if(glow>0){g.save();g.globalAlpha=glow;g.strokeStyle=GRN;g.lineWidth=6;g.shadowColor=GRN;g.shadowBlur=30;rrect(g,PX0-8,LA-PH0/2-8,PW0+16,PH0+16,50);g.stroke();rrect(g,PX0-8,LB-PH0/2-8,PW0+16,PH0+16,50);g.stroke();g.restore()}
    txt('=',855,MID,110,GRN,prog(t,C.same,C.same+.35)*(1-prog(t,st(4)-.2,st(4)+.2)),'center',900);
    // the stopwatch ring runs with the race and closes at "thirty minutes"; the stamp "A TIE" takes its place on "tie"
    {const a=prog(t,st(2)-.1,st(2)+.3)*(1-prog(t,C.tie-.2,C.tie+.2));if(a>0){const cx=530,cy=MID;g.globalAlpha=a;g.strokeStyle='rgba(111,240,164,.25)';g.lineWidth=10;g.beginPath();g.arc(cx,cy,38,0,7);g.stroke();
      g.strokeStyle=GRN;g.lineCap='round';g.beginPath();g.arc(cx,cy,38,-Math.PI/2,-Math.PI/2+eRace*Math.PI*2);g.stroke();g.globalAlpha=1}}
    // ch5: the test bench: amber corners round both lanes, the fills' ends fuzzed (above)
    const tb=win(t,C.catch-.1,en(5)+.1,.4,.4);if(tb>0){corners(166,560,748,264,GLD,tb);corners(166,872,748,330,GLD,tb)}
    if(fin>0){g.globalAlpha=fin*.78;g.fillStyle='#0b0820';g.fillRect(-400,0,1900,1900);g.globalAlpha=1}
    if(fin>0){for(let i=0;i<5;i++){const an=t*(.9+i*.17)+i*1.3,x=CX+Math.cos(an)*(300+40*i),y=820+Math.sin(an)*(170+20*i);glowDot(x,y,10+4*(i%2),['#8ef0ff','#6ff0a4','#ffd36b','#ff8f9a','#b9b6ff'][i],fin*.8)}}
  },
  labels(t){
    const MID=(LA+LB)/2+4;
    const c1=win(t,st(1)-.2,st(2)-.2,.4,.4);if(c1>0)label(700,LB-170,'WHAT PEOPLE ASSUME',COLA,c1*prog(t,C.assume-.1,C.assume+.25),28,'rgba(44,24,8,.92)');
    const tie=win(t,C.tie-.1,st(4)-.1,.3,.4);if(tie>0)stamp(530,MID,'A TIE',GRN,tie*prog(t,C.tie-.1,C.tie+.3),-.06);
    const c3=win(t,C.sep-.2,st(4)-.1,.35,.4);if(c3>0)label(530,LB+150,'PAD SOLD SEPARATELY',GLD,c3*prog(t,C.sep-.1,C.sep+.2),28,'rgba(44,36,8,.92)');
    const c4=win(t,st(4)-.1,st(5)-.1,.4,.4);if(c4>0){label(700,LB+150,'DROP IT: NO CABLE',COLB,c4*prog(t,C.drop-.1,C.drop+.25),28,'rgba(8,32,44,.92)');label(360,LA+135,'PLUG IN EVERY TIME',COLA,c4*prog(t,C.plug-.1,C.plug+.25),28,'rgba(44,24,8,.92)')}
    const c5=win(t,C.catch-.1,st(6)-.1,.4,.4);if(c5>0){label(700,LA-128,'DRAINED PHONE',GLD,c5*prog(t,C.drained-.1,C.drained+.25),28,'rgba(44,36,8,.92)');label(700,LB-170,'RIGHT ADAPTER',GLD,c5*prog(t,C.adap-.1,C.adap+.25),28,'rgba(44,36,8,.92)');label(855,LB+80,'UP TO',COLB,c5*prog(t,C.upto-.1,C.upto+.2),28,'rgba(8,32,44,.92)')}
  },
  panels(t){
    if(panel('#p0',0,st(1)-.15)>0){}
    if(panel('#p1',st(1)-.1,st(2)-.15)>0){$('#p1a').style.opacity=prog(t,C.slow-.1,C.slow+.25)}
    if(panel('#p2',st(2)-.1,st(3)-.1)>0){stepFlow('#p2s',[C.cab2,C.mag],[COLA,COLB]);$$('#p2s .step .s').forEach((s,i)=>s.style.opacity=prog(t,[C.ff,C.same][i]-.05,[C.ff,C.same][i]+.2))}
    if(panel('#p3',st(3)-.1,st(4)-.1)>0){$('#p3a').style.opacity=prog(t,C.a30-.1,C.a30+.25)}
    if(panel('#p4',st(4)-.1,st(5)-.1)>0){$('#p4a').style.opacity=prog(t,C.conv-.1,C.conv+.25)}
    if(panel('#p5',st(5)+.1,en(5)+.45)>0){$('#p5a').style.opacity=prog(t,C.drained-.1,C.drained+.25)}
    pills(['cv2','sp2']);
  }
};
})();
