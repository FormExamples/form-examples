CREATE TABLE product (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    supplier_id UUID NOT NULL REFERENCES supplier(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    intended_purpose TEXT NOT NULL DEFAULT '',
    product_type TEXT NOT NULL DEFAULT '' CHECK (product_type IN ('app','web-service','software-as-a-service','wearable-integrated','clinical-decision-support','remote-monitoring','other','')),
    medical_device_class TEXT NOT NULL DEFAULT '' CHECK (medical_device_class IN ('not-a-medical-device','class-i','class-iia','class-iib','class-iii','unknown','')),
    handles_patient_data TEXT NOT NULL DEFAULT '' CHECK (handles_patient_data IN ('yes','no','')),
    is_patient_facing TEXT NOT NULL DEFAULT '' CHECK (is_patient_facing IN ('yes','no',''))
);

CREATE INDEX index_product_supplier_id ON product(supplier_id);

CREATE TRIGGER trigger_product_updated_at
    BEFORE UPDATE ON product
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE product IS
    'Digital health technology product under assessment.';
COMMENT ON COLUMN product.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN product.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN product.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN product.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN product.supplier_id IS
    'Foreign key to the supplier table.';
COMMENT ON COLUMN product.name IS
    'Product name.';
COMMENT ON COLUMN product.version IS
    'Product version or release assessed.';
COMMENT ON COLUMN product.description IS
    'Short description of the product.';
COMMENT ON COLUMN product.intended_purpose IS
    'Intended purpose as stated by the supplier.';
COMMENT ON COLUMN product.product_type IS
    'Kind of digital health technology.';
COMMENT ON COLUMN product.medical_device_class IS
    'UK MDR 2002 medical device classification.';
COMMENT ON COLUMN product.handles_patient_data IS
    'Whether the product processes patient-identifiable data.';
COMMENT ON COLUMN product.is_patient_facing IS
    'Whether patients or the public use the product directly.';
