(() => {
  const grid=document.querySelector('#ev-grid');
  if(!grid)return;
  const cards=[...grid.querySelectorAll('.ev-card')], search=document.querySelector('#ev-search'), brand=document.querySelector('#ev-brand');
  const tabs=[...document.querySelectorAll('[data-ev-type]')], selected=new Set();
  const models=new Map(window.evCatalogue.map(v=>[v.slug,v]));
  const budget=document.querySelector('#ev-budget');
  let type='all';
  const params=new URLSearchParams(location.search);
  if(['car','two-wheeler','three-wheeler'].includes(params.get('type')))type=params.get('type');
  search.value=params.get('q')||'';
  if([...budget.options].some(x=>x.value===params.get('budget')))budget.value=params.get('budget');
  if([...brand.options].some(x=>x.value===params.get('brand')))brand.value=params.get('brand');
  function filter(){
    const q=search.value.trim().toLowerCase();let count=0;
    cards.forEach(card=>{const d=card.dataset;card.hidden=!((type==='all'||(type==='two-wheeler'?['scooter','motorcycle'].includes(d.type):d.type===type))&&(brand.value==='all'||d.brand===brand.value)&&(budget.value==='all'||(Number(d.price)>0&&Number(d.price)<=Number(budget.value)))&&(d.brand+' '+d.name).toLowerCase().includes(q));if(!card.hidden)count++;});
    document.querySelector('#ev-count').textContent=`${count} of ${cards.length} models`;
    document.querySelector('#ev-empty').hidden=count!==0;
    tabs.forEach(tab=>{const active=tab.dataset.evType===type;tab.classList.toggle('active',active);tab.setAttribute('aria-pressed',String(active));});
    const url=new URL(location.href);['type','brand','q','budget'].forEach(k=>url.searchParams.delete(k));
    if(type!=='all')url.searchParams.set('type',type);if(brand.value!=='all')url.searchParams.set('brand',brand.value);if(q)url.searchParams.set('q',search.value.trim());
    if(budget.value!=='all')url.searchParams.set('budget',budget.value);
    history.replaceState(null,'',url);
  }
  tabs.forEach(t=>t.addEventListener('click',()=>{type=t.dataset.evType;filter();}));search.addEventListener('input',filter);brand.addEventListener('change',filter);budget.addEventListener('change',filter);
  document.querySelector('#ev-reset').addEventListener('click',()=>{type='all';brand.value='all';budget.value='all';search.value='';filter();});
  function cell(tag,text){const el=document.createElement(tag);el.textContent=text;return el;}
  function compare(){
    const panel=document.querySelector('#ev-comparison'), target=document.querySelector('#ev-compare-table');panel.hidden=selected.size===0;target.replaceChildren();
    if(!selected.size)return;
    const rows=[...selected].map(s=>models.get(s)),table=document.createElement('table'),thead=document.createElement('thead'),head=document.createElement('tr');head.append(cell('th','Model'));
    rows.forEach(v=>{const th=cell('th',''),a=document.createElement('a');a.href='/explore-evs/'+v.slug+'/';a.target='_self';a.textContent=v.brand+' '+v.name;th.append(a);head.append(th);});thead.append(head);table.append(thead);
    const body=document.createElement('tbody');[['Claimed range','range'],['Battery capacity','battery'],['Listed ex-showroom price','price']].forEach(([label,key])=>{const tr=document.createElement('tr');tr.append(cell('th',label));rows.forEach(v=>tr.append(cell('td',v[key])));body.append(tr);});table.append(body);target.append(table);
  }
  document.querySelectorAll('[data-compare]').forEach(input=>input.addEventListener('change',()=>{const message=document.querySelector('#ev-compare-message');if(input.checked&&selected.size===3){input.checked=false;message.textContent='Choose up to three models. Remove one to add another.';return;}message.textContent='';if(input.checked)selected.add(input.dataset.compare);else selected.delete(input.dataset.compare);compare();}));
  document.querySelector('#ev-clear-compare').addEventListener('click',()=>{selected.clear();document.querySelectorAll('[data-compare]').forEach(x=>x.checked=false);document.querySelector('#ev-compare-message').textContent='';compare();});
  filter();
})();
