--liquibase formatted sql

--changeset author:1
-- LPA validation result — output of the LPA validator: the
-- registration-readiness band and the composite-risk grade computed
-- from the fired rules and additional flags. One row per LPA.

CREATE TABLE lpa_validation_result (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    lpa_id UUID NOT NULL UNIQUE REFERENCES lasting_power_of_attorney(id) ON DELETE CASCADE,
    validity_band TEXT NOT NULL DEFAULT '' CHECK (validity_band IN ('draft', 'ready_for_signing', 'partially_signed', 'fully_signed', 'ready_for_registration', 'submitted', 'registered', 'rejected')),
    composite_risk TEXT NOT NULL DEFAULT '' CHECK (composite_risk IN ('low', 'moderate', 'high', 'critical')),
    computed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
--rollback DROP TABLE lpa_validation_result;

--changeset author:2
CREATE TRIGGER trigger_lpa_validation_result_updated_at
    BEFORE UPDATE ON lpa_validation_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
--rollback DROP TRIGGER IF EXISTS trigger_lpa_validation_result_updated_at ON lpa_validation_result;

--changeset author:3
COMMENT ON TABLE lpa_validation_result IS
    'LPA validation result — the LPA validator output: registration-readiness band and composite-risk grade.';
COMMENT ON COLUMN lpa_validation_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lpa_validation_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lpa_validation_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lpa_validation_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lpa_validation_result.lpa_id IS
    'Foreign key to the lasting_power_of_attorney table; UNIQUE so only one validation result per LPA; cascades on delete.';
COMMENT ON COLUMN lpa_validation_result.validity_band IS
    'Lifecycle band for registration readiness. One of: draft, ready_for_signing, partially_signed, fully_signed, ready_for_registration, submitted, registered, rejected.';
COMMENT ON COLUMN lpa_validation_result.composite_risk IS
    'Overall risk grade computed by max-grade aggregation across fired rules and flags. One of: low, moderate, high, critical.';
COMMENT ON COLUMN lpa_validation_result.computed_at IS
    'Timestamp when this validation result was computed.';
--rollback SELECT 1;
