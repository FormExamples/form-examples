-- Lumbar puncture request (referral) — the source-of-truth record.

CREATE TABLE lumbar_puncture_test_request (
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

    -- Procedure and indication
    procedure_intent VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (procedure_intent IN ('diagnostic', 'therapeutic', 'other', '')),
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('suspected-meningitis', 'suspected-subarachnoid-haemorrhage', 'suspected-multiple-sclerosis', 'suspected-guillain-barre', 'idiopathic-intracranial-hypertension', 'suspected-cns-malignancy', 'cns-infection', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Raised intracranial pressure / neurological safety
    suspected_raised_intracranial_pressure BOOLEAN NOT NULL DEFAULT FALSE,
    focal_neurological_signs BOOLEAN NOT NULL DEFAULT FALSE,
    reduced_consciousness BOOLEAN NOT NULL DEFAULT FALSE,
    ct_head_status VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (ct_head_status IN ('done-normal', 'done-abnormal', 'not-required', 'awaited', '')),

    -- Bleeding / coagulation safety
    taking_anticoagulant BOOLEAN NOT NULL DEFAULT FALSE,
    anticoagulant_agent VARCHAR(255) NOT NULL DEFAULT '',
    taking_antiplatelet BOOLEAN NOT NULL DEFAULT FALSE,
    antiplatelet_agent VARCHAR(255) NOT NULL DEFAULT '',
    inr NUMERIC(4,1)
        CHECK (inr IS NULL OR inr BETWEEN 0.5 AND 20.0),
    platelet_count NUMERIC(6,1)
        CHECK (platelet_count IS NULL OR platelet_count BETWEEN 0 AND 2000),
    bleeding_disorder BOOLEAN NOT NULL DEFAULT FALSE,
    local_skin_infection BOOLEAN NOT NULL DEFAULT FALSE,

    -- Procedure details / triage
    opening_pressure_required BOOLEAN NOT NULL DEFAULT FALSE,
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'emergency', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_lumbar_puncture_test_request_patient_id
    ON lumbar_puncture_test_request(patient_id);
CREATE INDEX index_lumbar_puncture_test_request_clinician_id
    ON lumbar_puncture_test_request(clinician_id);

CREATE INDEX lumbar_puncture_test_request_index_gto
    ON lumbar_puncture_test_request
    USING GIN ((
        site_name
    ) gin_trgm_ops);

CREATE TRIGGER trigger_lumbar_puncture_test_request_updated_at
    BEFORE UPDATE ON lumbar_puncture_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE lumbar_puncture_test_request IS
    'Lumbar puncture request (referral) for CSF sampling and/or manometry. Captures the procedure intent, the clinical indication and question, raised-intracranial-pressure and bleeding safety screening, opening-pressure requirement, and triage urgency.';
COMMENT ON COLUMN lumbar_puncture_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lumbar_puncture_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lumbar_puncture_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lumbar_puncture_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lumbar_puncture_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN lumbar_puncture_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN lumbar_puncture_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN lumbar_puncture_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN lumbar_puncture_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN lumbar_puncture_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN lumbar_puncture_test_request.requested_by_date IS
    'Date by which the procedure is requested to be performed.';
COMMENT ON COLUMN lumbar_puncture_test_request.procedure_intent IS
    'Procedure intent: diagnostic (CSF sampling / manometry), therapeutic (e.g. CSF drainage), other.';
COMMENT ON COLUMN lumbar_puncture_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring: suspected-meningitis, suspected-subarachnoid-haemorrhage, suspected-multiple-sclerosis, suspected-guillain-barre, idiopathic-intracranial-hypertension, suspected-cns-malignancy, cns-infection, other.';
COMMENT ON COLUMN lumbar_puncture_test_request.clinical_question IS
    'Specific clinical question the CSF analysis should answer (highest-value field).';
COMMENT ON COLUMN lumbar_puncture_test_request.relevant_history IS
    'Relevant medical, neurological, and medication history.';
COMMENT ON COLUMN lumbar_puncture_test_request.suspected_raised_intracranial_pressure IS
    'Whether raised intracranial pressure is clinically suspected (LP may risk cerebral herniation; imaging first).';
COMMENT ON COLUMN lumbar_puncture_test_request.focal_neurological_signs IS
    'Whether new focal neurological signs are present (risk factor for space-occupying lesion; image before LP).';
COMMENT ON COLUMN lumbar_puncture_test_request.reduced_consciousness IS
    'Whether the patient has reduced consciousness (e.g. GCS 9 or less; image and stabilise before LP).';
COMMENT ON COLUMN lumbar_puncture_test_request.ct_head_status IS
    'CT head imaging status prior to LP: done-normal, done-abnormal, not-required, awaited.';
COMMENT ON COLUMN lumbar_puncture_test_request.taking_anticoagulant IS
    'Whether the patient is taking an anticoagulant (bleeding / spinal haematoma risk).';
COMMENT ON COLUMN lumbar_puncture_test_request.anticoagulant_agent IS
    'Name of the anticoagulant agent (e.g. warfarin, apixaban, rivaroxaban, dabigatran, heparin).';
COMMENT ON COLUMN lumbar_puncture_test_request.taking_antiplatelet IS
    'Whether the patient is taking an antiplatelet agent (bleeding risk).';
COMMENT ON COLUMN lumbar_puncture_test_request.antiplatelet_agent IS
    'Name of the antiplatelet agent (e.g. aspirin, clopidogrel, ticagrelor, prasugrel).';
COMMENT ON COLUMN lumbar_puncture_test_request.inr IS
    'International normalised ratio (INR); LP generally avoided or delayed if INR > 1.5.';
COMMENT ON COLUMN lumbar_puncture_test_request.platelet_count IS
    'Platelet count (x10^9/L); LP generally avoided if platelets < 40-50.';
COMMENT ON COLUMN lumbar_puncture_test_request.bleeding_disorder IS
    'Whether the patient has a known bleeding disorder or coagulopathy.';
COMMENT ON COLUMN lumbar_puncture_test_request.local_skin_infection IS
    'Whether there is local skin or soft-tissue infection at the puncture site (contraindication).';
COMMENT ON COLUMN lumbar_puncture_test_request.opening_pressure_required IS
    'Whether manometry (CSF opening pressure measurement) is required, e.g. for idiopathic intracranial hypertension.';
COMMENT ON COLUMN lumbar_puncture_test_request.urgency IS
    'Requested triage urgency: routine, urgent, emergency.';
COMMENT ON COLUMN lumbar_puncture_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN lumbar_puncture_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN lumbar_puncture_test_request.notes IS
    'Free-text additional notes.';
