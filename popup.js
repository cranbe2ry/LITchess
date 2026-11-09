const themeToggle = document.getElementById('themeToggle');
const analysisToggle = document.getElementById('analysisToggle');
const hideToggle = document.getElementById('hideToggle');

chrome.storage.sync.get({ themeEnabled: true, analysisEnabled: true, hideEnabled: true }, (items) => {
  themeToggle.checked = items.themeEnabled !== false;
  analysisToggle.checked = items.analysisEnabled !== false;
  hideToggle.checked = items.hideEnabled !== false;
});

themeToggle.addEventListener('change', () => chrome.storage.sync.set({ themeEnabled: themeToggle.checked }));
analysisToggle.addEventListener('change', () => chrome.storage.sync.set({ analysisEnabled: analysisToggle.checked }));
hideToggle.addEventListener('change', () => chrome.storage.sync.set({ hideEnabled: hideToggle.checked }));

document.getElementById('setBoard').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
  window.close();
});
