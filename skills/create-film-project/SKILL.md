---
name: create-film-project
description: Create, continue, revise, or render story-driven film projects with consistent characters, locations, props, voices, and chronology using Three.js or React Three Fiber, Remotion, and FFmpeg. Use when a user asks to turn a story, screenplay, outline, or scene idea into an animated video or multi-scene film; maintain continuity across generated clips; edit an existing generated film; regenerate selected scenes; add narration, dialogue, music, or sound effects; or export an MP4.
---

# Create Film Project

Build an editable film project rather than returning disconnected clips. Treat the story bible and scene specifications as the source of truth.

## Workflow

1. Inspect the destination and any existing film files. Continue an existing project when `story/story-bible.json` exists.
2. Resolve only decisions that materially change the film: runtime, aspect ratio, language, visual style, and whether supplied assets must be used. Use reasonable defaults when the user leaves them open.
3. Run `scripts/init_film_project.py <destination>` from this skill to copy the starter project when a new project is required.
4. Write `story/story-bible.json` before screenplay or code. Assign stable IDs to characters, locations, wardrobe, props, and voices. Never silently change an established identity.
5. Write `story/screenplay.md`, then `story/shot-list.json`. Each shot must cite stable bible IDs and include duration, action, camera, lighting, dialogue, and audio cues.
6. Validate structured files with `scripts/validate_story.py <project>`. Fix all errors before generating scenes.
7. Implement scenes using the shared registries under `src/lib/`; do not duplicate character or location definitions inside scenes. Keep procedural animation deterministic by deriving it from Remotion's current frame.
8. Add dialogue, narration, music, and effects as timeline layers. Store generated media under `public/assets/audio/` and record provenance in the bible.
9. Preview representative frames, then render. Check first/last frames, scene boundaries, identity continuity, dialogue timing, clipping, and audio peaks.
10. On revisions, change the smallest possible surface. Re-render selected scenes or the final composition without rebuilding unaffected identities.

## Defaults

- Use 1920x1080, 30 fps, and 60 seconds unless the prompt implies otherwise.
- Prefer stylized reusable GLTF assets over regenerating a character for every shot.
- Use React Three Fiber for 3D composition and Remotion for deterministic timing and export.
- Keep shots between 2 and 8 seconds unless pacing requires otherwise.
- Use placeholders when an external generator or credential is unavailable; leave explicit asset tasks in `story/asset-manifest.json`.
- Do not imitate a living artist's exact style. Translate style requests into high-level visual properties.
- Do not clone a real person's face or voice without clear authorization.

## Continuity contract

- Stable IDs are immutable across scenes and sequels.
- A wardrobe, injury, prop, time-of-day, or location-state change requires a timeline event.
- Dialogue voice IDs must remain stable unless the user asks to recast.
- A scene may reference only known entities or explicitly introduce new ones into the bible first.
- Revisions must update downstream continuity notes when they change story state.

Read [references/contracts.md](references/contracts.md) when authoring or repairing the JSON files. Read [references/rendering.md](references/rendering.md) when implementing complex cameras, animation, audio, or export.

## Completion

Deliver the editable project plus the rendered MP4 when rendering dependencies are available. Otherwise deliver a validated, render-ready project and state the exact missing dependency or credential. Summarize runtime, scenes, resolution, audio status, and any placeholders.
