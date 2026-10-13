"""Refresh bundled mod rank text from WFCD's game-data-derived Mods.json.

Development utility only. The calculator itself uses local JSON and vanilla JS.
"""

import difflib
import json
import re
import urllib.request
from collections import defaultdict
from datetime import date
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = "https://raw.githubusercontent.com/WFCD/warframe-items/master/data/json/Mods.json"


def key(name):
    return re.sub(r"[^a-z0-9]", "", name.lower().replace("flawed", "").replace("damaged", ""))


def comparable(text):
    text = re.sub(r"<[^>]+>", "", str(text).replace("\\n", " "))
    return " ".join(text.lower().split())


def rank_text(source, rank):
    stats = source["levelStats"][rank].get("stats", [])
    lines = []
    for line in stats:
        if line:
            clean = str(line).replace("\\r\\n", "\n").replace("\\n", "\n").replace("\r\n", "\n")
            lines.append(re.sub(r"<[^>]+>", "", clean).strip())
    note = source.get("description")
    if note and not any(comparable(note) in comparable(line) for line in lines):
        lines.append(str(note))
    return "\n".join(lines).strip()


def choose(record, candidates):
    ranked = [item for item in candidates if len(item.get("levelStats", [])) == record["maxRank"] + 1]
    if not ranked:
        return None
    scores = sorted(
        ((difflib.SequenceMatcher(None, comparable(record["description"]), comparable(rank_text(item, -1))).ratio(), item)
         for item in ranked),
        key=lambda pair: pair[0],
        reverse=True,
    )
    if scores[0][0] < 0.25:
        return None
    if len(scores) > 1 and scores[0][0] - scores[1][0] < 0.05:
        return None
    return scores[0][1]


def modeled_rank_text(record):
    match = re.match(r"^([+-])(\d+(?:\.\d+)?)%\s", record["description"])
    effects = record.get("effects", [])
    ranks = record.get("rankEffects", [])
    if not match or len(effects) != 1 or len(ranks) != record["maxRank"] + 1:
        return None
    stat = effects[0]["stat"]
    if not all(len(rank) == 1 and rank[0]["stat"] == stat for rank in ranks):
        return None
    if abs(abs(effects[0]["value"] * 100) - float(match.group(2))) > 0.1:
        return None
    return [
        re.sub(
            r"^[+-]\d+(?:\.\d+)?%",
            ("+" if rank[0]["value"] >= 0 else "-") + f"{abs(rank[0]['value'] * 100):.1f}".rstrip("0").rstrip(".") + "%",
            record["description"],
            count=1,
        )
        for rank in ranks
    ]


def main():
    with urllib.request.urlopen(SOURCE, timeout=30) as response:
        source = json.load(response)
    by_name = defaultdict(list)
    for item in source:
        by_name[key(item.get("name", ""))].append(item)

    path = ROOT / "data" / "mods.json"
    database = json.loads(path.read_text(encoding="utf-8"))
    stances = json.loads((ROOT / "data" / "stances.json").read_text(encoding="utf-8"))
    stance_ids = {item["modId"] for item in stances["records"] if item.get("modId")}
    sourced = invariant = modeled = fallback = 0
    for record in database["records"]:
        item = choose(record, by_name[key(record["name"])])
        if item:
            descriptions = [rank_text(item, rank) or None for rank in range(record["maxRank"] + 1)]
            descriptions[-1] = descriptions[-1] or record["description"]
            record["rankDescriptions"] = descriptions
            sourced += 1
        elif record["id"] in stance_ids:
            record["rankDescriptions"] = [record["description"]] * (record["maxRank"] + 1)
            invariant += 1
        elif descriptions := modeled_rank_text(record):
            record["rankDescriptions"] = descriptions
            modeled += 1
        else:
            record["rankDescriptions"] = [None] * record["maxRank"] + [record["description"]]
            fallback += 1

    if not any(entry.get("url") == SOURCE for entry in database["sources"]):
        database["sources"].append({"url": SOURCE, "snapshot": str(date.today())})
    path.write_text(json.dumps(database, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    html_path = ROOT / "index.html"
    html = html_path.read_text(encoding="utf-8")
    pattern = r'(<script type="application/json" id="data-mods">)(.*?)(</script>)'
    packed = json.dumps(database, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    html, count = re.subn(pattern, lambda match: match.group(1) + packed + match.group(3), html, count=1, flags=re.S)
    if count != 1:
        raise RuntimeError("Could not find embedded mods dataset")
    html_path.write_text(html, encoding="utf-8")
    print(f"Sourced {sourced} mods; {invariant} stance descriptions are rank-invariant; {modeled} use existing modeled effects; {fallback} retain labelled max-rank descriptions.")


if __name__ == "__main__":
    main()
