#!/usr/bin/env python3
"""Insert rustdoc on undocumented `pub` items in the Loco back-end crates.

Idempotent: skips items that already carry a doc comment. Operates line-by-line
with brace/context tracking so struct fields and enum variants are distinguished
from top-level items, and so function bodies are never touched.
"""
import os
import re
import sys

ACRONYMS = {
    "nhs": "NHS", "gp": "GP", "dob": "DOB", "id": "ID", "ids": "IDs",
    "lpa": "LPA", "url": "URL", "uri": "URI", "api": "API", "json": "JSON",
    "sql": "SQL", "html": "HTML", "pdf": "PDF", "icd": "ICD", "bmi": "BMI",
    "bp": "BP", "ecg": "ECG", "dvt": "DVT", "iv": "IV", "uuid": "UUID",
    "dnacpr": "DNACPR", "ews": "EWS", "los": "LOS", "hr": "HR", "rr": "RR",
    "spo2": "SpO2", "gcs": "GCS", "tnm": "TNM", "ct": "CT", "mri": "MRI",
}

KEYWORDS = {"fn", "struct", "enum", "mod", "trait", "type", "const",
            "static", "use", "impl", "union", "let", "match", "if", "for",
            "while", "loop", "return", "self", "super", "crate", "pub"}


def humanize(ident):
    parts = []
    for token in ident.split("_"):
        token = re.sub(r"([a-z0-9])([A-Z])", r"\1 \2", token)
        token = re.sub(r"([A-Z]+)([A-Z][a-z])", r"\1 \2", token)
        parts.extend(p for p in token.split() if p)
    words = []
    for i, w in enumerate(parts):
        lw = w.lower()
        if lw in ACRONYMS:
            words.append(ACRONYMS[lw])
        elif i == 0:
            words.append(w[:1].upper() + w[1:])
        else:
            words.append(lw)
    return " ".join(words) if words else ident


def title_from_slug(slug):
    small = {"to", "of", "and", "with", "by", "for", "the", "a", "an", "in", "on"}
    out = []
    for i, w in enumerate(slug.split("-")):
        if w in ACRONYMS:
            out.append(ACRONYMS[w])
        elif i > 0 and w in small:
            out.append(w)
        else:
            out.append(w[:1].upper() + w[1:])
    return " ".join(out)


def clean(line):
    """Strip string/char literals and line comments for structural analysis."""
    s = re.sub(r'"(\\.|[^"\\])*"', '""', line)
    s = re.sub(r"'(\\.|[^'\\])'", "''", s)
    idx = s.find("//")
    if idx != -1:
        s = s[:idx]
    return s


FIELD_RE = re.compile(r"^pub\s+([A-Za-z_]\w*)\s*:")
VARIANT_RE = re.compile(r"^([A-Z][A-Za-z0-9_]*)\s*(?:[,({=]|$)")
FN_RE = re.compile(
    r"^pub\s+(?:async\s+|unsafe\s+|const\s+|extern\s+(?:\"[^\"]*\"\s+)?)*fn\s+(\w+)")
ITEM_RES = [
    ("struct", re.compile(r"^pub\s+struct\s+(\w+)")),
    ("enum", re.compile(r"^pub\s+enum\s+(\w+)")),
    ("trait", re.compile(r"^pub\s+trait\s+(\w+)")),
    ("union", re.compile(r"^pub\s+union\s+(\w+)")),
    ("type", re.compile(r"^pub\s+type\s+(\w+)")),
    ("const", re.compile(r"^pub\s+const\s+(\w+)")),
    ("static", re.compile(r"^pub\s+static\s+(?:ref\s+)?(\w+)")),
    ("mod", re.compile(r"^pub\s+mod\s+(\w+)")),
]


def doc_for(kind, name):
    h = humanize(name)
    if kind == "field":
        return f"{h}."
    if kind == "variant":
        return f"{h}."
    if kind == "fn":
        return f"{h}."
    if kind in ("struct", "union"):
        return f"{h}."
    if kind == "enum":
        return f"{h}."
    if kind == "type":
        return f"{h}."
    if kind in ("const", "static"):
        return f"{h}."
    if kind == "trait":
        return f"{h}."
    if kind == "mod":
        return f"{h} module."
    return f"{h}."


def split_top_commas(s):
    parts, depth, cur = [], 0, ""
    for ch in s:
        if ch in "([<":
            depth += 1
        elif ch in ")]>":
            depth -= 1
        if ch == "," and depth == 0:
            parts.append(cur)
            cur = ""
        else:
            cur += ch
    parts.append(cur)
    return parts


