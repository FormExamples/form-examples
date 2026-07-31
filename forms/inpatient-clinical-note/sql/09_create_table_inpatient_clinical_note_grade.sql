-- Computed grading result for an inpatient clinical note. Carries both
-- engines: the documentation-completeness status over the note-type-specific
-- required-component set, and the max-band clinical acuity band. The
-- completeness status is a mechanical property of the record and is never
-- overridable; the acuity band is overridable by the author, in which case
-- computed_acuity_band retains what the engine computed.

CREATE TABLE inpatient_clinical_note_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    inpatient_clinical_note_id UUID NOT NULL UNIQUE
        REFERENCES inpatient_clinical_note(id) ON DELETE CASCADE,

    status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (status IN ('complete', 'partial', 'incomplete', '')),
    completeness_percent INTEGER
        CHECK (completeness_percent IS NULL OR (completeness_percent >= 0 AND completeness_percent <= 100)),
    required_component_count INTEGER,
    documented_component_count INTEGER,

    acuity_band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (acuity_band IN ('stable', 'watch', 'escalate', 'critical', '')),
    computed_acuity_band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (computed_acuity_band IN ('stable', 'watch', 'escalate', 'critical', '')),
    news2_total INTEGER
        CHECK (news2_total IS NULL OR (news2_total >= 0 AND news2_total <= 20)),

    header_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (header_documented IN ('yes', 'no', '')),
    interval_history_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (interval_history_documented IN ('yes', 'no', '')),
    observations_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (observations_documented IN ('yes', 'no', '')),
    examination_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (examination_documented IN ('yes', 'no', '')),
    investigations_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (investigations_documented IN ('yes', 'no', '')),
    problems_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (problems_documented IN ('yes', 'no', '')),
    medications_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (medications_documented IN ('yes', 'no', '')),
    risk_assessments_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (risk_assessments_documented IN ('yes', 'no', '')),
    impression_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (impression_documented IN ('yes', 'no', '')),
    plan_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (plan_documented IN ('yes', 'no', '')),
    escalation_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (escalation_documented IN ('yes', 'no', '')),
    communication_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (communication_documented IN ('yes', 'no', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_inpatient_clinical_note_grade_updated_at
    BEFORE UPDATE ON inpatient_clinical_note_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE inpatient_clinical_note_grade IS
    'Computed grading result for an inpatient clinical note: documentation-completeness status and percentage over the note-type-specific required-component set, max-band clinical acuity band, NEWS2 aggregate, and per-component presence flags.';
COMMENT ON COLUMN inpatient_clinical_note_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN inpatient_clinical_note_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN inpatient_clinical_note_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN inpatient_clinical_note_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN inpatient_clinical_note_grade.inpatient_clinical_note_id IS
    'Foreign key to the parent inpatient clinical note (unique, 1:1).';
COMMENT ON COLUMN inpatient_clinical_note_grade.status IS
    'Completeness status: complete, partial, or incomplete. Never overridable: it is a mechanical property of the record, not a clinical judgement.';
COMMENT ON COLUMN inpatient_clinical_note_grade.completeness_percent IS
    'Completeness percentage (0..100): documented required components / required components x 100, rounded.';
COMMENT ON COLUMN inpatient_clinical_note_grade.required_component_count IS
    'Number of components required for this note type. Varies from 9 to 11 by note type.';
COMMENT ON COLUMN inpatient_clinical_note_grade.documented_component_count IS
    'Number of required components actually documented.';
COMMENT ON COLUMN inpatient_clinical_note_grade.acuity_band IS
    'Final clinical acuity band: stable, watch, escalate, or critical. Equals computed_acuity_band unless the author recorded an override.';
COMMENT ON COLUMN inpatient_clinical_note_grade.computed_acuity_band IS
    'Acuity band as computed by the max-band engine, retained so that an author override is visible in audit.';
COMMENT ON COLUMN inpatient_clinical_note_grade.news2_total IS
    'NEWS2 aggregate the acuity band was computed from, 0..20.';
COMMENT ON COLUMN inpatient_clinical_note_grade.header_documented IS
    'Whether the header component is documented (yes/no).';
COMMENT ON COLUMN inpatient_clinical_note_grade.interval_history_documented IS
    'Whether the interval-history component is documented (yes/no).';
COMMENT ON COLUMN inpatient_clinical_note_grade.observations_documented IS
    'Whether the observations component is documented (yes/no).';
COMMENT ON COLUMN inpatient_clinical_note_grade.examination_documented IS
    'Whether the examination component is documented (yes/no).';
COMMENT ON COLUMN inpatient_clinical_note_grade.investigations_documented IS
    'Whether the investigations component is documented (yes/no).';
COMMENT ON COLUMN inpatient_clinical_note_grade.problems_documented IS
    'Whether the problems component is documented (yes/no).';
COMMENT ON COLUMN inpatient_clinical_note_grade.medications_documented IS
    'Whether the medications component is documented (yes/no).';
COMMENT ON COLUMN inpatient_clinical_note_grade.risk_assessments_documented IS
    'Whether the risk-assessments component is documented (yes/no).';
COMMENT ON COLUMN inpatient_clinical_note_grade.impression_documented IS
    'Whether the impression component is documented (yes/no).';
COMMENT ON COLUMN inpatient_clinical_note_grade.plan_documented IS
    'Whether the plan component is documented (yes/no).';
COMMENT ON COLUMN inpatient_clinical_note_grade.escalation_documented IS
    'Whether the escalation component is documented (yes/no).';
COMMENT ON COLUMN inpatient_clinical_note_grade.communication_documented IS
    'Whether the communication component is documented (yes/no).';
COMMENT ON COLUMN inpatient_clinical_note_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
