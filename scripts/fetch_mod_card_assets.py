"""Download local Warframe mod artwork and compositing frame assets.

This is a development-only data refresh. The browser app stays fully offline.
"""

import json
import re
import urllib.parse
import urllib.request
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from enrich_mod_ranks import SOURCE, choose, key


ROOT = Path(__file__).resolve().parents[1]
MODS = ROOT / "data" / "mods.json"
ICON_DIR = ROOT / "images" / "mods" / "icons"
FRAME_DIR = ROOT / "images" / "mods" / "frames"
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; VoidArsenal/1.0)", "Referer": "https://warframe.fandom.com/"}
PREFIXES = ("Bronze", "Silver", "Gold", "Legendary", "Galvanized", "Amalgam", "Riven")
PIECES = ("Background", "FrameTop", "FrameBottom", "LowerTab", "SideLight", "CornerLights", "TopRightBacker")
EXTRAS = ("RankCompleteLine", "RankSlotActive")


def fetch(url):
    request = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(request, timeout=25) as response:
        return response.read()


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
            return name, False
        target.write_bytes(data)
        return name, True
    except Exception:
        return name, False


def download_frames():
    names = [prefix + piece + ".png" for prefix in PREFIXES for piece in PIECES] + [name + ".png" for name in EXTRAS]
    result = {}
    for start in range(0, len(names), 35):
        batch = names[start:start + 35]
        query = urllib.parse.urlencode({"action": "query", "titles": "|".join("File:" + name for name in batch),
                                         "prop": "imageinfo", "iiprop": "url", "format": "json"})
        data = json.loads(fetch("https://warframe.fandom.com/api.php?" + query))
        for page in data["query"]["pages"].values():
            info = page.get("imageinfo")
            if info:
                result[page["title"].removeprefix("File:")] = info[0]["url"]
    count = 0
    for name, url in result.items():
        target = FRAME_DIR / name
        if target.exists():
            count += 1
            continue
        try:
            original = url.split("?")[0].split("/revision/")[0] + "/revision/latest?format=original"
            data = fetch(original)
            if data.startswith(b"\x89PNG"):
                target.write_bytes(data)
                count += 1
        except Exception:
            pass
    return count


def main():
    ICON_DIR.mkdir(parents=True, exist_ok=True)
    FRAME_DIR.mkdir(parents=True, exist_ok=True)
    source = json.loads(fetch(SOURCE))
    by_name = defaultdict(list)
    for item in source:
        by_name[key(item.get("name", ""))].append(item)
    database = json.loads(MODS.read_text(encoding="utf-8"))
    chosen = {mod["id"]: choose(mod, by_name[key(mod["name"])]) for mod in database["records"]}
    names = {item["imageName"] for item in chosen.values() if item and item.get("imageName")}
    downloaded = set()
    with ThreadPoolExecutor(max_workers=12) as pool:
        for future in as_completed([pool.submit(download_icon, name) for name in names]):
            name, okay = future.result()
            if okay:
                downloaded.add(name)
    for mod in database["records"]:
        item = chosen[mod["id"]]
        if item:
            if item.get("rarity"):
                mod["rarity"] = item["rarity"]
            if item.get("imageName") in downloaded:
                mod["icon"] = "images/mods/icons/" + item["imageName"]
    MODS.write_text(json.dumps(database, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    html_path = ROOT / "index.html"
    html = html_path.read_text(encoding="utf-8")
    pattern = r'(<script type="application/json" id="data-mods">)(.*?)(</script>)'
    packed = json.dumps(database, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    html, count = re.subn(pattern, lambda m: m.group(1) + packed + m.group(3), html, count=1, flags=re.S)
    if count != 1:
        raise RuntimeError("Could not find embedded mods dataset")
    html_path.write_text(html, encoding="utf-8")
    frames = download_frames()
    print(f"Icons: {len(downloaded)}/{len(names)}; frame assets: {frames}.")


if __name__ == "__main__":
    main()
