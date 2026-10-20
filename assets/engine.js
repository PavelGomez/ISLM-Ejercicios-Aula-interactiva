/* Motor único: compartido por interfaz, gráficos, exportaciones y verificaciones. */
(function(root){
'use strict';
const COMMON=Object.freeze({c0:60,c1:.65,G:240,P:2,M:800,k:.4,h:16});
const PROFILES=Object.freeze({pyme:{name:'Financiamiento interno',short:'Pymes',b0:270,b1:.08,b2:18},minera:{name:'Sensibilidad al producto',short:'Gran minería',b0:32,b1:.22,b2:4}});
function base(profile='pyme',tax='fixed'){const q=PROFILES[profile];return {...COMMON,b0:q.b0,b1:q.b1,b2:q.b2,Tbar:tax==='fixed'?240:0,t:tax==='fixed'?0:.2};}
function coefficients(p){const m=p.M/p.P,A=p.c0-p.c1*p.Tbar+p.b0+p.G,a=1-p.c1*(1-p.t)-p.b1,D=a+p.b2*p.k/p.h;return {m,A,a,D,alpha:1/a,fiscal:1/D,realMoney:(p.b2/p.h)/D,nominalMoney:(p.b2/p.h)/D/p.P,tax:-p.c1/D};}
function accounts(p,Y,i){const T=p.Tbar+p.t*Y,Yd=Y-T,C=p.c0+p.c1*Yd,I=p.b0+p.b1*Y-p.b2*i,Sp=Y-T-C,Sg=T-p.G,S=Sp+Sg,Md=p.k*Y-p.h*i;return {Y,i,T,Yd,C,I,G:p.G,Sp,Sg,S,Md,m:p.M/p.P,goodsResidual:Y-C-I-p.G,moneyResidual:p.M/p.P-Md,savingResidual:S-I};}
function solve(p){const q=coefficients(p),Y=(q.A+(p.b2/p.h)*q.m)/q.D,i=(p.k*Y-q.m)/p.h;return {...q,...accounts(p,Y,i)};}
function lm(p,Y){return (p.k*Y-p.M/p.P)/p.h;}
function is(p,Y){const q=coefficients(p);return (q.A-q.a*Y)/p.b2;}
function goodsY(p,i){const q=coefficients(p);return (q.A-p.b2*i)/q.a;}
function expenditure(p,Y,i){return p.c0+p.c1*(Y-p.Tbar-p.t*Y)+p.b0+p.b1*Y-p.b2*i+p.G;}
function shock(p,kind,size){const q={...p};if(kind==='G')q.G+=size;else if(kind==='m')q.M+=size*q.P;else if(kind==='M')q.M+=size;else if(kind==='Tbar')q.Tbar+=size;return q;}
function compare(p0,p1){const s0=solve(p0),s1=solve(p1),delta={};['Y','i','T','Yd','C','I','Sp','Sg','S','G','m'].forEach(k=>delta[k]=s1[k]-s0[k]);return {p0,p1,s0,s1,delta,income:p0.b1*delta.Y,rate:-p0.b2*delta.i,autonomous:p1.b0-p0.b0, fixedY:goodsY(p1,s0.i),gap:goodsY(p1,s0.i)-s1.Y};}
function validate(p){const errors=[];if(!Object.values(p).every(Number.isFinite))return ['Usa números finitos en todos los campos.'];if(p.P<=0||p.M<=0||p.h<=0||p.k<=0||p.c0<=0||p.b0<=0||p.b1<=0||p.b2<=0)errors.push('P, M, k, h, c₀, b₀, b₁ y b₂ deben ser mayores que cero.');if(p.c1<=0||p.c1>=1||p.t<0||p.t>=1)errors.push('Se requiere 0 < c₁ < 1 y 0 ≤ t < 1.');if(p.t>0&&p.Tbar!==0)errors.push('Elige un régimen puro: impuestos fijos T, o proporcionales tY sin monto fijo.');if(p.Tbar<0)errors.push('El impuesto fijo T debe ser no negativo en este ejercicio.');if(coefficients(p).a<=0)errors.push('a ≤ 0: la IS deja de tener la pendiente habitual y las rondas de gasto a tasa fija no convergen.');if(!errors.length){const s=solve(p);if(s.Y<=0||s.i<0||s.C<0||s.I<0||s.Yd<0)errors.push('El resultado exige Y, C, I o Yd negativos, o i < 0. Está fuera del dominio didáctico de esta plataforma.');}return errors;}
function scenarios(){const rows=[];for(const profile of Object.keys(PROFILES))for(const tax of ['fixed','proportional'])for(const [kind,size] of [['G',60],['m',40]]){const p0=base(profile,tax),r=compare(p0,shock(p0,kind,size));rows.push({profile,tax,kind,size,...r});}return rows;}
function accelerator(Y,v=2){return Y.map((y,t)=>({t,Y:y,K:v*y,In:t?v*(y-Y[t-1]):null}));}
function bankMultiplier(theta,rho,e){return (1+theta)/(theta+rho+e);}
const api={COMMON,PROFILES,base,coefficients,accounts,solve,lm,is,goodsY,expenditure,shock,compare,validate,scenarios,accelerator,bankMultiplier};
if(typeof module==='object'&&module.exports)module.exports=api;else root.ISLM=api;
})(typeof globalThis==='object'?globalThis:this);
