# Scripts

End-to-end automation for the agile-consulting-scorecard form.

- [`demo.sh`](./demo.sh) — boots the Rust axum server on a free port,
  exercises every one of the nine HTTP endpoints with the golden
  sample, prints the highlights (12 → 13 row growth after a submit,
  16 → 16 total after bulk-import minus the malformed line, etc.),
  and tears the server down on exit. Useful as a smoke test and as a
  copy-paste walkthrough for someone new to the codebase.

Run from the form root:

```sh
scripts/demo.sh
```

Requires `cargo`, `curl`, and `python3` (used only for JSON
pretty-printing).
