// @techin20sec kit topic: What does "up to 22 hours" on a phone really mean? (techreel/topics/phone-claim.json). Specs decoded on the shared
// kit frame (techkit/base.html). One phone, drawn generically (no logo): the number fills the screen at frame 0, then the phone sits in a lab
// test stand, its screen turns into the small print (video 22 h, streamed 18 h, audio 80 h, drawn to scale), the ends of the bars blur to
// "varies by use and settings", and a ceiling line shows where "up to" stops. Every figure is Apple's own iPhone 16 India spec page, read 19 Nov 2026.
(function(){
const PXc=540,PT=505,PB=1195,PWd=440;          // the phone: centre x, top, bottom, width
const SX=PXc-PWd/2+16,SY=PT+16,SW=PWd-32,SH=PB-PT-32;   // its screen
const BX=SX+34,BW=SW-68;                        // the bars' left edge and full width
const RM=mulberry(11),MOTES=[...Array(40)].map(()=>({x:RM()*1040+20,y:RM(),r:3+RM()*5,v:.05+RM()*.05,ph:RM()*6}));
const bump=(t,t0,d=.6)=>Math.sin(Math.PI*prog(t,t0,t0+d));
function txt(s,x,y,size,col,a=1,al='center',w=800){if(a<=0)return;g.globalAlpha=clamp(a);g.font=`${w} ${size}px "Inter Display",Inter`;g.textAlign=al;g.textBaseline='middle';g.fillStyle=col;g.fillText(s,x,y);g.globalAlpha=1}
function body(a){g.save();g.globalAlpha=a;g.shadowColor='rgba(122,92,255,.5)';g.shadowBlur=50;rrect(g,PXc-PWd/2,PT,PWd,PB-PT,54);g.fillStyle='#12172e';g.fill();g.shadowBlur=0;g.strokeStyle='rgba(200,210,255,.55)';g.lineWidth=3;g.stroke();
  rrect(g,SX,SY,SW,SH,40);g.fillStyle='#070a18';g.fill();g.restore()}
let WT=0;
function screen(draw){g.save();rrect(g,SX,SY,SW,SH,40);g.clip();
  for(let k=0;k<3;k++){const cx=SX+SW*(.5+.4*Math.sin(WT*.9+k*2.1)),cy=SY+SH*(.5+.42*Math.cos(WT*.7+k*1.7)),gr=g.createRadialGradient(cx,cy,0,cx,cy,SW*.8),c=[[122,92,255],[34,211,238],[255,179,92]][k];
    gr.addColorStop(0,`rgba(${c.join(',')},.42)`);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(SX,SY,SW,SH)}
  draw();g.restore();
  rrect(g,PXc-52,SY+14,104,30,15);g.fillStyle='#02030a';g.fill()}   // the island
function battH(x,y,lvl,col,a){if(a<=0)return;g.globalAlpha=a;g.strokeStyle='rgba(230,236,255,.85)';g.lineWidth=5;rrect(g,x-110,y-30,212,60,14);g.stroke();g.fillStyle='rgba(230,236,255,.85)';rrect(g,x+106,y-11,9,22,4);g.fill();
  g.fillStyle=col;g.shadowColor=col;g.shadowBlur=14;rrect(g,x-102,y-22,196*clamp(lvl),44,8);g.fill();g.shadowBlur=0;g.globalAlpha=1}
function icon(kind,x,y,col,a){if(a<=0)return;g.save();g.globalAlpha=a;g.strokeStyle=col;g.fillStyle=col;g.lineWidth=5;g.lineCap='round';g.lineJoin='round';
  if(kind==='play'){g.beginPath();g.moveTo(x-9,y-14);g.lineTo(x+14,y);g.lineTo(x-9,y+14);g.closePath();g.fill()}
  if(kind==='wifi'){for(let k=1;k<=3;k++){g.beginPath();g.arc(x,y+14,k*10,Math.PI*1.2,Math.PI*1.8);g.stroke()}g.beginPath();g.arc(x,y+14,3,0,7);g.fill()}
  if(kind==='note'){g.beginPath();g.arc(x-6,y+12,7,0,7);g.fill();g.beginPath();g.moveTo(x+1,y+12);g.lineTo(x+1,y-14);g.lineTo(x+14,y-8);g.stroke()}
  if(kind==='you'){g.beginPath();g.arc(x,y-6,7,0,7);g.stroke();g.beginPath();g.moveTo(x-12,y+16);g.quadraticCurveTo(x,y+2,x+12,y+16);g.stroke()}
  g.restore()}
// a row: icon, label, big number, and a bar to scale (frac of the full width), its end blurred by fuzz 0-1 ("up to")
function row(y,kind,label,num,frac,col,a,fuzz,t,dash){if(a<=0)return;
  icon(kind,SX+56,y,col,a);txt(label,SX+90,y-2,30,'#c9d0f0',a,'left',700);txt(num,SX+SW-34,y-2,56,'#ffffff',a,'right',900);
  const by=y+44;g.globalAlpha=a*.3;g.fillStyle='rgba(255,255,255,.18)';rrect(g,BX,by-12,BW,24,12);g.fill();
  const w=Math.max(0,BW*frac);if(w>2){g.globalAlpha=a;const gr=g.createLinearGradient(BX,0,BX+w,0);gr.addColorStop(0,col);gr.addColorStop(1,col);g.fillStyle=col;g.shadowColor=col;g.shadowBlur=14;
    rrect(g,BX,by-12,w,24,12);g.fill();g.shadowBlur=0;
    {g.save();rrect(g,BX,by-12,w,24,12);g.clip();g.globalAlpha=a*.22;g.fillStyle='#ffffff';for(let k=-1;k<BW/28+2;k++){const x=BX+((k*28+t*70)%(BW+56))-28;g.beginPath();g.moveTo(x,by+12);g.lineTo(x+14,by-12);g.lineTo(x+26,by-12);g.lineTo(x+12,by+12);g.closePath();g.fill()}g.restore();
      const q=((t*.6+y*.003)%1);glowDot(BX+w*q,by,7,'#ffffff',a*.8*(1-q*.4))}
    if(fuzz>0){const f=Math.min(w,70),wob=3*Math.sin(t*2.2+y*.01)*fuzz;g.save();rrect(g,BX,by-12,w,24,12);g.clip();const gf=g.createLinearGradient(BX+w-f,0,BX+w,0);gf.addColorStop(0,'rgba(7,10,24,0)');gf.addColorStop(1,`rgba(7,10,24,${.85*fuzz})`);g.fillStyle=gf;g.fillRect(BX+w-f+wob,by-14,f,28);
      g.strokeStyle=col;g.lineWidth=2;g.setLineDash([6,7]);g.globalAlpha=a*fuzz;g.beginPath();g.moveTo(BX+w-f+wob,by-12);g.lineTo(BX+w,by-12);g.moveTo(BX+w-f+wob,by+12);g.lineTo(BX+w,by+12);g.stroke();g.setLineDash([]);g.restore()}}
  if(dash){g.globalAlpha=a*.9;g.strokeStyle=col;g.lineWidth=3;g.setLineDash([9,9]);rrect(g,BX,by-12,Math.max(2,BW*dash),24,12);g.stroke();g.setLineDash([])}
  g.globalAlpha=1}
function stamp(x,y,word,col,a,rot){if(a<=0)return;const sc=1+.35*(1-eob(clamp(a)));g.save();g.globalAlpha=clamp(a);g.translate(x,y);g.rotate(rot);g.scale(sc,sc);g.font='900 52px "Inter Display",Inter';
  const w=g.measureText(word).width+50;g.strokeStyle=col;g.lineWidth=7;rrect(g,-w/2,-48,w,96,14);g.stroke();g.fillStyle=col;g.textAlign='center';g.textBaseline='middle';g.fillText(word,0,4);g.restore();
  if(a>.3){const r=w/2+16;BOXES.push([word,x-r,x+r,y-64,y+64])}}

window.TOPIC={
  title:'Up to <em>22 hours?</em>',eyebrow:'PHONES · SPECS DECODED',final:"That's the<br>'up to'<br><em>ceiling.</em>",
  vars:{'--bg1':'#22144a','--bg2':'#0b0820','--blob1':'#7a5cff','--blob2':'#ffb35c','--blob3':'#22d3ee','--tgrad':'linear-gradient(100deg,#8ef0ff,#b9b6ff 45%,#ffd36b)'},
  chips:[['THE CLAIM','#8ef0ff'],['THE TEST','#ffb35c'],['THE SMALL PRINT','#6ff0a4'],['MUSIC','#b9b6ff'],['YOUR USE','#ff8f9a'],['THE CEILING','#ffd36b'],['RECAP','#8ef0ff']],
  keyw:/^(up|twenty|twenty-two|hours|video|test|apple|apple's|specific|print|streamed|eighteen|music|eighty|varies|settings|apps|ceiling|promise|closest|check|number)$/i,
  jolts:[],
  cover:true,   // frame 0 is the reel's cover (rules-tech.md K3)
  holds:()=>[[+(C.final+.8).toFixed(2),TL.total]],
  css:'.step .s{font-size:30px;letter-spacing:0}.step .n{font-size:18px}',
  html:`
  <div class="panel" id="p0"><div style="position:absolute;left:36px;top:26px" class="lab">THE CLAIM ON THE BOX</div>
    <div class="big" style="position:absolute;left:36px;top:54px;font-size:46px;color:#8ef0ff">UP TO 22 H OF VIDEO</div></div>
  <div class="panel" id="p1"><div style="position:absolute;left:36px;top:26px" class="lab">WHERE THE NUMBER COMES FROM</div>
    <div class="big" style="position:absolute;left:36px;top:54px;font-size:46px;color:#ffb35c">A LAB TEST · SET UP</div></div>
  <div class="panel" id="p2" style="background:none;border:none;box-shadow:none;overflow:visible"><div class="steps" id="p2s">
    <div class="step"><div class="n">VIDEO</div><div class="s">22 H</div></div><div class="arrow">›</div>
    <div class="step"><div class="n">STREAMED</div><div class="s">18 H</div></div></div></div>
  <div class="panel" id="p3"><div style="position:absolute;left:36px;top:26px" class="lab">MUSIC · A THIRD NUMBER</div>
    <div class="big" style="position:absolute;left:36px;top:54px;font-size:56px;color:#b9b6ff" id="p3n">UP TO 80 H</div></div>
  <div class="panel" id="p4"><div style="position:absolute;left:36px;top:26px" class="lab">APPLE'S PAGE ADDS</div>
    <div class="big" style="position:absolute;left:36px;top:54px;font-size:38px;color:#ff8f9a" id="p4a">VARIES BY USE AND SETTINGS</div></div>
  <div class="panel" id="p5"><div style="position:absolute;left:36px;top:26px" class="lab">READ "UP TO" AS</div>
    <div class="big" style="position:absolute;left:36px;top:54px;font-size:56px;color:#ffd36b">A CEILING</div>
    <div style="position:absolute;right:36px;top:26px;text-align:right"><div class="lab">NOT</div><div class="big" style="font-size:36px;color:#9aa3c8;margin-top:10px" id="p5b">A PROMISE</div></div></div>
  <div class="pill" id="pl1" style="top:1060px;border-color:rgba(255,211,107,.6)"><div class="ic" style="background:rgba(255,211,107,.18);color:#ffe7a8">≤</div>"Up to" is a ceiling</div>
  <div class="pill" id="pl2" style="top:1170px;border-color:rgba(78,226,138,.6)"><div class="ic" style="background:rgba(78,226,138,.18);color:#8ff0b8">✓</div>Compare the streamed number</div>`,
  cam(){const Z=[1,0,0];
    return [[0,Z],[.8,Z],[st(1)-.3,Z],[st(1)+.5,[1.05,0,-20],'expo'],[st(2)-.3,[1.05,0,-20]],[st(2)+.5,[1.08,0,10],'expo'],[st(3)-.3,[1.08,0,10]],[st(3)+.5,[1.05,0,0],'expo'],
      [st(4)-.3,[1.05,0,0]],[st(4)+.5,[1.07,0,-10],'expo'],[st(5)-.3,[1.07,0,-10]],[st(5)+.5,[1.05,0,0],'expo'],[st(6)-.3,[1.05,0,0]],[st(6)+.6,[.85,0,-110],'expo']]},
  hero(t,{fin}){
    const c0=1-prog(t,st(1)-.2,st(1)+.3),c1=win(t,st(1)-.25,st(2)+.2,.45,.45),c2=win(t,st(2)-.2,TL.total+1,.45,.45),c6=prog(t,st(6)-.2,st(6)+.6);
    WT=t;
    for(const m of MOTES){const y=1230-((m.y+t*m.v)%1)*780;glowDot(m.x+10*Math.sin(t*.4+m.ph),y,m.r,'#b9b6ff',.3)}
    subj(PXc-PWd/2-20,PT,PXc+PWd/2+20,PB);
    // ch1: the lab stand: two amber brackets close round the phone, a stopwatch ring runs beside it
    const br=win(t,st(1)-.2,st(2)-.1,.45,.45);
    if(br>0){const m=24*(1-eoc(prog(t,st(1)-.1,st(1)+.5)));g.save();g.globalAlpha=br;g.strokeStyle='#ffb35c';g.lineWidth=7;g.lineCap='round';g.shadowColor='#ffb35c';g.shadowBlur=18;
      const L=PXc-PWd/2-18-m,R=PXc+PWd/2+18+m,T=PT-14-m,B=PB+14+m,k=60;
      [[L,T,1,1],[R,T,-1,1],[L,B,1,-1],[R,B,-1,-1]].forEach(([x,y,sx,sy])=>{g.beginPath();g.moveTo(x,y+sy*k);g.lineTo(x,y);g.lineTo(x+sx*k,y);g.stroke()});g.shadowBlur=0;g.restore();
      const cx=PXc+PWd/2+110,cy=PT+110,u=(t*.5)%1;g.globalAlpha=br;g.strokeStyle='rgba(255,179,92,.35)';g.lineWidth=8;g.beginPath();g.arc(cx,cy,48,0,7);g.stroke();g.strokeStyle='#ffb35c';g.lineCap='round';g.beginPath();g.arc(cx,cy,48,-Math.PI/2,-Math.PI/2+u*Math.PI*2);g.stroke();g.globalAlpha=1}
    body(1);
    screen(()=>{
      // ch0: the number fills the screen; the battery is full; a question mark on "day"
      if(c0>0){const n=22,u=prog(t,.9,C.day+.6),CYn=SY+330;for(let i=0;i<n;i++){const an=-Math.PI/2+i/n*Math.PI*2,lit=i<Math.floor(u*n+1);g.globalAlpha=c0*(lit?.95:.22);g.strokeStyle=lit?'#8ef0ff':'rgba(200,210,255,.6)';g.lineWidth=lit?7:4;g.lineCap='round';
          g.beginPath();g.moveTo(PXc+Math.cos(an)*150,CYn+Math.sin(an)*150);g.lineTo(PXc+Math.cos(an)*176,CYn+Math.sin(an)*176);g.stroke()}g.globalAlpha=1;
        txt('UP TO',PXc,SY+112,38,'#9aa3c8',c0,'center',700);txt('22',PXc,CYn-8,190,'#ffffff',c0,'center',900);txt('HOURS',PXc,CYn+80,48,'#8ef0ff',c0,'center',800);
        battH(PXc-6,SY+590,1,'#6ff0a4',c0);const q=bump(t,C.day-.1,.9);txt('?',PXc+170,SY+590,70*(1+.3*q),'#ffd36b',c0*prog(t,C.day-.1,C.day+.2),'center',900)}
      // ch1: video playing the whole time, its progress bar looping
      if(c1>0){const u=(t*.5)%1,pc=PXc,pcy=SY+270;g.globalAlpha=c1;g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=6;g.beginPath();g.arc(pc,pcy,92,0,7);g.stroke();g.globalAlpha=c1;g.fillStyle='#fff';g.beginPath();g.moveTo(pc-28,pcy-44);g.lineTo(pc+52,pcy);g.lineTo(pc-28,pcy+44);g.closePath();g.fill();
        g.globalAlpha=c1*.3;g.fillStyle='#fff';rrect(g,BX,SY+430,BW,14,7);g.fill();g.globalAlpha=c1;g.fillStyle='#ffb35c';rrect(g,BX,SY+430,Math.max(6,BW*u),14,7);g.fill();g.globalAlpha=1;
        txt('PLAYING THE WHOLE TIME',PXc,SY+500,24,'#ffd9a8',c1*prog(t,C.whole-.1,C.whole+.3),'center',800);txt('ONE TEST SETUP',PXc,SY+560,22,'#c9d0f0',c1*prog(t,C.specific-.1,C.specific+.3),'center',700)}
      // ch2-ch5: the small print, drawn to scale
      if(c2>0){const S=lerp(22,80,eio(prog(t,C.eighty-.2,C.eighty+.9))),f1=eoc(prog(t,C.tt-.1,C.tt+.7)),f2=eoc(prog(t,C.eighteen-.3,C.eighteen+.6)),f3=eoc(prog(t,C.eighty-.2,C.eighty+.9));
        const fz=eio(prog(t,C.varies-.2,C.varies+.7))*(1-prog(t,C.ceiling-.2,C.ceiling+.3)*.2);
        row(SY+110,'play','VIDEO','22 h',22/S*f1,'#6ff0a4',c2*prog(t,C.print-.1,C.print+.25),fz,t);
        row(SY+240,'wifi','STREAMED','18 h',18/S*f2,'#8ef0ff',c2*prog(t,C.streamed-.1,C.streamed+.25),fz,t);
        row(SY+370,'note','AUDIO','80 h',f3*(f3>0?1:0),'#b9b6ff',c2*prog(t,C.eighty-.2,C.eighty+.2),fz,t);
        // ch4: what moves the end: apps and settings chips
        const ck=win(t,C.varies-.1,C.ceiling-.2,.3,.3);if(ck>0){[['YOUR APPS',C.apps,SX+100],['YOUR SETTINGS',C.settings,SX+SW-110]].forEach(([w,tt,x])=>{const a=ck*prog(t,tt-.1,tt+.25);if(a<=0)return;g.globalAlpha=a;g.font='800 22px Inter';const cw=g.measureText(w).width+36;rrect(g,x-cw/2,SY+560,cw,48,24);g.fillStyle='rgba(255,143,154,.18)';g.fill();g.strokeStyle='#ff8f9a';g.lineWidth=3;g.stroke();g.fillStyle='#ffc2c9';g.textAlign='center';g.textBaseline='middle';g.fillText(w,x,SY+585);g.globalAlpha=1})}
        // ch5: the ceiling: a vertical dashed line at the end of the full bar, and your own row under it
        const ce=prog(t,C.ceiling-.2,C.ceiling+.5);if(ce>0){const x=BX+BW+16;g.globalAlpha=ce;g.strokeStyle='#ffd36b';g.lineWidth=5;g.setLineDash([12,10]);g.beginPath();g.moveTo(x,SY+90);g.lineTo(x,SY+SH-120*0-70);g.stroke();g.setLineDash([]);
          txt('CEILING',x-8,SY+SH-40,24,'#ffd36b',ce,'right',900);g.globalAlpha=1;
          row(SY+500,'you','YOUR DAY','?',0,'#ff8f9a',ce*prog(t,C.closest-.3,C.closest+.2),0,t,.54*eoc(prog(t,C.closest-.2,C.closest+.7)))}}
    });
    if(fin>0){g.globalAlpha=fin*.78;g.fillStyle='#0b0820';g.fillRect(-400,0,1900,1900);g.globalAlpha=1}
    if(fin>0){for(let i=0;i<5;i++){const an=t*(.9+i*.17)+i*1.3,x=CX+Math.cos(an)*(300+40*i),y=820+Math.sin(an)*(170+20*i);glowDot(x,y,10+4*(i%2),['#8ef0ff','#b9b6ff','#ffd36b','#ff8f9a','#6ff0a4'][i],fin*.8)}}
  },
  labels(t){
    const c0=1-prog(t,st(1)-.2,st(1)+.3);
    stamp(790,560,'UP TO','#ffd36b',c0,.09);
    const c1=win(t,st(1)-.2,st(2)+.1,.4,.4);if(c1>0)label(PXc-PWd/2-8,PT+60,'LAB TEST','#ffb35c',c1*prog(t,C.test-.1,C.test+.2),22,'rgba(44,24,8,.92)');
    const c3=win(t,st(3)-.2,st(4)+.1,.4,.4);if(c3>0)label(PXc+PWd/2+30,SY+400+170,'DIFFERENT USE, DIFFERENT NUMBER','#b9b6ff',c3*prog(t,C.three-.1,C.three+.2),20,'rgba(24,20,60,.92)');
  },
  panels(t){
    if(panel('#p0',0,st(1)-.15)>0){}
    if(panel('#p1',st(1)-.1,st(2)-.15)>0){}
    if(panel('#p2',st(2)-.1,st(3)-.1)>0)stepFlow('#p2s',[C.tt,C.eighteen],['#6ff0a4','#8ef0ff']);
    if(panel('#p3',st(3)-.1,st(4)-.1)>0){$('#p3n').style.opacity=prog(t,C.eighty-.1,C.eighty+.25)}
    if(panel('#p4',st(4)-.1,st(5)-.1)>0){$('#p4a').style.opacity=prog(t,C.varies-.1,C.varies+.25)}
    if(panel('#p5',st(5)+.1,en(5)+.45)>0){$('#p5b').style.opacity=prog(t,C.promise-.1,C.promise+.25)}
    pills(['ceil2','chk']);
  }
};
})();
