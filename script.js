// Applies the chosen Lichess piece and board themes on chess.com.
(() => {
  const BASE = 'https://raw.githubusercontent.com/lichess-org/lila/master/public';
  const PNG_BOARDS = ['blue', 'brown', 'green', 'ic', 'purple', 'pink-pyramid', 'purple-diag', 'newspaper', 'green-plastic', 'ncf-board'];
  const PIECES = { wp: 'wP', wn: 'wN', wb: 'wB', wr: 'wR', wq: 'wQ', wk: 'wK', bp: 'bP', bn: 'bN', bb: 'bB', br: 'bR', bq: 'bQ', bk: 'bK' };

  chrome.storage.sync.get(
    { pieceTheme: 'none', boardTheme: 'none', themeEnabled: true },
    ({ pieceTheme, boardTheme, themeEnabled }) => {
      if (themeEnabled === false) return;

      let css = '';
      if (pieceTheme !== 'none') {
        for (const [cls, file] of Object.entries(PIECES)) {
          css += `.piece.${cls}, .promotion-piece.${cls} { background-image: url("${BASE}/piece/${pieceTheme}/${file}.svg") !important; }\n`;
        }
      }
      if (boardTheme !== 'none') {
        const ext = PNG_BOARDS.includes(boardTheme) ? 'png' : 'jpg';
        css += `.board, .fade-in-overlay { background-image: url("${BASE}/images/board/${boardTheme}.${ext}") !important; }\n`;
      }
      if (!css) return;

      const style = document.createElement('style');
      style.textContent = css;
      document.head.append(style);
    }
  );
})();
