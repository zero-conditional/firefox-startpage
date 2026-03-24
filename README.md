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

### From Mozilla Add-ons (recommended for most people)

This extension is published on **Mozilla’s site** (signed by Mozilla). Install it like any other add-on:

1. Open [addons.mozilla.org](https://addons.mozilla.org/) and find **Firefox Startpage**, **or** open your add-on’s **listing URL** from [Developer Hub](https://addons.mozilla.org/developers/) (your add-on → **View listing** / copy the public page link).
2. Click **Add to Firefox**.

This repository does **not** need to contain a `.xpi` file; Mozilla hosts the signed package.

### Temporary load (for development only)

Use this when you are editing the code locally and want to test changes without going through Mozilla each time:

1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on...**
3. Select `extension/manifest.json`

Temporary add-ons are only for testing; for a normal install, use **From Mozilla Add-ons** above.

### First-time publishing

To submit a new version or list an add-on for the first time, zip the `extension/` folder and use [addons.mozilla.org/developers](https://addons.mozilla.org/developers/) (see **Building for Distribution** below).

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

There is no separate web app or build step: you only need the `extension/` folder to run and change the add-on. **Node.js and npm are not required.**

## Customization

Edit files in the `extension/` folder:
- `style.css` - Colors, fonts, layout
- `script.js` - Default links, time zones, behavior

## Building for Distribution

1. Zip the contents of `extension/` folder
2. Submit to [addons.mozilla.org](https://addons.mozilla.org/developers/) for signing
3. Choose "On your own" for self-distribution
