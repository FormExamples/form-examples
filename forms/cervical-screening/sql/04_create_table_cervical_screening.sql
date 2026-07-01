-- Main cervical-screening record: one screening (smear) encounter under the
-- UK NHS Cervical Screening Programme (HPV primary screening with reflex
-- cytology). Captures encounter context, patient identification, eligibility,
-- consent, symptoms, sample adequacy, the primary high-risk HPV (hrHPV)
-- result, and reflex cytology. The computed result classification, the audit
-- trail of fired rules, and the safety flags live in dedicated child tables.

CREATE TABLE cervical_screening (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Encounter context
    care_setting VARCHAR(20) NOT NULL DEFAULT '' CHECK (care_setting IN ('general-practice', 'sexual-health', 'other', '')),
    sample_taker_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (sample_taker_role IN ('practice-nurse', 'gp', 'smear-taker', 'other', '')),
    sample_taken_at TIMESTAMPTZ,

    -- Patient identification
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age INTEGER,

    -- Eligibility
    recall_interval VARCHAR(20) NOT NULL DEFAULT '' CHECK (recall_interval IN ('three-yearly', 'five-yearly', 'not-applicable', '')),
    screen_due_date DATE,
    last_screen_date DATE,
    overdue VARCHAR(5) NOT NULL DEFAULT '' CHECK (overdue IN ('yes', 'no', '')),
    previously_ceased VARCHAR(5) NOT NULL DEFAULT '' CHECK (previously_ceased IN ('yes', 'no', '')),

    -- Consent
    consent_given VARCHAR(5) NOT NULL DEFAULT '' CHECK (consent_given IN ('yes', 'no', '')),

    -- Symptoms
    symptomatic VARCHAR(5) NOT NULL DEFAULT '' CHECK (symptomatic IN ('yes', 'no', '')),
    symptom_detail TEXT NOT NULL DEFAULT '',

    -- Sample adequacy
    sample_adequacy VARCHAR(15) NOT NULL DEFAULT '' CHECK (sample_adequacy IN ('adequate', 'inadequate', '')),
    inadequate_reason VARCHAR(20) NOT NULL DEFAULT '' CHECK (inadequate_reason IN ('insufficient-cells', 'obscuring-blood', 'inflammation', 'labelling', 'other', '')),

    -- Primary hrHPV test
    hpv_result VARCHAR(15) NOT NULL DEFAULT '' CHECK (hpv_result IN ('negative', 'positive', 'not-tested', '')),

    -- Reflex cytology (only when hpv_result = 'positive')
    cytology_grade VARCHAR(15) NOT NULL DEFAULT '' CHECK (cytology_grade IN ('negative', 'borderline', 'low-grade', 'high-grade', 'not-performed', '')),

    -- Free-text clinical context
    clinical_context TEXT NOT NULL DEFAULT ''
);

CREATE INDEX cervical_screening_patient_id_idx
    ON cervical_screening (patient_id);
CREATE INDEX cervical_screening_clinician_id_idx
    ON cervical_screening (clinician_id);

CREATE TRIGGER trigger_cervical_screening_updated_at
    BEFORE UPDATE ON cervical_screening
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE cervical_screening IS
    'Main cervical-screening record for one HPV-primary screening encounter: encounter context, patient identification, eligibility, consent, symptoms, sample adequacy, the primary hrHPV result, and reflex cytology. Result classification, fired rules, and flags live in child tables.';
COMMENT ON COLUMN cervical_screening.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cervical_screening.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN cervical_screening.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN cervical_screening.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN cervical_screening.patient_id IS
    'Foreign key to the patient this screening documents (restrict delete).';
COMMENT ON COLUMN cervical_screening.clinician_id IS
    'Foreign key to the sample-taker clinician (restrict delete); optional.';
COMMENT ON COLUMN cervical_screening.care_setting IS
    'Care setting where the sample was taken: general-practice, sexual-health, or other.';
COMMENT ON COLUMN cervical_screening.sample_taker_role IS
    'Role of the person taking the sample: practice-nurse, gp, smear-taker, or other.';
COMMENT ON COLUMN cervical_screening.sample_taken_at IS
    'Date and time the screening sample was taken.';
COMMENT ON COLUMN cervical_screening.patient_identifier IS
    'Local patient or encounter identifier as recorded on the record.';
COMMENT ON COLUMN cervical_screening.age IS
    'Patient age in years; drives eligibility (25-64) and the recall interval.';
COMMENT ON COLUMN cervical_screening.recall_interval IS
    'Age-appropriate routine recall interval: three-yearly (25-49), five-yearly (50-64), or not-applicable.';
COMMENT ON COLUMN cervical_screening.screen_due_date IS
    'Date the screen was due.';
COMMENT ON COLUMN cervical_screening.last_screen_date IS
    'Date of the most recent previous screening, when known.';
COMMENT ON COLUMN cervical_screening.overdue IS
    'Whether the screening is overdue (yes/no); drives the patient-overdue flag.';
COMMENT ON COLUMN cervical_screening.previously_ceased IS
    'Whether the person has been formally ceased from screening (yes/no); yes classifies as cease-not-eligible.';
COMMENT ON COLUMN cervical_screening.consent_given IS
    'Whether informed consent to sample and process was given (yes/no); anything other than yes raises the missing-consent flag.';
COMMENT ON COLUMN cervical_screening.symptomatic IS
    'Whether the patient reports symptoms (abnormal bleeding, discharge, pain) (yes/no); yes raises the symptomatic-refer-regardless flag.';
COMMENT ON COLUMN cervical_screening.symptom_detail IS
    'Free-text description of reported symptoms.';
COMMENT ON COLUMN cervical_screening.sample_adequacy IS
    'Cytological sample adequacy: adequate or inadequate; an inadequate sample is never HPV-classified and is repeated.';
COMMENT ON COLUMN cervical_screening.inadequate_reason IS
    'Reason a sample was inadequate: insufficient-cells, obscuring-blood, inflammation, labelling, or other.';
COMMENT ON COLUMN cervical_screening.hpv_result IS
    'Primary high-risk HPV (hrHPV) result: negative, positive, or not-tested.';
COMMENT ON COLUMN cervical_screening.cytology_grade IS
    'Reflex cytology dyskaryosis grade (recorded only when hpv_result is positive): negative, borderline, low-grade, high-grade, or not-performed.';
COMMENT ON COLUMN cervical_screening.clinical_context IS
    'Optional free-text clinical context shown in the summary.';
