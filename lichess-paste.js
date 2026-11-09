// Runs on https://lichess.org/paste: fills in the PGN saved by lichess-export.js
// and ticks "Request a computer analysis". You only need to press Import.
(() => {
  const MAX_AGE_MS = 2 * 60 * 1000;

  function banner(text, ok) {
    const b = document.createElement('div');
    b.textContent = text;
    Object.assign(b.style, {
      position: 'fixed',
      right: '20px',
      bottom: '20px',
      zIndex: '99999',
      maxWidth: '300px',
      padding: '10px 14px',
      background: '#262421',
      color: '#fff',
      border: '1px solid ' + (ok ? '#629924' : '#c33'),
      borderRadius: '8px',
      font: '14px sans-serif',
      boxShadow: '0 2px 8px rgba(0,0,0,.4)',
    });
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 10000);
  }

  function fill(pgn) {
    const ta = document.querySelector('textarea[name="pgn"]') || document.querySelector('textarea');
    if (!ta) return null;
    const setValue = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
    setValue.call(ta, pgn);
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    ta.dispatchEvent(new Event('change', { bubbles: true }));
    const cb = document.querySelector('input[type="checkbox"][name="analyse"]');
    if (cb && !cb.checked) cb.click();
    return { analyse: !!cb };
  }

  chrome.storage.local.get(['ltPendingPgn', 'ltPendingTs'], (items) => {
    if (chrome.runtime.lastError) return;
    items = items || {};
    const pgn = items.ltPendingPgn;
    if (!pgn || Date.now() - (items.ltPendingTs || 0) > MAX_AGE_MS) {
      return;
    }

    let tries = 0;
    const timer = setInterval(() => {
      const res = fill(pgn);
      if (res || ++tries > 20) {
        clearInterval(timer);
        if (!res) return;
        chrome.storage.local.remove(['ltPendingPgn', 'ltPendingTs']);
        if (res.analyse) banner('LITchess: game filled in and computer analysis ticked. Press Import.', true);
        else banner('LITchess: game filled in. Log in to Lichess to request the computer analysis, then press Import.', false);
      }
    }, 300);
  });
})();
