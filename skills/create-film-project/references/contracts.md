# Film data contracts

Use JSON, UTF-8, two-space indentation, and stable kebab-case IDs.

## Story bible

Required top-level keys: `project`, `style`, `characters`, `locations`, `props`, `voices`, and `timeline`.

Each character requires `id`, `name`, `appearance`, `wardrobe`, `personality`, and `voiceId`. Describe visible traits concretely. Each location requires `id`, `layout`, `palette`, `lighting`, and persistent `state`. Timeline entries require `atScene`, `event`, and `stateChanges`.

Each voice requires `id`, `provider`, and `description`. Set `provider` to `caption` (spoken lines are rendered as on-screen captions, the default) or `provided` (a user-supplied audio file referenced from the asset manifest) — this project never calls an external text-to-speech service.

## Shot list

Required top-level keys: `fps`, `width`, `height`, and `shots`. Each shot requires:

```json
{
  "id": "shot-001",
  "sceneId": "scene-01",
  "startFrame": 0,
  "durationFrames": 150,
  "locationId": "old-city-rooftop",
  "characters": [{"id": "arjun", "wardrobeId": "arjun-default"}],
  "action": "Arjun crosses the rooftop and stops at the ledge.",
  "camera": {"shot": "medium-wide", "move": "slow-dolly-in", "target": "arjun"},
  "lighting": "warm-sunset",
  "dialogue": [{"characterId": "arjun", "line": "Not tonight.", "startFrame": 30, "durationFrames": 60}],
  "audio": ["distant-traffic", "pigeons"]
}
```

Each `dialogue` entry requires `characterId`, `line`, `startFrame`, and `durationFrames`; the frame offsets are relative to the shot's own start. `characterId` must reference a known character.

Shots must be ordered, non-overlapping, and use integer frames. `startFrame` of every shot after the first must equal the previous shot's `startFrame + durationFrames` unless a deliberate overlap is modeled by separate timeline layers.

## Asset manifest

Track `id`, `type`, `path`, `status`, `source`, `license`, and `prompt` for every model, texture, image, voice, music track, or effect. Allowed status values are `placeholder`, `planned`, `generated`, `provided`, and `approved`. Set `source` to `procedural` for anything built or synthesized by this project's own code (Three.js geometry, `scripts/synthesize_audio.mjs`) or `provided` for a user-supplied file — this project never calls an external generation service, so no other `source` value should appear.
