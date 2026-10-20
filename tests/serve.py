"""Vista previa estática con rangos HTTP para búsqueda temporal de audio."""
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
import os,re
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
 def send_head(self):
  self.byte_range=None
  p=Path(self.translate_path(self.path))
  requested=self.headers.get('Range','')
  if p.is_file() and requested:
   match=re.fullmatch(r'bytes=(\d*)-(\d*)',requested)
   if match:
    size=p.stat().st_size
    start=int(match[1]) if match[1] else max(0,size-int(match[2]))
    end=min(int(match[2]) if match[2] and match[1] else size-1,size-1)
    if start>=size or end<start:self.send_error(416);return None
    f=p.open('rb');f.seek(start);self.byte_range=(start,end)
    self.send_response(206);self.send_header('Content-type',self.guess_type(str(p)));self.send_header('Content-Length',str(end-start+1));self.send_header('Content-Range',f'bytes {start}-{end}/{size}');self.send_header('Accept-Ranges','bytes');self.end_headers();return f
  return super().send_head()
 def end_headers(self):
  self.send_header('Accept-Ranges','bytes');super().end_headers()
 def copyfile(self,source,outputfile):
  if self.byte_range is None:return super().copyfile(source,outputfile)
  remaining=self.byte_range[1]-self.byte_range[0]+1
  while remaining:
   chunk=source.read(min(65536,remaining))
   if not chunk:break
   outputfile.write(chunk);remaining-=len(chunk)
 def log_message(self,*args):pass
print('Vista previa: http://127.0.0.1:8765',flush=True)
ThreadingHTTPServer(('127.0.0.1',8765),Handler).serve_forever()
