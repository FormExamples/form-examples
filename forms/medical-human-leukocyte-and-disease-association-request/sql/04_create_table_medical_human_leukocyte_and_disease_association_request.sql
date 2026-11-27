-- HLA and disease association request: the source-of-truth record.

CREATE TABLE medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL REFERENCES medical_human_leukocyte_and_disease_association_request.patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES medical_human_leukocyte_and_disease_association_request.clinician(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'received', 'vetted', 'rejected', '')),
    request_date DATE,
    referrer_department VARCHAR(255) NOT NULL DEFAULT '',
    referrer_organization VARCHAR(255) NOT NULL DEFAULT '',
    copy_of_report_to VARCHAR(255) NOT NULL DEFAULT '',
    report_email TEXT,
    clinical_details VARCHAR(1000) NOT NULL DEFAULT '',
    indication_category VARCHAR(40) NOT NULL DEFAULT '' CHECK (indication_category IN ('suspected-disease', 'pre-treatment-drug-hypersensitivity', 'treatment-response', 'family-screening', 'exclusion-of-disease', 'other', '')),
    ethnicity VARCHAR(100) NOT NULL DEFAULT '',
    previous_hla_typing_known BOOLEAN NOT NULL DEFAULT FALSE,
    planned_drug VARCHAR(100) NOT NULL DEFAULT '',
    urgent_testing BOOLEAN NOT NULL DEFAULT FALSE,
    urgent_testing_reason VARCHAR(500) NOT NULL DEFAULT '',
    high_risk_sample BOOLEAN NOT NULL DEFAULT FALSE,
    high_risk_description VARCHAR(255) NOT NULL DEFAULT '',
    requested_by_signed_at TIMESTAMPTZ,
    consent_and_identity_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    sample_collector_name VARCHAR(255) NOT NULL DEFAULT '',
    sample_collected_at TIMESTAMPTZ,
    identifiers_on_sample_count INTEGER CHECK (identifiers_on_sample_count IS NULL OR identifiers_on_sample_count BETWEEN 0 AND 10),
    identifiers_on_form_count INTEGER CHECK (identifiers_on_form_count IS NULL OR identifiers_on_form_count BETWEEN 0 AND 10),
    sample_and_form_details_match BOOLEAN NOT NULL DEFAULT FALSE,
    sample_volume_ml INTEGER CHECK (sample_volume_ml IS NULL OR sample_volume_ml BETWEEN 0 AND 50),
    samples_other_description VARCHAR(255) NOT NULL DEFAULT '',
    laboratory_sample_number VARCHAR(100) NOT NULL DEFAULT '',
    laboratory_sample_received_at TIMESTAMPTZ,
    laboratory_identifiers_checked_by VARCHAR(255) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_mhldar_request_updated_at
    BEFORE UPDATE ON medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request
    FOR EACH ROW
    EXECUTE FUNCTION medical_human_leukocyte_and_disease_association_request.set_updated_at();

COMMENT ON TABLE medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request IS
    'HLA and disease association request: the HLA types requested, the clinical details (indication), report destination, high-risk sample status, requester and sample-collection details, and laboratory-use fields. Requested tests are in the child table.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.clinician_id IS
    'Foreign key to the requesting consultant or general practitioner.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.status IS
    'Request lifecycle status: draft, submitted, received, vetted, rejected.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.request_date IS
    'Date the request was made.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.referrer_department IS
    'Department or practice of the requesting clinician.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.referrer_organization IS
    'Hospital or organization of the requesting clinician.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.copy_of_report_to IS
    'Name or address for a copy of the report, if any.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.report_email IS
    'Preferred email address for the report. Health data: use an authorized secure address only.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.clinical_details IS
    'Clinical details and suspected condition (the indication); the main input to the appropriateness axis.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.indication_category IS
    'Structured indication category (added; the source form has only a free-text box): suspected-disease, pre-treatment-drug-hypersensitivity, treatment-response, family-screening, exclusion-of-disease, other.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.ethnicity IS
    'Self-described ethnicity; allele frequencies differ by population.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.previous_hla_typing_known IS
    'Whether the patient has been HLA typed before (a result is lifelong, so repeat testing is usually unnecessary).';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.planned_drug IS
    'Drug whose prescribing depends on the result (for example abacavir or an anti-TNF agent), if any.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.urgent_testing IS
    'Whether the sample requires urgent testing.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.urgent_testing_reason IS
    'Reason urgent testing is needed.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.high_risk_sample IS
    'Whether the sample is high risk (for example infectious) and has been labelled and packaged accordingly.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.high_risk_description IS
    'Nature of the risk, if any.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.requested_by_signed_at IS
    'When the requester signed the request.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.consent_and_identity_confirmed IS
    'Requester confirms informed consent was obtained (including for genetic testing) and identity verified.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.sample_collector_name IS
    'Name of the person who collected the sample.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.sample_collected_at IS
    'Date and time the sample was collected.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.identifiers_on_sample_count IS
    'Number of patient identifiers on the sample label (minimum 3 required).';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.identifiers_on_form_count IS
    'Number of patient identifiers on the request form (minimum 3 required).';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.sample_and_form_details_match IS
    'Whether the details on the sample and the form match.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.sample_volume_ml IS
    'Volume of EDTA blood sent in mL (5-10 mL expected).';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.samples_other_description IS
    'Other sample types sent, if any.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.laboratory_sample_number IS
    'Laboratory use: sample number.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.laboratory_sample_received_at IS
    'Laboratory use: date and time the sample was received.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request.laboratory_identifiers_checked_by IS
    'Laboratory use: name of the person who checked the sample identifiers.';

CREATE INDEX index_mhldar_request_patient_id ON medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request(patient_id);
CREATE INDEX index_mhldar_request_clinician_id ON medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request(clinician_id);
