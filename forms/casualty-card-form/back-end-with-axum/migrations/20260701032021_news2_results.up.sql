CREATE TABLE IF NOT EXISTS "news2_results" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "total_score" integer NOT NULL,
    "clinical_response" text NOT NULL DEFAULT '',
    "has_any_single_score_3" boolean NOT NULL DEFAULT false,
    "supplemental_oxygen" varchar NOT NULL,
    "scored_at" timestamp with time zone NOT NULL,
    "casualty_card_id" uuid NOT NULL,
    CONSTRAINT "fk-news2_results-casualty_card_id-to-casualty_cards" FOREIGN KEY ("casualty_card_id") REFERENCES "casualty_cards" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE news2_results ALTER COLUMN id SET DEFAULT gen_random_uuid();
