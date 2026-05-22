# Return to Work — static HTML clinician wizard

Single-file HTML wizard backed by Alpine.js 3 for reactivity. No
build step, no bundler — open `index.html` in a browser and step
through all 12 wizard panels on one continuous page.

The HTML form mirrors the SvelteKit wizard one-for-one so that an
NHS trust without a Node.js front-end pipeline can still adopt the
form. The composite-grader engine is ported to plain ES modules in
`js/engine/`.

## Stack

- Plain HTML5 (single page).
- Tailwind CSS 4 via the CDN (`<script src=…>`).
- Alpine.js 3.14.8 for reactive `x-data` / `x-model` bindings.
- ES modules (`<script type="module">`) for the engine.

## Files

```
front-end-form-with-html/
├── index.html        # single-page wizard
├── css/
│   └── theme.css     # custom Tailwind theme variables
└── js/
    ├── app.js        # Alpine.js root component
    ├── engine/
    │   ├── types.js
    │   ├── utils.js
    │   ├── fitness-rules.js
    │   ├── restriction-rules.js
    │   ├── composite-grader.js
    │   └── flagged-issues.js
    └── report/
        ├── pdf-builder.js   # pdfmake bundled via CDN
        └── render.js        # statement-of-fitness HTML render
```

## Running

```sh
# Any static HTTP server. For example:
python3 -m http.server 8080
```

Open `http://localhost:8080/index.html`.
