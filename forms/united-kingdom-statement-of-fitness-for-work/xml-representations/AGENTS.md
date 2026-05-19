# xml-representations/ — Agent Instructions

Generated XML + DTD per SQL table. Re-run the generator after any change
to `../sql-migrations/`.

```sh
bin/xml-representations/generate-xml-representations.py united-kingdom-statement-of-fitness-for-work
```

Each file is a sample document showing a single representative row with
realistic placeholder values, validated against its sibling DTD. The files
serve as schema documentation and as fixtures for downstream consumers.

See [`./index.md`](./index.md) for the file list.
