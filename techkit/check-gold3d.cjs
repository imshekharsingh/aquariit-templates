// Text check for techkit/scenes/gold3d-sample.html (v5, 26 Nov 2026), no render: per time, every tile name whole in frame and clear of the caption band, not under the hub or a number figure, no cable in front of a name, the hub not hidden by the apps.
// Usage: python3 scripts/tech-assemble.py gold3d-sample, then node techkit/check-gold3d.cjs out/techreel/gold3d-sample/scene.html auto   (or t1,t2,...). Empty last column = clean. Needs the scene's window.__dbg.
const path=require('path'); const pw=require('playwright');
(async()=>{ const [scene,times]=process.argv.slice(2);
 const b=await pw.chromium.launch(); const pg=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:.25});
 pg.on('pageerror',e=>console.error('PAGEERR',e.message));
 await pg.goto('file://'+path.resolve(scene),{timeout:300000});
 const out=await pg.evaluate((times)=>{ const D=window.__dbg, W3=window.W3D, S=D.S, T=S.THREE; const res=[];
  const tl=times==='auto'?Array.from({length:Math.ceil(D.TOTAL/.5)+1},(_,i)=>Math.min(D.TOTAL,i*.5)):times.split(',').map(Number);
  for(const t of tl){ D.frame(t); S.cam.updateMatrixWorld(); const issues=[];
   const tiles=[...D.apps.map((m,i)=>['app'+i,m]),...D.tools.map((m,i)=>['tool'+i,m]),['new',D.newTool]].filter(([,m])=>m.visible&&m.scale.x>.9);
   const hubB=D.hub.visible&&D.hub.scale.x>.5?W3.screenBox(S,D.hub):null;
   const vbox=(o)=>{ let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9; o.updateMatrixWorld(true); const v=new S.THREE.Vector3(); o.traverse(m=>{ if(!m.isMesh) return; const a=m.geometry.attributes.position; for(let i=0;i<a.count;i+=7){ v.fromBufferAttribute(a,i).applyMatrix4(m.matrixWorld).project(S.cam); const sx=(v.x*.5+.5)*1080, sy=(-v.y*.5+.5)*1920; x0=Math.min(x0,sx);x1=Math.max(x1,sx);y0=Math.min(y0,sy);y1=Math.max(y1,sy);} }); return [x0,y0,x1,y1]; }; const figB=D.figs.filter(f=>f.visible&&f.scale.x>.3).map(vbox);
   // cable sample points (visible part only)
   const cabs=[...D.tubes.map(q=>q.c),...D.hubTubes.map(q=>q.c),D.newCable].filter(c=>c.tube.visible);
   for(const [n,m] of tiles){ const bx=W3.screenBox(S,m); const h=bx[3]-bx[1]; const nm=[bx[0]+ (bx[2]-bx[0])*.12,bx[1]+h*.04,bx[2]-(bx[2]-bx[0])*.12,bx[1]+h*.26];
     if((nm[0]<0||nm[2]>1080||nm[1]<0||nm[3]>1920)&&nm[2]>0&&nm[0]<1080&&nm[3]>0&&nm[1]<1920) issues.push(n+":cut");
     if(nm[1]<420 && nm[3]>0) issues.push(n+':capband');
     const ov=(a,c)=>Math.max(0,Math.min(a[2],c[2])-Math.max(a[0],c[0]))*Math.max(0,Math.min(a[3],c[3])-Math.max(a[1],c[1]))/((c[2]-c[0])*(c[3]-c[1]));
     const dT=S.cam.position.distanceTo(m.getWorldPosition(new T.Vector3()));
     if(hubB && S.cam.position.distanceTo(D.hub.position)<dT && ov(hubB,bx)>.04) issues.push(n+':hub'+Math.round(ov(hubB,bx)*100));
     for(const f of figB) if(W3.overlaps(f,bx)) issues.push(n+':fig');
     let hit=0; const hitIx=[]; for(const c of cabs){ const N=c.tube.geometry.drawRange.count===Infinity?1:Math.min(1,c.tube.geometry.drawRange.count/(c.tube.geometry.index?c.tube.geometry.index.count:1)); for(let k=0;k<=80;k++){ const u=k/80*N; const w=c.curve.getPointAt(Math.min(1,u)); if(S.cam.position.distanceTo(w)>dT-.3) continue; const p=w.clone().project(S.cam); const sx=(p.x*.5+.5)*1080, sy=(-p.y*.5+.5)*1920; if(sx>nm[0]&&sx<nm[2]&&sy>nm[1]&&sy<nm[3]){hit++;hitIx.push(cabs.indexOf(c));break;} } }
     if(hit) issues.push(n+":cable"+hitIx.join("."));
     if(n==='tool0'&&t===tl[0]) {} }
   if(hubB){ const dH=S.cam.position.distanceTo(D.hub.position); const fr=(a,c)=>Math.max(0,Math.min(a[2],c[2])-Math.max(a[0],c[0]))*Math.max(0,Math.min(a[3],c[3])-Math.max(a[1],c[1]))/((c[2]-c[0])*(c[3]-c[1])); let cov=0; for(const [n,m] of tiles){ if(S.cam.position.distanceTo(m.getWorldPosition(new T.Vector3()))<dH-.5) cov+=fr(W3.screenBox(S,m),hubB);} if(cov>.2) issues.push('HUBCOVERED'+Math.round(cov*100)); }
   const allTools=D.tools.filter(m=>m.visible).length;
   res.push([t, S.cam.position.toArray().map(v=>+v.toFixed(2)).join(','), hubB?hubB.map(Math.round).join(','):'-', issues.join(' ')]); }
  return res; },times||'auto');
 for(const r of out) console.log(r.join(' | ')); await b.close(); })();
