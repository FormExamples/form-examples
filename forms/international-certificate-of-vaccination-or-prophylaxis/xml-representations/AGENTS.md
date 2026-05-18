# XML representations — agent instructions

Generated artifacts: do not edit by hand. Regenerate via
`bin/xml-representations/generate-xml-representations.py <form-slug>`.

See root [`AGENTS/xml-representations.md`](../../../AGENTS/xml-representations.md)
for conventions and the SQL→XML mapping rules.

Verify with:

```sh
for xml in *.xml; do xmllint --valid --noout "$xml" || echo "FAIL: $xml"; done
```
