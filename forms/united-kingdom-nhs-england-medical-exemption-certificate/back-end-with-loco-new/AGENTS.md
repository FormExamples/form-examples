# Full-Stack with Loco / Tera / HTMX / Alpine — UK NHS FP92A (NEW SCAFFOLD)

**Placeholder directory** for the next-generation scaffold of the FP92A
full-stack crate. The current production crate lives at the sibling
[`../back-end-with-loco/`](../back-end-with-loco/),
which is a minimal axum + Tera + HTMX + Alpine.js server with an in-memory
store.

This `-new` directory will eventually hold the regenerated crate produced
by running the sibling shell script
[`../back-end-with-loco-setup`](../back-end-with-loco-setup),
which is a sequence of `cargo loco generate scaffold` calls for the 8 FP92A
tables in their migration order.

## Intended workflow

1. From the parent form directory:
   ```sh
   cargo loco new united-kingdom-nhs-england-medical-exemption-certificate \
       --db postgres --bg async --asset clientside \
       --output back-end-with-loco-new
   ```
2. From inside the generated crate, run the sibling setup script:
   ```sh
   ../back-end-with-loco-setup
   ```
3. Hand-port the engine (`src/engine/`), controllers, and templates from
   the original crate.
4. Rename `back-end-with-loco` -> `*-old`, and
   `back-end-with-loco-new` -> `back-end-with-loco`.

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

- [`../back-end-with-loco/`](../back-end-with-loco/) — current working crate
- [`../back-end-with-loco-setup`](../back-end-with-loco-setup) — scaffold shell script
- [`../sql-migrations/`](../sql-migrations/) — canonical data model
