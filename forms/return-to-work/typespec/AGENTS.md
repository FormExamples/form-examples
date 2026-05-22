# Return to Work — TypeSpec Agent Instructions

Generated TypeSpec schemas for the Return to Work form. See
[`index.md`](./index.md) for the file map.

## Authoring rules

- **Do not hand-edit generated files.** Edit
  `../sql-migrations/*.sql` and re-run the generator.
- Model property names are camelCase.
- Use `@format("uuid")` on UUID columns, `utcDateTime` on TIMESTAMPTZ,
  `plainDate` on DATE, `plainTime` on TIME, `decimal` on NUMERIC.
- Enums become `union` types of literal string members.

## Verify

```sh
tsp compile typespec/
```
