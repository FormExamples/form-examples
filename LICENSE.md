# License

**SPDX-License-Identifier: `CC-BY-NC-SA-4.0 OR OGL-UK-3.0`**

You may use the work I have personally done under **either one** of the two
licenses below, at your option. The recipient chooses; no obligation from one
license applies to someone who chose the other.

## Option 1: CC-BY-NC-SA-4.0

For the work that I've personally done, such as writing the README.md file, the
license is Creative Commons Attribution-NonCommercial-ShareAlike 4.0
International.

- Human-readable summary: <https://creativecommons.org/licenses/by-nc-sa/4.0/>
- Legal code: <https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode>
- SPDX identifier: [`CC-BY-NC-SA-4.0`](https://spdx.org/licenses/CC-BY-NC-SA-4.0.html)

In short, you may share and adapt this work, provided you give appropriate
credit, do not use it for commercial purposes, and distribute your adaptations
under this same license. If your intended use does not fit those terms, ask:
<joel@joelparkerhenderson.com>.

## Option 2: OGL-UK-3.0

The work I have personally done is also available under the UK Open Government
Licence v3.0.

- Licence text: <https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/>
- SPDX identifier: [`OGL-UK-3.0`](https://spdx.org/licenses/OGL-UK-3.0.html)

In short, you may copy, publish, distribute, adapt, and use the work commercially
and non-commercially, provided you acknowledge the source of the information and
include a link to the licence. This option applies only to the work I have
personally done, and not to the third-party works listed below.

## Work by others

For the work that is included created by others, such as the original authors of
the templates, please see the original works for their respective licenses, and
optionally see each work's folder for a respective LICENSE.md file if available.

## Third-party works included here

- **Vendored design-system snapshots.** `forms/lily-spec/` and
  `forms/lily-svelte-spec/` are snapshots of the Lily Design System, pinned by
  upstream commit in `forms/lily-version.md` and `forms/lily-svelte-version.md`,
  and re-synced by tool rather than hand-edited. They remain their authors' work
  under their authors' license.
- **Clinical instruments.** Scores, scales, and grading rules implemented by
  these forms — and the published public forms several of them model — are the
  work of their publishers and issuing bodies, cited in each form's `doc/`.
  Implementing an instrument here does not license it: where an instrument
  carries its own terms, those terms govern its use, whoever wrote the
  arithmetic.
- **Dependencies.** Rust crates, npm packages, and other dependencies are under
  their own licenses. Each Rust crate carries a `cargo deny` policy that gates
  which licenses are acceptable.

## Machine-readable summary

```yaml
license:
  spdx-expression: CC-BY-NC-SA-4.0 OR OGL-UK-3.0
  options:
    - spdx-id: CC-BY-NC-SA-4.0
      name: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
      url: https://creativecommons.org/licenses/by-nc-sa/4.0/
      osi-approved: false
      commercial-use: false
      attribution-required: true
      share-alike: true
    - spdx-id: OGL-UK-3.0
      name: UK Open Government Licence v3.0
      url: https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/
      osi-approved: false
      commercial-use: true
      attribution-required: true
      share-alike: false
  contact: joel@joelparkerhenderson.com
```

## Full license texts

The full text of each license is in its own directory:

- [MIT](LICENSES/mit/index.md)
- [Apache-2.0](LICENSES/apache-2.0/index.md)
- [BSD-3-Clause](LICENSES/bsd-3-clause/index.md)
- [GPL-2.0-only](LICENSES/gpl-2.0-only/index.md)
- [GPL-3.0-only](LICENSES/gpl-3.0-only/index.md)
- [OGL-UK-3.0](LICENSES/ogl-uk-3.0/index.md)
- [CC-BY-NC-SA-4.0](LICENSES/cc-by-nc-sa-4.0/index.md)
