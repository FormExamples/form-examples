# Comparisons

What else occupies this space, how this repository differs, and — the part most
comparison pages omit — when one of the others is the better choice.

The links are to each project's own home. Details such as licensing and current
capability change; check them at the source rather than trusting a table in
someone else's repository, this one included.

## The one-paragraph difference

Almost everything in this space is a **runtime**: you author a form definition,
and an engine renders it, validates it, and stores the answers. This repository
is not a runtime. It is a **corpus of finished implementations**: for each of
several hundred forms, a PostgreSQL schema that is the source of truth, four
representations generated from it (XML + DTD, FHIR R5, Protocol Buffers,
OpenAPI 3.1), two independent front-end implementations, and a Rust JSON API —
all committed as ordinary files, and all held in agreement by drift detectors
that fail the build when a generated artefact stops matching its source.

The unit of value is therefore different. A form engine gives you *a way to
build* a form. This gives you *a built one*, in five representations, that you
can read, diff, copy, and adapt.

## Standards and data models

### [HL7 FHIR Questionnaire / SDC](https://hl7.org/fhir/questionnaire.html)

The standard way to express a form as FHIR data, with Structured Data Capture
adding population and extraction against other FHIR resources. Renderers such as
the NLM's [LHC-Forms](https://lhncbc.github.io/lforms/) turn a `Questionnaire`
into a working UI.

**How this repository relates:** as a consumer, not a competitor. Each form
generates FHIR R5 resources and an example Bundle from its SQL, and CI validates
them with the official HL7 validator. The difference is direction of travel:
FHIR SDC starts from the `Questionnaire` and derives the UI; this starts from a
relational schema and derives FHIR as one of several outputs.

**Choose FHIR SDC instead when** the form definition itself must be exchanged
between systems, or when you need one renderer to handle forms you have not seen
yet.

### [openEHR](https://openehr.org/) archetypes and templates

Two-level modelling: archetypes describe maximal clinical concepts, templates
constrain them for a use case, and the Clinical Knowledge Manager publishes them
under governance by clinicians.

**How this repository relates:** openEHR's modelling rigour and clinical
governance are far beyond what one maintainer produces here. What this offers
instead is concreteness — a working front end and API per form, which an
archetype deliberately does not carry.

**Choose openEHR instead when** you need vendor-neutral, queryable clinical data
with genuine clinical-community governance behind the models.

### [LOINC](https://loinc.org/) panels, and instrument publishers

The identifiers and the published instruments themselves (PHQ-9, GAD-7, GOLD,
KDIGO, and so on).

**How this repository relates:** it implements them and cites them, form by
form, in each `doc/`. The instruments are their publishers' work, under their
publishers' terms; the implementation is this project's, and is not endorsed by
any of them.

## Form engines and data-capture platforms

### [REDCap](https://projectredcap.org/)

The default for academic research data capture, with a large institutional
consortium behind it. Strong on study workflow, audit, and export.

**Choose REDCap instead when** you are running a study and need survey logic,
participant management, and regulatory-grade audit without writing code. It is
not open source in the usual sense, and access runs through institutional
membership.

### [ODK](https://getodk.org/), [KoboToolbox](https://www.kobotoolbox.org/), [CommCare](https://www.dimagi.com/commcare/)

The field-data-collection lineage: XLSForm-style authoring, offline-first mobile
clients, and a server that aggregates submissions. Deployed at very large scale
in humanitarian and public-health work.

**Choose one of these instead when** enumerators collect data on phones, often
offline, and the operational problem is device fleets and submission pipelines
rather than schema design.

### [OpenMRS](https://openmrs.org/) and [DHIS2](https://dhis2.org/)

Full health information systems, each with its own form builder, deployed
nationally in many countries.

**Choose one of these instead when** you need the surrounding system — patients,
encounters, reporting, users — and the forms are a feature of it.

### [Form.io](https://form.io/), [SurveyJS](https://surveyjs.io/), [JSONForms](https://jsonforms.io/)

Generic JSON-schema-driven form builders and renderers, not health-specific.

**Choose one of these instead when** forms are user-authored at runtime and the
shapes are not known in advance. This repository assumes the opposite: the shape
is known, so it is a schema and a migration, not a document.

## Clinical calculators

### [MDCalc](https://www.mdcalc.com/) and equivalents

Curated, clinician-reviewed calculators with references, presented as a
reference tool for practitioners.

**How this repository relates:** overlapping content, different artefact. MDCalc
is a product you use; this is source you build on. MDCalc's clinical review is
real, and this project makes no comparable claim — see the limitations in
[`AI_STATEMENT.md`](AI_STATEMENT.md) §12.

## Public-sector form systems

### [GOV.UK Design System](https://design-system.service.gov.uk/) and [NHS design system](https://service-manual.nhs.uk/design-system)

Pattern libraries with serious user research and accessibility work behind them,
and the source of many of the underlying paper forms modelled here.

**How this repository relates:** several forms model published UK statutory
forms (DVLA, MAT B1, fit note, and others). Those are Crown work; this
repository implements the data shape and a UI for it, and is neither endorsed by
nor affiliated with any issuing body.

## Where this repository is genuinely different

Four properties, each checkable against the tree rather than asserted:

- **One design, proven across hundreds of domains.** Every form obeys the same
  conventions — single-page wizard, UUID keys, soft-delete timestamps, empty
  string for unanswered text, `null` for unanswered numbers, the same route
  layout — so the differences between two forms are the clinical content and
  nothing else. Uniformity at this breadth is unusual and is the point of the
  exercise.
- **Five representations, mechanically in agreement.** SQL is the source of
  truth; XML, FHIR, Protocol Buffers, and OpenAPI are generated; drift detectors
  in CI fail the build if any committed artefact stops matching. Most projects
  hold their representations in agreement by convention and hope.
- **Two independent front-end implementations per form.** The same wizard exists
  in static HTML and in SvelteKit, over the same schema — useful precisely as a
  comparison of stacks against a fixed target.
- **The toolchain is the deliverable too.** Sixty-nine tools under `bin/`, most
  with a `--check` mode, encode how a fleet-wide change is made safely. See
  [`BENCHMARKS.md`](BENCHMARKS.md) for what that costs in wall-clock.

## Where it is weaker, and by how much

Stated plainly, because a comparison page that only flatters its own project is
an advertisement:

- **No runtime form authoring.** A new form is a code change, with a schema, a
  migration, and a rollout. If your users need to create forms themselves, this
  is the wrong shape entirely.
- **No clinical validation, and no clinical governance.** openEHR CKM has
  clinicians reviewing models; REDCap has institutional oversight; MDCalc has
  named reviewers. This has one maintainer and a set of machine gates, which
  catch inconsistency but cannot catch a clinically wrong threshold.
- **No deployment story.** No hosting, no multi-tenancy, no user management, no
  audit log, no packaged release. [`INSTALL.md`](INSTALL.md) runs one form
  locally; everything past that is yours.
- **A restrictive licence for a code corpus.** CC BY-NC-SA 4.0 is
  non-commercial and share-alike, which rules out uses that a permissively
  licensed alternative would allow. See [`LICENSE.md`](LICENSE.md).
- **A bus factor of one.** [`MAINTAINERS.md`](MAINTAINERS.md) is explicit about
  what that means for anyone considering a dependency.
