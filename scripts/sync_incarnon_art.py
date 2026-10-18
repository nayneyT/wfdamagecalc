"""Match Incarnon evolution artwork to the named choices in Wiki source tables.

This updates the JSON catalogue, embedded starter data, and artwork registry. It
does not download images; the existing image downloader handles local copies.
"""

import json
import re
import urllib.parse
import urllib.request
from collections import defaultdict
from pathlib import Path

from embedded_data import replace_embedded_category


ROOT = Path(__file__).resolve().parents[1]
CATALOGUE = ROOT / "data" / "incarnon-evolutions.json"
MANIFEST = ROOT / "images" / "manifest.json"
HTML = ROOT / "index.html"
WIKI_API = "https://wiki.warframe.com/api.php"
IMAGE_PATTERN = re.compile(r"\[\[File:([^]|]+\.(?:png|webp|jpg|jpeg))\|", re.I)
STAGE_PATTERN = re.compile(r"\bEVO([1-5])\b", re.I)
BROKEN_WIKI_FILENAMES = {
    # The Strun table still points to a removed file; this is its live replacement.
    "PunchThroughWithOvershields_.png": "PunchThroughWithOvershields(xWhite).png",
}


def wiki_json(parameters: dict[str, str]) -> dict:
    query = urllib.parse.urlencode(parameters)
    url = f"{WIKI_API}?{query}"
    request = urllib.request.Request(
        url, headers={"User-Agent": "VoidArsenal/1.0 (+https://github.com/nayneyT/wfdamagecalc)"}
    )
    try:
        with urllib.request.urlopen(request, timeout=25) as response:
            payload = response.read().decode("utf-8")
    except (OSError, TimeoutError):
        # The Wiki sometimes challenges non-browser requests. This read-only
        # gateway returns the same public MediaWiki API response as text.
        gateway = urllib.request.Request("https://r.jina.ai/" + url.replace("&", "%26"))
        with urllib.request.urlopen(gateway, timeout=40) as response:
            result = response.read().decode("utf-8")
        marker = "Markdown Content:"
        if marker not in result:
            raise ValueError("No Wiki API response for " + parameters["titles"])
        payload = result.split(marker, 1)[1].strip()
    return json.loads(payload)


def wiki_text(page: str) -> str:
    data = wiki_json(
        {
            "action": "query",
            "format": "json",
            "formatversion": "2",
            "prop": "revisions",
            "rvprop": "content",
            "rvslots": "main",
            "titles": page,
        }
    )
    pages = data.get("query", {}).get("pages", [])
    if isinstance(pages, dict):
        pages = list(pages.values())
    if not pages or pages[0].get("missing"):
        raise ValueError(f"Wiki page is missing: {page}")
    revision = pages[0]["revisions"][0]
    return revision.get("slots", {}).get("main", {}).get("content") or revision.get("*", "")


def image_metadata(filenames: set[str]) -> dict[str, dict]:
    resolved = {}
    missing = []
    ordered = sorted(filenames)
    for offset in range(0, len(ordered), 20):
        batch = ordered[offset:offset + 20]
        data = wiki_json(
            {
                "action": "query",
                "format": "json",
                "formatversion": "2",
                "redirects": "1",
                "prop": "imageinfo",
                "iiprop": "url|size",
                "titles": "|".join("File:" + name for name in batch),
            }
        )
        query = data.get("query", {})
        redirects = {item["from"]: item["to"] for item in query.get("redirects", [])}
        pages = {page["title"]: page for page in query.get("pages", [])}
        for filename in batch:
            title = redirects.get("File:" + filename, "File:" + filename)
            info = pages.get(title, {}).get("imageinfo", [])
            if not info:
                missing.append(filename)
                continue
            resolved[filename] = info[0]
    if missing:
        raise ValueError("Image sources are unavailable:\n" + "\n".join(missing))
    return resolved


def normalized_name(value: str) -> str:
    value = re.sub(r"<[^>]+>", " ", value)
    value = re.sub(r"\[\[([^]|]+)\|([^]]+)]]", r"\2", value)
    value = re.sub(r"\[\[([^]]+)]]", r"\1", value)
    return re.sub(r"[^a-z0-9]", "", value.casefold())


