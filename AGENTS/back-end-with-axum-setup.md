# Back-end setup script

The generated per-form `back-end-with-axum-setup` shell script creates the
form's `_development`, `_test`, and `_production` databases, then applies the
crate's `migrations/`. Do not hand-edit it; re-run the generator instead.

Slug: back-end-with-axum-setup

- Search pattern: `forms/*/back-end-with-axum-setup`
- Generator: `bin/back-end-with-axum/generate-back-end-with-axum-setup.py`
- Check: `python3 bin/back-end-with-axum/generate-back-end-with-axum-setup.py --check`
