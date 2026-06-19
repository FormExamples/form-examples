-- Breast mammography imaging request (referral) — the source-of-truth record.

CREATE TABLE mammography_test_request (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE CASCADE,

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'vetted', 'scheduled', 'rejected', '')),
    site_name VARCHAR(255) NOT NULL DEFAULT '',
    setting VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (setting IN ('outpatient', 'inpatient', 'community', 'screening-unit', 'emergency', '')),
    referral_date DATE,
    requested_by_date DATE,

    -- Requested examination
    exam_type VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (exam_type IN ('screening', 'diagnostic', 'symptomatic', 'surveillance', 'other', '')),
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('routine-screening', 'breast-lump', 'breast-pain', 'nipple-discharge', 'skin-change', 'family-history', 'follow-up-known-cancer', 'post-treatment-surveillance', 'recall-from-screening', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',
    laterality VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (laterality IN ('left', 'right', 'bilateral', 'not-applicable', '')),

    -- Symptoms
    symptom_lump BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_pain BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_nipple_discharge BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_skin_change BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_nipple_inversion BOOLEAN NOT NULL DEFAULT FALSE,

    -- History / risk
    previous_mammogram VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (previous_mammogram IN ('none', 'normal', 'abnormal', 'unknown', '')),
    previous_mammogram_date DATE,
    family_history_breast_cancer BOOLEAN NOT NULL DEFAULT FALSE,
    breast_implants BOOLEAN NOT NULL DEFAULT FALSE,
    pregnancy_or_lactating VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (pregnancy_or_lactating IN ('no', 'pregnant', 'lactating', 'unknown', '')),
    hormone_replacement_therapy BOOLEAN NOT NULL DEFAULT FALSE,

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'two-week-wait', 'emergency', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_mammography_test_request_patient_id
    ON mammography_test_request(patient_id);
CREATE INDEX index_mammography_test_request_clinician_id
    ON mammography_test_request(clinician_id);

CREATE TRIGGER trigger_mammography_test_request_updated_at
    BEFORE UPDATE ON mammography_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE mammography_test_request IS
    'Breast mammography imaging request (referral). Captures the requested examination, the clinical indication and question, symptoms, breast history / risk factors, and triage urgency.';
COMMENT ON COLUMN mammography_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN mammography_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN mammography_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN mammography_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN mammography_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN mammography_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN mammography_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN mammography_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN mammography_test_request.setting IS
    'Care setting: outpatient, inpatient, community, screening-unit, emergency.';
COMMENT ON COLUMN mammography_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN mammography_test_request.requested_by_date IS
    'Date by which the examination is requested to be performed.';
COMMENT ON COLUMN mammography_test_request.exam_type IS
    'Type of mammography requested: screening, diagnostic, symptomatic, surveillance, other.';
COMMENT ON COLUMN mammography_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN mammography_test_request.clinical_question IS
    'Specific clinical question the examination should answer (highest-value field).';
COMMENT ON COLUMN mammography_test_request.relevant_history IS
    'Relevant medical, surgical, and breast history.';
COMMENT ON COLUMN mammography_test_request.laterality IS
    'Affected side: left, right, bilateral, not-applicable.';
COMMENT ON COLUMN mammography_test_request.symptom_lump IS
    'Whether the patient reports a breast lump.';
COMMENT ON COLUMN mammography_test_request.symptom_pain IS
    'Whether the patient reports breast pain.';
COMMENT ON COLUMN mammography_test_request.symptom_nipple_discharge IS
    'Whether the patient reports nipple discharge.';
COMMENT ON COLUMN mammography_test_request.symptom_skin_change IS
    'Whether the patient reports a skin change (dimpling, peau d''orange, erythema).';
COMMENT ON COLUMN mammography_test_request.symptom_nipple_inversion IS
    'Whether the patient reports new nipple inversion or retraction.';
COMMENT ON COLUMN mammography_test_request.previous_mammogram IS
    'Previous mammogram outcome: none, normal, abnormal, unknown.';
COMMENT ON COLUMN mammography_test_request.previous_mammogram_date IS
    'Date of the most recent previous mammogram.';
COMMENT ON COLUMN mammography_test_request.family_history_breast_cancer IS
    'Whether there is a family history of breast cancer.';
COMMENT ON COLUMN mammography_test_request.breast_implants IS
    'Whether the patient has breast implants (affects technique and views).';
COMMENT ON COLUMN mammography_test_request.pregnancy_or_lactating IS
    'Pregnancy / lactation status: no, pregnant, lactating, unknown (affects radiation justification).';
COMMENT ON COLUMN mammography_test_request.hormone_replacement_therapy IS
    'Whether the patient is on hormone replacement therapy (affects breast density).';
COMMENT ON COLUMN mammography_test_request.urgency IS
    'Requested triage urgency: routine, urgent, two-week-wait, emergency.';
COMMENT ON COLUMN mammography_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN mammography_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN mammography_test_request.notes IS
    'Free-text additional notes.';
