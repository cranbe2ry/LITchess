// Hides ads, promo banners and "Upgrade" buttons on chess.com.
// Runs at document_start so the elements are hidden before they get painted.
(() => {
  // Class names/ids collected from public chess.com userscripts plus standard ad-slot markup.
  // chess.com changes its page over time: add your own selectors on the settings page.
  const DEFAULT_SELECTORS = [
    'a.diamond',
    '.adblock-message',
    '.upgrade-content',
    '.upgrade-to-remove-sidebar',
    '#special-upgrade-sidebar',
    '.short-sidebar-ad-top',
    '.short-sidebar-ad-bottom',
    '[class*="sidebar-ad"]',
    '[id^="div-gpt-ad"]',
    '[id^="google_ads_iframe"]',
    'ins.adsbygoogle',
  ];
  const UPSELL_TEXT = /^(upgrade|remove ads|go premium)$/i;

  chrome.storage.sync.get({ hideEnabled: true, hideSelectors: '' }, ({ hideEnabled, hideSelectors }) => {
    if (hideEnabled === false) return;

    const custom = hideSelectors.split('\n').map((s) => s.trim()).filter(Boolean);
    // one rule per selector, so a typo in one of them cannot break the others
    const css = [...DEFAULT_SELECTORS, ...custom]
      .map((sel) => `${sel} { display: none !important; }`)
      .join('\n');
    const style = document.createElement('style');
    style.textContent = css;
    (document.head || document.documentElement).append(style);

    // "Upgrade" / "Remove ads" buttons have no stable class name, so match them by their text
    if (location.pathname.startsWith('/membership')) return;
    setInterval(() => {
      document.querySelectorAll('a, button').forEach((el) => {
        if (UPSELL_TEXT.test(el.textContent.trim())) el.style.setProperty('display', 'none', 'important');
      });
    }, 1500);
  });
})();
