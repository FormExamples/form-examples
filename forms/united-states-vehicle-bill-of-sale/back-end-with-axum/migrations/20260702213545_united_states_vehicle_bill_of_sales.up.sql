CREATE TABLE IF NOT EXISTS "united_states_vehicle_bill_of_sales" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "seller_id" uuid NOT NULL,
    "buyer_id" uuid NULL,
    CONSTRAINT "fk-united_states_vehicle_bill_of_sales-seller_id-to-sellers" FOREIGN KEY ("seller_id") REFERENCES "sellers" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-united_states_vehicle_bill_of_sales-buyer_id-to-buyers" FOREIGN KEY ("buyer_id") REFERENCES "buyers" (id) ON DELETE SET NULL ON UPDATE NO ACTION
);

ALTER TABLE united_states_vehicle_bill_of_sales ALTER COLUMN id SET DEFAULT gen_random_uuid();
