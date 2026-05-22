# US HIPAA Authorization — review dashboard (HTML)

Static review dashboard listing every signed HIPAA authorization with
the validity status, primary purpose, expiration, and any high-priority
fired rules or additional flags.

## Files

- `index.html` — table view of authorizations.
- `css/style.css` — page styles.
- `js/app.js` — data loader and rendering.
- `js/sample-data.js` — sample authorization records for standalone
  preview.

## Columns

- Patient name
- Recipient organisation
- Primary purpose
- Records categories included
- Expiration
- Validity status (valid / invalid / revoked / expired)
- High-priority flags count
- Signed-at date

## Run

Open `index.html` in any modern browser.
