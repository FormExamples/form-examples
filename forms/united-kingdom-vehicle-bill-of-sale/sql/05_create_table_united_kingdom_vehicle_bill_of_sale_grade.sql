-- Computed completeness classification for a vehicle bill of sale: complete,
-- incomplete, or risk-flagged, with the count of missing required items and of
-- risk conditions. It is a classification, not a numeric score, and it does not
-- decide ownership or legal rights.

CREATE TABLE united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_kingdom_vehicle_bill_of_sale_id UUID NOT NULL UNIQUE REFERENCES united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale(id) ON DELETE CASCADE,
    classification VARCHAR(12) NOT NULL DEFAULT '' CHECK (classification IN ('complete', 'incomplete', 'risk-flagged', '')),
    missing_item_count INTEGER,
    risk_flag_count INTEGER,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_united_kingdom_vehicle_bill_of_sale_grade_updated_at
    BEFORE UPDATE ON united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale_grade
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_vehicle_bill_of_sale.set_updated_at();

COMMENT ON TABLE united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale_grade IS
    'Computed completeness classification for a vehicle bill of sale: classification (complete/incomplete/risk-flagged), missing item count, and risk flag count.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale_grade.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale_grade.united_kingdom_vehicle_bill_of_sale_id IS
    'Foreign key to the parent bill of sale (unique, 1:1).';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale_grade.classification IS
    'Classification: complete, incomplete, or risk-flagged (risk-flagged takes precedence).';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale_grade.missing_item_count IS
    'Number of required items still missing.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale_grade.risk_flag_count IS
    'Number of risk conditions that hold.';
COMMENT ON COLUMN united_kingdom_vehicle_bill_of_sale.united_kingdom_vehicle_bill_of_sale_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
