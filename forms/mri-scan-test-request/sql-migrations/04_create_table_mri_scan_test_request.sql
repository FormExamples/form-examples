-- MRI scan request (referral) — the source-of-truth record.

CREATE TABLE mri_scan_test_request (
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
    body_region VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (body_region IN ('brain', 'spine-cervical', 'spine-thoracic', 'spine-lumbar', 'head-neck', 'chest', 'abdomen', 'pelvis', 'cardiac', 'mr-angiogram', 'breast', 'musculoskeletal-joint', 'whole-body', 'other', '')),
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('suspected-malignancy', 'cancer-staging', 'neurological-deficit', 'suspected-ms', 'back-pain-radiculopathy', 'joint-derangement', 'suspected-stroke', 'epilepsy', 'dementia', 'pituitary', 'cardiac-function', 'follow-up-surveillance', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Contrast and gadolinium / renal (NSF) risk
    contrast_required VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (contrast_required IN ('none', 'iv-gadolinium', 'unknown', '')),
    egfr NUMERIC(5,1)
        CHECK (egfr IS NULL OR egfr BETWEEN 0 AND 200),
    previous_gadolinium_reaction VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (previous_gadolinium_reaction IN ('none', 'mild', 'moderate', 'severe', 'unknown', '')),
    pregnancy_status VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (pregnancy_status IN ('not-pregnant', 'pregnant', 'possible', 'unknown', 'not-applicable', '')),

    -- MRI safety screening (ferromagnetic / electronic implant checklist)
    pacemaker_or_icd BOOLEAN NOT NULL DEFAULT FALSE,
    cochlear_implant BOOLEAN NOT NULL DEFAULT FALSE,
    aneurysm_clip BOOLEAN NOT NULL DEFAULT FALSE,
    metallic_foreign_body_eye BOOLEAN NOT NULL DEFAULT FALSE,
    shrapnel_or_metal_fragments BOOLEAN NOT NULL DEFAULT FALSE,
    programmable_shunt BOOLEAN NOT NULL DEFAULT FALSE,
    neurostimulator BOOLEAN NOT NULL DEFAULT FALSE,
    metal_implant_or_prosthesis BOOLEAN NOT NULL DEFAULT FALSE,
    insulin_pump BOOLEAN NOT NULL DEFAULT FALSE,
    claustrophobia BOOLEAN NOT NULL DEFAULT FALSE,
    mri_safety_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (mri_safety_status IN ('cleared', 'conditional', 'needs-review', 'unsafe', '')),
    weight_kg NUMERIC(5,1)
        CHECK (weight_kg IS NULL OR weight_kg BETWEEN 0 AND 500),

    -- Context
    relevant_previous_imaging VARCHAR(1000) NOT NULL DEFAULT '',

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'emergency', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_mri_scan_test_request_patient_id
    ON mri_scan_test_request(patient_id);
CREATE INDEX index_mri_scan_test_request_clinician_id
    ON mri_scan_test_request(clinician_id);

CREATE TRIGGER trigger_mri_scan_test_request_updated_at
    BEFORE UPDATE ON mri_scan_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE mri_scan_test_request IS
    'MRI scan request (referral). Captures the requested examination (body region, indication, clinical question), contrast and gadolinium / renal (NSF) risk, MRI safety screening for ferromagnetic and electronic implants, and triage urgency.';
COMMENT ON COLUMN mri_scan_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN mri_scan_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN mri_scan_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN mri_scan_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN mri_scan_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN mri_scan_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN mri_scan_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN mri_scan_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN mri_scan_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN mri_scan_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN mri_scan_test_request.requested_by_date IS
    'Date by which the scan is requested to be performed.';
COMMENT ON COLUMN mri_scan_test_request.body_region IS
    'Body region to be imaged, used for appropriateness scoring and protocolling.';
COMMENT ON COLUMN mri_scan_test_request.primary_indication IS
    'Primary clinical indication, used for ACR appropriateness scoring.';
COMMENT ON COLUMN mri_scan_test_request.clinical_question IS
    'Specific clinical question the scan should answer (highest-value field).';
COMMENT ON COLUMN mri_scan_test_request.relevant_history IS
    'Relevant medical, surgical, and clinical history.';
COMMENT ON COLUMN mri_scan_test_request.contrast_required IS
    'Whether IV contrast is required: none, iv-gadolinium, unknown.';
COMMENT ON COLUMN mri_scan_test_request.egfr IS
    'Estimated glomerular filtration rate (mL/min/1.73m2), for gadolinium / NSF risk assessment.';
COMMENT ON COLUMN mri_scan_test_request.previous_gadolinium_reaction IS
    'Severity of any previous gadolinium contrast reaction: none, mild, moderate, severe, unknown.';
COMMENT ON COLUMN mri_scan_test_request.pregnancy_status IS
    'Pregnancy status: not-pregnant, pregnant, possible, unknown, not-applicable.';
COMMENT ON COLUMN mri_scan_test_request.pacemaker_or_icd IS
    'MRI safety: cardiac pacemaker or implantable cardioverter defibrillator (ICD) present.';
COMMENT ON COLUMN mri_scan_test_request.cochlear_implant IS
    'MRI safety: cochlear implant present.';
COMMENT ON COLUMN mri_scan_test_request.aneurysm_clip IS
    'MRI safety: intracranial aneurysm clip present.';
COMMENT ON COLUMN mri_scan_test_request.metallic_foreign_body_eye IS
    'MRI safety: metallic foreign body in the eye / orbit.';
COMMENT ON COLUMN mri_scan_test_request.shrapnel_or_metal_fragments IS
    'MRI safety: shrapnel or other embedded metal fragments.';
COMMENT ON COLUMN mri_scan_test_request.programmable_shunt IS
    'MRI safety: programmable cerebrospinal-fluid shunt present.';
COMMENT ON COLUMN mri_scan_test_request.neurostimulator IS
    'MRI safety: neurostimulator (e.g. deep brain, spinal cord, vagus nerve) present.';
COMMENT ON COLUMN mri_scan_test_request.metal_implant_or_prosthesis IS
    'MRI safety: metal implant, prosthesis, or other surgical hardware present.';
COMMENT ON COLUMN mri_scan_test_request.insulin_pump IS
    'MRI safety: insulin pump or other external infusion device present.';
COMMENT ON COLUMN mri_scan_test_request.claustrophobia IS
    'MRI safety: claustrophobia that may require sedation or open-bore scanner.';
COMMENT ON COLUMN mri_scan_test_request.mri_safety_status IS
    'Referrer''s preliminary MRI safety view: cleared, conditional, needs-review, unsafe.';
COMMENT ON COLUMN mri_scan_test_request.weight_kg IS
    'Patient weight in kg, for scanner bore / table weight limit.';
COMMENT ON COLUMN mri_scan_test_request.relevant_previous_imaging IS
    'Relevant previous imaging (modality, date, finding) for comparison.';
COMMENT ON COLUMN mri_scan_test_request.urgency IS
    'Requested triage urgency: routine, urgent, emergency.';
COMMENT ON COLUMN mri_scan_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN mri_scan_test_request.notes IS
    'Free-text additional notes.';