def named_images(source: str) -> dict[tuple[int, str], str]:
    result = {}
    tier = 0
    for line in source.splitlines():
        stage = STAGE_PATTERN.search(line)
        if stage:
            tier = int(stage.group(1))
        image = IMAGE_PATTERN.search(line)
        if not image or not tier:
            continue
        label = line[: image.start()].rsplit("|", 1)[-1].replace("'", "").strip()
        if label:
            result[(tier, normalized_name(label))] = image.group(1).replace(" ", "_")
    return result


def replace_embedded_image_sources(html: str, sources: dict[str, str]) -> str:
    opening = '<script type="application/json" id="image-sources">'
    start = html.index(opening) + len(opening)
    end = html.index("</script>", start)
    packed = json.dumps(sources, ensure_ascii=False, separators=(",", ":"))
    return html[:start] + packed.replace("</", "<\\/") + html[end:]


def main() -> None:
    catalogue = json.loads(CATALOGUE.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    html = HTML.read_text(encoding="utf-8")
    records = catalogue["records"]
    # This legacy record was assigned EVO2 even though the source table places
    # Survivor's Edge in EVO4. Keep its stable ID for existing saved builds.
    for record in records:
        if record["id"] == "vectis-2-survivor-s-edge":
            record["tier"] = 4
    pages = defaultdict(list)
    for record in records:
        pages[record["source"]["url"].rsplit("/", 1)[-1]].append(record)

    artwork = defaultdict(lambda: {"owners": set()})
    unmatched = []
    for page, choices in pages.items():
        images = named_images(wiki_text(page))
        for choice in choices:
            key = (choice["tier"], normalized_name(choice["name"]))
            filename = images.get(key)
            if not filename:
                unmatched.append(f"{page}: EVO{choice['tier']} {choice['name']}")
                continue
            filename = BROKEN_WIKI_FILENAMES.get(filename, filename)
            stem, extension = filename.rsplit(".", 1)
            safe_name = re.sub(r"[^a-z0-9]+", "-", stem.casefold()).strip("-")
            local = f"images/incarnon-evolutions/{safe_name}.{extension.lower()}"
            choice["image"] = local
            artwork[local]["owners"].add("incarnon-evolutions/" + choice["id"])
            artwork[local]["file"] = filename
        print(f"{page}: {len(choices)} choices", flush=True)

    if unmatched:
        raise ValueError("Unmatched Wiki evolution artwork:\n" + "\n".join(unmatched))
    image_info = image_metadata({metadata["file"] for metadata in artwork.values()})

    manifest["assets"] = [
        asset
        for asset in manifest["assets"]
        if not asset["local"].startswith("images/incarnon-evolutions/")
    ]
    for local, metadata in artwork.items():
        filename = metadata["file"]
        info = image_info[filename]
        manifest["assets"].append(
            {
                "file": filename,
                "local": local,
                "owners": sorted(metadata["owners"]),
                "url": info["url"],
                "sourcePage": info["descriptionurl"],
                "provider": "Warframe Wiki",
                "bytes": info["size"],
            }
        )
    manifest["assets"].sort(key=lambda asset: asset["local"])
    image_sources = json.loads(
        html.split('<script type="application/json" id="image-sources">', 1)[1].split(
            "</script>", 1
        )[0]
    )
    image_sources = {
        local: url
        for local, url in image_sources.items()
        if not local.startswith("images/incarnon-evolutions/")
    }
    image_sources.update(
        {
            asset["local"]: asset["url"]
            for asset in manifest["assets"]
            if asset["local"].startswith("images/incarnon-evolutions/")
        }
    )
    html = replace_embedded_category(html, "incarnon-evolutions", catalogue)
    html = replace_embedded_image_sources(html, image_sources)
    evolution_start = html.index('<div id="evolution-controls" class="spacer">')
    evolution_end = html.index('<div id="exalted-controls"', evolution_start)
    html = (
        html[:evolution_start]
        + '<div id="evolution-controls" class="spacer"></div>\n                '
        + html[evolution_end:]
    )

    CATALOGUE.write_text(
        json.dumps(catalogue, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    HTML.write_text(html, encoding="utf-8")
    print(f"Mapped {len(records)} choices to {len(artwork)} distinct images")


if __name__ == "__main__":
    main()
