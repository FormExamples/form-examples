-- Renal transplant recipient histocompatibility / immunogenetics request — the source-of-truth record.

CREATE TABLE medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL REFERENCES medical_renal_transplant_recipient_request.patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES medical_renal_transplant_recipient_request.clinician(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'received', 'vetted', 'rejected', '')),
    request_date DATE,
    organ_required VARCHAR(20) NOT NULL DEFAULT '' CHECK (organ_required IN ('kidney', 'kidney-pancreas', 'pancreas', '')),
    previous_transplant_count INTEGER CHECK (previous_transplant_count IS NULL OR previous_transplant_count BETWEEN 0 AND 20),
    previous_transplant_dates VARCHAR(500) NOT NULL DEFAULT '',
    transfusion_count INTEGER CHECK (transfusion_count IS NULL OR transfusion_count BETWEEN 0 AND 500),
    transfusion_dates VARCHAR(500) NOT NULL DEFAULT '',
    pregnancy_count INTEGER CHECK (pregnancy_count IS NULL OR pregnancy_count BETWEEN 0 AND 30),
    pregnancy_dates VARCHAR(500) NOT NULL DEFAULT '',
    autoimmune_disease BOOLEAN NOT NULL DEFAULT FALSE,
    virology_risk BOOLEAN NOT NULL DEFAULT FALSE,
    immunosuppression VARCHAR(500) NOT NULL DEFAULT '',
    clinical_information VARCHAR(1000) NOT NULL DEFAULT '',
    recipient_abo_group VARCHAR(10) NOT NULL DEFAULT '' CHECK (recipient_abo_group IN ('a', 'b', 'ab', 'o', 'unknown', '')),
    dialysis_mode VARCHAR(30) NOT NULL DEFAULT '' CHECK (dialysis_mode IN ('unit-haemodialysis', 'capd', 'home-peritoneal-dialysis', 'pre-dialysis', 'failing-transplant', '')),
    dialysis_unit_name VARCHAR(255) NOT NULL DEFAULT '',
    urgent_testing BOOLEAN NOT NULL DEFAULT FALSE,
    urgent_testing_reason VARCHAR(500) NOT NULL DEFAULT '',
    dfpp_status VARCHAR(10) NOT NULL DEFAULT '' CHECK (dfpp_status IN ('pre-dfpp', 'post-dfpp', 'no-dfpp', '')),
    post_transfusion_dates_and_number VARCHAR(500) NOT NULL DEFAULT '',
    donor_reference VARCHAR(100) NOT NULL DEFAULT '',
    requested_by_signed_at TIMESTAMPTZ,
    transplant_centre_name VARCHAR(255) NOT NULL DEFAULT '',
    consent_and_identity_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    sample_collector_name VARCHAR(255) NOT NULL DEFAULT '',
    sample_collected_at TIMESTAMPTZ,
    identifiers_on_sample_count INTEGER CHECK (identifiers_on_sample_count IS NULL OR identifiers_on_sample_count BETWEEN 0 AND 10),
    identifiers_on_form_count INTEGER CHECK (identifiers_on_form_count IS NULL OR identifiers_on_form_count BETWEEN 0 AND 10),
    sample_and_form_details_match BOOLEAN NOT NULL DEFAULT FALSE,
    samples_edta_purple_count INTEGER CHECK (samples_edta_purple_count IS NULL OR samples_edta_purple_count BETWEEN 0 AND 20),
    samples_edta_pink_hand_labelled_count INTEGER CHECK (samples_edta_pink_hand_labelled_count IS NULL OR samples_edta_pink_hand_labelled_count BETWEEN 0 AND 20),
    samples_serum_count INTEGER CHECK (samples_serum_count IS NULL OR samples_serum_count BETWEEN 0 AND 20),
    samples_other_description VARCHAR(255) NOT NULL DEFAULT '',
    laboratory_donor_identifier VARCHAR(100) NOT NULL DEFAULT '',
    laboratory_recipient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    laboratory_sample_number VARCHAR(100) NOT NULL DEFAULT '',
    laboratory_sample_received_at TIMESTAMPTZ,
    laboratory_identifiers_checked_by VARCHAR(255) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_mrtrr_request_updated_at
    BEFORE UPDATE ON medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request
    FOR EACH ROW
    EXECUTE FUNCTION medical_renal_transplant_recipient_request.set_updated_at();

