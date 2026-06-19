-- Bronchoscopy (airway endoscopy) request (referral) — the source-of-truth record.

CREATE TABLE bronchoscopy_test_request (
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
        CHECK (procedure IN ('flexible-bronchoscopy', 'ebus', 'rigid-bronchoscopy', 'bronchoalveolar-lavage', 'other', '')),
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('suspected-lung-cancer', 'haemoptysis', 'persistent-cough', 'lung-mass-on-imaging', 'mediastinal-lymphadenopathy', 'infection-sampling', 'foreign-body', 'stridor', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Symptoms
    symptom_haemoptysis BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_cough BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_breathlessness BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_weight_loss BOOLEAN NOT NULL DEFAULT FALSE,
    imaging_findings VARCHAR(1000) NOT NULL DEFAULT '',

    -- Bleeding / anticoagulation risk
    taking_anticoagulant BOOLEAN NOT NULL DEFAULT FALSE,
    anticoagulant_agent VARCHAR(255) NOT NULL DEFAULT '',
    taking_antiplatelet BOOLEAN NOT NULL DEFAULT FALSE,
    antiplatelet_agent VARCHAR(255) NOT NULL DEFAULT '',
    platelet_count NUMERIC(6,1),

    -- Procedural risk
    oxygen_dependent BOOLEAN NOT NULL DEFAULT FALSE,
    asa_grade VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (asa_grade IN ('I', 'II', 'III', 'IV', 'V', '')),
    sedation VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (sedation IN ('conscious', 'deep', 'general', '')),

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'two-week-wait', 'emergency', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_bronchoscopy_test_request_patient_id
    ON bronchoscopy_test_request(patient_id);
CREATE INDEX index_bronchoscopy_test_request_clinician_id
    ON bronchoscopy_test_request(clinician_id);

CREATE TRIGGER trigger_bronchoscopy_test_request_updated_at
    BEFORE UPDATE ON bronchoscopy_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE bronchoscopy_test_request IS
    'Bronchoscopy (airway endoscopy) request (referral). Captures the requested procedure, the clinical indication and question, symptoms, imaging findings, bleeding / anticoagulation risk, procedural risk, and triage urgency.';
COMMENT ON COLUMN bronchoscopy_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN bronchoscopy_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN bronchoscopy_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN bronchoscopy_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN bronchoscopy_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN bronchoscopy_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN bronchoscopy_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN bronchoscopy_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN bronchoscopy_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN bronchoscopy_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN bronchoscopy_test_request.requested_by_date IS
    'Date by which the procedure is requested to be performed.';
COMMENT ON COLUMN bronchoscopy_test_request.procedure IS
    'Requested procedure: flexible-bronchoscopy, ebus, rigid-bronchoscopy, bronchoalveolar-lavage, other.';
COMMENT ON COLUMN bronchoscopy_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN bronchoscopy_test_request.clinical_question IS
    'Specific clinical question the procedure should answer (highest-value field).';
COMMENT ON COLUMN bronchoscopy_test_request.relevant_history IS
    'Relevant medical, surgical, and respiratory history.';
COMMENT ON COLUMN bronchoscopy_test_request.symptom_haemoptysis IS
    'Whether the patient reports coughing up blood (haemoptysis).';
COMMENT ON COLUMN bronchoscopy_test_request.symptom_cough IS
    'Whether the patient reports a persistent cough.';
COMMENT ON COLUMN bronchoscopy_test_request.symptom_breathlessness IS
    'Whether the patient reports breathlessness (dyspnoea).';
COMMENT ON COLUMN bronchoscopy_test_request.symptom_weight_loss IS
    'Whether the patient reports unexplained weight loss.';
COMMENT ON COLUMN bronchoscopy_test_request.imaging_findings IS
    'Summary of relevant imaging findings (chest x-ray, CT) supporting the request.';
COMMENT ON COLUMN bronchoscopy_test_request.taking_anticoagulant IS
    'Whether the patient is taking an anticoagulant (bleeding risk).';
COMMENT ON COLUMN bronchoscopy_test_request.anticoagulant_agent IS
    'Name of the anticoagulant agent, if any (e.g. warfarin, apixaban).';
COMMENT ON COLUMN bronchoscopy_test_request.taking_antiplatelet IS
    'Whether the patient is taking an antiplatelet agent (bleeding risk).';
COMMENT ON COLUMN bronchoscopy_test_request.antiplatelet_agent IS
    'Name of the antiplatelet agent, if any (e.g. clopidogrel, aspirin).';
COMMENT ON COLUMN bronchoscopy_test_request.platelet_count IS
    'Platelet count (x10^9/L), affecting bleeding risk for biopsy.';
COMMENT ON COLUMN bronchoscopy_test_request.oxygen_dependent IS
    'Whether the patient is oxygen-dependent (hypoxia / procedural risk).';
COMMENT ON COLUMN bronchoscopy_test_request.asa_grade IS
    'American Society of Anesthesiologists physical status grade: I, II, III, IV, V.';
COMMENT ON COLUMN bronchoscopy_test_request.sedation IS
    'Planned sedation level: conscious, deep, general.';
COMMENT ON COLUMN bronchoscopy_test_request.urgency IS
    'Requested triage urgency: routine, urgent, two-week-wait, emergency.';
COMMENT ON COLUMN bronchoscopy_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN bronchoscopy_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN bronchoscopy_test_request.notes IS
    'Free-text additional notes.';
