This folder contains runtime assets used by the PWA.

For fully offline PDF embedding you should ensure the following files exist in this folder:

  - pdf-lib.min.js            (https://unpkg.com/pdf-lib/dist/pdf-lib.min.js)
  - fontkit.umd.js           (https://unpkg.com/@pdf-lib/fontkit/dist/fontkit.umd.js)
  - DejaVuSans.ttf           (embedded font used by PDFs)

To download the official builds, run from the repository root in PowerShell:

  powershell -ExecutionPolicy Bypass -File .\scripts\download-assets.ps1

If PowerShell is not available, you can use curl (Windows 10+ / WSL):

  curl -o assets/pdf-lib.min.js https://unpkg.com/pdf-lib/dist/pdf-lib.min.js
  curl -o assets/fontkit.umd.js https://unpkg.com/@pdf-lib/fontkit/dist/fontkit.umd.js

After downloading, reload the page and (if service worker is registered) either update the SW or unregister it in DevTools -> Application -> Service Workers to fetch new cached assets.
