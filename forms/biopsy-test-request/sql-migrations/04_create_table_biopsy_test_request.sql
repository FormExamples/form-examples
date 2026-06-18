-- Tissue biopsy procedure / pathology request (referral) — the source-of-truth record.

CREATE TABLE biopsy_test_request (
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
    biopsy_site VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (biopsy_site IN ('skin', 'breast', 'lymph-node', 'liver', 'kidney', 'prostate', 'lung', 'bone-marrow', 'gi-tract', 'thyroid', 'soft-tissue', 'other', '')),
    biopsy_method VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (biopsy_method IN ('punch', 'excision', 'incision', 'core-needle', 'fine-needle-aspiration', 'image-guided', 'endoscopic', 'other', '')),
    laterality VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (laterality IN ('left', 'right', 'bilateral', 'not-applicable', '')),
    primary_indication VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('suspected-malignancy', 'cancer-staging', 'suspected-infection', 'inflammatory-disease', 'transplant-monitoring', 'lymphadenopathy', 'characterise-lesion', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',
    lesion_description VARCHAR(1000) NOT NULL DEFAULT '',
    imaging_guidance_required BOOLEAN NOT NULL DEFAULT FALSE,

    -- Bleeding / coagulation
    taking_anticoagulant BOOLEAN NOT NULL DEFAULT FALSE,
    anticoagulant_agent VARCHAR(255) NOT NULL DEFAULT '',
    taking_antiplatelet BOOLEAN NOT NULL DEFAULT FALSE,
    antiplatelet_agent VARCHAR(255) NOT NULL DEFAULT '',
    inr NUMERIC(4,1)
        CHECK (inr IS NULL OR inr BETWEEN 0.5 AND 20.0),
    platelet_count NUMERIC(6,0)
        CHECK (platelet_count IS NULL OR platelet_count BETWEEN 0 AND 2000),
    bleeding_disorder BOOLEAN NOT NULL DEFAULT FALSE,
    immunosuppressed BOOLEAN NOT NULL DEFAULT FALSE,

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'two-week-wait', 'emergency', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_biopsy_test_request_patient_id
    ON biopsy_test_request(patient_id);
CREATE INDEX index_biopsy_test_request_clinician_id
    ON biopsy_test_request(clinician_id);

CREATE TRIGGER trigger_biopsy_test_request_updated_at
    BEFORE UPDATE ON biopsy_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE biopsy_test_request IS
    'Tissue biopsy procedure / pathology request (referral). Captures the requested procedure (site, method, laterality), the clinical indication and question, lesion description, bleeding / coagulation status, and triage urgency.';
COMMENT ON COLUMN biopsy_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN biopsy_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN biopsy_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN biopsy_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN biopsy_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN biopsy_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN biopsy_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN biopsy_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN biopsy_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN biopsy_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN biopsy_test_request.requested_by_date IS
    'Date by which the biopsy is requested to be performed.';
COMMENT ON COLUMN biopsy_test_request.biopsy_site IS
    'Anatomical biopsy site: skin, breast, lymph-node, liver, kidney, prostate, lung, bone-marrow, gi-tract, thyroid, soft-tissue, other.';
COMMENT ON COLUMN biopsy_test_request.biopsy_method IS
    'Biopsy method / technique: punch, excision, incision, core-needle, fine-needle-aspiration, image-guided, endoscopic, other.';
COMMENT ON COLUMN biopsy_test_request.laterality IS
    'Laterality of the target: left, right, bilateral, not-applicable.';
COMMENT ON COLUMN biopsy_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN biopsy_test_request.clinical_question IS
    'Specific clinical question the biopsy should answer (highest-value field).';
COMMENT ON COLUMN biopsy_test_request.relevant_history IS
    'Relevant medical, surgical, and oncological history.';
COMMENT ON COLUMN biopsy_test_request.lesion_description IS
    'Description of the target lesion (size, location, imaging correlate).';
COMMENT ON COLUMN biopsy_test_request.imaging_guidance_required IS
    'Whether image guidance (ultrasound / CT / MRI) is required to target the lesion.';
COMMENT ON COLUMN biopsy_test_request.taking_anticoagulant IS
    'Whether the patient is taking an anticoagulant (e.g. warfarin, DOAC).';
COMMENT ON COLUMN biopsy_test_request.anticoagulant_agent IS
    'Name of the anticoagulant agent, if any.';
COMMENT ON COLUMN biopsy_test_request.taking_antiplatelet IS
    'Whether the patient is taking an antiplatelet agent (e.g. clopidogrel).';
COMMENT ON COLUMN biopsy_test_request.antiplatelet_agent IS
    'Name of the antiplatelet agent, if any.';
COMMENT ON COLUMN biopsy_test_request.inr IS
    'International normalised ratio (INR), affecting bleeding-risk stratification.';
COMMENT ON COLUMN biopsy_test_request.platelet_count IS
    'Platelet count (x10^9/L), affecting bleeding-risk stratification.';
COMMENT ON COLUMN biopsy_test_request.bleeding_disorder IS
    'Whether the patient has a known bleeding disorder / coagulopathy.';
COMMENT ON COLUMN biopsy_test_request.immunosuppressed IS
    'Whether the patient is immunosuppressed.';
COMMENT ON COLUMN biopsy_test_request.urgency IS
    'Requested triage urgency: routine, urgent, two-week-wait, emergency.';
COMMENT ON COLUMN biopsy_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN biopsy_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN biopsy_test_request.notes IS
    'Free-text additional notes.';
