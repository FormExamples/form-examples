-- Renal living-donor histocompatibility request: the source-of-truth record.

CREATE TABLE medical_renal_living_donor_request.medical_renal_living_donor_request (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    donor_id UUID NOT NULL REFERENCES medical_renal_living_donor_request.donor(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES medical_renal_living_donor_request.recipient(id) ON DELETE SET NULL,
    clinician_id UUID NOT NULL REFERENCES medical_renal_living_donor_request.clinician(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'received', 'vetted', 'rejected', '')),
    request_date DATE,
    donation_pathway VARCHAR(20) NOT NULL DEFAULT '' CHECK (donation_pathway IN ('directed', 'altruistic', 'paired-exchange', '')),
    relationship_of_donor_to_recipient VARCHAR(255) NOT NULL DEFAULT '',
    recipient_transplant_centre_name VARCHAR(255) NOT NULL DEFAULT '',
    donor_abo_group VARCHAR(10) NOT NULL DEFAULT '' CHECK (donor_abo_group IN ('a', 'b', 'ab', 'o', 'unknown', '')),
    recipient_abo_group VARCHAR(10) NOT NULL DEFAULT '' CHECK (recipient_abo_group IN ('a', 'b', 'ab', 'o', 'unknown', '')),
    urgent_testing BOOLEAN NOT NULL DEFAULT FALSE,
    urgent_testing_reason VARCHAR(500) NOT NULL DEFAULT '',
    transplant_centre_name VARCHAR(255) NOT NULL DEFAULT '',
    requested_by_signed_at TIMESTAMPTZ,
    consent_and_identity_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    sample_collector_name VARCHAR(255) NOT NULL DEFAULT '',
    sample_collected_at TIMESTAMPTZ,
    identifiers_on_sample_count INTEGER CHECK (identifiers_on_sample_count IS NULL OR identifiers_on_sample_count BETWEEN 0 AND 10),
    identifiers_on_form_count INTEGER CHECK (identifiers_on_form_count IS NULL OR identifiers_on_form_count BETWEEN 0 AND 10),
    sample_and_form_details_match BOOLEAN NOT NULL DEFAULT FALSE,
    samples_edta_purple_count INTEGER CHECK (samples_edta_purple_count IS NULL OR samples_edta_purple_count BETWEEN 0 AND 20),
    samples_edta_pink_hand_labelled_count INTEGER CHECK (samples_edta_pink_hand_labelled_count IS NULL OR samples_edta_pink_hand_labelled_count BETWEEN 0 AND 20),
    samples_other_description VARCHAR(255) NOT NULL DEFAULT '',
    laboratory_donor_identifier VARCHAR(100) NOT NULL DEFAULT '',
    laboratory_recipient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    laboratory_sample_number VARCHAR(100) NOT NULL DEFAULT '',
    laboratory_sample_received_at TIMESTAMPTZ,
    laboratory_identifiers_checked_by VARCHAR(255) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_mrldr_request_updated_at
    BEFORE UPDATE ON medical_renal_living_donor_request.medical_renal_living_donor_request
    FOR EACH ROW
    EXECUTE FUNCTION medical_renal_living_donor_request.set_updated_at();

COMMENT ON TABLE medical_renal_living_donor_request.medical_renal_living_donor_request IS
    'Renal living-donor request: donor and recipient references, relationship, ABO groups, requester and sample-collection details, and laboratory-use fields. Requested tests are in the child table.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.donor_id IS
    'Foreign key to the living donor.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.recipient_id IS
    'Foreign key to the intended recipient; NULL for an altruistic (non-directed) donor.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.clinician_id IS
    'Foreign key to the requesting clinician.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.status IS
    'Request lifecycle status: draft, submitted, received, vetted, rejected.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.request_date IS
    'Date the request was made.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.donation_pathway IS
    'Donation pathway: directed (to a named recipient), altruistic (non-directed), paired-exchange. Replaces the source form listing "altruistic donor" as a test.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.relationship_of_donor_to_recipient IS
    'Relationship of the donor to the recipient, free text (for example parent, sibling, spouse, friend, none).';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.recipient_transplant_centre_name IS
    'Transplant centre of the recipient, when the recipient is treated elsewhere.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.donor_abo_group IS
    'Donor ABO blood group, if known: a, b, ab, o, unknown.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.recipient_abo_group IS
    'Recipient ABO blood group, if known: a, b, ab, o, unknown.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.urgent_testing IS
    'Whether the samples require urgent testing.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.urgent_testing_reason IS
    'Reason urgent testing is needed.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.transplant_centre_name IS
    'Name of the requesting transplant centre.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.requested_by_signed_at IS
    'When the requester signed the request.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.consent_and_identity_confirmed IS
    'Requester confirms informed consent was obtained from the donor and identity verified for the requested tests.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.sample_collector_name IS
    'Name of the person who collected the donor samples.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.sample_collected_at IS
    'Date and time the donor samples were collected.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.identifiers_on_sample_count IS
    'Number of donor identifiers on the sample labels (minimum 3 required).';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.identifiers_on_form_count IS
    'Number of donor identifiers on the request form (minimum 3 required).';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.sample_and_form_details_match IS
    'Whether the details on the samples and the form match.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.samples_edta_purple_count IS
    'Number of purple-top EDTA tubes (addressograph-labelled) sent.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.samples_edta_pink_hand_labelled_count IS
    'Number of pink-top EDTA tubes (hand-labelled) sent.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.samples_other_description IS
    'Other sample types sent, if any.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.laboratory_donor_identifier IS
    'Laboratory use: donor identifier assigned by the laboratory.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.laboratory_recipient_identifier IS
    'Laboratory use: recipient identifier assigned by the laboratory.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.laboratory_sample_number IS
    'Laboratory use: sample number.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.laboratory_sample_received_at IS
    'Laboratory use: date and time the sample was received.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request.laboratory_identifiers_checked_by IS
    'Laboratory use: name of the person who checked the sample identifiers.';

CREATE INDEX index_mrldr_request_donor_id ON medical_renal_living_donor_request.medical_renal_living_donor_request(donor_id);
CREATE INDEX index_mrldr_request_recipient_id ON medical_renal_living_donor_request.medical_renal_living_donor_request(recipient_id);
CREATE INDEX index_mrldr_request_clinician_id ON medical_renal_living_donor_request.medical_renal_living_donor_request(clinician_id);
