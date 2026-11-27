-- One requested test (a ticked box) of the request.

CREATE TABLE medical_renal_living_donor_request.medical_renal_living_donor_request_test (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    request_id UUID NOT NULL REFERENCES medical_renal_living_donor_request.medical_renal_living_donor_request(id) ON DELETE CASCADE,
    test_code VARCHAR(60) NOT NULL CHECK (test_code IN ('living-donor-full-crossmatch', 'living-donor-virtual-crossmatch', 'living-donor-match-grade', 'altruistic-donor', 'day-of-transplant-samples', 'abo-titres-only', 'red-cell-antibody-follow-up')),
    test_detail VARCHAR(255) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_mrldr_test_updated_at
    BEFORE UPDATE ON medical_renal_living_donor_request.medical_renal_living_donor_request_test
    FOR EACH ROW
    EXECUTE FUNCTION medical_renal_living_donor_request.set_updated_at();

COMMENT ON TABLE medical_renal_living_donor_request.medical_renal_living_donor_request_test IS
    'One requested test of a living-donor request: full, virtual or match-grade testing, altruistic donor, day-of-transplant samples, ABO titres or red-cell antibody follow-up.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request_test.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request_test.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request_test.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request_test.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request_test.request_id IS
    'Foreign key to the parent request.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request_test.test_code IS
    'Requested test code.';
COMMENT ON COLUMN medical_renal_living_donor_request.medical_renal_living_donor_request_test.test_detail IS
    'Free-text detail, for example the antigen when "other" is chosen.';

CREATE UNIQUE INDEX index_mrldr_test_request_id_test_code
    ON medical_renal_living_donor_request.medical_renal_living_donor_request_test(request_id, test_code) WHERE deleted_at IS NULL;
