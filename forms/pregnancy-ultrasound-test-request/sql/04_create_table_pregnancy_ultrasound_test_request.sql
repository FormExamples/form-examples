-- Obstetric ultrasound scan request (referral) — the source-of-truth record.

CREATE TABLE pregnancy_ultrasound_test_request (
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
        CHECK (setting IN ('outpatient', 'inpatient', 'community', 'emergency', '')),
    referral_date DATE,
    requested_by_date DATE,

    -- Pregnancy dating
    last_menstrual_period_date DATE,
    last_menstrual_period_reliability VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (last_menstrual_period_reliability IN ('reliable', 'uncertain', 'unknown', '')),
    estimated_due_date DATE,
    estimated_due_date_method VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (estimated_due_date_method IN ('lmp', 'ultrasound', 'ivf', 'unknown', '')),
    gestational_age_weeks INTEGER
        CHECK (gestational_age_weeks IS NULL OR gestational_age_weeks BETWEEN 0 AND 45),
    gestational_age_days INTEGER
        CHECK (gestational_age_days IS NULL OR gestational_age_days BETWEEN 0 AND 6),

    -- Obstetric history
    gravida INTEGER CHECK (gravida IS NULL OR gravida BETWEEN 0 AND 30),
    para INTEGER CHECK (para IS NULL OR para BETWEEN 0 AND 30),
    plurality VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (plurality IN ('singleton', 'twin', 'triplet', 'higher-order', 'unknown', '')),
    chorionicity VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (chorionicity IN ('dichorionic-diamniotic', 'monochorionic-diamniotic', 'monochorionic-monoamniotic', 'not-applicable', 'unknown', '')),
    conception_method VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (conception_method IN ('spontaneous', 'ivf', 'iui', 'ovulation-induction', 'unknown', '')),
    rhesus_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (rhesus_status IN ('positive', 'negative', 'unknown', '')),
    body_mass_index NUMERIC(4,1),

    -- Requested examination
    requested_scan_type VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (requested_scan_type IN ('viability', 'dating', 'nuchal-translucency', 'anomaly', 'growth', 'doppler', 'presentation', 'cervical-length', 'placental-location', 'liquor-volume', 'reassurance', 'other', '')),
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('dating', 'viability', 'exclude-ectopic', 'bleeding', 'pain', 'aneuploidy-screening', 'anomaly-screening', 'suspected-anomaly', 'growth-restriction', 'large-for-dates', 'reduced-fetal-movements', 'multiple-pregnancy', 'placental-location', 'liquor-assessment', 'presentation', 'cervical-assessment', 'antepartum-haemorrhage', 'maternal-condition', 'doppler-surveillance', 'follow-up', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',
    previous_scan_finding VARCHAR(1000) NOT NULL DEFAULT '',
    previous_scan_date DATE,

    -- Symptoms / red flags
    vaginal_bleeding VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (vaginal_bleeding IN ('none', 'light', 'moderate', 'heavy', '')),
    abdominal_pain VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (abdominal_pain IN ('none', 'mild', 'moderate', 'severe', '')),
    reduced_fetal_movements BOOLEAN NOT NULL DEFAULT FALSE,
    suspected_ectopic BOOLEAN NOT NULL DEFAULT FALSE,
    haemodynamically_unstable BOOLEAN NOT NULL DEFAULT FALSE,

    -- Risk factors
    hypertension BOOLEAN NOT NULL DEFAULT FALSE,
    diabetes BOOLEAN NOT NULL DEFAULT FALSE,
    previous_growth_restriction BOOLEAN NOT NULL DEFAULT FALSE,
    previous_preterm_birth BOOLEAN NOT NULL DEFAULT FALSE,
    previous_caesarean BOOLEAN NOT NULL DEFAULT FALSE,
    smoker BOOLEAN NOT NULL DEFAULT FALSE,

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'soon', 'urgent', 'emergency', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    interpreter_required BOOLEAN NOT NULL DEFAULT FALSE,
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_pregnancy_ultrasound_test_request_patient_id
    ON pregnancy_ultrasound_test_request(patient_id);
CREATE INDEX index_pregnancy_ultrasound_test_request_clinician_id
    ON pregnancy_ultrasound_test_request(clinician_id);

CREATE TRIGGER trigger_pregnancy_ultrasound_test_request_updated_at
    BEFORE UPDATE ON pregnancy_ultrasound_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE pregnancy_ultrasound_test_request IS
    'Obstetric ultrasound scan request (referral). Captures pregnancy dating, obstetric history, the requested examination, the clinical indication and question, symptoms / red flags, risk factors, and triage urgency.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.requested_by_date IS
    'Date by which the scan is requested to be performed.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.last_menstrual_period_date IS
    'First day of the last menstrual period (LMP).';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.last_menstrual_period_reliability IS
    'Reliability of the LMP: reliable, uncertain, unknown.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.estimated_due_date IS
    'Estimated due date (EDD).';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.estimated_due_date_method IS
    'How the EDD was derived: lmp, ultrasound, ivf, unknown.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.gestational_age_weeks IS
    'Completed gestational weeks at the time of request (0-45).';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.gestational_age_days IS
    'Additional gestational days beyond completed weeks (0-6).';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.gravida IS
    'Gravida: total number of pregnancies.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.para IS
    'Para: number of births beyond 24 weeks.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.plurality IS
    'Plurality: singleton, twin, triplet, higher-order, unknown.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.chorionicity IS
    'Chorionicity for multiple pregnancy, if known.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.conception_method IS
    'Conception method: spontaneous, ivf, iui, ovulation-induction, unknown.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.rhesus_status IS
    'Maternal rhesus status: positive, negative, unknown.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.body_mass_index IS
    'Maternal body mass index (BMI), affecting image quality and technique.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.requested_scan_type IS
    'Requested scan type, used for gestational-age-window appropriateness.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.clinical_question IS
    'Specific clinical question the scan should answer (highest-value field).';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.relevant_history IS
    'Relevant medical, surgical, and obstetric history.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.previous_scan_finding IS
    'Finding from a previous scan being followed up.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.previous_scan_date IS
    'Date of the previous scan being followed up.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.vaginal_bleeding IS
    'Vaginal bleeding severity: none, light, moderate, heavy.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.abdominal_pain IS
    'Abdominal pain severity: none, mild, moderate, severe.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.reduced_fetal_movements IS
    'Whether the patient reports reduced fetal movements (red flag).';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.suspected_ectopic IS
    'Whether ectopic pregnancy is suspected (red flag).';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.haemodynamically_unstable IS
    'Whether the patient is haemodynamically unstable (red flag).';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.hypertension IS
    'Whether the patient has hypertension.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.diabetes IS
    'Whether the patient has diabetes.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.previous_growth_restriction IS
    'Whether the patient had a previous SGA / growth-restricted pregnancy.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.previous_preterm_birth IS
    'Whether the patient had a previous preterm birth.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.previous_caesarean IS
    'Whether the patient had a previous caesarean section.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.smoker IS
    'Whether the patient is a current smoker.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.urgency IS
    'Requested triage urgency: routine, soon, urgent, emergency.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.interpreter_required IS
    'Whether an interpreter is required.';
COMMENT ON COLUMN pregnancy_ultrasound_test_request.notes IS
    'Free-text additional notes.';
