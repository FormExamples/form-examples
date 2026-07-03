CREATE TABLE outpatient_outcome_prom_promis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    outpatient_outcome_id UUID NOT NULL UNIQUE
        REFERENCES outpatient_outcome(id) ON DELETE CASCADE,

    -- 10 items, each Likert 1..5 (physical) or 1..5 (mental). Null when unanswered.
    -- Items 1-4 feed Global Physical Health (GPH); items 5-10 feed Global Mental Health (GMH).
    item1_general_health SMALLINT CHECK (item1_general_health BETWEEN 1 AND 5),
    item2_quality_of_life SMALLINT CHECK (item2_quality_of_life BETWEEN 1 AND 5),
    item3_physical_health SMALLINT CHECK (item3_physical_health BETWEEN 1 AND 5),
    item4_mental_health SMALLINT CHECK (item4_mental_health BETWEEN 1 AND 5),
    item5_social_activities SMALLINT CHECK (item5_social_activities BETWEEN 1 AND 5),
    item6_carry_out_physical SMALLINT CHECK (item6_carry_out_physical BETWEEN 1 AND 5),
    item7_emotional_problems SMALLINT CHECK (item7_emotional_problems BETWEEN 1 AND 5),
    item8_fatigue SMALLINT CHECK (item8_fatigue BETWEEN 1 AND 5),
    item9_pain SMALLINT CHECK (item9_pain BETWEEN 0 AND 10),
    item10_everyday_activities SMALLINT CHECK (item10_everyday_activities BETWEEN 1 AND 5),

    -- T-scores (mean 50, sd 10); null when unknown.
    global_physical_health_t_score NUMERIC(5,2),
    global_mental_health_t_score NUMERIC(5,2)
);

CREATE TRIGGER trigger_outpatient_outcome_prom_promis_updated_at
    BEFORE UPDATE ON outpatient_outcome_prom_promis
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE outpatient_outcome_prom_promis IS
    'PROMIS Global Health Short Form v1.2 responses (10 items) and derived GPH/GMH T-scores. Public domain (NIH-funded). Scaffold uses linear approximation; production use requires official IRT calibration tables.';
COMMENT ON COLUMN outpatient_outcome_prom_promis.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN outpatient_outcome_prom_promis.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN outpatient_outcome_prom_promis.updated_at IS
    'Timestamp when this row was updated most-recently.';
COMMENT ON COLUMN outpatient_outcome_prom_promis.deleted_at IS
    'Timestamp when this row was deleted i.e. soft-removed.';
COMMENT ON COLUMN outpatient_outcome_prom_promis.outpatient_outcome_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN outpatient_outcome_prom_promis.item1_general_health IS
    'PROMIS item 1: general health (1 poor - 5 excellent).';
COMMENT ON COLUMN outpatient_outcome_prom_promis.item2_quality_of_life IS
    'PROMIS item 2: quality of life (1 poor - 5 excellent).';
COMMENT ON COLUMN outpatient_outcome_prom_promis.item3_physical_health IS
    'PROMIS item 3: physical health (1 poor - 5 excellent).';
COMMENT ON COLUMN outpatient_outcome_prom_promis.item4_mental_health IS
    'PROMIS item 4: mental health (1 poor - 5 excellent).';
COMMENT ON COLUMN outpatient_outcome_prom_promis.item5_social_activities IS
    'PROMIS item 5: satisfaction with social activities.';
COMMENT ON COLUMN outpatient_outcome_prom_promis.item6_carry_out_physical IS
    'PROMIS item 6: ability to carry out physical activities.';
COMMENT ON COLUMN outpatient_outcome_prom_promis.item7_emotional_problems IS
    'PROMIS item 7: how often bothered by emotional problems (reverse scored in UI).';
COMMENT ON COLUMN outpatient_outcome_prom_promis.item8_fatigue IS
    'PROMIS item 8: fatigue (reverse scored).';
COMMENT ON COLUMN outpatient_outcome_prom_promis.item9_pain IS
    'PROMIS item 9: pain 0-10 numeric rating (reverse scored).';
COMMENT ON COLUMN outpatient_outcome_prom_promis.item10_everyday_activities IS
    'PROMIS item 10: ability to carry out everyday activities.';
COMMENT ON COLUMN outpatient_outcome_prom_promis.global_physical_health_t_score IS
    'Derived Global Physical Health T-score (mean 50, SD 10).';
COMMENT ON COLUMN outpatient_outcome_prom_promis.global_mental_health_t_score IS
    'Derived Global Mental Health T-score (mean 50, SD 10).';
