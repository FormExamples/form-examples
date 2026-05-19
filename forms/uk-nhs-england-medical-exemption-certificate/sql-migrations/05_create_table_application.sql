-- An FP92A medical exemption application.
--
-- One row per submission. Joins a patient (applicant), a practitioner (signer)
-- and zero-or-more qualifying conditions (via application_eligible_condition).

CREATE TABLE application (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL
        REFERENCES patient(id) ON DELETE CASCADE,
    practitioner_id UUID NOT NULL
        REFERENCES practitioner(id) ON DELETE CASCADE,

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'ready-to-post', 'posted', 'issued', 'rejected', 'expired', 'cancelled')),

    application_kind VARCHAR(20) NOT NULL DEFAULT 'new'
        CHECK (application_kind IN ('new', 'renewal', 'replacement', '')),
    previous_certificate_number VARCHAR(50) NOT NULL DEFAULT '',
    previous_certificate_expiry_date DATE,

    completed_date DATE,
    posted_date DATE,
    received_by_nhsbsa_date DATE,
    certificate_number VARCHAR(50) NOT NULL DEFAULT '',
    valid_from DATE,
    valid_until DATE,

    practitioner_signature_present VARCHAR(5) NOT NULL DEFAULT '' CHECK (practitioner_signature_present IN ('yes', 'no', '')),
    practitioner_declaration_text TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_application_updated_at
    BEFORE UPDATE ON application
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE application IS
    'FP92A medical exemption application instance.';
COMMENT ON COLUMN application.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN application.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN application.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN application.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN application.patient_id IS
    'Foreign key to the applicant patient.';
COMMENT ON COLUMN application.practitioner_id IS
    'Foreign key to the signing practitioner.';
COMMENT ON COLUMN application.status IS
    'Lifecycle status: draft, ready-to-post, posted, issued, rejected, expired, cancelled.';
COMMENT ON COLUMN application.application_kind IS
    'New application, renewal of an expiring certificate, or replacement of a lost certificate.';
COMMENT ON COLUMN application.previous_certificate_number IS
    'Certificate number of the previous certificate (renewal / replacement).';
COMMENT ON COLUMN application.previous_certificate_expiry_date IS
    'Expiry date of the previous certificate, used for renewal-window checks.';
COMMENT ON COLUMN application.completed_date IS
    'Date the practitioner completed and signed the FP92A.';
COMMENT ON COLUMN application.posted_date IS
    'Date the FP92A was posted to NHSBSA Bridge House.';
COMMENT ON COLUMN application.received_by_nhsbsa_date IS
    'Date the FP92A was acknowledged received by NHSBSA.';
COMMENT ON COLUMN application.certificate_number IS
    'Issued certificate number (populated once NHSBSA returns the issued certificate).';
COMMENT ON COLUMN application.valid_from IS
    'Date the issued certificate becomes valid.';
COMMENT ON COLUMN application.valid_until IS
    'Date the issued certificate expires (typically valid_from + 5 years).';
COMMENT ON COLUMN application.practitioner_signature_present IS
    'Whether the practitioner has signed in ink before posting.';
COMMENT ON COLUMN application.practitioner_declaration_text IS
    'Free-text declaration as captured from the FP92A signature panel.';
COMMENT ON COLUMN application.notes IS
    'Internal notes about the application.';
