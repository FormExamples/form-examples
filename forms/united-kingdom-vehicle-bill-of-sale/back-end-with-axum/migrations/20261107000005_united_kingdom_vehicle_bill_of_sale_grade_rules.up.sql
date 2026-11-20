CREATE TABLE IF NOT EXISTS "united_kingdom_vehicle_bill_of_sale_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "united_kingdom_vehicle_bill_of_sale_grade_id" uuid NOT NULL,
    "rule_id" varchar NOT NULL,
    "dimension" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-082dc125bbe5fefccfcd16237c3f3b7b" FOREIGN KEY ("united_kingdom_vehicle_bill_of_sale_grade_id") REFERENCES "united_kingdom_vehicle_bill_of_sale_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE united_kingdom_vehicle_bill_of_sale_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
