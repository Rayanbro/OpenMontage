# Documentary Pro — incremental AI-assisted pipeline

This is an **experimental** upgrade, not a finished automatic documentary producer.

## Implemented
- `scripts/documentary_plan.py`: deterministic chapter-aware script parser. Accepts Markdown chapters, `**HH:MM–HH:MM**` ranges, and `**NARRATOR:**` blocks; creates shot plans at 1920×1080/24fps. Example: `python3 scripts/documentary_plan.py documentary.md --out shot-plan.json`.
- `scripts/documentary_tts.py`: opt-in OpenAI speech API client, per-shot MP3 output, HTTP retries and size limits. Run only after reviewing narration text and projected API costs: `OPENAI_API_KEY=... python3 scripts/documentary_tts.py shot-plan.json --max-shots 1`. Do **not** put the key in shell history or source files; prefer GitHub Actions secrets or a secrets manager.
- `src/documentary-pro.tsx`: Remotion composition `DocumentaryPro1080`, 1920×1080 at 24fps, with stick figures, camera drift, illustrated fallback scenes, optional user-provided background assets under `public/`, and optional narration audio under `public/`.
- `.github/workflows/documentary-pro-preview.yml`: 10-second automated preview test, not a 20-minute production export.

## Not yet implemented
- LLM-based semantic scene direction or generated image assets. The script planner divides narration into approximate shots; it does not understand or illustrate every sentence.
- A validated, complete narration track aligned to all 20 minutes. The MP3 generator does not time-stretch audio to fit fixed shots, and some shots can be longer/shorter than narration.
- Music licensing, SFX mixing, subtitles, lip sync, professional character rigging, or full 1080p documentary orchestration.
- The original user script has not yet been committed as a standalone Markdown file; add it to run the planner.

## Security and cost
- No API keys in repository files, workflows, logs, or client-side Remotion code.
- TTS API calls are explicitly opt-in; never run a whole-document job before estimating cost and reviewing a one-shot test.
- Generated images should be cached, versioned, and reviewed before final export. Do not commit unlicensed third-party images.
- A workflow using GitHub secrets should be manually dispatched and avoid untrusted PR execution.

## Next production steps
1. Store the original documentary Markdown script and generate a shot plan.
2. Add an optional LLM director with strict JSON validation and shot-specific asset prompts.
3. Add provider-backed illustration generation with image provenance and cost caps.
4. Generate narration and measure actual audio durations with ffprobe; align visuals to speech.
5. Render a 30–60 second narrated proof of concept, review quality, then run a full export.
