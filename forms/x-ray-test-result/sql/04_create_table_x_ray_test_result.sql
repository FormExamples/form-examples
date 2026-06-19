-- Plain-radiograph (X-ray) result (report) — the source-of-truth record.

CREATE TABLE x_ray_test_result (
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
    body_region VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (body_region IN ('chest', 'abdomen', 'spine-cervical', 'spine-thoracic', 'spine-lumbar', 'pelvis', 'hip', 'knee', 'ankle-foot', 'shoulder', 'wrist-hand', 'skull', 'dental', 'other', '')),
    laterality VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (laterality IN ('left', 'right', 'bilateral', 'not-applicable', '')),
    projections VARCHAR(1000) NOT NULL DEFAULT '',
    examination_adequacy VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (examination_adequacy IN ('adequate', 'limited', 'non-diagnostic', '')),

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',
    comparison_with_previous VARCHAR(1000) NOT NULL DEFAULT '',

    -- Findings
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    fracture BOOLEAN NOT NULL DEFAULT FALSE,
    dislocation BOOLEAN NOT NULL DEFAULT FALSE,
    consolidation BOOLEAN NOT NULL DEFAULT FALSE,
    pneumothorax BOOLEAN NOT NULL DEFAULT FALSE,
    pleural_effusion BOOLEAN NOT NULL DEFAULT FALSE,
    foreign_body BOOLEAN NOT NULL DEFAULT FALSE,
    free_air BOOLEAN NOT NULL DEFAULT FALSE,
    bony_lesion BOOLEAN NOT NULL DEFAULT FALSE,
    incidental_finding BOOLEAN NOT NULL DEFAULT FALSE,

    -- Impression and follow-up
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(50) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_x_ray_test_result_patient_id
    ON x_ray_test_result(patient_id);
CREATE INDEX index_x_ray_test_result_clinician_id
    ON x_ray_test_result(clinician_id);

CREATE TRIGGER trigger_x_ray_test_result_updated_at
    BEFORE UPDATE ON x_ray_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE x_ray_test_result IS
    'Plain-radiograph (X-ray) result (report). Captures the performed examination (body region, laterality, projections, adequacy), clinical history, the narrative and structured findings, the impression and structured reporting category, recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN x_ray_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN x_ray_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN x_ray_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN x_ray_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN x_ray_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN x_ray_test_result.clinician_id IS
    'Foreign key to the reporting clinician (radiologist / reporting radiographer).';
COMMENT ON COLUMN x_ray_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating X-ray request (referral).';
COMMENT ON COLUMN x_ray_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN x_ray_test_result.performed_date IS
    'Date the X-ray examination was performed.';
COMMENT ON COLUMN x_ray_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN x_ray_test_result.body_region IS
    'Examined plain-radiograph body region: chest, abdomen, spine-cervical, spine-thoracic, spine-lumbar, pelvis, hip, knee, ankle-foot, shoulder, wrist-hand, skull, dental, other.';
COMMENT ON COLUMN x_ray_test_result.laterality IS
    'Laterality of the examined region: left, right, bilateral, not-applicable.';
COMMENT ON COLUMN x_ray_test_result.projections IS
    'Radiographic projections / views acquired (e.g. PA and lateral, AP, oblique) and any technique notes.';
COMMENT ON COLUMN x_ray_test_result.examination_adequacy IS
    'Diagnostic adequacy of the examination: adequate, limited, non-diagnostic.';
COMMENT ON COLUMN x_ray_test_result.clinical_history IS
    'Clinical history and the question the examination was performed to answer.';
COMMENT ON COLUMN x_ray_test_result.comparison_with_previous IS
    'Comparison with relevant previous imaging studies.';
COMMENT ON COLUMN x_ray_test_result.findings_narrative IS
    'Narrative description of the imaging findings (the body of the report).';
COMMENT ON COLUMN x_ray_test_result.fracture IS
    'Whether a fracture is present.';
COMMENT ON COLUMN x_ray_test_result.dislocation IS
    'Whether a joint dislocation or subluxation is present.';
COMMENT ON COLUMN x_ray_test_result.consolidation IS
    'Whether pulmonary consolidation (e.g. pneumonia) is present.';
COMMENT ON COLUMN x_ray_test_result.pneumothorax IS
    'Whether a pneumothorax is present (critical finding).';
COMMENT ON COLUMN x_ray_test_result.pleural_effusion IS
    'Whether a pleural effusion is present.';
COMMENT ON COLUMN x_ray_test_result.foreign_body IS
    'Whether a foreign body is present.';
COMMENT ON COLUMN x_ray_test_result.free_air IS
    'Whether free intraperitoneal air (pneumoperitoneum) is present (critical finding).';
COMMENT ON COLUMN x_ray_test_result.bony_lesion IS
    'Whether a focal bony lesion (e.g. lytic / sclerotic lesion) is present.';
COMMENT ON COLUMN x_ray_test_result.incidental_finding IS
    'Whether one or more incidental findings warranting documentation are present.';
COMMENT ON COLUMN x_ray_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN x_ray_test_result.reporting_category IS
    'Free-text structured-reporting label (e.g. normal / abnormal-acute / abnormal-chronic).';
COMMENT ON COLUMN x_ray_test_result.recommended_follow_up IS
    'Recommended follow-up imaging, referral, or management.';
COMMENT ON COLUMN x_ray_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer.';
COMMENT ON COLUMN x_ray_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
