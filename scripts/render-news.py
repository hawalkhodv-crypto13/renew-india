"""Render the homepage highlights and news archive from news-content.json."""
from pathlib import Path
from html import escape as e
from datetime import date
import json,re
root=Path(__file__).resolve().parents[1];dist=root/'dist'
data=json.loads((root/'news-content.json').read_text())
stories=sorted(data['stories'],key=lambda a:a['date'],reverse=True)
def pretty(d):return date.fromisoformat(d).strftime('%d %b %Y').lstrip('0')
def meta(a):return '<div class="news-meta"><span>'+e(' · '.join(a['categories']))+'</span><time datetime="'+a['date']+'">'+pretty(a['date'])+'</time></div>'
for f in dist.rglob('*.html'):
 if f.parent.name in ('news','government-schemes'):continue
 s=f.read_text()
 s=s.replace('<a href="/about/"', '<a href="/news/" target="_self">News</a><a href="/about/"') if 'href="/news/"' not in re.search(r'<header>.*?</header>',s).group() else s
 f.write_text(s)
home=dist/'index.html';s=home.read_text()
featured=[a for a in stories if a['featured']][:3]
news='<section id="daily-renew" class="section daily-renew"><div class="section-head"><div><span class="eyebrow">THE DAILY RENEW</span><h2>Big stories.<br>A cleaner tomorrow.</h2></div><div><p>Selected highlights from India’s clean-energy journey.</p><p class="micro">Last updated '+pretty(data['updated'])+'</p><a class="news-all" href="/news/" target="_self">View all news →</a></div></div><div class="news-highlights">'
for i,a in enumerate(featured):
 news+='<article class="news-highlight'+(' lead-story' if i==0 else '')+'">'+meta(a)+'<h3><a href="/news/#'+a['id']+'" target="_self">'+e(a['title'])+'</a></h3><p>'+e(a['summary'])+'</p><div class="news-bottom"><span>'+e(a['source'])+'</span><a href="/news/#'+a['id']+'" target="_self">Read summary →</a></div></article>'
news+='</div></section>'
if 'id="daily-renew"' in s:s=re.sub(r'<section id="daily-renew".*?</section>',news,s,flags=re.S)
else:s=re.sub(r'(<section id="pathways".*?</section>)',lambda m:m.group()+news,s,count=1,flags=re.S)
home.write_text(s)
head=re.search(r'<head>.*?</head>',s,re.S).group();head=re.sub(r'<title>.*?</title>','<title>Clean Energy News — Renew India</title>',head);head=re.sub(r'<meta name="description"[^>]*>','<meta name="description" content="India’s clean energy news: EVs, rooftop solar, solar farming and government schemes. Dated summaries with original sources.">',head)
header=re.search(r'<header>.*?</header>',s,re.S).group().replace(' aria-current="page"','').replace('href="/news/" target="_self"','href="/news/" target="_self" aria-current="page"')
footer=re.search(r'<footer>.*?</footer>',s,re.S).group()
body='<div class="breadcrumbs"><a href="/" target="_self">Home</a><span>/</span><span>News</span></div><section class="page-intro news-intro"><span class="eyebrow">THE DAILY RENEW</span><h1>Clean Energy News</h1><p>The stories shaping how India moves, powers its homes and grows its food.</p><p class="micro">Last updated '+pretty(data['updated'])+' · Selected coverage · AI-assisted summaries with original sources</p></section><section class="section news-archive"><div class="news-controls"><div class="tabs news-filters" aria-label="Filter news by topic">'
for cat in ['All','EVs','Solar','Solar farming','Government schemes']:
 body+='<button type="button" data-news-filter="'+cat+'" aria-pressed="'+str(cat=='All').lower()+'"'+(' class="active"' if cat=='All' else '')+'>'+cat+'</button>'
body+='</div><div class="news-search-row"><label class="search"><span aria-hidden="true">⌕</span><input id="news-search" type="search" aria-label="Search news" placeholder="Search stories, topics or sources"></label><label class="news-sort">Sort by <select id="news-sort"><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label></div></div><p class="micro" id="news-count" role="status">'+str(len(stories))+' stories</p><div class="news-list" id="news-list">'
for a in stories:
 body+='<article id="'+a['id']+'" class="news-story" data-categories="'+e('|'.join(a['categories']),quote=True)+'" data-date="'+a['date']+'">'+meta(a)+'<h2>'+e(a['title'])+'</h2><p class="story-deck">'+e(a['summary'])+'</p><p>'+e(a['detail'])+'</p><div class="news-bottom"><span>'+e(a['source'])+'</span><a href="'+e(a['url'],quote=True)+'" target="_self" rel="noopener">Read original reporting ↗</a></div></article>'
body+='</div><div id="news-empty" class="news-empty" hidden><h2>No stories found</h2><p>Try another search or topic.</p><button class="button" id="news-reset" type="button">Show all news</button></div><p class="micro news-disclosure">Publication dates belong to the original reporting. Summaries are not full reproductions of the source articles. This is a curated edition; automatic daily updates are not yet enabled.</p></section>'
(dist/'news/index.html').write_text('<!doctype html><html lang="en">'+head+'<body><a class="skip" href="#main" target="_self">Skip to content</a>'+header+'<main id="main">'+body+'</main>'+footer+'<script src="/navigation.js"></script><script src="/news.js"></script></body></html>')
print('Rendered',len(stories),'stories and',len(featured),'homepage highlights')
