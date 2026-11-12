#!/usr/bin/env python3
"""Optional OpenAI TTS, securely invoked from local environment or GitHub secrets.

python3 scripts/documentary_tts.py shot-plan.json --out-dir public/narration
Requires OPENAI_API_KEY. Uses HTTPS, bounded timeouts, retries, and no key logging.
Audio is generated per shot. Provider durations may differ from shot durations;
the render pipeline must verify/retime before production delivery.
"""
import argparse,json,os,pathlib,time,urllib.request,urllib.error
ENDPOINT="https://api.openai.com/v1/audio/speech"
def synthesize(text,key,voice,model):
    payload=json.dumps({'model':model,'voice':voice,'input':text,'response_format':'mp3'}).encode()
    request=urllib.request.Request(ENDPOINT,data=payload,method='POST',
        headers={'Authorization':'Bearer '+key,'Content-Type':'application/json'})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(request,timeout=90) as response:
                audio=response.read(15_000_001)
                if len(audio)>15_000_000:raise ValueError('TTS response exceeds size limit')
                return audio
        except urllib.error.HTTPError as e:
            if e.code not in (429,500,502,503,504) or attempt==3:
                raise RuntimeError(f'TTS request failed (HTTP {e.code})') from None
        except (TimeoutError,urllib.error.URLError):
            if attempt==3:raise RuntimeError('TTS network request failed') from None
        time.sleep(min(2**attempt,8))
    raise RuntimeError('TTS failed')
def main():
    p=argparse.ArgumentParser();p.add_argument('plan');p.add_argument('--out-dir',default='public/narration')
    p.add_argument('--voice',default='onyx');p.add_argument('--model',default='tts-1')
    p.add_argument('--max-shots',type=int,default=0,help='0 means all; use 1 for low-cost smoke test')
    a=p.parse_args();key=os.getenv('OPENAI_API_KEY')
    if not key:raise SystemExit('OPENAI_API_KEY must be set securely; no audio generated')
    shots=json.loads(pathlib.Path(a.plan).read_text())['shots']
    if len(shots)>300:raise SystemExit('Shot limit exceeded')
    out=pathlib.Path(a.out_dir);out.mkdir(parents=True,exist_ok=True)
    for i,shot in enumerate(shots[:a.max_shots or len(shots)]):
        text=shot['narration'].strip()
        if not text or len(text)>4096:raise ValueError('Invalid narration length')
        target=out/f'shot-{i:03d}.mp3'
        if target.exists() and target.stat().st_size>1000:continue
        target.write_bytes(synthesize(text,key,a.voice,a.model))
        print(f'Created audio shot {i+1}/{len(shots)}')
if __name__=='__main__':main()
