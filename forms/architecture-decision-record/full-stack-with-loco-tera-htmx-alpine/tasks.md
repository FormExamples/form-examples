# full-stack-with-loco-tera-htmx-alpine — Tasks

## Scaffold

- [x] `loco new --name architecture_decision_record --db postgres --bg async --assets serverside`
- [x] `Cargo.toml`, `src/`, `migration/`, `config/`, `tests/`, `assets/`
- [x] `.gitignore`, `.rustfmt.toml`, `.cargo/`, `.github/`
- [x] `templates/base.html.tera` with HTMX 2.0.8, Alpine.js 3.14.8, and
      `<body hx-boost="true">`
- [x] `cargo check` passes
- [x] `cargo build` passes

## Application

- [x] `cargo loco generate scaffold author`
- [x] `cargo loco generate scaffold organization`
- [x] `cargo loco generate scaffold architecture_decision_record`
      (with `author:references` and `organization:references`)
- [x] `cargo loco generate scaffold architecture_decision_record_position`
- [x] `cargo loco generate scaffold architecture_decision_record_note`
- [x] `cargo check` passes with all scaffolds present
- [x] `cargo loco db migrate` applies all migrations (5 ADR tables in the
      `architecture_decision_record_development` database)
- [x] `assets/views/architecture_decision_record/edit.html` rewritten as
      a 16-section Tyree &amp; Akerman wizard with textareas, status /
      group selects, and child-collection links to positions and notes
- [x] `GET /architecture_decision_records/{id}/markdown` endpoint added
      that joins author, organization, positions, notes and renders the
      ADR as Markdown with `Content-Type: text/markdown; charset=utf-8`
      (verified end-to-end with curl)
- [x] Edit view links out to the Markdown endpoint
- [x] `list.html` rewritten as a register table — number, title, status
      pill, group, date, edit link, `.md` link
- [x] `create.html` rewritten as a minimal "new draft" form: author,
      organization, title, slug, initial status — full Tyree &amp; Akerman
      capture happens in the edit wizard after creation
- [x] `show.html` rewritten as a read-only ADR view with status pill,
      author/organization header, all 14 Tyree &amp; Akerman sections
      (textareas rendered as `whitespace-pre-wrap`, related-* fields
      rendered as bullet lists), positions card-list, notes timeline,
      and a sign-off banner when `signed_off_by` is set. `show` handler
      joins author, organization, positions, and notes.
- [x] Status-aware banners at the top of the show view: `superseded`
      gets a slate banner with an anchor link to Related Decisions;
      `deprecated` gets a red "do not apply to new work" banner;
      `pending` gets an amber "still pending" banner; `approved` and
      `decided` show no banner. Verified live by toggling
      `architecture_decision_records.status` through all four values.
- [x] Fix the starter's Fluent (FTL) bundle initializer panic. Root
      cause: fluent-bundle 0.16 returns `Overriding` when a message id
      appears in both `assets/i18n/shared.ftl` (loaded via
      `shared_resources`) and a per-locale `main.ftl`. Resolution: keep
      `shared.ftl` empty and inline shared terms into each
      `<locale>/main.ftl`. Server now boots in the default config.
- [ ] Replace Loco's default starter `User` model and auth controllers
      with the ADR-specific tables, or remove them
- [x] Customise the generated templates into a 16-section wizard at
      `/architecture_decision_records/{id}/edit`
- [x] HTMX-driven position add/remove. Three endpoints scoped under
      `/architecture_decision_records/{id}/positions[/{position_id}]`
      render a Tera partial; Step 8 embeds it via `hx-get`/`hx-post`/
      `hx-delete`. Marking a position chosen exclusively clears the
      flag on all other positions for the same ADR.
- [x] HTMX-driven note append. Three endpoints scoped under
      `/architecture_decision_records/{id}/notes[/{note_id}]` render a
      Tera partial; Step 15 embeds it via `hx-get`/`hx-post`/`hx-delete`.
      `noted_at` is set server-side on insert so the timeline preserves
      chronology regardless of client clock skew.
- [x] Render Markdown export at `/architecture_decision_records/{id}/markdown`
      (path uses `/markdown` rather than `.md` because axum 0.8 disallows
      literal suffixes after a path parameter)
- [x] Server-side validation matching the SQL CHECK constraints.
      `Params::validate()` rejects unknown `status`, unknown
      `decision_group`, and blank `title` with `Error::BadRequest`,
      returning HTTP 400 + a `{error, description}` JSON body before
      the row reaches Postgres. Five unit tests in
      `controllers::architecture_decision_record::tests` lock in the
      accepted/rejected enum members. Verified live with curl: bad
      status → 400 with a message listing allowed values.
- [x] `GET /api/adrs` JSON endpoint returning the ADR register joined
      with author name, in the camelCase `AdrRow` shape the SvelteKit
      dashboard expects. Registered via a separate `api_routes()` from
      the same controller. Verified live: HTTP 200, content-type
      `application/json`, fields `id, number, slug, title, status,
      decisionGroup, decisionDate, authorName, markdownUrl`.
- [x] Auto-number new ADRs server-side. When `params.number` is `None`
      on `POST /architecture_decision_records`, the handler queries
      `MAX(number)` and assigns `max + 1` (starting at 1 for an empty
      register). Explicit numbers from the client are preserved. The
      "New ADR" form no longer has a number field — backend fills it
      in. Verified live: sequential POSTs got 1, 2; explicit 99 was
      preserved; the next auto-assignment jumped to 100.
- [x] Auto-generate slug from title via `slugify()` when the caller
      omits it. Rules: lowercase, run of non-alphanumeric → single
      hyphen, trim leading/trailing hyphens. Six unit tests cover
      common titles, multiple-symbol runs, empty input, hyphen-only
      input, and non-ASCII (stripped). Verified live: `"Use Kubernetes
      for orchestration"` → `use-kubernetes-for-orchestration`;
      explicit `slug` from the client is preserved.
- [x] `GET /api/adrs/{slug}` JSON viewer endpoint returning the row
      metadata plus the rendered Markdown body in one round trip, so
      the SvelteKit dashboard's `[slug]` route can show ADRs inline
      without re-fetching. Markdown rendering refactored into
      `render_markdown()` shared by `/{id}/markdown` and the new
      endpoint. Verified live: HTTP 200 for known slug, 404 for
      unknown, CORS preflight allow-origin set.

## Auth scaffolding removed

- [x] Loco's starter `users` table, `auth` controller, mailers,
      `users.yaml` fixture, downloader worker, and auth integration
      tests deleted. `app.rs`, `controllers/mod.rs`, `views/mod.rs`,
      `models/mod.rs`, `models/_entities/mod.rs`,
      `models/_entities/prelude.rs`, `lib.rs`, and the migration
      vector all updated. Stale `seaql_migrations` row dropped from
      the development database.

## Tests

- [x] `cargo test --no-run` builds the test binaries cleanly
- [x] `cargo test` passes — 6 unit tests for the ADR validator and
      slugify; 4 HTTP integration tests in
      `tests/requests/architecture_decision_record.rs` covering:
      auto-numbering across three sequential POSTs (1, explicit 99,
      auto-100), auto-slug derivation, the `400` response for
      unknown status enums, `/api/adrs/:slug` returning rendered
      Markdown with author/group/status populated, and the `404`
      response for an unknown slug. Tests are `#[serial]` and target
      the `architecture_decision_record_test` Postgres database.
