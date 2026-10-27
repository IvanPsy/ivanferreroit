#!/usr/bin/env python3
"""Controlla che ogni pagina in dashboards/ abbia UNA sola porta.

Ogni dashboards/*.html e dashboards/*/index.html (escluso dashboards/index.html)
deve comparire in esattamente uno fra _data/digitale_inclusivo.yml,
_data/approfondimenti.yml, _data/fuori_hub.yml; oppure essere linkata da
lezioni-accessibili/index.html (caso dopo-il-diploma).
Uso: python3 _bozze/controlla_hub.py
"""
import re
import sys
from pathlib import Path

RADICE = Path(__file__).resolve().parent.parent
FILE_DATI = ["_data/digitale_inclusivo.yml", "_data/approfondimenti.yml", "_data/fuori_hub.yml"]
FILE_LINK = "lezioni-accessibili/index.html"

RE_URL = re.compile(r"^\s*(?:-\s*)?url:\s*[\"']?([^\"'\s#]+)", re.M)


def urls_yaml(percorso):
    testo = (RADICE / percorso).read_text(encoding="utf-8")
    return [u for u in RE_URL.findall(testo)]


def pagine():
    d = RADICE / "dashboards"
    trovate = sorted(d.glob("*.html")) + sorted(d.glob("*/index.html"))
    return ["/" + p.relative_to(RADICE).as_posix() for p in trovate
            if p.relative_to(RADICE).as_posix() != "dashboards/index.html"]


def main():
    dove = {}
    for f in FILE_DATI:
        for u in urls_yaml(f):
            dove.setdefault(u, []).append(f)
    link = (RADICE / FILE_LINK).read_text(encoding="utf-8")

    orfane, doppie = [], []
    elenco = pagine()
    for url in elenco:
        file_trovati = list(dove.get(url, []))
        # per le cartelle accetta anche l'URL con slash finale (/dashboards/x/)
        if url.endswith("/index.html"):
            cartella = url[: -len("index.html")]
            file_trovati += dove.get(cartella, [])
            if cartella in link or url in link:
                file_trovati.append(FILE_LINK)
        n = len(file_trovati)
        if n == 0:
            orfane.append(url)
        elif n > 1:
            doppie.append((url, file_trovati))

    if not orfane and not doppie:
        print("✅ Tutto a posto: %d pagine, nessuna orfana, nessuna doppia." % len(elenco))
        return 0
    if orfane:
        print("Pagine orfane (in nessun file): %d" % len(orfane))
        for u in orfane:
            print("  -", u)
    if doppie:
        print("Pagine doppie (in più di un file): %d" % len(doppie))
        for u, fs in doppie:
            print("  -", u, "->", ", ".join(fs))
    return 1


if __name__ == "__main__":
    sys.exit(main())
