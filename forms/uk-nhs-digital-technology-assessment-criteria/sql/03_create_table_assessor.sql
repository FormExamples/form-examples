CREATE TABLE uk_nhs_digital_technology_assessment_criteria.assessor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    organisation TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT '' CHECK (role IN ('commissioner','procurement-lead','clinical-safety-officer','information-governance-lead','information-security-lead','digital-lead','other',''))
);

CREATE INDEX index_assessor_name_trgm ON uk_nhs_digital_technology_assessment_criteria.assessor USING GIN (name gin_trgm_ops);

CREATE TRIGGER trigger_assessor_updated_at
    BEFORE UPDATE ON uk_nhs_digital_technology_assessment_criteria.assessor
    FOR EACH ROW
    EXECUTE FUNCTION uk_nhs_digital_technology_assessment_criteria.set_updated_at();

COMMENT ON TABLE uk_nhs_digital_technology_assessment_criteria.assessor IS
    'Person carrying out the DTAC assessment on behalf of an NHS or care organisation.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.assessor.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.assessor.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.assessor.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.assessor.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.assessor.name IS
    'Name of the assessor.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.assessor.email IS
    'Email address.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.assessor.phone IS
    'Telephone number.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.assessor.organisation IS
    'Commissioning or assuring organisation the assessor works for.';
COMMENT ON COLUMN uk_nhs_digital_technology_assessment_criteria.assessor.role IS
    'Assessor role.';
