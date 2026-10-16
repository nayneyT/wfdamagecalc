"""Keep a category's embedded starter data in sync with its JSON file."""

import json


def replace_embedded_category(html: str, category: str, database: dict) -> str:
    opening = f'<script type="application/json" id="data-{category}">'
    start = html.find(opening)
    if start < 0 or html.find(opening, start + len(opening)) >= 0:
        raise ValueError(f"Expected exactly one embedded {category} dataset")

    payload_start = start + len(opening)
    payload_end = html.find("</script>", payload_start)
    if payload_end < 0:
        raise ValueError(f"Embedded {category} dataset has no closing script tag")

    packed = json.dumps(database, ensure_ascii=False, separators=(",", ":"))
    packed = packed.replace("</", "<\\/")
    return html[:payload_start] + packed + html[payload_end:]
