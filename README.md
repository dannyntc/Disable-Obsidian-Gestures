# Disable Sidebar Swipes

An Obsidian community plugin for iPadOS that prevents the single-finger horizontal swipe from opening or closing the left and right sidebars.

The plugin leaves the following available:

- Sidebar toggle buttons
- Obsidian commands and keyboard shortcuts
- Canvas panning and card interactions
- Handwriting, Pencil, PDF, and note touch handling
- Two-finger gestures and vertical scrolling

The iPad pull-down Quick Action is not handled by this plugin. Configure it in Obsidian under **Settings → Interface → Configure mobile Quick Action**.

## Compatibility

The plugin activates only when Obsidian reports the iOS app and the device is identified as an iPad. It uses the workspace swipe event that Obsidian exposes internally and filters only `swipe` events with `direction: "x"` and `points: 1`.

It does not change CSS, cancel touch events, modify Obsidian prototypes, or write vault settings. If a future Obsidian version does not expose the expected dispatcher, the plugin leaves gestures enabled and displays a compatibility notice.

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
```

For local installation, copy `main.js` and `manifest.json` into:

```text
<vault>/.obsidian/plugins/disable-sidebar-swipes/
```

Enable **Disable Sidebar Swipes** in Obsidian’s community plugin settings, then reload the app if requested.
