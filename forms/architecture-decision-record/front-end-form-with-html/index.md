# Front-end Form (HTML + Alpine.js)

Single-page wizard for the Architecture Decision Record (Tyree & Akerman
template), implemented as static HTML and a single JavaScript file.

Open `index.html` directly in a browser — no build step, no server, no
package install. The page works from `file://` because the scripts are
classic `<script>` tags rather than ES modules.

## Files

- `index.html` — page shell
- `css/style.css` — minimal hand-written CSS
- `js/app.js` — state, rendering, and Markdown report generator

## Output

The "Generate Markdown ADR" button renders a Markdown document derived
from the captured fields. The document can be copied to the clipboard or
downloaded as a `.md` file with a name like `0042-your-slug.md`.
