CREATE TABLE IF NOT EXISTS "x_ray_test_result_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "x_ray_test_result_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-x_ray_test_result_grade_flags-x_ray_test_result_grade_id-to-x_ray_test_result_grades" FOREIGN KEY ("x_ray_test_result_grade_id") REFERENCES "x_ray_test_result_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE x_ray_test_result_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
