-- Computed validity result. 1:1 with lpa. Engine output produced by
-- calculate_lpa_validity() in the SvelteKit, static-HTML, and Rust
-- implementations. Engines share rule identifiers so this row is portable.

CREATE TABLE lpa_validity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    lpa_id UUID NOT NULL UNIQUE
        REFERENCES lpa(id) ON DELETE CASCADE,
    validity_status VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (validity_status IN (
            'ready-to-register',
            'needs-correction',
            'invalid',
            ''
        )),
    completeness_score INTEGER NOT NULL DEFAULT 0
        CHECK (completeness_score BETWEEN 0 AND 100),
    effective_date DATE,
    computed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    engine_version VARCHAR(20) NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT ''
);

CREATE INDEX index_lpa_validity_validity_status ON lpa_validity(validity_status);

CREATE TRIGGER trigger_lpa_validity_updated_at
    BEFORE UPDATE ON lpa_validity
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE lpa_validity IS
    'Computed validity result for an LPA. One row per LPA (1:1). Engine output is reproducible from the LPA inputs and engine_version.';
COMMENT ON COLUMN lpa_validity.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa_validity.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa_validity.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa_validity.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa_validity.lpa_id IS
    'Foreign key to the parent LPA (unique, 1:1).';
COMMENT ON COLUMN lpa_validity.validity_status IS
    'Overall status: ready-to-register, needs-correction, or invalid.';
COMMENT ON COLUMN lpa_validity.completeness_score IS
    'Percent of statutorily required fields populated, 0..100.';
COMMENT ON COLUMN lpa_validity.effective_date IS
    'Earliest date the LPA could be submitted to the OPG after the last fatal rule clears.';
COMMENT ON COLUMN lpa_validity.computed_at IS
    'Timestamp at which the engine last computed this result.';
COMMENT ON COLUMN lpa_validity.engine_version IS
    'Engine version used for the computation (semver). Lets a future result be recomputed deterministically.';
COMMENT ON COLUMN lpa_validity.notes IS
    'Human-readable engine notes.';
