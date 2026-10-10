CREATE TABLE uk_nhs_digital_technology_assessment_criteria_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    uk_nhs_digital_technology_assessment_criteria_id UUID NOT NULL UNIQUE REFERENCES uk_nhs_digital_technology_assessment_criteria(id) ON DELETE CASCADE,
    outcome VARCHAR(20) NOT NULL DEFAULT '' CHECK (outcome IN ('meets','conditional','does-not-meet','incomplete','')),
    mandatory_total INTEGER NOT NULL DEFAULT 0 CHECK (mandatory_total >= 0),
    mandatory_met INTEGER NOT NULL DEFAULT 0 CHECK (mandatory_met >= 0),
    advisory_total INTEGER NOT NULL DEFAULT 0 CHECK (advisory_total >= 0),
    advisory_met INTEGER NOT NULL DEFAULT 0 CHECK (advisory_met >= 0),
    section_a_result VARCHAR(15) NOT NULL DEFAULT '' CHECK (section_a_result IN ('met','partially-met','not-met','incomplete','')),
    section_b_result VARCHAR(15) NOT NULL DEFAULT '' CHECK (section_b_result IN ('met','partially-met','not-met','incomplete','')),
    section_c_result VARCHAR(15) NOT NULL DEFAULT '' CHECK (section_c_result IN ('met','partially-met','not-met','incomplete','')),
    section_d_result VARCHAR(15) NOT NULL DEFAULT '' CHECK (section_d_result IN ('met','partially-met','not-met','incomplete','')),
    section_e_result VARCHAR(15) NOT NULL DEFAULT '' CHECK (section_e_result IN ('met','partially-met','not-met','incomplete','')),
    section_f_result VARCHAR(15) NOT NULL DEFAULT '' CHECK (section_f_result IN ('met','partially-met','not-met','incomplete','')),
    section_g_result VARCHAR(15) NOT NULL DEFAULT '' CHECK (section_g_result IN ('met','partially-met','not-met','incomplete','')),
    assessor_override_reason VARCHAR(500) NOT NULL DEFAULT '',
    final_outcome VARCHAR(20) NOT NULL DEFAULT '' CHECK (final_outcome IN ('meets','conditional','does-not-meet','incomplete','')),
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_uk_nhs_digital_technology_assessment_criteria_grade_updated_at
    BEFORE UPDATE ON uk_nhs_digital_technology_assessment_criteria_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE uk_nhs_digital_technology_assessment_criteria_grade IS
    'Computed and signed-off DTAC outcome for an assessment.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade.uk_nhs_digital_technology_assessment_criteria_id IS
    'Foreign key to the uk_nhs_digital_technology_assessment_criteria table.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade.outcome IS
    'Overall DTAC outcome computed by the engine.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade.mandatory_total IS
    'Number of mandatory criteria that apply (not-applicable excluded).';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade.mandatory_met IS
    'Number of applicable mandatory criteria rated met.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade.advisory_total IS
    'Number of advisory criteria that apply.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade.advisory_met IS
    'Number of applicable advisory criteria rated met.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade.section_a_result IS
    'Section A (Company information) result.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade.section_b_result IS
    'Section B (Value proposition) result.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade.section_c_result IS
    'Section C (Clinical safety) result.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade.section_d_result IS
    'Section D (Data protection) result.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade.section_e_result IS
    'Section E (Technical security) result.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade.section_f_result IS
    'Section F (Interoperability) result.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade.section_g_result IS
    'Section G (Usability and accessibility) result.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade.assessor_override_reason IS
    'Reason the assessor''s final decision differs from the computed outcome.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade.final_outcome IS
    'Outcome signed off by the assessor.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade.signed_at IS
    'Timestamp when the assessor signed off.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria_grade.graded_at IS
    'Timestamp when the outcome was computed.';
