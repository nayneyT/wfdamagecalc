"""Refresh the local frame sprites used by the Overframe-style mod cards.

The calculator never requests these images from Overframe at runtime. Source selectors are
documented in the user-supplied of_css/ stylesheets; this script only fetches
the 29 sprites the calculator composes into mod cards.
"""

import json
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "images" / "mods" / "frames" / "overframe"
MANIFEST = ROOT / "images" / "manifest.json"
BASE = "https://overframe.gg/static/images/mod/"
SOURCE_PAGE = "https://overframe.gg/build/1064421/narin/ice-queen-narin-general-use-nuke-and-platform/"
FRAME_NAMES = (
    "BronzeBackground.png", "BronzeFrameTop.png", "BronzeFrameBottom.png",
    "BronzeSideLight.png", "BronzeLowerTab.png",
    "SilverBackground.png", "SilverFrameTop.png", "SilverFrameBottom.png",
    "SilverSideLight.png", "SilverLowerTab.png",
    "GoldBackground.png", "GoldFrameTop.png", "GoldFrameBottom.png",
    "GoldSideLight.png", "GoldLowerTab.png",
    "LegendaryBackground.png", "LegendaryFrameTop.png", "LegendaryFrameBottom.png",
    "LegendarySideLight.png", "LegendaryLowerTab.png",
    "AmalgamBackground.png", "AmalgamFrameTop.png", "AmalgamFrameBottom.png",
    "GalvanizedFrameTop.png", "GalvanizedFrameBottom.png",
    "OmegaFrameTop.png", "OmegaFrameBottom.png", "OmegaSideLight.png",
    "RivenLowerTab.png",
)


def main():
    TARGET.mkdir(parents=True, exist_ok=True)
    downloaded = 0
    for name in FRAME_NAMES:
        path = TARGET / name
        if path.is_file() and path.read_bytes().startswith(b"\x89PNG\r\n\x1a\n"):
            continue
        request = urllib.request.Request(BASE + name, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(request, timeout=20) as response:
            data = response.read()
        if not data.startswith(b"\x89PNG\r\n\x1a\n"):
            raise ValueError(f"The response for {name} was not a PNG")
        path.write_bytes(data)
        downloaded += 1

    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    assets = manifest["assets"]
    by_local = {entry.get("local"): entry for entry in assets}
    for name in FRAME_NAMES:
        local = "images/mods/frames/overframe/" + name
        entry = by_local.get(local)
        if entry is None:
            entry = {}
            assets.append(entry)
        entry.update({
            "file": name,
            "local": local,
            "owners": ["ui/mod-card-frame"],
            "url": BASE + name,
            "sourcePage": SOURCE_PAGE,
            "provider": "Overframe",
            "bytes": (TARGET / name).stat().st_size,
        })
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Overframe mod frames: {len(FRAME_NAMES)} present, {downloaded} downloaded")


if __name__ == "__main__":
    main()
