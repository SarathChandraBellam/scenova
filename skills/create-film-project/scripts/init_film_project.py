#!/usr/bin/env python3
"""Copy the Scenova starter project into a new destination."""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("destination", type=Path)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    template = Path(__file__).resolve().parents[3] / "assets" / "project-template"
    destination = args.destination.resolve()
    if destination.exists() and any(destination.iterdir()) and not args.force:
        parser.error(f"destination is not empty: {destination}")
    destination.mkdir(parents=True, exist_ok=True)
    shutil.copytree(template, destination, dirs_exist_ok=True)
    validator = Path(__file__).with_name("validate_story.py")
    shutil.copy2(validator, destination / "scripts" / "validate_story.py")
    print(destination)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
