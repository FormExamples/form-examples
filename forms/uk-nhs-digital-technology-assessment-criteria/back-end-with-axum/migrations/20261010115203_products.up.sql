CREATE TABLE IF NOT EXISTS "products" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" text NOT NULL,
    "version" text NOT NULL DEFAULT '',
    "description" text NOT NULL DEFAULT '',
    "intended_purpose" text NOT NULL DEFAULT '',
    "product_type" text NOT NULL DEFAULT '',
    "medical_device_class" text NOT NULL DEFAULT '',
    "handles_patient_data" text NOT NULL DEFAULT '',
    "is_patient_facing" text NOT NULL DEFAULT '',
    "supplier_id" uuid NOT NULL,
    CONSTRAINT "fk-products-supplier_id-to-suppliers" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE products ALTER COLUMN id SET DEFAULT gen_random_uuid();
