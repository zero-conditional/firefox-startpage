# Firefox Startpage

A customizable new tab page for Firefox with quick links, world clocks, and productivity tools.

## Features

- 🎨 Multiple background options (gradients, solid colors, image URLs, local files)
- ⏰ Live clock with world time zones (London, LA, Tokyo, Sydney)
- 🔗 Customizable quick links with drag & drop reordering
- 📁 Link groups/categories
- 🔍 Search bar
- 📝 Notes widget
- 🍅 Pomodoro timer
- 💾 All settings saved locally via browser.storage

## Installation

There is no signed `.xpi` in this repository yet. Load the add-on temporarily while you develop:

1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on...**
3. Select `extension/manifest.json`

To distribute to others (or install without “temporary”), zip the `extension/` folder and submit it for signing on [addons.mozilla.org](https://addons.mozilla.org/developers/) (see **Building for Distribution** below).

## Usage

- Click ⚙️ to open settings
- Hover over links section to see Add Link/Add Group buttons
- Drag links to reorder them
- Hover over links/groups to edit or delete

## File Structure

```
extension/
├── manifest.json    # Extension manifest
├── newtab.html      # Main HTML
├── script.js        # All functionality
└── style.css        # Styling
```

## Customization

Edit files in the `extension/` folder:
- `style.css` - Colors, fonts, layout
- `script.js` - Default links, time zones, behavior

## Building for Distribution

1. Zip the contents of `extension/` folder
2. Submit to [addons.mozilla.org](https://addons.mozilla.org/developers/) for signing
3. Choose "On your own" for self-distribution
