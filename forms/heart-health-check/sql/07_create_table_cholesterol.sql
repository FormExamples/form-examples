CREATE TABLE heart_health_check.cholesterol (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES heart_health_check.assessment(id) ON DELETE CASCADE,
    total_cholesterol NUMERIC(5, 2)
        CHECK (total_cholesterol IS NULL OR (total_cholesterol >= 0 AND total_cholesterol <= 20)),
    hdl_cholesterol NUMERIC(5, 2)
        CHECK (hdl_cholesterol IS NULL OR (hdl_cholesterol >= 0 AND hdl_cholesterol <= 10)),
    total_hdl_ratio NUMERIC(5, 2)
        CHECK (total_hdl_ratio IS NULL OR (total_hdl_ratio >= 0 AND total_hdl_ratio <= 30)),
    on_statin VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (on_statin IN ('yes', 'no', ''))
);

CREATE TRIGGER trigger_cholesterol_updated_at
    BEFORE UPDATE ON heart_health_check.cholesterol
    FOR EACH ROW
    EXECUTE FUNCTION heart_health_check.set_updated_at();

COMMENT ON TABLE heart_health_check.cholesterol IS
    'Cholesterol lipid profile and statin therapy status.';
COMMENT ON COLUMN heart_health_check.cholesterol.total_cholesterol IS
    'Total cholesterol in mmol/L.';
COMMENT ON COLUMN heart_health_check.cholesterol.hdl_cholesterol IS
    'HDL cholesterol in mmol/L.';
COMMENT ON COLUMN heart_health_check.cholesterol.total_hdl_ratio IS
    'TC/HDL ratio (can be overridden or calculated).';
COMMENT ON COLUMN heart_health_check.cholesterol.on_statin IS
    'Whether the patient is currently on statin therapy.';

COMMENT ON COLUMN heart_health_check.cholesterol.assessment_id IS
    'Foreign key to the assessment table.';
COMMENT ON COLUMN heart_health_check.cholesterol.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN heart_health_check.cholesterol.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN heart_health_check.cholesterol.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN heart_health_check.cholesterol.deleted_at IS
    'Timestamp when this row was deleted.';
