# TacticDev New Tab Extension

A developer-focused browser dashboard for shipping tiny, real things. Features a customizable launchpad, focus timer, scratchpad, and cloud sync across devices.

## Installation

### Chrome / Edge / Brave (Unpacked Extension)
1.  Clone or download this repository to a folder on your computer.
2.  Open your browser and navigate to `chrome://extensions`.
3.  Enable **Developer mode** (toggle in the top right corner).
4.  Click **Load unpacked**.
5.  Select the folder containing this repository (where `manifest.json` is located).
6.  Open a new tab to see your dashboard.

### Thunderbird (Start Page)
1.  Open Thunderbird **Settings** > **General**.
2.  Under **Thunderbird Start Page**:
    *   Check "When Thunderbird launches, show the Start Page".
    *   **Location**: Enter the URL of your hosted dashboard (e.g., `https://tyy130.github.io/tacticdev-newtab-ext/`).
    *   *Alternatively*, you can point to the local file: `file:///path/to/repo/index.html`.

### Desktop App (Chrome PWA)
1.  Open your hosted dashboard URL in Chrome.
2.  Click the **Three Dots Menu (⋮)** > **Cast, Save and Share** > **Install page as app...**.
3.  Name it "TacticDev Dashboard" and check **Open as window**.
4.  Click **Create**.

## Cloud Sync Setup
1.  Get a free JSON bin from [JSONBin.io](https://jsonbin.io).
2.  Create a new bin with this content:
    ```json
    {
      "status": "ready",
      "message": "TacticDev Dashboard Sync Initialized"
    }
    ```
3.  Copy the **Bin URL** and your **API Key** (create one with Read/Write permissions).
4.  In the dashboard, click **Sync** (footer).
5.  Enter your **Instance Name** (e.g., "Laptop"), **URL**, and **Key**.
6.  Click **Save Config**.
7.  **Push Local** to upload your data, or **Pull Cloud** to download existing data.
