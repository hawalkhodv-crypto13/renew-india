from pathlib import Path
from html.parser import HTMLParser
class Parser(HTMLParser):
 def __init__(self,text):
  super().__init__();self.items=[];self.feed(text)
 def handle_starttag(self,tag,attrs):self.items.append((tag,dict(attrs)))
from urllib.parse import urlparse,unquote
from PIL import Image
import json,hashlib
root=Path(__file__).resolve().parents[1];dist=root/'dist';models=json.loads((root/'vehicle-catalogue.json').read_text());errors=[];pages=list(dist.rglob('*.html'));parsed={p:Parser(p.read_text()) for p in pages}
for p,s in parsed.items():
 for tag,x in s.items:
  if not ('href' in x or 'src' in x):continue
  u=urlparse(x.get('href') or x.get('src') or '')
  if u.scheme or u.netloc or not u.path:continue
  path=(dist/u.path.lstrip('/')) if u.path.startswith('/') else p.parent/u.path
  if path.is_dir():path=path/'index.html'
  if not path.exists():errors.append(f'{p.relative_to(dist)}: missing {u.path}')
  elif u.fragment and path.suffix=='.html' and path in parsed and not any(a.get('id')==unquote(u.fragment) for t,a in parsed[path].items):errors.append(f'{p.relative_to(dist)}: missing anchor {u.path}#{u.fragment}')
  if tag=='a' and x.get('target')=='_blank':errors.append('Internal new tab '+str(p))
for m in models:
 page=dist/'explore-evs'/m['slug']/'index.html'
 if page not in parsed:errors.append('Missing model '+m['slug']);continue
 if sum(t=='h1' for t,a in parsed[page].items)!=1:errors.append('Heading count '+m['slug'])
 if len(m['images'])<2:errors.append('Too few photos '+m['slug'])
 hashes=[]
 for im in m['images']:
  f=dist/im['path'].lstrip('/');Image.open(f).verify();hashes.append(hashlib.sha256(f.read_bytes()).hexdigest())
 if len(set(hashes))!=len(hashes):errors.append('Duplicate photos '+m['slug'])
print('Checked',len(pages),'pages,',len(models),'model galleries,',sum(len(x['images']) for x in models),'images')
print('\n'.join(errors[:30]) if errors else 'PASS: all local routes/assets/anchors, same-tab links, model headings and distinct decodable photos')
raise SystemExit(bool(errors))
