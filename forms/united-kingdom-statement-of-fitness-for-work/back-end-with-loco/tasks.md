# Tasks: UK Statement of Fitness for Work — Full Stack

- [x] Author `Cargo.toml` and `.gitignore` at the top of the directory.
- [x] Scaffold `src/main.rs` with axum bootstrap, Tera glob, and the
      in-memory `Store`.
- [x] Author `src/controllers/fit_note.rs` with the five HTTP handlers
      and the `form_to_fit_note()` parser.
- [x] Author `src/views/fit_note.rs` with `build_form_context` and
      `build_report_context`.
- [x] Port `front-end-with-html/js/grader.js` to
      `src/grading/*.rs` preserving rule IDs and flag IDs.
- [x] Author `templates/base.html.tera` with the pinned HTMX 2.0.8 and
      Alpine.js 3.14.8 `<script defer>` tags and `<body hx-boost="true">`.
- [x] Author `templates/home/index.html.tera` landing page.
- [x] Author `templates/fit_note/form.html.tera` ten-step single-page
      wizard with Alpine.js step navigation.
- [x] Author `templates/fit_note/report.html.tera` graded report.
- [x] Add cargo tests for the grader's headline policy outcomes.
- [ ] Run the sibling
      `../back-end-with-loco-setup` script to scaffold
      the SeaORM 1.1 layer against PostgreSQL.
- [ ] Wire the SeaORM repository in `src/models/` and switch the
      controllers from `Store` to repository calls.
- [ ] Verify via `bin/test-form united-kingdom-statement-of-fitness-for-work`.