COMMENT ON TABLE medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request IS
    'Renal transplant recipient request: organ required, sensitisation history, clinical information, dialysis, requester and sample-collection details, and laboratory-use fields. Requested tests are in the child table.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.patient_id IS
    'Foreign key to the transplant recipient.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.clinician_id IS
    'Foreign key to the requesting clinician.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.status IS
    'Request lifecycle status: draft, submitted, received, vetted, rejected.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.request_date IS
    'Date the request was made.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.organ_required IS
    'Organ required: kidney, kidney-pancreas, pancreas.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.previous_transplant_count IS
    'Number of previous transplants; NULL when unknown or not answered.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.previous_transplant_dates IS
    'Dates of previous transplants.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.transfusion_count IS
    'Number of previous blood transfusions; NULL when unknown or not answered.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.transfusion_dates IS
    'Dates of previous transfusions.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.pregnancy_count IS
    'Number of previous pregnancies; NULL when unknown, not applicable or not answered.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.pregnancy_dates IS
    'Dates of previous pregnancies.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.autoimmune_disease IS
    'Whether the recipient has an autoimmune disease.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.virology_risk IS
    'Whether the recipient has a virology risk (for example a blood-borne virus) the laboratory should know about.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.immunosuppression IS
    'Current immunosuppression, if any.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.clinical_information IS
    'Additional clinical information supporting the request.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.recipient_abo_group IS
    'Recipient ABO blood group, if known: a, b, ab, o, unknown. Not on the source paper form; recommended for ABO-incompatibility checks.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.dialysis_mode IS
    'Mode of dialysis: unit-haemodialysis, capd, home-peritoneal-dialysis, pre-dialysis, failing-transplant.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.dialysis_unit_name IS
    'Name of the recipient''s dialysis unit (free text so any region can use it).';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.urgent_testing IS
    'Whether the samples require urgent testing.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.urgent_testing_reason IS
    'Reason urgent testing is needed.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.dfpp_status IS
    'Double-filtration plasmapheresis (DFPP) status for ABO-incompatible transplant monitoring: pre-dfpp, post-dfpp, no-dfpp.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.post_transfusion_dates_and_number IS
    'Date(s) and number of transfusions, for post-transfusion HLA antibody monitoring.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.donor_reference IS
    'Donor identifier or reference supplied by the requester for donor-specific tests, if any.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.requested_by_signed_at IS
    'When the requester signed the request.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.transplant_centre_name IS
    'Name of the transplant centre.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.consent_and_identity_confirmed IS
    'Requester confirms informed consent was obtained and patient identity verified for the requested tests.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.sample_collector_name IS
    'Name of the person who collected the samples.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.sample_collected_at IS
    'Date and time the samples were collected.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.identifiers_on_sample_count IS
    'Number of patient identifiers on the sample labels (minimum 3 required).';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.identifiers_on_form_count IS
    'Number of patient identifiers on the request form (minimum 3 required).';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.sample_and_form_details_match IS
    'Whether the details on the samples and the form match.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.samples_edta_purple_count IS
    'Number of purple-top EDTA tubes (addressograph-labelled) sent.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.samples_edta_pink_hand_labelled_count IS
    'Number of pink-top EDTA tubes (hand-labelled) sent.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.samples_serum_count IS
    'Number of serum tubes (red or gold) sent.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.samples_other_description IS
    'Other sample types sent, if any.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.laboratory_donor_identifier IS
    'Laboratory use: donor identifier assigned by the laboratory.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.laboratory_recipient_identifier IS
    'Laboratory use: recipient identifier assigned by the laboratory.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.laboratory_sample_number IS
    'Laboratory use: sample number.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.laboratory_sample_received_at IS
    'Laboratory use: date and time the sample was received.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request.laboratory_identifiers_checked_by IS
    'Laboratory use: name of the person who checked the sample identifiers.';

CREATE INDEX index_mrtrr_request_patient_id ON medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request(patient_id);
CREATE INDEX index_mrtrr_request_clinician_id ON medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request(clinician_id);
