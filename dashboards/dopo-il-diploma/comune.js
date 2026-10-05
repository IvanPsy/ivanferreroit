/* «Dopo il diploma, nel digitale»: funzioni comuni alle due pagine.
   I dati arrivano solo da iniziative.json: qui ci sono etichette e utilità, nessuna scheda. */

const DD = (() => {
  // Etichette pubbliche esatte della tassonomia (PIANO-OPERATIVO, Esito F3)
  const PORTE = [
    { v: 'lavorare presto', label: 'Voglio lavorare presto', ico: '🚀' },
    { v: 'un titolo', label: 'Voglio un titolo', ico: '🎓' },
    { v: 'provare prima', label: 'Voglio provare prima di scegliere', ico: '🧭' },
    { v: 'ripartire', label: 'Voglio ripartire', ico: '🔄' }
  ];

  const FILTRI = [
    { key: 'filtro_costo', titolo: 'Quanto mi costa?', breve: 'Costo', ico: '💸', visibile: true, opzioni: [
      ['gratis', 'Gratis'], ['gratis e mi pagano', 'Gratis e mi pagano'],
      ["dipende dall'ISEE", "Dipende dall'ISEE"], ['pochi soldi', 'Pochi soldi'] ] },
    { key: 'filtro_lavoro', titolo: 'Posso lavorare intanto?', breve: 'Lavorare intanto', ico: '⏰', visibile: true, opzioni: [
      ['sì', 'Sì'], ['solo part-time', 'Solo part-time'], ['no tempo pieno', 'No, è a tempo pieno'] ] },
    { key: 'filtro_dove', titolo: 'Dove?', breve: 'Dove', ico: '📍', visibile: true, opzioni: [
      ['da casa', 'Da casa'], ['Milano e dintorni', 'Milano e dintorni'], ['devo spostarmi', 'Devo spostarmi'] ] },
    { key: 'filtro_resta', titolo: 'Cosa mi resta in mano?', breve: 'Ti resta', ico: '🎓', visibile: true, opzioni: [
      ['titolo riconosciuto dallo Stato', 'Un titolo riconosciuto dallo Stato'], ['attestato', 'Un attestato'],
      ['esperienza pagata', "Un'esperienza pagata"] ] },
    { key: 'filtro_durata', titolo: 'Quanto dura?', breve: 'Durata', ico: '⏳', visibile: false, opzioni: [
      ['pochi mesi', 'Pochi mesi'], ['un anno', 'Un anno'], ['due anni o più', 'Due anni o più'] ] },
    { key: 'filtro_ingresso', titolo: 'Come si entra?', breve: 'Ingresso', ico: '🚪', visibile: false, opzioni: [
      ['basta iscriversi', 'Basta iscriversi'], ['test e colloquio', 'Test e colloquio'], ['selezione tosta', 'Selezione tosta'] ] },
    { key: 'settori', titolo: 'Di cosa?', breve: 'Settori', ico: '🛠️', visibile: false, multiplo: true, opzioni: [
      ['programmare', 'Programmare'], ['reti e sicurezza', 'Reti e sicurezza'], ['dati e IA', 'Dati e IA'],
      ['grafica 3D e giochi', 'Grafica 3D e giochi'], ['macchine e automazione', 'Macchine e automazione'],
      ['digitale per le aziende', 'Digitale per le aziende'] ] }
  ];

  const ACCESS = {
    'supporto dichiarato': { ico: '♿', label: 'Supporto dichiarato', cls: 'access-supporto', rank: 0 },
    'tutele di legge': { ico: '⚖️', label: 'Tutele di legge', cls: 'access-tutele', rank: 1 },
    'non dichiarato': { ico: 'ℹ️', label: 'Non dichiarato', cls: 'access-non', rank: 2 }
  };

  const TIPO = {
    'palestra': { ico: '🏋️', label: 'Palestra: per provare' },
    'chiave trasversale': { ico: '🔑', label: 'Chiave: vale per tanti percorsi' }
  };

  const MESI = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function etichetta(key, v) {
    const f = FILTRI.find(x => x.key === key);
    const o = f && f.opzioni.find(x => x[0] === v);
    return o ? o[1] : v;
  }

  function data(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-').map(Number);
    return `${d} ${MESI[m - 1]} ${y}`;
  }

  function dominio(url) {
    try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return url; }
  }

  function linkFonte(url, testo) {
    return `<a href="${esc(url)}" rel="noopener" target="_blank">${esc(testo || dominio(url))}<span class="sr-only"> (si apre in una nuova scheda)</span>&nbsp;<span aria-hidden="true">↗</span></a>`;
  }

  // Stato come etichetta con data: tipo + testo
  function stato(s) {
    const t = s.stato_etichetta;
    if (!t) return { cls: 'badge-ignoto', ico: '🗓️', testo: 'Date non ancora uscite' };
    if (/^(aperto|sempre aperto|ora c'è)/i.test(t)) return { cls: 'badge-aperto', ico: '✅', testo: t };
    if (/riapre/i.test(t)) return { cls: 'badge-riapre', ico: '🔁', testo: t };
    return { cls: 'badge-ignoto', ico: '🗓️', testo: t };
  }

  // Per l'ordine «Prima chi apre presto»: numero di mesi da oggi alla prossima finestra
  function mesiAllaFinestra(s, oggi) {
    const t = (s.stato_etichetta || '') + ' ' + (s.prossima_finestra || '');
    if (/^(sempre aperto|aperto|ora c'è)/i.test(s.stato_etichetta || '')) {
      const m = t.toLowerCase().match(new RegExp('(' + MESI.join('|') + ')\\s+(\\d{4})'));
      if (m) return (Number(m[2]) - oggi.getFullYear()) * 12 + MESI.indexOf(m[1]) - oggi.getMonth() - 0.5;
      return -1;
    }
    const low = t.toLowerCase();
    let best = null;
    for (let i = 0; i < 12; i++) {
      const pos = low.indexOf(MESI[i]);
      if (pos >= 0 && (best === null || pos < best.pos)) best = { pos, mese: i };
    }
    if (!best) return 999;
    let diff = best.mese - oggi.getMonth();
    if (diff < 0) diff += 12;
    return diff;
  }

  async function caricaDati() {
    const percorsi = ['iniziative.json', '../02-dati/iniziative.json'];
    for (const p of percorsi) {
      try {
        const r = await fetch(p, { cache: 'no-cache' });
        if (r.ok) return await r.json();
      } catch (e) { /* prova il percorso successivo */ }
    }
    throw new Error('dati non raggiungibili');
  }

  function ultimoControllo(dati) {
    const date = dati.schede.map(s => s.ultimo_controllo).filter(Boolean).sort();
    return date[date.length - 1];
  }

  // Tema: chiaro di partenza, scuro a scelta, scelta ricordata se il browser lo permette
  function initTema() {
    const root = document.documentElement;
    const btn = document.getElementById('theme-toggle');
    let tema = 'light';
    try { tema = localStorage.getItem('dd-tema') === 'dark' ? 'dark' : 'light'; } catch (e) {}
    function applica(t) {
      root.setAttribute('data-theme', t);
      if (btn) {
        const scuro = t === 'dark';
        btn.setAttribute('aria-pressed', String(scuro));
        btn.innerHTML = '<span aria-hidden="true">🌙</span> Tema scuro' + (scuro ? '<span aria-hidden="true"> ✓</span>' : '');
      }
    }
    applica(tema);
    if (btn) btn.addEventListener('click', () => {
      tema = tema === 'dark' ? 'light' : 'dark';
      applica(tema);
      try { localStorage.setItem('dd-tema', tema); } catch (e) {}
    });
  }

  return { PORTE, FILTRI, ACCESS, TIPO, esc, etichetta, data, dominio, linkFonte, stato, mesiAllaFinestra, caricaDati, ultimoControllo, initTema };
})();
