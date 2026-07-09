# TypeSpec — agent instructions

Hand-authored TypeSpec models that mirror the SQL schema. Keep in sync with
`../sql/` by hand; there is no auto-generator yet.

Conventions:

- Mirror table names in `PascalCase`; mirror columns in `camelCase`.
- Map TEXT and VARCHAR → `string`; INTEGER → `int32`; NUMERIC → `decimal`;
  DATE → `plainDate`; TIMESTAMPTZ → `utcDateTime`; BOOLEAN → `boolean`.
- SQL `CHECK (... IN (...))` becomes a `|`-separated string union.
- Use the namespace
  `InternationalCertificateOfVaccinationOrProphylaxis`.
