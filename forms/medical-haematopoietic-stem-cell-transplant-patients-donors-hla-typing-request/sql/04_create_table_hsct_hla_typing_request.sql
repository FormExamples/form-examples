-- Haematopoietic stem cell transplant (HSCT) HLA-typing request: the source-of-truth record.

CREATE TABLE medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    subject_id UUID NOT NULL REFERENCES medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.subject(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.clinician(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'received', 'vetted', 'rejected', '')),
    request_date DATE,
    subject_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (subject_role IN ('hsct-recipient', 'potential-donor', '')),
    donor_type VARCHAR(30) NOT NULL DEFAULT '' CHECK (donor_type IN ('matched-sibling', 'haploidentical-relative', 'other-relative', 'unrelated-volunteer', 'unknown', '')),
    hla_typing_resolution VARCHAR(20) NOT NULL DEFAULT '' CHECK (hla_typing_resolution IN ('not-specified', 'low', 'high', '')),
    ethnicity VARCHAR(100) NOT NULL DEFAULT '',
    clinical_details VARCHAR(1000) NOT NULL DEFAULT '',
    referrer_department VARCHAR(255) NOT NULL DEFAULT '',
    referrer_organization VARCHAR(255) NOT NULL DEFAULT '',
    copy_of_report_to VARCHAR(255) NOT NULL DEFAULT '',
    report_email TEXT,
    recipient_family_name VARCHAR(255) NOT NULL DEFAULT '',
    recipient_given_names VARCHAR(255) NOT NULL DEFAULT '',
    recipient_medical_record_number VARCHAR(40) NOT NULL DEFAULT '',
    recipient_birth_date DATE,
    relationship_to_recipient VARCHAR(100) NOT NULL DEFAULT '',
    urgent_testing BOOLEAN NOT NULL DEFAULT FALSE,
    urgent_testing_reason VARCHAR(500) NOT NULL DEFAULT '',
    requested_by_signed_at TIMESTAMPTZ,
    consent_and_identity_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    sample_collector_name VARCHAR(255) NOT NULL DEFAULT '',
    sample_collected_at TIMESTAMPTZ,
    identifiers_on_sample_count INTEGER CHECK (identifiers_on_sample_count IS NULL OR identifiers_on_sample_count BETWEEN 0 AND 10),
    identifiers_on_form_count INTEGER CHECK (identifiers_on_form_count IS NULL OR identifiers_on_form_count BETWEEN 0 AND 10),
    sample_and_form_details_match BOOLEAN NOT NULL DEFAULT FALSE,
    edta_purple_volume_ml INTEGER CHECK (edta_purple_volume_ml IS NULL OR edta_purple_volume_ml BETWEEN 0 AND 100),
    edta_pink_volume_ml INTEGER CHECK (edta_pink_volume_ml IS NULL OR edta_pink_volume_ml BETWEEN 0 AND 100),
    clotted_red_volume_ml INTEGER CHECK (clotted_red_volume_ml IS NULL OR clotted_red_volume_ml BETWEEN 0 AND 100),
    samples_other_description VARCHAR(255) NOT NULL DEFAULT '',
    laboratory_recipient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    laboratory_donor_identifier VARCHAR(100) NOT NULL DEFAULT '',
    laboratory_sample_number VARCHAR(100) NOT NULL DEFAULT '',
    laboratory_sample_received_at TIMESTAMPTZ,
    laboratory_identifiers_checked_by VARCHAR(255) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_mhsct_request_updated_at
    BEFORE UPDATE ON medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request
    FOR EACH ROW
    EXECUTE FUNCTION medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.set_updated_at();

COMMENT ON TABLE medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request IS
    'HSCT HLA-typing request for one person (recipient or potential donor): role, donor type, clinical details, linked recipient details when the sample is from a relative, referrer, urgency, sample collection and laboratory-use fields.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.subject_id IS
    'Foreign key to the person sampled.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.clinician_id IS
    'Foreign key to the requesting clinician.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.status IS
    'Request lifecycle status: draft, submitted, received, vetted, rejected.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.request_date IS
    'Date the request was made.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.subject_role IS
    'Role of the person sampled: hsct-recipient, potential-donor. Separates the two sample sets the laboratory needs.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.donor_type IS
    'Donor type when subject_role is potential-donor: matched-sibling, haploidentical-relative, other-relative, unrelated-volunteer, unknown. Not on the source form; recommended.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.hla_typing_resolution IS
    'HLA typing resolution requested: not-specified, low, high. Not on the source form; recommended.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.ethnicity IS
    'Self-described ethnicity (mandatory on the source form); informs HLA haplotype interpretation.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.clinical_details IS
    'Clinical details: disease, indication for HSCT, or donor information.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.referrer_department IS
    'Department or practice of the requesting clinician.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.referrer_organization IS
    'Hospital or organization of the requesting clinician.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.copy_of_report_to IS
    'Name or address for a copy of the report, if any.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.report_email IS
    'Preferred email address for the report. Health data: use an authorized secure address only.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.recipient_family_name IS
    'When the sample is from a relative: the recipient''s family name.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.recipient_given_names IS
    'When the sample is from a relative: the recipient''s given names.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.recipient_medical_record_number IS
    'When the sample is from a relative: the recipient''s medical record number.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.recipient_birth_date IS
    'When the sample is from a relative: the recipient''s birth date.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.relationship_to_recipient IS
    'When the sample is from a relative: relationship to the recipient (for example sibling, parent, child).';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.urgent_testing IS
    'Whether the sample requires urgent testing (the source form says to telephone the laboratory).';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.urgent_testing_reason IS
    'Reason urgent testing is needed.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.requested_by_signed_at IS
    'When the requester signed the request.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.consent_and_identity_confirmed IS
    'Requester confirms informed consent was obtained (donor consent separate from recipient consent) and identity verified.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.sample_collector_name IS
    'Name of the person who collected the sample.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.sample_collected_at IS
    'Date and time the sample was collected.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.identifiers_on_sample_count IS
    'Number of identifiers on the sample labels (minimum 3 required).';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.identifiers_on_form_count IS
    'Number of identifiers on the request form (minimum 3 required).';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.sample_and_form_details_match IS
    'Whether the details on the samples and the form match.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.edta_purple_volume_ml IS
    'Total volume of purple-top EDTA blood sent, in mL (recipient 18, potential donor 10 expected).';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.edta_pink_volume_ml IS
    'Total volume of pink-top (hand-labelled) EDTA blood sent, in mL (6 expected).';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.clotted_red_volume_ml IS
    'Volume of clotted red-top blood sent, in mL (recipient only, 6 expected).';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.samples_other_description IS
    'Other sample types sent, if any.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.laboratory_recipient_identifier IS
    'Laboratory use: recipient identifier assigned by the laboratory.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.laboratory_donor_identifier IS
    'Laboratory use: donor identifier assigned by the laboratory.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.laboratory_sample_number IS
    'Laboratory use: sample number.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.laboratory_sample_received_at IS
    'Laboratory use: date and time the sample was received.';
COMMENT ON COLUMN medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request.laboratory_identifiers_checked_by IS
    'Laboratory use: name of the person who checked the sample identifiers.';

CREATE INDEX index_mhsct_request_subject_id ON medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request(subject_id);
CREATE INDEX index_mhsct_request_clinician_id ON medical_haematopoietic_stem_cell_transplant_patients_donors_hla_typing_request.hsct_hla_typing_request(clinician_id);
