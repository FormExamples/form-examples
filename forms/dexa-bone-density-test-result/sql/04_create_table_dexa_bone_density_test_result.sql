-- DEXA (dual-energy X-ray absorptiometry) bone-density result (report) — the source-of-truth record.

CREATE TABLE dexa_bone_density_test_result (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE CASCADE,

    -- Report identification
    originating_request_reference VARCHAR(255) NOT NULL DEFAULT '',
    report_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (report_status IN ('preliminary', 'final', 'amended', 'cancelled', '')),
    performed_date DATE,
    reported_date DATE,

    -- Examination
    scan_region VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (scan_region IN ('hip', 'spine', 'hip-and-spine', 'forearm', 'whole-body', 'other', '')),
    examination_adequacy VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (examination_adequacy IN ('adequate', 'limited', 'non-diagnostic', '')),

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Quantitative findings (BMD, T-scores, Z-scores)
    lumbar_spine_t_score NUMERIC(4,1)
        CHECK (lumbar_spine_t_score IS NULL OR lumbar_spine_t_score BETWEEN -10 AND 10),
    lumbar_spine_z_score NUMERIC(4,1)
        CHECK (lumbar_spine_z_score IS NULL OR lumbar_spine_z_score BETWEEN -10 AND 10),
    femoral_neck_t_score NUMERIC(4,1)
        CHECK (femoral_neck_t_score IS NULL OR femoral_neck_t_score BETWEEN -10 AND 10),
    femoral_neck_z_score NUMERIC(4,1)
        CHECK (femoral_neck_z_score IS NULL OR femoral_neck_z_score BETWEEN -10 AND 10),
    total_hip_t_score NUMERIC(4,1)
        CHECK (total_hip_t_score IS NULL OR total_hip_t_score BETWEEN -10 AND 10),
    lowest_t_score NUMERIC(4,1)
        CHECK (lowest_t_score IS NULL OR lowest_t_score BETWEEN -10 AND 10),
    bone_mineral_density_g_cm2 NUMERIC(5,3)
        CHECK (bone_mineral_density_g_cm2 IS NULL OR bone_mineral_density_g_cm2 BETWEEN 0 AND 5),

    -- Interpretation
    who_classification VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (who_classification IN ('normal', 'osteopenia', 'osteoporosis', 'severe-osteoporosis', '')),

    -- Fracture-risk (FRAX) outputs
    frax_major_fracture_percent NUMERIC(4,1)
        CHECK (frax_major_fracture_percent IS NULL OR frax_major_fracture_percent BETWEEN 0 AND 100),
    frax_hip_fracture_percent NUMERIC(4,1)
        CHECK (frax_hip_fracture_percent IS NULL OR frax_hip_fracture_percent BETWEEN 0 AND 100),

    -- Structured finding
    vertebral_fracture_identified BOOLEAN NOT NULL DEFAULT FALSE,

    -- Comparison with previous
    comparison_with_previous VARCHAR(1000) NOT NULL DEFAULT '',
    percent_change_since_previous NUMERIC(5,1)
        CHECK (percent_change_since_previous IS NULL OR percent_change_since_previous BETWEEN -100 AND 100),

    -- Impression and follow-up
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_dexa_bone_density_test_result_patient_id
    ON dexa_bone_density_test_result(patient_id);
CREATE INDEX index_dexa_bone_density_test_result_clinician_id
    ON dexa_bone_density_test_result(clinician_id);

CREATE TRIGGER trigger_dexa_bone_density_test_result_updated_at
    BEFORE UPDATE ON dexa_bone_density_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE dexa_bone_density_test_result IS
    'DEXA / DXA (dual-energy X-ray absorptiometry) bone-density result (report). Captures the performed examination, the clinical history, the quantitative findings (BMD in g/cm2, T-scores and Z-scores at the lumbar spine, femoral neck, and total hip, plus the lowest T-score), the WHO densitometric classification, FRAX 10-year fracture probabilities, vertebral-fracture identification, comparison with previous DEXA, the impression, and recommended follow-up. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN dexa_bone_density_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN dexa_bone_density_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN dexa_bone_density_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN dexa_bone_density_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN dexa_bone_density_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN dexa_bone_density_test_result.clinician_id IS
    'Foreign key to the reporting clinician (radiologist / consultant / reporting radiographer / rheumatologist / endocrinologist).';
COMMENT ON COLUMN dexa_bone_density_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating DEXA scan request (referral).';
COMMENT ON COLUMN dexa_bone_density_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN dexa_bone_density_test_result.performed_date IS
    'Date the DEXA examination was performed.';
COMMENT ON COLUMN dexa_bone_density_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN dexa_bone_density_test_result.scan_region IS
    'Examined DEXA scan region: hip, spine, hip-and-spine, forearm, whole-body, other.';
COMMENT ON COLUMN dexa_bone_density_test_result.examination_adequacy IS
    'Diagnostic adequacy of the examination: adequate, limited, non-diagnostic.';
COMMENT ON COLUMN dexa_bone_density_test_result.clinical_history IS
    'Clinical history and the question the examination was performed to answer.';
COMMENT ON COLUMN dexa_bone_density_test_result.lumbar_spine_t_score IS
    'Lumbar-spine T-score: standard deviations from young-adult reference mean (WHO classification input).';
COMMENT ON COLUMN dexa_bone_density_test_result.lumbar_spine_z_score IS
    'Lumbar-spine Z-score: standard deviations from age-matched reference mean (used in younger adults / children).';
COMMENT ON COLUMN dexa_bone_density_test_result.femoral_neck_t_score IS
    'Femoral-neck T-score: standard deviations from young-adult reference mean (reference site for WHO classification and FRAX).';
COMMENT ON COLUMN dexa_bone_density_test_result.femoral_neck_z_score IS
    'Femoral-neck Z-score: standard deviations from age-matched reference mean.';
COMMENT ON COLUMN dexa_bone_density_test_result.total_hip_t_score IS
    'Total-hip T-score: standard deviations from young-adult reference mean.';
COMMENT ON COLUMN dexa_bone_density_test_result.lowest_t_score IS
    'Lowest (most negative) T-score across the measured skeletal sites, which drives the WHO classification.';
COMMENT ON COLUMN dexa_bone_density_test_result.bone_mineral_density_g_cm2 IS
    'Areal bone mineral density (BMD) in g/cm2 at the reference site.';
COMMENT ON COLUMN dexa_bone_density_test_result.who_classification IS
    'WHO densitometric classification derived from the lowest T-score: normal, osteopenia, osteoporosis, severe-osteoporosis.';
COMMENT ON COLUMN dexa_bone_density_test_result.frax_major_fracture_percent IS
    'FRAX 10-year major osteoporotic fracture probability as a percentage (0-100).';
COMMENT ON COLUMN dexa_bone_density_test_result.frax_hip_fracture_percent IS
    'FRAX 10-year hip fracture probability as a percentage (0-100).';
COMMENT ON COLUMN dexa_bone_density_test_result.vertebral_fracture_identified IS
    'Whether one or more vertebral fractures were identified (e.g. on vertebral fracture assessment / lateral spine imaging).';
COMMENT ON COLUMN dexa_bone_density_test_result.comparison_with_previous IS
    'Comparison with the relevant previous DEXA examination.';
COMMENT ON COLUMN dexa_bone_density_test_result.percent_change_since_previous IS
    'Percentage change in BMD since the previous DEXA (positive = gain, negative = loss), for monitoring.';
COMMENT ON COLUMN dexa_bone_density_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN dexa_bone_density_test_result.recommended_follow_up IS
    'Recommended follow-up scan interval, referral, or management.';
COMMENT ON COLUMN dexa_bone_density_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer.';
COMMENT ON COLUMN dexa_bone_density_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
