-- One requested test (a ticked box in section 7) of a transplant recipient request.

CREATE TABLE medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request_test (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    request_id UUID NOT NULL REFERENCES medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request(id) ON DELETE CASCADE,
    test_code VARCHAR(60) NOT NULL CHECK (test_code IN ('list-registration-first-typing-and-retyping', 'list-registration-returning-to-list', 'list-registration-other', 'deceased-donor-full-crossmatch', 'deceased-donor-day-of-transplant', 'living-donor-full-crossmatch', 'living-donor-day-of-transplant', 'living-donor-virtual-crossmatch', 'living-donor-match-grade', 'living-donor-abo-titres-only', 'autologous-crossmatch', 'hla-antibody-monitoring-routine-transplant-list', 'hla-antibody-monitoring-routine-post-transplant', 'hla-antibody-monitoring-post-transfusion', 'hla-rejection-investigation', 'abo-incompatible-transplant-monitoring', 'red-cell-antibody-follow-up')),
    test_detail VARCHAR(255) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_mrtrr_test_updated_at
    BEFORE UPDATE ON medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request_test
    FOR EACH ROW
    EXECUTE FUNCTION medical_renal_transplant_recipient_request.set_updated_at();

COMMENT ON TABLE medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request_test IS
    'One requested test of a transplant recipient request, such as typing, crossmatch, HLA antibody monitoring or rejection investigation.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request_test.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request_test.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request_test.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request_test.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request_test.request_id IS
    'Foreign key to the parent request.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request_test.test_code IS
    'Requested test code, one of the 17 tests offered in section 7 of the request.';
COMMENT ON COLUMN medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request_test.test_detail IS
    'Free-text detail, for example the specific test when "other" is chosen (e.g. ABO only).';

CREATE UNIQUE INDEX index_mrtrr_test_request_id_test_code
    ON medical_renal_transplant_recipient_request.medical_renal_transplant_recipient_request_test(request_id, test_code) WHERE deleted_at IS NULL;
