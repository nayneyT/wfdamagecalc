"""Download image assets from images/manifest.json into the local app folder.

This is a fallback for browsers without the File System Access API. The app
itself remains a static HTML/JavaScript application with no Python dependency.
"""

import argparse
import json
import logging
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "images" / "manifest.json"
HEADERS = {"User-Agent": "VoidArsenalImageDownloader/1.0"}


def image_bytes(url: str) -> bytes:
    request = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(request, timeout=45) as response:
        content_type = response.headers.get("Content-Type", "").split(";", 1)[0]
        data = response.read()
        if not content_type.startswith("image/"):
            raise ValueError(f"source returned {content_type or 'no content type'}")
        if not data:
            raise ValueError("source returned an empty file")
        return data


def download(url: str) -> bytes:
    try:
        return image_bytes(url)
    except (OSError, ValueError) as direct_error:
        proxy = "https://images.weserv.nl/?url=" + urllib.parse.quote(url, safe="")
        try:
            return image_bytes(proxy)
        except (OSError, ValueError) as proxy_error:
            raise RuntimeError(f"source: {direct_error}; proxy: {proxy_error}") from proxy_error


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--limit", type=int, default=0, help="check only the first N assets (for testing)"
    )
    args = parser.parse_args()
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    entries = manifest.get("assets")
    if not isinstance(entries, list):
        raise ValueError(f"{MANIFEST} must contain an assets list")
    if any(
        not isinstance(entry, dict) or not isinstance(entry.get("local"), str)
        for entry in entries
    ):
        raise ValueError(f"{MANIFEST} contains an asset without a local path")
    assets = [(entry["local"], entry["url"]) for entry in entries if entry.get("url")]
    if args.limit > 0:
        assets = assets[: args.limit]
    log_path = ROOT / "image-download.log"
    logger = logging.getLogger("void_arsenal_image_download")
    logger.setLevel(logging.INFO)
    handler = logging.FileHandler(log_path, encoding="utf-8")
    formatter = logging.Formatter("%(asctime)s UTC %(levelname)s %(message)s", "%Y-%m-%d %H:%M:%S")
    formatter.converter = time.gmtime
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.info("Started download of %d manifest images", len(assets))
    print(f"Detailed log: {log_path}", flush=True)
    saved = skipped = failed = 0
    try:
        for count, (local, url) in enumerate(assets, 1):
            parts = Path(local).parts
            if not parts or parts[0] != "images" or any(part in (".", "..") for part in parts):
                failed += 1
                logger.error("INVALID PATH %s", local)
                print(f"Invalid manifest path: {local}", file=sys.stderr)
                continue
            target = ROOT.joinpath(*parts)
            if target.is_file() and target.stat().st_size:
                skipped += 1
                logger.info("SKIPPED %s (already present)", local)
            else:
                try:
                    data = download(url)
                    target.parent.mkdir(parents=True, exist_ok=True)
                    target.write_bytes(data)
                    saved += 1
                    logger.info("DOWNLOADED %s <- %s (%d bytes)", local, url, len(data))
                except (OSError, ValueError, RuntimeError) as error:
                    failed += 1
                    logger.error("FAILED %s <- %s: %s", local, url, error)
                    print(f"Failed: {local}: {error}", file=sys.stderr)
            if count % 25 == 0 or count == len(assets):
                print(
                    f"{count}/{len(assets)} checked - {saved} downloaded - "
                    f"{skipped} present - {failed} failed",
                    flush=True,
                )
        logger.info("Finished: %d downloaded, %d present, %d failed", saved, skipped, failed)
    finally:
        logger.removeHandler(handler)
        handler.close()
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
