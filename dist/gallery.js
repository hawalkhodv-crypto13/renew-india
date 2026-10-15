(() => {
  const data=document.querySelector('#gallery-data');if(!data)return;
  const photos=JSON.parse(data.textContent),main=document.querySelector('#gallery-main'),dialog=document.querySelector('#photo-dialog'),large=document.querySelector('#dialog-image');
  const thumbs=[...document.querySelectorAll('[data-photo]')];let index=0;
  function show(next){index=(next+photos.length)%photos.length;const photo=photos[index];main.src=photo.src;main.alt=photo.alt;large.src=photo.src;large.alt=photo.alt;document.querySelector('#gallery-caption').textContent=photo.alt;document.querySelector('#dialog-caption').textContent=photo.alt;document.querySelector('#gallery-count').textContent=`${index+1} / ${photos.length}`;document.querySelector('#dialog-count').textContent=`Photo ${index+1} of ${photos.length}`;thumbs.forEach((t,i)=>t.setAttribute('aria-pressed',String(i===index)));}
  thumbs.forEach(t=>t.addEventListener('click',()=>show(+t.dataset.photo)));
  ['gallery-prev','dialog-prev'].forEach(id=>document.getElementById(id).addEventListener('click',()=>show(index-1)));
  ['gallery-next','dialog-next'].forEach(id=>document.getElementById(id).addEventListener('click',()=>show(index+1)));
  document.querySelector('#gallery-expand').addEventListener('click',()=>{show(index);dialog.showModal();document.querySelector('#dialog-close').focus();});
  document.querySelector('#dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  dialog.addEventListener('close',()=>document.querySelector('#gallery-expand').focus());
  document.addEventListener('keydown',event=>{if(!dialog.open&&!document.activeElement?.closest('.model-gallery'))return;if(event.key==='ArrowRight'){event.preventDefault();show(index+1);}if(event.key==='ArrowLeft'){event.preventDefault();show(index-1);}});
  show(0);
})();
