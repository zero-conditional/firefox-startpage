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

### From Signed .xpi (Recommended)
1. Download the signed .xpi from releases
2. Drag into Firefox to install

### Manual Installation (Development)
1. Go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on..."
3. Select `extension/manifest.json`

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
