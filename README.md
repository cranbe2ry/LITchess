# LITchess

A browser extension that makes chess.com feel like Lichess.

- **Lichess piece and board themes on chess.com.** Pick any Lichess piece set and board and see them on chess.com.
- **One-click Lichess analysis.** When a game ends, an **Analyze on Lichess** button appears. It opens the Lichess import page with the game already filled in and the computer-analysis box ticked, so you only press **Import**. Works for normal games, daily games and games against the computer.
- **Hide ads and promos.** Hides ad blocks, promo banners and "Upgrade" buttons, and lets you add your own CSS selectors for anything that is left.
- **A small popup with switches.** Turn the theme, the analysis button and the ad hiding on or off.

> **Unofficial project.** LITchess is not affiliated with or endorsed by Lichess or Chess.com.

## Browser support

| Browser | Supported | Notes |
| --- | --- | --- |
| Chrome, Edge, Brave, Opera, Vivaldi, Arc | Yes | Load the folder as an unpacked extension |
| Firefox 128 or newer | Yes | Temporary install, or a signed/unlisted build for permanent use |
| Safari on macOS | Yes | Needs Xcode (free) to wrap the extension in a small app |
| Safari on iPhone / iPad | Not tested | |

## Installation

First, download the project: click **Code → Download ZIP** on this page and unzip it, or run:

```
git clone https://github.com/cranbe2ry/LITchess.git
```

The folder that contains `manifest.json` is the extension folder. You will need it in every guide below.

### Chrome, Edge, Brave, Opera, Vivaldi, Arc

1. Open the extensions page:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Brave: `brave://extensions`
   - Opera: `opera://extensions`
   - Vivaldi: `vivaldi://extensions`
   - Arc: open the menu and choose **Extensions → Manage Extensions** (or type `chrome://extensions`)
2. Turn on **Developer mode** (top right in Chrome, Brave, Opera, Vivaldi; in the left sidebar in Edge).
3. Click **Load unpacked**.
4. Select the extension folder (the one with `manifest.json`).
5. Click the puzzle-piece icon in the toolbar and **pin** LITchess so the icon is always visible.
6. Open or reload chess.com.

Chrome may show a warning about the unknown manifest key `browser_specific_settings`. It is used only by Firefox and is harmless.

**Updating:** download the new version into the same folder (or `git pull`), then open the extensions page and click the reload icon on the LITchess card.

### Firefox (128 or newer)

**Temporary install (quickest, lasts until Firefox is closed):**

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…**.
3. Select the `manifest.json` file inside the extension folder.
4. Check the site permissions. Open `about:addons`, click **LITchess**, open the **Permissions** tab, and make sure access to `chess.com` and `lichess.org` is switched on. Firefox only grants these automatically on a normal install, so temporary add-ons sometimes need this step. Without it the extension does nothing.
5. Pin the icon: click the puzzle-piece (Extensions) button, click the gear next to LITchess and choose **Pin to Toolbar**.
6. Open or reload chess.com.

Temporary add-ons disappear when Firefox closes, so repeat steps 1 to 3 next time.

**Permanent install.** Regular Firefox only installs signed add-ons. You have three options:

- **Sign it on addons.mozilla.org (free).** Zip the extension folder so that `manifest.json` is at the top level of the zip, for example:

  ```
  cd LITchess
  zip -r ../litchess.zip . -x ".git/*"
  ```

  Then upload `litchess.zip` at <https://addons.mozilla.org/developers/> and choose **On your own** (unlisted). Download the signed `.xpi` and open it in Firefox. Before you do this, change `browser_specific_settings.gecko.id` in `manifest.json` to an ID of your own (for example `litchess@yourname.dev`). The ID must be unique.
- **Use Firefox Developer Edition, Nightly or ESR.** Open `about:config`, set `xpinstall.signatures.required` to `false`, then install the zip from `about:addons` (gear icon → **Install Add-on From File…**).
- **Publish it as a listed add-on** on addons.mozilla.org.

### Safari (macOS)

Safari cannot load an unpacked folder like Chrome does. The extension has to be wrapped in a small macOS app, which Apple's tool `safari-web-extension-converter` creates for you. You do not need to write any Swift code.

**What you need**

- A Mac with a recent Safari.
- **Xcode** (free). Install it from the Mac App Store, or download an older version from <https://developer.apple.com/download/all/> if the latest one needs a newer macOS than you have. Each version lists the macOS it requires. Xcode is large (many GB), so allow time for the download.
- An Apple ID (free) for signing the app locally.

**1. Prepare Xcode**

Open Xcode once, accept the license agreement and let it install any extra components. Then, in Terminal, point the command line tools at it:

```
sudo xcode-select -s /Applications/Xcode.app
```

If you get `invalid developer directory`, the path is wrong. Run `ls /Applications | grep -i xcode` to see what the app is called and use that name.

**2. Convert the extension**

```
xcrun safari-web-extension-converter /path/to/LITchess --app-name LITchess --macos-only
```

Replace `/path/to/LITchess` with the extension folder. You can drag the folder into the Terminal window to paste its path. Xcode opens with a new project.

**3. Build and run**

1. At the top of the Xcode window, make sure the scheme is **LITchess (macOS)** and the destination is **My Mac**.
2. If Xcode complains about signing, click the project in the left sidebar, open **Signing & Capabilities** for each target (the app and the extension) and choose your **Team**. A free "Personal Team" from your Apple ID is enough. You can add your Apple ID in **Xcode → Settings → Accounts**.
3. Press **Run** (the ▶ button, or ⌘R). A small LITchess app window opens. You can leave it open or close it.