ENUM_DECL_RE = re.compile(r"(?m)^([ \t]*)pub enum\s+(\w+)([^{}\n]*)\{")
_DOC_STARTS = ("///", "//!", "/**", "/*!", "#[doc")


def normalize_enums(text):
    """Put each `pub enum` variant on its own documented line.

    Preserves existing per-variant doc comments and attributes. Skips enums
    whose body contains `{` (struct-style variants) to avoid mangling them.
    """
    out = []
    pos = 0
    n = len(text)
    while True:
        m = ENUM_DECL_RE.search(text, pos)
        if not m:
            out.append(text[pos:])
            break
        indent, name, generics = m.group(1), m.group(2), m.group(3)
        bstart = m.end() - 1
        depth = 0
        j = bstart
        while j < n:
            c = text[j]
            if c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    break
            j += 1
        if j >= n:  # unbalanced; bail out safely
            out.append(text[pos:])
            break
        body = text[bstart + 1:j]
        # Skip struct-style variants and attributed variants (e.g. SeaORM
        # `#[sea_orm(...)]` relations); the line pass documents those safely.
        if "{" in body or "#[" in body:
            out.append(text[pos:j + 1])
            pos = j + 1
            continue
        vindent = indent + "    "
        rendered = []
        for entry in split_top_commas(body):
            elines = [ln.strip() for ln in entry.split("\n")]
            elines = [ln for ln in elines if ln]
            if not elines:
                continue
            variant_lines = [ln for ln in elines
                             if not (ln.startswith(_DOC_STARTS) or ln.startswith("#[")
                                     or ln.startswith("//"))]
            variant = " ".join(variant_lines).strip()
            if not variant:
                continue
            documented = any(ln.startswith(_DOC_STARTS) for ln in elines)
            block = []
            if not documented:
                nm = re.match(r"(\w+)", variant)
                doc = humanize(nm.group(1)) if nm else variant
                block.append(f"{vindent}/// {doc}.")
            for ln in elines:
                if ln in variant_lines:
                    continue
                block.append(f"{vindent}{ln}")
            block.append(f"{vindent}{variant},")
            rendered.append("\n".join(block))
        if not rendered:  # empty enum: leave as-is
            out.append(text[pos:j + 1])
            pos = j + 1
            continue
        new_block = (f"{indent}pub enum {name}{generics}{{\n"
                     + "\n".join(rendered) + f"\n{indent}}}")
        out.append(text[pos:m.start()])
        out.append(new_block)
        pos = j + 1
    return "".join(out)


STRUCT_INLINE_RE = re.compile(
    r"(?m)^([ \t]*)pub struct\s+(\w+)([^{}\n;]*)\{([^{}\n]*)\}([^\n]*)$")


def normalize_inline_structs(text):
    """Expand single-line `pub struct X { pub a: T, pub b: U }` field-per-line."""
    def repl(m):
        indent, name, generics, body, tail = m.groups()
        if "#[" in body:
            return m.group(0)
        fields = [f.strip() for f in split_top_commas(body) if f.strip()]
        if not fields:
            return m.group(0)  # empty struct: item pass documents the struct
        lines = [f"{indent}pub struct {name}{generics}{{"]
        fi = indent + "    "
        for f in fields:
            mm = re.match(r"(?:pub\s+)?([A-Za-z_]\w*)\s*:", f)
            doc = humanize(mm.group(1)) if mm else f
            lines.append(f"{fi}/// {doc}.")
            lines.append(f"{fi}{f},")
        lines.append(f"{indent}}}{tail}")
        return "\n".join(lines)

    return STRUCT_INLINE_RE.sub(repl, text)


def is_doc_or_comment(stripped):
    return stripped.startswith("///") or stripped.startswith("//!") or \
        stripped.startswith("/**") or stripped.startswith("/*!")


def is_attr(stripped):
    return stripped.startswith("#[") or stripped.startswith("#!")


def strip_leading_attrs(cs):
    while True:
        m = re.match(r"#!?\[[^\]]*\]\s*", cs)
        if not m:
            return cs
        cs = cs[m.end():]


def is_pure_attr_line(stripped):
    """True if the line is only attribute(s) with no item following them."""
    return is_attr(stripped) and strip_leading_attrs(stripped) == ""


