-- Computed and signed-off grading result for one health screening
-- questionnaire. Stores both the engine-computed values and the assessor-
-- final values with an override reason, so the override is auditable rather
-- than silent.

CREATE TABLE health_screening_questionnaire_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    health_screening_questionnaire_id UUID NOT NULL UNIQUE
        REFERENCES health_screening_questionnaire(id) ON DELETE CASCADE,

    parq_plus_clearance VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (parq_plus_clearance IN ('cleared', 'further-assessment-required', '')),

    audit_c_score INTEGER
        CHECK (audit_c_score IS NULL OR audit_c_score BETWEEN 0 AND 12),
    audit_c_band VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (audit_c_band IN ('low', 'increasing-risk', 'higher-risk', '')),

    computed_risk_band VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (computed_risk_band IN ('low', 'moderate', 'high', 'refer-urgently', '')),
    final_risk_band VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (final_risk_band IN ('low', 'moderate', 'high', 'refer-urgently', '')),

    computed_recommendation VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (computed_recommendation IN ('clear-to-proceed', 'routine-review', 'gp-review-required', 'refer-urgently', 'paediatric-pathway', '')),
    final_recommendation VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (final_recommendation IN ('clear-to-proceed', 'routine-review', 'gp-review-required', 'refer-urgently', 'paediatric-pathway', '')),

    override_reason VARCHAR(500) NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    signed_by_name VARCHAR(255) NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_health_screening_questionnaire_grade_updated_at
    BEFORE UPDATE ON health_screening_questionnaire_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE health_screening_questionnaire_grade IS
    'Computed and signed-off grading result for one health screening questionnaire. Stores both the engine-computed values and the assessor-final values with an override reason.';
COMMENT ON COLUMN health_screening_questionnaire_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN health_screening_questionnaire_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN health_screening_questionnaire_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN health_screening_questionnaire_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN health_screening_questionnaire_grade.health_screening_questionnaire_id IS
    'Foreign key to the health_screening_questionnaire table, unique because grading is one-to-one with the questionnaire.';
COMMENT ON COLUMN health_screening_questionnaire_grade.parq_plus_clearance IS
    'PAR-Q+ clearance status: cleared when all 7 general health items are no, further-assessment-required when any item is yes.';
COMMENT ON COLUMN health_screening_questionnaire_grade.audit_c_score IS
    'AUDIT-C total score, 0 to 12, being the sum of the three items.';
COMMENT ON COLUMN health_screening_questionnaire_grade.audit_c_band IS
    'AUDIT-C band: low, increasing-risk (score 5+ men / 4+ women), or higher-risk (score 8+).';
COMMENT ON COLUMN health_screening_questionnaire_grade.computed_risk_band IS
    'Composite risk band computed by the engine using the max-grade algorithm: low, moderate, high, or refer-urgently.';
COMMENT ON COLUMN health_screening_questionnaire_grade.final_risk_band IS
    'Composite risk band signed off by the assessor, which may equal or differ from the computed value.';
COMMENT ON COLUMN health_screening_questionnaire_grade.computed_recommendation IS
    'Referral recommendation computed by the engine from the risk band.';
COMMENT ON COLUMN health_screening_questionnaire_grade.final_recommendation IS
    'Referral recommendation signed off by the assessor, which may equal or differ from the computed value.';
COMMENT ON COLUMN health_screening_questionnaire_grade.override_reason IS
    'Reason the assessor set a final value differently from the computed value, mandatory when they differ.';
COMMENT ON COLUMN health_screening_questionnaire_grade.notes IS
    'Free-text assessor summary notes.';
COMMENT ON COLUMN health_screening_questionnaire_grade.signed_by_name IS
    'Name of the assessor who signed the questionnaire.';
COMMENT ON COLUMN health_screening_questionnaire_grade.signed_at IS
    'Timestamp of the assessor electronic signature.';
COMMENT ON COLUMN health_screening_questionnaire_grade.graded_at IS
    'Timestamp when the engine last computed the result.';