**4. Allow unsigned extensions in Safari**

1. Safari → **Settings → Advanced**, then tick **Show features for web developers**. A **Develop** menu appears in the menu bar.
2. In the **Develop** menu choose **Allow Unsigned Extensions** and enter your Mac password. Look for a check mark next to it.

Safari forgets this setting every time it quits, so you have to turn it on again after each restart of Safari. Running the app from Xcode again can also be needed. To avoid this you need a paid Apple Developer account and a properly signed build.

**5. Enable the extension and give it permissions**

1. Safari → **Settings → Extensions**.
2. Tick the box next to **LITchess**.
3. On the right, click **Edit Websites…** (or **Always Allow on These Websites…**) and set **Allow** for these sites:
   - `chess.com`
   - `api.chess.com`
   - `lichess.org`

   Without this permission the extension is enabled but does nothing. If you do not see these sites in the list, open chess.com once, then check again.
4. Optional: right-click the Safari toolbar, choose **Customize Toolbar…** and drag the LITchess icon into it.
5. Open or reload chess.com.

**Updating**

After changing or updating files, run the converter again, or drag the changed files into the project's `Shared (Extension) → Resources` folder in Xcode (choose **Replace**, and tick **Copy items if needed** for new files), then press **Run** again. New files that are not added to the project are not included in the extension.

## Usage

Click the LITchess icon in the toolbar to open the popup.

| Control | What it does |
| --- | --- |
| **Set Lichess board** | Opens the settings page where you choose the piece set and board. Press **Save** there. |
| Switch next to the button | Turns the Lichess pieces and board on or off. |
| **Lichess analysis** switch | Shows or hides the **Analyze on Lichess** button after games. |
| **Hide ads & promos** switch | Turns ad and promo hiding on or off. |

Setting changes are applied when a chess.com page is loaded, so **reload chess.com** after changing anything.

### Analyze on Lichess

1. Finish a game on chess.com. When the **Game Review** button appears, a green **Analyze on Lichess** button shows up in the bottom right corner.
2. Click it. A new tab opens on `lichess.org/paste` and the game is filled in automatically.
3. Press **Import** on Lichess. If you are logged in to Lichess, the **Request a computer analysis** box is ticked for you. Computer analysis on Lichess needs a free Lichess account.

For regular games the extension finds the game through the public chess.com API, so it can take a moment for a just-finished game to appear. The extension retries a few times on its own. Games against the computer are not in that API, so their moves are read from the move list on the page instead.

### Hiding extra elements

If something on chess.com still annoys you, right-click it, choose **Inspect Element**, find its class or id, and add it on the settings page under **Hide extra elements**, one selector per line (for example `.some-banner` or `#some-id`). Press **Save** and reload chess.com. The built-in list comes from public scripts and standard ad markup and can go out of date when chess.com changes its pages.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Nothing happens on chess.com | Make sure the extension is allowed on `chess.com` (Safari: **Edit Websites…**; Firefox: `about:addons` → **Permissions**). Reload the page. |
| **Safari:** the extension is not in the list | Run the app from Xcode again and turn on **Develop → Allow Unsigned Extensions**. |
| **Safari:** it worked yesterday but not today | Safari reset **Allow Unsigned Extensions** when it restarted. Turn it on again. |
| **Safari:** "Unable to find … in the extension's resources" | A file is missing from the Xcode project. Add it to `Shared (Extension) → Resources` and run again. |
| **Firefox:** gone after restart | Temporary add-ons are removed when Firefox closes. See the permanent install options above. |
| The **Analyze on Lichess** button does not appear | It only shows once the game is over and the **Game Review** button is visible. Reload the page after the game and check that the **Lichess analysis** switch is on. If chess.com is not in English, the button may not be detected. |
| "Could not find this game in the chess.com archive" | The game is not archived yet. Wait a minute and try again. |
| The game is not filled in on Lichess | Check that the extension is allowed on `lichess.org`. The data is kept for about two minutes after you click the button. |
| Theme not applied | Choose pieces or board other than **None**, press **Save**, check the first switch in the popup, and reload chess.com. |

## Privacy

LITchess does not collect or send any data to the author. Your settings are stored with the browser's extension storage (and may be synced by your browser account). When you click **Analyze on Lichess**, the game's moves go to Lichess only because you open the Lichess import page with them. Piece and board images are loaded from the public `lichess-org/lila` repository on GitHub. The extension also calls the public chess.com API to find your game.

## Project structure

```
manifest.json      Extension manifest (Manifest V3, same file for Chrome, Firefox and Safari)
script.js          Applies the chosen piece and board themes on chess.com
hide.js            Hides ads, promos and Upgrade buttons on chess.com
lichess-export.js  Adds the "Analyze on Lichess" button and prepares the game
lichess-paste.js   Fills in the game on lichess.org/paste
popup.html / .js   The popup with the switches
options.html / .js The settings page (themes and extra selectors)
icon-*.png         Extension icons (icon.svg is the editable source)
```

## Limitations

- Changes apply on the next page load of chess.com.
- Hiding ads and reading the move list of computer games depend on how chess.com builds its pages. If chess.com changes them, parts of the extension may stop working until updated.
- On Safari you must re-enable **Allow Unsigned Extensions** after every restart, unless you sign the app with a paid Apple Developer account.

## Credits

LITchess is made by [cranbe2ry](https://github.com/cranbe2ry). Piece sets and boards come from [Lichess](https://github.com/lichess-org/lila) and keep their own licenses. Lichess and Chess.com are trademarks of their respective owners.

## License

[MIT](LICENSE) © 2026 cranbe2ry
