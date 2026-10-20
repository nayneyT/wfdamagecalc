"""Add sourced accuracy, noise, and punch-through to bundled weapon data."""

import json
import re
from pathlib import Path

from embedded_data import replace_embedded_category
from wiki_api import wiki_json


ROOT = Path(__file__).resolve().parents[1]
WEAPONS_FILE = ROOT / "data" / "weapons.json"
HTML_FILE = ROOT / "index.html"
MODULES = (
    "primary",
    "secondary",
    "melee",
    "archwing",
    "companion",
    "railjack",
    "modular",
    "misc",
)
WEAPON_START = re.compile(r'^\t(?:\["([^"]+)"\]|([A-Za-z_][\w]*))\s*=\s*\{\s*$')
NUMBER = r"(-?\d+(?:\.\d+)?)"
ACCURACY = re.compile(r"^\t\tAccuracy\s*=\s*" + NUMBER + r"\s*,?")
PUNCH_THROUGH = re.compile(r"^\t\t\t\tPunchThrough\s*=\s*" + NUMBER + r"\s*,?")
ATTACK_NAME = re.compile(r'^\t\t\t\tAttackName\s*=\s*"([^"]+)"\s*,?')
IS_SILENT = re.compile(r"^\t\t\t\tIsSilent\s*=\s*(true|false)\s*,?")


def source_number(text: str) -> int | float:
    value = float(text)
    return int(value) if value.is_integer() else value


def wiki_module(name: str) -> str:
    title = f"Module:Weapons/data/{name}"
    response = wiki_json(
        {
            "action": "query",
            "format": "json",
            "formatversion": "2",
            "prop": "revisions",
            "rvprop": "content",
            "rvslots": "main",
            "titles": title,
        }
    )
    pages = response.get("query", {}).get("pages", [])
    if isinstance(pages, dict):
        pages = list(pages.values())
    if not pages or pages[0].get("missing"):
        raise ValueError(f"Wiki module is missing: {title}")
    revision = pages[0]["revisions"][0]
    content = revision.get("slots", {}).get("main", {}).get("content") or revision.get("*")
    if not isinstance(content, str):
        raise ValueError(f"Wiki module has no source text: {title}")
    return content


def utility_records(source: str) -> dict[str, dict]:
    """Read only the fields needed here from the Wiki's formatted Lua tables."""
    weapons = {}
    weapon = None
    attack = None
    in_attacks = False
    for line in source.splitlines():
        start = WEAPON_START.match(line)
        if start:
            weapon = {"accuracy": None, "attacks": []}
            weapons[start.group(1) or start.group(2)] = weapon
            in_attacks = False
            attack = None
            continue
        if weapon is None:
            continue
        if line.startswith("\t\tAttacks = {"):
            in_attacks = True
            continue
        if not in_attacks:
            accuracy = ACCURACY.match(line)
            if accuracy:
                weapon["accuracy"] = source_number(accuracy.group(1))
            continue
        if line.strip() == "{" and line.startswith("\t\t\t{"):
            attack = {"name": None, "isSilent": False, "punchThrough": 0}
            continue
        if line.startswith("\t\t\t},") and attack is not None:
            weapon["attacks"].append(attack)
            attack = None
            continue
        if line.startswith("\t\t},"):
            in_attacks = False
            continue
        if attack is None:
            continue
        name = ATTACK_NAME.match(line)
        silent = IS_SILENT.match(line)
        punch = PUNCH_THROUGH.match(line)
        if name:
            attack["name"] = name.group(1)
        elif silent:
            attack["isSilent"] = silent.group(1) == "true"
        elif punch:
            attack["punchThrough"] = source_number(punch.group(1))
    return weapons


def main() -> None:
    source_weapons = {}
    for module in MODULES:
        parsed = utility_records(wiki_module(module))
        source_weapons.update(parsed)
        print(f"{module}: {len(parsed)} source weapons")

    database = json.loads(WEAPONS_FILE.read_text(encoding="utf-8"))
    matched_weapons = 0
    matched_attacks = 0
    for weapon in database["records"]:
        source = source_weapons.get(weapon["name"])
        if source is None:
            continue
        matched_weapons += 1
        if source["accuracy"] is not None:
            weapon["accuracy"] = source["accuracy"]
        source_attacks = source["attacks"]
        for index, attack in enumerate(weapon["attacks"]):
            attack.pop("isSilent", None)
            attack.pop("punchThrough", None)
            at_index = source_attacks[index] if index < len(source_attacks) else None
            matching = (
                at_index if at_index and at_index["name"] in (None, attack["name"]) else None
            )
            if matching is None:
                matching = next(
                    (item for item in source_attacks if item["name"] == attack["name"]),
                    None,
                )
            if matching is None:
                continue
            attack["isSilent"] = matching["isSilent"]
            attack["punchThrough"] = matching["punchThrough"]
            matched_attacks += 1

    if matched_weapons < 700 or matched_attacks < 900:
        raise ValueError(
            f"Source matching was unexpectedly low: {matched_weapons} weapons, "
            f"{matched_attacks} attacks. No files were changed."
        )
    html = replace_embedded_category(
        HTML_FILE.read_text(encoding="utf-8"), "weapons", database
    )
    WEAPONS_FILE.write_text(
        json.dumps(database, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    HTML_FILE.write_text(html, encoding="utf-8")
    print(f"Updated {matched_weapons} weapons and {matched_attacks} attacks")


if __name__ == "__main__":
    main()
