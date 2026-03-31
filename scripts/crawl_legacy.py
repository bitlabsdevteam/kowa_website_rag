#!/usr/bin/env python3
import csv
import json
import os
import re
from collections import deque
from urllib.parse import urljoin, urlparse

from urllib.request import Request, urlopen

START_URL = "https://kowatrade.com/"
DOMAIN = "kowatrade.com"
MAX_PAGES = 50
TIMEOUT = 15


def extract_title(html: str) -> str:
    m = re.search(r"<title[^>]*>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
    return re.sub(r"\s+", " ", m.group(1)).strip() if m else ""


def extract_links(base_url: str, html: str):
    hrefs = re.findall(r'href=["\'](.*?)["\']', html, re.IGNORECASE)
    out = []
    for href in hrefs:
        if href.startswith("javascript:") or href.startswith("mailto:") or href.startswith("tel:"):
            continue
        u = urljoin(base_url, href)
        p = urlparse(u)
        if p.scheme in ("http", "https") and p.netloc.endswith(DOMAIN):
            cleaned = f"{p.scheme}://{p.netloc}{p.path}".rstrip("/") + ("/" if p.path in ("", "/") else "")
            out.append(cleaned)
    return sorted(set(out))


def detect_lang(text: str) -> str:
    return "ja" if re.search(r"[\u3040-\u30ff\u4e00-\u9faf]", text) else "en"


def normalize_profile(text: str):
    lines = [re.sub(r"\s+", " ", x).strip() for x in text.splitlines() if x.strip()]
    joined = "\n".join(lines)
    fields = {
        "company_name_en": None,
        "address_en": None,
        "tel": None,
        "fax": None,
        "capital": None,
        "established": None,
    }

    m = re.search(r"Kowa Trade And Commerce Co\.?\,?Ltd\.?", joined, re.IGNORECASE)
    if m:
        fields["company_name_en"] = m.group(0)

    m = re.search(r"Reoma Bldg\..*?JAPAN", joined, re.IGNORECASE)
    if m:
        fields["address_en"] = m.group(0)

    m = re.search(r"TEL\s*:?\s*\+?[0-9\-\s]+", joined, re.IGNORECASE)
    if m:
        fields["tel"] = m.group(0)

    m = re.search(r"FAX\s*:?\s*\+?[0-9\-\s]+", joined, re.IGNORECASE)
    if m:
        fields["fax"] = m.group(0)

    m = re.search(r"Capital\s*:?\s*[^\n]+", joined, re.IGNORECASE)
    if m:
        fields["capital"] = m.group(0)

    m = re.search(r"Established\s*:?\s*[^\n]+", joined, re.IGNORECASE)
    if m:
        fields["established"] = m.group(0)

    return fields


def main():
    os.makedirs('sprints/v1/artifacts', exist_ok=True)
    os.makedirs('data', exist_ok=True)

    visited = set()
    q = deque([START_URL])
    inventory = []
    page_texts = {}

    while q and len(visited) < MAX_PAGES:
        url = q.popleft()
        if url in visited:
            continue
        visited.add(url)

        try:
            req = Request(url, headers={"User-Agent": "Mozilla/5.0 (kowa-rag-migrator)"})
            with urlopen(req, timeout=TIMEOUT) as resp:
                status = resp.getcode()
                ctype = resp.headers.get("content-type", "")
                body = resp.read()
                html = body.decode("utf-8", errors="ignore") if "text/html" in ctype else ""
        except Exception:
            inventory.append([url, "", "unknown", "page", "error", "request failed"])
            continue

        title = extract_title(html)
        lang = detect_lang(html)
        notes = ""

        inventory.append([url, title, lang, "page", status, notes])
        page_texts[url] = re.sub(r"<[^>]+>", " ", html)

        if status == 200 and html:
            for link in extract_links(url, html):
                if link not in visited:
                    q.append(link)

    with open("sprints/v1/artifacts/content-inventory.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["url", "title", "lang", "content_type", "status_code", "notes"])
        w.writerows(inventory)

    homepage_text = page_texts.get(START_URL, "")
    normalized = {
        "source": START_URL,
        "normalized_profile": normalize_profile(homepage_text),
    }
    with open("sprints/v1/artifacts/content-normalized.json", "w", encoding="utf-8") as f:
        json.dump(normalized, f, ensure_ascii=False, indent=2)

    with open("sprints/v1/artifacts/migration-map.md", "w", encoding="utf-8") as f:
        f.write("# Migration Map (Legacy -> New IA)\n\n")
        f.write("| Legacy URL | New IA Target | Notes |\n")
        f.write("|---|---|---|\n")
        for row in inventory:
            legacy = row[0]
            f.write(f"| {legacy} | /legacy | Migrated legacy excerpt available |\n")

    migrated_pages = []
    for row in inventory:
        url = row[0]
        text = re.sub(r"\s+", " ", page_texts.get(url, "")).strip()
        migrated_pages.append(
            {
                "url": url,
                "title": row[1],
                "lang": row[2],
                "excerpt": text[:1200],
            }
        )

    with open("data/legacy-pages.json", "w", encoding="utf-8") as f:
        json.dump(migrated_pages, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
