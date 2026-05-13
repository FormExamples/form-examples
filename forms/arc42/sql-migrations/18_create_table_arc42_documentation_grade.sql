-- Grading result for an arc42 documentation snapshot — computed maturity, final maturity, and per-section completeness.

CREATE TABLE arc42_documentation_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    arc42_documentation_id UUID NOT NULL UNIQUE REFERENCES arc42_documentation(id) ON DELETE CASCADE,
    computed_maturity TEXT NOT NULL DEFAULT '' CHECK (computed_maturity IN ('draft', 'reviewable', 'ready', 'mature', '')),
    final_maturity TEXT NOT NULL DEFAULT '' CHECK (final_maturity IN ('draft', 'reviewable', 'ready', 'mature', '')),
    override_reason TEXT NOT NULL DEFAULT '',

    completeness_section_1 TEXT NOT NULL DEFAULT '' CHECK (completeness_section_1 IN ('empty', 'partial', 'complete', '')),
    completeness_section_2 TEXT NOT NULL DEFAULT '' CHECK (completeness_section_2 IN ('empty', 'partial', 'complete', '')),
    completeness_section_3 TEXT NOT NULL DEFAULT '' CHECK (completeness_section_3 IN ('empty', 'partial', 'complete', '')),
    completeness_section_4 TEXT NOT NULL DEFAULT '' CHECK (completeness_section_4 IN ('empty', 'partial', 'complete', '')),
    completeness_section_5 TEXT NOT NULL DEFAULT '' CHECK (completeness_section_5 IN ('empty', 'partial', 'complete', '')),
    completeness_section_6 TEXT NOT NULL DEFAULT '' CHECK (completeness_section_6 IN ('empty', 'partial', 'complete', '')),
    completeness_section_7 TEXT NOT NULL DEFAULT '' CHECK (completeness_section_7 IN ('empty', 'partial', 'complete', '')),
    completeness_section_8 TEXT NOT NULL DEFAULT '' CHECK (completeness_section_8 IN ('empty', 'partial', 'complete', '')),
    completeness_section_9 TEXT NOT NULL DEFAULT '' CHECK (completeness_section_9 IN ('empty', 'partial', 'complete', '')),
    completeness_section_10 TEXT NOT NULL DEFAULT '' CHECK (completeness_section_10 IN ('empty', 'partial', 'complete', '')),
    completeness_section_11 TEXT NOT NULL DEFAULT '' CHECK (completeness_section_11 IN ('empty', 'partial', 'complete', '')),
    completeness_section_12 TEXT NOT NULL DEFAULT '' CHECK (completeness_section_12 IN ('empty', 'partial', 'complete', ''))
);

CREATE TRIGGER trigger_arc42_documentation_grade_updated_at
    BEFORE UPDATE ON arc42_documentation_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE arc42_documentation_grade IS 'Grading result for an arc42 documentation snapshot: computed and final maturity band plus per-section completeness.';
COMMENT ON COLUMN arc42_documentation_grade.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN arc42_documentation_grade.created_at IS 'Timestamp when the record was created.';
COMMENT ON COLUMN arc42_documentation_grade.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN arc42_documentation_grade.deleted_at IS 'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN arc42_documentation_grade.arc42_documentation_id IS 'Parent documentation (1:1, cascade-deleted).';
COMMENT ON COLUMN arc42_documentation_grade.computed_maturity IS 'Maturity band computed by the scoring engine: draft, reviewable, ready, or mature.';
COMMENT ON COLUMN arc42_documentation_grade.final_maturity IS 'Final maturity band after any author override; equals computed_maturity when no override is applied.';
COMMENT ON COLUMN arc42_documentation_grade.override_reason IS 'Author-provided reason when final_maturity differs from computed_maturity.';
COMMENT ON COLUMN arc42_documentation_grade.completeness_section_1 IS '§1 Introduction & Goals completeness: empty, partial, or complete.';
COMMENT ON COLUMN arc42_documentation_grade.completeness_section_2 IS '§2 Constraints completeness: empty, partial, or complete.';
COMMENT ON COLUMN arc42_documentation_grade.completeness_section_3 IS '§3 Context & Scope completeness: empty, partial, or complete.';
COMMENT ON COLUMN arc42_documentation_grade.completeness_section_4 IS '§4 Solution Strategy completeness: empty, partial, or complete.';
COMMENT ON COLUMN arc42_documentation_grade.completeness_section_5 IS '§5 Building Block View completeness: empty, partial, or complete.';
COMMENT ON COLUMN arc42_documentation_grade.completeness_section_6 IS '§6 Runtime View completeness: empty, partial, or complete.';
COMMENT ON COLUMN arc42_documentation_grade.completeness_section_7 IS '§7 Deployment View completeness: empty, partial, or complete.';
COMMENT ON COLUMN arc42_documentation_grade.completeness_section_8 IS '§8 Crosscutting Concepts completeness: empty, partial, or complete.';
COMMENT ON COLUMN arc42_documentation_grade.completeness_section_9 IS '§9 Architectural Decisions completeness: empty, partial, or complete.';
COMMENT ON COLUMN arc42_documentation_grade.completeness_section_10 IS '§10 Quality Requirements completeness: empty, partial, or complete.';
COMMENT ON COLUMN arc42_documentation_grade.completeness_section_11 IS '§11 Risks & Technical Debt completeness: empty, partial, or complete.';
COMMENT ON COLUMN arc42_documentation_grade.completeness_section_12 IS '§12 Glossary completeness: empty, partial, or complete.';
