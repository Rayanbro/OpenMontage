#!/usr/bin/env python3
"""Generate timed shot plans from a documentary script. Standard library only.

Usage: python3 scripts/documentary_plan.py script.md --out shot-plan.json
Input headings: ## CHAPTER ... and optional **HH:MM–HH:MM** timeline lines.
No external API calls. Narration text is kept verbatim between NARRATOR and VISUAL/SOUND cues.
"""
import argparse,json,re,pathlib,sys
def seconds(clock):
    a=list(map(int,clock.split(':')))
    return a[0]*60+a[1] if len(a)==2 else a[0]*3600+a[1]*60+a[2]
def plan(source,shots_per_chapter=12):
    chapters=re.split(r'(?=^##\s+CHAPTER\s+\d+)',source,flags=re.M)
    output=[]
    for raw in chapters:
        m=re.search(r'^##\s+CHAPTER\s+\d+\s*[—-]\s*(.+)',raw,re.M)
        if not m:continue
        timeline=re.search(r'\*\*(\d\d:\d\d)\s*[–-]\s*(\d\d:\d\d)\*\*',raw)
        if not timeline:raise ValueError('Chapter missing HH:MM–HH:MM range: '+m.group(1))
        start,end=map(seconds,timeline.groups())
        if end<=start:raise ValueError('Invalid timeline')
        # Extract narration blocks without accidentally treating visual cues as spoken words.
        narration=[]
        for block in re.split(r'(?=\*\*(?:NARRATOR|VISUAL|SOUND|ON-SCREEN)[^*]*\*\*)',raw,flags=re.I):
            if re.match(r'\*\*NARRATOR[^*]*\*\*',block,re.I):
                body=re.sub(r'^\*\*NARRATOR[^*]*\*\*\s*:?', '',block).strip()
                narration.append(body)
        spoken='\n\n'.join(narration).strip()
        if not spoken:raise ValueError('Missing narrator text in '+m.group(1))
        # Sentence-aligned chunks with exact duration accounting.
        sentences=re.split(r'(?<=[.!?])\s+(?=[A-Z“])',re.sub(r'\s+',' ',spoken))
        groups=[[] for _ in range(shots_per_chapter)]
        for i,sentence in enumerate(sentences):
            groups[min(shots_per_chapter-1,i*shots_per_chapter//max(1,len(sentences)))].append(sentence)
        boundaries=[start+round((end-start)*i/shots_per_chapter) for i in range(shots_per_chapter+1)]
        visuals=re.findall(r'\*\*VISUAL:\*\*\s*(.*?)(?=\n\s*\*\*|\Z)',raw,re.S|re.I)
        for i in range(shots_per_chapter):
            text=' '.join(groups[i]).strip()
            if not text:continue
            output.append({'chapter':m.group(1).strip(),'startSeconds':boundaries[i],
              'durationSeconds':boundaries[i+1]-boundaries[i],'narration':text,
              'visualDirection':re.sub(r'\s+',' ',visuals[min(i*len(visuals)//shots_per_chapter,len(visuals)-1)]).strip() if visuals else '',
              'style':'cinematic-2d-stick-figure','shot':i+1})
    if not output:raise ValueError('No chapters found')
    return {'schemaVersion':1,'fps':24,'width':1920,'height':1080,'shots':output}
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('script');p.add_argument('--out',default='shot-plan.json');p.add_argument('--shots-per-chapter',type=int,default=12);a=p.parse_args()
    result=plan(pathlib.Path(a.script).read_text(encoding='utf8'),a.shots_per_chapter)
    pathlib.Path(a.out).write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
    print(f"Prepared {len(result['shots'])} shots -> {a.out}")
