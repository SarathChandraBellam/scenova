# Film data contracts

Use JSON, UTF-8, two-space indentation, and stable kebab-case IDs.

## Story bible

Required top-level keys: `project`, `style`, `characters`, `locations`, `props`, `voices`, and `timeline`.

Each character requires `id`, `name`, `appearance`, `wardrobe`, `personality`, and `voiceId`. Describe visible traits concretely. Each location requires `id`, `layout`, `palette`, `lighting`, and persistent `state`. Timeline entries require `atScene`, `event`, and `stateChanges`.

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
  "dialogue": [],
  "audio": ["distant-traffic", "pigeons"]
}
```

Shots must be ordered, non-overlapping, and use integer frames. `startFrame` of every shot after the first must equal the previous shot's `startFrame + durationFrames` unless a deliberate overlap is modeled by separate timeline layers.

## Asset manifest

Track `id`, `type`, `path`, `status`, `source`, `license`, and `prompt` for every model, texture, image, voice, music track, or effect. Allowed status values are `placeholder`, `planned`, `generated`, `provided`, and `approved`.
