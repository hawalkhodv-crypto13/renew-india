(() => {
  const search = document.querySelector('#news-search');
  const sort = document.querySelector('#news-sort');
  const list = document.querySelector('#news-list');
  const stories = [...list.querySelectorAll('.news-story')];
  const buttons = [...document.querySelectorAll('[data-news-filter]')];
  let category = 'All';
  function render() {
    const query = search.value.trim().toLowerCase();
    let count = 0;
    [...stories].sort((a,b) => (sort.value === 'newest' ? -1 : 1) * a.dataset.date.localeCompare(b.dataset.date)).forEach(story => {
      story.hidden = !((category === 'All' || story.dataset.categories.split('|').includes(category)) && story.textContent.toLowerCase().includes(query));
      if (!story.hidden) count++;
      list.append(story);
    });
    buttons.forEach(button => { const active = button.dataset.newsFilter === category; button.classList.toggle('active',active); button.setAttribute('aria-pressed',String(active)); });
    document.querySelector('#news-count').textContent = `${count} ${count === 1 ? 'story' : 'stories'}`;
    document.querySelector('#news-empty').hidden = count !== 0;
  }
  buttons.forEach(button => button.addEventListener('click',() => { category = button.dataset.newsFilter; render(); }));
  search.addEventListener('input',render);
  sort.addEventListener('change',render);
  document.querySelector('#news-reset').addEventListener('click',() => {category='All';search.value='';sort.value='newest';render();search.focus();});
  render();
})();
