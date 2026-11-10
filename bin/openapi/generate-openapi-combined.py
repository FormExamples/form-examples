#!/usr/bin/env python3
"""bin/openapi/generate-openapi-combined.py — one combined OpenAPI spec per form.

The per-entity OpenAPI files (generate-openapi-representations.py) each describe
a single table. API consumers (Swagger UI, client codegen) want ONE document
per form, so this merges every `forms/<slug>/openapi/*.yaml` into a single
`forms/<slug>/openapi/openapi.yaml` — the union of their `paths` and
`components.schemas`, under a form-level `info` block. Paths and schema names do
not collide across a form's entities, so the union is unambiguous.

The per-entity files describe every SQL table, but not every table has a route.
The combined document is what a crate serves at `GET /api/openapi.yaml`, so it
keeps only the paths the crate's controllers declare, and the schemas those use.
Where a table's own controller (`controllers/<table>.rs`) serves it under another
path than the generated plural, such as `/api/people` for `person`, the document
uses the served path. A column `sql/` declares but the crate's table lacks is left
out, so the document describes what is sent. Property names are camelCase, as the crates send them; the
per-entity files keep the SQL column names, because they describe storage.

Routes no SQL table describes, such as a dashboard or a `submit` action, are
documented by hand in `forms/<slug>/openapi/hand/routes.yaml`, a fragment with
`paths` and, if it needs them, `components.schemas`. It is merged in as written.
Every document also describes `GET /api/openapi.yaml` itself, and an operation the
crate does not serve, such as a `PUT` a hand-written controller lacks, is left out.

`--check` fails when a combined document is stale, and when a route the crate
serves is not documented, or a documented one is not served, method by method,
and when two operations share an `operationId`.

Generated artefact: do not hand-edit. Idempotent.

Usage:
  bin/openapi/generate-openapi-combined.py          # every form
  bin/openapi/generate-openapi-combined.py <slug>…  # only named forms
  bin/openapi/generate-openapi-combined.py --check  # exit non-zero if stale
"""

from __future__ import annotations

import argparse
from collections import Counter
import re
import sys
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "lib"))
import axum_crate as ac  # noqa: E402

LOADER = getattr(yaml, "CSafeLoader", yaml.SafeLoader)
DUMPER = getattr(yaml, "CSafeDumper", yaml.SafeDumper)

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
FORMS_DIR = REPO_ROOT / "forms"
# Written under a subdir so the per-entity generator's `openapi/*.yaml` cleanup
# (non-recursive) never sees it.
COMBINED = "combined/openapi.yaml"
HAND = "hand/routes.yaml"
METHODS = ("get", "post", "put", "patch", "delete")
ADD = re.compile(r'\.add\(\s*"([^"]*)"\s*,\s*(?:axum::routing::)?(get|post|put|patch|delete)\(')
SELF = {
    "get": {
        "summary": "This document",
        "operationId": "getOpenApi",
        "responses": {
            "200": {
                "description": "The OpenAPI document for this service",
                "content": {"application/yaml": {"schema": {"type": "string"}}},
            }
        },
    }
}


def title_of(slug: str) -> str:
    index = FORMS_DIR / slug / "index.md"
    if index.is_file():
        m = re.search(r"^#\s+(.+?)\s*$", index.read_text(), re.MULTILINE)
        if m:
            return m.group(1)
    return slug.replace("-", " ").title()


def entity_specs(slug: str) -> list[Path]:
    d = FORMS_DIR / slug / "openapi"
    if not d.is_dir():
        return []
    return sorted(p for p in d.glob("*.yaml") if p.name != COMBINED)


def controllers(slug: str) -> list[Path]:
    crate = FORMS_DIR / slug / "back-end-with-axum"
    return sorted(crate.glob("src/*/controllers/*.rs"))


def join(prefix: str, uri: str) -> str:
    path = "/" + "/".join(part for part in (prefix.strip("/"), uri.strip("/")) if part)
    return path


