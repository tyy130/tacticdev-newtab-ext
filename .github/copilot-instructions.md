# TacticDev New Tab Extension - AI Coding Instructions

## Project Overview
This is a **Chrome Extension (Manifest V3)** that replaces the browser's "New Tab" page with a developer-focused dashboard. It is built with **vanilla HTML, CSS, and JavaScript**—no build tools, frameworks, or bundlers are used.

## Architecture & Core Components
- **Entry Point**: `newtab.html` is the main interface loaded by the browser.
- **Styling**: `newtab.css` handles all visual presentation.
  - Uses **CSS Variables** (e.g., `--bg`, `--accent`) for theming.
  - Supports **Dark/Light modes** via `body[data-theme="light"]`.
- **Logic**: `newtab.js` contains all application logic.
  - Wrapped in an **IIFE** to avoid global scope pollution.
  - Handles DOM manipulation, event listeners, and state management.
- **Assets**: Images are stored in `icons/` and `assets/`.

## Data Management
- **Persistence**: The application uses the browser's standard `localStorage` API, NOT `chrome.storage` (despite the manifest permission).
- **Key Schema**: All storage keys are prefixed with `tacticdev-` to avoid collisions.
  - `tacticdev-theme`: 'light' or 'dark'.
  - `tacticdev-links`: JSON string of user-defined quick links.
  - `tacticdev-focus`: Current focus text.
  - `tacticdev-scratchpad`: Content of the scratchpad.

## Development Workflow
1.  **Edit**: Modify `newtab.html`, `newtab.css`, or `newtab.js` directly.
2.  **Test**:
    -   Open `chrome://extensions`.
    -   Enable "Developer mode".
    -   Click "Load unpacked" and select the project folder.
    -   Open a new tab to see changes.
    -   **Reload**: After making changes, click the refresh icon on the extension card in `chrome://extensions` and open a new tab.
3.  **Debug**: Use the standard browser DevTools (F12) on the New Tab page.

## Coding Conventions
- **JavaScript**:
  - Use **Vanilla JS** (ES6+). Do not introduce libraries like React or jQuery.
  - Prefer `document.getElementById` and `querySelector`.
  - Event delegation is preferred for dynamic lists (e.g., links, search suggestions).
- **CSS**:
  - Maintain the **CSS Variable** system for colors.
  - Ensure all new styles work in both Dark (default) and Light modes.
- **HTML**:
  - Keep semantic structure (`header`, `section`, `article`).
  - Use `aria-label` for accessibility.

## Common Tasks
- **Adding a Default Link**: Update the `defaultLinks` array in `newtab.js`.
- **Changing Theme Colors**: Edit the `:root` and `body[data-theme="light"]` blocks in `newtab.css`.
- **Manifest Updates**: Modify `manifest.json` for permissions or metadata (version bumps).
