# ivanferrero.it — Sito Personale e Dashboard

> **Ultimo aggiornamento:** 2026-04-17

## Cosa contiene

Sito personale su GitHub Pages (CNAME `ivanferrero.it`). Design system dark cyber-professional con accenti cyan, tipografia Outfit/JetBrains Mono.

- `index.html`: hub di navigazione
- `dashboards/`: ~36 dashboard HTML interattive su cyberpsicologia, inclusione, neuroscienze, normativa scolastica, IA ed etica, digital wellbeing
- `assets/`: loghi, immagini, risorse grafiche
- `_posts/`, `_includes/`, `_sass/`: struttura Jekyll

## Convenzioni

- **Skill dedicate**: `ivanferrero-dashboard` (genera dashboard, source of truth design system), `ivanferrero-site-integration` (adatta contenuti per il sito)
- **Design system**: palette cyan su dark, definita in `ivanferrero-dashboard` — ogni nuova dashboard deve rispettarla
- **Deployment**: push su `main` → GitHub Pages automatico
- **Menu condiviso**: integrato via `_includes/` — ogni nuova pagina deve includerlo

## Workflow

1. Creare dashboard via skill `ivanferrero-dashboard`
2. Adattare per il sito via skill `ivanferrero-site-integration` (menu, CSS, indice)
3. Commit e push su GitHub

## Connessioni

- Reference/Research: ogni dashboard sintetizza evidenze da `reference/Research/`
- Intelligence Reports: i report settimanali possono generare nuove dashboard
- Tutti i domini: ogni competenza trasversale puo' diventare una dashboard pubblica