def served_operations(slug: str) -> set[tuple[str, str]]:
    """Every (method, path) the form's controllers declare."""
    found: set[tuple[str, str]] = set()
    for path in controllers(slug):
        for chunk in path.read_text().split("Routes::new()")[1:]:
            prefix = re.match(r'\s*\.prefix\("([^"]*)"\)', chunk)
            base = prefix.group(1) if prefix else ""
            for uri, method in ADD.findall(chunk):
                found.add((method, join(base, uri)))
    return found


def shape(path: str) -> str:
    """A path with its parameters' names left out, so `{id}` matches `{slug}`."""
    return re.sub(r"\{\w+\}", "{}", path)


def served_routes(slug: str) -> set[str]:
    """The route prefixes the form's Axum controllers declare."""
    routes: set[str] = set()
    for path in controllers(slug):
        for prefix in re.findall(r'\.prefix\("/?([\w/-]+?)/?"\)', path.read_text()):
            routes.add(f"/{prefix}")
    return routes


def served_as(slug: str) -> dict[str, str]:
    """For a table whose own controller serves it under one prefix, that prefix."""
    found = {}
    for path in controllers(slug):
        prefixes = set(re.findall(r'\.prefix\("/?([\w/-]+?)/?"\)', path.read_text()))
        if len(prefixes) == 1:
            found[path.stem] = "/" + prefixes.pop()
    return found


def referenced(paths: dict, schemas: dict) -> dict:
    """The schemas `paths` refers to, including what those refer to."""
    wanted: set[str] = set()
    todo = set(re.findall(r"#/components/schemas/(\w+)", yaml.dump(paths, Dumper=DUMPER)))
    while todo:
        name = todo.pop()
        if name in wanted or name not in schemas:
            continue
        wanted.add(name)
        todo |= set(re.findall(r"#/components/schemas/(\w+)", yaml.dump(schemas[name], Dumper=DUMPER)))
    return {name: schema for name, schema in schemas.items() if name in wanted}


def camel(name: str) -> str:
    head, *rest = name.split("_")
    return head + "".join(part[:1].upper() + part[1:] for part in rest)


def on_the_wire(schema):
    """A per-entity schema as the crate sends it: its property names in camelCase.
    The per-entity files describe storage, so they keep the SQL column names."""
    if isinstance(schema, list):
        return [on_the_wire(item) for item in schema]
    if not isinstance(schema, dict):
        return schema
    out = {}
    for key, value in schema.items():
        if key == "properties" and isinstance(value, dict):
            out[key] = {camel(name): on_the_wire(item) for name, item in value.items()}
        elif key == "required" and isinstance(value, list):
            out[key] = [camel(name) for name in value]
        else:
            out[key] = on_the_wire(value)
    return out


def stored_columns(slug: str) -> dict[str, set[str]]:
    """For each SQL table the crate stores, the columns its own table has."""
    form = FORMS_DIR / slug
    crate = form / "back-end-with-axum"
    if not crate.is_dir():
        return {}
    wanted, migrated = ac.sql_tables(form), ac.migration_tables(crate)
    found = {}
    for name, table in wanted.items():
        target = ac.resolve(name, table, migrated)
        if target:
            found[name] = {c.name for c in migrated[target].columns}
    return found


def keep_stored(schema: dict, columns: set[str]) -> dict:
    """A table's schema without the columns the crate's table does not have."""
    schema = dict(schema)
    if isinstance(schema.get("properties"), dict):
        schema["properties"] = {k: v for k, v in schema["properties"].items() if k in columns}
    if isinstance(schema.get("required"), list):
        schema["required"] = [k for k in schema["required"] if k in columns]
    return schema


