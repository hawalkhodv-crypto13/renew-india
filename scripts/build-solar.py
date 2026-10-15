from pathlib import Path
import re
from components import solar_widget
r=Path(__file__).resolve().parents[1];p=r/'dist/solar/index.html';s=p.read_text();content=(r/'scripts/solar-content.html').read_text().replace('<!-- SOLAR_CALCULATOR -->',solar_widget())
s=re.sub(r'<main[^>]*>.*?</main>','<main id="main">'+content+'</main>',s,flags=re.S)
s=re.sub(r'<script src="/(?:app|calculators|calculations|road-rules)\.js[^\"]*"></script>','',s)
if '/improvements.css' not in s:s=s.replace('</head>','<link rel="stylesheet" href="/improvements.css?v=7"></head>')
s=s.replace('</body>','<script src="/calculations.js?v=6"></script><script src="/calculators.js?v=6"></script></body>');p.write_text(s)
