CREATE TABLE IF NOT EXISTS "expense_reimbursement_items" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "line_number" integer NOT NULL,
    "expense_date" date NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "merchant" varchar NOT NULL DEFAULT '',
    "currency_as_iso_4217" varchar NOT NULL DEFAULT 'GBP',
    "amount" double precision NULL,
    "vat_amount" double precision NULL,
    "exchange_rate_to_claim_currency" double precision NULL,
    "payment_method" varchar NOT NULL DEFAULT '',
    "mileage_distance_miles" double precision NULL,
    "receipt_attached" boolean NOT NULL DEFAULT false,
    "receipt_reference" varchar NOT NULL DEFAULT '',
    "receipt_missing_reason" varchar NOT NULL DEFAULT '',
    "prior_approval_obtained" boolean NOT NULL DEFAULT false,
    "expense_reimbursement_id" uuid NOT NULL,
    CONSTRAINT "fk-expense_reimbursement_items-expense_reimbursement_id-to-expense_reimbursements" FOREIGN KEY ("expense_reimbursement_id") REFERENCES "expense_reimbursements" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE expense_reimbursement_items ALTER COLUMN id SET DEFAULT gen_random_uuid();
