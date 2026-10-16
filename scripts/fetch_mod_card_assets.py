"""Download local Warframe mod artwork and compositing frame assets.

This is a development-only data refresh. The browser app stays fully offline.
"""

import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from embedded_data import replace_embedded_category
from enrich_mod_ranks import SOURCE, choose, key


ROOT = Path(__file__).resolve().parents[1]
MODS = ROOT / "data" / "mods.json"
ICON_DIR = ROOT / "images" / "mods" / "icons"
FRAME_DIR = ROOT / "images" / "mods" / "frames"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; VoidArsenal/1.0)",
    "Referer": "https://warframe.fandom.com/",
}
PREFIXES = ("Bronze", "Silver", "Gold", "Legendary", "Galvanized", "Amalgam", "Riven")
PIECES = (
    "Background", "FrameTop", "FrameBottom", "LowerTab", "SideLight",
    "CornerLights", "TopRightBacker",
)
EXTRAS = ("RankCompleteLine", "RankSlotActive")
IMAGE_MANIFEST = ROOT / "images" / "manifest.json"


def fetch(url: str, headers: dict[str, str] | None = None) -> bytes:
    request = urllib.request.Request(url, headers=headers or HEADERS)
    with urllib.request.urlopen(request, timeout=25) as response:
        return response.read()


def wiki_mod_icons(records):
    url = (
        "https://wiki.warframe.com/api.php?action=parse&page=Module%3AMods%2Fdata"
        "&prop=wikitext&format=json"
    )
    wiki_headers = {
        "User-Agent": "VoidArsenal/1.0 (local mod artwork catalogue)",
        "Accept": "application/json",
    }
    payload = json.loads(fetch(url, wiki_headers))
    wikitext = payload.get("parse", {}).get("wikitext", {}).get("*", "")
    # Mod records are two tabs deep. Nested tables such as Incompatible also
    # contain names and must not be mistaken for another mod record.
    record_pattern = (
        r'(?m)^(?P<indent>[\t ]+)'
        r'(?:\["(?P<quoted>[^"]+)"\]|(?P<plain>[A-Za-z_][A-Za-z0-9_]*))\s*=\s*\{'
    )
    headers = [
        match
        for match in re.finditer(record_pattern, wikitext)
        if match.group("indent") == "\t\t"
    ]
    wanted = {record["name"] for record in records}
    icons = {}
    for index, header in enumerate(headers):
        indent = header.group("indent")
        end = next(
            (
                candidate.start()
                for candidate in headers[index + 1:]
                if candidate.group("indent") == indent
            ),
            len(wikitext),
        )
        block = wikitext[header.end():end]
        name_match = re.search(r'(?m)^\s*Name\s*=\s*"([^"]+)"', block)
        icon_match = re.search(r'(?m)^\s*Icon\s*=\s*"([^"]+)"', block)
        name = (
            name_match.group(1)
            if name_match
            else header.group("quoted") or header.group("plain")
        )
        valid_icon = icon_match and re.fullmatch(
            r"[A-Za-z0-9_.-]+\.(?:png|jpe?g|webp|gif)", icon_match.group(1), re.I
        )
        if name in wanted and valid_icon:
            icons[name] = icon_match.group(1)
    return icons


def download_wiki_icon(name):
    target = ICON_DIR / "wiki" / name
    if target.exists():
        return name, True
    url = "https://wiki.warframe.com/images/" + urllib.parse.quote(name)
    try:
        data = fetch(
            url,
            {
                "User-Agent": "VoidArsenal/1.0 (local mod artwork catalogue)",
                "Referer": "https://wiki.warframe.com/",
            },
        )
        if not data.startswith((b"\xff\xd8", b"\x89PNG", b"RIFF", b"GIF8")):
            print(f"Wiki icon has an unsupported image format: {name}", file=sys.stderr)
            return name, False
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        return name, True
    except (OSError, urllib.error.URLError, TimeoutError) as error:
        print(f"Wiki icon download failed for {name}: {error}", file=sys.stderr)
        return name, False


