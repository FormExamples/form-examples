-- Blood cross-match / transfusion compatibility request (referral) — the source-of-truth record.

CREATE TABLE blood_cross_match_test_request (
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

    -- Requested test / component
    request_type VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (request_type IN ('group-and-save', 'crossmatch', 'emergency-o-negative', 'antibody-screen', 'other', '')),
    component VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (component IN ('red-cells', 'platelets', 'fresh-frozen-plasma', 'cryoprecipitate', 'none', '')),
    units_required INTEGER
        CHECK (units_required IS NULL OR units_required BETWEEN 0 AND 50),
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('surgery', 'acute-bleeding', 'anaemia', 'obstetric-haemorrhage', 'chemotherapy-support', 'transfusion-dependent', 'other', '')),
    clinical_details VARCHAR(1000) NOT NULL DEFAULT '',

    -- Blood group / antibody / transfusion history
    patient_blood_group VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (patient_blood_group IN ('a-pos', 'a-neg', 'b-pos', 'b-neg', 'o-pos', 'o-neg', 'ab-pos', 'ab-neg', 'unknown', '')),
    known_antibodies BOOLEAN NOT NULL DEFAULT FALSE,
    antibody_detail VARCHAR(1000) NOT NULL DEFAULT '',
    previous_transfusion BOOLEAN NOT NULL DEFAULT FALSE,
    previous_transfusion_reaction BOOLEAN NOT NULL DEFAULT FALSE,
    pregnant BOOLEAN NOT NULL DEFAULT FALSE,

    -- Sample / identity safety
    sample_collected VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (sample_collected IN ('yes', 'no', '')),
    collection_datetime TIMESTAMPTZ,
    two_sample_rule_met BOOLEAN NOT NULL DEFAULT FALSE,
    required_by_datetime TIMESTAMPTZ,

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'emergency', 'stat', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_blood_cross_match_test_request_patient_id
    ON blood_cross_match_test_request(patient_id);
CREATE INDEX index_blood_cross_match_test_request_clinician_id
    ON blood_cross_match_test_request(clinician_id);

CREATE TRIGGER trigger_blood_cross_match_test_request_updated_at
    BEFORE UPDATE ON blood_cross_match_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE blood_cross_match_test_request IS
    'Blood cross-match / transfusion compatibility request (referral). Captures the requested test type and component, the clinical indication, the patient blood group, antibody and transfusion history, sample collection and two-sample-rule status, and triage urgency.';
COMMENT ON COLUMN blood_cross_match_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN blood_cross_match_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN blood_cross_match_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN blood_cross_match_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN blood_cross_match_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN blood_cross_match_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN blood_cross_match_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN blood_cross_match_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN blood_cross_match_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN blood_cross_match_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN blood_cross_match_test_request.requested_by_date IS
    'Date by which the test / component is requested to be available.';
COMMENT ON COLUMN blood_cross_match_test_request.request_type IS
    'Requested test type: group-and-save, crossmatch, emergency-o-negative, antibody-screen, other.';
COMMENT ON COLUMN blood_cross_match_test_request.component IS
    'Requested blood component: red-cells, platelets, fresh-frozen-plasma, cryoprecipitate, none.';
COMMENT ON COLUMN blood_cross_match_test_request.units_required IS
    'Number of units of the requested component (0-50).';
COMMENT ON COLUMN blood_cross_match_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring against NICE NG24 thresholds.';
COMMENT ON COLUMN blood_cross_match_test_request.clinical_details IS
    'Clinical details supporting the request (highest-value free-text field).';
COMMENT ON COLUMN blood_cross_match_test_request.patient_blood_group IS
    'Known patient ABO/Rh blood group: a-pos, a-neg, b-pos, b-neg, o-pos, o-neg, ab-pos, ab-neg, unknown.';
COMMENT ON COLUMN blood_cross_match_test_request.known_antibodies IS
    'Whether the patient has known red-cell alloantibodies (requires extra crossmatch time).';
COMMENT ON COLUMN blood_cross_match_test_request.antibody_detail IS
    'Detail of any known antibodies (specificity, source, antigen-negative requirements).';
COMMENT ON COLUMN blood_cross_match_test_request.previous_transfusion IS
    'Whether the patient has been transfused previously.';
COMMENT ON COLUMN blood_cross_match_test_request.previous_transfusion_reaction IS
    'Whether the patient has had a previous transfusion reaction.';
COMMENT ON COLUMN blood_cross_match_test_request.pregnant IS
    'Whether the patient is currently pregnant (alloimmunisation / anti-D relevance).';
COMMENT ON COLUMN blood_cross_match_test_request.sample_collected IS
    'Whether a pre-transfusion sample has been collected: yes, no.';
COMMENT ON COLUMN blood_cross_match_test_request.collection_datetime IS
    'Date and time the pre-transfusion sample was collected.';
COMMENT ON COLUMN blood_cross_match_test_request.two_sample_rule_met IS
    'Whether the BSH/SHOT two-sample (group-check) rule has been satisfied for this patient.';
COMMENT ON COLUMN blood_cross_match_test_request.required_by_datetime IS
    'Date and time by which compatible blood is required.';
COMMENT ON COLUMN blood_cross_match_test_request.urgency IS
    'Requested triage urgency: routine, urgent, emergency, stat.';
COMMENT ON COLUMN blood_cross_match_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN blood_cross_match_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN blood_cross_match_test_request.notes IS
    'Free-text additional notes.';
