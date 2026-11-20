CREATE TABLE IF NOT EXISTS "united_states_vehicle_bill_of_sale_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "completeness_class" varchar NOT NULL DEFAULT '',
    "odometer_disclosure_exempt" text NOT NULL DEFAULT '',
    "state_rule_known" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "united_states_vehicle_bill_of_sale_id" uuid NOT NULL,
    CONSTRAINT "fk-united_states_vehicle_bill_of_sale_grades-united_states_vehicle_bill_of_sale_id-to-united_states_vehicle_bill_of_sales" FOREIGN KEY ("united_states_vehicle_bill_of_sale_id") REFERENCES "united_states_vehicle_bill_of_sales" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE united_states_vehicle_bill_of_sale_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
