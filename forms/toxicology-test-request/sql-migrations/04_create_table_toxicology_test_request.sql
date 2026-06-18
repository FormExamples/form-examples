-- Toxicology / poisons / therapeutic-drug-level blood-test request — the
-- source-of-truth record. Unlike a single-procedure request, this orders one or
-- more toxicology assays, modelled as BOOLEAN columns. At least one assay should
-- be selected; a request with no assay selected fires the no-test-selected flag.

CREATE TABLE toxicology_test_request (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE CASCADE,

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'vetted', 'collected', 'rejected', '')),
    site_name VARCHAR(255) NOT NULL DEFAULT '',
    setting VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (setting IN ('outpatient', 'inpatient', 'community', 'emergency', '')),
    referral_date DATE,
    requested_by_date DATE,

    -- Requested assays (booleans). At least one should be TRUE.
    paracetamol_level BOOLEAN NOT NULL DEFAULT FALSE,
    salicylate_level BOOLEAN NOT NULL DEFAULT FALSE,
    alcohol_level BOOLEAN NOT NULL DEFAULT FALSE,
    drugs_of_abuse_screen BOOLEAN NOT NULL DEFAULT FALSE,
    lithium_level BOOLEAN NOT NULL DEFAULT FALSE,
    digoxin_level BOOLEAN NOT NULL DEFAULT FALSE,
    antiepileptic_drug_level BOOLEAN NOT NULL DEFAULT FALSE,
    carboxyhaemoglobin BOOLEAN NOT NULL DEFAULT FALSE,
    heavy_metals BOOLEAN NOT NULL DEFAULT FALSE,
    specific_drug_level BOOLEAN NOT NULL DEFAULT FALSE,

    -- Clinical context
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('suspected-overdose', 'deliberate-self-harm', 'therapeutic-drug-monitoring', 'suspected-poisoning', 'substance-misuse-screen', 'occupational-screen', 'forensic', 'other', '')),
    clinical_details VARCHAR(1000) NOT NULL DEFAULT '',
    suspected_agent VARCHAR(255) NOT NULL DEFAULT '',
    time_since_ingestion_hours NUMERIC(6,1)
        CHECK (time_since_ingestion_hours IS NULL OR time_since_ingestion_hours >= 0),
    deliberate_overdose BOOLEAN NOT NULL DEFAULT FALSE,
    symptomatic BOOLEAN NOT NULL DEFAULT FALSE,

    -- Specimen handling
    specimen_collected VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (specimen_collected IN ('yes', 'no', '')),
    collection_datetime TIMESTAMPTZ,

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'stat', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_toxicology_test_request_patient_id
    ON toxicology_test_request(patient_id);
CREATE INDEX index_toxicology_test_request_clinician_id
    ON toxicology_test_request(clinician_id);

CREATE TRIGGER trigger_toxicology_test_request_updated_at
    BEFORE UPDATE ON toxicology_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE toxicology_test_request IS
    'Toxicology / poisons / therapeutic-drug-level blood-test request. Captures the requested assays (booleans), the clinical indication and details, suspected agent and ingestion timing, specimen handling, and triage urgency.';
COMMENT ON COLUMN toxicology_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN toxicology_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN toxicology_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN toxicology_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN toxicology_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN toxicology_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN toxicology_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, collected, rejected.';
COMMENT ON COLUMN toxicology_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN toxicology_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN toxicology_test_request.referral_date IS
    'Date the request was made.';
COMMENT ON COLUMN toxicology_test_request.requested_by_date IS
    'Date by which the test is requested to be performed.';
COMMENT ON COLUMN toxicology_test_request.paracetamol_level IS
    'Whether a paracetamol (acetaminophen) level is requested. Interpretable on the treatment nomogram only at >=4 h post-ingestion.';
COMMENT ON COLUMN toxicology_test_request.salicylate_level IS
    'Whether a salicylate (aspirin) level is requested.';
COMMENT ON COLUMN toxicology_test_request.alcohol_level IS
    'Whether a blood alcohol (ethanol) level is requested.';
COMMENT ON COLUMN toxicology_test_request.drugs_of_abuse_screen IS
    'Whether a drugs-of-abuse screen (e.g. opiates, benzodiazepines, cocaine, amphetamines) is requested.';
COMMENT ON COLUMN toxicology_test_request.lithium_level IS
    'Whether a lithium level is requested.';
COMMENT ON COLUMN toxicology_test_request.digoxin_level IS
    'Whether a digoxin level is requested.';
COMMENT ON COLUMN toxicology_test_request.antiepileptic_drug_level IS
    'Whether an antiepileptic drug level (e.g. phenytoin, carbamazepine, valproate) is requested.';
COMMENT ON COLUMN toxicology_test_request.carboxyhaemoglobin IS
    'Whether a carboxyhaemoglobin (COHb, carbon-monoxide exposure) level is requested.';
COMMENT ON COLUMN toxicology_test_request.heavy_metals IS
    'Whether a heavy-metals screen (e.g. lead, mercury, arsenic) is requested.';
COMMENT ON COLUMN toxicology_test_request.specific_drug_level IS
    'Whether a specific (named) drug level is requested; the named agent is given in suspected_agent.';
COMMENT ON COLUMN toxicology_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring: suspected-overdose, deliberate-self-harm, therapeutic-drug-monitoring, suspected-poisoning, substance-misuse-screen, occupational-screen, forensic, other.';
COMMENT ON COLUMN toxicology_test_request.clinical_details IS
    'Clinical details / history supporting the request (highest-value completeness field).';
COMMENT ON COLUMN toxicology_test_request.suspected_agent IS
    'Suspected toxic agent or named drug, free text.';
COMMENT ON COLUMN toxicology_test_request.time_since_ingestion_hours IS
    'Hours since ingestion, used for timing appropriateness (e.g. paracetamol nomogram requires >=4 h).';
COMMENT ON COLUMN toxicology_test_request.deliberate_overdose IS
    'Whether the exposure is a deliberate overdose (triggers safeguarding / triage escalation).';
COMMENT ON COLUMN toxicology_test_request.symptomatic IS
    'Whether the patient is currently symptomatic from the exposure.';
COMMENT ON COLUMN toxicology_test_request.specimen_collected IS
    'Whether the specimen has been collected: yes, no.';
COMMENT ON COLUMN toxicology_test_request.collection_datetime IS
    'Timestamp when the specimen was collected.';
COMMENT ON COLUMN toxicology_test_request.urgency IS
    'Requested triage urgency: routine, urgent, stat.';
COMMENT ON COLUMN toxicology_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN toxicology_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN toxicology_test_request.notes IS
    'Free-text additional notes.';
