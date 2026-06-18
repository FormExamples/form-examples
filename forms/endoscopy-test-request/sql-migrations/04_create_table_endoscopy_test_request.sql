-- GI endoscopy procedure request (referral) — the source-of-truth record.

CREATE TABLE endoscopy_test_request (
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

    -- Requested procedure
    requested_procedure VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (requested_procedure IN ('ogd', 'gastroscopy', 'colonoscopy', 'flexible-sigmoidoscopy', 'ercp', 'eus', 'capsule', 'other', '')),
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('dyspepsia', 'gord', 'dysphagia', 'upper-gi-bleeding', 'iron-deficiency-anaemia', 'weight-loss', 'suspected-malignancy', 'barretts-surveillance', 'h-pylori', 'rectal-bleeding', 'change-in-bowel-habit', 'positive-fit', 'ibd-surveillance', 'polyp-surveillance', 'abnormal-imaging', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- ALARM / red-flag symptoms (NICE NG12 suspected-cancer features)
    red_flag_dysphagia BOOLEAN NOT NULL DEFAULT FALSE,
    red_flag_weight_loss BOOLEAN NOT NULL DEFAULT FALSE,
    red_flag_anaemia BOOLEAN NOT NULL DEFAULT FALSE,
    red_flag_gi_bleeding BOOLEAN NOT NULL DEFAULT FALSE,
    red_flag_abdominal_mass BOOLEAN NOT NULL DEFAULT FALSE,
    red_flag_age_over_55 BOOLEAN NOT NULL DEFAULT FALSE,

    -- Lower-GI triage labs (FIT) and haematinics
    fit_result_ug_g NUMERIC(6,1),
    haemoglobin_g_l NUMERIC(5,1),
    ferritin_ug_l NUMERIC(6,1),

    -- Anticoagulant / antiplatelet medication (BSG/ESGE bleeding-risk stratification)
    taking_anticoagulant BOOLEAN NOT NULL DEFAULT FALSE,
    anticoagulant_agent VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (anticoagulant_agent IN ('none', 'warfarin', 'apixaban', 'rivaroxaban', 'edoxaban', 'dabigatran', 'lmwh', 'other', '')),
    taking_antiplatelet BOOLEAN NOT NULL DEFAULT FALSE,
    antiplatelet_agent VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (antiplatelet_agent IN ('none', 'aspirin', 'clopidogrel', 'ticagrelor', 'prasugrel', 'dipyridamole', 'dual', 'other', '')),

    -- Diabetes and allergies
    diabetes_medication VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (diabetes_medication IN ('none', 'oral', 'insulin', '')),
    allergies VARCHAR(1000) NOT NULL DEFAULT '',
    latex_allergy BOOLEAN NOT NULL DEFAULT FALSE,

    -- Comorbidities
    cardiac_nyha_class VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (cardiac_nyha_class IN ('I', 'II', 'III', 'IV', '')),
    pacemaker_icd BOOLEAN NOT NULL DEFAULT FALSE,
    chronic_kidney_disease BOOLEAN NOT NULL DEFAULT FALSE,
    egfr_ml_min NUMERIC(5,1),
    sleep_apnoea BOOLEAN NOT NULL DEFAULT FALSE,
    neutropenia BOOLEAN NOT NULL DEFAULT FALSE,
    asa_grade VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (asa_grade IN ('I', 'II', 'III', 'IV', 'V', '')),

    -- Infection-control flags
    vcjd_risk BOOLEAN NOT NULL DEFAULT FALSE,
    cpe_carriage BOOLEAN NOT NULL DEFAULT FALSE,
    mrsa BOOLEAN NOT NULL DEFAULT FALSE,
    blood_borne_virus BOOLEAN NOT NULL DEFAULT FALSE,

    -- Bowel preparation and sedation
    fit_for_bowel_prep BOOLEAN NOT NULL DEFAULT FALSE,
    bowel_prep_agent VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (bowel_prep_agent IN ('none', 'moviprep', 'plenvu', 'klean-prep', 'picolax', 'citramag', 'other', '')),
    sedation VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (sedation IN ('none', 'throat-spray', 'conscious', 'deep', '')),
    escort_available BOOLEAN NOT NULL DEFAULT FALSE,

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'two-week-wait', 'emergency', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    interpreter_required BOOLEAN NOT NULL DEFAULT FALSE,
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_endoscopy_test_request_patient_id
    ON endoscopy_test_request(patient_id);
CREATE INDEX index_endoscopy_test_request_clinician_id
    ON endoscopy_test_request(clinician_id);

CREATE TRIGGER trigger_endoscopy_test_request_updated_at
    BEFORE UPDATE ON endoscopy_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE endoscopy_test_request IS
    'GI endoscopy procedure request (referral). Captures the requested procedure, clinical indication and question, ALARM red flags, FIT and haematinic results, anticoagulant / antiplatelet medication, diabetes, allergies, comorbidities, infection-control flags, bowel-prep and sedation plans, and triage urgency.';
COMMENT ON COLUMN endoscopy_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN endoscopy_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN endoscopy_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN endoscopy_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN endoscopy_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN endoscopy_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN endoscopy_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN endoscopy_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN endoscopy_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN endoscopy_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN endoscopy_test_request.requested_by_date IS
    'Date by which the procedure is requested to be performed.';
COMMENT ON COLUMN endoscopy_test_request.requested_procedure IS
    'Requested endoscopic procedure: ogd, gastroscopy, colonoscopy, flexible-sigmoidoscopy, ercp, eus, capsule, other.';
COMMENT ON COLUMN endoscopy_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN endoscopy_test_request.clinical_question IS
    'Specific clinical question the procedure should answer (highest-value field).';
COMMENT ON COLUMN endoscopy_test_request.relevant_history IS
    'Relevant medical, surgical, and endoscopic history.';
COMMENT ON COLUMN endoscopy_test_request.red_flag_dysphagia IS
    'ALARM red flag: dysphagia (NICE NG12 suspected upper-GI cancer feature).';
COMMENT ON COLUMN endoscopy_test_request.red_flag_weight_loss IS
    'ALARM red flag: unexplained weight loss.';
COMMENT ON COLUMN endoscopy_test_request.red_flag_anaemia IS
    'ALARM red flag: iron-deficiency anaemia.';
COMMENT ON COLUMN endoscopy_test_request.red_flag_gi_bleeding IS
    'ALARM red flag: gastrointestinal bleeding (haematemesis, melaena, or rectal bleeding).';
COMMENT ON COLUMN endoscopy_test_request.red_flag_abdominal_mass IS
    'ALARM red flag: palpable abdominal or epigastric mass.';
COMMENT ON COLUMN endoscopy_test_request.red_flag_age_over_55 IS
    'ALARM red flag: age 55 or over (NICE NG12 age threshold for upper-GI referral).';
COMMENT ON COLUMN endoscopy_test_request.fit_result_ug_g IS
    'Faecal immunochemical test (FIT) result in micrograms of haemoglobin per gram of faeces; NICE DG56 referral threshold is >= 10 ug/g.';
COMMENT ON COLUMN endoscopy_test_request.haemoglobin_g_l IS
    'Haemoglobin concentration in g/L.';
COMMENT ON COLUMN endoscopy_test_request.ferritin_ug_l IS
    'Serum ferritin in ug/L (micrograms per litre).';
COMMENT ON COLUMN endoscopy_test_request.taking_anticoagulant IS
    'Whether the patient is taking an anticoagulant.';
COMMENT ON COLUMN endoscopy_test_request.anticoagulant_agent IS
    'Anticoagulant agent: none, warfarin, apixaban, rivaroxaban, edoxaban, dabigatran, lmwh, other.';
COMMENT ON COLUMN endoscopy_test_request.taking_antiplatelet IS
    'Whether the patient is taking an antiplatelet agent.';
COMMENT ON COLUMN endoscopy_test_request.antiplatelet_agent IS
    'Antiplatelet agent: none, aspirin, clopidogrel, ticagrelor, prasugrel, dipyridamole, dual, other.';
COMMENT ON COLUMN endoscopy_test_request.diabetes_medication IS
    'Diabetes medication category affecting fasting / prep plans: none, oral, insulin.';
COMMENT ON COLUMN endoscopy_test_request.allergies IS
    'Free-text allergy list.';
COMMENT ON COLUMN endoscopy_test_request.latex_allergy IS
    'Whether the patient has a latex allergy (theatre / equipment precaution).';
COMMENT ON COLUMN endoscopy_test_request.cardiac_nyha_class IS
    'New York Heart Association (NYHA) functional class: I, II, III, IV.';
COMMENT ON COLUMN endoscopy_test_request.pacemaker_icd IS
    'Whether the patient has a pacemaker or implantable cardioverter-defibrillator (diathermy precaution).';
COMMENT ON COLUMN endoscopy_test_request.chronic_kidney_disease IS
    'Whether the patient has chronic kidney disease (affects bowel-prep choice).';
COMMENT ON COLUMN endoscopy_test_request.egfr_ml_min IS
    'Estimated glomerular filtration rate (eGFR) in mL/min/1.73m2.';
COMMENT ON COLUMN endoscopy_test_request.sleep_apnoea IS
    'Whether the patient has obstructive sleep apnoea (sedation risk).';
COMMENT ON COLUMN endoscopy_test_request.neutropenia IS
    'Whether the patient is neutropenic (antibiotic-prophylaxis / infection consideration).';
COMMENT ON COLUMN endoscopy_test_request.asa_grade IS
    'American Society of Anesthesiologists (ASA) physical-status grade: I, II, III, IV, V.';
COMMENT ON COLUMN endoscopy_test_request.vcjd_risk IS
    'Infection flag: variant Creutzfeldt-Jakob disease (vCJD) risk requiring single-use or quarantined instruments.';
COMMENT ON COLUMN endoscopy_test_request.cpe_carriage IS
    'Infection flag: carbapenemase-producing Enterobacterales (CPE) carriage.';
COMMENT ON COLUMN endoscopy_test_request.mrsa IS
    'Infection flag: meticillin-resistant Staphylococcus aureus (MRSA) colonisation.';
COMMENT ON COLUMN endoscopy_test_request.blood_borne_virus IS
    'Infection flag: known blood-borne virus (HIV, hepatitis B, hepatitis C).';
COMMENT ON COLUMN endoscopy_test_request.fit_for_bowel_prep IS
    'Whether the patient is assessed as fit to take bowel preparation.';
COMMENT ON COLUMN endoscopy_test_request.bowel_prep_agent IS
    'Bowel-preparation agent: none, moviprep, plenvu, klean-prep, picolax, citramag, other.';
COMMENT ON COLUMN endoscopy_test_request.sedation IS
    'Planned sedation: none, throat-spray, conscious, deep.';
COMMENT ON COLUMN endoscopy_test_request.escort_available IS
    'Whether a responsible escort is available post-sedation.';
COMMENT ON COLUMN endoscopy_test_request.urgency IS
    'Requested triage urgency: routine, urgent, two-week-wait, emergency.';
COMMENT ON COLUMN endoscopy_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN endoscopy_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN endoscopy_test_request.interpreter_required IS
    'Whether an interpreter is required.';
COMMENT ON COLUMN endoscopy_test_request.notes IS
    'Free-text additional notes.';
