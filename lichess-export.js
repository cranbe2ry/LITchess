// "Analyze on Lichess" button on finished chess.com games.
// Click: find the PGN via the chess.com API, save it for lichess-paste.js, open lichess.org/paste.
(() => {
  const BTN_ID = 'lt-lichess-export';
  const PASTE_URL = 'https://lichess.org/paste';
  const GAME_RE = /\/game\/(?:(?:live|daily|computer)\/)?(\d+)/; // /game/123, /game/live/123, /game/daily/123, /game/computer/123
  const USERNAME_RE = /^[a-z0-9_-]{3,25}$/;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function getUsernames() {
    const fromPage = [
      ...document.querySelectorAll('.user-username-component, [data-test-element="user-tagline-username"]'),
    ].map((e) => e.textContent.trim().toLowerCase());
    const fromUrl = (new URLSearchParams(location.search).get('username') || '').toLowerCase();
    return [...new Set([fromUrl, ...fromPage])].filter((n) => USERNAME_RE.test(n));
  }

  // The "Game Review" button only exists once the game is over
  function gameIsOver() {
    return [...document.querySelectorAll('a, button')].some((el) =>
      /^game review$/i.test(el.textContent.trim())
    );
  }

  async function findPgnOnce(id) {
    for (const name of getUsernames()) {
      try {
        const r = await fetch(`https://api.chess.com/pub/player/${encodeURIComponent(name)}/games/archives`);
        if (!r.ok) continue;
        const { archives } = await r.json();
        // last 12 months, newest first
        for (const url of archives.slice(-12).reverse()) {
          const res = await fetch(url);
          if (!res.ok) continue;
          const { games } = await res.json();
          const game = games.find((g) => g.url && g.url.endsWith(`/${id}`));
          if (game && game.pgn) return game.pgn;
        }
      } catch (e) {
        /* try the next player */
      }
    }
    return null;
  }

  // the game can take a moment to show up in the archive
  async function findPgn(id) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const pgn = await findPgnOnce(id);
      if (pgn) return pgn;
      await sleep(4000);
    }
    return null;
  }

  // Games against the computer are not in the chess.com archive, so the moves are read
  // from the move list on the page instead.
  const SAN_RE = /^(O-O(-O)?|[KQRBN]?[a-h]?[1-8]?x?[a-h][1-8](=[QRBN])?)[+#]?$/;

  function pgnFromMoveList() {
    let moves = [...document.querySelectorAll('.node-highlight-content')]
      .map((node) => {
        let san = '';
        node.childNodes.forEach((n) => {
          if (n.nodeType === Node.TEXT_NODE) san += n.textContent;
          else if (n.nodeType === Node.ELEMENT_NODE) {
            // piece letters are drawn as icons with the letter in data-figurine
            const inner = n.hasAttribute('data-figurine') ? n : n.querySelector('[data-figurine]');
            san += inner ? inner.getAttribute('data-figurine') : n.textContent;
          }
        });
        return san.replace(/\s+/g, '');
      })
      .filter(Boolean);

    // some layouts contain the move list twice
    const half = moves.length / 2;
    if (Number.isInteger(half) && moves.slice(0, half).join(' ') === moves.slice(half).join(' ')) {
      moves = moves.slice(0, half);
    }
    if (!moves.length || !moves.every((m) => SAN_RE.test(m))) return null;

    const text = moves.map((m, i) => (i % 2 === 0 ? `${i / 2 + 1}. ${m}` : m)).join(' ');
    return `[Event "Chess.com computer game"]\n\n${text} *`;
  }

  function savePgn(pgn) {
    return new Promise((resolve, reject) =>
      chrome.storage.local.set({ ltPendingPgn: pgn, ltPendingTs: Date.now() }, () =>
        chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve()
      )
    );
  }

  async function onClick(btn) {
    const id = (location.pathname.match(GAME_RE) || [])[1];
    if (!id) return;

    // the window must be opened right on click, otherwise Safari blocks the popup
    const win = window.open('', 'lt_lichess');
    const label = btn.textContent;
    btn.textContent = 'Searching…';
    btn.disabled = true;
    const vsComputer = location.pathname.includes('/game/computer/');
    const pgn = vsComputer ? pgnFromMoveList() : await findPgn(id);
    btn.textContent = label;
    btn.disabled = false;

    if (!pgn) {
      if (win) win.close();
      alert(
        vsComputer
          ? 'Could not read the moves from this page.'
          : 'Could not find this game in the chess.com archive. It may still be in progress or not archived yet (try again in a minute).'
      );
      return;
    }
    try {
      await savePgn(pgn);
    } catch (e) {
      if (win) win.close();
      alert('Could not save the game: ' + e.message);
      return;
    }
    if (win && !win.closed) win.location.href = PASTE_URL;
    else window.open(PASTE_URL, '_blank');
  }

  function ensureButton() {
    const show = GAME_RE.test(location.pathname) && gameIsOver();
    const existing = document.getElementById(BTN_ID);
    if (!show) {
      if (existing) existing.remove();
      return;
    }
    if (existing) return;
    const btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.textContent = 'Analyze on Lichess';
    Object.assign(btn.style, {
      position: 'fixed',
      right: '20px',
      bottom: '20px',
      zIndex: '99999',
      padding: '10px 16px',
      background: '#629924',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      font: '600 14px sans-serif',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,.4)',
    });
    btn.addEventListener('click', () => onClick(btn));
    document.body.appendChild(btn);
  }

  chrome.storage.sync.get({ analysisEnabled: true }, ({ analysisEnabled }) => {
    if (analysisEnabled === false) return;
    // chess.com is a SPA (the URL changes without a reload), so check on a timer
    setInterval(ensureButton, 1000);
    ensureButton();
  });
})();
