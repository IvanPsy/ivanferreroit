#!/usr/bin/env python3
"""Due controlli del sito, da lanciare prima di ogni consegna.

1) GUSCI E FOOTER (dal 06/11/2026). La cornice del sito ha una fonte sola:
   _layouts/sito.html (e il sotto-guscio _layouts/lezione.html) per le pagine del sito,
   _includes/footer-nav.html per il footer, assets/menu.js per il menu.
   Errore se: una pagina contiene una copia incollata del footer; una pagina pubblica
   non ha né un layout né la riga {% include footer-nav.html %}; una pagina fuori da
   dashboards/ scrive da sé <!DOCTYPE html> invece di usare «layout: sito».
   Le pagine volutamente libere (app con un design tutto loro) stanno in PAGINE_LIBERE
   qui sotto, ognuna con il suo perché: una pagina nuova si aggiunge lì solo per scelta.

2) PORTE DELLE DASHBOARD. Ogni pagina in dashboards/ deve avere UNA sola porta.

Ogni dashboards/*.html e dashboards/*/index.html (escluso dashboards/index.html)
deve comparire in esattamente uno fra _data/digitale_inclusivo.yml,
_data/approfondimenti.yml, _data/fuori_hub.yml; oppure essere linkata da
lezioni-accessibili/index.html (caso dopo-il-diploma).
Uso: python3 _bozze/controlla_hub.py (stampa ✅ per ciascuno dei due controlli)
"""
import re
import sys
from pathlib import Path

RADICE = Path(__file__).resolve().parent.parent
FILE_DATI = ["_data/digitale_inclusivo.yml", "_data/approfondimenti.yml", "_data/fuori_hub.yml"]
FILE_LINK = "lezioni-accessibili/index.html"

# Pagine fuori guscio per scelta, con il perché (percorso dalla radice del repo).
PAGINE_LIBERE = {
    "googled29362825b2f1d97.html": "file di verifica di Search Console, non si tocca",
    "digitale-inclusivo/decodificatore-icf/index.html": "strumento interattivo (codici ICF) con struttura da dashboard e footer comune",
    "dashboards/verifica-fotografia.html": "verifica per la classe, senza menu del sito",
    "dashboards/dopo-il-diploma/index.html": "tema chiaro con footer proprio (stile.css)",
    "dashboards/dopo-il-diploma/docenti.html": "tema chiaro con footer proprio (stile.css)",
    "dashboards/scuola-lavoro-da-casa/index.html": "tema chiaro con footer proprio (stile.css di HITECH26)",
}
# Cartelle di app con design proprio: lezioni a tappe, verifiche e lezioni con menu ridotto.
CARTELLE_LIBERE = ("lezioni-accessibili/",)
RE_LAYOUT = re.compile(r"^---\n(?:.*\n)*?layout:\s*(\S+)", re.M)


def controlla_gusci():
    errori = []
    for p in sorted(RADICE.rglob("*.html")):
        rel = p.relative_to(RADICE).as_posix()
        if rel.startswith(("_", ".")) or "/_" in rel or rel.startswith("archivio/"):
            continue
        t = p.read_text(encoding="utf-8", errors="ignore")
        if 'class="site-footer-nav"' in t:
            errori.append((rel, "contiene una copia incollata del footer: va sostituita con {% include footer-nav.html %}"))
            continue
        if rel in PAGINE_LIBERE:
            continue
        m = RE_LAYOUT.match(t)
        layout = m.group(1).strip("\"'") if m else None
        ha_footer = "{% include footer-nav.html %}" in t
        libera = rel.startswith(CARTELLE_LIBERE) and not rel.endswith(("lezioni-accessibili/index.html", "metodo.html"))
        if layout in (None, "null") and not ha_footer and not libera:
            errori.append((rel, "senza guscio e senza footer comune (usa «layout: sito», o in una dashboard {% include footer-nav.html %})"))
        elif layout in (None, "null") and not rel.startswith("dashboards/") and not libera and re.search(r"<!DOCTYPE html>", t, re.I):
            errori.append((rel, "pagina del sito con la cornice scritta a mano: va portata in «layout: sito»"))
    if errori:
        print("Gusci e footer: %d da sistemare" % len(errori))
        for rel, perche in errori:
            print("  -", rel, "->", perche)
        return 1
    print("✅ Gusci e footer: nessuna copia della cornice, ogni pagina pubblica ha guscio o footer comune.")
    return 0


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
    esito_gusci = controlla_gusci()
    esito_porte = main()
    sys.exit(esito_gusci or esito_porte)
