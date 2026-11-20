CREATE TABLE sleep_quality_assessment.grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    assessment_id UUID NOT NULL UNIQUE
        REFERENCES sleep_quality_assessment.assessment(id) ON DELETE CASCADE,
    psqi_global_score INTEGER
        CHECK (psqi_global_score IS NULL OR (psqi_global_score >= 0 AND psqi_global_score <= 21)),
    psqi_component1_subjective_quality INTEGER
        CHECK (psqi_component1_subjective_quality IS NULL OR (psqi_component1_subjective_quality >= 0 AND psqi_component1_subjective_quality <= 3)),
    psqi_component2_sleep_latency INTEGER
        CHECK (psqi_component2_sleep_latency IS NULL OR (psqi_component2_sleep_latency >= 0 AND psqi_component2_sleep_latency <= 3)),
    psqi_component3_sleep_duration INTEGER
        CHECK (psqi_component3_sleep_duration IS NULL OR (psqi_component3_sleep_duration >= 0 AND psqi_component3_sleep_duration <= 3)),
    psqi_component4_sleep_efficiency INTEGER
        CHECK (psqi_component4_sleep_efficiency IS NULL OR (psqi_component4_sleep_efficiency >= 0 AND psqi_component4_sleep_efficiency <= 3)),
    psqi_component5_sleep_disturbances INTEGER
        CHECK (psqi_component5_sleep_disturbances IS NULL OR (psqi_component5_sleep_disturbances >= 0 AND psqi_component5_sleep_disturbances <= 3)),
    psqi_component6_sleep_medication INTEGER
        CHECK (psqi_component6_sleep_medication IS NULL OR (psqi_component6_sleep_medication >= 0 AND psqi_component6_sleep_medication <= 3)),
    psqi_component7_daytime_dysfunction INTEGER
        CHECK (psqi_component7_daytime_dysfunction IS NULL OR (psqi_component7_daytime_dysfunction >= 0 AND psqi_component7_daytime_dysfunction <= 3)),
    sleep_quality_category VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (sleep_quality_category IN ('good', 'poor', 'very_poor', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON sleep_quality_assessment.grade
    FOR EACH ROW
    EXECUTE FUNCTION sleep_quality_assessment.set_updated_at();

COMMENT ON TABLE sleep_quality_assessment.grade IS
    'Computed PSQI sleep quality grading result with 7 component scores. One-to-one child of assessment.';
COMMENT ON COLUMN sleep_quality_assessment.grade.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN sleep_quality_assessment.grade.psqi_global_score IS
    'PSQI global score (0-21); 0-5 good, 6-10 poor, 11-21 very poor sleep quality.';
COMMENT ON COLUMN sleep_quality_assessment.grade.psqi_component1_subjective_quality IS
    'PSQI Component 1: subjective sleep quality (0-3).';
COMMENT ON COLUMN sleep_quality_assessment.grade.psqi_component2_sleep_latency IS
    'PSQI Component 2: sleep latency (0-3).';
COMMENT ON COLUMN sleep_quality_assessment.grade.psqi_component3_sleep_duration IS
    'PSQI Component 3: sleep duration (0-3).';
COMMENT ON COLUMN sleep_quality_assessment.grade.psqi_component4_sleep_efficiency IS
    'PSQI Component 4: habitual sleep efficiency (0-3).';
COMMENT ON COLUMN sleep_quality_assessment.grade.psqi_component5_sleep_disturbances IS
    'PSQI Component 5: sleep disturbances (0-3).';
COMMENT ON COLUMN sleep_quality_assessment.grade.psqi_component6_sleep_medication IS
    'PSQI Component 6: use of sleeping medication (0-3).';
COMMENT ON COLUMN sleep_quality_assessment.grade.psqi_component7_daytime_dysfunction IS
    'PSQI Component 7: daytime dysfunction (0-3).';
COMMENT ON COLUMN sleep_quality_assessment.grade.sleep_quality_category IS
    'Sleep quality category: good (0-5), poor (6-10), very_poor (11-21), or empty string if not yet graded.';
COMMENT ON COLUMN sleep_quality_assessment.grade.graded_at IS
    'Timestamp when the grading was computed.';

COMMENT ON COLUMN sleep_quality_assessment.grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN sleep_quality_assessment.grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN sleep_quality_assessment.grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN sleep_quality_assessment.grade.deleted_at IS
    'Timestamp when this row was deleted.';
