"""Nueva locución con la misma voz local del aula anterior. No modifica antecedentes."""
from pathlib import Path
import os,json,hashlib,subprocess,time,re
os.environ['ORT_LOG_SEVERITY_LEVEL']='3'
os.environ['HF_HUB_DISABLE_TELEMETRY']='1'
import numpy as np
import soundfile as sf
import onnxruntime as ort
from kokoro_onnx import Kokoro
ROOT=Path(__file__).resolve().parents[1]
OLD=Path(os.environ['KOKORO_WORK_DIR'])
OUT=ROOT/'assets/audio';OUT.mkdir(exist_ok=True)
CACHE=ROOT/'production/audio-cache';CACHE.mkdir(exist_ok=True)
D=json.loads((ROOT/'production/presentation-script.json').read_text())
opt=ort.SessionOptions();opt.intra_op_num_threads=4;opt.inter_op_num_threads=1;opt.log_severity_level=3
ort.disable_telemetry_events()
session=ort.InferenceSession(str(OLD/'models/kokoro-v1.0.onnx'),sess_options=opt,providers=['CPUExecutionProvider'])
k=Kokoro.from_session(session,str(OLD/'models/voices-v1.0.bin'))
SR=24000
config=dict(engine='kokoro-onnx',voice='em_alex',language='es',speed=.90,atempo=1.04,sample_rate=SR)
def groups(p):
 out=[];buf=''
 for sent in re.split(r'(?<=[.!?])\s+',p):
  if len(buf)+len(sent)+1>380 and buf:out.append(buf);buf=''
  buf=(buf+' '+sent).strip()
 if buf:out.append(buf)
 return out
def synth(text):
 key=hashlib.sha256(json.dumps([text,config],ensure_ascii=False,sort_keys=True).encode()).hexdigest()[:22]
 p=CACHE/(key+'.wav')
 if not p.exists():
  x,sr=k.create(text,voice='em_alex',speed=.90,lang='es')
  sf.write(p,x,sr,subtype='FLOAT')
 x,sr=sf.read(p,dtype='float32')
 active=np.flatnonzero(np.abs(x)>.006)
 if len(active):x=x[max(0,active[0]-2400):min(len(x),active[-1]+2400)]
 fade=min(120,len(x)//2)
 if fade:
  x[:fade]*=np.linspace(0,1,fade);x[-fade:]*=np.linspace(1,0,fade)
 return x
manifest=[];start=time.time()
for scene in D['scenes']:
 t=time.time();parts=[];events=[];pos=0
 def add(x,kind,text=''):
  global pos
  events.append(dict(start=pos/1.04,end=(pos+len(x)/SR)/1.04,kind=kind,text=text));parts.append(x);pos+=len(x)/SR
 heading=('Capítulo '+str(scene['chapter']+1)+'. ' if scene['id']==next(s['id'] for s in D['scenes'] if s['chapter']==scene['chapter']) else '')+scene['title'].replace('IS','i ese').replace('LM','ele eme').replace('Y','el producto').replace('ΔI','el cambio de inversión').replace('m + 40','dinero real más cuarenta').replace('M + 80','dinero nominal más ochenta').replace('P = 2','el precio es dos').replace('G + 60','gasto público más sesenta').replace('a > 0','a positiva')
 add(synth(heading),'heading',scene['title']);add(np.zeros(round(.5*SR),np.float32),'breath')
 for paragraph in scene['paragraphs']:
  for group in groups(paragraph):
   add(synth(group),'speech',group);add(np.zeros(round(.20*SR),np.float32),'breath')
  add(np.zeros(round(.25*SR),np.float32),'breath')
 if scene.get('pause'):add(np.zeros(round(scene['pause']*1.04*SR),np.float32),'study_pause',scene['pausePurpose'])
 add(np.zeros(round(.65*SR),np.float32),'gap')
 wav=CACHE/f"slide-{scene['id']:02}.wav";sf.write(wav,np.concatenate(parts),SR,subtype='FLOAT')
 mp3=OUT/f"diapositiva-{scene['id']:02}.mp3"
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(wav),'-af','atempo=1.04,loudnorm=I=-18:TP=-1.5:LRA=9','-ar','24000','-b:a','80k',str(mp3)],check=True)
 probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','json',str(mp3)]))
 duration=float(probe['format']['duration'])
 scene.update(audio='assets/audio/'+mp3.name,duration=duration,events=events)
 manifest.append(dict(id=scene['id'],duration=duration,sha256=hashlib.sha256(mp3.read_bytes()).hexdigest(),peak_source=float(np.max(np.abs(np.concatenate(parts))))))
 print(f"Diapositiva {scene['id']:02}: {duration:.1f} s; síntesis {time.time()-t:.1f} s",flush=True)
 (ROOT/'assets/presentation-data.js').write_text('window.PresentationData = '+json.dumps(D,ensure_ascii=False)+';\n')
 (ROOT/'production/presentation-timeline.json').write_text(json.dumps(D,ensure_ascii=False,indent=2))
(ROOT/'verification/audio_presentacion.json').write_text(json.dumps(dict(status='PASS',config=config,slides=manifest,total_seconds=sum(s['duration'] for s in manifest),production_seconds=time.time()-start),ensure_ascii=False,indent=2))
print('COMPLETO',sum(s['duration'] for s in manifest),'segundos; generación',time.time()-start,flush=True)
