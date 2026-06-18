-- Eye vision test request (ophthalmic / optometric examination referral) — the source-of-truth record.

CREATE TABLE eye_vision_test_request (
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
    test_type VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (test_type IN ('visual-acuity', 'visual-fields', 'refraction', 'fundus-examination', 'optical-coherence-tomography', 'fluorescein-angiography', 'tonometry', 'slit-lamp', 'orthoptic-assessment', 'other', '')),
    laterality VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (laterality IN ('left', 'right', 'bilateral', 'not-applicable', '')),
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('reduced-vision', 'suspected-glaucoma', 'diabetic-retinopathy-screening', 'sudden-visual-loss', 'flashes-floaters', 'red-eye', 'childhood-squint', 'visual-field-defect', 'cataract-assessment', 'headache-visual-symptoms', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Symptoms / red flags
    symptom_reduced_vision BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_sudden_loss BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_flashes_floaters BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_eye_pain BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_red_eye BOOLEAN NOT NULL DEFAULT FALSE,

    -- Risk factors
    diabetes BOOLEAN NOT NULL DEFAULT FALSE,
    known_glaucoma BOOLEAN NOT NULL DEFAULT FALSE,

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'emergency', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_eye_vision_test_request_patient_id
    ON eye_vision_test_request(patient_id);
CREATE INDEX index_eye_vision_test_request_clinician_id
    ON eye_vision_test_request(clinician_id);

CREATE INDEX eye_vision_test_request_index_gto
    ON eye_vision_test_request
    USING GIN ((
        site_name
    ) gin_trgm_ops);

CREATE TRIGGER trigger_eye_vision_test_request_updated_at
    BEFORE UPDATE ON eye_vision_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE eye_vision_test_request IS
    'Eye vision test request (ophthalmic / optometric examination referral). Captures the requested test, laterality, the clinical indication and question, relevant history, symptoms / red flags, risk factors, and triage urgency.';
COMMENT ON COLUMN eye_vision_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN eye_vision_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN eye_vision_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN eye_vision_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN eye_vision_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN eye_vision_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN eye_vision_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN eye_vision_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN eye_vision_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN eye_vision_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN eye_vision_test_request.requested_by_date IS
    'Date by which the examination is requested to be performed.';
COMMENT ON COLUMN eye_vision_test_request.test_type IS
    'Requested ophthalmic test type, used for appropriateness scoring: visual-acuity, visual-fields, refraction, fundus-examination, optical-coherence-tomography, fluorescein-angiography, tonometry, slit-lamp, orthoptic-assessment, other.';
COMMENT ON COLUMN eye_vision_test_request.laterality IS
    'Eye(s) to be examined: left, right, bilateral, not-applicable.';
COMMENT ON COLUMN eye_vision_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring: reduced-vision, suspected-glaucoma, diabetic-retinopathy-screening, sudden-visual-loss, flashes-floaters, red-eye, childhood-squint, visual-field-defect, cataract-assessment, headache-visual-symptoms, other.';
COMMENT ON COLUMN eye_vision_test_request.clinical_question IS
    'Specific clinical question the examination should answer (highest-value field).';
COMMENT ON COLUMN eye_vision_test_request.relevant_history IS
    'Relevant ocular, medical, and family history.';
COMMENT ON COLUMN eye_vision_test_request.symptom_reduced_vision IS
    'Whether the patient reports reduced vision.';
COMMENT ON COLUMN eye_vision_test_request.symptom_sudden_loss IS
    'Whether the patient reports sudden visual loss (red flag).';
COMMENT ON COLUMN eye_vision_test_request.symptom_flashes_floaters IS
    'Whether the patient reports flashes and/or floaters (retinal-detachment red flag).';
COMMENT ON COLUMN eye_vision_test_request.symptom_eye_pain IS
    'Whether the patient reports eye pain (red flag in combination with red eye).';
COMMENT ON COLUMN eye_vision_test_request.symptom_red_eye IS
    'Whether the patient reports a red eye.';
COMMENT ON COLUMN eye_vision_test_request.diabetes IS
    'Whether the patient has diabetes (diabetic retinopathy risk).';
COMMENT ON COLUMN eye_vision_test_request.known_glaucoma IS
    'Whether the patient has known or treated glaucoma.';
COMMENT ON COLUMN eye_vision_test_request.urgency IS
    'Requested triage urgency: routine, urgent, emergency.';
COMMENT ON COLUMN eye_vision_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN eye_vision_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN eye_vision_test_request.notes IS
    'Free-text additional notes.';