def insert_item_docs(lines):
    out = []
    depth = 0
    stack = []  # kinds of open blocks, innermost last

    def in_fn_body():
        return "fn" in stack

    for raw in lines:
        stripped = raw.strip()
        c = clean(raw)
        cs = c.strip()
        indent = raw[: len(raw) - len(raw.lstrip())]
        ctx = stack[-1] if stack else None

        ci = strip_leading_attrs(cs)  # cleaned line with leading attributes removed
        doc = None
        if stripped and not is_doc_or_comment(stripped) and not is_pure_attr_line(stripped) \
                and not in_fn_body():
            if ctx == "struct":
                m = FIELD_RE.match(ci)
                if m and m.group(1) not in KEYWORDS:
                    doc = ("field", m.group(1))
            elif ctx == "enum":
                m = VARIANT_RE.match(ci)
                if m and m.group(1) not in KEYWORDS and not ci.startswith("pub"):
                    doc = ("variant", m.group(1))
            if doc is None and ctx in (None, "mod", "impl", "trait", "block"):
                m = FN_RE.match(ci)
                if m:
                    doc = ("fn", m.group(1))
                else:
                    for kind, rx in ITEM_RES:
                        if kind == "mod":
                            continue  # modules documented via //! headers
                        mm = rx.match(ci)
                        if mm:
                            doc = (kind, mm.group(1))
                            break

        if doc is not None:
            pos = len(out)
            while pos > 0 and is_pure_attr_line(out[pos - 1].strip()):
                pos -= 1
            already = pos > 0 and is_doc_or_comment(out[pos - 1].strip())
            if not already:
                out.insert(pos, f"{indent}/// {doc_for(*doc)}\n")

        out.append(raw)

        # update brace context using cleaned line
        opens = c.count("{")
        closes = c.count("}")
        if opens > closes:
            kind = "block"
            if re.search(r"\bstruct\b", c):
                kind = "struct"
            elif re.search(r"\benum\b", c):
                kind = "enum"
            elif re.search(r"\bfn\b", c):
                kind = "fn"
            elif re.search(r"\bimpl\b", c):
                kind = "impl"
            elif re.search(r"\btrait\b", c):
                kind = "trait"
            elif re.search(r"\bmod\b", c):
                kind = "mod"
            stack.append(kind)
            for _ in range(opens - closes - 1):
                stack.append("block")
        elif closes > opens:
            for _ in range(closes - opens):
                if stack:
                    stack.pop()
        depth += opens - closes
    return out


MODULE_DOCS = {
    "app.rs": "Loco application hooks: route registration, workers, tasks, and lifecycle.",
    "controllers/mod.rs": "HTTP controllers for the JSON API.",
    "controllers/assessment.rs": "Assessment CRUD endpoints under `/api/assessments`.",
    "controllers/dashboard.rs": "Dashboard listing endpoints under `/api/dashboard`.",
    "engine/mod.rs": "Scoring and grading engine (pure, side-effect-free functions).",
    "engine/types.rs": "Serde data types for the assessment payload and grading result.",
    "engine/utils.rs": "Helper predicates and counters used by the grader.",
    "engine/completeness_grader.rs": "Completeness grader: evaluates rules against the payload.",
    "engine/completeness_rules.rs": "Catalogue of completeness rules.",
    "engine/flagged_issues.rs": "Detection of additional flagged issues.",
    "models/mod.rs": "Database models and their query helpers.",
    "models/assessments.rs": "`assessments` model: constructors and query helpers.",
    "models/_entities/mod.rs": "SeaORM-generated entity modules.",
    "models/_entities/prelude.rs": "Entity prelude re-exports (generated).",
}


def module_doc_for(relpath):
    if relpath in MODULE_DOCS:
        return MODULE_DOCS[relpath]
    base = os.path.basename(relpath)
    if relpath.startswith("models/_entities/"):
        ent = base[:-3]
        return f"SeaORM entity for the `{ent}` table (generated)."
    if base == "mod.rs":
        parent = os.path.basename(os.path.dirname(relpath)) or "crate"
        return f"{humanize(parent)} module."
    return f"{humanize(base[:-3])} module."


def ensure_module_header(lines, relpath):
    for ln in lines:
        s = ln.strip()
        if not s:
            continue
        if s.startswith("//!"):
            return lines  # already has an inner doc
        # a regular comment, attribute, or code: insert header before it
        break
    header = [f"//! {module_doc_for(relpath)}\n", "\n"]
    return header + lines


def crate_ident(cargo_toml):
    in_pkg = False
    with open(cargo_toml) as f:
        for line in f:
            s = line.strip()
            if s.startswith("[package]"):
                in_pkg = True
                continue
            if s.startswith("[") and s != "[package]":
                in_pkg = False
            if in_pkg:
                m = re.match(r'name\s*=\s*"([^"]+)"', s)
                if m:
                    return m.group(1).replace("-", "_"), m.group(1)
    return None, None


