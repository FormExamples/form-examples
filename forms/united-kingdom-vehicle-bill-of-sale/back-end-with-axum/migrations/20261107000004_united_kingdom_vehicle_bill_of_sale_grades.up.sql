CREATE TABLE IF NOT EXISTS "united_kingdom_vehicle_bill_of_sale_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "united_kingdom_vehicle_bill_of_sale_id" uuid NOT NULL UNIQUE,
    "classification" varchar NOT NULL DEFAULT '',
    "missing_item_count" integer NULL,
    "risk_flag_count" integer NULL,
    "graded_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk-1031349ec5bd2d636a678430d3290e4e" FOREIGN KEY ("united_kingdom_vehicle_bill_of_sale_id") REFERENCES "united_kingdom_vehicle_bill_of_sales" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE united_kingdom_vehicle_bill_of_sale_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
