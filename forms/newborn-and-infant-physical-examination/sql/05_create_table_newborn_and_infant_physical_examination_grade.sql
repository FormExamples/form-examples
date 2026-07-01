-- Computed screening-classification result for a NIPE examination. The
-- engine classifies each of the four key components (eyes, heart, hips,
-- testes) as satisfactory, refer, or not-examined (testes may be
-- not-applicable for girls), then rolls the applicable components up into
-- an overall screening outcome (satisfactory / refer / incomplete) and a
-- completeness status and percentage. A screening classification records
-- whether onward referral is indicated; it is not a diagnosis.

CREATE TABLE newborn_and_infant_physical_examination_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    newborn_and_infant_physical_examination_id UUID NOT NULL UNIQUE
        REFERENCES newborn_and_infant_physical_examination(id) ON DELETE CASCADE,

    eyes_result VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (eyes_result IN ('satisfactory', 'refer', 'not-examined', '')),
    heart_result VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (heart_result IN ('satisfactory', 'refer', 'not-examined', '')),
    hips_result VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (hips_result IN ('satisfactory', 'refer', 'not-examined', '')),
    testes_result VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (testes_result IN ('satisfactory', 'refer', 'not-examined', 'not-applicable', '')),

    overall_outcome VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (overall_outcome IN ('satisfactory', 'refer', 'incomplete', '')),
    completeness VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (completeness IN ('complete', 'incomplete', '')),
    completeness_percent INTEGER,

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_newborn_and_infant_physical_examination_grade_updated_at
    BEFORE UPDATE ON newborn_and_infant_physical_examination_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE newborn_and_infant_physical_examination_grade IS
    'Computed screening-classification result for a NIPE examination: per-component results (eyes, heart, hips, testes), overall outcome (satisfactory/refer/incomplete), completeness status, and completeness percentage. A screening classification records whether onward referral is indicated; it is not a diagnosis.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade.newborn_and_infant_physical_examination_id IS
    'Foreign key to the parent examination (unique, 1:1).';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade.eyes_result IS
    'Eyes key-component result: satisfactory, refer, or not-examined.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade.heart_result IS
    'Heart key-component result: satisfactory, refer, or not-examined.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade.hips_result IS
    'Hips key-component result: satisfactory, refer, or not-examined.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade.testes_result IS
    'Testes key-component result: satisfactory, refer, not-examined, or not-applicable (for girls).';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade.overall_outcome IS
    'Overall screening outcome rolled up over the applicable key components: refer (any component refer), incomplete (any applicable component not-examined), or satisfactory.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade.completeness IS
    'Completeness status: complete when every applicable key component was examined, otherwise incomplete.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade.completeness_percent IS
    'Completeness percentage (0..100): applicable key components examined / total applicable key components x 100.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
