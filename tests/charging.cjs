const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const {estimate}=require('../dist/charging.js');
let r=estimate({capacity:40,start:20,target:80,tariff:8,power:7.2});
assert.equal(r.stored,24);assert(Math.abs(r.energy-26.6666667)<1e-6);assert(Math.abs(r.cost-213.3333333)<1e-6);assert(Math.abs(r.hours-3.7037037)<1e-6);
assert.equal(estimate({capacity:3,start:50,target:50,tariff:0,power:.75}).hours,0);
assert.equal(estimate({capacity:60,start:20,target:80,power:50}).hours,.8);
for(const patch of [{capacity:NaN},{capacity:0},{start:-1},{target:101},{target:10},{power:0},{tariff:-1}]) assert.throws(()=>estimate({capacity:40,start:20,target:80,power:7.2,tariff:8,...patch}));
const forms={},outputs={};
for(const kind of ['cost','time']){const events={};const elements={};for(const [k,v]of Object.entries({capacity:'40',start:'20',target:'80',tariff:'8',power:'7.2',preset:'40'}))elements[k]={value:v,addEventListener:(t,f)=>events[k+t]=f};forms[kind]={elements,events,addEventListener:(t,f)=>events[t]=f};outputs[kind]={innerHTML:'',replaceChildren(){this.innerHTML='';},append(p){this.innerHTML=p.textContent;}};}
const document={getElementById:id=>id.startsWith('charge-')?forms[id.slice(7)]:outputs[id.split('-')[0]],createElement:()=>({})};
vm.runInNewContext(fs.readFileSync(require.resolve('../dist/charging.js'),'utf8'),{window:{document},document});
assert.match(outputs.cost.innerHTML,/213.33/);assert.match(outputs.time.innerHTML,/3 hr 42 min/);
forms.cost.elements.capacity.value='';forms.cost.events.input({target:{name:'capacity'}});assert.match(outputs.cost.innerHTML,/Enter a battery/);assert.equal(forms.cost.elements.preset.value,'custom');
forms.cost.elements.preset.value='3';forms.cost.events.presetchange();assert.equal(forms.cost.elements.capacity.value,'3');assert.match(outputs.cost.innerHTML,/₹16/);
forms.time.elements.target.value='10';forms.time.events.input({target:{name:'target'}});assert.match(outputs.time.innerHTML,/Target battery/);
console.log('PASS: charging formulas, zero charge, invalid ranges, independent forms, live updates and presets.');
