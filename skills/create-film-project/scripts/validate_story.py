#!/usr/bin/env python3
"""Validate Scenova story contracts without third-party dependencies."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def load(path: Path):
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def require(obj, keys, label, errors):
    for key in keys:
        if key not in obj:
            errors.append(f"{label}: missing {key}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("project", type=Path)
    args = parser.parse_args()
    errors = []
    bible = load(args.project / "story" / "story-bible.json")
    shots = load(args.project / "story" / "shot-list.json")
    require(bible, ["project", "style", "characters", "locations", "props", "voices", "timeline"], "bible", errors)
    require(shots, ["fps", "width", "height", "shots"], "shot-list", errors)
    character_ids = {item.get("id") for item in bible.get("characters", [])}
    location_ids = {item.get("id") for item in bible.get("locations", [])}
    cursor = 0
    seen = set()
    for index, shot in enumerate(shots.get("shots", [])):
        label = f"shots[{index}]"
        require(shot, ["id", "sceneId", "startFrame", "durationFrames", "locationId", "characters", "action", "camera", "lighting", "dialogue", "audio"], label, errors)
        if shot.get("id") in seen:
            errors.append(f"{label}: duplicate id {shot.get('id')}")
        seen.add(shot.get("id"))
        if shot.get("startFrame") != cursor:
            errors.append(f"{label}: expected startFrame {cursor}")
        duration = shot.get("durationFrames", 0)
        if not isinstance(duration, int) or duration <= 0:
            errors.append(f"{label}: durationFrames must be a positive integer")
            duration = 0
        cursor += duration
        if shot.get("locationId") not in location_ids:
            errors.append(f"{label}: unknown locationId {shot.get('locationId')}")
        for character in shot.get("characters", []):
            if character.get("id") not in character_ids:
                errors.append(f"{label}: unknown character {character.get('id')}")
    if errors:
        print("\n".join(errors))
        return 1
    print(f"valid: {len(shots.get('shots', []))} shots, {cursor} frames")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
