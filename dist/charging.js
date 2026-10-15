/* Static, dependency-free estimates. 90% of input energy is stored. */
(function (root) {
  'use strict';
  function estimate({capacity,start,target,tariff,power}) {
    if (![capacity,start,target].every(Number.isFinite) || capacity < .1 || capacity > 300 || start < 0 || start > 100 || target < 0 || target > 100) throw new Error('Enter a battery capacity from 0.1 to 300 kWh and percentages from 0 to 100.');
    if (target < start) throw new Error('Target battery must be equal to or above the starting percentage.');
    if (tariff !== undefined && (!Number.isFinite(tariff) || tariff < 0 || tariff > 100)) throw new Error('Enter an electricity price from ₹0 to ₹100 per kWh.');
    if (power !== undefined && (!Number.isFinite(power) || power < .1 || power > 500)) throw new Error('Enter charger power from 0.1 to 500 kW.');
    const stored = capacity * (target-start) / 100, energy = stored / .9;
    return {stored,energy,cost:tariff === undefined ? undefined : energy*tariff,hours:power === undefined ? undefined : energy/power};
  }
  if (typeof module !== 'undefined') module.exports = {estimate};
  if (!root.document) return;
  const fmt = n => n.toLocaleString('en-IN',{maximumFractionDigits:2});
  for (const kind of ['cost','time']) {
    const form = document.getElementById('charge-'+kind), out = document.getElementById(kind+'-output');
    if (!form || !out) continue;
    function update() {
      const data={};
      for (const name of ['capacity','start','target',kind==='cost'?'tariff':'power']) data[name]=form.elements[name].value.trim()===''?NaN:Number(form.elements[name].value);
      try {
        const result=estimate(data);
        let main;
        if (kind==='cost') main='₹'+fmt(result.cost);
        else { const minutes=Math.round(result.hours*60); main=result.hours===0?'0 min':minutes===0?'Less than 1 min':(Math.floor(minutes/60)?Math.floor(minutes/60)+' hr ':'')+(minutes%60?minutes%60+' min':''); }
        out.innerHTML='<span class="result-label">'+(kind==='cost'?'ESTIMATED ENERGY COST':'CONSTANT-POWER TIME ESTIMATE')+'</span><strong>'+main+'</strong><p>'+fmt(result.stored)+' kWh added to battery · '+fmt(result.energy)+' kWh supplied</p><p>'+(result.stored===0?'No charging needed for this target.':kind==='cost'?'Excludes additional fees and taxes not in your rate.':'Allow extra time for tapering and real-world conditions.')+'</p>';
      } catch(error) {out.replaceChildren();const p=document.createElement('p');p.className='charge-error';p.textContent=error.message;out.append(p);}
    }
    form.addEventListener('submit',e=>{e.preventDefault();update();});
    form.addEventListener('input',e=>{if(e.target.name==='capacity') form.elements.preset.value='custom';update();});
    form.elements.preset.addEventListener('change',()=>{if(form.elements.preset.value!=='custom') form.elements.capacity.value=form.elements.preset.value;update();});
    update();
  }
})(typeof window!=='undefined'?window:globalThis);
