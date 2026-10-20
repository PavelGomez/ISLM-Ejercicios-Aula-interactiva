from pathlib import Path
import json,re,subprocess,hashlib
r=Path(__file__).resolve().parents[1]
p=json.loads((r/'verification/audio_presentacion.json').read_text())
timeline=json.loads((r/'production/presentation-timeline.json').read_text())
checks=[]
for s in timeline['scenes']:
 path=r/s['audio']
 run=subprocess.run(['ffmpeg','-hide_banner','-i',str(path),'-af','volumedetect','-f','null','-'],capture_output=True,text=True,check=True)
 peak=float(re.search(r'max_volume: ([\-0-9.]+) dB',run.stderr)[1]);mean=float(re.search(r'mean_volume: ([\-0-9.]+) dB',run.stderr)[1])
 assert peak<0 and mean>-40,(s['id'],peak,mean)
 assert s['duration']>20 and all(e['end']>=e['start']>=0 for e in s['events'])
 assert s['events'][-1]['end']<=s['duration']+.1
 checks.append(dict(slide=s['id'],duration=s['duration'],decode='PASS',max_volume_dB=peak,mean_volume_dB=mean,sha256=hashlib.sha256(path.read_bytes()).hexdigest()))
(r/'verification/audio_decodificacion.json').write_text(json.dumps(dict(status='PASS',voice='em_alex',language='es',slides=checks,total_seconds=sum(s['duration'] for s in checks),scope='Decodificación y niveles de los 28 audios. Revisión escrita del guion y lectura de ecuaciones; no se afirma una audición humana completa.'),ensure_ascii=False,indent=2))
print('28 audios decodificados; niveles sin saturación; eventos y duración consistentes.')
