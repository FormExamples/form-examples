-- Nerve conduction study / EMG (electrodiagnostic) request (referral) — the source-of-truth record.

CREATE TABLE nerve_conduction_study_test_request (
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

    -- Requested study
    study_type VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (study_type IN ('nerve-conduction', 'emg', 'nerve-conduction-and-emg', 'repetitive-stimulation', 'other', '')),
    region VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (region IN ('upper-limb', 'lower-limb', 'all-limbs', 'cranial', 'generalised', 'other', '')),
    laterality VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (laterality IN ('left', 'right', 'bilateral', 'not-applicable', '')),
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('carpal-tunnel', 'peripheral-neuropathy', 'radiculopathy', 'suspected-motor-neurone-disease', 'myopathy', 'plexopathy', 'suspected-myasthenia', 'nerve-injury', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Symptoms
    symptom_numbness BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_weakness BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_pain BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_tingling BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_duration VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (symptom_duration IN ('less-than-6-weeks', '6-weeks-to-3-months', '3-to-12-months', 'over-12-months', '')),

    -- Safety
    diabetes BOOLEAN NOT NULL DEFAULT FALSE,
    taking_anticoagulant BOOLEAN NOT NULL DEFAULT FALSE,
    pacemaker_or_icd BOOLEAN NOT NULL DEFAULT FALSE,

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_nerve_conduction_study_test_request_patient_id
    ON nerve_conduction_study_test_request(patient_id);
CREATE INDEX index_nerve_conduction_study_test_request_clinician_id
    ON nerve_conduction_study_test_request(clinician_id);

CREATE TRIGGER trigger_nerve_conduction_study_test_request_updated_at
    BEFORE UPDATE ON nerve_conduction_study_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE nerve_conduction_study_test_request IS
    'Nerve conduction study / EMG (electrodiagnostic / neurophysiology) request (referral). Captures the requested study, region and laterality, the clinical indication and question, symptoms, safety factors (anticoagulation, cardiac device), and triage urgency.';
COMMENT ON COLUMN nerve_conduction_study_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN nerve_conduction_study_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN nerve_conduction_study_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN nerve_conduction_study_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN nerve_conduction_study_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN nerve_conduction_study_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN nerve_conduction_study_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN nerve_conduction_study_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN nerve_conduction_study_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN nerve_conduction_study_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN nerve_conduction_study_test_request.requested_by_date IS
    'Date by which the study is requested to be performed.';
COMMENT ON COLUMN nerve_conduction_study_test_request.study_type IS
    'Requested study type: nerve-conduction, emg, nerve-conduction-and-emg, repetitive-stimulation, other.';
COMMENT ON COLUMN nerve_conduction_study_test_request.region IS
    'Anatomical region to study: upper-limb, lower-limb, all-limbs, cranial, generalised, other.';
COMMENT ON COLUMN nerve_conduction_study_test_request.laterality IS
    'Laterality of the study: left, right, bilateral, not-applicable.';
COMMENT ON COLUMN nerve_conduction_study_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring: carpal-tunnel, peripheral-neuropathy, radiculopathy, suspected-motor-neurone-disease, myopathy, plexopathy, suspected-myasthenia, nerve-injury, other.';
COMMENT ON COLUMN nerve_conduction_study_test_request.clinical_question IS
    'Specific clinical question the study should answer (highest-value field).';
COMMENT ON COLUMN nerve_conduction_study_test_request.relevant_history IS
    'Relevant medical, surgical, and neurological history.';
COMMENT ON COLUMN nerve_conduction_study_test_request.symptom_numbness IS
    'Whether the patient reports numbness.';
COMMENT ON COLUMN nerve_conduction_study_test_request.symptom_weakness IS
    'Whether the patient reports weakness.';
COMMENT ON COLUMN nerve_conduction_study_test_request.symptom_pain IS
    'Whether the patient reports pain.';
COMMENT ON COLUMN nerve_conduction_study_test_request.symptom_tingling IS
    'Whether the patient reports tingling / paraesthesia.';
COMMENT ON COLUMN nerve_conduction_study_test_request.symptom_duration IS
    'Duration of symptoms: less-than-6-weeks, 6-weeks-to-3-months, 3-to-12-months, over-12-months.';
COMMENT ON COLUMN nerve_conduction_study_test_request.diabetes IS
    'Whether the patient has diabetes (relevant to polyneuropathy and baseline conduction).';
COMMENT ON COLUMN nerve_conduction_study_test_request.taking_anticoagulant IS
    'Whether the patient is taking an anticoagulant (needle-EMG bleeding-risk factor).';
COMMENT ON COLUMN nerve_conduction_study_test_request.pacemaker_or_icd IS
    'Whether the patient has a pacemaker or implantable cardioverter-defibrillator (stimulation-caution factor).';
COMMENT ON COLUMN nerve_conduction_study_test_request.urgency IS
    'Requested triage urgency: routine, urgent.';
COMMENT ON COLUMN nerve_conduction_study_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN nerve_conduction_study_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN nerve_conduction_study_test_request.notes IS
    'Free-text additional notes.';
