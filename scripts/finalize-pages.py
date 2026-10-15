from pathlib import Path
import re
r=Path(__file__).resolve().parents[1];dist=r/'dist'
# Existing saved/bookmarked calculator URLs stay useful, without duplicate calculators.
p=dist/'savings/index.html';s=p.read_text();s=re.sub(r'<main[^>]*>.*?</main>','<main id="main"><section class="section"><h1 class="section-title">Calculators, where you need them.</h1><p>The rooftop calculator now lives on Solar. EV running costs live on Explore EVs.</p><nav class="section-links"><a href="/explore-evs/#running-cost">EV running costs →</a><a href="/solar/#solar-calculator">Rooftop solar savings →</a></nav></section></main>',s,flags=re.S)
s=re.sub(r'<script src="/calculator-redirect.js[^\"]*"></script>','',s);s=s.replace('</body>','<script src="/calculator-redirect.js?v=6"></script></body>');p.write_text(s)
for p in dist.rglob('*.html'):
 s=p.read_text();s=re.sub(r'<script src="/navigation.js[^\"]*"></script>','',s);s=s.replace('<head>','<head><script src="/navigation.js?v=6"></script>',1)
 s=re.sub(r'<script src="/app.js[^\"]*"></script>','',s)
 s=s.replace('href="/solar/#solar"','href="/solar/#rooftop"')
 s=s.replace('/savings/?mode=solar#calculator','/solar/#solar-calculator').replace('/savings/?mode=ev#calculator','/explore-evs/#running-cost').replace('/savings/#calculator','/explore-evs/#running-cost')
 s=s.replace('href="/savings/"','href="/explore-evs/#running-cost"')
 if p==dist/'solar/index.html':
  s=re.sub(r'(<a class="button small" href=")[^"]*',r'\g<1>/solar/#solar-calculator',s)
  s=s.replace('Calculate savings ↗','Solar savings ↗')
 else:s=s.replace('Calculate savings ↗','EV savings ↗')
 s=s.replace('Savings calculator</a>','EV savings</a> <a href="/solar/#solar-calculator" target="_self">Solar savings</a>')
 s=s.replace('Calculate savings →</a>','EV savings →</a> <a href="/solar/#solar-calculator" target="_self">Solar savings →</a>')
 # An explicit target protects the no-JavaScript fallback too.
 s=re.sub(r'<a\b([^>]*\bhref="(?:/|#)[^"]*"[^>]*)>',lambda m:'<a'+re.sub(r'\s+target="[^"]*"','',m[1])+' target="_self">',s)
 if '/improvements.css' not in s:s=s.replace('</head>','<link rel="stylesheet" href="/improvements.css?v=7"></head>')
 p.write_text(s)
print('Finalized navigation and legacy calculator links.')
