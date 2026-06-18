-- Lower-GI endoscopy (colonoscopy) request (referral) — the source-of-truth record.

CREATE TABLE colonoscopy_test_request (
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

    -- Requested examination
    procedure VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (procedure IN ('colonoscopy', 'flexible-sigmoidoscopy', 'ct-colonography', 'other', '')),
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('rectal-bleeding', 'change-in-bowel-habit', 'iron-deficiency-anaemia', 'positive-fit', 'abdominal-mass', 'ibd-diagnosis', 'ibd-surveillance', 'polyp-surveillance', 'crc-screening', 'abnormal-imaging', 'chronic-diarrhoea', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Red flags (ALARM / NICE NG12 lower-GI)
    red_flag_weight_loss BOOLEAN NOT NULL DEFAULT FALSE,
    red_flag_anaemia BOOLEAN NOT NULL DEFAULT FALSE,
    red_flag_abdominal_mass BOOLEAN NOT NULL DEFAULT FALSE,
    red_flag_rectal_bleeding BOOLEAN NOT NULL DEFAULT FALSE,

    -- Triage labs
    fit_result_ug_g NUMERIC(8,1)
        CHECK (fit_result_ug_g IS NULL OR fit_result_ug_g >= 0),
    haemoglobin_g_l NUMERIC(5,1)
        CHECK (haemoglobin_g_l IS NULL OR haemoglobin_g_l >= 0),

    -- Medication
    taking_anticoagulant BOOLEAN NOT NULL DEFAULT FALSE,
    anticoagulant_agent VARCHAR(100) NOT NULL DEFAULT '',
    taking_antiplatelet BOOLEAN NOT NULL DEFAULT FALSE,
    antiplatelet_agent VARCHAR(100) NOT NULL DEFAULT '',
    diabetes_medication VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (diabetes_medication IN ('none', 'oral', 'insulin', '')),

    -- Bowel preparation and fitness
    fit_for_bowel_prep BOOLEAN NOT NULL DEFAULT FALSE,
    bowel_prep_agent VARCHAR(100) NOT NULL DEFAULT '',
    chronic_kidney_disease BOOLEAN NOT NULL DEFAULT FALSE,
    egfr_ml_min NUMERIC(5,1)
        CHECK (egfr_ml_min IS NULL OR egfr_ml_min >= 0),
    asa_grade VARCHAR(3) NOT NULL DEFAULT ''
        CHECK (asa_grade IN ('I', 'II', 'III', 'IV', 'V', '')),

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'two-week-wait', 'emergency', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_colonoscopy_test_request_patient_id
    ON colonoscopy_test_request(patient_id);
CREATE INDEX index_colonoscopy_test_request_clinician_id
    ON colonoscopy_test_request(clinician_id);

CREATE TRIGGER trigger_colonoscopy_test_request_updated_at
    BEFORE UPDATE ON colonoscopy_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE colonoscopy_test_request IS
    'Lower-GI endoscopy (colonoscopy) request (referral). Captures the requested procedure, the clinical indication and question, lower-GI red flags, FIT and haemoglobin results, anticoagulant / antiplatelet medication, bowel-preparation fitness, renal function, ASA grade, and triage urgency.';
COMMENT ON COLUMN colonoscopy_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN colonoscopy_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN colonoscopy_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN colonoscopy_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN colonoscopy_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN colonoscopy_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN colonoscopy_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN colonoscopy_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN colonoscopy_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN colonoscopy_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN colonoscopy_test_request.requested_by_date IS
    'Date by which the procedure is requested to be performed.';
COMMENT ON COLUMN colonoscopy_test_request.procedure IS
    'Requested procedure: colonoscopy, flexible-sigmoidoscopy, ct-colonography, other.';
COMMENT ON COLUMN colonoscopy_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring and cancer-pathway triage.';
COMMENT ON COLUMN colonoscopy_test_request.clinical_question IS
    'Specific clinical question the procedure should answer (highest-value field).';
COMMENT ON COLUMN colonoscopy_test_request.relevant_history IS
    'Relevant medical, surgical, and GI history.';
COMMENT ON COLUMN colonoscopy_test_request.red_flag_weight_loss IS
    'Whether the patient reports unexplained weight loss (lower-GI red flag).';
COMMENT ON COLUMN colonoscopy_test_request.red_flag_anaemia IS
    'Whether the patient has iron-deficiency anaemia (lower-GI red flag).';
COMMENT ON COLUMN colonoscopy_test_request.red_flag_abdominal_mass IS
    'Whether the patient has a palpable abdominal or rectal mass (lower-GI red flag).';
COMMENT ON COLUMN colonoscopy_test_request.red_flag_rectal_bleeding IS
    'Whether the patient reports unexplained rectal bleeding (lower-GI red flag).';
COMMENT ON COLUMN colonoscopy_test_request.fit_result_ug_g IS
    'Quantitative faecal immunochemical test (FIT) result in micrograms of haemoglobin per gram of faeces; >= 10 triggers the suspected-cancer pathway (NICE DG56).';
COMMENT ON COLUMN colonoscopy_test_request.haemoglobin_g_l IS
    'Haemoglobin concentration in g/L, used for anaemia assessment.';
COMMENT ON COLUMN colonoscopy_test_request.taking_anticoagulant IS
    'Whether the patient is taking an anticoagulant (e.g. warfarin, DOAC).';
COMMENT ON COLUMN colonoscopy_test_request.anticoagulant_agent IS
    'Name of the anticoagulant agent, if any.';
COMMENT ON COLUMN colonoscopy_test_request.taking_antiplatelet IS
    'Whether the patient is taking an antiplatelet agent (e.g. clopidogrel, aspirin).';
COMMENT ON COLUMN colonoscopy_test_request.antiplatelet_agent IS
    'Name of the antiplatelet agent, if any.';
COMMENT ON COLUMN colonoscopy_test_request.diabetes_medication IS
    'Diabetes medication category affecting bowel-prep planning: none, oral, insulin.';
COMMENT ON COLUMN colonoscopy_test_request.fit_for_bowel_prep IS
    'Whether the patient is assessed as fit to take bowel preparation.';
COMMENT ON COLUMN colonoscopy_test_request.bowel_prep_agent IS
    'Planned bowel-preparation agent, if any.';
COMMENT ON COLUMN colonoscopy_test_request.chronic_kidney_disease IS
    'Whether the patient has chronic kidney disease, affecting bowel-prep choice.';
COMMENT ON COLUMN colonoscopy_test_request.egfr_ml_min IS
    'Estimated glomerular filtration rate (eGFR) in mL/min/1.73m2, affecting bowel-prep choice.';
COMMENT ON COLUMN colonoscopy_test_request.asa_grade IS
    'ASA physical-status classification (I-V).';
COMMENT ON COLUMN colonoscopy_test_request.urgency IS
    'Requested triage urgency: routine, urgent, two-week-wait, emergency.';
COMMENT ON COLUMN colonoscopy_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN colonoscopy_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN colonoscopy_test_request.notes IS
    'Free-text additional notes.';
