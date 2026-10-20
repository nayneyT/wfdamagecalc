"""Read public MediaWiki API data, with the existing read-only proxy fallback."""

import json
import urllib.parse
import urllib.request


WIKI_API = "https://wiki.warframe.com/api.php"


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
        gateway = urllib.request.Request("https://r.jina.ai/" + url.replace("&", "%26"))
        with urllib.request.urlopen(gateway, timeout=40) as response:
            result = response.read().decode("utf-8")
        marker = "Markdown Content:"
        if marker not in result:
            raise ValueError("No Wiki API response for " + parameters.get("titles", "source"))
        payload = result.split(marker, 1)[1].strip()
    return json.loads(payload)