def has_default_assessment_data(src_dir):
    p = os.path.join(src_dir, "engine", "types.rs")
    if not os.path.exists(p):
        return False
    txt = open(p).read()
    m = re.search(r"((?:#\[[^\]]*\]\s*)+)pub struct AssessmentData\b", txt)
    return bool(m and "Default" in m.group(1))


def build_crate_doc(slug, src_dir, ident):
    title = title_from_slug(slug)
    lines = [
        f"//! {title} — Loco JSON API back-end.\n",
        "//!\n",
        f"//! Server-side JSON API for the **{title}** medical form, built on the\n",
        "//! [Loco](https://loco.rs) framework (axum + SeaORM). Each submission is\n",
        "//! persisted as a row whose `data` column holds the questionnaire payload\n",
        "//! and whose `result` column holds the grading output produced by the\n",
        "//! grading engine.\n",
        "//!\n",
    ]
    if os.path.exists(os.path.join(src_dir, "controllers", "assessment.rs")):
        lines += [
            "//! # HTTP API\n",
            "//!\n",
            "//! ```text\n",
            "//! POST   /api/assessments              create a draft (returns JSON)\n",
            "//! GET    /api/assessments              list assessments (newest first)\n",
            "//! GET    /api/assessments/{id}         fetch one assessment\n",
            "//! PATCH  /api/assessments/{id}         merge a partial payload into `data`\n",
            "//! POST   /api/assessments/{id}/submit  mark the assessment completed\n",
            "//! GET    /api/assessments/{id}/result  fetch the stored grading result\n",
            "//! GET    /api/dashboard                list completed assessments\n",
            "//! ```\n",
            "//!\n",
        ]
    lines += ["//! # Example\n", "//!\n"]
    if ident and has_default_assessment_data(src_dir) and \
            os.path.exists(os.path.join(src_dir, "engine", "types.rs")):
        lines += [
            "//! ```\n",
            f"//! use {ident}::engine::types::AssessmentData;\n",
            "//!\n",
            "//! // A fresh draft starts with every section empty.\n",
            "//! let data = AssessmentData::default();\n",
            "//! let json = serde_json::to_value(&data).unwrap();\n",
            "//! assert!(json.is_object());\n",
            "//! ```\n",
        ]
    else:
        lines += [
            "//! ```text\n",
            "//! // Construct the form payload as JSON and POST it to the API,\n",
            "//! // then submit it to obtain the grading result.\n",
            "//! ```\n",
        ]
    lines.append("//!\n")
    return lines


def process_lib_rs(path, slug, src_dir, ident):
    text = normalize_inline_structs(normalize_enums(open(path).read()))
    lines = text.splitlines(keepends=True)
    if any(l.startswith("//!") for l in lines[:40]):
        # already has crate doc; only run item pass
        out = insert_item_docs(lines)
    else:
        crate_doc = build_crate_doc(slug, src_dir, ident)
        out = crate_doc + insert_item_docs(lines)
    open(path, "w").write("".join(out))


def process_module(path, relpath):
    text = normalize_inline_structs(normalize_enums(open(path).read()))
    lines = text.splitlines(keepends=True)
    lines = insert_item_docs(lines)
    lines = ensure_module_header(lines, relpath)
    open(path, "w").write("".join(lines))


def process_crate(crate_dir):
    slug = os.path.basename(os.path.dirname(crate_dir))
    src_dir = os.path.join(crate_dir, "src")
    # Route layout: crate source lives in src/<form_snake_case>/ rather than
    # directly under src/. Descend into it so lib.rs / controllers / engine
    # resolve correctly.
    routed = os.path.join(src_dir, slug.replace("-", "_"))
    if os.path.isfile(os.path.join(routed, "lib.rs")):
        src_dir = routed
    if not os.path.isdir(src_dir):
        return False
    cargo = os.path.join(crate_dir, "Cargo.toml")
    ident, _ = crate_ident(cargo) if os.path.exists(cargo) else (None, None)
    for root, _dirs, files in os.walk(src_dir):
        for fn in sorted(files):
            if not fn.endswith(".rs"):
                continue
            path = os.path.join(root, fn)
            relpath = os.path.relpath(path, src_dir)
            if relpath == "lib.rs":
                process_lib_rs(path, slug, src_dir, ident)
            else:
                process_module(path, relpath)
    return True


def main():
    targets = sys.argv[1:]
    if not targets:
        print("usage: gen_rust_docs.py <crate_dir> [<crate_dir> ...]")
        sys.exit(1)
    n = 0
    for t in targets:
        if process_crate(t):
            n += 1
            print(f"documented {t}")
    print(f"done: {n} crates")


if __name__ == "__main__":
    main()
