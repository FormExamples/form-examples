# Licenses

This specification states which licenses this project is offered under, and how the
license files, manifests, and documentation keep that statement consistent.

## Requirements

1. The project is offered under any one of the licenses in the table below, at the
   recipient's option. `OR` means the recipient chooses; no obligation from one
   license applies to someone who chose another.
2. `LICENSE.md` lists every license in the table, with its SPDX identifier.
3. Where a package manifest (`Cargo.toml`, `package.json`, `*.csproj`, and similar)
   declares a license, it uses the SPDX expression below, or a single identifier from
   the table where the packaging format does not accept an expression.
4. Documentation that lists the licenses (`README.md`, `CITATION.cff`, `INSTALL.md`,
   and similar) agrees with this table.
5. When this table changes, `LICENSE.md`, the manifests, and the documentation change
   in the same commit.

## Licenses

This repository is not offered under the five licenses of the sibling repositories.
Its own work was already CC-BY-NC-SA-4.0, which is deliberately non-commercial, so
the permissive and GNU licenses are not added. Only one new option is added.

| License | SPDX identifier |
| --- | --- |
| [Creative Commons Attribution Non Commercial Share Alike 4.0 International](https://creativecommons.org/licenses/by-nc-sa/4.0/) | [`CC-BY-NC-SA-4.0`](https://spdx.org/licenses/CC-BY-NC-SA-4.0.html) |
| [UK Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/) | [`OGL-UK-3.0`](https://spdx.org/licenses/OGL-UK-3.0.html) |

Custom license terms are available by arrangement. Third-party works keep their own
licenses (see `LICENSE.md`).

## SPDX expression

```
CC-BY-NC-SA-4.0 OR OGL-UK-3.0
```

## Notes

- **OGL-UK-3.0** (UK Open Government Licence v3.0) permits free reuse, including
  commercial reuse, of information with attribution. It suits specification text,
  guidance, and data.
- **CC-BY-NC-SA-4.0** requires attribution, allows only non-commercial use, and
  requires adaptations to be shared under the same license. Anyone who needs
  commercial use chooses OGL-UK-3.0, or asks for custom terms.
