CREATE TABLE IF NOT EXISTS "mental_state_examination_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "status" varchar NOT NULL DEFAULT '',
    "risk_level" varchar NOT NULL DEFAULT '',
    "completeness_percent" integer NULL,
    "appearance_behaviour_documented" varchar NOT NULL DEFAULT '',
    "speech_documented" varchar NOT NULL DEFAULT '',
    "emotion_documented" varchar NOT NULL DEFAULT '',
    "perception_documented" varchar NOT NULL DEFAULT '',
    "thought_documented" varchar NOT NULL DEFAULT '',
    "insight_documented" varchar NOT NULL DEFAULT '',
    "cognition_documented" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "mental_state_examination_id" uuid NOT NULL,
    CONSTRAINT "fk-mental_state_examination_grades-mental_state_examination_id-to-mental_state_examinations" FOREIGN KEY ("mental_state_examination_id") REFERENCES "mental_state_examinations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE mental_state_examination_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
