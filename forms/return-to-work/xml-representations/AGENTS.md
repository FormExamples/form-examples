# Return to Work — XML Representations Agent Instructions

Generated XML and DTD files for the Return to Work form. See
[`index.md`](./index.md) for the file map.

## Authoring rules

- **Do not hand-edit generated files.** Edit
  `../sql-migrations/*.sql` and re-run the generator.
- Element names mirror SQL column names (snake_case).
- Empty strings emit as empty elements; SQL NULL emits as a missing
  element.
- DTDs use `#REQUIRED` for `id`, `created_at`, `updated_at`;
  everything else is `#IMPLIED`.

## Verify

```sh
bin/xml-representations/generate-xml-representations.py return-to-work
xmllint --valid --noout *.xml
```
