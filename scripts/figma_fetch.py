#!/usr/bin/env python3
"""Fetch and cache the Trockly Figma design for implementation work."""
import json
import os
import re
import sys
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
ENV_FILE = ROOT / ".env"
OUT_DIR = ROOT / "figma"
ASSET_DIR = OUT_DIR / "assets"
FILE_KEY = "DiQ4KM0ezwr7waapl1IMC5"
API = "https://api.figma.com/v1"


def load_dotenv(path):
    if not path.exists():
        return
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key, value = key.strip(), value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
            value = value[1:-1]
        os.environ.setdefault(key, value)


def request(path, params=None):
    token = os.environ.get("FIGMA_ACCESS_TOKEN")
    if not token:
        raise SystemExit("FIGMA_ACCESS_TOKEN is not set in /home/dyung/Projects/trockly/.env")
    url = f"{API}{path}"
    if params:
        url += "?" + urlencode(params)
    req = Request(url, headers={"X-Figma-Token": token})
    try:
        with urlopen(req, timeout=120) as response:
            return json.load(response)
    except Exception as exc:
        raise SystemExit(f"Figma API request failed for {path}: {exc}")


def safe_name(name):
    return (re.sub(r"[^A-Za-z0-9._-]+", "_", name).strip("._") or "unnamed")[:120]


def collect_renderables(document):
    """Return top-level frames/components/groups that are useful UI references."""
    result = []
    for page in document.get("children", []):
        if page.get("type") != "CANVAS":
            continue
        for node in page.get("children", []):
            if node.get("type") in {"FRAME", "COMPONENT", "INSTANCE", "SECTION", "GROUP"}:
                result.append({
                    "page_id": page.get("id"),
                    "page_name": page.get("name"),
                    "node_id": node.get("id"),
                    "name": node.get("name"),
                    "type": node.get("type"),
                    "width": node.get("absoluteBoundingBox", {}).get("width"),
                    "height": node.get("absoluteBoundingBox", {}).get("height"),
                })
    return result


def main():
    load_dotenv(ENV_FILE)
    OUT_DIR.mkdir(exist_ok=True)
    ASSET_DIR.mkdir(exist_ok=True)

    # 1. Full design tree: source of truth for structure, typography, layout, etc.
    data = request(f"/files/{FILE_KEY}")
    raw_path = OUT_DIR / "Trockly.json"
    raw_path.write_text(json.dumps(data, indent=2, ensure_ascii=False))

    document = data.get("document", {})
    renderables = collect_renderables(document)
    summary = {
        "file_key": FILE_KEY,
        "name": data.get("name"),
        "version": data.get("version"),
        "last_modified": data.get("lastModified"),
        "editor_type": data.get("editorType"),
        "link_access": data.get("linkAccess"),
        "pages": [
            {"id": p.get("id"), "name": p.get("name"), "child_count": len(p.get("children", []))}
            for p in document.get("children", [])
        ],
        "top_level_renderables": renderables,
    }
    (OUT_DIR / "summary.json").write_text(json.dumps(summary, indent=2, ensure_ascii=False))

    # 2. Ask Figma to render the actual top-level UI frames.
    node_ids = [item["node_id"] for item in renderables if item.get("node_id")]
    if node_ids:
        images = request(
            f"/images/{FILE_KEY}",
            {"ids": ",".join(node_ids), "format": "png", "scale": "1"},
        )
        (OUT_DIR / "images.json").write_text(json.dumps(images, indent=2, ensure_ascii=False))

        # 3. Download those rendered images locally so implementation work does not
        # depend on Figma's expiring image URLs.
        downloaded = []
        for item in renderables:
            node_id = item.get("node_id")
            url = images.get("images", {}).get(node_id)
            if not url:
                continue
            filename = f"{safe_name(item.get('page_name', 'Page'))}__{safe_name(item.get('name', node_id))}__{node_id.replace(':', '-')}.png"
            path = ASSET_DIR / filename
            try:
                with urlopen(Request(url), timeout=120) as response:
                    path.write_bytes(response.read())
                downloaded.append({"node_id": node_id, "path": str(path.relative_to(ROOT)), "name": item.get("name")})
            except Exception as exc:
                print(f"Warning: could not download {node_id}: {exc}", file=sys.stderr)
        (OUT_DIR / "rendered-assets.json").write_text(json.dumps(downloaded, indent=2, ensure_ascii=False))

    print(f"Fetched: {data.get('name')}")
    print(f"Pages: {len(summary['pages'])}")
    print(f"Top-level renderables: {len(renderables)}")
    print(f"Design tree: {raw_path}")
    print(f"Summary: {OUT_DIR / 'summary.json'}")
    print(f"Rendered assets: {ASSET_DIR}")


if __name__ == "__main__":
    main()
