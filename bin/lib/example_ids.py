"""Deterministic, per-form example identifiers (UUIDv5).

Per spec/form-namespacing/, every generated example id is namespaced by its
form, so that two forms' examples never share an id when they are loaded into
one FHIR server, one database or one XML store. Each id is a version 5 UUID
(RFC 9562, SHA-1 name-based) in the project namespace below, named by the
form's slug and the parts that identify the example within the form:

    example_uuid("pre-operative-assessment-by-clinician", "patient")
    example_uuid("pre-operative-assessment-by-clinician", "persona", 3, "bundle")

The same name always gives the same id, so the generators stay byte-stable,
and the XML, FHIR and examples/ fixtures of one form agree on each entity's id.
"""

from __future__ import annotations

import uuid

# The project's UUIDv5 namespace: the v5 UUID of its site URL in the URL namespace.
NAMESPACE = uuid.uuid5(uuid.NAMESPACE_URL, "https://formexamples.github.io/")


def example_uuid(slug: str, *parts: object) -> str:
    """The example id for `parts` within form `slug`."""
    name = "/".join([slug, *(str(part) for part in parts)])
    return str(uuid.uuid5(NAMESPACE, name))