def build(slug: str) -> str:
    paths: dict = {}
    schemas: dict = {}
    renamed = served_as(slug)
    stored = stored_columns(slug)
    for spec_path in entity_specs(slug):
        spec = yaml.load(spec_path.read_text(), Loader=LOADER) or {}
        spec_paths = spec.get("paths") or {}
        bases = {route.split("/{")[0] for route in spec_paths}
        served = renamed.get(spec_path.stem)
        for route, item in spec_paths.items():
            base = route.split("/{")[0]
            if served and len(bases) == 1 and base != served:
                route = served + route[len(base):]
            paths[route] = item
        for name, schema in ((spec.get("components") or {}).get("schemas") or {}).items():
            if name != "Problem" and spec_path.stem in stored:
                schema = keep_stored(schema, stored[spec_path.stem])
            schemas[name] = on_the_wire(schema)

    routes = served_routes(slug)
    paths = {route: item for route, item in paths.items() if route.split("/{")[0] in routes}
    # Keep only the methods the crate serves; a hand-written controller may lack PUT.
    served = {(m, shape(p)) for m, p in served_operations(slug)}
    for route in list(paths):
        item = {k: v for k, v in paths[route].items()
                if k not in METHODS or (k, shape(route)) in served}
        if any(k in METHODS for k in item):
            paths[route] = item
        else:
            del paths[route]
    hand = FORMS_DIR / slug / "openapi" / HAND
    if hand.is_file():
        fragment = yaml.load(hand.read_text(), Loader=LOADER) or {}
        for route, item in (fragment.get("paths") or {}).items():
            paths.setdefault(route, {}).update(item)
        for name, schema in ((fragment.get("components") or {}).get("schemas") or {}).items():
            schemas[name] = schema
    if ("get", "/api/openapi.yaml") in served_operations(slug):
        paths["/api/openapi.yaml"] = SELF
    schemas = referenced(paths, schemas)

    doc = {
        "openapi": "3.1.0",
        "info": {
            "title": f"{title_of(slug)} — JSON API",
            "version": "1.0.0",
            "description": (
                f"Combined OpenAPI specification for the {title_of(slug)} form, "
                "merged from the per-entity specs in this directory. One RESTful "
                "resource per routed SQL table, and any routes documented by hand "
                "in hand/routes.yaml."
            ),
        },
        "paths": dict(sorted(paths.items())),
        "components": {"schemas": dict(sorted(schemas.items()))},
    }
    header = (
        "# Generated by bin/openapi/generate-openapi-combined.py from the\n"
        "# per-entity specs in this directory and hand/routes.yaml. Do not edit by hand.\n"
    )
    return header + yaml.safe_dump(doc, sort_keys=False, allow_unicode=True, width=100)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("slugs", nargs="*")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()

    slugs = args.slugs or sorted(
        p.name for p in FORMS_DIR.iterdir() if (p / "openapi").is_dir()
    )
    drift, gaps = [], []
    for slug in slugs:
        out = FORMS_DIR / slug / "openapi" / COMBINED
        if not entity_specs(slug):
            continue
        want = build(slug)
        if args.check:
            have = out.read_text() if out.exists() else ""
            if have != want:
                drift.append(slug)
            paths = yaml.load(want.split("\n", 2)[2], Loader=LOADER).get("paths") or {}
            documented = {(method, path) for path, item in paths.items() for method in item if method in METHODS}
            ids = Counter(item[method].get("operationId") for path, item in paths.items()
                          for method in item if method in METHODS)
            for name, count in sorted(ids.items(), key=lambda pair: str(pair[0])):
                if name and count > 1:
                    gaps.append(f"{slug}: operationId {name} is used {count} times")
            normal = lambda ops: {(m, shape(p)) for m, p in ops}
            served = normal(served_operations(slug))
            documented = normal(documented)
            for method, path in sorted(served - documented):
                gaps.append(f"{slug}: {method.upper()} {path} is served but not documented")
            for method, path in sorted(documented - served):
                gaps.append(f"{slug}: {method.upper()} {path} is documented but not served")
        else:
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(want)

    if args.check:
        for gap in gaps:
            print(gap, file=sys.stderr)
        if drift:
            print(f"combined openapi.yaml stale for {len(drift)} form(s):", file=sys.stderr)
            for s in drift[:20]:
                print(f"  {s}", file=sys.stderr)
            return 1
        return 1 if gaps else 0
    print(f"Wrote combined openapi.yaml for {len(slugs)} forms")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
