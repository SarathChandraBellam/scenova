# Rendering guidance

- Register one Remotion composition whose duration is derived from the shot list.
- Convert shot start and duration frames into `<Sequence>` boundaries.
- Use `useCurrentFrame()` and `interpolate()` for all render-time animation. Avoid wall-clock time, random values without a fixed seed, and browser-only state.
- Load GLTF assets through a central registry keyed by story-bible IDs. Preload frequently reused models and textures.
- Animate cameras with named rigs: static, pan, tilt, dolly, orbit, crane, handheld, and tracking. Clamp interpolation outside shot ranges.
- Keep a safe title region and verify vertical-video crops separately.
- Normalize dialogue before mixing. Duck music under speech; avoid hard clipping; leave final peak headroom.
- Render low-resolution previews before the final export. Use FFmpeg only for post-render muxing, loudness normalization, subtitles, or delivery variants.
- Cache individual scene outputs when expensive assets are unchanged, but always assemble the final film from the current shot list.
