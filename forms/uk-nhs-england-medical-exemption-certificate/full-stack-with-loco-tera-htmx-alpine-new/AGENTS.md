# Full-Stack with Loco / Tera / HTMX / Alpine — UK NHS FP92A (NEW SCAFFOLD)

**Placeholder directory** for the next-generation scaffold of the FP92A
full-stack crate. The current production crate lives at the sibling
[`../full-stack-with-loco-tera-htmx-alpine/`](../full-stack-with-loco-tera-htmx-alpine/),
which is a minimal axum + Tera + HTMX + Alpine.js server with an in-memory
store.

This `-new` directory will eventually hold the regenerated crate produced
by running the sibling shell script
[`../full-stack-with-loco-tera-htmx-alpine-setup`](../full-stack-with-loco-tera-htmx-alpine-setup),
which is a sequence of `cargo loco generate scaffold` calls for the 8 FP92A
tables in their migration order.

## Intended workflow

1. From the parent form directory:
   ```sh
   cargo loco new uk-nhs-england-medical-exemption-certificate \
       --db postgres --bg async --asset clientside \
       --output full-stack-with-loco-tera-htmx-alpine-new
   ```
2. From inside the generated crate, run the sibling setup script:
   ```sh
   ../full-stack-with-loco-tera-htmx-alpine-setup
   ```
3. Hand-port the engine (`src/engine/`), controllers, and templates from
   the original crate.
4. Rename `full-stack-with-loco-tera-htmx-alpine` -> `*-old`, and
   `full-stack-with-loco-tera-htmx-alpine-new` -> `full-stack-with-loco-tera-htmx-alpine`.

## Why a separate directory?

The Loco CLI insists on creating its own project root. To avoid clobbering
the working crate, the regenerated tree is staged here first, then promoted
once it builds and the engine has been ported across.

## Status

- [ ] Run `cargo loco new`
- [ ] Run the sibling setup script
- [ ] Port `src/engine/` from the original crate
- [ ] Port controllers + views + Tera templates
- [ ] Promote `-new` to replace the original

## See also

- [`../full-stack-with-loco-tera-htmx-alpine/`](../full-stack-with-loco-tera-htmx-alpine/) — current working crate
- [`../full-stack-with-loco-tera-htmx-alpine-setup`](../full-stack-with-loco-tera-htmx-alpine-setup) — scaffold shell script
- [`../sql-migrations/`](../sql-migrations/) — canonical data model
