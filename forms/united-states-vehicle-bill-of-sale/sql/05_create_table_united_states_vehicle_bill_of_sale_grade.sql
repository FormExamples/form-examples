-- Computed completeness and risk classification for a United States vehicle
-- bill of sale. The engine classifies the sale as complete, incomplete, or
-- risk-flagged, and records whether the federal odometer disclosure is exempt
-- under 49 CFR 580.17. This is a documentation classification, not a numeric
-- score, and it is not legal advice: the state motor vehicle agency decides.

CREATE TABLE united_states_vehicle_bill_of_sale_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_states_vehicle_bill_of_sale_id UUID NOT NULL UNIQUE
        REFERENCES united_states_vehicle_bill_of_sale(id) ON DELETE CASCADE,

    completeness_class VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (completeness_class IN ('complete', 'incomplete', 'risk-flagged', '')),
    odometer_disclosure_exempt VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (odometer_disclosure_exempt IN ('yes', 'no', '')),
    state_rule_known VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (state_rule_known IN ('yes', 'no', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_united_states_vehicle_bill_of_sale_grade_updated_at
    BEFORE UPDATE ON united_states_vehicle_bill_of_sale_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE united_states_vehicle_bill_of_sale_grade IS
    'Computed completeness and risk classification for a vehicle bill of sale: complete, incomplete, or risk-flagged; whether the federal odometer disclosure is exempt; and whether the state rule was in the engine table.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale_grade.united_states_vehicle_bill_of_sale_id IS
    'Foreign key to the parent bill of sale (unique, 1:1).';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale_grade.completeness_class IS
    'Classification: complete, incomplete, or risk-flagged (risk-flagged takes precedence over incomplete).';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale_grade.odometer_disclosure_exempt IS
    'Whether the federal odometer disclosure is exempt under 49 CFR 580.17 (yes/no).';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale_grade.state_rule_known IS
    'Whether the state rule was found in the engine STATE_RULES table (yes) or the uniform default was used (no).';
COMMENT ON COLUMN united_states_vehicle_bill_of_sale_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