def download_icon(name):
    if not re.fullmatch(r"[A-Za-z0-9_.-]+\.(?:jpg|jpeg|png|webp)", name, re.I):
        return name, False
    target = ICON_DIR / name
    if target.exists():
        return name, True
    url = "https://cdn.warframestat.us/img/" + urllib.parse.quote(name)
    try:
        data = fetch(url)
        if not data.startswith((b"\xff\xd8", b"\x89PNG", b"RIFF")):
            print(f"WFCD icon has an unsupported image format: {name}", file=sys.stderr)
            return name, False
        target.write_bytes(data)
        return name, True
    except (OSError, urllib.error.URLError, TimeoutError) as error:
        print(f"WFCD icon download failed for {name}: {error}", file=sys.stderr)
        return name, False


def download_frames():
    names = [prefix + piece + ".png" for prefix in PREFIXES for piece in PIECES]
    names += [name + ".png" for name in EXTRAS]
    result = {}
    for start in range(0, len(names), 35):
        batch = names[start:start + 35]
        query = urllib.parse.urlencode(
            {
                "action": "query",
                "titles": "|".join("File:" + name for name in batch),
                "prop": "imageinfo",
                "iiprop": "url",
                "format": "json",
            }
        )
        data = json.loads(fetch("https://warframe.fandom.com/api.php?" + query))
        for page in data["query"]["pages"].values():
            info = page.get("imageinfo")
            if info:
                result[page["title"].removeprefix("File:")] = info[0]["url"]
    available = {}
    for name, url in result.items():
        target = FRAME_DIR / name
        original = url.split("?")[0].split("/revision/")[0] + "/revision/latest?format=original"
        try:
            if not target.exists():
                data = fetch(original)
                if not data.startswith(b"\x89PNG"):
                    print(f"Frame has an unsupported image format: {name}", file=sys.stderr)
                    continue
                target.write_bytes(data)
            available[name] = {
                "url": original,
                "sourcePage": "https://warframe.fandom.com/wiki/File:" + urllib.parse.quote(name),
            }
        except (OSError, urllib.error.URLError, TimeoutError) as error:
            print(f"Frame download failed for {name}: {error}", file=sys.stderr)
    return available


