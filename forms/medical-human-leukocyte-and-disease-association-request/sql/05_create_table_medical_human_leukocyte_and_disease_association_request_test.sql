-- One requested test (a ticked box) of the request.

CREATE TABLE medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_test (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    request_id UUID NOT NULL REFERENCES medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request(id) ON DELETE CASCADE,
    test_code VARCHAR(60) NOT NULL CHECK (test_code IN ('hla-a29', 'hla-b27', 'hla-b51', 'hla-b-57-01', 'hla-dr15-dq6', 'hla-dq2-dq8', 'hla-dqa1-05', 'other-hla-disease-association')),
    test_detail VARCHAR(255) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_mhldar_test_updated_at
    BEFORE UPDATE ON medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_test
    FOR EACH ROW
    EXECUTE FUNCTION medical_human_leukocyte_and_disease_association_request.set_updated_at();

COMMENT ON TABLE medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_test IS
    'One requested HLA test (a ticked box): HLA-A29, B27, B51, B*57:01, DR15/DQ6, DQ2/DQ8, DQA1*05 or another HLA-disease association.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_test.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_test.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_test.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_test.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_test.request_id IS
    'Foreign key to the parent request.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_test.test_code IS
    'Requested test code.';
COMMENT ON COLUMN medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_test.test_detail IS
    'Free-text detail, for example the antigen when "other" is chosen.';

CREATE UNIQUE INDEX index_mhldar_test_request_id_test_code
    ON medical_human_leukocyte_and_disease_association_request.medical_human_leukocyte_and_disease_association_request_test(request_id, test_code) WHERE deleted_at IS NULL;
