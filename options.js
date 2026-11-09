const BASE = 'https://raw.githubusercontent.com/lichess-org/lila/master/public';
const PNG_BOARDS = ['blue', 'brown', 'green', 'ic', 'purple', 'pink-pyramid', 'purple-diag', 'newspaper', 'green-plastic', 'ncf-board'];
const START = ['rnbqkbnr', 'pppppppp', '........', '........', '........', '........', 'PPPPPPPP', 'RNBQKBNR'];

const pieceSel = document.getElementById('pieceTheme');
const boardSel = document.getElementById('boardTheme');
const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const noteEl = document.getElementById('note');

// Build the 8x8 preview. Pieces live inside grid cells, so they always line up with the squares.
const cells = [];
START.forEach((row) => {
  [...row].forEach((ch) => {
    const sq = document.createElement('div');
    sq.className = 'sq';
    if (ch !== '.') sq.dataset.piece = (ch === ch.toUpperCase() ? 'w' : 'b') + ch.toUpperCase();
    boardEl.appendChild(sq);
    cells.push(sq);
  });
});

function render() {
  const piece = pieceSel.value;
  const board = boardSel.value;

  const shown = piece === 'none' ? 'cburnett' : piece;
  cells.forEach((sq) => {
    if (!sq.dataset.piece) return;
    sq.style.backgroundImage = `url("${BASE}/piece/${shown}/${sq.dataset.piece}.svg")`;
    sq.style.opacity = piece === 'none' ? '0.4' : '1';
  });

  if (board === 'none') {
    boardEl.classList.add('plain');
    boardEl.style.backgroundImage = '';
  } else {
    boardEl.classList.remove('plain');
    const ext = PNG_BOARDS.includes(board) ? 'png' : 'jpg';
    boardEl.style.backgroundImage = `url("${BASE}/images/board/${board}.${ext}")`;
  }

  const keeps = [];
  if (piece === 'none') keeps.push('pieces');
  if (board === 'none') keeps.push('board');
  noteEl.textContent = keeps.length
    ? `"None" keeps chess.com's own ${keeps.join(' and ')}.`
    : '';
}

function save() {
  chrome.storage.sync.set({ pieceTheme: pieceSel.value, boardTheme: boardSel.value }, () => {
    statusEl.classList.add('show');
    setTimeout(() => statusEl.classList.remove('show'), 1800);
  });
}

chrome.storage.sync.get({ pieceTheme: 'none', boardTheme: 'none' }, (items) => {
  pieceSel.value = items.pieceTheme;
  boardSel.value = items.boardTheme;
  render();
});

pieceSel.addEventListener('change', render);
boardSel.addEventListener('change', render);
document.getElementById('save').addEventListener('click', save);

// extra selectors to hide on chess.com (used by hide.js)
const hideSelectorsEl = document.getElementById('hideSelectors');
const hideStatusEl = document.getElementById('hideStatus');

chrome.storage.sync.get({ hideSelectors: '' }, (items) => {
  hideSelectorsEl.value = items.hideSelectors;
});

document.getElementById('saveHide').addEventListener('click', () => {
  chrome.storage.sync.set({ hideSelectors: hideSelectorsEl.value }, () => {
    hideStatusEl.classList.add('show');
    setTimeout(() => hideStatusEl.classList.remove('show'), 1800);
  });
});