def update_image_manifest(icon_owners, frame_sources, wiki_icon_sources):
    try:
        manifest = json.loads(IMAGE_MANIFEST.read_text(encoding="utf-8"))
    except FileNotFoundError:
        manifest = {"source": "Canonical local-to-source registry.", "assets": [], "missing": []}
    if not isinstance(manifest.get("assets"), list):
        raise ValueError("Image manifest has no assets list; refusing to replace it.")
    assets = manifest.setdefault("assets", [])
    by_local = {asset.get("local"): asset for asset in assets if asset.get("local")}
    for asset in assets:
        if str(asset.get("local", "")).startswith("images/mods/icons/wiki/"):
            asset["owners"] = []

    def upsert(local, file_name, owners, url, source_page, provider):
        target = ROOT / local
        if not target.is_file():
            return
        entry = by_local.get(local, {})
        entry.update({
            "file": file_name,
            "local": local,
            "owners": sorted(set(entry.get("owners", [])) | set(owners)),
            "url": url,
            "sourcePage": source_page,
            "provider": provider,
            "bytes": target.stat().st_size,
        })
        if entry not in assets:
            assets.append(entry)
        by_local[local] = entry

    for name, owners in icon_owners.items():
        upsert(
            "images/mods/icons/" + name,
            name,
            owners,
            "https://cdn.warframestat.us/img/" + urllib.parse.quote(name),
            "https://github.com/WFCD/warframe-items",
            "WFCD warframe-items CDN",
        )
    for name, source in frame_sources.items():
        upsert(
            "images/mods/frames/" + name,
            name,
            ["mods/frame/" + Path(name).stem],
            source["url"],
            source["sourcePage"],
            "Warframe Wiki file catalog (Fandom)",
        )
    for name, source in wiki_icon_sources.items():
        upsert(
            "images/mods/icons/wiki/" + name,
            name,
            source["owners"],
            "https://wiki.warframe.com/images/" + urllib.parse.quote(name),
            "https://wiki.warframe.com/w/File:" + urllib.parse.quote(name),
            "Warframe Wiki",
        )
    assets.sort(key=lambda asset: asset.get("local", ""))
    IMAGE_MANIFEST.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def main() -> None:
    ICON_DIR.mkdir(parents=True, exist_ok=True)
    FRAME_DIR.mkdir(parents=True, exist_ok=True)
    source = json.loads(fetch(SOURCE))
    by_name = defaultdict(list)
    for item in source:
        by_name[key(item.get("name", ""))].append(item)
    database = json.loads(MODS.read_text(encoding="utf-8"))
    chosen = {mod["id"]: choose(mod, by_name[key(mod["name"])]) for mod in database["records"]}
    wiki_icons = wiki_mod_icons(database["records"])
    wiki_owners = defaultdict(list)
    for mod in database["records"]:
        if mod["name"] in wiki_icons:
            wiki_owners[wiki_icons[mod["name"]]].append(mod["id"])
    icon_owners = defaultdict(list)
    for mod in database["records"]:
        item = chosen[mod["id"]]
        if item and item.get("imageName"):
            icon_owners[item["imageName"]].append(mod["id"])
    names = set(icon_owners)
    downloaded = set()
    with ThreadPoolExecutor(max_workers=12) as pool:
        for future in as_completed([pool.submit(download_icon, name) for name in names]):
            name, okay = future.result()
            if okay:
                downloaded.add(name)
    wiki_downloaded = set()
    with ThreadPoolExecutor(max_workers=10) as pool:
        for future in as_completed([pool.submit(download_wiki_icon, name) for name in wiki_owners]):
            name, okay = future.result()
            if okay:
                wiki_downloaded.add(name)
    for mod in database["records"]:
        item = chosen[mod["id"]]
        if item:
            if item.get("rarity"):
                mod["rarity"] = item["rarity"]
            if item.get("imageName") in downloaded:
                mod["icon"] = "images/mods/icons/" + item["imageName"]
        icon_name = wiki_icons.get(mod["name"])
        if icon_name:
            mod["iconSource"] = "https://wiki.warframe.com/w/File:" + urllib.parse.quote(icon_name)
            local_icon = "images/mods/icons/wiki/" + icon_name
            if icon_name in wiki_downloaded:
                current = mod.get("icon")
                if (
                    current and current != local_icon
                    and not current.startswith("images/mods/icons/wiki/")
                ):
                    mod["iconFallback"] = current
                mod["icon"] = local_icon
        else:
            mod.pop("iconSource", None)
            if mod.get("icon", "").startswith("images/mods/icons/wiki/"):
                mod["icon"] = mod.get("iconFallback") or mod.get("image", "")
    html_path = ROOT / "index.html"
    html = html_path.read_text(encoding="utf-8")
    updated_html = replace_embedded_category(html, "mods", database)
    MODS.write_text(json.dumps(database, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    html_path.write_text(updated_html, encoding="utf-8")
    frames = download_frames()
    wiki_sources = {
        name: {"owners": owners}
        for name, owners in wiki_owners.items()
        if name in wiki_downloaded
    }
    update_image_manifest(icon_owners, frames, wiki_sources)
    print(
        f"Wiki icons: {len(wiki_downloaded)}/{len(wiki_owners)}; "
        f"WFCD icons: {len(downloaded)}/{len(names)}; "
        f"frame assets: {len(frames)}; image manifest updated."
    )


if __name__ == "__main__":
    main()
