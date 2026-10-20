const BASE_URL=(process.env.ISLM_SITE_URL||'http://127.0.0.1:8765').replace(/\/$/,'');
'use strict';
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),E=require('../assets/engine.js');
const root=path.resolve(__dirname,'..');let assertions=0;
function check(value,message){assertions++;assert.ok(value,message);}
(async()=>{
 const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1440,height:1000},locale:'es-CL'});
 await page.goto(BASE_URL+"/#inicio");
 // Review the displayed text, without inspecting internal identifiers used by the engine.
 const texts=await page.evaluate(()=>{
  const out=[];for(const pr of ['pyme','minera'])for(const tx of ['fixed','proportional']){
   const p=ISLM.base(pr,tx);for(const key of ['intro','lm','is','taxes','joint','policy','investment','matrix']){
    const html=key==='lm'?Lesson.lm(p,1360):key==='is'?Lesson.is(p,7):Lesson[key](p);
    const doc=new DOMParser().parseFromString(html,'text/html');out.push({label:key+' '+pr+' '+tx,text:doc.body.textContent});
   }
  }return out;
 });
 for(const item of texts)check(!/(?<![\p{L}\p{N}_])m(?![\p{L}\p{N}_])|\bL\s*(?:=|\()|T = T|T \+ tY/u.test(item.text),'Notación de clase: '+item.label);
 await page.goto(BASE_URL+"/#presentacion");
 await page.waitForFunction(()=>Presentation.getState().mounted&&!Presentation.getState().loading);
 const slides=await page.evaluate(()=>PresentationData.scenes.map(s=>({key:s.key,text:new DOMParser().parseFromString(Presentation.renderSlide(s),'text/html').body.textContent})));
 for(const s of slides)check(!/(?<![\p{L}\p{N}_])m(?![\p{L}\p{N}_])|\bL\s*(?:=|\()|T = T|T \+ tY/u.test(s.text),'Diapositiva: '+s.key);
 const money=slides.find(s=>s.key==='money').text;
 for(const symbol of ['M/P','Mᵈ','d₁Y − d₂i','kY − hi','d₁ = k > 0','d₂ = h > 0','M:','P:','Y:','i:'])check(money.includes(symbol),'Símbolo monetario definido: '+symbol);
 const goods=slides.find(s=>s.key==='goods').text;
 for(const formula of ['C = c₀ + c₁(Y − T)','C = c₀ + c₁(Y − tY)','I = b₀ + b₁Y − b₂i','b₀ > 0','b₁ > 0','b₂ > 0'])check(goods.includes(formula),'Modelo de bienes: '+formula);
 await page.goto(BASE_URL+"/#laboratorio");
 for(const tx of ['fixed','proportional']){
  await page.locator('#labTax').selectOption(tx);await page.locator('summary').first().click();
  check(await page.locator('#param-t').isDisabled()===(tx==='fixed'),'t editable solo en proporcionales');
  check(await page.locator('#param-Tbar').isDisabled()===(tx==='proportional'),'T editable solo en fijos');
  check(await page.locator('#shockKind option[value="Tbar"]').evaluate(el=>el.disabled)===(tx==='proportional'),'Shock T pertenece al régimen fijo');
  const eq=tx==='fixed'?'C = c₀ + c₁(Y − T)':'C = c₀ + c₁(Y − tY)';
  check((await page.locator('#labResults').innerText()).includes(eq),'Consumo sincronizado con '+tx);
  await page.locator('[data-preset="G"]').click();let state=await page.evaluate(()=>CadenaDiagnostics.lab);
  check(E.validate(state.after).length===0,'Shock admisible: '+tx);
  const s=E.solve(state.after);check(Math.abs(state.after.M/state.after.P-s.Md)<1e-8,'Oferta real igual a demanda real');
  await page.locator('[data-action="labreset"]').click();await page.locator('summary').first().click();
  for(const value of ['0','−10']){await page.locator('#param-b0').fill(value);check((await page.locator('#labError').innerText()).includes('b₀'),'Bloquea b₀ = '+value);check((await page.locator('#labResults').innerText())==='','Oculta equilibrio inadmisible');}
 }
 await page.locator('[data-action="labreset"]').click();await page.locator('summary').first().click();await page.locator('#param-t').fill('0');
 check((await page.locator('#labError').innerText()).includes('t > 0'),'Proporcional requiere t positivo');
 await page.goto(BASE_URL+"/#is");await page.locator('#tax').selectOption('proportional');await page.locator('[data-action="reveal"]').click();
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:path.join(root,'verification/notacion-consumo-proporcional-movil.png'),fullPage:true});
 await page.goto(BASE_URL+"/#presentacion");await page.waitForFunction(()=>Presentation.getState().mounted&&!Presentation.getState().loading);await page.locator('[data-p-chapter="1"]').click();
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:path.join(root,'verification/notacion-dinero-movil.png'),fullPage:true});
 for(const file of ['guia_estudiante.html','memoria_docente.html','guion_presentacion.html']){
  await page.goto(BASE_URL+"/docs/"+file);const text=await page.locator('body').innerText();
  check(!/(?<![\p{L}\p{N}_])m(?![\p{L}\p{N}_])|\bL\s*(?:=|\()|T = T|T \+ tY/u.test(text),'Documento sin notación anterior: '+file);
 }
 const rows=JSON.parse(fs.readFileSync(path.join(root,'data/escenarios.json'),'utf8'));
 check(rows.length===8,'Exportación conserva ocho escenarios');
 for(const r of rows){check('M/P' in r.s0&&'Md' in r.s0&&!('L' in r.s0)&&!('m' in r.s0),'JSON usa M/P y Md');check(Math.abs(r.s1['M/P']-r.s1.Md)<1e-8,'JSON conserva el equilibrio monetario');}
 const script=JSON.parse(fs.readFileSync(path.join(root,'production/presentation-script.json'),'utf8'));
 const spoken=script.scenes.flatMap(s=>s.paragraphs).join(' ');
 check(spoken.includes('eme superíndice de'),'Narración define Md');check(spoken.toLocaleLowerCase('es').includes('de sub uno y ka'),'Narración relaciona d1 y k');check(spoken.includes('Los tres coeficientes son positivos'),'Narración define inversión completa');
 await browser.close();fs.writeFileSync(path.join(root,'verification/notacion.json'),JSON.stringify({status:'PASS',assertions,scope:'Notación visible, definiciones, regímenes tributarios, dominio de coeficientes, exportaciones y guion de audio.'},null,2));console.log(JSON.stringify({status:'PASS',assertions},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
