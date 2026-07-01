-- Cardiology referral / consult request (referral into cardiology) — the source-of-truth record.

CREATE TABLE cardiology_request (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE CASCADE,

    -- Referral lifecycle
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'triaged', 'accepted', 'redirected', 'rejected', '')),
    site_name VARCHAR(255) NOT NULL DEFAULT '',
    setting VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (setting IN ('outpatient', 'inpatient', 'community', 'emergency', '')),
    referral_date DATE,
    requested_by_date DATE,

    -- Requested service and reason
    requested_service VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (requested_service IN ('general-cardiology', 'rapid-access-chest-pain', 'heart-failure', 'arrhythmia-ep', 'valve-clinic', 'inherited-cardiac-conditions', 'pre-operative-cardiac', 'other', '')),
    referral_reason VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (referral_reason IN ('chest-pain', 'breathlessness', 'palpitations', 'syncope', 'heart-failure-symptoms', 'murmur-or-valve', 'abnormal-ecg', 'hypertension', 'arrhythmia', 'pre-operative-assessment', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Symptoms
    symptom_chest_pain BOOLEAN NOT NULL DEFAULT FALSE,
    chest_pain_character VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (chest_pain_character IN ('typical-angina', 'atypical', 'non-anginal', 'none', '')),
    symptom_breathlessness BOOLEAN NOT NULL DEFAULT FALSE,
    nyha_class VARCHAR(4) NOT NULL DEFAULT ''
        CHECK (nyha_class IN ('i', 'ii', 'iii', 'iv', '')),
    symptom_palpitations BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_syncope BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_oedema BOOLEAN NOT NULL DEFAULT FALSE,

    -- Red flags / acuity
    suspected_acs BOOLEAN NOT NULL DEFAULT FALSE,
    exertional_syncope BOOLEAN NOT NULL DEFAULT FALSE,
    new_onset_heart_failure BOOLEAN NOT NULL DEFAULT FALSE,

    -- Investigations already performed
    ecg_done BOOLEAN NOT NULL DEFAULT FALSE,
    ecg_findings VARCHAR(1000) NOT NULL DEFAULT '',
    troponin_status VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (troponin_status IN ('elevated', 'normal', 'not-done', '')),
    bnp_status VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (bnp_status IN ('elevated', 'normal', 'not-done', '')),

    -- Cardiac history and risk factors
    known_coronary_artery_disease BOOLEAN NOT NULL DEFAULT FALSE,
    previous_mi BOOLEAN NOT NULL DEFAULT FALSE,
    heart_failure BOOLEAN NOT NULL DEFAULT FALSE,
    valve_disease BOOLEAN NOT NULL DEFAULT FALSE,
    arrhythmia BOOLEAN NOT NULL DEFAULT FALSE,
    hypertension BOOLEAN NOT NULL DEFAULT FALSE,
    diabetes BOOLEAN NOT NULL DEFAULT FALSE,
    current_medications VARCHAR(1000) NOT NULL DEFAULT '',

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'emergency', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_cardiology_request_patient_id
    ON cardiology_request(patient_id);
CREATE INDEX index_cardiology_request_clinician_id
    ON cardiology_request(clinician_id);

CREATE TRIGGER trigger_cardiology_request_updated_at
    BEFORE UPDATE ON cardiology_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE cardiology_request IS
    'Cardiology referral / consult request (referral into cardiology). Captures the requested cardiology service and reason, the specific clinical question, presenting symptoms and functional class, acute red flags, investigations already performed (ECG, troponin, BNP), cardiac history and risk factors, and triage details. This is the source-of-truth record that the four-axis vetting grade is computed from.';
COMMENT ON COLUMN cardiology_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cardiology_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN cardiology_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN cardiology_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN cardiology_request.patient_id IS
    'Foreign key to the patient being referred.';
COMMENT ON COLUMN cardiology_request.clinician_id IS
    'Foreign key to the referring clinician (referrer).';
COMMENT ON COLUMN cardiology_request.status IS
    'Referral lifecycle status: draft, submitted, triaged, accepted, redirected, rejected.';
COMMENT ON COLUMN cardiology_request.site_name IS
    'Name of the referring site / practice / ward.';
COMMENT ON COLUMN cardiology_request.setting IS
    'Care setting the referral originates from: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN cardiology_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN cardiology_request.requested_by_date IS
    'Date by which the referrer requests the patient be seen.';
COMMENT ON COLUMN cardiology_request.requested_service IS
    'Requested cardiology service: general-cardiology, rapid-access-chest-pain, heart-failure, arrhythmia-ep, valve-clinic, inherited-cardiac-conditions, pre-operative-cardiac, other.';
COMMENT ON COLUMN cardiology_request.referral_reason IS
    'Primary reason for referral: chest-pain, breathlessness, palpitations, syncope, heart-failure-symptoms, murmur-or-valve, abnormal-ecg, hypertension, arrhythmia, pre-operative-assessment, other.';
COMMENT ON COLUMN cardiology_request.clinical_question IS
    'Specific clinical question the cardiology team is asked to answer.';
COMMENT ON COLUMN cardiology_request.relevant_history IS
    'Relevant clinical history and context for the referral.';
COMMENT ON COLUMN cardiology_request.symptom_chest_pain IS
    'Whether the patient has chest pain.';
COMMENT ON COLUMN cardiology_request.chest_pain_character IS
    'Character of chest pain per the angina typicality model: typical-angina, atypical, non-anginal, none.';
COMMENT ON COLUMN cardiology_request.symptom_breathlessness IS
    'Whether the patient has breathlessness / dyspnoea.';
COMMENT ON COLUMN cardiology_request.nyha_class IS
    'New York Heart Association functional class for breathlessness: i, ii, iii, iv.';
COMMENT ON COLUMN cardiology_request.symptom_palpitations IS
    'Whether the patient has palpitations.';
COMMENT ON COLUMN cardiology_request.symptom_syncope IS
    'Whether the patient has had syncope or blackout.';
COMMENT ON COLUMN cardiology_request.symptom_oedema IS
    'Whether the patient has peripheral oedema.';
COMMENT ON COLUMN cardiology_request.suspected_acs IS
    'Red flag: suspected acute coronary syndrome (warrants emergency pathway, not routine referral).';
COMMENT ON COLUMN cardiology_request.exertional_syncope IS
    'Red flag: syncope on exertion (possible structural / arrhythmic cause requiring urgent assessment).';
COMMENT ON COLUMN cardiology_request.new_onset_heart_failure IS
    'Red flag: new-onset heart failure (warrants urgent assessment per NICE).';
COMMENT ON COLUMN cardiology_request.ecg_done IS
    'Whether a resting ECG has been performed prior to referral.';
COMMENT ON COLUMN cardiology_request.ecg_findings IS
    'Resting ECG findings, if performed.';
COMMENT ON COLUMN cardiology_request.troponin_status IS
    'Troponin result status: elevated, normal, not-done.';
COMMENT ON COLUMN cardiology_request.bnp_status IS
    'BNP / NT-proBNP result status: elevated, normal, not-done.';
COMMENT ON COLUMN cardiology_request.known_coronary_artery_disease IS
    'History: known coronary artery disease.';
COMMENT ON COLUMN cardiology_request.previous_mi IS
    'History: previous myocardial infarction.';
COMMENT ON COLUMN cardiology_request.heart_failure IS
    'History: established heart failure.';
COMMENT ON COLUMN cardiology_request.valve_disease IS
    'History: known valve disease.';
COMMENT ON COLUMN cardiology_request.arrhythmia IS
    'History: known arrhythmia.';
COMMENT ON COLUMN cardiology_request.hypertension IS
    'History: hypertension.';
COMMENT ON COLUMN cardiology_request.diabetes IS
    'History: diabetes mellitus.';
COMMENT ON COLUMN cardiology_request.current_medications IS
    'Current cardiac and other relevant medications.';
COMMENT ON COLUMN cardiology_request.urgency IS
    'Requested triage urgency: routine, urgent, emergency.';
COMMENT ON COLUMN cardiology_request.supervising_consultant IS
    'Name of the supervising consultant, if the referrer is in training.';
COMMENT ON COLUMN cardiology_request.requester_contact IS
    'Contact details for the referrer for any vetting queries.';
COMMENT ON COLUMN cardiology_request.notes IS
    'Free-text notes accompanying the referral.';
