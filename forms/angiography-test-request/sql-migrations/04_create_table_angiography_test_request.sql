-- Vascular angiography request (referral) — the source-of-truth record.

CREATE TABLE angiography_test_request (
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
    angiography_type VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (angiography_type IN ('ct-angiography', 'mr-angiography', 'catheter-dsa', 'coronary-angiography', 'peripheral-angiography', 'cerebral-angiography', 'other', '')),
    body_region VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (body_region IN ('coronary', 'cerebral', 'carotid', 'aorta', 'renal', 'peripheral-lower-limb', 'pulmonary', 'mesenteric', 'other', '')),
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('suspected-coronary-disease', 'peripheral-arterial-disease', 'aneurysm', 'stenosis', 'suspected-pulmonary-embolism', 'gi-bleeding', 'pre-intervention-planning', 'suspected-stroke', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Contrast and renal safety
    contrast_required VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (contrast_required IN ('iodinated', 'gadolinium', 'none', 'unknown', '')),
    egfr NUMERIC(5,1)
        CHECK (egfr IS NULL OR egfr BETWEEN 0 AND 200),
    contrast_allergy BOOLEAN NOT NULL DEFAULT FALSE,
    diabetes BOOLEAN NOT NULL DEFAULT FALSE,
    metformin BOOLEAN NOT NULL DEFAULT FALSE,

    -- Bleeding / anticoagulation
    taking_anticoagulant BOOLEAN NOT NULL DEFAULT FALSE,
    anticoagulant_agent VARCHAR(255) NOT NULL DEFAULT '',
    taking_antiplatelet BOOLEAN NOT NULL DEFAULT FALSE,
    bleeding_disorder BOOLEAN NOT NULL DEFAULT FALSE,

    -- Pregnancy / radiation
    pregnancy_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (pregnancy_status IN ('not-pregnant', 'pregnant', 'possible', 'unknown', 'not-applicable', '')),

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'emergency', '')),
    ir_me_r_justification VARCHAR(1000) NOT NULL DEFAULT '',
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_angiography_test_request_patient_id
    ON angiography_test_request(patient_id);
CREATE INDEX index_angiography_test_request_clinician_id
    ON angiography_test_request(clinician_id);

CREATE TRIGGER trigger_angiography_test_request_updated_at
    BEFORE UPDATE ON angiography_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE angiography_test_request IS
    'Vascular angiography request (referral). Captures the requested examination (modality + body region), the clinical indication and question, contrast and renal safety, bleeding / anticoagulation, pregnancy / radiation, IR(ME)R justification, and triage urgency.';
COMMENT ON COLUMN angiography_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN angiography_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN angiography_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN angiography_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN angiography_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN angiography_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN angiography_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN angiography_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN angiography_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN angiography_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN angiography_test_request.requested_by_date IS
    'Date by which the examination is requested to be performed.';
COMMENT ON COLUMN angiography_test_request.angiography_type IS
    'Requested angiography modality: ct-angiography, mr-angiography, catheter-dsa, coronary-angiography, peripheral-angiography, cerebral-angiography, other.';
COMMENT ON COLUMN angiography_test_request.body_region IS
    'Vascular territory examined: coronary, cerebral, carotid, aorta, renal, peripheral-lower-limb, pulmonary, mesenteric, other.';
COMMENT ON COLUMN angiography_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN angiography_test_request.clinical_question IS
    'Specific clinical question the examination should answer (highest-value field).';
COMMENT ON COLUMN angiography_test_request.relevant_history IS
    'Relevant medical, surgical, and vascular history.';
COMMENT ON COLUMN angiography_test_request.contrast_required IS
    'Contrast agent required: iodinated, gadolinium, none, unknown.';
COMMENT ON COLUMN angiography_test_request.egfr IS
    'Estimated glomerular filtration rate (mL/min/1.73 m2), used for contrast renal-safety assessment.';
COMMENT ON COLUMN angiography_test_request.contrast_allergy IS
    'Whether the patient has a previous contrast-media allergy / reaction.';
COMMENT ON COLUMN angiography_test_request.diabetes IS
    'Whether the patient has diabetes mellitus.';
COMMENT ON COLUMN angiography_test_request.metformin IS
    'Whether the patient takes metformin (relevant to iodinated contrast / lactic-acidosis risk).';
COMMENT ON COLUMN angiography_test_request.taking_anticoagulant IS
    'Whether the patient is taking an anticoagulant.';
COMMENT ON COLUMN angiography_test_request.anticoagulant_agent IS
    'Name of the anticoagulant agent (e.g. warfarin, apixaban, rivaroxaban).';
COMMENT ON COLUMN angiography_test_request.taking_antiplatelet IS
    'Whether the patient is taking an antiplatelet agent.';
COMMENT ON COLUMN angiography_test_request.bleeding_disorder IS
    'Whether the patient has a known bleeding disorder.';
COMMENT ON COLUMN angiography_test_request.pregnancy_status IS
    'Pregnancy status for radiation safety: not-pregnant, pregnant, possible, unknown, not-applicable.';
COMMENT ON COLUMN angiography_test_request.urgency IS
    'Requested triage urgency: routine, urgent, emergency.';
COMMENT ON COLUMN angiography_test_request.ir_me_r_justification IS
    'IR(ME)R justification for the radiation exposure (Ionising Radiation Medical Exposure Regulations).';
COMMENT ON COLUMN angiography_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN angiography_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN angiography_test_request.notes IS
    'Free-text additional notes.';
