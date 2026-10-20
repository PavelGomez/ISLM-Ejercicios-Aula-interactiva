'use strict';
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),base=process.env.ISLM_SITE_URL||'http://127.0.0.1:8765',report={status:'RUNNING',cases:[],failures:[],assertions:0};
(async()=>{
 const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1440,height:1100},locale:'es-CL'});await page.goto(base);await page.waitForFunction(()=>Presentation.getState().mounted&&!Presentation.getState().loading);
 const cases=[...[5,6,9,12,19].map(index=>({kind:'slide',index})),...[1280,1360,1440].map(Y=>({kind:'money',Y})),...['pyme','minera'].flatMap(profile=>['fixed','proportional'].flatMap(tax=>[6,7,9].map(rate=>({kind:'goods',profile,tax,rate})))),...Array.from({length:8},(_,index)=>({kind:'scenario',index}))];
 for(const width of [1920,1440,1000,820,390,360]){
  await page.setViewportSize({width,height:1100});
  for(const fixture of cases){
   await page.evaluate(c=>{const E=ISLM,C=Charts;let html;if(c.kind==='slide')html=Presentation.renderSlide(PresentationData.scenes[c.index]);if(c.kind==='money')html=C.moneyConstruction(E.base(),c.Y);if(c.kind==='goods')html=C.goodsConstruction(E.base(c.profile,c.tax),c.rate);if(c.kind==='scenario'){const r=E.scenarios()[c.index];html=C.equilibrium(r.p0,r.p1);}document.querySelector('#pSlideBody').innerHTML=html;},fixture);
   const scan=await page.evaluate(()=>{
    const bad=[],stats={figures:0,points:0,projections:0,checks:0};
    function require(ok,why){stats.checks++;if(!ok)bad.push(why);}
    const intersects=(a,b,pad=0)=>Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)>pad&&Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)>pad;
    function pathTouches(path,box,pad=1.5,skipStart=0){if(path.tagName.toLowerCase()==='polyline'){const ps=path.points;for(let j=1;j<ps.numberOfItems;j++){const a=ps.getItem(j-1),z=ps.getItem(j);let lo=0,hi=1,dx=z.x-a.x,dy=z.y-a.y;for(const [v,q] of [[-dx,a.x-(box.x-pad)],[dx,box.x+box.width+pad-a.x],[-dy,a.y-(box.y-pad)],[dy,box.y+box.height+pad-a.y]]){if(v===0){if(q<0){lo=2;break;}}else if(v<0)lo=Math.max(lo,q/v);else hi=Math.min(hi,q/v);}if(lo<=hi)return true;}return false;}const n=path.getTotalLength();for(let s=skipStart;s<=n;s+=1){const p=path.getPointAtLength(s);if(p.x>box.x-pad&&p.x<box.x+box.width+pad&&p.y>box.y-pad&&p.y<box.y+box.height+pad)return true;}return false;}
    for(const svg of document.querySelectorAll('#pSlideBody svg.economic-chart')){
     if(!svg.getClientRects().length)continue;stats.figures++;const p=svg.querySelector('.economic-plot'),d=p.dataset,l=+d.left,r=+d.right,t=+d.top,b=+d.bottom,x0=+d.xmin,x1=+d.xmax,y0=+d.ymin,y1=+d.ymax;
     const texts=[...svg.querySelectorAll('text')],boxes=texts.map(e=>({e,box:e.getBBox()})),bounds=svg.viewBox.baseVal;
     for(const q of boxes)require(q.box.x>=-1&&q.box.y>=-1&&q.box.x+q.box.width<=bounds.width+1&&q.box.y+q.box.height<=bounds.height+1,'Texto fuera del lienzo: '+q.e.textContent);
     for(let j=0;j<boxes.length;j++)for(let k=j+1;k<boxes.length;k++)require(!intersects(boxes[j].box,boxes[k].box,1.5),'Textos solapados: '+boxes[j].e.textContent+' / '+boxes[k].e.textContent);
     for(const point of svg.querySelectorAll('.equilibrium-point')){
      stats.points++;const q=point.dataset,px=l+(+q.x-x0)/(x1-x0)*(r-l),py=b-(+q.y-y0)/(y1-y0)*(b-t);
      require(Math.abs(+q.px-px)<1e-7&&Math.abs(+q.py-py)<1e-7,'Posición numérica incorrecta: '+q.owner);
      for(const [axis,value,fx,fy] of [['x',+q.x,px,b],['y',+q.y,l,py]]){
       const label=[...svg.querySelectorAll('.axis-projection')].find(e=>e.dataset.axis===axis&&Math.abs(+e.dataset.value-value)<1e-7&&e.dataset.owners.split(' ').includes(q.owner));
       require(!!label,'Falta coordenada '+axis+' de '+q.owner);if(label){stats.projections++;require(label.textContent.includes(Charts.f(value)),'Valor de proyección incorrecto');const start=label.querySelector('path').getPointAtLength(0);require(Math.hypot(start.x-fx,start.y-fy)<.01,'Proyección separada del eje');}
      }
      const label=[...svg.querySelectorAll('.equilibrium-label')].find(e=>e.dataset.owner===q.owner),leader=[...svg.querySelectorAll('.point-leader')].find(e=>e.dataset.owner===q.owner);
      require(!!label&&!!leader,'Etiqueta sin unión al punto: '+q.owner);if(leader){const start=leader.getPointAtLength(0);require(Math.hypot(start.x-px,start.y-py)<.01,'Unión separada del equilibrio');}
      for(const curve of svg.querySelectorAll('.chartline'))require(!!(curve.compareDocumentPosition(point)&Node.DOCUMENT_POSITION_FOLLOWING),'Curva dibujada sobre el marcador');
     }
     for(const q of boxes.filter(q=>q.e.matches('.equilibrium-label,.function-label'))){
      for(const curve of svg.querySelectorAll('.chartline'))if(q.box.x<r&&q.box.x+q.box.width>l&&q.box.y<b&&q.box.y+q.box.height>t)require(!pathTouches(curve,q.box,1),'Curva atraviesa etiqueta: '+q.e.textContent);
     }
     for(const link of svg.querySelectorAll('.point-leader,.function-leader,.axis-projection path'))for(const q of boxes)require(!pathTouches(link,q.box,.3),'Unión atraviesa texto: '+q.e.textContent);
     for(const link of svg.querySelectorAll('.function-leader')){const len=link.getTotalLength(),a=link.getPointAtLength(0),z=link.getPointAtLength(len),dx=z.x-a.x,dy=z.y-a.y;for(const curve of svg.querySelectorAll('.chartline')){let crossed=false;for(let j=1;j<curve.points.numberOfItems;j++){const v=curve.points.getItem(j-1),w=curve.points.getItem(j),sx=w.x-v.x,sy=w.y-v.y,den=dx*sy-dy*sx;if(Math.abs(den)<1e-7)continue;const k=((v.x-a.x)*sy-(v.y-a.y)*sx)/den,u=((v.x-a.x)*dy-(v.y-a.y)*dx)/den;if(k>8/len&&k<.999&&u>=0&&u<=1){const x=a.x+k*dx,y=a.y+k*dy;if(x>=l&&x<=r&&y>=t&&y<=b){crossed=true;break;}}}require(!crossed,'Unión cruza otra curva: '+link.dataset.owner+' / '+curve.dataset.function);}}

    }
    return {bad:[...new Set(bad)],...stats,overflow:document.documentElement.scrollWidth>innerWidth+1};
   });
   report.assertions+=scan.checks;report.cases.push({width,...fixture,figures:scan.figures,points:scan.points,projections:scan.projections});if(scan.bad.length||scan.overflow)report.failures.push({width,...fixture,bad:scan.bad,overflow:scan.overflow});
  }
 }
 fs.writeFileSync(path.join(root,'verification/graficos.json'),JSON.stringify(report,null,2));
 // La escala completa es accesible y conserva las coordenadas; abrirla pausa la narración.
 await page.setViewportSize({width:1440,height:1100});await page.locator('[data-p-chapter="2"]').click();await page.locator('[data-p-slide="9"]').click();await page.waitForFunction(()=>!Presentation.getState().loading);await page.locator('#pPlay').click();await page.waitForFunction(()=>!document.querySelector('#pNarration').paused);await page.locator('.chart-overview summary').click();await page.waitForFunction(()=>document.querySelector('#pNarration').paused,{},{timeout:3000});assert(await page.locator('#pNarration').evaluate(a=>a.paused),'Abrir escala completa pausa audio');assert(await page.locator('.chart-overview svg').isVisible());report.assertions+=2;await page.locator('.chart-overview summary').click();
 for(const [width,index,name] of [[1440,5,'graficos-06-escritorio'],[1440,9,'graficos-10-escritorio'],[1000,9,'graficos-10-intermedio'],[820,12,'graficos-13-tableta'],[390,5,'graficos-06-movil'],[390,9,'graficos-10-movil'],[1440,19,'graficos-20-escritorio']]){await page.setViewportSize({width,height:1100});const chapter=await page.evaluate(i=>PresentationData.scenes[i].chapter,index);await page.locator(`[data-p-chapter="${chapter}"]`).click();await page.locator(`[data-p-slide="${index}"]`).click();await page.waitForFunction(()=>!Presentation.getState().loading);await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.locator('#pStage').screenshot({path:path.join(root,'verification/'+name+'.png'),style:'.topbar,.skip{visibility:hidden}'});}
 await page.setViewportSize({width:1440,height:1100});await page.locator('[data-p-chapter="2"]').click();await page.locator('[data-p-slide="9"]').click();await page.waitForFunction(()=>!Presentation.getState().loading);await page.addStyleTag({content:'body{filter:grayscale(1)}'});await page.locator('#pStage').screenshot({path:path.join(root,'verification/graficos-10-grises.png'),style:'.topbar,.skip{visibility:hidden}'});
 await browser.close();report.status=report.failures.length?'FAIL':'PASS';fs.writeFileSync(path.join(root,'verification/graficos.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({status:report.status,cases:report.cases.length,assertions:report.assertions,failures:report.failures.slice(0,10)},null,2));assert.equal(report.failures.length,0,'Geometría y relaciones gráficas');
})().catch(e=>{console.error(e);process.exit(1)});
