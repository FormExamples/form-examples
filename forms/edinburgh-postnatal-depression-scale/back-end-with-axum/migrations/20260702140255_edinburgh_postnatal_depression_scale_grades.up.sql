CREATE TABLE IF NOT EXISTS "edinburgh_postnatal_depression_scale_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "total_score" integer NULL,
    "interpretation" varchar NOT NULL DEFAULT '',
    "item_10_score" integer NULL,
    "self_harm_flag" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "edinburgh_postnatal_depression_scale_id" uuid NOT NULL,
    CONSTRAINT "fk-edinburgh_postnatal_depression_scale_grades-edinburgh_postnatal_depression_scale_id-to-edinburgh_postnatal_depression_scales" FOREIGN KEY ("edinburgh_postnatal_depression_scale_id") REFERENCES "edinburgh_postnatal_depression_scales" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE edinburgh_postnatal_depression_scale_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
