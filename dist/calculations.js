// Pure calculation functions shared by the interfaces and regression checks.
(function(root){
const api={
 solar(v){
  const generation=v.kw*v.sun*v.performance/100*365;
  const direct=Math.min(generation*v.self/100,v.units*12);
  const exported=Math.max(0,generation-direct);
  const grossSaving=direct*v.tariff+exported*v.exportRate;
  const netSaving=grossSaving-v.maintenance;
  const grant=v.eligible?Math.min(v.kw,2)*30000+Math.min(Math.max(v.kw-2,0),1)*18000:0;
  const subsidy=Math.min(grant*(v.special?1.1:1),v.cost);
  const netCost=Math.max(0,v.cost-subsidy);
  return {generation,direct,exported,grossSaving,netSaving,subsidy,netCost,payback:netSaving>0?netCost/netSaving:null,roofNeeded:v.kw*100,recommended:Math.max(0,Math.min(v.roof/100,v.units*12/(v.sun*v.performance/100*365)))};
 },
 ev(v){const petrol=v.km/v.eff*v.petrol;const electricity=v.km*v.cons/100*(1+v.loss/100)*v.tariff;return {petrol,electricity,annual:(petrol-electricity)*12};},
 road(v,rule){
  let tax=null;let note=rule.note;
  if(rule.mode==='zero')tax=0;
  if(rule.mode==='delhi'&&(v.type!=='car'||v.price<=3000000))tax=0;
  if(rule.mode==='karnataka'){
   if(v.type==='car'){const rate=v.price<=1000000?.05:v.price<=2500000?.08:.10;tax=Math.round(v.price*rate*1.11);note+=' Car estimate includes 11% cess on the road tax; RTO invoice value may differ from the entered ex-showroom value.';}
   else if(v.type==='scooter'||v.type==='motorcycle'||v.type==='three-wheeler')tax=0;
  }
  const today=v.asOf||new Date().toISOString().slice(0,10);
  if(rule.validUntil&&today>rule.validUntil){tax=null;note='The checked policy period has ended. A fresh rate or exemption must be confirmed.';}
  if(v.override!==null)tax=v.override;
  const tcs=v.price>1000000?Math.round(v.price*.01):0;
  const subtotal=v.price+v.insurance+(tax??0)+tcs;
  return {tax,tcs,registration:0,subtotal,note,incomplete:tax===null||v.insurance===0||v.type==='three-wheeler'};
 }
};root.RenewCalc=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
