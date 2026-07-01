-- Main breast-screening record: one mammography breast-screening encounter
-- under the NHS Breast Screening Programme. Captures context and identification,
-- eligibility, consent, the mammogram views taken, the double-read reporting
-- opinions and arbitration, the reading outcome, and — where the woman is
-- recalled and assessed — the five-point breast imaging classification. The
-- computed screening outcome, the audit trail of fired rules, and the safety
-- flags live in dedicated child tables. This is a documentation and
-- result-classification record, not a numeric score.

CREATE TABLE breast_screening (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Context and identification
    reporting_clinician_role VARCHAR(25) NOT NULL DEFAULT '' CHECK (reporting_clinician_role IN ('mammographer', 'advanced-practitioner', 'breast-radiologist', 'screening-office', 'other', '')),
    reported_at TIMESTAMPTZ,
    screening_unit TEXT NOT NULL DEFAULT '',
    episode_type VARCHAR(30) NOT NULL DEFAULT '' CHECK (episode_type IN ('routine-recall', 'very-first-call', 'self-referral', 'higher-risk-surveillance', '')),
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_years INTEGER,
    last_screened_date DATE,
    higher_risk_surveillance VARCHAR(5) NOT NULL DEFAULT '' CHECK (higher_risk_surveillance IN ('yes', 'no', '')),

    -- Eligibility and consent
    symptomatic VARCHAR(5) NOT NULL DEFAULT '' CHECK (symptomatic IN ('yes', 'no', '')),
    consent_given VARCHAR(10) NOT NULL DEFAULT '' CHECK (consent_given IN ('yes', 'no', 'declined', '')),

    -- Imaging inputs
    views_taken VARCHAR(20) NOT NULL DEFAULT '' CHECK (views_taken IN ('standard-four-view', 'additional-views', 'unable-to-image', '')),
    image_adequacy VARCHAR(15) NOT NULL DEFAULT '' CHECK (image_adequacy IN ('adequate', 'inadequate', '')),

    -- Double reading and arbitration
    first_read_opinion VARCHAR(15) NOT NULL DEFAULT '' CHECK (first_read_opinion IN ('normal', 'recall', 'technical', '')),
    second_read_opinion VARCHAR(15) NOT NULL DEFAULT '' CHECK (second_read_opinion IN ('normal', 'recall', 'technical', '')),
    arbitration_outcome VARCHAR(15) NOT NULL DEFAULT '' CHECK (arbitration_outcome IN ('normal', 'recall', 'technical', 'not-required', '')),

    -- Reading outcome
    reading_outcome VARCHAR(25) NOT NULL DEFAULT '' CHECK (reading_outcome IN ('normal-routine-recall', 'technical-repeat', 'recall-for-assessment', '')),

    -- Assessment result (only when recalled for assessment)
    assessment_performed VARCHAR(5) NOT NULL DEFAULT '' CHECK (assessment_performed IN ('yes', 'no', '')),
    assessment_modalities TEXT NOT NULL DEFAULT '',
    imaging_classification INTEGER CHECK (imaging_classification IS NULL OR imaging_classification BETWEEN 1 AND 5),

    -- Free-text clinical context
    clinical_context TEXT NOT NULL DEFAULT ''
);

CREATE INDEX breast_screening_patient_id_idx
    ON breast_screening (patient_id);
CREATE INDEX breast_screening_clinician_id_idx
    ON breast_screening (clinician_id);

CREATE TRIGGER trigger_breast_screening_updated_at
    BEFORE UPDATE ON breast_screening
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE breast_screening IS
    'Main breast-screening record for one NHS Breast Screening Programme mammography encounter: context and identification, eligibility, consent, mammogram views, double-read opinions and arbitration, the reading outcome, and the five-point breast imaging classification when assessed. Screening outcome, fired rules, and flags live in child tables.';
COMMENT ON COLUMN breast_screening.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN breast_screening.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN breast_screening.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN breast_screening.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN breast_screening.patient_id IS
    'Foreign key to the patient this screening documents (restrict delete).';
COMMENT ON COLUMN breast_screening.clinician_id IS
    'Foreign key to the reporting clinician (restrict delete); optional.';
COMMENT ON COLUMN breast_screening.reporting_clinician_role IS
    'Role of the reporting clinician: mammographer, advanced-practitioner, breast-radiologist, screening-office, or other.';
COMMENT ON COLUMN breast_screening.reported_at IS
    'Date and time the screening outcome was reported.';
COMMENT ON COLUMN breast_screening.screening_unit IS
    'Screening unit where the mammogram was taken: static or mobile unit.';
COMMENT ON COLUMN breast_screening.episode_type IS
    'Screening episode type: routine-recall, very-first-call, self-referral, or higher-risk-surveillance.';
COMMENT ON COLUMN breast_screening.patient_identifier IS
    'NHS number or local patient identifier as recorded on the record.';
COMMENT ON COLUMN breast_screening.age_years IS
    'Patient age in years; drives eligibility and the age-range flag (routine eligible range 50-70).';
COMMENT ON COLUMN breast_screening.last_screened_date IS
    'Date of the most recent previous screen, when known; drives the overdue flag (~36 months).';
COMMENT ON COLUMN breast_screening.higher_risk_surveillance IS
    'Whether the woman is on the separate higher-risk surveillance pathway (yes/no); yes classifies eligibility as higher-risk-surveillance.';
COMMENT ON COLUMN breast_screening.symptomatic IS
    'Whether the woman reports a breast symptom (yes/no); yes routes to the symptomatic breast pathway rather than screening.';
COMMENT ON COLUMN breast_screening.consent_given IS
    'Whether informed consent to image was given: yes, no, or declined; anything other than yes raises the consent flag.';
COMMENT ON COLUMN breast_screening.views_taken IS
    'Mammogram views taken: standard-four-view, additional-views, or unable-to-image.';
COMMENT ON COLUMN breast_screening.image_adequacy IS
    'Image adequacy: adequate or inadequate; an inadequate image drives the technical-repeat flag.';
COMMENT ON COLUMN breast_screening.first_read_opinion IS
    'First reader opinion: normal, recall, or technical.';
COMMENT ON COLUMN breast_screening.second_read_opinion IS
    'Second reader opinion: normal, recall, or technical.';
COMMENT ON COLUMN breast_screening.arbitration_outcome IS
    'Arbitration outcome when the two reads disagree: normal, recall, technical, or not-required.';
COMMENT ON COLUMN breast_screening.reading_outcome IS
    'Overall film-reading outcome: normal-routine-recall, technical-repeat, or recall-for-assessment.';
COMMENT ON COLUMN breast_screening.assessment_performed IS
    'Whether the recall assessment clinic was attended (yes/no); required before an imaging classification can be recorded.';
COMMENT ON COLUMN breast_screening.assessment_modalities IS
    'Assessment modalities used, serialised multi-select from mammography, ultrasound, and biopsy.';
COMMENT ON COLUMN breast_screening.imaging_classification IS
    'Five-point breast imaging classification recorded at assessment (1 normal, 2 benign, 3 indeterminate, 4 suspicious, 5 malignant); null until assessed.';
COMMENT ON COLUMN breast_screening.clinical_context IS
    'Optional free-text clinical context shown in the summary.';
